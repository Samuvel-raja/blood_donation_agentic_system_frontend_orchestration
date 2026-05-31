import { Phone, MessageCircle, Mail } from "lucide-react";
import type { UserJson } from "@/lib/api/users";

export type Donor = {
  id: string;
  name: string;
  initials: string;
  group: string;
  status: "available" | "cooldown";
  roles?: string[];
  mobile?: string;
  email?: string;
};

const statusDot: Record<Donor["status"], string> = {
  available: "bg-success",
  cooldown: "bg-muted-foreground/40",
};

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function donorFromUser(u: UserJson): Donor {
  return {
    id: u.id,
    name: u.name,
    initials: initialsFromName(u.name),
    group: u.blood_group,
    status: u.status === "active" ? "available" : "cooldown",
    roles: u.roles,
    mobile: u.mobile,
    email: u.email,
  };
}

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
              ID {d.id}{d.roles?.length ? ` · ${d.roles.join(", ")}` : ""}
            </p>
          </div>
          <span className="inline-flex items-center rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] font-semibold">
            {d.group}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {d.mobile ? <Chan icon={Phone} /> : null}
            {d.email ? <Chan icon={Mail} /> : null}
            <Chan icon={MessageCircle} />
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

