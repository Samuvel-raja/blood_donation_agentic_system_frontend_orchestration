import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Siren,
  Users,
  Workflow,
  Activity,
  BarChart3,
  MessagesSquare,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const ops = [
  { to: "/", label: "Orchestration", icon: LayoutDashboard, exact: true },
  { to: "/requests", label: "Emergency Requests", icon: Siren, badge: "4" },
  { to: "/donors", label: "Donor Intelligence", icon: Users },
  { to: "/workflows", label: "Workflows", icon: Workflow },
] as const;

const systems = [
  { to: "/monitoring", label: "Live Monitoring", icon: Activity, pulse: true },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/communications", label: "Comms Center", icon: MessagesSquare },
  { to: "/audit", label: "Audit Logs", icon: ShieldCheck },
] as const;

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const roleLabel = user?.roles?.includes("admin")
    ? "Administrator"
    : user?.roles?.includes("recipient")
      ? "Recipient"
      : "Donor";

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="relative grid size-8 place-items-center rounded-lg bg-crimson shadow-glow-crimson">
          <div className="size-2.5 rounded-full bg-white/90 animate-pulse-ring" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">PulseXira</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            orchestrator v2.4
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <SectionLabel>Operations</SectionLabel>
        <ul className="space-y-0.5">
          {ops.map((item) => (
            <NavRow key={item.to} active={isActive(item.to, (item as any).exact)} {...item} />
          ))}
        </ul>

        <div className="h-5" />
        <SectionLabel>System</SectionLabel>
        <ul className="space-y-0.5">
          {systems.map((item) => (
            <NavRow key={item.to} active={isActive(item.to)} {...item} />
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 transition-colors">
          <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-crimson to-crimson-glow text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name ?? "User"}</p>
            <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {roleLabel}
            </p>
          </div>
          <button
            onClick={logout}
            className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-crimson"
            title="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
      {children}
    </p>
  );
}

function NavRow({
  to, label, icon: Icon, active, badge, pulse,
}: {
  to: string; label: string; icon: any; active?: boolean; badge?: string; pulse?: boolean;
}) {
  return (
    <li>
      <Link
        to={to}
        className={[
          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          active
            ? "bg-sidebar-accent text-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
        ].join(" ")}
      >
        <Icon className={["size-4 shrink-0", active ? "text-crimson" : ""].join(" ")} />
        <span className="flex-1 truncate font-medium">{label}</span>
        {badge ? (
          <span className="rounded-full bg-crimson/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-crimson">
            {badge}
          </span>
        ) : null}
        {pulse ? <span className="size-1.5 rounded-full bg-success animate-pulse" /> : null}
      </Link>
    </li>
  );
}
