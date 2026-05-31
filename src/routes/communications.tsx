import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";

export const Route = createFileRoute("/communications")({
  head: () => ({
    meta: [
      { title: "Communications · PulseXira" },
      { name: "description", content: "Automated email and WhatsApp orchestration with real-time delivery tracking." },
    ],
  }),
  component: CommsPage,
});

function CommsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Communication center"
        title="Multichannel Orchestration"
        description="Automated email, WhatsApp, and SMS workflows with delivery telemetry."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Messages 24h" value="—" hint="Awaiting data" />
        <KpiCard label="Acknowledgement" value="—" hint="Awaiting data" />
        <KpiCard label="Avg delivery" value="—" hint="Awaiting data" />
        <KpiCard label="Failed" value="—" hint="Awaiting data" />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Templates</h2>
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
            No communication templates configured.
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Engagement Timeline</h2>
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
            No engagement activity yet.
          </div>
        </div>
      </div>
    </div>
  );
}
