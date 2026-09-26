import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * NavigationProgress
 *
 * Provides an ultra-subtle, instantaneous top accent bar (like GitHub / Linear / Vercel)
 * when navigating between pages. Gives immediate responsiveness without ever
 * introducing jarring full-screen loading spinners or layout shifts.
 */
export function NavigationProgress() {
  const isLoading = useRouterState({
    select: (s) => s.isLoading || s.status === "pending",
  });
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setAnimating(true);
      setProgress(20);
      t1 = setTimeout(() => setProgress(55), 60);
      t2 = setTimeout(() => setProgress(82), 180);
    } else if (animating) {
      setProgress(100);
      t3 = setTimeout(() => {
        setAnimating(false);
        setProgress(0);
      }, 180);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isLoading, animating]);

  if (!animating && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="navigation-progress-bar pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2px] overflow-hidden bg-transparent"
    >
      <div
        className="h-full bg-primary shadow-[0_0_10px_var(--primary),0_0_3px_var(--primary)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "140ms" : "220ms",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
