// Map-only effects adapted from the supplied Bolt reference.
import { useReducedMotion } from "./useParkingMotion";
import { useEffect, useRef, type RefObject } from "react";
import { Car } from "lucide-react";
import "./parking-effects.css";
export function Gate({ label }: { label?: string }) {
  return (
    <span className="parking-gate" aria-hidden="true">
      <span className="gate-car">
        <Car size={18} />
      </span>
      <span className="gate-post" />
      <span className="gate-arm" />
      {label && <span className="gate-label">{label}</span>}
    </span>
  );
}

/** Decorative layers never receive pointer events or alter map transforms. */
export function MapEffects({ host }: { host: RefObject<HTMLDivElement | null> }) {
  const overlay = useRef<HTMLDivElement>(null);
  const route = useRef<SVGPathElement>(null);
  const car = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = host.current;
    if (!element || reduced) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0,
      x = -500,
      y = -500;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      overlay.current?.style.setProperty("--cursor-x", `${x}px`);
      overlay.current?.style.setProperty("--cursor-y", `${y}px`);
      const p = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
      element.style.setProperty("--map-drift", `${(p - 0.5) * 10}px`);
      element.style.setProperty("--vehicle-drift", `${(p - 0.5) * 4}px`);
      if (route.current) {
        route.current.style.strokeDashoffset = String(1 - p);
        const point = route.current.getPointAtLength(route.current.getTotalLength() * p);
        car.current?.setAttribute("transform", `translate(${point.x - 7} ${point.y - 7})`);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const move = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      schedule();
    };
    const leave = () => {
      x = y = -500;
      schedule();
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      element.style.removeProperty("--map-drift");
      element.style.removeProperty("--vehicle-drift");
    };
  }, [host, reduced]);
  return (
    <>
      <div ref={overlay} className="map-light" aria-hidden="true">
        <span className="parking-scanner" />
      </div>
      <div
        className="parking-route"
        aria-label="Illustrative route: Entrance to parking slot to exit"
      >
        <Gate label="ENTRY" />
        <svg viewBox="0 0 240 40" aria-hidden="true">
          <path
            d="M8 28 H80 Q90 28 90 18 V12 H145 V28 H232"
            fill="none"
            stroke="currentColor"
            opacity=".15"
          />
          <path
            ref={route}
            d="M8 28 H80 Q90 28 90 18 V12 H145 V28 H232"
            fill="none"
            stroke="currentColor"
            pathLength="1"
            strokeDasharray="1"
            strokeWidth="1.5"
          />
          <g ref={car}>
            <Car size={14} />
          </g>
          <text x="110" y="10" fill="currentColor" fontSize="8">
            P
          </text>
        </svg>
        <Gate label="EXIT" />
      </div>
    </>
  );
}
