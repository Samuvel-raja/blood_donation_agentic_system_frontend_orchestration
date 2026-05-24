export function PageHeader({
  eyebrow, title, description, actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-crimson shadow-glow-crimson" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-crimson">
            {eyebrow}
          </p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
