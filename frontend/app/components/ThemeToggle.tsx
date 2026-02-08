"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { type Theme, saveTheme, watchSystemTheme } from "../lib/theme";
import { buttonHover, buttonPress } from "../lib/motion";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem("patchpilot-theme") as Theme | null;
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Watch system theme changes when theme is "system"
    if (theme === "system") {
      return watchSystemTheme((resolvedTheme) => {
        const root = document.documentElement;
        if (resolvedTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      });
    }
  }, [theme, mounted]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  if (!mounted) {
    // Prevent hydration mismatch by rendering nothing until mounted
    return (
      <div className={className}>
        <div className="h-8 w-24 rounded border border-soft bg-surface-2"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <label className="text-xs font-medium text-muted">Theme:</label>
      <div className="flex rounded border border-soft bg-surface-2 p-0.5">
        {(["system", "light", "dark"] as Theme[]).map((option) => (
          <motion.button
            key={option}
            onClick={() => handleThemeChange(option)}
            whileHover={buttonHover}
            whileTap={buttonPress}
            className={`px-2 py-1 text-xs font-medium transition-colors ${
              theme === option
                ? "bg-accent text-surface-1"
                : "text-muted hover:text-primary"
            }`}
            style={{
              borderRadius: "4px",
            }}
          >
            {option === "system" ? "Auto" : option === "light" ? "Light" : "Dark"}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
