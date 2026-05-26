type Event = {
  time: string;
  level: "info" | "ai" | "warn" | "ok" | "err";
  tag: string;
  message: string;
};

const events: Event[] = [
  { time: "14:42:08", level: "ok", tag: "ACK", message: "Donor Elena R. (2210-Y) accepted O- request #PXR-9024" },
  { time: "14:42:03", level: "info", tag: "MSG", message: "WhatsApp dispatched to 42 high-reliability candidates" },
  { time: "14:42:01", level: "ai", tag: "AI", message: "Agent #828 expanded scan radius to 18km after 3 misses" },
  { time: "14:41:55", level: "warn", tag: "SLA", message: "St. Jude #PXR-9024 approaching T-10m threshold" },
  { time: "14:41:42", level: "ai", tag: "AI", message: "Decision router escalated request to L2 batch" },
  { time: "14:41:30", level: "info", tag: "NODE", message: "donor_search transitioned: queued → executing" },
  { time: "14:41:18", level: "ok", tag: "VRF", message: "Mercy Central Trauma credentials verified" },
  { time: "14:41:02", level: "err", tag: "RETRY", message: "SMS gateway timeout · scheduled retry in 30s" },
  { time: "14:40:50", level: "info", tag: "WBHK", message: "Inbound webhook: hospital.request.created" },
];

const colors: Record<Event["level"], string> = {
  info: "text-intel",
  ai: "text-intel-glow",
  warn: "text-warning",
  ok: "text-success",
  err: "text-crimson",
};

export function EventStream({
  title = "Event Stream",
  compact = false,
  events: liveEvents,
}: {
  title?: string;
  compact?: boolean;
  events?: Event[];
}) {
  const displayEvents = liveEvents?.length ? liveEvents : events;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-success animate-pulse" />
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </h3>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">0.02ms lag</span>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 font-mono text-[11px]">
        <ul className="space-y-3">
          {displayEvents.map((e, i) => (
            <li key={i} className="flex gap-3 animate-ticker" style={{ animationDelay: `${i * 30}ms` }}>
              <span className="shrink-0 text-muted-foreground/70 tabular-nums">{e.time}</span>
              <span className={`shrink-0 font-semibold ${colors[e.level]}`}>[{e.tag}]</span>
              <span className={`min-w-0 ${compact ? "truncate" : ""} text-foreground/80`}>{e.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
