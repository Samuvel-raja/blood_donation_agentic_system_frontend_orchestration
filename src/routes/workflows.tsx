import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { WorkflowGraph } from "@/components/shared/WorkflowGraph";
import { EventStream } from "@/components/shared/EventStream";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Pause, Play, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: [
      { title: "Workflow Orchestration · PulseXira" },
      { name: "description", content: "LangGraph-style workflow visualization with interrupt and resume states." },
    ],
  }),
  component: WorkflowsPage,
});

const runs = [
  { id: "PXR-9024", node: "donor_search", status: "active" as const, runtime: "00:04:12", retries: "1/3" },
  { id: "PXR-9023", node: "notify_dispatch", status: "active" as const, runtime: "00:01:48", retries: "0/3" },
  { id: "PXR-9018", node: "wait_for_reply", status: "pending" as const, runtime: "00:12:02", retries: "2/3" },
  { id: "PXR-9011", node: "complete", status: "complete" as const, runtime: "00:08:55", retries: "0/3" },
  { id: "PXR-9008", node: "decision_router", status: "active" as const, runtime: "00:00:42", retries: "0/3" },
];

function WorkflowsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Orchestration engine"
        title="Workflow Visualizer"
        description="Live LangGraph-style execution traces with interrupt, resume, and replay."
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <Pause className="size-3.5" /> Interrupt
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <Play className="size-3.5" /> Resume
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
              <RefreshCw className="size-3.5" /> Replay
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="h-[480px]">
            <WorkflowGraph />
          </div>
        </div>
        <div className="h-[480px]">
          <EventStream title="Execution Log" />
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight">Active Workflow Runs</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid grid-cols-12 gap-4 border-b border-border bg-background/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            <div className="col-span-3">Run ID</div>
            <div className="col-span-3">Current node</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Runtime</div>
            <div className="col-span-2 text-right">Retries</div>
          </div>
          <div className="divide-y divide-border">
            {runs.map((r) => (
              <div key={r.id} className="grid grid-cols-12 items-center gap-4 px-5 py-3 text-sm hover:bg-accent/40">
                <div className="col-span-3 font-mono text-xs">#{r.id}</div>
                <div className="col-span-3 font-mono text-xs text-intel">{r.node}</div>
                <div className="col-span-2"><StatusBadge variant={r.status}>{r.status}</StatusBadge></div>
                <div className="col-span-2 font-mono text-xs tabular-nums">{r.runtime}</div>
                <div className="col-span-2 text-right font-mono text-xs tabular-nums">{r.retries}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
