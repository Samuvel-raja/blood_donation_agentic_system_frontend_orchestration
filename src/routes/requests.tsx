import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { RequestList } from "@/components/shared/RequestList";
import { KpiCard } from "@/components/shared/KpiCard";
import { ShieldCheck, MapPin, Sparkles, AlertOctagon } from "lucide-react";

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
        description="File new requests, verify hospital credentials, and trigger AI donor matching."
        actions={
          <button className="rounded-md bg-crimson px-3 py-1.5 text-xs font-semibold text-white shadow-glow-crimson">
            + New Emergency Request
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Open requests" value="42" hint="6 critical" accent="crimson" />
        <KpiCard label="Avg verify time" value="38s" delta="−12s" trend="down" hint="Hospital handshake" accent="intel" />
        <KpiCard label="Fulfillment" value="89%" delta="+3.4%" trend="up" hint="Last 7 days" accent="success" />
        <KpiCard label="Retry budget" value="2.1/3" hint="Per workflow" />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Active Pipeline</h2>
          <RequestList />
        </div>

        <aside className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">New Emergency Request</h2>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="space-y-4">
              <Field label="Hospital">
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <option>Mercy Central Trauma</option>
                  <option>St. Jude Medical Center</option>
                  <option>Oakwood Pediatric</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Blood group">
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <option>O−</option><option>O+</option><option>A−</option><option>A+</option>
                    <option>B−</option><option>B+</option><option>AB−</option><option>AB+</option>
                  </select>
                </Field>
                <Field label="Units">
                  <input type="number" defaultValue={6} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm tabular-nums" />
                </Field>
              </div>
              <Field label="Urgency level">
                <div className="grid grid-cols-4 gap-1.5">
                  {["L1", "L2", "L3", "L4"].map((l, i) => (
                    <button key={l}
                      className={`rounded-md border px-2 py-1.5 font-mono text-[11px] font-semibold ${
                        i === 3 ? "border-crimson bg-crimson/10 text-crimson" : "border-border bg-background text-muted-foreground hover:bg-accent"
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="space-y-3 rounded-lg border border-border bg-background/40 p-3">
                <Insight icon={ShieldCheck} label="Hospital verification" value="Passed · cert #AX-4429" tone="success" />
                <Insight icon={Sparkles} label="AI confidence" value="94% — 38 candidate donors" tone="intel" />
                <Insight icon={MapPin} label="Nearest donor" value="2.4km · Marcus T. (O−)" tone="default" />
                <Insight icon={AlertOctagon} label="Escalation" value="Auto-escalate after 3 misses" tone="warning" />
              </div>

              <button className="w-full rounded-md bg-crimson px-3 py-2 text-sm font-semibold text-white shadow-glow-crimson">
                Dispatch orchestration
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Insight({
  icon: Icon, label, value, tone,
}: { icon: any; label: string; value: string; tone: "success" | "intel" | "warning" | "default" }) {
  const t = tone === "success" ? "text-success" : tone === "intel" ? "text-intel" : tone === "warning" ? "text-warning" : "text-muted-foreground";
  return (
    <div className="flex items-start gap-3">
      <Icon className={`mt-0.5 size-4 ${t}`} />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-xs text-foreground/90">{value}</p>
      </div>
    </div>
  );
}
