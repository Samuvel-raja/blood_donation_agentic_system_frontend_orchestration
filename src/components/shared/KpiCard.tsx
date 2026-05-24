type Trend = "up" | "down" | "flat";

export function KpiCard({
  label, value, delta, trend = "flat", hint, accent = "default",
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: Trend;
  hint?: string;
  accent?: "default" | "crimson" | "intel" | "success";
}) {
  const accentMap: Record<string, string> = {
    default: "text-muted-foreground",
    crimson: "text-crimson",
    intel: "text-intel",
    success: "text-success",
  };
  const trendColor =
    trend === "up" ? "text-success" : trend === "down" ? "text-crimson" : "text-muted-foreground";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border/80">
      <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: "var(--gradient-radial-crimson)" }} />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
          {delta ? (
            <span className={`font-mono text-[11px] font-medium ${trendColor}`}>{delta}</span>
          ) : null}
        </div>
        {hint ? (
          <p className={`mt-2 font-mono text-[10px] uppercase tracking-[0.14em] ${accentMap[accent]}`}>
            {hint}
          </p>
        ) : null}
        <Sparkline className="mt-4" />
      </div>
    </div>
  );
}

function Sparkline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 28" className={`h-7 w-full text-crimson/70 ${className}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 22 L12 18 L24 20 L36 14 L48 16 L60 10 L72 12 L84 6 L96 9 L108 4 L120 7 L120 28 L0 28 Z" fill="url(#sl)" />
      <path d="M0 22 L12 18 L24 20 L36 14 L48 16 L60 10 L72 12 L84 6 L96 9 L108 4 L120 7" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
