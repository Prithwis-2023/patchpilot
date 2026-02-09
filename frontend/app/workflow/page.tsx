"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Upload, Play, CheckCircle2, AlertCircle, Code2, Download, Copy, Loader2 } from "lucide-react";
import MacOSCodeEditor from "@/app/components/MacOSCodeEditor";
import DiffViewer from "@/app/components/DiffViewer";
import MarkdownPreview from "@/app/components/MarkdownPreview";
import { usePatchpilotWorkflow } from "@/app/lib/usePatchpilotWorkflow";
import { WorkflowStep } from "@/app/lib/types";
import { useCopyFeedback } from "@/app/lib/useCopyFeedback";
import { useBackendHealth } from "@/app/lib/useBackendHealth";
import { type ApiCallInfo, BackendError } from "@/app/lib/backendAdapter";
import { ChevronDown, ChevronUp, Code, Wifi, WifiOff } from "lucide-react";
import Footer from "@/app/components/Footer";

/* 
  Design Philosophy: Cybernetic Brutalism
  Real workflow page with tabs wired to PatchPilot state machine
*/

type WorkflowTab = "upload" | "analysis" | "test" | "results" | "patch" | "export";

export default function WorkflowPage() {
  const {
    pipelineMode,
    setPipelineMode,
    uploadedFile,
    steps,
    data,
    setVideo,
    analyze,
    generateTest,
    runTest,
    generatePatch,
    exportBugReport,
    retry,
    reset,
    canGenerateTest,
    canRunTest,
    canGeneratePatch,
    canExport,
    httpAdapter,
  } = usePatchpilotWorkflow();

  const [activeTab, setActiveTab] = useState<WorkflowTab>("upload");
  const [devPanelOpen, setDevPanelOpen] = useState(false);
  const [lastApiCall, setLastApiCall] = useState<ApiCallInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const copyFeedback = useCopyFeedback();
  const { health } = useBackendHealth(pipelineMode);

  // Subscribe to API calls for debug panel
  useEffect(() => {
    if (!httpAdapter) {
      // Use setTimeout to avoid synchronous setState
      const timer = setTimeout(() => setLastApiCall(null), 0);
      return () => clearTimeout(timer);
    }

    const unsubscribe = httpAdapter.onApiCall((info) => {
      setLastApiCall(info);
    });

    // Get initial last call (async to avoid synchronous setState)
    const timer = setTimeout(() => {
      const initialCall = httpAdapter.getLastApiCall();
      if (initialCall) {
        setLastApiCall(initialCall);
      }
    }, 0);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [httpAdapter]);

  // Determine if tab is enabled
  const isTabEnabled = (tab: WorkflowTab): boolean => {
    switch (tab) {
      case "upload":
        return true;
      case "analysis":
        return steps[WorkflowStep.UPLOAD].status === "success";
      case "test":
        return steps[WorkflowStep.ANALYZE].status === "success";
      case "results":
        return steps[WorkflowStep.TEST].status === "success";
      case "patch":
        return steps[WorkflowStep.RUN].status === "success" && data.runResult?.status === "failed";
      case "export":
        return steps[WorkflowStep.PATCH].status === "success";
      default:
        return false;
    }
  };

  const handleFileUpload = (file: File) => {
    setVideo(file);
    // Don't auto-analyze - let user click button
  };

  const handleUploadAndAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    
    try {
      await analyze();
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleCopy = async (text: string) => {
    await copyFeedback.copyToClipboard(text);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { value: "upload", label: "Upload", icon: Upload, step: WorkflowStep.UPLOAD },
    { value: "analysis", label: "Analysis", icon: Play, step: WorkflowStep.ANALYZE },
    { value: "test", label: "Test", icon: Code2, step: WorkflowStep.TEST },
    { value: "results", label: "Results", icon: CheckCircle2, step: WorkflowStep.RUN },
    { value: "patch", label: "Patch", icon: Download, step: WorkflowStep.PATCH },
    { value: "export", label: "Export", icon: Download, step: WorkflowStep.EXPORT },
  ];

  return (
    <div className="min-h-screen relative bg-background/60">
      {/* Navigation - consistent with Home nav */}
      <motion.nav 
        className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-sm bg-background/75"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-[var(--neon-cyan)]">▶</span> PATCHPILOT
          </Link>
          <div className="hidden md:flex items-center gap-6 font-mono text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">HOME</Link>
            <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">FEATURES</Link>
            <Link href="/#workflow" className="text-muted-foreground hover:text-foreground transition-colors">WORKFLOW</Link>
            <Link href="/#demo" className="text-muted-foreground hover:text-foreground transition-colors">DEMO</Link>
            <Link href="/#code-examples" className="text-muted-foreground hover:text-foreground transition-colors">CODE EXAMPLES</Link>
            <Link href="/#creators" className="text-muted-foreground hover:text-foreground transition-colors">FROM THE CREATORS</Link>
            <span className="px-4 py-2 bg-[var(--neon-cyan)]/10 border-2 border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)] font-bold">WORKFLOW</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Backend Health Indicator */}
            {pipelineMode === "backend" && (
              <div className="flex items-center gap-2 px-3 py-1 rounded text-xs font-mono border border-border/30 bg-muted/20">
                {health.status === "connected" ? (
                  <>
                    <Wifi className="w-3 h-3 text-[var(--neon-lime)]" />
                    <span className="text-[var(--neon-lime)]">Backend: Connected</span>
                  </>
                ) : health.status === "offline" ? (
                  <>
                    <WifiOff className="w-3 h-3 text-[var(--neon-magenta)]" />
                    <span className="text-[var(--neon-magenta)]">Backend: Offline</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-[var(--neon-cyan)]" />
                    <span className="text-[var(--neon-cyan)]">Backend: Checking...</span>
                  </>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 bg-muted/30 border-2 border-border/50 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setPipelineMode("sample")}
                className={`px-4 py-2 rounded-md text-sm font-bold font-mono transition-all ${
                  pipelineMode === "sample"
                    ? "bg-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] border-2 border-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                }`}
              >
                Sample
              </button>
              <button
                onClick={() => setPipelineMode("backend")}
                className={`px-4 py-2 rounded-md text-sm font-bold font-mono transition-all ${
                  pipelineMode === "backend"
                    ? "bg-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] border-2 border-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                }`}
              >
                Backend
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="border-2 border-[var(--neon-magenta)]/50 bg-[var(--neon-magenta)]/10 hover:bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)] font-bold px-4 py-2 shadow-lg hover:shadow-[var(--neon-magenta)]/30"
            >
              Reset
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <section className="relative z-10 py-12 md:py-24 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              WORKFLOW <span className="text-gradient-cyan">SIMULATOR</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the complete PatchPilot workflow
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <Tabs value={activeTab} onValueChange={(value) => {
              if (isTabEnabled(value as WorkflowTab)) {
                setActiveTab(value as WorkflowTab);
              }
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2 mb-8 bg-muted/20 p-2 border border-border/30">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const enabled = isTabEnabled(tab.value as WorkflowTab);
                  const stepStatus = steps[tab.step]?.status;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      disabled={!enabled}
                      className="data-[state=active]:bg-[var(--neon-cyan)]/20 data-[state=active]:text-[var(--neon-cyan)] data-[state=active]:border-[var(--neon-cyan)] border border-border/30 disabled:opacity-30"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      {stepStatus === "success" && <CheckCircle2 className="w-3 h-3 ml-1 text-[var(--neon-lime)]" />}
                      {stepStatus === "error" && <AlertCircle className="w-3 h-3 ml-1 text-[var(--neon-magenta)]" />}
                      {stepStatus === "loading" && <Loader2 className="w-3 h-3 ml-1 animate-spin" />}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload" className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm neon-border-cyan border-2">
                  <div className="space-y-8">
                    <div className="text-center">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                        UPLOAD VIDEO
                      </h3>
                      <p className="text-muted-foreground">Select a screen recording of your bug</p>
                    </div>

                    {/* Upload area */}
                    <motion.div
                      className="border-2 border-dashed border-[var(--neon-cyan)]/50 rounded-lg p-12 text-center cursor-pointer hover:border-[var(--neon-cyan)] transition"
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <Upload className="w-16 h-16 mx-auto mb-4 text-[var(--neon-cyan)]" />
                        <h4 className="text-xl font-bold mb-2">Drop your video here</h4>
                        <p className="text-muted-foreground mb-4">or click to browse (MP4, WebM - max 500MB)</p>
                      </label>
                      {uploadedFile && !isUploading && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 space-y-4"
                        >
                          <div className="p-4 bg-muted/10 border border-[var(--neon-cyan)]/50 rounded">
                            <p className="font-mono text-sm text-[var(--neon-cyan)] mb-2">{uploadedFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <Button
                            onClick={handleUploadAndAnalyze}
                            disabled={steps[WorkflowStep.ANALYZE].status === "loading"}
                            className="w-full neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold py-6"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload & Analyze Video
                          </Button>
                        </motion.div>
                      )}
                      
                      {isUploading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-6 space-y-4"
                        >
                          <div className="p-4 bg-muted/10 border border-[var(--neon-cyan)]/50 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-mono text-sm text-[var(--neon-cyan)]">{uploadedFile?.name}</p>
                              <span className="text-xs font-mono text-[var(--neon-cyan)]">{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <Loader2 className="w-4 h-4 text-[var(--neon-cyan)] animate-spin" />
                              <p className="text-xs text-muted-foreground">
                                {uploadProgress < 50 ? "Uploading video..." : 
                                 uploadProgress < 90 ? "Processing video..." : 
                                 "Analyzing video..."}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Sample Mode Toggle */}
                    {pipelineMode === "sample" && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground font-mono">Sample Mode: Click any button to start</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { name: "Login Button Bug", size: "45MB" },
                            { name: "Form Validation Issue", size: "38MB" }
                          ].map((sample, index) => (
                            <motion.button
                              key={index}
                              className="p-4 border border-border/30 hover:border-[var(--neon-magenta)] bg-muted/10 rounded transition text-left"
                              whileHover={{ scale: 1.02, borderColor: "#ff00ff" }}
                              onClick={() => {
                                // Create a dummy file for sample mode
                                const dummyFile = new File([], "sample-bug.mp4", { type: "video/mp4" });
                                handleFileUpload(dummyFile);
                              }}
                            >
                              <div className="font-mono text-sm">{sample.name}</div>
                              <div className="text-xs text-muted-foreground">{sample.size}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis" className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm neon-border-magenta border-2">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        AI ANALYSIS
                      </h3>
                      <p className="text-muted-foreground">
                        {steps[WorkflowStep.ANALYZE].status === "loading" ? "Processing your video..." : 
                         steps[WorkflowStep.ANALYZE].status === "success" ? "Analysis complete" :
                         steps[WorkflowStep.ANALYZE].status === "error" ? "Analysis failed" :
                         "Ready to analyze"}
                      </p>
                    </div>

                    {steps[WorkflowStep.ANALYZE].status === "loading" && (
                      <div className="p-12 text-center">
                        <div className="space-y-4">
                          <Loader2 className="w-16 h-16 mx-auto text-[var(--neon-magenta)] animate-spin" />
                          <p className="text-muted-foreground mb-4">Analyzing video...</p>
                          <div className="max-w-md mx-auto space-y-3">
                            {[
                              { step: "Extracting frames", progress: 30 },
                              { step: "Detecting UI changes", progress: 60 },
                              { step: "Building timeline", progress: 90 }
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm text-foreground">{item.step}</span>
                                  <span className="text-xs font-mono text-[var(--neon-magenta)]">{item.progress}%</span>
                                </div>
                                <div className="h-2 bg-muted/30 border border-border/30 overflow-hidden rounded">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-cyan)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {steps[WorkflowStep.ANALYZE].status === "error" && (
                      <div className="p-6 bg-destructive/10 border border-destructive/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          <h4 className="font-bold text-destructive">Analysis Failed</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 break-words overflow-wrap-anywhere">{steps[WorkflowStep.ANALYZE].error}</p>
                        <Button
                          onClick={() => retry(WorkflowStep.ANALYZE)}
                          className="neon-border-magenta bg-[var(--neon-magenta)]/10 hover:bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)]"
                        >
                          Retry Analysis
                        </Button>
                      </div>
                    )}

                    {steps[WorkflowStep.ANALYZE].status === "success" && data.analysis && (
                      <>
                        {/* Analysis results */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/30">
                          <motion.div
                            className="p-4 bg-muted/10 border border-border/30 rounded text-center"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="text-2xl font-bold text-[var(--neon-magenta)]">{data.analysis.timeline.length}</div>
                            <div className="text-xs text-muted-foreground mt-1">Timeline Events</div>
                          </motion.div>
                          <motion.div
                            className="p-4 bg-muted/10 border border-border/30 rounded text-center"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="text-2xl font-bold text-[var(--neon-magenta)]">{data.analysis.reproSteps.length}</div>
                            <div className="text-xs text-muted-foreground mt-1">Repro Steps</div>
                          </motion.div>
                          <motion.div
                            className="p-4 bg-muted/10 border border-border/30 rounded text-center"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="text-2xl font-bold text-[var(--neon-magenta)]">{data.analysis.targetUrl ? "✓" : "—"}</div>
                            <div className="text-xs text-muted-foreground mt-1">Target URL</div>
                          </motion.div>
                        </div>

                        {/* Timeline */}
                        <div className="p-6 bg-muted/10 border border-[var(--neon-cyan)]/50 rounded-lg">
                          <h4 className="text-lg font-bold mb-4 text-[var(--neon-cyan)]" style={{ fontFamily: 'var(--font-display)' }}>
                            TIMELINE
                          </h4>
                          <div className="space-y-2 text-sm font-mono">
                            {data.analysis.timeline.map((event, index) => (
                              <div key={index} className="text-muted-foreground">
                                <span className="text-[var(--neon-cyan)]">{event.timestamp}</span> {event.description}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Repro Steps */}
                        <div className="p-6 bg-muted/10 border border-[var(--neon-magenta)]/50 rounded-lg">
                          <h4 className="text-lg font-bold mb-4 text-[var(--neon-magenta)]" style={{ fontFamily: 'var(--font-display)' }}>
                            REPRODUCTION STEPS
                          </h4>
                          <ol className="space-y-2 text-sm font-mono">
                            {data.analysis.reproSteps.map((step) => (
                              <li key={step.number} className="text-muted-foreground">
                                <span className="text-[var(--neon-magenta)]">{step.number}.</span> {step.description}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Next Step CTA */}
                        {!data.test && (
                          <Button
                            onClick={() => {
                              generateTest();
                              setActiveTab("test");
                            }}
                            disabled={!canGenerateTest}
                            className="w-full neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold py-6"
                          >
                            Generate Test
                          </Button>
                        )}
                      </>
                    )}

                    {steps[WorkflowStep.ANALYZE].status === "idle" && (
                      <Button
                        onClick={() => {
                          analyze();
                        }}
                        className="w-full neon-border-magenta bg-[var(--neon-magenta)]/10 hover:bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)] font-bold py-6"
                      >
                        Start Analysis
                      </Button>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Test Tab */}
              <TabsContent value="test" className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm neon-border-lime border-2">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        TEST GENERATION
                      </h3>
                      <p className="text-muted-foreground">
                        {steps[WorkflowStep.TEST].status === "loading" ? "Creating Playwright test specification..." :
                         steps[WorkflowStep.TEST].status === "success" ? "Test generated successfully" :
                         steps[WorkflowStep.TEST].status === "error" ? "Test generation failed" :
                         "Ready to generate test"}
                      </p>
                    </div>

                    {steps[WorkflowStep.TEST].status === "error" && (
                      <div className="p-6 bg-destructive/10 border border-destructive/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          <h4 className="font-bold text-destructive">Test Generation Failed</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 break-words overflow-wrap-anywhere">{steps[WorkflowStep.TEST].error}</p>
                        <Button
                          onClick={() => retry(WorkflowStep.TEST)}
                          className="neon-border-lime bg-[var(--neon-lime)]/10 hover:bg-[var(--neon-lime)]/20 text-[var(--neon-lime)]"
                        >
                          Retry Generation
                        </Button>
                      </div>
                    )}

                    {steps[WorkflowStep.TEST].status === "loading" && (
                      <div className="p-12 text-center">
                        <div className="space-y-4">
                          <Loader2 className="w-16 h-16 mx-auto text-[var(--neon-lime)] animate-spin" />
                          <p className="text-muted-foreground mb-4">Generating Playwright test...</p>
                          <div className="max-w-md mx-auto space-y-3">
                            {[
                              { step: "Analyzing reproduction steps", progress: 40 },
                              { step: "Writing test code", progress: 75 },
                              { step: "Validating syntax", progress: 100 }
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm text-foreground">{item.step}</span>
                                  <span className="text-xs font-mono text-[var(--neon-lime)]">{item.progress}%</span>
                                </div>
                                <div className="h-2 bg-muted/30 border border-border/30 overflow-hidden rounded">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-[var(--neon-lime)] to-[var(--neon-cyan)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {steps[WorkflowStep.TEST].status === "success" && data.test && (
                      <>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                          <MacOSCodeEditor codeSnippet={data.test.playwrightSpec} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            onClick={() => data.test && handleCopy(data.test.playwrightSpec)}
                            className="neon-border-lime bg-[var(--neon-lime)]/10 hover:bg-[var(--neon-lime)]/20 text-[var(--neon-lime)]"
                          >
                            {copyFeedback.copied ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Code
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => data.test && handleDownload(data.test.playwrightSpec, `${data.test.filename || "test"}.ts`)}
                            className="border-[var(--neon-lime)] text-[var(--neon-lime)]"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>

                        {!data.runResult && (
                          <Button
                            onClick={() => {
                              runTest();
                              setActiveTab("results");
                            }}
                            disabled={!canRunTest}
                            className="w-full neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold py-6"
                          >
                            Run Test
                          </Button>
                        )}
                      </>
                    )}

                    {steps[WorkflowStep.TEST].status === "idle" && (
                      <Button
                        onClick={() => {
                          generateTest();
                        }}
                        disabled={!canGenerateTest}
                        className="w-full neon-border-lime bg-[var(--neon-lime)]/10 hover:bg-[var(--neon-lime)]/20 text-[var(--neon-lime)] font-bold py-6"
                      >
                        Generate Test
                      </Button>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results" className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm neon-border-cyan border-2">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        TEST RESULTS
                      </h3>
                      <p className="text-muted-foreground">
                        {steps[WorkflowStep.RUN].status === "loading" ? "Executing test..." :
                         steps[WorkflowStep.RUN].status === "success" ? "Test execution completed" :
                         steps[WorkflowStep.RUN].status === "error" ? "Test execution failed" :
                         "Ready to run test"}
                      </p>
                    </div>

                    {steps[WorkflowStep.RUN].status === "loading" && (
                      <div className="p-12 text-center">
                        <div className="space-y-4">
                          <Loader2 className="w-16 h-16 mx-auto text-[var(--neon-cyan)] animate-spin" />
                          <p className="text-muted-foreground mb-4">Running Playwright test...</p>
                          <div className="max-w-md mx-auto space-y-3">
                            {[
                              { step: "Starting browser", progress: 25 },
                              { step: "Executing test", progress: 60 },
                              { step: "Capturing results", progress: 100 }
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm text-foreground">{item.step}</span>
                                  <span className="text-xs font-mono text-[var(--neon-cyan)]">{item.progress}%</span>
                                </div>
                                <div className="h-2 bg-muted/30 border border-border/30 overflow-hidden rounded">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {steps[WorkflowStep.RUN].status === "error" && (
                      <div className="p-6 bg-destructive/10 border border-destructive/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          <h4 className="font-bold text-destructive">Test Execution Failed</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 break-words overflow-wrap-anywhere">{steps[WorkflowStep.RUN].error}</p>
                        <Button
                          onClick={() => retry(WorkflowStep.RUN)}
                          className="neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"
                        >
                          Retry Execution
                        </Button>
                      </div>
                    )}

                    {steps[WorkflowStep.RUN].status === "success" && data.runResult && (
                      <>
                        {/* Result cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Repro Steps */}
                          {data.analysis && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="p-6 bg-muted/10 border border-[var(--neon-cyan)]/50 rounded-lg"
                            >
                              <h4 className="text-lg font-bold mb-4 text-[var(--neon-cyan)]" style={{ fontFamily: 'var(--font-display)' }}>
                                REPRO STEPS
                              </h4>
                              <ol className="space-y-3 text-sm font-mono">
                                {data.analysis.reproSteps.map((step) => (
                                  <li key={step.number} className="text-muted-foreground">
                                    <span className="text-[var(--neon-cyan)]">{step.number}.</span> {step.description}
                                  </li>
                                ))}
                              </ol>
                            </motion.div>
                          )}

                          {/* Test Status */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 bg-muted/10 border border-[var(--neon-magenta)]/50 rounded-lg"
                          >
                            <h4 className="text-lg font-bold mb-4 text-[var(--neon-magenta)]" style={{ fontFamily: 'var(--font-display)' }}>
                              STATUS
                            </h4>
                            <div className="space-y-3 text-sm font-mono">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Result:</span>
                                <span className={data.runResult.status === "failed" ? "text-[var(--neon-lime)]" : "text-[var(--neon-magenta)]"}>
                                  {data.runResult.status === "failed" ? "DETECTED" : data.runResult.status === "success" ? "NOT DETECTED" : String(data.runResult.status).toUpperCase()}
                                </span>
                              </div>
                              {data.runResult.stderr && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Error:</span>
                                  <span className="text-[var(--neon-magenta)] text-xs break-all">{data.runResult.stderr.substring(0, 50)}...</span>
                                </div>
                              )}
                              {steps[WorkflowStep.RUN].duration && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Duration:</span>
                                  <span className="text-[var(--neon-cyan)]">{(steps[WorkflowStep.RUN].duration! / 1000).toFixed(2)}s</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </div>

                        {/* Output logs */}
                        {(data.runResult.stdout || data.runResult.stderr) && (
                          <div className="p-6 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                            {data.runResult.stdout && (
                              <div className="space-y-1 mb-4">
                                <div className="text-[var(--neon-cyan)] mb-2">STDOUT:</div>
                                <pre className="text-slate-300 whitespace-pre-wrap">{data.runResult.stdout}</pre>
                              </div>
                            )}
                            {data.runResult.stderr && (
                              <div className="space-y-1">
                                <div className="text-[var(--neon-magenta)] mb-2">STDERR:</div>
                                <pre className="text-red-400 whitespace-pre-wrap">{data.runResult.stderr}</pre>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Screenshot */}
                        {data.runResult.screenshotUrl && (
                          <div className="p-6 bg-muted/10 border border-border/30 rounded-lg">
                            <h4 className="text-lg font-bold mb-4 text-[var(--neon-cyan)]" style={{ fontFamily: 'var(--font-display)' }}>
                              SCREENSHOT
                            </h4>
                            <div className="relative w-full h-64">
                              <Image
                                src={data.runResult.screenshotUrl}
                                alt="Test result screenshot"
                                fill
                                className="object-contain rounded border border-border/30"
                              />
                            </div>
                          </div>
                        )}

                        {/* Proceed button */}
                        {data.runResult.status === "failed" && !data.patch && (
                          <Button
                            onClick={() => {
                              generatePatch();
                              setActiveTab("patch");
                            }}
                            disabled={!canGeneratePatch}
                            className="w-full neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold py-6"
                          >
                            View Patch Suggestion
                          </Button>
                        )}

                        {data.runResult.status === "success" && (
                          <div className="p-6 bg-[var(--neon-lime)]/10 border border-[var(--neon-lime)]/50 rounded-lg text-center">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-[var(--neon-lime)]" />
                            <p className="text-lg font-bold text-[var(--neon-lime)]">Test Passed!</p>
                            <p className="text-sm text-muted-foreground mt-2">No patch needed - the test succeeded.</p>
                          </div>
                        )}
                      </>
                    )}

                    {steps[WorkflowStep.RUN].status === "idle" && (
                      <Button
                        onClick={() => {
                          runTest();
                        }}
                        disabled={!canRunTest}
                        className="w-full neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold py-6"
                      >
                        Run Test
                      </Button>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Patch Tab */}
              <TabsContent value="patch" className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm neon-border-lime border-2">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        PATCH SUGGESTION
                      </h3>
                      <p className="text-muted-foreground">
                        {steps[WorkflowStep.PATCH].status === "loading" ? "Generating patch suggestion..." :
                         steps[WorkflowStep.PATCH].status === "success" ? "AI-generated fix for the identified bug" :
                         steps[WorkflowStep.PATCH].status === "error" ? "Patch generation failed" :
                         "Ready to generate patch"}
                      </p>
                    </div>

                    {steps[WorkflowStep.PATCH].status === "loading" && (
                      <div className="p-12 text-center">
                        <div className="space-y-4">
                          <Loader2 className="w-16 h-16 mx-auto text-[var(--neon-lime)] animate-spin" />
                          <p className="text-muted-foreground mb-4">Analyzing error and generating fix...</p>
                          <div className="max-w-md mx-auto space-y-3">
                            {[
                              { step: "Analyzing test failure", progress: 35 },
                              { step: "Identifying root cause", progress: 70 },
                              { step: "Generating patch", progress: 100 }
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm text-foreground">{item.step}</span>
                                  <span className="text-xs font-mono text-[var(--neon-lime)]">{item.progress}%</span>
                                </div>
                                <div className="h-2 bg-muted/30 border border-border/30 overflow-hidden rounded">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-[var(--neon-lime)] to-[var(--neon-cyan)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {steps[WorkflowStep.PATCH].status === "error" && (
                      <div className="p-6 bg-destructive/10 border border-destructive/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          <h4 className="font-bold text-destructive">Patch Generation Failed</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 break-words overflow-wrap-anywhere">{steps[WorkflowStep.PATCH].error}</p>
                        <Button
                          onClick={() => retry(WorkflowStep.PATCH)}
                          className="neon-border-lime bg-[var(--neon-lime)]/10 hover:bg-[var(--neon-lime)]/20 text-[var(--neon-lime)]"
                        >
                          Retry Generation
                        </Button>
                      </div>
                    )}

                    {steps[WorkflowStep.PATCH].status === "success" && data.patch && (
                      <>
                        {/* Patch details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* File info */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 bg-muted/10 border border-[var(--neon-lime)]/50 rounded-lg space-y-4"
                          >
                            <h4 className="text-lg font-bold text-[var(--neon-lime)]" style={{ fontFamily: 'var(--font-display)' }}>
                              PATCH INFO
                            </h4>
                            <div className="space-y-2 text-sm font-mono">
                              <div>
                                <span className="text-muted-foreground">Risks:</span>
                                <div className="text-[var(--neon-cyan)]">{data.patch.risks.length}</div>
                              </div>
                            </div>
                          </motion.div>

                          {/* Rationale */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 bg-muted/10 border border-[var(--neon-magenta)]/50 rounded-lg"
                          >
                            <h4 className="text-lg font-bold mb-4 text-[var(--neon-magenta)]" style={{ fontFamily: 'var(--font-display)' }}>
                              ANALYSIS
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{data.patch.rationale}</p>
                          </motion.div>
                        </div>

                        {/* Code diff - VS Code style */}
                        <div className="p-6">
                          <DiffViewer diff={data.patch.diff} />
                        </div>

                        {/* Risks */}
                        {data.patch.risks.length > 0 && (
                          <div className="p-6 bg-muted/10 border border-[var(--neon-magenta)]/50 rounded-lg">
                            <h4 className="text-lg font-bold mb-4 text-[var(--neon-magenta)]" style={{ fontFamily: 'var(--font-display)' }}>
                              RISKS
                            </h4>
                            <ul className="space-y-2 text-sm font-mono">
                              {data.patch.risks.map((risk, index) => (
                                <li key={index} className="text-muted-foreground">
                                  <span className="text-[var(--neon-magenta)]">⚠</span> {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            onClick={() => data.patch && handleDownload(data.patch.diff, "patch.diff")}
                            className="neon-border-lime bg-[var(--neon-lime)]/10 hover:bg-[var(--neon-lime)]/20 text-[var(--neon-lime)]"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Patch
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => data.patch && handleCopy(data.patch.diff)}
                            className="border-[var(--neon-cyan)] text-[var(--neon-cyan)]"
                          >
                            {copyFeedback.copied ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Patch
                              </>
                            )}
                          </Button>
                        </div>

                        {!data.bugReport && (
                          <Button
                            onClick={() => {
                              exportBugReport();
                              setActiveTab("export");
                            }}
                            disabled={!canExport}
                            className="w-full neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold py-6"
                          >
                            Export Bug Report
                          </Button>
                        )}
                      </>
                    )}

                    {steps[WorkflowStep.PATCH].status === "idle" && (
                      <Button
                        onClick={() => {
                          generatePatch();
                        }}
                        disabled={!canGeneratePatch}
                        className="w-full neon-border-lime bg-[var(--neon-lime)]/10 hover:bg-[var(--neon-lime)]/20 text-[var(--neon-lime)] font-bold py-6"
                      >
                        Generate Patch
                      </Button>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Export Tab */}
              <TabsContent value="export" className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm neon-border-cyan border-2">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        EXPORT REPORT
                      </h3>
                      <p className="text-muted-foreground">
                        {steps[WorkflowStep.EXPORT].status === "loading" ? "Generating bug report..." :
                         steps[WorkflowStep.EXPORT].status === "success" ? "Bug report ready" :
                         steps[WorkflowStep.EXPORT].status === "error" ? "Export failed" :
                         "Ready to export"}
                      </p>
                    </div>

                    {steps[WorkflowStep.EXPORT].status === "loading" && (
                      <div className="p-12 text-center">
                        <div className="space-y-4">
                          <Loader2 className="w-16 h-16 mx-auto text-[var(--neon-cyan)] animate-spin" />
                          <p className="text-muted-foreground mb-4">Generating markdown report...</p>
                          <div className="max-w-md mx-auto space-y-3">
                            {[
                              { step: "Compiling analysis", progress: 40 },
                              { step: "Formatting report", progress: 75 },
                              { step: "Finalizing export", progress: 100 }
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm text-foreground">{item.step}</span>
                                  <span className="text-xs font-mono text-[var(--neon-cyan)]">{item.progress}%</span>
                                </div>
                                <div className="h-2 bg-muted/30 border border-border/30 overflow-hidden rounded">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {steps[WorkflowStep.EXPORT].status === "error" && (
                      <div className="p-6 bg-destructive/10 border border-destructive/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          <h4 className="font-bold text-destructive">Export Failed</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 break-words overflow-wrap-anywhere">{steps[WorkflowStep.EXPORT].error}</p>
                        <Button
                          onClick={() => retry(WorkflowStep.EXPORT)}
                          className="neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"
                        >
                          Retry Export
                        </Button>
                      </div>
                    )}

                    {steps[WorkflowStep.EXPORT].status === "success" && data.bugReport && (
                      <>
                        {/* Tabs for Preview and Raw */}
                        <Tabs defaultValue="preview" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/20 p-1 border border-border/30">
                            <TabsTrigger value="preview" className="data-[state=active]:bg-[var(--neon-cyan)]/20 data-[state=active]:text-[var(--neon-cyan)]">
                              Preview
                            </TabsTrigger>
                            <TabsTrigger value="raw" className="data-[state=active]:bg-[var(--neon-cyan)]/20 data-[state=active]:text-[var(--neon-cyan)]">
                              Raw Markdown
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="preview" className="mt-0">
                            <div className="p-6 bg-card/50 border border-border/50 rounded-lg max-h-[600px] overflow-y-auto">
                              <MarkdownPreview content={data.bugReport.markdown} />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="raw" className="mt-0">
                            <div className="p-6 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm max-h-[600px] overflow-y-auto">
                              <pre className="text-slate-300 whitespace-pre-wrap break-words">{data.bugReport.markdown}</pre>
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            onClick={() => data.bugReport && handleDownload(data.bugReport.markdown, "bug-report.md")}
                            className="neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Markdown
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => data.bugReport && handleCopy(data.bugReport.markdown)}
                            className="border-[var(--neon-cyan)] text-[var(--neon-cyan)]"
                          >
                            {copyFeedback.copied ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Markdown
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}

                    {steps[WorkflowStep.EXPORT].status === "idle" && (
                      <Button
                        onClick={() => {
                          exportBugReport();
                        }}
                        disabled={!canExport}
                        className="w-full neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold py-6"
                      >
                        Export Bug Report
                      </Button>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Dev Tools Panel (hidden by default, only in backend mode) */}
          {pipelineMode === "backend" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-6xl mx-auto mt-8"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDevPanelOpen(!devPanelOpen)}
                className="w-full text-xs font-mono text-muted-foreground hover:text-foreground border border-border/30"
              >
                <Code className="w-3 h-3 mr-2" />
                Dev Tools
                {devPanelOpen ? (
                  <ChevronUp className="w-3 h-3 ml-auto" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-auto" />
                )}
              </Button>

              {devPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border/30">
                    <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                      API DEBUG PANEL
                    </h3>

                    {lastApiCall ? (
                      <div className="space-y-4 text-xs font-mono">
                        {/* Last Call Summary */}
                        <div className="p-4 bg-muted/10 border border-border/30 rounded">
                          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                            <span className="text-[var(--neon-cyan)] font-bold break-all">
                              {lastApiCall.method} {lastApiCall.endpoint}
                            </span>
                            <span className="text-muted-foreground text-xs whitespace-nowrap">
                              {lastApiCall.timestamp}
                            </span>
                          </div>
                          {lastApiCall.duration && (
                            <div className="text-muted-foreground">
                              Duration: {lastApiCall.duration}ms
                            </div>
                          )}
                          {lastApiCall.error && (
                            <div className="mt-2 text-[var(--neon-magenta)] break-words overflow-wrap-anywhere">
                              <span className="font-semibold">Error:</span>{" "}
                              <span className="break-all">{lastApiCall.error.message}</span>
                            </div>
                          )}
                        </div>

                        {/* Request Payload */}
                        {lastApiCall.requestPayload !== undefined && lastApiCall.requestPayload !== null && (
                          <div>
                            <h4 className="text-sm font-bold mb-2 text-[var(--neon-cyan)]">Request Payload</h4>
                            <div className="p-3 bg-slate-950 border border-slate-700 rounded text-xs max-h-48 overflow-y-auto overflow-x-auto">
                              <pre className="text-slate-300 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                {(() => {
                                  try {
                                    const jsonStr = String(JSON.stringify(lastApiCall.requestPayload, null, 2));
                                    return jsonStr.length > 2000 ? jsonStr.substring(0, 2000) + "\n\n... (truncated)" : jsonStr;
                                  } catch {
                                    return String(lastApiCall.requestPayload);
                                  }
                                })()}
                              </pre>
                            </div>
                            {lastApiCall.requestPayloadSize !== undefined && (
                              <div className="text-muted-foreground mt-1">
                                Size: {(lastApiCall.requestPayloadSize / 1024).toFixed(2)} KB
                              </div>
                            )}
                          </div>
                        )}

                        {/* Response */}
                        {lastApiCall.response !== undefined && lastApiCall.response !== null && (
                          <div>
                            <h4 className="text-sm font-bold mb-2 text-[var(--neon-lime)]">Response</h4>
                            <div className="p-3 bg-slate-950 border border-slate-700 rounded text-xs max-h-64 overflow-y-auto overflow-x-auto">
                              <pre className="text-slate-300 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                {(() => {
                                  try {
                                    const jsonStr = String(JSON.stringify(lastApiCall.response, null, 2));
                                    return jsonStr.length > 3000 ? jsonStr.substring(0, 3000) + "\n\n... (truncated)" : jsonStr;
                                  } catch {
                                    return String(lastApiCall.response);
                                  }
                                })()}
                              </pre>
                            </div>
                            {lastApiCall.responseSize !== undefined && (
                              <div className="text-muted-foreground mt-1">
                                Size: {(lastApiCall.responseSize / 1024).toFixed(2)} KB
                              </div>
                            )}
                          </div>
                        )}

                        {/* Error Details */}
                        {lastApiCall.error && (
                          <div>
                            <h4 className="text-sm font-bold mb-2 text-[var(--neon-magenta)]">Error Details</h4>
                            <div className="p-3 bg-destructive/10 border border-destructive/50 rounded text-xs">
                              <div className="space-y-1">
                                <div>
                                  <span className="text-muted-foreground">Status:</span>{" "}
                                  <span className="text-[var(--neon-magenta)]">
                                    {lastApiCall.error instanceof BackendError ? lastApiCall.error.status || "N/A" : "N/A"}
                                  </span>
                                </div>
                                <div className="break-words">
                                  <span className="text-muted-foreground">Message:</span>{" "}
                                  <span className="text-[var(--neon-magenta)] break-all overflow-wrap-anywhere">
                                    {lastApiCall.error.message}
                                  </span>
                                </div>
                                {lastApiCall.error instanceof BackendError && lastApiCall.error.details !== undefined && lastApiCall.error.details !== null && (
                                  <div className="mt-2">
                                    <span className="text-muted-foreground">Details:</span>
                                    <div className="mt-1 max-h-64 overflow-y-auto overflow-x-auto">
                                      <pre className="text-slate-300 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                        {(() => {
                                          try {
                                            const jsonStr = String(JSON.stringify(lastApiCall.error.details, null, 2));
                                            return jsonStr.length > 2000 ? jsonStr.substring(0, 2000) + "\n\n... (truncated)" : jsonStr;
                                          } catch {
                                            const detailsStr = String(lastApiCall.error.details);
                                            return detailsStr.length > 2000 ? detailsStr.substring(0, 2000) + "... (truncated)" : detailsStr;
                                          }
                                        })()}
                                      </pre>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground font-mono">
                        No API calls yet. Make a request to see debug info.
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
