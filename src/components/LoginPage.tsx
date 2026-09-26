import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CarFront,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import parkGridLogo from "@/assets/parkgrid-logo.png";
import { soundFX } from "@/components/effects/soundEffects";
import "./LoginPage.css";

interface LoginPageProps {
  onLoginSuccess?: () => void;
  standalone?: boolean;
}

export function LoginPage({ onLoginSuccess, standalone = false }: LoginPageProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & validation states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<"email" | "google" | "github" | "demo" | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleCompleteAuth = (userName: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(`Access Granted · Welcome, ${userName}`);
    soundFX.playGateUnlock();

    // Persist login session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("parkgrid_authenticated", "true");
      sessionStorage.setItem("parkgrid_user_name", userName);
    }

    // Trigger subtle exit transition into intro animation
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (standalone) {
          navigate({ to: "/" });
        }
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 500);
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setErrorMessage("Please provide your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      if (!agreeTerms) {
        setErrorMessage("Please agree to the ParkGrid Terms & Privacy Policy.");
        return;
      }
    }

    setIsLoading(true);
    setLoadingMethod("email");

    // Realistic authentication delay simulation
    setTimeout(() => {
      handleCompleteAuth(mode === "signup" ? name : (email.split("@")[0] ?? "User"));
    }, 700);
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingMethod(provider);

    setTimeout(() => {
      handleCompleteAuth(provider === "google" ? "Google User" : "GitHub User");
    }, 700);
  };

  const handleDemoLogin = () => {
    setEmail("bhushan@parkgrid.one");
    setPassword("parkgrid2026");
    setIsLoading(true);
    setLoadingMethod("demo");

    setTimeout(() => {
      handleCompleteAuth("Bhushan Dhavale");
    }, 500);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !validateEmail(forgotEmail)) {
      return;
    }
    setForgotSent(true);
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotSent(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <div className={`login-page-container ${isExiting ? "login-exit-animation" : ""}`}>
      {/* ── Background Aesthetics ── */}
      <div className="login-grid-bg" aria-hidden="true" />
      <div className="login-glow-primary" aria-hidden="true" />
      <div className="login-glow-secondary" aria-hidden="true" />
      <div className="login-road-stripes" aria-hidden="true" />

      {/* ── Main Glassmorphic Login Card ── */}
      <div className="login-glass-card" role="region" aria-label="Sign In to ParkGrid">
        {/* Top Branding Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-background/60 border border-primary/40 shadow-[0_0_24px_rgba(0,242,254,0.2)] mb-3.5">
            <img src={parkGridLogo} alt="ParkGrid" className="size-10 object-contain" />
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary flex items-center justify-center gap-1.5 mb-1.5">
            <span className="live-dot" aria-hidden="true" />
            ParkGrid Secure Access // BKC • Mumbai
          </p>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {mode === "signin" ? "Welcome back to ParkGrid" : "Create your ParkGrid Account"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground italic font-mono">
            Smart parking. Simple. Fast. Secure.
          </p>
        </div>

        {/* Success or Error Banners */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 animate-in fade-in duration-200">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 animate-in fade-in duration-200">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* ── Social Login Buttons ── */}
        <div className="space-y-2.5">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
            className="login-social-btn"
            aria-label="Continue with Google"
          >
            {loadingMethod === "google" ? (
              <RefreshCw className="size-4 animate-spin text-primary" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Continue with GitHub */}
          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            disabled={isLoading}
            className="login-social-btn"
            aria-label="Continue with GitHub"
          >
            {loadingMethod === "github" ? (
              <RefreshCw className="size-4 animate-spin text-primary" />
            ) : (
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider OR */}
        <div className="login-divider">
          <span>Or with email</span>
        </div>

        {/* ── Email & Password Form ── */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="login-input-wrap">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bhushan Dhavale"
                    className="login-input"
                  />
                  <User className="login-input-icon" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Preferred Vehicle Plate{" "}
                  <span className="text-muted-foreground/60">(Optional)</span>
                </label>
                <div className="login-input-wrap">
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="MH 12 AB 1234"
                    className="login-input uppercase"
                  />
                  <CarFront className="login-input-icon" />
                </div>
              </div>
            </>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Email Address <span className="text-primary">*</span>
            </label>
            <div className="login-input-wrap">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="login-input"
                autoComplete="email"
              />
              <Mail className="login-input-icon" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Password <span className="text-primary">*</span>
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="login-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="login-input"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
              <Lock className="login-input-icon" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-eye"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign up only) */}
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Confirm Password <span className="text-primary">*</span>
              </label>
              <div className="login-input-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="login-input"
                  autoComplete="new-password"
                />
                <KeyRound className="login-input-icon" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="login-toggle-eye"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Remember Me / Terms Checkbox */}
          <div className="flex items-center justify-between pt-1">
            {mode === "signin" ? (
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-3.5 rounded border-white/20 bg-background/80 text-primary focus:ring-1 focus:ring-primary accent-cyan-400"
                />
                <span>Remember this terminal</span>
              </label>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="size-3.5 rounded border-white/20 bg-background/80 text-primary focus:ring-1 focus:ring-primary accent-cyan-400"
                />
                <span>Agree to ParkGrid Terms &amp; Privacy Policy</span>
              </label>
            )}
          </div>

          {/* Primary Submit Button */}
          <button type="submit" disabled={isLoading} className="login-submit-btn mt-4">
            {isLoading && loadingMethod === "email" ? (
              <>
                <RefreshCw className="size-4 animate-spin text-slate-900" />
                <span>Authenticating with ParkGrid Hub...</span>
              </>
            ) : mode === "signin" ? (
              <>
                <span>Login to ParkGrid</span>
                <ArrowRight className="size-4" />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ShieldCheck className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* ── Demo Quick Login Bypass ── */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] transition-colors"
          >
            <Sparkles className="size-3.5" />
            <span>⚡ Quick Demo Access</span>
          </button>

          <span className="text-[10px] font-mono text-muted-foreground/70">256-Bit Encrypted</span>
        </div>

        {/* ── Mode Switcher Footer ── */}
        <div className="mt-4 text-center">
          {mode === "signin" ? (
            <p className="text-xs text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMessage(null);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4 transition-colors"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMessage(null);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4 transition-colors"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>

      {/* ── Forgot Password Dialog ── */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">Reset Password</h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                Password recovery instructions have been sent to <strong>{forgotEmail}</strong>.
                Please check your inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Enter your registered ParkGrid email address and we'll send you an encrypted reset
                  link.
                </p>
                <div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-white/20 rounded-md text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-md hover:bg-cyan-300"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
