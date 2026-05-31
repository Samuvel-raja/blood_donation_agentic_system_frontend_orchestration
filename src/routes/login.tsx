import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import {
  login as loginApi,
  register as registerApi,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api/auth";
import { useState, type FormEvent } from "react";
import {
  LogIn,
  UserPlus,
  Droplets,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "PulseXira" },
      { name: "description", content: "Sign in or create an account — PulseXira AI Blood Donation Orchestration." },
    ],
  }),
  component: LoginPage,
});

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

type Mode = "login" | "signup";

function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login: authLogin } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupBloodGroup, setSignupBloodGroup] = useState("");
  const [signupDob, setSignupDob] = useState("");
  const [signupAddress, setSignupAddress] = useState("");

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    router.navigate({ to: "/" }).catch(() => {});
    return null;
  }

  // ── Login handlers ────────────────────────────────────────────────

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const payload: LoginPayload = { email: email.trim(), password };
      const res = await loginApi(payload);
      authLogin(res.access_token, res.user);
      await router.navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Signup handlers ───────────────────────────────────────────────

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signupName.trim() || !signupEmail.trim() || !signupMobile.trim() ||
        !signupPassword || !signupBloodGroup || !signupDob || !signupAddress.trim()) {
      setError("All fields are required");
      return;
    }

    if (signupMobile.length !== 10 || !/^\d+$/.test(signupMobile)) {
      setError("Mobile number must be 10 digits");
      return;
    }

    setLoading(true);
    try {
      const payload: RegisterPayload = {
        name: signupName.trim(),
        email: signupEmail.trim(),
        mobile: signupMobile.trim(),
        password: signupPassword,
        blood_group: signupBloodGroup,
        date_of_birth: signupDob,
        address: signupAddress.trim(),
      };
      const res = await registerApi(payload);
      authLogin(res.access_token, res.user);
      await router.navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Mode switcher ─────────────────────────────────────────────────

  const switchMode = () => {
    setError(null);
    setMode((m) => (m === "login" ? "signup" : "login"));
  };

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-40 bg-gradient-radial-crimson opacity-60" />
      <div className="pointer-events-none absolute -inset-40 translate-x-1/3 translate-y-1/3 bg-gradient-radial-intel opacity-40" />

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center px-6">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="relative grid size-12 place-items-center rounded-xl bg-crimson shadow-glow-crimson">
            <Droplets className="size-6 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-semibold tracking-tight">PulseXira</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              orchestrator v2.4
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl border border-border bg-surface p-8 shadow-elevated">
          {/* Tabs */}
          <div className="mb-6 flex rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => mode !== "login" && switchMode()}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="size-3.5" />
              Sign in
            </button>
            <button
              type="button"
              onClick={() => mode !== "signup" && switchMode()}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="size-3.5" />
              Create account
            </button>
          </div>

          {mode === "login" ? (
            // ── Login Form ────────────────────────────────────────────
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-center text-xs text-muted-foreground">
                Authenticate to access the orchestration console
              </p>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-foreground/80">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@hospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-intel/60 focus:outline-none focus:ring-1 focus:ring-intel/40 transition-colors"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-medium text-foreground/80">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-intel/60 focus:outline-none focus:ring-1 focus:ring-intel/40 transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error ? (
                <div className="flex items-start gap-2 rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-2 text-xs text-crimson">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <LogIn className="size-4" />
                )}
                {loading ? "Authenticating…" : "Sign in"}
              </button>

              {/* Switch to signup */}
              <p className="pt-2 text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-medium text-intel hover:text-intel/80 transition-colors underline underline-offset-2"
                >
                  Create one
                </button>
              </p>
            </form>
          ) : (
            // ── Signup Form ───────────────────────────────────────────
            <form onSubmit={handleSignup} className="space-y-4">
              <p className="text-center text-xs text-muted-foreground">
                Register as a new donor or hospital staff member
              </p>

              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="signup-name" className="text-xs font-medium text-foreground/80">
                  Full name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Dr. Sarah Chen"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-intel/60 focus:outline-none focus:ring-1 focus:ring-intel/40 transition-colors"
                  disabled={loading}
                />
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="signup-email" className="text-xs font-medium text-foreground/80">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="sarah@hospital.org"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-intel/60 focus:outline-none focus:ring-1 focus:ring-intel/40 transition-colors"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="signup-mobile" className="text-xs font-medium text-foreground/80">
                    Mobile
                  </label>
                  <input
                    id="signup-mobile"
                    type="tel"
                    autoComplete="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-intel/60 focus:outline-none focus:ring-1 focus:ring-intel/40 transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Blood Group & DOB */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="signup-blood-group" className="text-xs font-medium text-foreground/80">
                    Blood group
                  </label>
                  <select
                    id="signup-blood-group"
                    value={signupBloodGroup}
                    onChange={(e) => setSignupBloodGroup(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-intel/60 focus:outline-none focus:ring-1 focus:ring-intel/40 transition-colors"
                    disabled={loading}
                  >
                    <option value="" disabled>Select</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="signup-dob" className="text-xs font-medium text-foreground/80">
                    Date of birth
                  </label>
                  <input
                    id="signup-dob"
                    type="date"
                    value={signupDob}
                    onChange={(e) => setSignupDob(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-intel/60 focus:outline-none focus:ring-1 focus:ring-intel/40 transition-colors [color-scheme:dark]"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label htmlFor="signup-address" className="text-xs font-medium text-foreground/80">
                  Address
                </label>
                <input
                  id="signup-address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="123 Main St, City, State"
                  value={signupAddress}
                  onChange={(e) => setSignupAddress(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-intel/60 focus:outline-none focus:ring-1 focus:ring-intel/40 transition-colors"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="text-xs font-medium text-foreground/80">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-intel/60 focus:outline-none focus:ring-1 focus:ring-intel/40 transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error ? (
                <div className="flex items-start gap-2 rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-2 text-xs text-crimson">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-intel px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                {loading ? "Creating account…" : "Create account"}
              </button>

              {/* Switch to login */}
              <p className="pt-2 text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-medium text-intel hover:text-intel/80 transition-colors underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-[10px] text-muted-foreground/60">
          PulseXira · AI Blood Donation Orchestration System
        </p>
      </div>
    </div>
  );
}
