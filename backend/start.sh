#!/bin/bash
# Startup script for PatchPilot backend
# Reads PORT from environment or uses default 8000

PORT=${PORT:-8000}
HOST=${HOST:-0.0.0.0}

echo "Starting PatchPilot backend on ${HOST}:${PORT}"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start uvicorn
exec uvicorn app:app --host "$HOST" --port "$PORT"
