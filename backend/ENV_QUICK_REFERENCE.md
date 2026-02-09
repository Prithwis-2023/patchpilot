# Environment Variables Quick Reference

## How to Set Environment Variables

### Method 1: `.env` File (Easiest)

Create `backend/.env`:
```env
GOOGLE_API_KEY=your-api-key-here
PORT=8001
CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app
```

The app automatically loads this file on startup.

### Method 2: Systemd Service File

Edit `/etc/systemd/system/patchpilot-backend.service`:
```ini
[Service]
Environment="GOOGLE_API_KEY=your-api-key"
Environment="PORT=8001"
Environment="CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app"
```

Then restart:
```bash
sudo systemctl daemon-reload
sudo systemctl restart patchpilot-backend
```

### Method 3: Export in Shell

```bash
export GOOGLE_API_KEY=your-api-key
export PORT=8001
export CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app
uvicorn app:app --host 0.0.0.0 --port 8001
```

## Variable Reference

| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| `GOOGLE_API_KEY` | ✅ Yes | None | `AIzaSy...` |
| `PORT` | No | `8000` | `8001` |
| `CORS_ALLOWED_ORIGINS` | No | Localhost only | `https://example.com,https://another.com` |
| `UPLOAD_DIR` | No | `temp` | `/var/www/uploads` |

## CORS Format

- **Comma-separated**: `CORS_ALLOWED_ORIGINS=https://site1.com,https://site2.com`
- **Space-separated**: `CORS_ALLOWED_ORIGINS=https://site1.com https://site2.com`
- **Localhost is always included** - no need to add it

## Testing

After setting variables, test:
```bash
# Check if backend starts
cd backend
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8001

# In another terminal, test CORS
curl -H "Origin: https://your-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://localhost:8001/health
```
