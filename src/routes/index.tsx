import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { WorkflowGraph } from "@/components/shared/WorkflowGraph";
import { EventStream } from "@/components/shared/EventStream";
import { RequestList } from "@/components/shared/RequestList";
import { DonorCard, donors } from "@/components/shared/DonorCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orchestration Control · PulseXira" },
      { name: "description", content: "Live AI orchestration dashboard for emergency blood donation workflows." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="System live · 14 active threads"
        title="Orchestration Control"
        description="Real-time AI coordination across hospitals, donor pools, and dispatch workflows."
        actions={
          <>
            <button className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-accent">
              Last 24h
            </button>
            <button className="rounded-md bg-crimson px-3 py-1.5 text-xs font-semibold text-white shadow-glow-crimson hover:opacity-90">
              + Emergency Request
            </button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Active Requests" value="42" delta="+4 critical" trend="up" hint="6 awaiting verification" accent="crimson" />
        <KpiCard label="Avg Response" value="4m 12s" delta="−12%" trend="down" hint="AI optimized" accent="intel" />
        <KpiCard label="Match Rate" value="98.4%" delta="+2.1%" trend="up" hint="AI confident" accent="success" />
        <KpiCard label="Donors Online" value="1,204" delta="live" hint="Geo telemetry" />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="h-[420px]">
            <WorkflowGraph />
          </div>
        </div>
        <div className="h-[420px]">
          <EventStream />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Live Request Pipeline</h2>
            <p className="text-xs text-muted-foreground">Sorted by SLA urgency · auto-refreshing every 2s</p>
          </div>
          <button className="text-xs font-medium text-intel hover:underline">View all 42 →</button>
        </div>
        <RequestList />
      </section>

      <section className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Top Ranked Donor Pool</h2>
            <p className="text-xs text-muted-foreground">AI-scored for active O− and AB+ requests</p>
          </div>
          <button className="text-xs font-medium text-intel hover:underline">Open intelligence dashboard →</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {donors.slice(0, 6).map((d) => <DonorCard key={d.id} d={d} />)}
        </div>
      </section>
    </div>
  );
}
