"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* 
  Design Philosophy: Cybernetic Brutalism
  Dynamic animated background with moving elements and glitch effects
*/

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      if (typeof window !== "undefined") {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", resizeCanvas);
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Draw animated grid lines
      ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      // Horizontal lines with wave effect
      for (let i = 0; i < canvas.height; i += 60) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const y = i + Math.sin(x * 0.01 + time) * 5;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Vertical lines with wave effect
      ctx.strokeStyle = "rgba(255, 0, 255, 0.05)";
      for (let i = 0; i < canvas.width; i += 60) {
        ctx.beginPath();
        for (let y = 0; y < canvas.height; y += 10) {
          const x = i + Math.cos(y * 0.01 + time) * 5;
          if (y === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw moving particles
      ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 5) * i + Math.sin(time + i) * 50;
        const y = canvas.height / 2 + Math.cos(time + i * 0.5) * 100;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw lime particles
      ctx.fillStyle = "rgba(0, 255, 0, 0.08)";
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 5) * i + Math.cos(time * 0.7 + i) * 60;
        const y = canvas.height / 3 + Math.sin(time * 0.7 + i * 0.5) * 80;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw magenta particles
      ctx.fillStyle = "rgba(255, 0, 255, 0.08)";
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 5) * i + Math.sin(time * 0.5 + i) * 40;
        const y = (canvas.height * 2) / 3 + Math.cos(time * 0.5 + i * 0.5) * 60;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", resizeCanvas);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left floating shape */}
        <motion.div
          className="absolute w-96 h-96 border-2 border-[var(--neon-cyan)]/20 rounded-full"
          style={{ top: "-100px", left: "-100px" }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            rotate: [0, 90, 180]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Top-right floating shape */}
        <motion.div
          className="absolute w-80 h-80 border-2 border-[var(--neon-magenta)]/20"
          style={{
            top: "-50px",
            right: "-50px",
            clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            rotate: [0, -90, -180]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Bottom-left floating shape */}
        <motion.div
          className="absolute w-72 h-72 border-2 border-[var(--neon-lime)]/20"
          style={{
            bottom: "-50px",
            left: "-50px",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Bottom-right floating shape */}
        <motion.div
          className="absolute w-96 h-96 border-2 border-[var(--neon-cyan)]/15"
          style={{
            bottom: "-100px",
            right: "-100px"
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, -60, 0],
            rotate: [0, 270, 360]
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </>
  );
}
