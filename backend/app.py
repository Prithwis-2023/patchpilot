from fastapi import FastAPI, UploadFile, File
from schemas import AnalysisResponse, TestResponse, PatchRequest, PatchResponse
from video_utils import extract_frames
from gemini import analyze_video, generate_test, generate_patch
from playwright_runner import run_playwright_test
import shutil
import os

app = FastAPI()

UPLOAD_DIR = "temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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