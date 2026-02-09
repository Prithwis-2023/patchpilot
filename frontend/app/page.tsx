"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Video, Bot, CheckCircle2, Wrench, Zap, BarChart3 } from "lucide-react";
import DemoWorkflow from "./components/DemoWorkflow";
import WorkflowVisualizationImproved from "./components/WorkflowVisualizationImproved";
import CreatorSection from "./components/CreatorSection";
import HeroSection from "./components/HeroSection";
import MacOSCodeEditor from "./components/MacOSCodeEditor";

/* 
  Design Philosophy: Cybernetic Brutalism
  - Diagonal grid layouts with 15° rotation
  - Neon cyan/magenta/lime accents on charcoal base
  - Terminal-inspired typography and code blocks
  - Glitch effects and scanline overlays
  - Smooth framer-motion animations with aggressive easing
*/

export default function Home() {
  return (
    <div className="min-h-screen relative bg-background/85">
      {/* Navigation - sticky, right cluster, consistent naming */}
      <motion.nav 
        className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-sm bg-background/90"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-[var(--neon-cyan)]">▶</span> PATCHPILOT
          </Link>
          <div className="hidden md:flex items-center gap-6 font-mono text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">FEATURES</a>
            <a href="#workflow" className="text-muted-foreground hover:text-foreground transition-colors">WORKFLOW</a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">DEMO</a>
            <a href="#code-examples" className="text-muted-foreground hover:text-foreground transition-colors">CODE EXAMPLES</a>
            <a href="#creators" className="text-muted-foreground hover:text-foreground transition-colors">FROM THE CREATORS</a>
            <Link 
              href="/workflow" 
              className="px-4 py-2 bg-[var(--neon-cyan)]/10 border-2 border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)] font-bold hover:bg-[var(--neon-cyan)]/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
            >
              SIMULATOR →
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="relative z-10 py-12 md:py-24 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              POWERFUL <span className="text-gradient-magenta">FEATURES</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to automate bug detection and patch generation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Video,
                title: "Video Analysis",
                description: "Automatically extract UI states and user interactions from screen recordings"
              },
              {
                icon: Bot,
                title: "AI-Powered",
                description: "Powered by Gemini 3 for intelligent bug detection and analysis"
              },
              {
                icon: CheckCircle2,
                title: "Test Generation",
                description: "Generate production-ready Playwright tests automatically"
              },
              {
                icon: Wrench,
                title: "Patch Suggestions",
                description: "Get AI-generated fix suggestions with code modifications"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Process bugs in seconds, not hours"
              },
              {
                icon: BarChart3,
                title: "Detailed Reports",
                description: "Comprehensive reports with reproduction steps and metrics"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border/30 hover:border-[var(--neon-cyan)] rounded-lg transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <Icon className="w-10 h-10 mb-3 text-[var(--neon-cyan)]" />
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Visualization Section */}
      <section id="workflow" className="relative z-10 py-12 md:py-24 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              WORKFLOW <span className="text-gradient-cyan">ARCHITECTURE</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Seven-stage automated processing from video to production-ready patch
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <WorkflowVisualizationImproved />
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="relative z-10 py-12 md:py-24 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              INTERACTIVE <span className="text-gradient-lime">DEMO</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the complete workflow in real-time
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <DemoWorkflow />
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section id="code-examples" className="relative z-10 py-12 md:py-24 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              CODE <span className="text-gradient-magenta">EXAMPLES</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              See the quality of generated tests and patches
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <MacOSCodeEditor />
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <CreatorSection />

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t border-border/30 bg-muted/5 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>PRODUCT</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>COMPANY</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>LEGAL</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>SOCIAL</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition">GitHub</a></li>
                <li><a href="#" className="hover:text-foreground transition">Discord</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <div>© 2026 PatchPilot. All rights reserved.</div>
            <div className="mt-4 md:mt-0">Built with precision. Powered by Gemini 3.</div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
