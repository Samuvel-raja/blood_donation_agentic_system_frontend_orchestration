import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { DonorCard, donorFromUser, type Donor } from "@/components/shared/DonorCard";
import { usersByBloodGroup } from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";
import { BLOOD_GROUP_CHOICES, type BloodGroup } from "@/lib/api/blood-request";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/donors")({
  head: () => ({
    meta: [
      { title: "Donor Intelligence · PulseXira" },
      { name: "description", content: "AI-ranked donor scoring, reliability, and availability prediction." },
    ],
  }),
  component: DonorsPage,
});

const filters = ["All", ...BLOOD_GROUP_CHOICES] as const;
type Filter = (typeof filters)[number];

function DonorsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const selectedGroup = activeFilter === "All" ? undefined : (activeFilter as BloodGroup);

  const query = useQuery({
    queryKey: ["usersbybloodgroup", selectedGroup ?? ""],
    queryFn: () => usersByBloodGroup(selectedGroup),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
  });

  const donors: Donor[] = useMemo(
    () => (query.data ?? []).map(donorFromUser),
    [query.data],
  );

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
        {filters.map((f) => {
          const selected = f === activeFilter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] font-medium ${
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted-foreground hover:bg-accent"
              }`}
            >
              {f}
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {query.isFetching ? "Loading…" : `${donors.length} donors`}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {query.isError ? (
          <div className="rounded-xl border border-crimson/30 bg-crimson/10 p-4 text-sm text-crimson md:col-span-2 xl:col-span-3">
            {query.error instanceof Error ? query.error.message : "Failed to load donors"}
          </div>
        ) : null}
        {donors.map((d) => (
          <DonorCard key={d.id} d={d} />
        ))}
        {!query.isFetching && !query.isError && donors.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
            No donors found for this blood group.
          </div>
        ) : null}
      </div>
    </div>
  );
}
