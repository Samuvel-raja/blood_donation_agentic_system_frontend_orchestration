import { StatusBadge, BloodGroupChip } from "./StatusBadge";
import { Clock, MapPin } from "lucide-react";

export type Request = {
  id: string;
  hospital: string;
  group: string;
  units: { secured: number; required: number };
  sla: string;
  confidence: number;
  priority: "critical" | "urgent" | "normal";
  distanceKm: number;
};

export function RequestRow({ r }: { r: Request }) {
  const pct = Math.round((r.units.secured / r.units.required) * 100);
  return (
    <div className="group relative grid grid-cols-12 items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/40">
      <div className="col-span-3 flex items-center gap-3">
        <div className={`grid size-11 place-items-center rounded-lg border font-mono text-xs font-bold ${
          r.priority === "critical"
            ? "border-crimson/30 bg-crimson/10 text-crimson"
            : r.priority === "urgent"
            ? "border-warning/30 bg-warning/10 text-warning"
            : "border-intel/30 bg-intel/10 text-intel"
        }`}>
          {r.group}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{r.hospital}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            #{r.id}
          </p>
        </div>
      </div>

      <div className="col-span-2">
        <StatusBadge variant={r.priority}>{r.priority}</StatusBadge>
      </div>

      <div className="col-span-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono uppercase tracking-wider text-muted-foreground">
            {r.units.secured}/{r.units.required} units
          </span>
          <span className="tabular-nums text-muted-foreground">{pct}%</span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${
              r.priority === "critical" ? "bg-crimson" : r.priority === "urgent" ? "bg-warning" : "bg-success"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="col-span-2 flex items-center gap-1.5 font-mono text-xs">
        <Clock className={`size-3.5 ${r.priority === "critical" ? "text-crimson" : "text-muted-foreground"}`} />
        <span className={`tabular-nums ${r.priority === "critical" ? "text-crimson" : "text-foreground"}`}>
          {r.sla}
        </span>
        <span className="mx-1 text-muted-foreground/40">·</span>
        <MapPin className="size-3 text-muted-foreground" />
        <span className="text-muted-foreground">{r.distanceKm}km</span>
      </div>

      <div className="col-span-2 flex items-center justify-end gap-2">
        <div className="flex flex-col items-end">
          <span className="font-mono text-xs tabular-nums">{r.confidence}%</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-intel">AI conf.</span>
        </div>
        <div className="h-8 w-12 overflow-hidden rounded bg-muted">
          <div className="h-full bg-gradient-to-r from-intel to-intel-glow" style={{ width: `${r.confidence}%` }} />
        </div>
      </div>
    </div>
  );
}

export function RequestList({ requests }: { requests?: Request[] }) {
  const items = requests ?? [];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="grid grid-cols-12 gap-4 border-b border-border bg-background/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        <div className="col-span-3">Hospital · Request</div>
        <div className="col-span-2">Priority</div>
        <div className="col-span-3">Fulfillment</div>
        <div className="col-span-2">SLA · Distance</div>
        <div className="col-span-2 text-right">AI Confidence</div>
      </div>
      <div className="divide-y divide-border">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">No requests yet.</p>
        ) : (
          items.map((r) => <RequestRow key={r.id} r={r} />)
        )}
      </div>
    </div>
  );
}

export { BloodGroupChip };
