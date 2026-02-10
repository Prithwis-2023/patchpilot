from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware
from dotenv import load_dotenv
from schemas import AnalysisResponse, TestResponse, PatchRequest, PatchResponse
from video_utils import extract_frames
from gemini import analyze_video, generate_test, generate_patch
from playwright_runner import run_playwright_test, check_playwright_setup, setup_playwright_runner_dir
import shutil
import os
import traceback

load_dotenv()

app = FastAPI()

# CORS allowed origins - read from environment variable
# Format: comma-separated or space-separated URLs
# Example: CORS_ALLOWED_ORIGINS="http://localhost:3000,https://example.com"
# Default: localhost URLs for development
def get_cors_origins():
    """Get CORS allowed origins from environment or use defaults."""
    env_origins = os.getenv("CORS_ALLOWED_ORIGINS", "").strip()
    
    # Default origins for local development
    default_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    
    if not env_origins:
        return default_origins
    
    # Parse comma or space-separated origins
    origins = [origin.strip().rstrip('/') for origin in env_origins.replace(",", " ").split() if origin.strip()]
    
    # Combine with defaults (avoid duplicates)
    all_origins = list(set(default_origins + origins))
    
    return all_origins

def is_origin_allowed(origin: str) -> bool:
    """Check if origin is allowed, handling trailing slashes and variations."""
    if not origin:
        return False
    origin_clean = origin.rstrip('/')
    allowed_origins = get_cors_origins()
    return origin_clean in allowed_origins or origin in allowed_origins

# CORS middleware - MUST be added before routes
# Get CORS origins (this will be called once at startup)
cors_origins = get_cors_origins()

# Log CORS origins at startup for debugging
print(f"[CORS] Allowed origins: {cors_origins}")

# Custom middleware to ensure CORS headers on ALL responses (including timeouts/errors)
class CORSHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "")
        allowed_origins = get_cors_origins()
        
        # Determine CORS origin - check if origin is allowed
        if origin and is_origin_allowed(origin):
            cors_origin = origin.rstrip('/')
        elif allowed_origins:
            cors_origin = allowed_origins[0]
        else:
            cors_origin = "*"
        
        try:
            response = await call_next(request)
        except Exception as e:
            # Even on exceptions, return CORS headers
            response = JSONResponse(
                status_code=500,
                content={"detail": str(e), "type": type(e).__name__},
                headers={
                    "Access-Control-Allow-Origin": cors_origin,
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                }
            )
        
        # Ensure CORS headers are always present (override any existing)
        response.headers["Access-Control-Allow-Origin"] = cors_origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        
        return response

# Add custom CORS middleware first (runs last in reverse order)
app.add_middleware(CORSHeaderMiddleware)

# Add FastAPI CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Exception handler to ensure CORS headers on errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin")
    # Check if origin is in allowed origins
    allowed_origins = get_cors_origins()
    cors_origin = origin if origin in allowed_origins else allowed_origins[0] if allowed_origins else "*"
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "type": type(exc).__name__,
        },
        headers={
            "Access-Control-Allow-Origin": cors_origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

# Upload directory - can be overridden via env
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "temp")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Backend port - read from env or use default
BACKEND_PORT = int(os.getenv("PORT", "8000"))

@app.get("/health")
async def health():
    return {"ok": True}

@app.get("/debug/cors")
async def debug_cors():
    """Debug endpoint to see what CORS origins are configured."""
    return {
        "cors_origins": get_cors_origins(),
        "env_var": os.getenv("CORS_ALLOWED_ORIGINS", "NOT SET"),
        "all_env_vars": {k: v for k, v in os.environ.items() if "CORS" in k.upper()}
    }

@app.get("/selfcheck")
async def selfcheck():
    """
    Self-check endpoint to verify Playwright setup.
    Returns a detailed report of what's installed and what's missing.
    """
    try:
        runner_dir = setup_playwright_runner_dir()
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to set up runner directory: {str(e)}",
            "checks": {}
        }
    
    checks = check_playwright_setup(runner_dir)
    
    all_ok = (
        checks["node"] and 
        checks["npx"] and 
        checks["package_json"] and 
        checks["playwright_installed"]
    )
    
    return {
        "status": "ok" if all_ok else "warning",
        "checks": checks,
        "runner_dir": runner_dir
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)):
    video_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    frames = extract_frames(video_path)
    analysis = analyze_video(frames)
    return analysis

@app.post("/generate-test", response_model = TestResponse)
async def api_generate_test(analysis: AnalysisResponse):
    return generate_test(analysis)

@app.post("/run-test")
async def run_test(test: TestResponse):
    result = run_playwright_test(test.playwrightSpec)
    return result

@app.post('/generate-patch', response_model=PatchResponse)
async def api_generate_patch(request: PatchRequest):
    print(f"Analyzing error: {request.error_log}")
    return generate_patch(request)  