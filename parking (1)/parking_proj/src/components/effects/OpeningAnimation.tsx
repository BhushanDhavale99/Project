import { useState, useEffect, useRef } from "react";
import { soundFX } from "./soundEffects";
import { Volume2, VolumeX, FastForward, Play, ShieldCheck, Zap, Sparkles } from "lucide-react";
import "./OpeningAnimation.css";

interface OpeningAnimationProps {
  forcePlay?: boolean;
  onComplete?: () => void;
}

export function OpeningAnimation({ forcePlay = false, onComplete }: OpeningAnimationProps) {
  // Check if already seen in this tab session (unless forced)
  const [active, setActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (forcePlay) return true;
    const hasSeen = sessionStorage.getItem("parkgrid_seen_intro");
    return !hasSeen;
  });

  const [phase, setPhase] = useState<number>(0);
  // Phase 0: 0.0s - 0.8s Approaching gate
  // Phase 1: 0.8s - 1.5s Scanning & Barrier Opening
  // Phase 2: 1.5s - 2.6s Driving & Turning to Bay A-12
  // Phase 3: 2.6s - 3.4s Docking into Bay A-12 & Sensor Lock
  // Phase 4: 3.4s - 4.1s Welcome Celebration & Logo
  // Phase 5: 4.1s Exit fade out

  const [progress, setProgress] = useState(0);
  const [terminalMsg, setTerminalMsg] = useState("INITIALIZING SMART ENTRY SENSORS...");
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());
  const [isExiting, setIsExiting] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Allow replaying anytime via custom window event
  useEffect(() => {
    const handleReplay = () => {
      setIsExiting(false);
      setPhase(0);
      setProgress(0);
      setTerminalMsg("RE-INITIALIZING PARKGRID TELEMETRY...");
      startTimeRef.current = null;
      setActive(true);
    };

    window.addEventListener("replay-parking-intro", handleReplay);
    return () => window.removeEventListener("replay-parking-intro", handleReplay);
  }, []);

  const dismiss = () => {
    setIsExiting(true);
    sessionStorage.setItem("parkgrid_seen_intro", "true");
    setTimeout(() => {
      setActive(false);
      setIsExiting(false);
      onComplete?.();
    }, 600);
  };

  // Keyboard shortcut: ESC to skip
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Main animation timeline
  useEffect(() => {
    if (!active || isExiting) return;

    const DURATION = 4200; // 4.2 seconds total cinematic experience

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const p = Math.min(1, elapsed / DURATION);
      setProgress(Math.round(p * 100));

      if (elapsed < 800) {
        if (phase !== 0) {
          setPhase(0);
          setTerminalMsg("SYSTEM: DETECTING VEHICLE APPROACH // BKC INGRESS");
        }
      } else if (elapsed < 1600) {
        if (phase !== 1) {
          setPhase(1);
          setTerminalMsg("ANPR: PLATE MH 12 AB 1234 VERIFIED // GATE 01 CLEAR");
          soundFX.playScan();
          setTimeout(() => soundFX.playGateUnlock(), 350);
        }
      } else if (elapsed < 2700) {
        if (phase !== 2) {
          setPhase(2);
          setTerminalMsg("VALET GUIDANCE: SMART ARROWS ENGAGED // ROUTING TO A-12");
          soundFX.playRadarPing();
        }
      } else if (elapsed < 3500) {
        if (phase !== 3) {
          setPhase(3);
          setTerminalMsg("ULTRASONIC DOCKING: PROXIMITY CONFIRMED // BAY A-12 LOCKED");
          soundFX.playDockSuccess();
        }
      } else if (elapsed < 4200) {
        if (phase !== 4) {
          setPhase(4);
          setTerminalMsg("RESERVATION ACTIVE // WELCOME TO PARKGRID ONE");
        }
      } else {
        // Complete
        dismiss();
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, phase, isExiting]);

  if (!active) return null;

  // Car position interpolation based on progress
  let carX = 140;
  let carY = 580;
  let carAngle = 0; // facing up (North)
  let gateAngle = 0; // barrier closed
  let isLaserActive = false;
  let isBayLocked = false;

  if (progress < 20) {
    // Phase 0: 0% to 20%
    const localT = progress / 20;
    carX = 140;
    carY = 580 - localT * 220; // from 580 down to 360
    carAngle = 0;
  } else if (progress < 38) {
    // Phase 1: 20% to 38% - At gate, scanning, gate opening
    carX = 140;
    carY = 360;
    carAngle = 0;
    isLaserActive = true;
    const localT = (progress - 20) / 18;
    gateAngle = localT * -82; // gate opens up
  } else if (progress < 65) {
    // Phase 2: 38% to 65% - Driving through gate, turning right, speeding along driveway
    gateAngle = -82;
    const localT = (progress - 38) / 27;
    if (localT < 0.35) {
      // corner turn: from (140, 360) turning right to (240, 270)
      const turnT = localT / 0.35;
      carX = 140 + turnT * 100;
      carY = 360 - turnT * 90;
      carAngle = turnT * 90; // turning right
    } else {
      // driving straight east along access lane towards bay A-12
      const straightT = (localT - 0.35) / 0.65;
      carX = 240 + straightT * 440; // from 240 to 680
      carY = 270;
      carAngle = 90;
    }
  } else {
    // Phase 3 & 4: 65% to 100% - Turn into bay A-12 and dock
    gateAngle = -82;
    isBayLocked = true;
    const localT = Math.min(1, (progress - 65) / 22);
    if (localT < 0.5) {
      const turnT = localT / 0.5;
      carX = 680 + turnT * 10;
      carY = 270 - turnT * 70;
      carAngle = 90 - turnT * 90; // rotate from 90 back to 0 (pointing north into bay)
    } else {
      const dockT = (localT - 0.5) / 0.5;
      carX = 690;
      carY = 200 - dockT * 75; // from 200 to 125
      carAngle = 0;
    }
  }

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFX.setMuted(next);
  };

  return (
    <div className={`opening-animation-overlay ${isExiting ? "opening-exit" : ""}`} role="dialog" aria-modal="true" aria-label="ParkGrid Opening Sequence">
      {/* Background Cyber Floor */}
      <div className="cyber-grid-floor" />

      {/* Floating Particles */}
      <div className="particle-layer">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${(i * 7.5 + 3) % 96}%`,
              animationDuration: `${3.5 + (i % 4)}s`,
              animationDelay: `${(i * 0.3) % 2.5}s`,
            }}
          />
        ))}
      </div>

      {/* Top HUD Header */}
      <div className="hud-header">
        <div className="flex items-center gap-3">
          <div className="hud-badge">
            <span className="hud-radar-pulse" />
            <span>PARKGRID // ONE · OS 4.2</span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] text-cyan-400/80 tracking-widest">
            BANER HIGH STREET · LEVEL 1 SENSORS ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="skip-btn !p-2"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-cyan-400" />}
          </button>

          <button
            onClick={dismiss}
            className="skip-btn"
            title="Skip Intro (Press Esc)"
          >
            <span>Skip</span>
            <FastForward className="size-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Stage */}
      <div className="stage-container">
        <svg
          viewBox="0 0 1000 640"
          className="size-full overflow-visible drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="headlightGlow" cx="50%" cy="100%" r="90%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#00f0ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>

            <linearGradient id="bayActiveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.25)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.04)" />
            </linearGradient>

            <linearGradient id="bayReservedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0, 240, 255, 0.18)" />
              <stop offset="100%" stopColor="rgba(0, 240, 255, 0.02)" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="superGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Road Network Tarmac */}
          {/* Main Ingress Road */}
          <path
            d="M 90 640 L 90 320 Q 90 220 190 220 L 880 220 L 880 320 L 210 320 Q 190 320 190 340 L 190 640 Z"
            fill="url(#roadGrad)"
            stroke="rgba(0, 240, 255, 0.2)"
            strokeWidth="1.5"
          />

          {/* Road Center Line (Dashed) */}
          <path
            d="M 140 640 L 140 330 Q 140 270 200 270 L 850 270"
            fill="none"
            stroke="rgba(0, 240, 255, 0.35)"
            strokeWidth="2"
            strokeDasharray="16 14"
          />

          {/* Dynamic Holographic Guide Arrows along driveway */}
          {[280, 380, 480, 580].map((arrowX, i) => (
            <g
              key={i}
              className="guide-arrow"
              style={{ animationDelay: `${i * 0.25}s` }}
              transform={`translate(${arrowX}, 270)`}
            >
              <path
                d="M -10 -12 L 8 0 L -10 12"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M -22 -12 L -4 0 L -22 12"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
              />
            </g>
          ))}

          {/* Other Parking Bays (Context) */}
          {/* Bay A-10 */}
          <g transform="translate(480, 70)">
            <rect
              width="90"
              height="140"
              rx="6"
              fill="rgba(239, 68, 68, 0.08)"
              stroke="rgba(239, 68, 68, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <text x="45" y="45" fill="rgba(239, 68, 68, 0.6)" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              A-10
            </text>
            <text x="45" y="65" fill="rgba(239, 68, 68, 0.5)" fontSize="9" fontFamily="monospace" textAnchor="middle">
              OCCUPIED
            </text>
            {/* Parked Vehicle Silhouette in A-10 */}
            <rect x="20" y="30" width="50" height="95" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />
          </g>

          {/* Target Parking Bay A-12 (The Hero Bay) */}
          <g transform="translate(640, 70)">
            {/* Bay Ground Glow & Area */}
            <rect
              width="100"
              height="145"
              rx="8"
              fill={isBayLocked ? "url(#bayActiveGrad)" : "url(#bayReservedGrad)"}
              stroke={isBayLocked ? "#10b981" : "#00f0ff"}
              strokeWidth={isBayLocked ? "2.5" : "1.5"}
              className="transition-colors duration-500"
              filter={isBayLocked ? "url(#superGlow)" : "url(#neonGlow)"}
            />

            {/* Corner Locking Brackets */}
            <path
              d="M 6 22 L 6 6 L 22 6"
              fill="none"
              stroke={isBayLocked ? "#10b981" : "#00f0ff"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 94 22 L 94 6 L 78 6"
              fill="none"
              stroke={isBayLocked ? "#10b981" : "#00f0ff"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 6 123 L 6 139 L 22 139"
              fill="none"
              stroke={isBayLocked ? "#10b981" : "#00f0ff"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 94 123 L 94 139 L 78 139"
              fill="none"
              stroke={isBayLocked ? "#10b981" : "#00f0ff"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Bay Markings */}
            <text
              x="50"
              y="32"
              fill={isBayLocked ? "#34d399" : "#38bdf8"}
              fontSize="14"
              fontFamily="monospace"
              textAnchor="middle"
              fontWeight="bold"
              letterSpacing="1"
            >
              [P] A-12
            </text>

            <text
              x="50"
              y="48"
              fill={isBayLocked ? "#10b981" : "#00f0ff"}
              fontSize="9"
              fontFamily="monospace"
              textAnchor="middle"
              letterSpacing="1"
            >
              {isBayLocked ? "● RESERVED & LOCKED" : "TARGET ASSIGNED"}
            </text>

            {/* Ultrasonic Sensor Radar Rings on Curb */}
            {isBayLocked && (
              <g transform="translate(50, 10)">
                <circle cx="0" cy="0" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" className="sonar-wave" />
                <circle cx="0" cy="0" r="28" fill="none" stroke="#10b981" strokeWidth="1.5" className="sonar-wave" style={{ animationDelay: "0.4s" }} />
                <circle cx="0" cy="0" r="42" fill="none" stroke="#10b981" strokeWidth="1.5" className="sonar-wave" style={{ animationDelay: "0.8s" }} />
              </g>
            )}

            {/* EV Fast Charger Station Post */}
            <g transform="translate(85, -20)">
              <rect x="0" y="0" width="16" height="24" rx="4" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.5" />
              <path d="M 8 5 L 5 13 L 9 13 L 8 19 L 13 11 L 9 11 Z" fill="#10b981" />
            </g>
          </g>

          {/* Bay A-14 */}
          <g transform="translate(800, 70)">
            <rect
              width="90"
              height="140"
              rx="6"
              fill="rgba(16, 185, 129, 0.05)"
              stroke="rgba(16, 185, 129, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <text x="45" y="45" fill="rgba(16, 185, 129, 0.6)" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              A-14
            </text>
            <text x="45" y="65" fill="rgba(16, 185, 129, 0.5)" fontSize="9" fontFamily="monospace" textAnchor="middle">
              AVAILABLE
            </text>
          </g>

          {/* Toll Gate Infrastructure at (190, 320) */}
          <g transform="translate(190, 310)">
            {/* ANPR Scanner Pillar */}
            <rect x="-14" y="-30" width="28" height="60" rx="4" fill="#090d16" stroke="#00f0ff" strokeWidth="1.5" />
            {/* Status Display Screen */}
            <rect x="-10" y="-24" width="20" height="12" rx="2" fill={phase >= 1 ? "#064e3b" : "#450a0a"} />
            <text
              x="0"
              y="-15"
              fill={phase >= 1 ? "#34d399" : "#f87171"}
              fontSize="7"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              {phase >= 1 ? "OPEN" : "HALT"}
            </text>

            {/* Smart Boom Barrier Arm */}
            <g
              transform={`rotate(${gateAngle}, -14, 0)`}
              className="transition-transform duration-700 ease-out"
            >
              <rect
                x="-14"
                y="-4"
                width="74"
                height="8"
                rx="2"
                fill="#e2e8f0"
                stroke="#00f0ff"
                strokeWidth="1"
              />
              {/* Barrier diagonal neon stripes */}
              <line x1="2" y1="-4" x2="-6" y2="4" stroke="#ef4444" strokeWidth="4" />
              <line x1="22" y1="-4" x2="14" y2="4" stroke="#ef4444" strokeWidth="4" />
              <line x1="42" y1="-4" x2="34" y2="4" stroke="#ef4444" strokeWidth="4" />
              {/* Neon edge glow on arm */}
              <line x1="-14" y1="-4" x2="60" y2="-4" stroke={phase >= 1 ? "#10b981" : "#ef4444"} strokeWidth="2" filter="url(#neonGlow)" />
            </g>

            {/* Laser ANPR Scanning Plane */}
            {isLaserActive && (
              <g className="laser-scan" transform="translate(-70, 0)">
                <line x1="0" y1="0" x2="45" y2="0" stroke="#00f0ff" strokeWidth="3" opacity="0.9" />
                <polygon points="0,0 45,0 35,-35 10,-35" fill="rgba(0, 240, 255, 0.15)" />
              </g>
            )}
          </g>

          {/* THE CAR COMPONENT */}
          <g
            transform={`translate(${carX}, ${carY}) rotate(${carAngle})`}
            className="transition-transform duration-75 ease-linear"
          >
            {/* Headlights Light Cones (Forward Projections) */}
            <polygon
              points="-18,-45 -80,-240 80,-240 18,-45"
              fill="url(#headlightGlow)"
              className="headlight-cone"
            />

            {/* Cyan Neon Underglow */}
            <ellipse
              cx="0"
              cy="0"
              rx="32"
              ry="54"
              fill="rgba(0, 240, 255, 0.45)"
              filter="url(#superGlow)"
            />

            {/* 4 Wheels */}
            {/* Front Left */}
            <rect x="-26" y="-38" width="8" height="18" rx="3" fill="#020617" stroke="#00f0ff" strokeWidth="1" />
            {/* Front Right */}
            <rect x="18" y="-38" width="8" height="18" rx="3" fill="#020617" stroke="#00f0ff" strokeWidth="1" />
            {/* Rear Left */}
            <rect x="-26" y="22" width="8" height="18" rx="3" fill="#020617" stroke="#00f0ff" strokeWidth="1" />
            {/* Rear Right */}
            <rect x="18" y="22" width="8" height="18" rx="3" fill="#020617" stroke="#00f0ff" strokeWidth="1" />

            {/* Main Chassis Body */}
            <path
              d="
                M -18 -45 
                Q 0 -52 18 -45
                L 22 -32
                Q 24 -15 22 10
                L 23 38
                Q 20 50 14 52
                L -14 52
                Q -20 50 -23 38
                L -22 10
                Q -24 -15 -22 -32
                Z
              "
              fill="#090d16"
              stroke="#00f0ff"
              strokeWidth="2"
              filter="url(#neonGlow)"
            />

            {/* Hood Styling & Badge */}
            <path d="M -10 -40 L 0 -48 L 10 -40" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="0" cy="-35" r="2.5" fill="#00f0ff" />

            {/* Tinted Panoramic Windshield & Roof */}
            <path
              d="M -14 -22 L 14 -22 L 16 12 L -16 12 Z"
              fill="rgba(15, 23, 42, 0.95)"
              stroke="#00f0ff"
              strokeWidth="1"
            />
            {/* Roof Glass Highlight */}
            <line x1="-8" y1="-18" x2="8" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />

            {/* Dual Front LED Headlight Projectors */}
            <ellipse cx="-13" cy="-44" rx="4" ry="2" fill="#ffffff" filter="url(#neonGlow)" />
            <ellipse cx="13" cy="-44" rx="4" ry="2" fill="#ffffff" filter="url(#neonGlow)" />

            {/* Full-Width Rear LED Taillight Bar (Red) */}
            <path
              d="M -16 50 L 16 50"
              stroke="#ef4444"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#neonGlow)"
            />

            {/* Car License Plate Annotation */}
            <g transform="translate(0, 68)">
              <rect x="-35" y="-8" width="70" height="15" rx="3" fill="rgba(15, 23, 42, 0.9)" stroke="#00f0ff" strokeWidth="1" />
              <text x="0" y="3" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                MH 12 AB 1234
              </text>
            </g>
          </g>
        </svg>

        {/* Phase 4: Big Grand Welcome Overlay */}
        {phase >= 4 && (
          <div className="dock-announcement animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>VEHICLE DOCKED & VERIFIED</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white mb-2 drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]">
              PARKGRID <span className="text-cyan-400">ONE</span>
            </h1>

            <p className="font-mono text-xs sm:text-sm text-cyan-200/80 tracking-widest uppercase max-w-md">
              SMART CONNECTED PARKING · BANER, PUNE
            </p>

            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><Zap className="size-3.5 text-emerald-400" /> EV CHARGER ARMED</span>
              <span>·</span>
              <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-cyan-400" /> CALM ARRIVAL READY</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry HUD Bar */}
      <div className="hud-bottom">
        <div className="telemetry-card">
          <div className="terminal-text">
            <span className="text-cyan-400 font-bold">&gt;&gt;</span>
            <span>{terminalMsg}</span>
            <span className="terminal-cursor" />
          </div>

          <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>BAY: <strong className="text-cyan-300">A-12</strong></span>
            <span>LEVEL: <strong className="text-cyan-300">1</strong></span>
            <span>RADAR: <strong className={isBayLocked ? "text-emerald-400" : "text-amber-400"}>{isBayLocked ? "LOCKED" : "TRACKING"}</strong></span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="hud-progress-track">
          <div className="hud-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

/** Global trigger helper so any button can replay the opening animation */
export function replayParkingIntro() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("parkgrid_seen_intro");
    window.dispatchEvent(new CustomEvent("replay-parking-intro"));
  }
}

