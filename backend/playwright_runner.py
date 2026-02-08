import subprocess
import os
import time
from typing import Optional

def run_playwright_test(test_code: str) -> dict:
    """
    Run a Playwright test and return standardized result.
    
    Returns:
        {
            "status": "passed" | "failed",
            "stdout": str,
            "stderr": str,
            "durationMs": int,
            "screenshotUrl": Optional[str]  # null for now, can be added later
        }
    """
    os.makedirs("temp", exist_ok=True)
    test_file = "temp/test_run.spec.ts"
    
    # Write test file
    with open(test_file, "w") as f:
        f.write(test_code)
    
    start_time = time.time()
    
    try:
        result = subprocess.run(
            ["npx", "playwright", "test", test_file, "--reporter=json"],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=os.getcwd()
        )
        
        duration_ms = int((time.time() - start_time) * 1000)
        
        # Determine status: passed if returncode is 0, failed otherwise
        status = "passed" if result.returncode == 0 else "failed"
        
        return {
            "status": status,
            "stdout": result.stdout or "",
            "stderr": result.stderr or "",
            "durationMs": duration_ms,
            "screenshotUrl": None  # Can be implemented later with artifact serving
        }
    
    except subprocess.TimeoutExpired:
        duration_ms = int((time.time() - start_time) * 1000)
        return {
            "status": "failed",
            "stdout": "",
            "stderr": f"Test execution timed out after {duration_ms}ms",
            "durationMs": duration_ms,
            "screenshotUrl": None
        }
    
    except Exception as e:
        duration_ms = int((time.time() - start_time) * 1000)
        return {
            "status": "failed",
            "stdout": "",
            "stderr": f"Error running test: {str(e)}",
            "durationMs": duration_ms,
            "screenshotUrl": None
        }
    
    finally:
        # Cleanup test file
        try:
            if os.path.exists(test_file):
                os.remove(test_file)
        except:
            pass