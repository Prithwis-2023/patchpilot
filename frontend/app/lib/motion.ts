/**
 * PatchPilot Motion Variants
 * Reusable Framer Motion animations with reduced motion support
 */

import { Variants } from "framer-motion";

// Check for reduced motion preference
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Base transition settings
const baseTransition = {
  duration: prefersReducedMotion ? 0.01 : 0.2,
  ease: "easeInOut" as const,
};

const slowTransition = {
  duration: prefersReducedMotion ? 0.01 : 0.3,
  ease: "easeInOut" as const,
};

// Fade + Slide variants
export const fadeSlide: Variants = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : -8,
    transition: baseTransition,
  },
};

// Scale In variants
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: prefersReducedMotion ? 1 : 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: baseTransition,
  },
};

// Pop animation (for success states)
export const pop: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: prefersReducedMotion ? 0.01 : 0.3,
    },
  },
};

// Pulse animation (for loading states)
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: prefersReducedMotion ? 0.01 : 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Shimmer animation
export const shimmer: Variants = {
  animate: {
    backgroundPosition: ["0% 0%", "200% 0%"],
    transition: {
      duration: prefersReducedMotion ? 0.01 : 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Accordion expand
export const accordion: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: baseTransition,
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: slowTransition,
  },
};

// Button press
export const buttonPress = {
  scale: prefersReducedMotion ? 1 : 0.98,
  transition: {
    duration: 0.1,
  },
};

// Button hover
export const buttonHover = {
  scale: prefersReducedMotion ? 1 : 1.02,
  transition: {
    duration: 0.2,
  },
};

// Shake (for errors)
export const shake: Variants = {
  animate: {
    x: prefersReducedMotion
      ? [0]
      : [0, -4, 4, -4, 4, -2, 2, -1, 1, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// Glow pulse (for active/success states)
export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.3)",
      "0 0 30px rgba(59, 130, 246, 0.5)",
      "0 0 20px rgba(59, 130, 246, 0.3)",
    ],
    transition: {
      duration: prefersReducedMotion ? 0.01 : 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Slide in from direction
export const slideIn = (direction: "left" | "right" | "up" | "down" = "right"): Variants => {
  const directions = {
    left: { x: -20 },
    right: { x: 20 },
    up: { y: -20 },
    down: { y: 20 },
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: baseTransition,
    },
  };
};
