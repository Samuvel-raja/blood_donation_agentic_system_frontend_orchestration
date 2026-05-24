import { Bell, Command, Search } from "lucide-react";

export function TopBar() {
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

        <button className="rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90">
          + New Emergency
        </button>
      </div>
    </header>
  );
}
