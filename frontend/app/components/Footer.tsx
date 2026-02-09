"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Github, Linkedin, ExternalLink, Cpu, ShieldCheck, 
  Zap, Activity, Code2, Database, Layers 
} from "lucide-react";

const TechStat = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{label}</span>
    <div className="flex items-center gap-2">
      <div className="w-1 h-3" style={{ backgroundColor: `var(--neon-${color})` }} />
      <span className="text-sm font-bold font-mono text-foreground">{value}</span>
    </div>
  </div>
);

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div 
      className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[var(--neon-cyan)]/10 blur-[120px]"
      animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[var(--neon-magenta)]/10 blur-[120px]"
      animate={{ x: [0, -50, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div 
      className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-[var(--neon-lime)]/5 blur-[100px]"
      animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1, 0.8] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

export default function Footer() {
  const [systemTime, setSystemTime] = useState("");
  const [latency, setLatency] = useState("24ms");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (Math.random() > 0.8) {
        setLatency(`${Math.floor(Math.random() * 20 + 15)}ms`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.footer
      className="relative border-t border-border/30 bg-background mt-32 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <AuroraBackground />
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="grid grid-cols-12 h-full w-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-[var(--neon-cyan)]/10 h-full last:border-r-0" />
          ))}
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--neon-cyan)]/50 to-transparent relative z-20" />

      <div className="container mx-auto px-6 md:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="space-y-4">
              <Link href="/" className="text-2xl font-bold inline-flex items-center gap-3 group" style={{ fontFamily: 'var(--font-display)' }}>
                <motion.span className="text-[var(--neon-cyan)]" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>▶</motion.span> 
                <span className="glitch tracking-widest" data-text="PATCHPILOT">PATCHPILOT</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed font-light">
                Autonomous bug resolution engine. Transforming visual recordings into production-ready patches with neural precision.
              </p>
            </div>
            <div className="p-6 bg-secondary/20 border border-border/30 backdrop-blur-xl relative group overflow-hidden rounded-sm">
              <div className="absolute top-0 right-0 p-2"><Activity className="w-3 h-3 text-[var(--neon-lime)] animate-pulse" /></div>
              <div className="grid grid-cols-2 gap-y-6 gap-x-6">
                <TechStat label="System Clock" value={systemTime || "00:00:00"} color="cyan" />
                <TechStat label="Latency" value={latency} color="magenta" />
                <TechStat label="Engine" value="v3.0.4" color="lime" />
                <TechStat label="Uptime" value="99.9%" color="cyan" />
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN - Links */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-6 lg:gap-8">
            <div className="flex flex-col gap-6 ">
              <h4 className="text-[10px] font-bold text-[var(--neon-cyan)] tracking-[0.3em] uppercase font-display">Engineers</h4>
              <div className="flex flex-col gap-8">
                <div className="group">
                  <p className="text-sm font-medium text-foreground group-hover:text-[var(--neon-cyan)] transition-colors mb-2">Azizbek Arzikulov</p>
                  <div className="flex gap-3">
                    <a href="https://github.com/azizbekdevuz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[var(--neon-cyan)] transition-colors"><Github className="w-4 h-4" /></a>
                    <a href="https://linkedin.com/in/azizbek-arzikulov/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[var(--neon-cyan)] transition-colors"><Linkedin className="w-4 h-4" /></a>
                  </div>
                </div>
                <div className="group">
                  <p className="text-sm font-medium text-foreground group-hover:text-[var(--neon-magenta)] transition-colors mb-2">Prithwis Das</p>
                  <div className="flex gap-3">
                    <a href="https://github.com/Prithwis-2023" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[var(--neon-magenta)] transition-colors"><Github className="w-4 h-4" /></a>
                    <a href="https://linkedin.com/in/prithwis-das/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[var(--neon-magenta)] transition-colors"><Linkedin className="w-4 h-4" /></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-bold text-[var(--neon-lime)] tracking-[0.3em] uppercase font-display">Protocol</h4>
              <ul className="flex flex-col gap-4">
                {['Features', 'Workflow', 'Demo', 'Simulator'].map((item) => (
                  <li key={item}>
                    <Link href={item === 'Simulator' ? '/workflow' : `/#${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-all flex items-center gap-3 group">
                      <span className="w-1 h-1 bg-border group-hover:bg-[var(--neon-lime)] group-hover:scale-150 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-bold text-[var(--neon-magenta)] tracking-[0.3em] uppercase font-display">Nexus</h4>
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <a href="https://github.com/SUNSET-Sejong-University" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-foreground hover:text-[var(--neon-magenta)] transition-colors flex items-center gap-2">SUNSET <ExternalLink className="w-3 h-3" /></a>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">Sejong University</p>
                </div>
                <div className="pt-4 border-t border-border/10">
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">&quot;The future of debugging is not finding errors, but predicting them.&quot;</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="relative p-8 border border-[var(--neon-cyan)]/20 bg-secondary/10 backdrop-blur-md overflow-hidden group rounded-sm">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--neon-cyan)]/10 blur-3xl group-hover:bg-[var(--neon-cyan)]/20 transition-all" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[var(--neon-cyan)]/10 rounded-sm"><Cpu className="w-6 h-6 text-[var(--neon-cyan)]" /></div>
                  <span className="text-[10px] font-bold font-mono tracking-widest">NODE_01_ACTIVE</span>
                </div>
                <div className="space-y-4">
                  <div className="h-[2px] w-full bg-muted/20 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[var(--neon-cyan)]" animate={{ width: ["20%", "85%", "40%", "95%", "60%"] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground tracking-tighter"><span>COMPUTE_LOAD</span><span>8.4 TFLOPS</span></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex -space-x-2">
                {[Layers, Code2, Database].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[var(--neon-cyan)] transition-all cursor-pointer"><Icon className="w-5 h-5" /></div>
                ))}
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">Tech Stack Verified</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground tracking-widest">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-lime)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
              SECURE_LINK_ESTABLISHED
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-muted-foreground/50"><ShieldCheck className="w-3 h-3" />AES_256_ENCRYPTED</div>
          </div>
          <div className="flex flex-col md:items-end gap-1">
            <p className="text-[10px] font-mono text-muted-foreground tracking-tighter">© 2026 PATCHPILOT // GEMINI_3_HACKATHON</p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--neon-magenta)] justify-center md:justify-end"><Zap className="w-3 h-3 fill-current" /><span>POWERED_BY_GEMINI_3_API</span></div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}