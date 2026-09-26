import { useTheme, type ThemeId, THEMES } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Returns the three swatch colors for a theme: [bg, accent, text].
 * These are approximate hex values to keep the component self-contained
 * (CSS vars aren't readable at render time without getComputedStyle).
 */
const THEME_SWATCHES: Record<ThemeId, [string, string, string]> = {
  dark: ["#0f172a", "#00f0ff", "#f0f9ff"],
  light: ["#f8fafc", "#0891b2", "#1e293b"],
  ocean: ["#09172e", "#38bdf8", "#e0f2fe"],
  cyber: ["#090d16", "#22c55e", "#f0fdf4"],
  sunset: ["#1a0b2e", "#f59e0b", "#fefce8"],
  premium: ["#14120e", "#eab308", "#fefce8"],
};

interface ThemeSelectorProps {
  className?: string;
  variant?: "dropdown" | "grid";
}

export function ThemeSelector({ className, variant = "dropdown" }: ThemeSelectorProps) {
  const { theme, setTheme, currentConfig } = useTheme();
  // currentConfig always has a value (useTheme returns THEMES[0] as fallback)
  const CurrentIcon = currentConfig!.icon;

  if (variant === "grid") {
    return (
      <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {THEMES.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.id;
          const [bgSwatch, accentSwatch, textSwatch] = THEME_SWATCHES[t.id];
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={cn(
                "relative flex items-center gap-3.5 rounded-lg border p-3.5 text-left transition-all duration-250",
                isActive
                  ? "border-primary bg-primary/10 shadow-[0_0_15px_var(--primary-glow)] ring-1 ring-primary"
                  : "border-border bg-surface hover:border-primary/50 hover:bg-accent/50",
              )}
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border/80 shadow-inner"
                style={{ backgroundColor: t.bgColor }}
              >
                <Icon className="size-5" style={{ color: t.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold text-foreground">
                    {t.name}
                  </span>
                  {/* 3 color swatches: bg, accent, text */}
                  <span className="flex gap-0.5">
                    <span
                      className="size-2 rounded-full border border-white/10"
                      style={{ backgroundColor: bgSwatch }}
                      title="Background"
                    />
                    <span
                      className="size-2 rounded-full border border-white/10"
                      style={{ backgroundColor: accentSwatch }}
                      title="Accent"
                    />
                    <span
                      className="size-2 rounded-full border border-white/10"
                      style={{ backgroundColor: textSwatch }}
                      title="Text"
                    />
                  </span>
                </div>
                <span className="block truncate text-xs text-muted-foreground">{t.subtitle}</span>
              </div>
              {isActive && (
                <div className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "flex items-center gap-1.5 px-2.5 text-xs text-muted-foreground transition-colors duration-250 hover:text-foreground hover:bg-accent focus-visible:ring-1",
            className,
          )}
          aria-label={`Change theme (Current: ${currentConfig!.name})`}
          title={`Theme: ${currentConfig!.name}`}
        >
          <Palette className="size-4 text-primary transition-transform duration-200 hover:rotate-12" />
          <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-wider">
            {currentConfig!.name}
          </span>
          {/* 3 tiny swatches next to the label */}
          <span className="hidden sm:flex gap-0.5 ml-0.5">
            {THEME_SWATCHES[currentConfig!.id].map((color, i) => (
              <span
                key={i}
                className="size-2 rounded-full border border-white/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-1.5 backdrop-blur-xl">
        <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1.5">
          Select Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {THEMES.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.id;
          const [bgSwatch, accentSwatch, textSwatch] = THEME_SWATCHES[t.id];
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "flex items-center justify-between cursor-pointer rounded-md px-2.5 py-2 text-xs transition-colors duration-250",
                isActive ? "bg-primary/15 text-primary font-medium" : "hover:bg-accent",
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-6 items-center justify-center rounded border border-border"
                  style={{ backgroundColor: t.bgColor }}
                >
                  <Icon className="size-3.5" style={{ color: t.color }} />
                </span>
                <div>
                  <span className="block leading-none">{t.name}</span>
                  <span className="font-mono text-[9px] text-muted-foreground mt-0.5 block">
                    {t.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* 3 color swatches: bg · accent · text */}
                <span className="flex gap-0.5" title="bg · accent · text">
                  <span
                    className="size-2.5 rounded-full border border-white/10"
                    style={{ backgroundColor: bgSwatch }}
                  />
                  <span
                    className="size-2.5 rounded-full border border-white/10"
                    style={{ backgroundColor: accentSwatch, boxShadow: `0 0 4px ${accentSwatch}` }}
                  />
                  <span
                    className="size-2.5 rounded-full border border-white/10"
                    style={{ backgroundColor: textSwatch }}
                  />
                </span>
                {isActive && <Check className="size-3.5 text-primary stroke-[3]" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
