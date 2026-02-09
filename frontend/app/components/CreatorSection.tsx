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
                    <Button
                      size="lg"
                      className="neon-border-magenta bg-[var(--neon-magenta)]/10 hover:bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)] font-bold text-lg px-12 py-8 transition-all duration-300"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <Play className="w-8 h-8 mr-3" />
                      WATCH VIDEO
                    </Button>
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
