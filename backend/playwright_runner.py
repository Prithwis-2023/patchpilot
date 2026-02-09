import subprocess
import uuid
import os
import time
import sys
import shutil
import json
from typing import Optional, Dict, List
from pathlib import Path

# Windows detection
IS_WINDOWS = sys.platform.startswith("win")

def find_executable(name: str) -> Optional[str]:
    """
    Find executable using shutil.which, handling Windows .cmd/.exe extensions.
    """
    if IS_WINDOWS:
        # Try .cmd first (for npm scripts), then .exe, then bare name
        for suffix in [".cmd", ".exe", ""]:
            full_name = name + suffix
            path = shutil.which(full_name)
            if path:
                return path
    else:
        path = shutil.which(name)
        if path:
            return path
    return None

def check_playwright_setup(workdir: str) -> Dict[str, any]:
    """
    Check if Playwright is properly set up in the workdir.
    Returns a dict with status and details.
    """
    checks = {
        "node": False,
        "npx": False,
        "package_json": False,
        "playwright_installed": False,
        "chromium_installed": False,
        "errors": []
    }
    
    # Check node
    node_path = find_executable("node")
    if node_path:
        checks["node"] = True
        checks["node_path"] = node_path
    else:
        checks["errors"].append("Node.js not found in PATH. Install Node.js from https://nodejs.org/")
    
    # Check npx
    npx_path = find_executable("npx")
    if npx_path:
        checks["npx"] = True
        checks["npx_path"] = npx_path
    else:
        checks["errors"].append("npx not found in PATH. Usually comes with Node.js.")
    
    # Check package.json
    package_json = os.path.join(workdir, "package.json")
    if os.path.exists(package_json):
        checks["package_json"] = True
        try:
            with open(package_json, "r") as f:
                pkg = json.load(f)
                deps = pkg.get("dependencies", {})
                dev_deps = pkg.get("devDependencies", {})
                if "@playwright/test" in deps or "@playwright/test" in dev_deps:
                    checks["playwright_installed"] = True
        except Exception as e:
            checks["errors"].append(f"Error reading package.json: {str(e)}")
    else:
        checks["errors"].append(f"package.json not found in {workdir}")
    
    # Check if chromium is installed (check node_modules/.cache/playwright)
    playwright_cache = os.path.join(workdir, "node_modules", ".cache", "playwright")
    chromium_path = os.path.join(playwright_cache, "chromium-*")
    import glob
    if glob.glob(chromium_path):
        checks["chromium_installed"] = True
    else:
        # Also check system-wide installation
        try:
            result = subprocess.run(
                [npx_path or "npx", "playwright", "install", "--dry-run", "chromium"],
                capture_output=True,
                text=True,
                timeout=5,
                cwd=workdir
            )
            if "chromium" in result.stdout.lower() and "already installed" in result.stdout.lower():
                checks["chromium_installed"] = True
        except:
            pass
    
    return checks

def setup_playwright_runner_dir() -> str:
    """
    Set up a dedicated directory for Playwright test execution.
    Creates package.json with @playwright/test if needed.
    """
    runner_dir = os.path.join(os.getcwd(), "temp", "playwright_runner")
    os.makedirs(runner_dir, exist_ok=True)
    
    package_json = os.path.join(runner_dir, "package.json")
    
    # Create package.json if it doesn't exist
    if not os.path.exists(package_json):
        package_data = {
            "name": "patchpilot-playwright-runner",
            "version": "1.0.0",
            "type": "module",
            "scripts": {
                "test": "playwright test"
            },
            "dependencies": {
                "@playwright/test": "^1.40.0"
            }
        }
        with open(package_json, "w") as f:
            json.dump(package_data, f, indent=2)
        print(f"[Playwright Runner] Created package.json in {runner_dir}")
    
    # Install dependencies if node_modules doesn't exist
    node_modules = os.path.join(runner_dir, "node_modules")
    if not os.path.exists(node_modules):
        print(f"[Playwright Runner] Installing @playwright/test in {runner_dir}...")
        npx_path = find_executable("npx")
        if not npx_path:
            raise RuntimeError("npx not found. Cannot install Playwright. Install Node.js from https://nodejs.org/")
        
        # Find npm executable
        npm_path = find_executable("npm")
        if not npm_path:
            raise RuntimeError("npm not found. Cannot install Playwright. Install Node.js from https://nodejs.org/")
        
        # Install npm packages
        install_result = subprocess.run(
            [npm_path, "install"],
            capture_output=True,
            text=True,
            timeout=120,
            cwd=runner_dir
        )
        
        if install_result.returncode != 0:
            raise RuntimeError(
                f"Failed to install npm packages: {install_result.stderr}\n"
                f"Make sure Node.js and npm are installed."
            )
        
        # Install Playwright browsers
        print(f"[Playwright Runner] Installing Chromium browser...")
        install_browser_result = subprocess.run(
            [npx_path, "playwright", "install", "chromium"],
            capture_output=True,
            text=True,
            timeout=300,
            cwd=runner_dir
        )
        
        if install_browser_result.returncode != 0:
            print(f"[Playwright Runner] Warning: Browser installation had issues: {install_browser_result.stderr}")
            # Continue anyway, might already be installed
    
    return runner_dir

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
    # Set up runner directory
    try:
        runner_dir = setup_playwright_runner_dir()
    except Exception as e:
        return {
            "status": "failed",
            "stdout": "",
            "stderr": f"Failed to set up Playwright runner: {str(e)}",
            "durationMs": 0,
            "screenshotUrl": None
        }
    
    # Find npx executable
    npx_path = find_executable("npx")
    if not npx_path:
        return {
            "status": "failed",
            "stdout": "",
            "stderr": "npx not found in PATH. Install Node.js from https://nodejs.org/",
            "durationMs": 0,
            "screenshotUrl": None
        }
    
    # Normalize test code: fix localhost URLs
    normalized_test_code = test_code.replace("page.goto('localhost:", "page.goto('http://localhost:")
    normalized_test_code = normalized_test_code.replace('page.goto("localhost:', 'page.goto("http://localhost:')
    
    # Generate test file - write to tests/ subdirectory
    test_id = str(uuid.uuid4())
    test_dir = os.path.join(runner_dir, "tests")
    os.makedirs(test_dir, exist_ok=True)
    filename = f"test_{test_id}.spec.ts"
    test_file_abs = os.path.join(test_dir, filename)
    
    # Write test file
    try:
        with open(test_file_abs, "w", encoding="utf-8") as f:
            f.write(normalized_test_code)
    except Exception as e:
        return {
            "status": "failed",
            "stdout": "",
            "stderr": f"Failed to write test file: {str(e)}",
            "durationMs": 0,
            "screenshotUrl": None
        }
    
    # Verification BEFORE running
    print(f"[Playwright Runner] ===== VERIFICATION =====")
    print(f"[Playwright Runner] Test file absolute path: {test_file_abs}")
    print(f"[Playwright Runner] Test file exists: {os.path.exists(test_file_abs)}")
    print(f"[Playwright Runner] Runner directory: {runner_dir}")
    print(f"[Playwright Runner] Tests directory: {test_dir}")
    
    # List files in tests directory
    try:
        test_files = os.listdir(test_dir)
        print(f"[Playwright Runner] Files in tests/ directory (first 5): {test_files[:5]}")
    except Exception as e:
        print(f"[Playwright Runner] Error listing tests directory: {e}")
    
    # Assert test file exists
    if not os.path.exists(test_file_abs):
        return {
            "status": "failed",
            "stdout": "",
            "stderr": f"Test file was not created: {test_file_abs}",
            "durationMs": 0,
            "screenshotUrl": None
        }
    
    start_time = time.time()
    
    # Build command with RELATIVE path from runner_dir
    # Use forward slashes for cross-platform compatibility
    rel_path = os.path.join("tests", filename).replace("\\", "/")
    cmd = [npx_path, "playwright", "test", rel_path, "--reporter=json"]
    
    # Log command for debugging
    print(f"[Playwright Runner] ===== EXECUTION =====")
    print(f"[Playwright Runner] Command: {' '.join(cmd)}")
    print(f"[Playwright Runner] Working directory (cwd): {runner_dir}")
    print(f"[Playwright Runner] Relative test path: {rel_path}")
    print(f"[Playwright Runner] Absolute test path: {test_file_abs}")
    print(f"[Playwright Runner] PATH: {os.environ.get('PATH', '')[:200]}...")
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60,
            cwd=runner_dir,
            shell=False,  # Explicitly set to False for security
            env=os.environ.copy()  # Pass through environment
        )
        
        duration_ms = int((time.time() - start_time) * 1000)
        
        # Log results
        print(f"[Playwright Runner] ===== RESULT =====")
        print(f"[Playwright Runner] Return code: {result.returncode}")
        print(f"[Playwright Runner] Duration: {duration_ms}ms")
        
        # Check for "No tests found" error
        stderr_output = result.stderr or ""
        stdout_output = result.stdout or ""
        
        if "No tests found" in stderr_output or "no tests found" in stderr_output.lower():
            # Add detailed debugging info
            debug_info = f"\n\n[DEBUG] No tests found - diagnostic info:\n"
            debug_info += f"  - Runner directory: {runner_dir}\n"
            debug_info += f"  - Tests directory: {test_dir}\n"
            debug_info += f"  - Test file absolute: {test_file_abs}\n"
            debug_info += f"  - Test file exists: {os.path.exists(test_file_abs)}\n"
            debug_info += f"  - Relative path used: {rel_path}\n"
            try:
                test_files = os.listdir(test_dir)
                debug_info += f"  - Files in tests/: {test_files}\n"
            except Exception as e:
                debug_info += f"  - Error listing tests/: {e}\n"
            stderr_output = stderr_output + debug_info
            
            # Try fallback: run without specific file (for debugging)
            print(f"[Playwright Runner] Attempting fallback: run all tests in directory")
            fallback_cmd = [npx_path, "playwright", "test", "--reporter=json"]
            try:
                fallback_result = subprocess.run(
                    fallback_cmd,
                    capture_output=True,
                    text=True,
                    timeout=60,
                    cwd=runner_dir,
                    shell=False,
                    env=os.environ.copy()
                )
                print(f"[Playwright Runner] Fallback return code: {fallback_result.returncode}")
                print(f"[Playwright Runner] Fallback stdout: {fallback_result.stdout}")
                print(f"[Playwright Runner] Fallback stderr: {fallback_result.stderr}")
            except Exception as e:
                print(f"[Playwright Runner] Fallback failed: {e}")
        
        # Log full output when "No tests found"
        if "No tests found" in stderr_output or "no tests found" in stderr_output.lower():
            print(f"[Playwright Runner] Stdout (FULL): {stdout_output}")
            print(f"[Playwright Runner] Stderr (FULL): {stderr_output}")
        else:
            if stdout_output:
                print(f"[Playwright Runner] Stdout (first 500 chars): {stdout_output[:500]}")
            if stderr_output:
                print(f"[Playwright Runner] Stderr (first 500 chars): {stderr_output[:500]}")
        
        # Determine status: passed if returncode is 0, failed otherwise
        status = "passed" if result.returncode == 0 else "failed"
        
        return {
            "status": status,
            "stdout": stdout_output,
            "stderr": stderr_output,
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
    
    except FileNotFoundError as e:
        duration_ms = int((time.time() - start_time) * 1000)
        return {
            "status": "failed",
            "stdout": "",
            "stderr": f"Executable not found: {str(e)}. Make sure Node.js and Playwright are installed.",
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
            if os.path.exists(test_file_abs):
                os.remove(test_file_abs)
                print(f"[Playwright Runner] Cleaned up test file: {test_file_abs}")
        except Exception as e:
            print(f"[Playwright Runner] Warning: Failed to cleanup test file: {e}")
