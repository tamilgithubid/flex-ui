"use client";

import type { FlexUITheme } from "@/lib/themes";
import { DEFAULT_THEME, getTheme, getThemeNames, themes } from "@/lib/themes";
import { THEME_TOKENS } from "@/lib/themes/tokens";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

interface ThemeContextValue {
  /** Current active theme */
  theme: FlexUITheme;
  /** Current theme name */
  themeName: string;
  /** Switch to a different theme */
  setTheme: (name: string) => void;
  /** List of all available theme names */
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "flexui-theme";

const THEME_EVENT = "flexui-theme-change";
let memoryTheme: string | null = null;
function subscribeTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}
function readTheme(defaultTheme: string) {
  let stored = memoryTheme;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch {}
  return stored && themes[stored] ? stored : defaultTheme;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Default theme name (falls back to "midnight") */
  defaultTheme?: string;
  /** Force a specific theme (ignores localStorage) */
  forcedTheme?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  forcedTheme,
}: ThemeProviderProps) {
  const storedTheme = useSyncExternalStore(
    subscribeTheme, () => readTheme(defaultTheme), () => defaultTheme,
  );
  const themeName = forcedTheme ?? storedTheme;

  // Apply CSS variables to document root
  useEffect(() => {
    const theme = getTheme(themeName);
    const root = document.documentElement;

    for (const token of THEME_TOKENS) {
      const value = theme.tokens[token];
      if (value) {
        root.style.setProperty(token, value);
      }
    }

    // Set data attribute for CSS selectors
    root.setAttribute("data-flexui-theme", themeName);
  }, [themeName]);

  const setTheme = useCallback(
    (name: string) => {
      if (forcedTheme) return;
      const resolved = themes[name] ? name : DEFAULT_THEME;
      memoryTheme = resolved;
      try {
        localStorage.setItem(STORAGE_KEY, resolved);
      } catch {
        // The in-memory value still updates this tab when storage is unavailable.
      }
      window.dispatchEvent(new Event(THEME_EVENT));
    },
    [forcedTheme]
  );

  const theme = getTheme(themeName);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        setTheme,
        availableThemes: getThemeNames(),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
