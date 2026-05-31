import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { EventStream } from "@/components/shared/EventStream";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Live Monitoring · PulseXira" },
      { name: "description", content: "Real-time donor responses, delivery tracking, and system telemetry." },
    ],
  }),
  component: MonitoringPage,
});

function MonitoringPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Live telemetry"
        title="Real-Time Monitoring Center"
        description="Donor responses, channel delivery, scheduler countdowns, and orchestration health."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Engine latency" value="—" hint="Awaiting data" />
        <KpiCard label="Queue depth" value="—" hint="Awaiting data" />
        <KpiCard label="Webhook errors" value="—" hint="Awaiting data" />
        <KpiCard label="Accept rate" value="—" hint="Awaiting data" />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Donor Response Stream</h2>
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
            No donor responses yet. Responses will appear here when requests are dispatched.
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <EmptyHealth label="API gateway" />
            <EmptyHealth label="WhatsApp dispatcher" />
            <EmptyHealth label="SMS gateway" />
          </div>
        </div>

        <div className="h-[640px]">
          <EventStream title="Webhook Stream" compact />
        </div>
      </div>
    </div>
  );
}

function EmptyHealth({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm text-muted-foreground/60">No telemetry yet</p>
    </div>
  );
}
