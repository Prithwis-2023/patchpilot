# PatchPilot Backend

FastAPI server with Gemini AI integration for video analysis, test generation, and patch suggestions.

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Google AI API key ([Get one here](https://ai.google.dev/))

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install
```

### Configuration

Create `.env` file in the `backend/` directory:

```env
GENAI_API_KEY=your_api_key_here
```

**Optional environment variables:**
- `CORS_ALLOWED_ORIGINS` - Comma or space-separated list of allowed origins (defaults to localhost URLs)
- `UPLOAD_DIR` - Directory for temporary files (defaults to `temp`)
- `PORT` - Backend port (defaults to `8000`)

### Run Server

```bash
# Development (with auto-reload)
uvicorn app:app --reload --port 8000

# Production
uvicorn app:app --host 0.0.0.0 --port 8000
```

API available at: http://localhost:8000  
API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
backend/
├── app.py              # FastAPI app & endpoints
├── gemini.py           # Gemini AI integration
├── video_utils.py      # Video frame extraction
├── playwright_runner.py # Test execution
├── schemas.py          # Pydantic models
├── requirements.txt    # Python dependencies
├── guide.csv           # API endpoint reference guide
└── temp/               # Temporary files (gitignored)
    ├── frames/         # Extracted video frames
    ├── playwright_runner/ # Playwright test execution directory
    └── *.mp4           # Uploaded videos
```

## 🔌 API Endpoints

### `GET /health`
Health check endpoint.

**Response:**
```json
{"ok": true}
```

### `GET /debug/cors`
Debug endpoint to inspect CORS configuration.

**Response:**
```json
{
  "cors_origins": ["http://localhost:3000", ...],
  "env_var": "CORS_ALLOWED_ORIGINS value or NOT SET",
  "all_env_vars": {...}
}
```

### `GET /selfcheck`
Self-check endpoint to verify Playwright setup.

**Response:**
```json
{
  "status": "ok" | "warning",
  "checks": {
    "node": true,
    "npx": true,
    "package_json": true,
    "playwright_installed": true,
    "chromium_installed": true,
    "errors": []
  },
  "runner_dir": "path/to/playwright_runner"
}
```

### `POST /analyze`
Analyze video and extract bug information.

**Request:** `multipart/form-data` with `file` field  
**Response:** `AnalysisResponse`

```json
{
  "title": "Bug title",
  "timeline": [{"t": 0, "event": "User action"}],
  "reproSteps": ["Step 1", "Step 2"],
  "expected": "Expected behavior",
  "actual": "Actual behavior",
  "targetUrl": "https://example.com"
}
```

**Note:** The frontend normalizes this response:
- `timeline` is converted from `[{t: number, event: string}]` to `[{timestamp: string, description: string}]`
- `reproSteps` is converted from `string[]` to `[{number: number, description: string}]`

### `POST /generate-test`
Generate Playwright test from analysis.

**Request:** `AnalysisResponse` JSON  
**Response:** `TestResponse`

```json
{
  "filename": "test.spec.ts",
  "playwrightSpec": "import { test } from '@playwright/test';..."
}
```

### `POST /run-test`
Execute Playwright test.

**Request:** `TestResponse` JSON  
**Response:**

```json
{
  "status": "passed" | "failed",
  "stdout": "Test output...",
  "stderr": "Error output...",
  "durationMs": 1234,
  "screenshotUrl": null
}
```

**Note:** The frontend normalizes `status` from `"passed"` to `"success"`.

### `POST /generate-patch`
Generate code patch suggestion.

**Request:** `PatchRequest` JSON  
**Response:** `PatchResponse`

```json
{
  "diff": "--- a/file.ts\n+++ b/file.ts\n...",
  "rationale": ["Reason 1", "Reason 2"],
  "risks": ["Risk 1", "Risk 2"]
}
```

**Note:** The frontend normalizes `rationale` from `string[]` to a single `string` (joined with newlines).

## 🤖 AI Model

**Current Model:** `gemini-2.5-flash`

- Free-tier friendly
- Fast and efficient
- Multimodal (supports images/video)
- Good quotas for development

**To change model:** Edit `MODEL_ID` in `gemini.py`

## 🔧 Development

### Running Tests Locally

The backend uses Playwright to execute generated tests. Ensure Playwright is installed:

```bash
playwright install
```

### CORS Configuration

CORS is configured dynamically:
- **Default origins** (always included):
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `http://127.0.0.1:3000`
  - `http://127.0.0.1:3001`
- **Custom origins** via `CORS_ALLOWED_ORIGINS` environment variable:
  ```env
  CORS_ALLOWED_ORIGINS="https://example.com,https://app.example.com"
  ```

Use `GET /debug/cors` endpoint to inspect current CORS configuration.

### Video Processing

Videos are processed using:
- **Decord**: Fast video reading
- **OpenCV**: Frame extraction and scene detection

Frames are extracted to `temp/frames/` and cleaned up after processing.

## 🐛 Troubleshooting

**API Key Error:**
```
ValueError: GENAI_API_KEY environment variable is required
```
→ Create `.env` file with your API key

**Quota Limit:**
```
429 RESOURCE_EXHAUSTED
```
→ Model `gemini-2.5-flash` should work. Check API key has free tier access.

**CORS Errors:**
→ Ensure frontend origin is in `allow_origins` list in `app.py`

**Playwright Not Found:**
```bash
playwright install
```

## 📦 Dependencies

Key packages:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `google-genai` - Gemini API client
- `opencv-python` - Image processing
- `decord` - Video reading
- `playwright` - Test execution
- `pydantic` - Data validation

See `requirements.txt` for full list.

## 🚀 Production Deployment

### Environment Variables
- `GENAI_API_KEY` - Required
- `PORT` - Optional (defaults to 8000)

### Recommended Setup
- Use process manager (PM2, systemd)
- Set up reverse proxy (nginx)
- Enable HTTPS
- Configure CORS for production domain

## 🔗 Related

- [Frontend README](../frontend/README.md)
- [Architecture Docs](../ARCHITECTURE.md)
- [Root README](../README.md)
