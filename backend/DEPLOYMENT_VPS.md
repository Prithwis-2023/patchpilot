# Quick VPS Deployment Checklist

## Prerequisites
- VPS with root/SSH access
- Domain name (optional, can use IP)
- Gemini API key

## Quick Setup Script

Run these commands on your VPS:

```bash
#!/bin/bash

# 1. Install dependencies
apt update && apt upgrade -y
apt install -y python3.11 python3.11-venv python3-pip nodejs ffmpeg git nginx

# 2. Clone/upload project
cd /var/www
# git clone your-repo OR upload via SCP

# 3. Setup backend
cd Patchpilot/backend
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
npx playwright install chromium

# 4. Create .env
cat > .env << EOF
GOOGLE_API_KEY=your-api-key-here
PORT=8001
CORS_ALLOWED_ORIGINS=https://patchpilot-frontend-beta.vercel.app
EOF

# 5. Create systemd service
cat > /etc/systemd/system/patchpilot-backend.service << 'EOF'
[Unit]
Description=PatchPilot Backend API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/Patchpilot/backend
Environment="PATH=/var/www/Patchpilot/backend/venv/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/var/www/Patchpilot/backend/venv/bin/uvicorn app:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 6. Enable and start
systemctl daemon-reload
systemctl enable patchpilot-backend
systemctl start patchpilot-backend

# 7. Check status
systemctl status patchpilot-backend
```

## Update CORS

Edit `backend/app.py` and add your Vercel URL to `allow_origins`.

## Test

```bash
curl http://localhost:8001/health
# Should return: {"ok":true}
```

## Access from outside

- Direct: `http://your-vps-ip:8001`
- With Nginx: `http://your-vps-ip` (port 80)
