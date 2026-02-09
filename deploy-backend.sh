#!/bin/bash
# PatchPilot Backend Deployment Script for VPS
# Run this on your VPS after uploading/cloning the project

set -e

echo "🚀 PatchPilot Backend Deployment Script"
echo "========================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (sudo ./deploy-backend.sh)"
    exit 1
fi

# Get project directory
PROJECT_DIR="/var/www/Patchpilot"
BACKEND_DIR="$PROJECT_DIR/backend"

echo -e "${YELLOW}Step 1: Installing system dependencies...${NC}"
apt update && apt upgrade -y
apt install -y python3.11 python3.11-venv python3-pip nodejs ffmpeg git nginx || {
    echo "❌ Failed to install dependencies"
    exit 1
}

echo -e "${YELLOW}Step 2: Setting up Python virtual environment...${NC}"
cd "$BACKEND_DIR" || {
    echo "❌ Backend directory not found at $BACKEND_DIR"
    echo "   Please ensure project is at /var/www/Patchpilot"
    exit 1
}

python3.11 -m venv venv
source venv/bin/activate

echo -e "${YELLOW}Step 3: Installing Python dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt || {
    echo "❌ Failed to install Python dependencies"
    exit 1
}

echo -e "${YELLOW}Step 4: Installing Playwright browsers...${NC}"
npx playwright install chromium || {
    echo "⚠️  Playwright installation failed, but continuing..."
}

echo -e "${YELLOW}Step 5: Creating .env file...${NC}"
if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Gemini API Key (get from https://aistudio.google.com/apikey)
GOOGLE_API_KEY=your-gemini-api-key-here

# Backend port (use 8001 since 8000 is busy)
PORT=8001
EOF
    echo -e "${GREEN}✓ Created .env file. Please edit it and add your GOOGLE_API_KEY${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo -e "${YELLOW}Step 6: Creating systemd service...${NC}"
cat > /etc/systemd/system/patchpilot-backend.service << EOF
[Unit]
Description=PatchPilot Backend API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$BACKEND_DIR
Environment="PATH=$BACKEND_DIR/venv/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=$BACKEND_DIR/venv/bin/uvicorn app:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo -e "${YELLOW}Step 7: Enabling and starting service...${NC}"
systemctl daemon-reload
systemctl enable patchpilot-backend
systemctl start patchpilot-backend

echo -e "${YELLOW}Step 8: Checking service status...${NC}"
sleep 2
if systemctl is-active --quiet patchpilot-backend; then
    echo -e "${GREEN}✓ Service is running!${NC}"
    echo ""
    echo "📋 Next steps:"
    echo "1. Edit $BACKEND_DIR/.env and add your GOOGLE_API_KEY"
    echo "2. Edit $BACKEND_DIR/app.py and add your frontend URL to CORS allow_origins"
    echo "3. Restart service: sudo systemctl restart patchpilot-backend"
    echo "4. Check logs: sudo journalctl -u patchpilot-backend -f"
    echo "5. Test: curl http://localhost:8001/health"
    echo ""
    echo "🌐 Backend should be accessible at: http://$(hostname -I | awk '{print $1}'):8001"
else
    echo -e "${YELLOW}⚠️  Service may not be running. Check logs:${NC}"
    echo "   sudo journalctl -u patchpilot-backend -n 50"
fi

echo ""
echo -e "${GREEN}✅ Deployment script completed!${NC}"
