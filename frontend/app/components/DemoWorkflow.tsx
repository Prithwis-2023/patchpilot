"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Upload, CheckCircle2, Loader2, Play } from "lucide-react";

/* 
  Design Philosophy: Cybernetic Brutalism
  Interactive demo workflow with animated state transitions
*/

type WorkflowState = "idle" | "uploading" | "analyzing" | "generating" | "running" | "complete";

export default function DemoWorkflow() {
  const [state, setState] = useState<WorkflowState>("idle");
  const [progress, setProgress] = useState(0);

  const startDemo = () => {
    setState("uploading");
    setProgress(0);

    // Simulate upload
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setState("analyzing");
          setProgress(0);
          return 0;
        }
        return prev + 5;
      });
    }, 30);

    // Simulate analysis
    setTimeout(() => {
      const analyzeInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(analyzeInterval);
            setState("generating");
            setProgress(0);
            return 0;
          }
          return prev + 5;
        });
      }, 30);
    }, 1500);

    // Simulate test generation
    setTimeout(() => {
      const generateInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(generateInterval);
            setState("running");
            setProgress(0);
            return 0;
          }
          return prev + 5;
        });
      }, 30);
    }, 3000);

    // Simulate test execution
    setTimeout(() => {
      const runInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(runInterval);
            setState("complete");
            return 100;
          }
          return prev + 5;
        });
      }, 30);
    }, 4500);
  };

  const resetDemo = () => {
    setState("idle");
    setProgress(0);
  };

  const stateConfig = {
    idle: {
      title: "Ready for Demo",
      description: "Click to start the interactive workflow",
      icon: Upload,
      color: "cyan"
    },
    uploading: {
      title: "Uploading Video",
      description: "Transferring screen recording...",
      icon: Loader2,
      color: "cyan"
    },
    analyzing: {
      title: "Analyzing with AI",
      description: "Extracting UI states and user actions...",
      icon: Loader2,
      color: "magenta"
    },
    generating: {
      title: "Generating Test",
      description: "Creating Playwright test specification...",
      icon: Loader2,
      color: "lime"
    },
    running: {
      title: "Running Test",
      description: "Executing test and capturing results...",
      icon: Loader2,
      color: "cyan"
    },
    complete: {
      title: "Complete",
      description: "Test failed at step 3 - patch generated",
      icon: CheckCircle2,
      color: "magenta"
    }
  };

  const config = stateConfig[state];
  const Icon = config.icon;
  const colorClass = config.color === "cyan" ? "text-[var(--neon-cyan)]" :
                     config.color === "magenta" ? "text-[var(--neon-magenta)]" :
                     "text-[var(--neon-lime)]";
  const borderClass = config.color === "cyan" ? "neon-border-cyan" :
                      config.color === "magenta" ? "neon-border-magenta" :
                      "neon-border-lime";


  return (
    <div className="space-y-8">
      {/* Main Demo Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card className={`p-12 bg-card/50 backdrop-blur-sm border-2 ${borderClass} transition-all duration-300`}>
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Icon Animation */}
            <motion.div
              animate={state !== "idle" && state !== "complete" ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: state !== "idle" && state !== "complete" ? Infinity : 0 }}
            >
              <Icon className={`w-16 h-16 ${colorClass}`} />
            </motion.div>

            {/* Status Text */}
            <div className="space-y-2">
              <h3 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                {config.title}
              </h3>
              <p className="text-lg text-muted-foreground">{config.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-3">
              <div className="h-2 bg-muted/30 border border-border/30 overflow-hidden">
                <motion.div
                  className={`h-full ${
                    config.color === "cyan" ? "bg-[var(--neon-cyan)]" :
                    config.color === "magenta" ? "bg-[var(--neon-magenta)]" :
                    "bg-[var(--neon-lime)]"
                  }`}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-sm font-mono text-muted-foreground">
                {progress}%
              </div>
            </div>

            {/* Timeline */}
            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: "Upload", step: "uploading" },
                  { label: "Analyze", step: "analyzing" },
                  { label: "Generate", step: "generating" },
                  { label: "Execute", step: "running" },
                  { label: "Patch", step: "complete" }
                ].map((item, index) => {
                  const isActive = ["uploading", "analyzing", "generating", "running", "complete"].indexOf(state) >= index;
                  const isCurrent = state === item.step;

                  return (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center gap-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-sm font-bold transition-all ${
                          isActive
                            ? isCurrent
                              ? `border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)]`
                              : `border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]`
                            : "border-border/30 text-muted-foreground"
                        }`}
                        animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                      >
                        {isActive && state !== item.step ? "✓" : index + 1}
                      </motion.div>
                      <span className="text-xs font-mono text-muted-foreground">{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 pt-4">
              {state === "idle" ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={startDemo}
                    className="neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold px-8 py-6"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    START DEMO
                  </Button>
                </motion.div>
              ) : state === "complete" ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={resetDemo}
                    className="neon-border-magenta bg-[var(--neon-magenta)]/10 hover:bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)] font-bold px-8 py-6"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    RESTART DEMO
                  </Button>
                </motion.div>
              ) : null}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Output Cards - Show on complete */}
      <AnimatePresence>
        {state === "complete" && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Repro Steps */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm neon-border-cyan border-2">
              <h4 className="text-lg font-bold mb-4 text-[var(--neon-cyan)]" style={{ fontFamily: 'var(--font-display)' }}>
                REPRO STEPS
              </h4>
              <div className="space-y-3 text-sm font-mono">
                <div className="text-muted-foreground">
                  <span className="text-[var(--neon-cyan)]">1.</span> Open login page
                </div>
                <div className="text-muted-foreground">
                  <span className="text-[var(--neon-cyan)]">2.</span> Enter credentials
                </div>
                <div className="text-muted-foreground">
                  <span className="text-[var(--neon-cyan)]">3.</span> Click disabled button
                </div>
                <div className="text-[var(--neon-magenta)]">
                  <span className="text-[var(--neon-magenta)]">✗</span> Button remains disabled
                </div>
              </div>
            </Card>

            {/* Test Result */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm neon-border-magenta border-2">
              <h4 className="text-lg font-bold mb-4 text-[var(--neon-magenta)]" style={{ fontFamily: 'var(--font-display)' }}>
                TEST RESULT
              </h4>
              <div className="space-y-3 text-sm font-mono">
                <div className="text-muted-foreground">
                  Status: <span className="text-[var(--neon-magenta)]">FAILED</span>
                </div>
                <div className="text-muted-foreground">
                  Error: <span className="text-[var(--neon-magenta)]">Button not enabled</span>
                </div>
                <div className="text-muted-foreground">
                  Duration: <span className="text-[var(--neon-cyan)]">2.34s</span>
                </div>
                <div className="text-muted-foreground">
                  Step: <span className="text-[var(--neon-magenta)]">3 of 4</span>
                </div>
              </div>
            </Card>

            {/* Patch Suggestion */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm neon-border-lime border-2">
              <h4 className="text-lg font-bold mb-4 text-[var(--neon-lime)]" style={{ fontFamily: 'var(--font-display)' }}>
                PATCH
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-muted-foreground">
                  <span className="text-[var(--neon-magenta)]">-</span> disabled
                </div>
                <div className="text-muted-foreground">
                  <span className="text-[var(--neon-lime)]">+</span> disabled=&#123;!email&#125;
                </div>
                <div className="text-muted-foreground mt-3">
                  File: <span className="text-[var(--neon-cyan)]">LoginForm.tsx</span>
                </div>
                <div className="text-muted-foreground">
                  Lines: <span className="text-[var(--neon-cyan)]">15-20</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
