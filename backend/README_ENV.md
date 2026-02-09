# Environment Variables for PatchPilot Backend

## Required Variables

### `GOOGLE_API_KEY`
- **Description**: Your Gemini API key from Google AI Studio
- **Required**: Yes
- **Example**: `GOOGLE_API_KEY=AIzaSy...`
- **Get it from**: https://aistudio.google.com/apikey

## Optional Variables

### `PORT`
- **Description**: Port number for the FastAPI backend server
- **Default**: `8000`
- **Example**: `PORT=8001`
- **Note**: Use a different port if 8000 is already in use

### `CORS_ALLOWED_ORIGINS`
- **Description**: Comma or space-separated list of allowed frontend URLs
- **Default**: Localhost URLs (3000, 3001) are included automatically
- **Format**: `CORS_ALLOWED_ORIGINS="https://example.com,https://another.com"`
- **Example**: 
  ```env
  CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app,https://your-domain.com
  ```
- **Note**: 
  - Localhost origins are always included for development
  - Only add production URLs here
  - No need to include localhost URLs

### `UPLOAD_DIR`
- **Description**: Directory for storing uploaded video files
- **Default**: `temp`
- **Example**: `UPLOAD_DIR=/var/www/uploads`
- **Note**: Ensure the directory exists and is writable

## Setting Environment Variables

### Method 1: `.env` File (Recommended for Development)

Create a `.env` file in the `backend/` directory:

```env
GOOGLE_API_KEY=your-api-key-here
PORT=8001
CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app
```

The `python-dotenv` library will automatically load this file when the app starts.

### Method 2: System Environment Variables (Recommended for Production)

Set environment variables in your systemd service file:

```ini
[Service]
Environment="GOOGLE_API_KEY=your-api-key"
Environment="PORT=8001"
Environment="CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app"
```

Or export them in your shell:
```bash
export GOOGLE_API_KEY=your-api-key
export PORT=8001
export CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app
```

### Method 3: Both `.env` and System Variables

System environment variables take precedence over `.env` file values.

## Example `.env` File

```env
# Required
GOOGLE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567890

# Optional - Backend Configuration
PORT=8001

# Optional - CORS Configuration
# Add your frontend URL(s) here (comma or space-separated)
CORS_ALLOWED_ORIGINS=https://patchpilot-frontend.vercel.app,https://patchpilot.com

# Optional - Upload Directory
# UPLOAD_DIR=temp
```

## Testing Environment Variables

After setting environment variables, test that they're loaded:

```bash
# Start the backend
cd backend
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8001

# Check CORS origins are loaded (in logs or via /health endpoint)
# The app will print allowed origins on startup
```

## Troubleshooting

### CORS errors still happening?
1. Check that `CORS_ALLOWED_ORIGINS` includes your exact frontend URL (with protocol: `https://`)
2. Ensure no trailing slashes in URLs
3. Restart the backend after changing `.env` file
4. Check logs: `sudo journalctl -u patchpilot-backend -f`

### Environment variables not loading?
1. Ensure `.env` file is in `backend/` directory
2. Check file permissions: `chmod 600 .env`
3. Verify `python-dotenv` is installed: `pip list | grep python-dotenv`
4. For systemd, ensure `Environment=` lines are in the `[Service]` section

### Port conflicts?
1. Check what's using the port: `sudo netstat -tulpn | grep 8001`
2. Change `PORT` in `.env` or systemd service
3. Update systemd `ExecStart` to use the new port
4. Restart service: `sudo systemctl restart patchpilot-backend`
