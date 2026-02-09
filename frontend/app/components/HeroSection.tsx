"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

/* 
  Design Philosophy: Cybernetic Brutalism
  Hero section with integrated trustworthy design elements
*/

export default function HeroSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 py-20 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="text-[var(--neon-cyan)] text-lg">▶</span>
              <span
                className="text-sm font-bold text-[var(--neon-magenta)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                AI-POWERED BUG DETECTION
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Transform Bugs
              <br />
              Into{" "}
              <span className="text-gradient-cyan">
                Patches
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Upload a screen recording of any web app bug. Get automated reproduction steps, Playwright tests, and AI-generated fix suggestions in seconds.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              className="grid grid-cols-2 gap-6 py-8 border-t border-b border-border/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { number: "10x", label: "Faster Bug Fixing" },
                { number: "99%", label: "Accuracy Rate" },
                { number: "500+", label: "Teams Using" },
                { number: "2.3s", label: "Avg Processing" }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-[var(--neon-cyan)]">
                    {item.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                className="neon-border-cyan bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] font-bold px-10 py-7 text-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                style={{ fontFamily: "var(--font-display)" }}
                asChild
              >
                <Link href="/workflow">
                  GET STARTED
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[var(--neon-magenta)] text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)]/10 font-bold px-8 py-6 text-lg"
                style={{ fontFamily: "var(--font-display)" }}
                onClick={() => {
                  const demoSection = document.getElementById("demo");
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                <Play className="mr-2 w-5 h-5" />
                WATCH DEMO
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Visual Element */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Outer glow circles */}
            <motion.div
              className="absolute w-96 h-96 border-2 border-[var(--neon-cyan)]/30 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-72 h-72 border-2 border-[var(--neon-magenta)]/30 rounded-full"
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            />

            {/* Center card - bigger, less CTA-like */}
            <motion.div
              className="relative z-10 w-96 h-[500px] bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-2 border-[var(--neon-cyan)]/30 rounded-2xl p-8 shadow-2xl"
              animate={{
                y: [0, -20, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Optional PatchPilot logo mark */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-[var(--neon-cyan)]/20 border border-[var(--neon-cyan)]/50 rounded-lg flex items-center justify-center">
                <span className="text-[var(--neon-cyan)] font-bold text-xs">PP</span>
              </div>
              {/* Card content */}
              <div className="space-y-6 h-full flex flex-col justify-between">
                {/* Header */}
                <div>
                  <div className="inline-block px-3 py-1 bg-[var(--neon-lime)]/20 border border-[var(--neon-lime)] rounded text-xs font-bold text-[var(--neon-lime)] mb-4">
                    PROCESSING
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Bug Analysis</h3>
                  <p className="text-sm text-muted-foreground">Real-time AI processing</p>
                </div>

                {/* Progress bars */}
                <div className="space-y-4">
                  {[
                    { label: "Video Analysis", progress: 100 },
                    { label: "Step Extraction", progress: 85 },
                    { label: "Test Generation", progress: 60 },
                    { label: "Patch Suggestion", progress: 30 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-[var(--neon-cyan)]">{item.progress}%</span>
                      </div>
                      <div className="h-1 bg-muted/30 border border-border/30 overflow-hidden rounded">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1.5, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 text-sm">
                  <motion.div
                    className="w-2 h-2 bg-[var(--neon-lime)] rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-muted-foreground">Processing... 2.1s</span>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 border-2 border-[var(--neon-magenta)]/40 rounded-lg"
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-[var(--neon-lime)]/40"
                style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                animate={{ rotate: [360, 270, 180, 90, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
