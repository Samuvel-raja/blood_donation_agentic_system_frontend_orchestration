const styles: Record<string, string> = {
  critical: "bg-crimson/12 text-crimson border-crimson/25",
  urgent: "bg-warning/12 text-warning border-warning/25",
  high: "bg-warning/12 text-warning border-warning/25",
  normal: "bg-intel/10 text-intel border-intel/25",
  accepted: "bg-success/10 text-success border-success/25",
  pending: "bg-muted text-muted-foreground border-border",
  rejected: "bg-crimson/10 text-crimson border-crimson/25",
  active: "bg-intel/10 text-intel border-intel/25",
  complete: "bg-success/10 text-success border-success/25",
};

export function StatusBadge({
  variant = "normal",
  children,
}: {
  variant?: keyof typeof styles;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${styles[variant] ?? styles.normal}`}>
      {children}
    </span>
  );
}

export function BloodGroupChip({ group }: { group: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums">
      {group}
    </span>
  );
}
