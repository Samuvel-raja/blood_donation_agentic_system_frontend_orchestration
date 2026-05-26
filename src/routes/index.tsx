import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { RequestList } from "@/components/shared/RequestList";
import { DonorCard, donors } from "@/components/shared/DonorCard";
import { ArrowRight, Siren, Users, Workflow } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orchestration Control · PulseXira" },
      { name: "description", content: "Live AI orchestration dashboard for emergency blood donation workflows." },
    ],
  }),
  component: Dashboard,
});

const quickLinks = [
  {
    to: "/workflows",
    label: "Start emergency workflow",
    description: "Create a request and run live orchestration",
    icon: Workflow,
  },
  {
    to: "/requests",
    label: "Request pipeline",
    description: "Track open and in-flight blood requests",
    icon: Siren,
  },
  {
    to: "/donors",
    label: "Donor intelligence",
    description: "AI-ranked donor registry and filters",
    icon: Users,
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="System live · 14 active threads"
        title="Orchestration Control"
        description="Overview across requests, workflows, and donor pools."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Active Requests" value="42" delta="+4 critical" trend="up" hint="6 awaiting verification" accent="crimson" />
        <KpiCard label="Avg Response" value="4m 12s" delta="−12%" trend="down" hint="AI optimized" accent="intel" />
        <KpiCard label="Match Rate" value="98.4%" delta="+2.1%" trend="up" hint="AI confident" accent="success" />
        <KpiCard label="Donors Online" value="1,204" delta="live" hint="Geo telemetry" />
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {quickLinks.map(({ to, label, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-intel/40 hover:bg-accent/30"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-background text-intel">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-sm font-semibold">
                {label}
                <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recent requests</h2>
            <p className="text-xs text-muted-foreground">Preview · full pipeline on Emergency Requests</p>
          </div>
          <Link to="/requests" className="text-xs font-medium text-intel hover:underline">
            View all →
          </Link>
        </div>
        <RequestList />
      </section>

      <section className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Top donors</h2>
            <p className="text-xs text-muted-foreground">Preview · full registry on Donor Intelligence</p>
          </div>
          <Link to="/donors" className="text-xs font-medium text-intel hover:underline">
            Open registry →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {donors.slice(0, 3).map((d) => (
            <DonorCard key={d.id} d={d} />
          ))}
        </div>
      </section>
    </div>
  );
}
