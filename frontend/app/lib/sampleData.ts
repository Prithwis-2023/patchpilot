/**
 * PatchPilot Sample Data
 * Coherent end-to-end sample payload for demo purposes
 */

import type {
  AnalysisResult,
  GeneratedTest,
  RunResult,
  PatchResult,
  BugReport,
} from "./types";

export const sampleAnalysisResult: AnalysisResult = {
  timeline: [
    { timestamp: "00:00", description: "User navigates to login page" },
    { timestamp: "00:03", description: "User enters email address" },
    { timestamp: "00:07", description: "User enters password" },
    { timestamp: "00:10", description: "User clicks 'Sign In' button" },
    {
      timestamp: "00:12",
      description: "Error message appears: 'Invalid credentials'",
    },
    {
      timestamp: "00:15",
      description: "User attempts to click 'Forgot Password' link",
    },
    {
      timestamp: "00:18",
      description: "Application crashes with white screen",
    },
  ],
  reproSteps: [
    {
      number: 1,
      description: "Navigate to https://example.com/login",
    },
    {
      number: 2,
      description: "Enter any email address in the email field",
    },
    {
      number: 3,
      description: "Enter any password in the password field",
    },
    {
      number: 4,
      description: "Click the 'Sign In' button",
    },
    {
      number: 5,
      description: "Observe the 'Invalid credentials' error message",
    },
    {
      number: 6,
      description: "Click the 'Forgot Password' link below the form",
    },
    {
      number: 7,
      description: "Observe the application crashes with a white screen",
    },
  ],
  expected: "Clicking 'Forgot Password' should navigate to the password reset page",
  actual: "Application crashes with white screen and console error",
  targetUrl: "https://example.com/login",
};

export const sampleGeneratedTest: GeneratedTest = {
  playwrightSpec: `import { test, expect } from '@playwright/test';

test('reproduce forgot password crash bug', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://example.com/login');
  
  // Fill in login form
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Click sign in button
  await page.click('button[type="submit"]');
  
  // Wait for error message
  await expect(page.locator('.error-message')).toContainText('Invalid credentials');
  
  // Click forgot password link - this triggers the crash
  await page.click('a[href*="forgot-password"]');
  
  // Wait a moment for navigation/crash
  await page.waitForTimeout(1000);
  
  // Verify the crash (white screen or error state)
  const bodyText = await page.locator('body').textContent();
  expect(bodyText).toBeTruthy();
  
  // Check for console errors
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // This test should fail, demonstrating the bug
  expect(errors.length).toBe(0);
});`,
  filename: "forgot-password-crash.spec.ts",
};

export const sampleRunResult: RunResult = {
  status: "failed",
  stdout: `Running: forgot-password-crash.spec.ts

  ✓ Navigate to login page (2.3s)
  ✓ Fill in login form (0.5s)
  ✓ Click sign in button (0.2s)
  ✓ Wait for error message (0.1s)
  ✓ Click forgot password link (0.3s)
  ✗ Verify no console errors (1.2s)

  1 failed
    forgot-password-crash.spec.ts:32:5
    Error: Expected 0 errors, but found 1:
    - TypeError: Cannot read property 'href' of undefined
        at ForgotPasswordLink.handleClick (app/components/ForgotPasswordLink.tsx:45:12)
        at HTMLAnchorElement.<anonymous> (app/components/ForgotPasswordLink.tsx:38:5)`,
  stderr: `Error: Test failed
    at test('reproduce forgot password crash bug', async ({ page }) => {
    The application crashed when clicking the forgot password link.
    Console error: TypeError: Cannot read property 'href' of undefined`,
  screenshotUrl: null, // In real implementation, this would be a URL to the screenshot
};

export const samplePatchResult: PatchResult = {
  diff: `--- a/app/components/ForgotPasswordLink.tsx
+++ b/app/components/ForgotPasswordLink.tsx
@@ -38,12 +38,16 @@ export function ForgotPasswordLink() {
   const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
     e.preventDefault();
     
-    const targetUrl = router.query.returnUrl;
+    const targetUrl = router.query?.returnUrl;
     const resetUrl = \`/reset-password?returnUrl=\${targetUrl}\`;
     
-    router.push(resetUrl);
+    if (targetUrl && typeof targetUrl === 'string') {
+      router.push(resetUrl);
+    } else {
+      router.push('/reset-password');
+    }
   };
   
   return (
     <a href="/reset-password" onClick={handleClick}>
       Forgot Password?
     </a>
   );
 }`,
  rationale:
    "The crash occurs because `router.query.returnUrl` can be undefined, and we're trying to use it in a template string without checking. The fix adds a null check and provides a fallback route.",
  risks: [
    "Low risk: This is a defensive programming change that maintains existing behavior when returnUrl is present",
    "The fallback route (/reset-password) should be tested to ensure it works correctly",
  ],
};

export const sampleBugReport: BugReport = {
  markdown: `# Bug Report: Forgot Password Link Crash

## Summary
Clicking the "Forgot Password" link on the login page after receiving an "Invalid credentials" error causes the application to crash with a white screen.

## Timeline
- **00:00**: User navigates to login page
- **00:03**: User enters email address
- **00:07**: User enters password
- **00:10**: User clicks 'Sign In' button
- **00:12**: Error message appears: 'Invalid credentials'
- **00:15**: User attempts to click 'Forgot Password' link
- **00:18**: Application crashes with white screen

## Reproduction Steps
1. Navigate to https://example.com/login
2. Enter any email address in the email field
3. Enter any password in the password field
4. Click the 'Sign In' button
5. Observe the 'Invalid credentials' error message
6. Click the 'Forgot Password' link below the form
7. Observe the application crashes with a white screen

## Expected Behavior
Clicking 'Forgot Password' should navigate to the password reset page.

## Actual Behavior
Application crashes with white screen and console error: \`TypeError: Cannot read property 'href' of undefined\`

## Test Results
The generated Playwright test successfully reproduces the bug:
- Test file: \`forgot-password-crash.spec.ts\`
- Status: **FAILED** (as expected, demonstrating the bug)
- Error: \`TypeError: Cannot read property 'href' of undefined\`
- Location: \`app/components/ForgotPasswordLink.tsx:45:12\`

## Suggested Fix

\`\`\`diff
--- a/app/components/ForgotPasswordLink.tsx
+++ b/app/components/ForgotPasswordLink.tsx
@@ -38,12 +38,16 @@ export function ForgotPasswordLink() {
   const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
     e.preventDefault();
     
-    const targetUrl = router.query.returnUrl;
+    const targetUrl = router.query?.returnUrl;
     const resetUrl = \`/reset-password?returnUrl=\${targetUrl}\`;
     
-    router.push(resetUrl);
+    if (targetUrl && typeof targetUrl === 'string') {
+      router.push(resetUrl);
+    } else {
+      router.push('/reset-password');
+    }
   };
   
   return (
     <a href="/reset-password" onClick={handleClick}>
       Forgot Password?
     </a>
   );
 }
\`\`\`

## Rationale
The crash occurs because \`router.query.returnUrl\` can be undefined, and we're trying to use it in a template string without checking. The fix adds a null check and provides a fallback route.

## Risks
- Low risk: This is a defensive programming change that maintains existing behavior when returnUrl is present
- The fallback route (/reset-password) should be tested to ensure it works correctly

## Generated Test
See \`forgot-password-crash.spec.ts\` for the complete Playwright test that reproduces this bug.

---
*Generated by PatchPilot - Transform bug recordings into fixes with Gemini 3*
`,
};
