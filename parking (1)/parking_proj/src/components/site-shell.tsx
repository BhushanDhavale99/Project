import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, Menu, X, MapPin, UserRound, Bell, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import parkGridLogo from "@/assets/parkgrid-logo.png";
import { OpeningAnimation, replayParkingIntro } from "@/components/effects/OpeningAnimation";
import { ThemeSelector } from "@/components/ThemeSelector";

const links = [
  ["/", "Home"], ["/parking", "Parking"], ["/facilities", "Facilities"],
  ["/location", "Location"], ["/assistant", "AI Assistant"], ["/bookings", "My Bookings"],
] as const;

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <span className="flex items-center gap-2.5"><span className="grid size-12 sm:size-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-primary/30 bg-background shadow-[0_0_20px_var(--primary-glow)]"><img src={parkGridLogo} alt="ParkGrid One" className="size-full object-cover" /></span>{!compact && <span><strong className="block font-display text-sm leading-none">PARKGRID</strong><small className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">One · Baner</small></span>}</span>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => { const listener = () => setScrolled(window.scrollY > 24); listener(); window.addEventListener("scroll", listener, { passive: true }); return () => window.removeEventListener("scroll", listener); }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, []);
  return <div className="min-h-screen bg-background text-foreground">
    <OpeningAnimation />
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b transition-all duration-300", scrolled ? "border-border/80 bg-background/90 py-2 shadow-lg backdrop-blur-xl" : "border-transparent bg-transparent py-4")}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" aria-label="ParkGrid One home"><BrandMark /></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">{links.map(([to,label]) => { const active=path===to || (to!=="/" && path.startsWith(`${to}/`)); return <Link key={to} to={to} aria-current={active ? "page" : undefined} className={cn("relative rounded-md px-3 py-2 text-xs font-medium transition hover:bg-accent after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform", active && "text-primary after:scale-x-100")}>{label}</Link>; })}</nav>
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
    <footer className="border-t border-border bg-surface py-12"><div className="mx-auto grid max-w-[1440px] gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10"><div><BrandMark /><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">A smarter arrival at Baner’s premium connected parking facility.</p></div><div><h3 className="mb-3 text-sm font-semibold">Explore</h3><div className="grid gap-2 text-sm text-muted-foreground [&_a]:w-fit [&_a]:transition-colors hover:[&_a]:text-primary"><Link to="/parking">Parking</Link><Link to="/facilities">Facilities</Link><Link to="/assistant">AI Assistant</Link></div></div><div><h3 className="mb-3 text-sm font-semibold">Visit</h3><p className="flex gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" />18 High Street, Baner, Pune 411045</p></div><div><h3 className="mb-3 text-sm font-semibold">Legal</h3><div className="grid gap-2 text-sm text-muted-foreground"><span>Privacy</span><span>Terms</span><span>© 2026 ParkGrid One</span></div></div></div></footer>
  </div>;
}