import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { WorkflowGraph } from "@/components/shared/WorkflowGraph";
import { EventStream } from "@/components/shared/EventStream";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NewEmergencyRequestForm } from "@/components/workflows/NewEmergencyRequestForm";
import { useBloodRequestWorkflow } from "@/hooks/use-blood-request-workflow";
import { Pause } from "lucide-react";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: [
      { title: "Workflow Orchestration · PulseXira" },
      { name: "description", content: "LangGraph-style workflow visualization with interrupt and resume states." },
    ],
  }),
  component: WorkflowsPage,
});

function WorkflowsPage() {
  const {
    workflowState,
    activeNode,
    events,
    isRunning,
    error,
    startEmergencyRequest,
    cancel,
  } = useBloodRequestWorkflow();

  const liveRequestId = workflowState?.request_id;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Orchestration engine"
        title="Workflow Visualizer"
        description="Create emergency requests and watch live LangGraph execution."
        actions={
          <button
            type="button"
            onClick={cancel}
            disabled={!isRunning}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-40"
          >
            <Pause className="size-3.5" /> Interrupt run
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="h-[480px]">
            <WorkflowGraph requestId={liveRequestId} activeNode={activeNode} />
          </div>
          {error ? (
            <p className="rounded-md border border-crimson/30 bg-crimson/10 px-3 py-2 text-xs text-crimson">
              {error}
            </p>
          ) : null}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight">Current run</h2>
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="grid grid-cols-12 gap-4 border-b border-border bg-background/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                <div className="col-span-3">Run ID</div>
                <div className="col-span-3">Current node</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Runtime</div>
                <div className="col-span-2 text-right">Retries</div>
              </div>
              {liveRequestId ? (
                <div className="grid grid-cols-12 items-center gap-4 bg-intel/5 px-5 py-3 text-sm">
                  <div className="col-span-3 font-mono text-xs">#{liveRequestId.slice(0, 8)}</div>
                  <div className="col-span-3 font-mono text-xs text-intel">{activeNode}</div>
                  <div className="col-span-2">
                    <StatusBadge variant={isRunning ? "active" : workflowState?.status === "completed" ? "complete" : "pending"}>
                      {isRunning ? "active" : workflowState?.status ?? "pending"}
                    </StatusBadge>
                  </div>
                  <div className="col-span-2 font-mono text-xs tabular-nums">live</div>
                  <div className="col-span-2 text-right font-mono text-xs tabular-nums">—</div>
                </div>
              ) : (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No active run. Submit a new emergency request to start orchestration.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">New Emergency Request</h2>
          <NewEmergencyRequestForm disabled={isRunning} onSubmit={startEmergencyRequest} />
          <div className="h-[320px]">
            <EventStream title="Execution Log" events={events.length ? events : undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
