"use client";

import { motion } from "framer-motion";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Play, AlertTriangle, Zap, Rocket } from "lucide-react";

/* 
  Design Philosophy: Cybernetic Brutalism
  Creator video section with team explanation
*/

export default function CreatorSection() {
  return (
    <section id="creators" className="relative z-10 py-24 border-t border-border/30">
      <div className="container mx-auto px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h3
            className="text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            FROM THE <span className="text-gradient-magenta">CREATORS</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear directly from our team about why we built PatchPilot and how it transforms bug debugging
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm neon-border-magenta border-2 overflow-hidden">
              {/* Video Container */}
              <div className="aspect-video bg-muted/20 flex items-center justify-center relative overflow-hidden mb-8">
                <div className="w-full h-full bg-gradient-to-br from-[var(--neon-cyan)]/10 to-[var(--neon-magenta)]/10 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🎬</div>
                    <p className="text-muted-foreground">Video placeholder</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.button
                      className="group relative px-8 py-4 bg-transparent overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Holographic Shutter Background */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-md border border-[var(--neon-magenta)]/20 group-hover:border-[var(--neon-magenta)]/60 transition-all duration-500" />

                      {/* Animated Lens Flare / Scanning Line */}
                      <motion.div
                        className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-[var(--neon-magenta)] to-transparent opacity-50"
                        animate={{ x: ['0%', '1600%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />

                      {/* Rotating Focus Ring (Visible on Hover) */}
                      <motion.div
                        className="absolute -right-4 -top-4 w-16 h-16 border border-[var(--neon-magenta)]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />

                      {/* Button Content */}
                      <div className="relative flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          {/* Futuristic Play/Record Icon */}
                          <div className="w-3 h-3 border border-[var(--neon-magenta)] rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                          <motion.div
                            className="absolute w-1 h-1 bg-[var(--neon-magenta)]"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </div>

                        <div className="flex flex-col items-start">
                          <span className="text-[10px] font-mono text-[var(--neon-magenta)]/60 leading-none tracking-[0.2em] uppercase mb-1">
                            Signal_Locked
                          </span>
                          <span className="text-sm font-bold tracking-[0.1em] text-foreground font-display uppercase">
                            Video Coming Soon
                          </span>
                        </div>

                        {/* Chromatic Aberration Text Shadow (Hover Effect) */}
                        <span className="absolute inset-0 text-sm font-bold tracking-[0.1em] text-[var(--neon-cyan)] font-display uppercase opacity-0 group-hover:opacity-40 group-hover:translate-x-[1px] transition-all pointer-events-none">
                          Video Coming Soon
                        </span>
                      </div>

                      {/* Corner Brackets */}
                      <div className="absolute top-0 left-0 w-1 h-1 bg-[var(--neon-magenta)]" />
                      <div className="absolute bottom-0 right-0 w-1 h-1 bg-[var(--neon-magenta)]" />
                    </motion.button>
                  </motion.div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "The Problem",
                    description: "We spent 40% of our time manually reproducing bugs. Every bug report required hours of investigation, screen recording analysis, and test writing.",
                    icon: AlertTriangle
                  },
                  {
                    title: "Our Solution",
                    description: "PatchPilot automates the entire process. Upload a video, get reproduction steps, Playwright tests, and fix suggestions—all powered by Gemini 3.",
                    icon: Zap
                  },
                  {
                    title: "The Impact",
                    description: "Teams now reproduce bugs in minutes instead of hours. Developers focus on fixing, not investigating. QA workflows become 10x faster.",
                    icon: Rocket
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      className="p-6 bg-muted/10 border border-border/30 hover:border-[var(--neon-cyan)] transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Icon className="w-10 h-10 mb-3 text-[var(--neon-cyan)]" />
                      <h4
                        className="text-lg font-bold mb-2 text-[var(--neon-cyan)]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quote */}
              <motion.div
                className="mt-8 p-6 border-l-4 border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-lg italic text-muted-foreground mb-3">
                  &ldquo;PatchPilot isn&apos;t just a tool—it&apos;s a paradigm shift in how we approach bug debugging. By combining video analysis with AI-powered test generation, we&apos;ve eliminated the most tedious part of development.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)] rounded-full" />
                  <div>
                    <div className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                      The PatchPilot Team
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Built with precision. Powered by Gemini 3.
                    </div>
                  </div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
