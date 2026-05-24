import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · PulseXira" },
      { name: "description", content: "Donation success, workflow efficiency, and AI decision effectiveness." },
    ],
  }),
  component: AnalyticsPage,
});

const groupDemand = [
  { g: "O−", v: 92 }, { g: "O+", v: 78 }, { g: "A+", v: 64 }, { g: "A−", v: 51 },
  { g: "B+", v: 47 }, { g: "B−", v: 38 }, { g: "AB+", v: 33 }, { g: "AB−", v: 22 },
];

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Insights"
        title="Analytics & Reporting"
        description="Donor performance, workflow efficiency, and AI orchestration effectiveness."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Success rate" value="94.2%" delta="+1.8%" trend="up" accent="success" />
        <KpiCard label="Avg fulfillment" value="11m 04s" delta="−2m 11s" trend="down" accent="intel" />
        <KpiCard label="AI decisions" value="3,482" hint="last 7 days" />
        <KpiCard label="Batch retries" value="0.42/run" delta="−18%" trend="down" accent="success" />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Donation throughput · 30 days
              </p>
              <h3 className="mt-1 text-base font-semibold">Units secured per day</h3>
            </div>
            <div className="flex gap-2 font-mono text-[10px] uppercase text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-crimson" /> Critical</span>
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-intel" /> Urgent</span>
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-success" /> Routine</span>
            </div>
          </div>
          <AreaChart />
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Blood group demand
          </p>
          <h3 className="mt-1 text-base font-semibold">Last 7 days</h3>
          <ul className="mt-6 space-y-3">
            {groupDemand.map((g) => (
              <li key={g.g} className="flex items-center gap-3">
                <span className="w-10 font-mono text-xs">{g.g}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-crimson to-crimson-glow"
                    style={{ width: `${g.v}%` }} />
                </div>
                <span className="w-10 text-right font-mono text-xs tabular-nums text-muted-foreground">{g.v}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Geo />
        <div className="rounded-xl border border-border bg-surface p-6 xl:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            AI decision effectiveness
          </p>
          <h3 className="mt-1 text-base font-semibold">Routing accuracy by node</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { node: "decision_router", v: 96, runs: "1,204" },
              { node: "donor_search", v: 92, runs: "984" },
              { node: "batch_select", v: 89, runs: "812" },
              { node: "retry_flow", v: 81, runs: "342" },
            ].map((n) => (
              <div key={n.node} className="rounded-lg border border-border bg-background/40 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs text-intel">{n.node}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{n.runs} runs</span>
                </div>
                <p className="mt-3 text-2xl font-semibold tabular-nums">{n.v}%</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-intel" style={{ width: `${n.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AreaChart() {
  const points = [22, 28, 24, 35, 31, 40, 38, 46, 42, 52, 48, 55, 60, 58, 65, 62, 70, 68, 74, 72, 80, 76, 82, 79, 86, 84, 90, 88, 92, 95];
  const w = 700, h = 200;
  const step = w / (points.length - 1);
  const max = 100;
  const toY = (v: number) => h - (v / max) * (h - 20) - 10;
  const path = points.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${toY(v)}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-6 h-56 w-full text-crimson">
      <defs>
        <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1="0" x2={w} y1={h * p} y2={h * p} className="text-border" stroke="currentColor" strokeDasharray="2 4" />
      ))}
      <path d={area} fill="url(#ar)" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function Geo() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Geographic heatmap
      </p>
      <h3 className="mt-1 text-base font-semibold">Donor density · metro</h3>
      <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-lg border border-border bg-background grid-bg">
        {[
          { x: 22, y: 35, s: 60, c: "crimson" },
          { x: 58, y: 28, s: 90, c: "crimson" },
          { x: 71, y: 55, s: 50, c: "intel" },
          { x: 38, y: 62, s: 75, c: "crimson" },
          { x: 80, y: 78, s: 40, c: "intel" },
          { x: 14, y: 70, s: 35, c: "intel" },
        ].map((p, i) => (
          <span key={i}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-md ${
              p.c === "crimson" ? "bg-crimson/50" : "bg-intel/40"
            }`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }} />
        ))}
        {[
          { x: 22, y: 35 }, { x: 58, y: 28 }, { x: 71, y: 55 },
          { x: 38, y: 62 }, { x: 80, y: 78 }, { x: 14, y: 70 },
        ].map((p, i) => (
          <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-foreground"
            style={{ left: `${p.x}%`, top: `${p.y}%` }} />
        ))}
      </div>
    </div>
  );
}
