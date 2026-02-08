/**
 * PatchPilot Design System Tokens
 * Premium, futuristic design system with glassmorphism and depth
 */

export const tokens = {
  // Radii
  radius: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Shadows (depth layers)
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    glow: {
      blue: "0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)",
      green: "0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.1)",
      purple: "0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)",
    },
  },

  // Blur (glassmorphism)
  blur: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "24px",
  },

  // Semantic Colors
  color: {
    // Background layers
    bg: {
      base: "#0a0a0a", // Deep black
      surface: "#111111", // Slightly lighter
      elevated: "#1a1a1a", // Elevated surface
      glass: "rgba(255, 255, 255, 0.05)", // Glass overlay
    },
    // Surface colors
    surface: {
      default: "rgba(255, 255, 255, 0.03)",
      hover: "rgba(255, 255, 255, 0.05)",
      active: "rgba(255, 255, 255, 0.08)",
      glass: "rgba(255, 255, 255, 0.1)",
      "glass-strong": "rgba(255, 255, 255, 0.15)",
    },
    // Border colors
    border: {
      default: "rgba(255, 255, 255, 0.1)",
      hover: "rgba(255, 255, 255, 0.15)",
      active: "rgba(255, 255, 255, 0.2)",
      accent: "rgba(59, 130, 246, 0.3)",
    },
    // Text colors
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
      tertiary: "rgba(255, 255, 255, 0.5)",
      muted: "rgba(255, 255, 255, 0.4)",
    },
    // Accent colors
    accent: {
      blue: "#3b82f6",
      "blue-light": "#60a5fa",
      "blue-dark": "#2563eb",
      green: "#22c55e",
      "green-light": "#4ade80",
      purple: "#a855f7",
      "purple-light": "#c084fc",
      red: "#ef4444",
      "red-light": "#f87171",
    },
  },

  // Gradients
  gradient: {
    primary: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
    surface: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
    glow: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
  },

  // Spacing
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
  },

  // Typography
  typography: {
    font: {
      sans: "var(--font-inter)",
      mono: "var(--font-jetbrains)",
    },
    size: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
    },
    weight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  // Transitions
  transition: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
} as const;
