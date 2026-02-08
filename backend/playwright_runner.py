import subprocess
import os
import uuid

def run_playwright_test(test_code):
    test_id = str(uuid.uuid4())
    os.makedirs("temp", exist_ok=True)
    test_file = f"temp/test_{test_id}.spec.ts"
    
    with open(test_file, "w") as f:
        f.write(test_code)
    
    try:
        result = subprocess.run(
            ["npx", "playwright", "test", test_file],
            capture_output = True,
            text = True,
            timeout = 60
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "success": result.returncode == 0
        }
    
    except Exception as e:
        return {"error": str(e)}