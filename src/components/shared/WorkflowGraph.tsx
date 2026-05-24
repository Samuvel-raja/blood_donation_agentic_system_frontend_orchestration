type NodeState = "done" | "active" | "pending" | "error";

const nodes = [
  { id: "intake", label: "Intake", code: "IN", state: "done" as NodeState },
  { id: "verify", label: "Hospital Verify", code: "VR", state: "done" as NodeState },
  { id: "search", label: "Donor Search", code: "DS", state: "active" as NodeState },
  { id: "batch", label: "Batch Select", code: "BS", state: "pending" as NodeState },
  { id: "notify", label: "Notify Dispatch", code: "ND", state: "pending" as NodeState },
  { id: "wait", label: "Wait For Reply", code: "WR", state: "pending" as NodeState },
  { id: "decide", label: "Decision Router", code: "DR", state: "pending" as NodeState },
  { id: "done", label: "Completion", code: "OK", state: "pending" as NodeState },
];

export function WorkflowGraph({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-surface">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-crimson)" }}
      />

      <div className="relative flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Orchestration graph · Request #PXR-9024
            </p>
            <h3 className="mt-1 text-base font-semibold">Live workflow execution</h3>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-success" /> Done</span>
            <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-intel animate-pulse" /> Active</span>
            <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-muted-foreground/40" /> Pending</span>
          </div>
        </div>

        <div className="relative mt-8 flex flex-1 items-center">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 200">
            <line x1="0" x2="800" y1="100" y2="100" stroke="currentColor" className="text-border" strokeWidth="1" />
            <line x1="280" x2="380" y1="100" y2="100" className="text-intel animate-flow" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          <div className="relative z-10 flex w-full items-center justify-between">
            {nodes.map((n) => (
              <Node key={n.id} {...n} compact={compact} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          <span>Scheduler: T-04:12 · Retry budget 2/3</span>
          <span className="text-intel">webhook stream open</span>
        </div>
      </div>
    </div>
  );
}

function Node({
  label, code, state, compact,
}: {
  label: string; code: string; state: NodeState; compact?: boolean;
}) {
  const styles =
    state === "active"
      ? "border-intel bg-intel/10 text-intel ring-4 ring-intel/15 shadow-glow-intel"
      : state === "done"
      ? "border-success/40 bg-success/5 text-success"
      : state === "error"
      ? "border-crimson bg-crimson/10 text-crimson"
      : "border-border bg-background text-muted-foreground/60";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={[
          "grid place-items-center rounded-xl border font-mono text-[10px] font-bold transition-all",
          compact ? "size-9" : "size-12",
          styles,
          state === "active" ? "animate-pulse" : "",
        ].join(" ")}
      >
        {code}
      </div>
      <span className={`text-[10px] font-medium ${state === "pending" ? "text-muted-foreground/60" : "text-foreground"}`}>
        {label}
      </span>
    </div>
  );
}
