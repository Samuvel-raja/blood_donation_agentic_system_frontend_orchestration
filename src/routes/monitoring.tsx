import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { EventStream } from "@/components/shared/EventStream";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Live Monitoring · PulseXira" },
      { name: "description", content: "Real-time donor responses, delivery tracking, and system telemetry." },
    ],
  }),
  component: MonitoringPage,
});

const responses = [
  { donor: "Elena Rodriguez", group: "O−", channel: "WhatsApp", state: "accepted" as const, latency: "00:42" },
  { donor: "Marcus Thorne", group: "O−", channel: "SMS", state: "accepted" as const, latency: "00:18" },
  { donor: "Samir Kapoor", group: "AB+", channel: "WhatsApp", state: "pending" as const, latency: "02:14" },
  { donor: "Naomi Chen", group: "B+", channel: "Email", state: "rejected" as const, latency: "04:02" },
  { donor: "Julian Vane", group: "A−", channel: "WhatsApp", state: "pending" as const, latency: "01:33" },
  { donor: "Priya Anand", group: "O+", channel: "SMS", state: "accepted" as const, latency: "00:55" },
];

function MonitoringPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Live telemetry"
        title="Real-Time Monitoring Center"
        description="Donor responses, channel delivery, scheduler countdowns, and orchestration health."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Engine latency" value="22ms" delta="p95 41ms" hint="Healthy" accent="success" />
        <KpiCard label="Queue depth" value="3" hint="dispatch.notify" accent="intel" />
        <KpiCard label="Webhook errors" value="0" delta="last 1h" trend="flat" accent="success" />
        <KpiCard label="Accept rate" value="71%" delta="+3.1%" trend="up" accent="success" />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Donor Response Stream</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="grid grid-cols-12 gap-4 border-b border-border bg-background/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              <div className="col-span-4">Donor</div>
              <div className="col-span-2">Group</div>
              <div className="col-span-2">Channel</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Latency</div>
            </div>
            <div className="divide-y divide-border">
              {responses.map((r, i) => (
                <div key={i} className="grid grid-cols-12 items-center gap-4 px-5 py-3 text-sm hover:bg-accent/40 animate-ticker"
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="col-span-4 truncate">{r.donor}</div>
                  <div className="col-span-2 font-mono text-xs">{r.group}</div>
                  <div className="col-span-2 text-xs text-muted-foreground">{r.channel}</div>
                  <div className="col-span-2"><StatusBadge variant={r.state}>{r.state}</StatusBadge></div>
                  <div className="col-span-2 text-right font-mono text-xs tabular-nums text-muted-foreground">{r.latency}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Health label="API gateway" value="99.98%" tone="success" detail="240 rps · 0 errors" />
            <Health label="WhatsApp dispatcher" value="OK" tone="success" detail="p95 318ms" />
            <Health label="SMS gateway" value="Degraded" tone="warning" detail="2 retries / min" />
          </div>
        </div>

        <div className="h-[640px]">
          <EventStream title="Webhook Stream" compact />
        </div>
      </div>
    </div>
  );
}

function Health({
  label, value, tone, detail,
}: { label: string; value: string; tone: "success" | "warning" | "crimson"; detail: string }) {
  const t = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-crimson";
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
        <span className={`size-1.5 rounded-full ${tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-crimson"} animate-pulse`} />
      </div>
      <p className={`mt-2 text-lg font-semibold ${t}`}>{value}</p>
      <p className="mt-1 font-mono text-[10px] text-muted-foreground">{detail}</p>
    </div>
  );
}
