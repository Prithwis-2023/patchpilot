import re
import google.generativeai as genai
import json
from schemas import AnalysisResponse, TestResponse, PatchResponse, PatchResponse
import os

genai.configure(api_key=os.getenv("GENAI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro-latest")

def clear_json_response(text):
    # this regex find text between ```json and ``` or just ```
    match = re.search(r"```(?:json)?\n?(.*?)\n?```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()

def analyze_video(frames):
    prompt = """
    You are a senior QA automation engineer.

    Your task is to analyze a sequence of UI screenshots from a bug recording.

    You MUST:
    - Infer user intent
    - Identify UI transitions
    - Extract precise reproduction steps
    - Distinguish expected vs actual behavior

    You MUST return ONLY valid JSON matching this schema:

    {
    "title": string,
    "timeline": [{"t": number, "event": string}],
    "reproSteps": string[],
    "expected": string,
    "actual": string
    }
    Do not include markdown or explanation.
    """

    images = [genai.upload_file(f) for f in frames]
    # we also tell Gemini to strictly output valid JSON
    response = model.generate_content(
        [prompt] + images,
        generation_config = {
            "temperature": 0.1,
            "top_p": 0.5,
            "response_mime_type": "application/json"
        }
    )

    clean_data = clear_json_response(response.text)
    data = json.loads(clean_data)

    return AnalysisResponse(**data)

def generate_test(analysis):
    prompt = f"""
    You are a senior SDET writing Playwright tests.

    Write a robust Playwright test from these reproduction steps:

    {analysis.reproSteps}

    Rules:
    - Use @playwright/test syntax
    - Prefer getByRole, getByLabelText, getByText over CSS selectors
    - Include at least one assertion verifying the bug
    - Include screenshot on failure

    Return ONLY valid JSON:

    {
    "filename": string,
    "playwrightSpec": string
    }
    No markdown.
    """
    response = model.generate_content(
        prompt,
        generation_config = {
            "temperature": 0.1,
            "top_p": 0.5,
            "response_mime_type": "application/json"
        }
    )
    data = json.loads(clear_json_response(response.text))
    return TestResponse(**data)

def generate_patch(request):
    prompt = f"""
    You are a senior Software Engineer. You must provide a fix for a failing Playwright test.
    
    FAILURE LOGS:
    {request.error_log}

    FAILING TEST CODE:
    {request.failing_test}

    TASK:
    1. Identify the root cause (e.g., race condition, incorrect selector, missing assertion).
    2. Provide a "unified diff" that can be applied to the FAILING TEST CODE.
    3. Ensure the diff follows standard format:
       --- original
       +++ modified
       @@ -line,count +line,count @@
    
    RETURN ONLY JSON:
    {{
    "diff": "string (the full unified diff code)",
    "rationale": ["bullet point 1", "bullet point 2"]
    }}
    
    CRITICAL: The diff must be a single string within the JSON. Use '\\n' for newlines.
    """
    
    response = model.generate_content(
        prompt,
        generation_config = {
            "temperature": 0.1,
            "response_mime_type": "application/json"
        }
    )
    clean_data = clear_json_response(response.text)
    data = json.loads(clean_data)

    return PatchResponse(**data)
