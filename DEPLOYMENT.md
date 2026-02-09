# PatchPilot Deployment Guide

## Overview

This guide covers deploying PatchPilot with:
- **Frontend (Next.js)**: Deploy to Vercel (recommended) or VPS
- **Backend (Python FastAPI)**: Deploy to VPS (requires Python, Node.js, Playwright)

---

## Option 1: Vercel (Frontend) + VPS (Backend) ⭐ RECOMMENDED

### Why This Approach?
- ✅ Vercel: Free, fast CDN, automatic HTTPS, zero config
- ✅ VPS: Full control for Python backend with Playwright
- ✅ Best performance and reliability

---

## Part A: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. **Create `.env.production` in `/frontend`** (optional, can use Vercel dashboard):
```env
NEXT_PUBLIC_BACKEND_URL=https://your-vps-domain.com:8001
NEXT_PUBLIC_PIPELINE_MODE=backend
```

2. **Verify build works**:
```bash
cd frontend
pnpm install
pnpm build
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (if not installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from frontend directory**:
```bash
cd frontend
vercel
```

4. **Follow prompts**:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No** (first time)
   - Project name? **patchpilot-frontend** (or your choice)
   - Directory? **./** (current directory)
   - Override settings? **No**

5. **Add Environment Variables in Vercel Dashboard**:
   - Go to: https://vercel.com/your-project/settings/environment-variables
   - Add:
     - `NEXT_PUBLIC_BACKEND_URL` = `https://your-vps-domain.com:8001`
     - `NEXT_PUBLIC_PIPELINE_MODE` = `backend`

6. **Redeploy** (after adding env vars):
```bash
vercel --prod
```

7. **Get your frontend URL**: `https://patchpilot-frontend.vercel.app` (or your custom domain)

---

## Part B: Deploy Backend to VPS

### Step 1: Connect to VPS

```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

### Step 2: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Python 3.11+ and pip
apt install -y python3.11 python3.11-venv python3-pip

# Install Node.js 18+ (for Playwright)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install FFmpeg (for video processing)
apt install -y ffmpeg

# Install Git
apt install -y git

# Install Nginx (for reverse proxy - optional but recommended)
apt install -y nginx
```

### Step 3: Clone and Setup Project

```bash
# Navigate to your projects directory
cd /var/www  # or wherever you keep projects

# Clone your repo (or upload via SCP/SFTP)
git clone https://github.com/your-username/Patchpilot.git
cd Patchpilot

# Or if you have the code locally, upload via SCP:
# scp -r /path/to/Patchpilot root@your-vps-ip:/var/www/
```

### Step 4: Setup Python Backend

```bash
cd /var/www/Patchpilot/backend

# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Install Playwright browsers
npx playwright install chromium
```

### Step 5: Create Environment File

```bash
cd /var/www/Patchpilot/backend
nano .env
```

Add your environment variables:
```env
# Gemini API Key (get from https://aistudio.google.com/apikey)
GOOGLE_API_KEY=your-gemini-api-key-here

# Backend port (default 8000, but use 8001 since 8000 is busy)
PORT=8001

# CORS Allowed Origins (comma or space-separated)
# Include your frontend URL(s) here
CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app,https://your-custom-domain.com

# Optional: Upload directory (default: temp)
# UPLOAD_DIR=temp
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### Step 6: Configure CORS via Environment Variables

**No need to edit `app.py` anymore!** CORS origins are now read from environment variables.

Add to your `.env` file:
```env
CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app,https://your-custom-domain.com
```

Or if frontend is also on VPS:
```env
CORS_ALLOWED_ORIGINS=http://your-vps-domain.com:3002,https://your-custom-domain.com
```

**Note:** Localhost origins are included by default for development. You only need to add production URLs.

### Step 7: Create Systemd Service (Recommended)

```bash
sudo nano /etc/systemd/system/patchpilot-backend.service
```

Add this content:
```ini
[Unit]
Description=PatchPilot Backend API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/Patchpilot/backend
Environment="PATH=/var/www/Patchpilot/backend/venv/bin:/usr/local/bin:/usr/bin:/bin"
# Environment variables can be set here or loaded from .env file
# Option 1: Set in systemd (recommended for production)
# Environment="GOOGLE_API_KEY=your-key"
# Environment="PORT=8001"
# Environment="CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app"
# Option 2: Use .env file (python-dotenv will load it automatically)
ExecStart=/var/www/Patchpilot/backend/start.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Note:** 
- The `start.sh` script reads `PORT` from environment (defaults to 8000)
- Make sure `start.sh` is executable: `chmod +x /var/www/Patchpilot/backend/start.sh`
- Environment variables can be set in systemd service file OR in `.env` file
- System environment variables take precedence over `.env` file

Save and enable:
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (start on boot)
sudo systemctl enable patchpilot-backend

# Start service
sudo systemctl start patchpilot-backend

# Check status
sudo systemctl status patchpilot-backend

# View logs
sudo journalctl -u patchpilot-backend -f
```

### Step 8: Setup Nginx Reverse Proxy (Optional but Recommended)

This allows you to use port 80/443 instead of 8001, and add SSL.

```bash
sudo nano /etc/nginx/sites-available/patchpilot-backend
```

Add:
```nginx
server {
    listen 80;
    server_name your-vps-domain.com api.your-vps-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for large file uploads
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        client_max_body_size 500M;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/patchpilot-backend /etc/nginx/sites-enabled/
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

### Step 9: Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-vps-domain.com -d api.your-vps-domain.com

# Auto-renewal is automatic, but test:
sudo certbot renew --dry-run
```

---

## Part C: Update Frontend Environment Variables

After backend is running, update Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_BACKEND_URL`:
   - If using Nginx: `https://your-vps-domain.com` or `https://api.your-vps-domain.com`
   - If direct: `http://your-vps-ip:8001` (or `https://` if you have SSL)
3. Redeploy: `vercel --prod` or trigger from dashboard

---

## Option 2: Everything on VPS (Alternative)

If you prefer everything on VPS:

### Frontend on VPS

```bash
cd /var/www/Patchpilot/frontend

# Install dependencies
pnpm install

# Build
pnpm build

# Create systemd service
sudo nano /etc/systemd/system/patchpilot-frontend.service
```

Service file:
```ini
[Unit]
Description=PatchPilot Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/Patchpilot/frontend
Environment="NODE_ENV=production"
Environment="NEXT_PUBLIC_BACKEND_URL=http://localhost:8001"
Environment="NEXT_PUBLIC_PIPELINE_MODE=backend"
ExecStart=/usr/bin/node node_modules/.bin/next start -p 3002
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable patchpilot-frontend
sudo systemctl start patchpilot-frontend
```

### Nginx for Frontend

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Troubleshooting

### Backend not starting?
```bash
# Check logs
sudo journalctl -u patchpilot-backend -n 50

# Check if port is in use
sudo netstat -tulpn | grep 8001

# Test manually
cd /var/www/Patchpilot/backend
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8001
```

### Playwright not working?
```bash
cd /var/www/Patchpilot/backend
source venv/bin/activate
npx playwright install chromium
npx playwright install-deps chromium
```

### CORS errors?
- Check `app.py` CORS origins include your frontend URL
- Check backend is accessible: `curl http://your-vps-ip:8001/health`

### Frontend build fails?
```bash
cd frontend
rm -rf .next node_modules
pnpm install
pnpm build
```

---

## Port Summary

Based on your busy ports (3000, 4000, 8000, maybe 3001):

- **Backend**: Use **8001** (or 5000, 8080, 9000)
- **Frontend (if on VPS)**: Use **3002** (or 3003, 5000)
- **Nginx**: 80 (HTTP), 443 (HTTPS)

---

## Quick Commands Reference

```bash
# Backend service
sudo systemctl status patchpilot-backend
sudo systemctl restart patchpilot-backend
sudo journalctl -u patchpilot-backend -f

# Frontend service (if on VPS)
sudo systemctl status patchpilot-frontend
sudo systemctl restart patchpilot-frontend

# Nginx
sudo nginx -t
sudo systemctl restart nginx

# Check ports
sudo netstat -tulpn | grep LISTEN
```

---

## Security Checklist

- [ ] Change default SSH port (optional)
- [ ] Setup firewall (UFW): `ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable`
- [ ] Use strong passwords or SSH keys
- [ ] Keep system updated: `apt update && apt upgrade`
- [ ] Use SSL/HTTPS (Let's Encrypt)
- [ ] Don't expose backend port directly (use Nginx reverse proxy)
- [ ] Keep API keys in `.env` (never commit to git)

---

## Next Steps

1. Deploy frontend to Vercel
2. Deploy backend to VPS
3. Test: Visit your Vercel URL and try the workflow
4. Monitor logs: `sudo journalctl -u patchpilot-backend -f`
5. Setup custom domain (optional)

Good luck! 🚀
