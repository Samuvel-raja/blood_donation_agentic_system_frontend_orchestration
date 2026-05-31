import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { RequestList } from "@/components/shared/RequestList";
import { KpiCard } from "@/components/shared/KpiCard";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "Emergency Requests · PulseXira" },
      { name: "description", content: "Create and orchestrate emergency blood requests with AI verification and donor matching." },
    ],
  }),
  component: RequestsPage,
});

function RequestsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Emergency console"
        title="Blood Request Pipeline"
        description="Track and manage active blood requests. Create new emergencies from Workflows."
        actions={
          <Link
            to="/workflows"
            className="rounded-md bg-crimson px-3 py-1.5 text-xs font-semibold text-white shadow-glow-crimson hover:opacity-90"
          >
            + New Emergency Request
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Open requests" value="—" hint="Awaiting data" />
        <KpiCard label="Avg verify time" value="—" hint="Awaiting data" />
        <KpiCard label="Fulfillment" value="—" hint="Awaiting data" />
        <KpiCard label="Retry budget" value="—" hint="Awaiting data" />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight">Active Pipeline</h2>
        <RequestList />
      </section>
    </div>
  );
}
