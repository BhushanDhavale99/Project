import { useEffect, useState } from "react";
import { Moon, Sun, Waves, Zap, Sunset, Crown, Palette } from "lucide-react";

export type ThemeId = "dark" | "light" | "ocean" | "cyber" | "sunset" | "premium";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  icon: typeof Moon;
  color: string;      // Primary swatch
  bgColor: string;    // Background swatch
  isDark: boolean;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "dark",
    name: "Dark",
    subtitle: "Midnight Cyan",
    icon: Moon,
    color: "#00f0ff",
    bgColor: "#0f172a",
    isDark: true,
  },
  {
    id: "light",
    name: "Light",
    subtitle: "Arctic Crisp",
    icon: Sun,
    color: "#0891b2",
    bgColor: "#f8fafc",
    isDark: false,
  },
  {
    id: "ocean",
    name: "Ocean",
    subtitle: "Sapphire Azure",
    icon: Waves,
    color: "#38bdf8",
    bgColor: "#09172e",
    isDark: true,
  },
  {
    id: "cyber",
    name: "Cyber",
    subtitle: "Electric Lime",
    icon: Zap,
    color: "#22c55e",
    bgColor: "#090d16",
    isDark: true,
  },
  {
    id: "sunset",
    name: "Sunset",
    subtitle: "Twilight Amber",
    icon: Sunset,
    color: "#f59e0b",
    bgColor: "#1a0b2e",
    isDark: true,
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Obsidian Gold",
    icon: Crown,
    color: "#eab308",
    bgColor: "#14120e",
    isDark: true,
  },
];

const STORAGE_KEY = "parkgrid-theme";
const DEFAULT_THEME: ThemeId = "dark";

export function getInitialTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (saved && THEMES.some((t) => t.id === saved)) {
      return saved;
    }
  } catch {}
  return DEFAULT_THEME;
}

export function applyTheme(themeId: ThemeId) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", themeId);

  const theme = THEMES.find((t) => t.id === themeId);
  if (theme && theme.isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(getInitialTheme);

  useEffect(() => {
    // Initial sync
    applyTheme(theme);

    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeId>;
      if (customEvent.detail && THEMES.some((t) => t.id === customEvent.detail)) {
        setThemeState(customEvent.detail);
        applyTheme(customEvent.detail);
      }
    };

    window.addEventListener("parkgrid-theme-change", onThemeChange);
    return () => window.removeEventListener("parkgrid-theme-change", onThemeChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      window.dispatchEvent(new CustomEvent("parkgrid-theme-change", { detail: newTheme }));
    } catch {}
  };

  const currentConfig = THEMES.find((t) => t.id === theme) || THEMES[0];

  return {
    theme,
    currentConfig,
    setTheme,
    themes: THEMES,
  };
}
