"use client";

export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "patchpilot-theme";

/**
 * Get the initial theme from localStorage or system preference
 */
export function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light"; // SSR fallback
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // System preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;
  const resolvedTheme: "light" | "dark" =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  if (resolvedTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Save theme preference to localStorage
 */
export function saveTheme(theme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

/**
 * Listen to system theme changes (when theme is set to "system")
 */
export function watchSystemTheme(callback: (theme: "light" | "dark") => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }

  // Fallback for older browsers
  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
}
