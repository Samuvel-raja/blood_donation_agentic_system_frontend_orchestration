import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs · PulseXira" },
      { name: "description", content: "Multi-role access events, hospital actions, and admin trails." },
    ],
  }),
  component: AuditPage,
});

const logs = [
  { time: "14:42:08", actor: "agent:orchestrator", role: "AI", action: "workflow.advance", target: "PXR-9024 / donor_search", status: "active" as const },
  { time: "14:41:55", actor: "dr.thorne@pulsexira.io", role: "L4 Admin", action: "request.create", target: "PXR-9024", status: "complete" as const },
  { time: "14:40:12", actor: "hospital:mercy-central", role: "Operator", action: "credential.verify", target: "cert AX-4429", status: "complete" as const },
  { time: "14:38:01", actor: "agent:notifier", role: "AI", action: "channel.dispatch", target: "wa · 42 recipients", status: "active" as const },
  { time: "14:35:30", actor: "n.chen@pulsexira.io", role: "L2 Analyst", action: "donor.export", target: "registry · O-neg", status: "complete" as const },
  { time: "14:34:14", actor: "agent:scheduler", role: "AI", action: "workflow.retry", target: "PXR-9018", status: "pending" as const },
  { time: "14:31:02", actor: "hospital:oakwood", role: "Operator", action: "request.create", target: "PXR-9022", status: "complete" as const },
];

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

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid grid-cols-12 gap-4 border-b border-border bg-background/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-3">Actor</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Action</div>
          <div className="col-span-2">Target</div>
          <div className="col-span-1 text-right">State</div>
        </div>
        <div className="divide-y divide-border">
          {logs.map((l, i) => (
            <div key={i} className="grid grid-cols-12 items-center gap-4 px-5 py-3 text-xs hover:bg-accent/40">
              <div className="col-span-2 font-mono tabular-nums text-muted-foreground">{l.time}</div>
              <div className="col-span-3 truncate font-mono">{l.actor}</div>
              <div className="col-span-2">
                <span className={`font-mono ${l.role === "AI" ? "text-intel" : l.role.includes("Admin") ? "text-crimson" : "text-foreground"}`}>
                  {l.role}
                </span>
              </div>
              <div className="col-span-2 font-mono text-foreground">{l.action}</div>
              <div className="col-span-2 truncate text-muted-foreground">{l.target}</div>
              <div className="col-span-1 text-right"><StatusBadge variant={l.status}>{l.status}</StatusBadge></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
