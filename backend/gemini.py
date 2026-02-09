import re
from google import genai
import json
from schemas import AnalysisResponse, TestResponse, PatchResponse
import os
from dotenv import load_dotenv

# Model selection: Use gemini-2.5-flash for free-tier friendly access
# Available models: gemini-2.5-flash, gemini-2.0-flash, gemini-flash-latest
# gemini-3-pro-preview has quota limit 0 for free tier (only works in AI Studio)
# gemini-2.5-flash: Latest flash model, free-tier friendly, good for multimodal tasks
MODEL_ID = "gemini-2.5-flash"

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize client with API key from environment
api_key = os.getenv("GENAI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError(
        "GENAI_API_KEY or GOOGLE_API_KEY environment variable is required. "
        "Set it in your .env file or environment variables."
    )

client = genai.Client(api_key=api_key)

#genai.configure(api_key=os.getenv("GENAI_API_KEY"))
#model = client.models.get("gemini-2.5-pro-latest") 

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
    "actual": string,
    "targetUrl": string (optional)
    }
    Do not include markdown or explanation.
    """
    
    # Define JSON schema for structured output
    response_schema = {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "timeline": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "t": {"type": "integer"},
                        "event": {"type": "string"}
                    },
                    "required": ["t", "event"]
                }
            },
            "reproSteps": {
                "type": "array",
                "items": {"type": "string"}
            },
            "expected": {"type": "string"},
            "actual": {"type": "string"},
            "targetUrl": {"type": "string"}
        },
        "required": ["title", "timeline", "reproSteps", "expected", "actual"]
    }

    try:
        # Upload files using the files API
        uploaded_files = []
        try:
            # Use client.files.upload() method - takes 'file' parameter, not 'path'
            for frame_path in frames:
                uploaded_file = client.files.upload(file=frame_path)
                uploaded_files.append(uploaded_file)
            
            # Uploaded files can be used directly in contents
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=[prompt] + uploaded_files,
                config={
                    "temperature": 0.1,
                    "top_p": 0.5,
                    "response_mime_type": "application/json",
                    "response_schema": response_schema
                }
            )
        finally:
            # Cleanup uploaded files
            for uploaded_file in uploaded_files:
                try:
                    client.files.delete(uploaded_file.name)
                except:
                    pass

        clean_data = clear_json_response(response.text)
        data = json.loads(clean_data)

        return AnalysisResponse(**data)
    except Exception as e:
        # Fallback: try without response schema
        uploaded_files = []
        try:
            for frame_path in frames:
                uploaded_file = client.files.upload(file=frame_path)
                uploaded_files.append(uploaded_file)
            
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=[prompt] + uploaded_files,
                config={
                    "temperature": 0.1,
                    "top_p": 0.5,
                    "response_mime_type": "application/json"
                }
            )
            clean_data = clear_json_response(response.text)
            data = json.loads(clean_data)
            return AnalysisResponse(**data)
        finally:
            for uploaded_file in uploaded_files:
                try:
                    client.files.delete(uploaded_file.name)
                except:
                    pass

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

    {{
    "filename": string,
    "playwrightSpec": string
    }}
    No markdown.
    """
    
    response_schema = {
        "type": "object",
        "properties": {
            "filename": {"type": "string"},
            "playwrightSpec": {"type": "string"}
        },
        "required": ["filename", "playwrightSpec"]
    }
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config={
                "temperature": 0.1,
                "top_p": 0.5,
                "response_mime_type": "application/json",
                "response_schema": response_schema
            }
        )
        data = json.loads(clear_json_response(response.text))
        return TestResponse(**data)
    except Exception as e:
        # Fallback: try without response schema
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config={
                "temperature": 0.1,
                "top_p": 0.5,
                "response_mime_type": "application/json"
            }
        )
        data = json.loads(clear_json_response(response.text))
        return TestResponse(**data)

def generate_patch(request):
    failing_test = request.failing_test or (request.run_result and request.run_result.get("playwrightSpec", "")) or ""
    
    prompt = f"""
    You are a senior Software Engineer. You must provide a fix for a failing Playwright test.
    
    FAILURE LOGS:
    {request.error_log}

    FAILING TEST CODE:
    {failing_test}

    TASK:
    1. Identify the root cause (e.g., race condition, incorrect selector, missing assertion).
    2. Provide a "unified diff" that can be applied to the FAILING TEST CODE.
    3. Ensure the diff follows standard format:
       --- original
       +++ modified
       @@ -line,count +line,count @@
    4. Provide rationale as a list of bullet points explaining the fix.
    5. List any risks or considerations.
    
    RETURN ONLY JSON:
    {{
    "diff": "string (the full unified diff code)",
    "rationale": ["bullet point 1", "bullet point 2"],
    "risks": ["risk 1", "risk 2"]
    }}
    
    CRITICAL: The diff must be a single string within the JSON. Use '\\n' for newlines.
    """
    
    response_schema = {
        "type": "object",
        "properties": {
            "diff": {"type": "string"},
            "rationale": {
                "type": "array",
                "items": {"type": "string"}
            },
            "risks": {
                "type": "array",
                "items": {"type": "string"}
            }
        },
        "required": ["diff", "rationale"]
    }
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config={
                "temperature": 0.1,
                "response_mime_type": "application/json",
                "response_schema": response_schema
            }
        )
        clean_data = clear_json_response(response.text)
        data = json.loads(clean_data)
        
        # Ensure risks is always a list
        if "risks" not in data:
            data["risks"] = []

        return PatchResponse(**data)
    
    except Exception as e:
        # Fallback: try without response schema
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config={
                "temperature": 0.1,
                "response_mime_type": "application/json"
            }
        )
        clean_data = clear_json_response(response.text)
        data = json.loads(clean_data)
        
        if "risks" not in data:
            data["risks"] = []

        return PatchResponse(**data)