import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Mail, MessageCircle, Phone, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/communications")({
  head: () => ({
    meta: [
      { title: "Communications · PulseXira" },
      { name: "description", content: "Automated email and WhatsApp orchestration with real-time delivery tracking." },
    ],
  }),
  component: CommsPage,
});

const templates = [
  { id: "tpl_001", name: "Critical request · WhatsApp", channel: "wa", sent: 4821, ack: 94 },
  { id: "tpl_002", name: "Urgent batch · Email", channel: "email", sent: 1240, ack: 71 },
  { id: "tpl_003", name: "Cooldown reminder · SMS", channel: "sms", sent: 892, ack: 88 },
  { id: "tpl_004", name: "Hospital handoff · Email", channel: "email", sent: 442, ack: 99 },
];

const timeline = [
  { time: "14:42", channel: "wa", to: "Elena Rodriguez", status: "accepted" as const, body: "O− request at Mercy Central — can you arrive by 16:00?" },
  { time: "14:41", channel: "wa", to: "Marcus Thorne", status: "accepted" as const, body: "Critical O− request — confirmed dispatch" },
  { time: "14:39", channel: "email", to: "Naomi Chen", status: "rejected" as const, body: "Unable to attend within SLA window" },
  { time: "14:38", channel: "sms", to: "Samir Kapoor", status: "pending" as const, body: "AB+ request · awaiting reply" },
];

function CommsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Communication center"
        title="Multichannel Orchestration"
        description="Automated email, WhatsApp, and SMS workflows with delivery telemetry."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Messages 24h" value="14,820" delta="+1,204" trend="up" accent="intel" />
        <KpiCard label="Acknowledgement" value="91%" delta="+2.1%" trend="up" accent="success" />
        <KpiCard label="Avg delivery" value="318ms" hint="WhatsApp p95" />
        <KpiCard label="Failed" value="42" delta="−18" trend="down" hint="auto-retried" accent="crimson" />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Templates</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {templates.map((t) => (
              <div key={t.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <ChannelIcon ch={t.channel} />
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t.id}
                      </p>
                    </div>
                  </div>
                  <StatusBadge variant="active">live</StatusBadge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">Sent (7d)</p>
                    <p className="mt-1 text-base font-semibold tabular-nums">{t.sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">Ack rate</p>
                    <p className="mt-1 text-base font-semibold tabular-nums text-success">{t.ack}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Engagement Timeline</h2>
          <div className="rounded-xl border border-border bg-surface">
            <ul className="divide-y divide-border">
              {timeline.map((t, i) => (
                <li key={i} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChannelIcon ch={t.channel} small />
                      <span className="text-sm font-medium">{t.to}</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">{t.time}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{t.body}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge variant={t.status}>{t.status}</StatusBadge>
                    {t.status === "accepted" && <CheckCheck className="size-3.5 text-success" />}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelIcon({ ch, small }: { ch: string; small?: boolean }) {
  const Icon = ch === "wa" ? MessageCircle : ch === "email" ? Mail : Phone;
  const size = small ? "size-7" : "size-9";
  return (
    <span className={`grid ${size} place-items-center rounded-md border border-border bg-background text-intel`}>
      <Icon className="size-4" />
    </span>
  );
}
