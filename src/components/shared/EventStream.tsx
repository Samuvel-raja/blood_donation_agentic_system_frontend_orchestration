type Event = {
  time: string;
  level: "info" | "ai" | "warn" | "ok" | "err";
  tag: string;
  message: string;
};

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
  const displayEvents = liveEvents ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-success animate-pulse" />
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </h3>
        </div>
        {displayEvents.length > 0 && <span className="font-mono text-[10px] text-muted-foreground">live</span>}
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
