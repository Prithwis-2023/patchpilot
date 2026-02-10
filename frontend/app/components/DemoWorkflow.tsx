"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/app/components/ui/card";
import { Upload, CheckCircle2, Loader2, Code2, Play, Terminal, FileDiff, FileText, Video } from "lucide-react";
import SyntaxHighlightedCode from "./SyntaxHighlightedCode";
import DiffViewer from "./DiffViewer";

/* 
  Design Philosophy: Cybernetic Brutalism
  Interactive demo workflow with two-panel code-based view
*/

type WorkflowStep = "upload" | "analyze" | "test" | "run" | "patch" | "export";

interface StepConfig {
  label: string;
  icon: typeof Upload;
  color: "cyan" | "magenta" | "lime";
  artifact: string;
  artifactType: "json" | "code" | "terminal" | "diff" | "markdown";
}

const stepConfigs: Record<WorkflowStep, StepConfig> = {
  upload: {
    label: "Upload",
    icon: Upload,
    color: "cyan",
    artifact: "",
    artifactType: "json"
  },
  analyze: {
    label: "Analyze",
    icon: Loader2,
    color: "magenta",
    artifact: `{
  "timeline": [
    { "timestamp": "0:00", "action": "Page load" },
    { "timestamp": "0:05", "action": "User clicks input" },
    { "timestamp": "0:12", "action": "User types email" },
    { "timestamp": "0:18", "action": "Button remains disabled" }
  ],
  "steps": [
    "Open login page",
    "Enter email address",
    "Button should enable but doesn't"
  ]
}`,
    artifactType: "json"
  },
  test: {
    label: "Generate Test",
    icon: Code2,
    color: "lime",
    artifact: `import { test, expect } from '@playwright/test';

test('login button enables on valid email', async ({ page }) => {
  await page.goto('https://app.example.com/login');
  await page.fill('input[type="email"]', 'user@example.com');
  await expect(page.locator('button:has-text("Login")')).toBeEnabled();
});`,
    artifactType: "code"
  },
  run: {
    label: "Run Test",
    icon: Terminal,
    color: "cyan",
    artifact: `$ npx playwright test login.spec.ts

Running 1 test...

✗ login.spec.ts:3:5
  Error: Expected button to be enabled, but it was disabled

  1 failed
  Duration: 2.34s`,
    artifactType: "terminal"
  },
  patch: {
    label: "Generate Patch",
    icon: FileDiff,
    color: "magenta",
    artifact: `@@ -15,7 +15,7 @@ export function LoginForm() {
     const [email, setEmail] = useState('');
     
     return (
-      <button disabled>Login</button>
+      <button disabled={!email}>Login</button>
     );
   }`,
    artifactType: "diff"
  },
  export: {
    label: "Export Report",
    icon: FileText,
    color: "lime",
    artifact: `# Bug Report

## Summary
Login button does not enable when valid email is entered.

## Reproduction Steps
1. Open login page
2. Enter email address
3. Button should enable but doesn't

## Suggested Fix
\`\`\`diff
- <button disabled>Login</button>
+ <button disabled={!email}>Login</button>
\`\`\``,
    artifactType: "markdown"
  }
};

export default function DemoWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [isRunning, setIsRunning] = useState(false);
  const [activeSlide, setActiveSlide] = useState<"demo" | "video">("demo");

  useEffect(() => {
    if (!isRunning) return;

    const steps: WorkflowStep[] = ["upload", "analyze", "test", "run", "patch", "export"];
    let stepIndex = 0;

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex >= steps.length) {
        setCurrentStep("export");
        setIsRunning(false);
        clearInterval(interval);
        // Auto-restart after 3 seconds
        setTimeout(() => {
          setCurrentStep("upload");
          setIsRunning(true);
        }, 3000);
        return;
      }
      setCurrentStep(steps[stepIndex]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startDemo = () => {
    setCurrentStep("upload");
    setIsRunning(true);
  };

  const config = stepConfigs[currentStep];
  const colorClass = config.color === "cyan" ? "text-[var(--neon-cyan)]" :
    config.color === "magenta" ? "text-[var(--neon-magenta)]" :
      "text-[var(--neon-lime)]";
  const borderClass = config.color === "cyan" ? "neon-border-cyan" :
    config.color === "magenta" ? "neon-border-magenta" :
      "neon-border-lime";

  const steps: WorkflowStep[] = ["upload", "analyze", "test", "run", "patch", "export"];

  return (
    <div className="space-y-6">
      {/* Slider Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveSlide("demo")}
          className={`px-6 py-3 rounded-lg border-2 font-bold font-mono text-sm transition-all ${activeSlide === "demo"
              ? "bg-[var(--neon-cyan)]/20 border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,255,255,0.3)]"
              : "bg-muted/10 border-border/30 text-muted-foreground hover:border-[var(--neon-cyan)]/50"
            }`}
        >
          Interactive Demo
        </button>
        <button
          onClick={() => setActiveSlide("video")}
          className={`px-6 py-3 rounded-lg border-2 font-bold font-mono text-sm transition-all ${activeSlide === "video"
              ? "bg-[var(--neon-cyan)]/20 border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,255,255,0.3)]"
              : "bg-muted/10 border-border/30 text-muted-foreground hover:border-[var(--neon-cyan)]/50"
            }`}
        >
          <Video className="w-4 h-4 inline mr-2" />
          Video Demo
        </button>
      </div>

      {/* Slider Content */}
      <AnimatePresence mode="wait">
        {activeSlide === "demo" ? (
          <motion.div
            key="demo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Two-Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Stepper */}
              <Card className={`p-6 bg-card/50 backdrop-blur-sm border-2 ${borderClass}`}>
                <h3 className="text-xl font-bold mb-6 text-[var(--neon-cyan)]" style={{ fontFamily: 'var(--font-display)' }}>
                  WORKFLOW STEPS
                </h3>
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const stepConfig = stepConfigs[step];
                    const isActive = currentStep === step;
                    const isCompleted = steps.indexOf(currentStep) > index;
                    const StepIcon = stepConfig.icon;

                    return (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${isActive
                            ? `bg-[var(--neon-${stepConfig.color})]/10 border-[var(--neon-${stepConfig.color})]/50`
                            : isCompleted
                              ? "bg-muted/10 border-border/30"
                              : "bg-transparent border-border/20"
                          }`}
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${isActive
                            ? `border-[var(--neon-${stepConfig.color})] bg-[var(--neon-${stepConfig.color})]/20`
                            : isCompleted
                              ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10"
                              : "border-border/30"
                          }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[var(--neon-cyan)]" />
                          ) : (
                            <StepIcon className={`w-5 h-5 ${isActive
                                ? `text-[var(--neon-${stepConfig.color})] ${isRunning && step !== "upload" && step !== "export" ? "animate-spin" : ""}`
                                : "text-muted-foreground"
                              }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold text-sm ${isActive ? colorClass : isCompleted ? "text-[var(--neon-cyan)]" : "text-muted-foreground"}`}>
                            {stepConfig.label}
                          </div>
                          {isActive && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {step === "upload" && "Uploading video recording..."}
                              {step === "analyze" && "Extracting UI states and interactions..."}
                              {step === "test" && "Generating Playwright test specification..."}
                              {step === "run" && "Executing test and capturing results..."}
                              {step === "patch" && "Analyzing failure and generating fix..."}
                              {step === "export" && "Creating bug report markdown..."}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              {/* Right: Artifact Viewer */}
              <Card className={`p-6 bg-card/50 backdrop-blur-sm border-2 ${borderClass}`}>
                <h3 className="text-xl font-bold mb-6 text-[var(--neon-cyan)]" style={{ fontFamily: 'var(--font-display)' }}>
                  CODE ARTIFACT
                </h3>
                <div className="h-[400px] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {currentStep === "upload" ? (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-center h-full text-muted-foreground"
                      >
                        <div className="text-center">
                          <Upload className="w-16 h-16 mx-auto mb-4 text-[var(--neon-cyan)]" />
                          <p className="text-sm">Upload a video to begin</p>
                        </div>
                      </motion.div>
                    ) : config.artifactType === "code" ? (
                      <motion.div
                        key="code"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <SyntaxHighlightedCode code={config.artifact} language="typescript" />
                      </motion.div>
                    ) : config.artifactType === "diff" ? (
                      <motion.div
                        key="diff"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <DiffViewer diff={config.artifact} />
                      </motion.div>
                    ) : config.artifactType === "terminal" ? (
                      <motion.pre
                        key="terminal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-green-400 h-full overflow-y-auto"
                      >
                        {config.artifact}
                      </motion.pre>
                    ) : (
                      <motion.pre
                        key={config.artifactType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-gray-300 h-full overflow-y-auto whitespace-pre-wrap"
                      >
                        {config.artifact}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </div>

            <div className="h-4"></div> 
            {/* Controls */}
            <div className="flex justify-center">
              {!isRunning ? (
                <motion.button
                  onClick={startDemo}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[var(--neon-cyan)]/10 border-2 border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)] font-bold rounded-lg hover:bg-[var(--neon-cyan)]/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  START DEMO
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground font-mono"
                >
                  Running workflow...
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="video"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 neon-border-cyan overflow-hidden">
              <h3 className="text-xl font-bold mb-4 text-[var(--neon-cyan)]" style={{ fontFamily: 'var(--font-display)' }}>
                VIDEO DEMONSTRATION
              </h3>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-2 border-[var(--neon-cyan)]/50 rounded-lg"
                  src="https://www.youtube.com/embed/HKxgEEK4rlo"
                  title="PatchPilot Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
