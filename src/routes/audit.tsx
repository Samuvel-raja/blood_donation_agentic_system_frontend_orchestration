import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs · PulseXira" },
      { name: "description", content: "Multi-role access events, hospital actions, and admin trails." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Compliance"
        title="Audit Trail"
        description="Cross-role activity log for hospitals, admins, and AI agents · SOC2 / HIPAA aligned."
        actions={
          <button className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-accent">
            Export CSV
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {["All roles", "L4 Admin", "L2 Analyst", "Hospital Operator", "AI Agent"].map((f, i) => (
          <button key={f}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] ${
              i === 0 ? "border-foreground bg-foreground text-background" : "border-border bg-surface text-muted-foreground hover:bg-accent"
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
        No audit log entries yet. Activity will appear here as events are recorded.
      </div>
    </div>
  );
}
