import { Phone, MessageCircle, Mail } from "lucide-react";

export type Donor = {
  id: string;
  name: string;
  initials: string;
  group: string;
  aiScore: number;
  reliability: number;
  responseRate: number;
  lastDonationDays: number;
  donations: number;
  distanceKm: number;
  status: "available" | "busy" | "cooldown";
  channels: ("sms" | "wa" | "email")[];
};

export const donors: Donor[] = [
  { id: "9942-X", name: "Marcus Thorne", initials: "MT", group: "O−", aiScore: 9.8, reliability: 98, responseRate: 94, lastDonationDays: 92, donations: 14, distanceKm: 2.4, status: "available", channels: ["wa", "sms"] },
  { id: "2210-Y", name: "Elena Rodriguez", initials: "ER", group: "O−", aiScore: 9.4, reliability: 92, responseRate: 88, lastDonationDays: 110, donations: 9, distanceKm: 4.1, status: "available", channels: ["wa", "email"] },
  { id: "8821-K", name: "Samir Kapoor", initials: "SK", group: "AB+", aiScore: 9.1, reliability: 88, responseRate: 81, lastDonationDays: 64, donations: 6, distanceKm: 6.7, status: "available", channels: ["wa", "sms", "email"] },
  { id: "4471-L", name: "Naomi Chen", initials: "NC", group: "B+", aiScore: 8.7, reliability: 84, responseRate: 79, lastDonationDays: 200, donations: 12, distanceKm: 3.9, status: "busy", channels: ["email"] },
  { id: "1093-Q", name: "Julian Vane", initials: "JV", group: "A−", aiScore: 8.4, reliability: 79, responseRate: 71, lastDonationDays: 41, donations: 4, distanceKm: 9.2, status: "cooldown", channels: ["wa"] },
  { id: "7758-D", name: "Priya Anand", initials: "PA", group: "O+", aiScore: 8.2, reliability: 77, responseRate: 75, lastDonationDays: 150, donations: 8, distanceKm: 5.5, status: "available", channels: ["sms", "wa"] },
];

const statusDot: Record<Donor["status"], string> = {
  available: "bg-success",
  busy: "bg-warning",
  cooldown: "bg-muted-foreground/40",
};

export function DonorCard({ d }: { d: Donor }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border/80">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: "var(--gradient-radial-intel)" }} />
      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-crimson to-crimson-glow text-sm font-semibold text-white">
              {d.initials}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-surface ${statusDot[d.status]}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{d.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              ID {d.id} · {d.distanceKm}km away
            </p>
          </div>
          <span className="inline-flex items-center rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] font-semibold">
            {d.group}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat label="AI Score" value={d.aiScore.toFixed(1)} accent="intel" />
          <Stat label="Reliability" value={`${d.reliability}%`} bar={d.reliability} barColor="success" />
          <Stat label="Response" value={`${d.responseRate}%`} bar={d.responseRate} barColor="intel" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <div>
            <p className="text-foreground/90 font-sans text-xs normal-case tracking-normal">
              {d.lastDonationDays}d ago
            </p>
            <p>last donation</p>
          </div>
          <div className="text-right">
            <p className="text-foreground/90 font-sans text-xs normal-case tracking-normal">
              {d.donations} lifetime
            </p>
            <p>donations</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {d.channels.includes("wa") && <Chan icon={MessageCircle} />}
            {d.channels.includes("sms") && <Chan icon={Phone} />}
            {d.channels.includes("email") && <Chan icon={Mail} />}
          </div>
          <button className="rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium hover:bg-accent">
            Dispatch →
          </button>
        </div>
      </div>
    </div>
  );
}

function Chan({ icon: Icon }: { icon: any }) {
  return (
    <span className="grid size-6 place-items-center rounded-md border border-border bg-background text-muted-foreground">
      <Icon className="size-3" />
    </span>
  );
}

function Stat({
  label, value, bar, barColor = "intel", accent,
}: {
  label: string; value: string; bar?: number; barColor?: "intel" | "success"; accent?: "intel";
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p className={`mt-1 text-base font-semibold tabular-nums ${accent === "intel" ? "text-intel" : "text-foreground"}`}>
        {value}
      </p>
      {typeof bar === "number" && (
        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-muted">
          <div className={`h-full ${barColor === "success" ? "bg-success" : "bg-intel"}`} style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  );
}
