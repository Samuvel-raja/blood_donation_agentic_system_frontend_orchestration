import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { DonorCard, donors } from "@/components/shared/DonorCard";

export const Route = createFileRoute("/donors")({
  head: () => ({
    meta: [
      { title: "Donor Intelligence · PulseXira" },
      { name: "description", content: "AI-ranked donor scoring, reliability, and availability prediction." },
    ],
  }),
  component: DonorsPage,
});

const filters = ["All", "O−", "O+", "A+", "A−", "B+", "B−", "AB+", "AB−"];

function DonorsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <PageHeader
        eyebrow="Donor intelligence"
        title="Ranked Donor Registry"
        description="AI scoring across reliability, response rate, and availability prediction."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Verified donors" value="12,481" delta="+82" trend="up" />
        <KpiCard label="Avg reliability" value="86%" hint="AI weighted" accent="success" />
        <KpiCard label="Response rate" value="79%" delta="+1.2%" trend="up" accent="intel" />
        <KpiCard label="Eligible now" value="3,920" hint="Cooldown cleared" />
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f, i) => (
          <button key={f}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] font-medium ${
              i === 0 ? "border-foreground bg-foreground text-background" : "border-border bg-surface text-muted-foreground hover:bg-accent"
            }`}>
            {f}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Sorted by AI score
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {donors.map((d) => <DonorCard key={d.id} d={d} />)}
      </div>
    </div>
  );
}
