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



function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Insights"
        title="Analytics & Reporting"
        description="Donor performance, workflow efficiency, and AI orchestration effectiveness."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Success rate" value="—" hint="Awaiting data" />
        <KpiCard label="Avg fulfillment" value="—" hint="Awaiting data" />
        <KpiCard label="AI decisions" value="—" hint="Awaiting data" />
        <KpiCard label="Batch retries" value="—" hint="Awaiting data" />
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
          </div>
          <div className="mt-6 rounded-lg border border-dashed border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
            No throughput data available yet.
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Blood group demand
          </p>
          <h3 className="mt-1 text-base font-semibold">Last 7 days</h3>
          <div className="mt-6 text-center text-sm text-muted-foreground">No demand data available.</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Geographic heatmap
          </p>
          <h3 className="mt-1 text-base font-semibold">Donor density · metro</h3>
          <div className="mt-6 aspect-[4/3] rounded-lg border border-dashed border-border bg-background/40 grid-bg">
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No geo data.</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 xl:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            AI decision effectiveness
          </p>
          <h3 className="mt-1 text-base font-semibold">Routing accuracy by node</h3>
          <div className="mt-6 text-center text-sm text-muted-foreground">No decision data available.</div>
        </div>
      </div>
    </div>
  );
}

