from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from schemas import AnalysisResponse, TestResponse, PatchRequest, PatchResponse
from video_utils import extract_frames
from gemini import analyze_video, generate_test, generate_patch
from playwright_runner import run_playwright_test
import shutil
import os
import traceback

load_dotenv()

app = FastAPI()

# CORS middleware - MUST be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        # Add production URL here when deployed
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Exception handler to ensure CORS headers on errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "type": type(exc).__name__,
        },
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )

UPLOAD_DIR = "temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/health")
async def health():
    return {"ok": True}

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