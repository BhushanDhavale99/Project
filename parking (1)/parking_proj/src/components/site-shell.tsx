import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, Menu, X, MapPin, UserRound, Bell, ArrowUpRight, Sparkles, Clock, Navigation, Mail, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import parkGridLogo from "@/assets/parkgrid-logo.png";
import { OpeningAnimation, replayParkingIntro } from "@/components/effects/OpeningAnimation";
import { ThemeSelector } from "@/components/ThemeSelector";
import { CustomCursor } from "@/components/effects/CustomCursor";

const links = [
  ["/", "Home"],
  ["/parking", "Parking"],
  ["/facilities", "Facilities"],
  ["/location", "Location"],
  ["/assistant", "AI Assistant"],
  ["/bookings", "My Bookings"],
  ["/faq", "FAQs & Help Center"],
  ["/support", "Contact Support"],
] as const;

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <span className="flex items-center gap-2.5"><span className="grid size-12 sm:size-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-primary/30 bg-background shadow-[0_0_20px_var(--primary-glow)]"><img src={parkGridLogo} alt="ParkGrid One" className="size-full object-cover" /></span>{!compact && <span><strong className="block font-display text-sm leading-none">PARKGRID</strong><small className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">BKC · Mumbai</small></span>}</span>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => { const listener = () => setScrolled(window.scrollY > 24); listener(); window.addEventListener("scroll", listener, { passive: true }); return () => window.removeEventListener("scroll", listener); }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, []);
  return <div className="min-h-screen bg-background text-foreground">
    <CustomCursor />
    <OpeningAnimation />
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b transition-all duration-300", scrolled ? "border-border/80 bg-background/90 py-2 shadow-lg backdrop-blur-xl" : "border-transparent bg-transparent py-4")}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" aria-label="ParkGrid One home"><BrandMark /></Link>
        <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex" aria-label="Main navigation">{links.map(([to,label]) => { const active=path===to || (to!=="/" && path.startsWith(`${to}/`)); return <Link key={to} to={to} aria-current={active ? "page" : undefined} className={cn("relative whitespace-nowrap rounded-md px-2.5 xl:px-3 py-2 text-xs font-medium transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring after:absolute after:inset-x-2.5 xl:after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform", active && "text-primary after:scale-x-100")}>{label}</Link>; })}</nav>
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <Button size="sm" variant="ghost" onClick={replayParkingIntro} title="Replay Opening Animation" className="hidden xl:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400">
            <Sparkles className="size-3.5 text-cyan-400" /> Intro
          </Button>
          <Link to="/profile" className="hidden sm:block" aria-label="Profile"><Button size="icon" variant="ghost" aria-label="Profile"><UserRound /></Button></Link>
          <Link to="/notifications" className="hidden sm:block" aria-label="Notifications"><Button size="icon" variant="ghost" aria-label="Notifications"><Bell /></Button></Link>
          <Link to="/parking"><Button className="magnetic-cta">Book now <ArrowUpRight className="transition-transform group-hover:translate-x-1" /></Button></Link>
          <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      <div className={cn("grid transition-[grid-template-rows,opacity] duration-300 lg:hidden", open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0")}>
        <nav id="mobile-navigation" className="mx-4 mt-3 grid overflow-hidden border border-border bg-surface p-2 shadow-xl" aria-label="Mobile navigation">
          {links.map(([to,label], index) => <Link key={to} to={to} aria-current={path===to ? "page" : undefined} onClick={() => setOpen(false)} className="rounded-md px-4 py-3 text-sm transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring" style={{ transitionDelay: open ? `${index*30}ms` : "0ms" }}>{label}</Link>)}
          <div className="border-t border-border/80 my-1 pt-2 px-2">
            <span className="block text-[10px] font-mono uppercase text-muted-foreground mb-1.5">Theme</span>
            <ThemeSelector className="w-full justify-start py-2.5 px-3 border border-border" />
          </div>
          <button type="button" onClick={() => { setOpen(false); replayParkingIntro(); }} className="flex items-center gap-2 rounded-md px-4 py-3 text-left text-sm text-cyan-400 transition hover:bg-accent">
            <Sparkles className="size-4" /> Replay Opening Animation
          </button>
        </nav>
      </div>
    </header>
    <main>{children}</main>
    <Link to="/assistant" className="group fixed bottom-4 right-4 z-40 sm:bottom-5 sm:right-5" aria-label="Ask Parking AI"><span className="flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary text-primary-foreground shadow-[0_8px_32px_var(--primary-glow)] transition group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-ring sm:size-14"><Bot className="size-6" /></span><span className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-md bg-foreground px-3 py-2 text-xs text-background opacity-0 shadow-lg transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">Ask Parking AI</span></Link>
    <footer className="border-t border-border bg-surface" aria-label="Site footer">
      {/* ── Top grid ── */}
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">

        {/* ── Col 1: Brand ── */}
        <div className="flex flex-col gap-4">
          <Link to="/" aria-label="ParkGrid One home"><BrandMark /></Link>
          <p className="max-w-[240px] text-sm leading-6 text-muted-foreground">
            BKC Mumbai's premium connected parking facility — intelligent access, EV charging, and round-the-clock security.
          </p>
          <p className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-primary">
            <span className="live-dot" aria-hidden="true" /> Open 24 hours, every day
          </p>
        </div>

        {/* ── Col 2: Explore ── */}
        <div>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">Explore</h2>
          <nav aria-label="Footer navigation" className="grid gap-2">
            {([
              ["/",          "Home"],
              ["/parking",   "Parking"],
              ["/facilities","Facilities"],
              ["/parking",   "EV Charging"],
              ["/location",  "Location"],
              ["/assistant", "AI Assistant"],
              ["/bookings",  "My Bookings"],
            ] as const).map(([to, label]) => (
              <Link
                key={label}
                to={to}
                className="group flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm"
              >
                <ChevronRight className="size-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Col 3: Visit ── */}
        <div>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">Visit</h2>
          <ul className="grid gap-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Bandra Kurla Complex,<br />Mumbai, Maharashtra</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Open 24 hours · Every day<br /><span className="text-[11px] opacity-70">Speed limit 8 km/h inside</span></span>
            </li>
            <li className="flex items-start gap-2.5">
              <Navigation className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Near G-Block, Bandra East<br /><span className="text-[11px] opacity-70">Separate entry &amp; exit lanes</span></span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href="mailto:help@parkgrid.one" className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">help@parkgrid.one</a>
            </li>
            <li>
              <Link
                to="/location"
                className="inline-flex items-center gap-1.5 rounded-sm text-[11px] font-medium text-primary transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Get directions <ExternalLink className="size-3" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>

        {/* ── Col 4: Legal & Support ── */}
        <div>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">Legal &amp; Support</h2>
          <ul className="grid gap-2 text-sm">
            {([
              ["/information", "Privacy Policy"],
              ["/information", "Terms & Conditions"],
              ["/information", "Cancellation & Refund"],
              ["/information", "Parking Rules"],
              ["/faq",         "FAQs & Help Center"],
              ["/support",     "Contact Support"],
            ] as const).map(([to, label]) => (
              <li key={label}>
                <Link
                  to={to}
                  className="group flex w-fit items-center gap-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm"
                >
                  <ChevronRight className="size-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <p className="text-[11px] text-muted-foreground">
            © 2026 ParkGrid One · Bandra Kurla Complex, Mumbai
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            PARKGRID · BKC · MUMBAI
          </p>
        </div>
      </div>
    </footer>
  </div>;
}

