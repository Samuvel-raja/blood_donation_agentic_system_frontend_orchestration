import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useState, useRef, useEffect } from "react";
import { Bell, Command, Search, LogOut, ChevronDown, User } from "lucide-react";

export function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.navigate({ to: "/login" }).catch(() => {});
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/60 px-4 backdrop-blur-md md:px-8">
      <div className="flex flex-1 items-center gap-3">
        <button className="flex w-full max-w-md items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-left transition-colors hover:bg-surface-elevated">
          <Search className="size-4 text-muted-foreground" />
          <span className="flex-1 text-sm text-muted-foreground">
            Search requests, donors, hospitals, nodes…
          </span>
          <kbd className="hidden items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            <Command className="size-3" /> K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 lg:flex">
          <span className="relative grid size-2 place-items-center">
            <span className="absolute inset-0 rounded-full bg-success/40 animate-ping" />
            <span className="size-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Engine nominal · 22ms
          </span>
        </div>

        <button className="relative grid size-9 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-crimson shadow-glow-crimson" />
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm transition-colors hover:bg-surface-elevated"
          >
            <div className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-crimson to-crimson-glow text-[10px] font-semibold text-white">
              {initials}
            </div>
            <span className="hidden font-medium md:inline">{user?.name ?? "User"}</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-elevated animate-ticker">
              <div className="border-b border-border px-4 py-3">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="px-2 py-1.5">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  disabled
                >
                  <User className="size-4" />
                  Profile settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-crimson transition-colors hover:bg-crimson/10"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
