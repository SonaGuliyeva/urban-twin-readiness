import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  EO_PLATFORMS,
  EO_SENSOR_FAMILIES,
  EO_INDICATORS,
  EO_HYDRO_SERVICES,
  HYDRO_INTEGRATION_APPROACHES,
  HYDRO_REFERENCE,
  LEVEL_DESCRIPTIONS,
  OPEN_SPATIAL_LAYERS,
  POLICY_THEMES,
  CASE_STUDIES,
  getDatasetsForObjectives,
  type Hazard,
  type ImplementationLevel,
} from "@/data";
import { SectionHeading } from "@/components/common/section-heading";
import { CollapsibleSection } from "@/components/common/collapsible-section";
import { StatCard } from "@/components/common/stat-card";
import { DatasetCard } from "@/components/results/dataset-card";
import { PLAIN_DATASETS } from "@/data/plain-language";
import { DataLinks } from "@/components/results/data-links";
import { EVIDENCE_BASE, LOCAL_ALTERNATIVE, linksFor, type DataLink } from "@/data/dataset-links";
import { ReadinessPanel } from "@/components/results/readiness-panel";
import { decodeStatus, type StatusMap } from "@/components/results/readiness";
import { OSLayerCard } from "@/components/results/os-layer-card";
import { PathwayCard } from "@/components/results/pathway-card";

type Search = {
  objectives: string;
  level: ImplementationLevel;
  start?: string;
  have?: string;
  city?: string;
  budget?: boolean;
};

export const Route = createFileRoute("/results")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const level = (search.level as ImplementationLevel) ?? "predictive";
    const validLevels: ImplementationLevel[] = [
      "status",
      "informative",
      "predictive",
      "optimisation",
      "autonomous",
    ];
    const validLevel: ImplementationLevel = validLevels.includes(level) ? level : "predictive";
    return {
      objectives: typeof search.objectives === "string" ? search.objectives : "",
      level: validLevel,
      start: typeof search.start === "string" ? search.start : undefined,
      have: typeof search.have === "string" ? search.have : undefined,
      city: typeof search.city === "string" ? search.city : undefined,
      budget: search.budget === true || search.budget === "true" || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Readiness profile — UrbanTwinReadiness" },
      {
        name: "description",
        content:
          "Structured dashboard of minimum datasets, source types, Earth Observation platforms and an implementation pathway for your Urban Digital Twin.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { objectives, level, city, start, have, budget } = Route.useSearch();
  const ids = objectives ? objectives.split(",").filter(Boolean) : [];

  // City's own answers: which datasets are already in its digital twin.
  // Kept per configuration in sessionStorage (optional convenience, never required).
  const storeKey = `utr-status:${objectives ?? ""}:${level}`;
  const [status, setStatus] = useState<StatusMap>({});
  useEffect(() => {
    // Answers given in the configurator arrive in the link and take priority
    if (have) {
      const names = getDatasetsForObjectives(ids, "predictive", budget).map((d) => d.name);
      setStatus(decodeStatus(names, have));
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(storeKey);
      setStatus(raw ? (JSON.parse(raw) as StatusMap) : {});
    } catch {
      setStatus({});
    }
  }, [storeKey, have, budget]);
  useEffect(() => {
    try {
      window.sessionStorage.setItem(storeKey, JSON.stringify(status));
    } catch {
      /* storage unavailable: state stays in memory */
    }
  }, [storeKey, status]);

  const allObjectives = POLICY_THEMES.flatMap((g) => g.objectives);
  const selected = ids
    .map((id) => allObjectives.find((o) => o.id === id))
    .filter((o): o is NonNullable<typeof o> => Boolean(o));

  const datasets = getDatasetsForObjectives(ids, level, budget);
  const levelInfo = LEVEL_DESCRIPTIONS[level];

  // Minimum step: open satellite datasets for the chosen objectives (one entry per plain title)
  const minimumEO = (() => {
    const byTitle = new Map<
      string,
      {
        title: string;
        name: string;
        names: string[];
        examples: string[];
        links: DataLink[];
        rank: number;
      }
    >();
    const rank = { essential: 0, recommended: 1, optional: 2 } as const;
    getDatasetsForObjectives(ids, "predictive", budget)
      .filter((d) => d.source === "satellite" && d.cost !== "commercial")
      .forEach((d) => {
        const title = PLAIN_DATASETS[d.name]?.title ?? d.name;
        const cur = byTitle.get(title);
        if (cur) {
          cur.names.push(d.name);
          linksFor(d.name, d.source).forEach((l) => {
            if (!cur.links.some((x) => x.url === l.url)) cur.links.push(l);
          });
        } else
          byTitle.set(title, {
            title,
            name: d.name,
            names: [d.name],
            examples: d.examples,
            links: [...linksFor(d.name, d.source)],
            rank: rank[d.priority],
          });
      });
    return Array.from(byTitle.values()).sort((a, b) => a.rank - b.rank);
  })();
  // Data the city marked as already in its twin leave the to-do list; the rest is ordered
  // by priority, with data that is missing before data that exists but is not yet integrated.
  const isInTwin = (d: { names: string[] }) => d.names.some((n) => status[n] === "have");
  const isPartial = (d: { names: string[] }) => d.names.some((n) => status[n] === "partial");
  const inTwin = minimumEO.filter(isInTwin);
  const toAdd = minimumEO
    .filter((d) => !isInTwin(d))
    .sort((a, b) => a.rank - b.rank || Number(isPartial(a)) - Number(isPartial(b)));
  // What the city already has, and the commercial options unlocked by a budget.
  const haveCount = datasets.filter((d) => status[d.name] === "have").length;
  const commercialDatasets = datasets.filter((d) => d.cost === "commercial");
  const showCommercial = budget && commercialDatasets.length > 0;
  const LEVEL_ORDER: ImplementationLevel[] = [
    "status",
    "informative",
    "predictive",
    "optimisation",
    "autonomous",
  ];
  const nextLevelId = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1];
  const nextLevelInfo = nextLevelId ? LEVEL_DESCRIPTIONS[nextLevelId] : null;

  if (selected.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">No objectives selected</h1>
        <p className="mt-3 text-muted-foreground">
          Return to the configurator and select at least one environmental objective to generate a
          profile.
        </p>
        <Link
          to="/configure"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to configurator
        </Link>
      </div>
    );
  }

  const essentialCount = datasets.filter((d) => d.priority === "essential").length;
  const satelliteCount = datasets.filter((d) => d.source === "satellite").length;

  // Real-world case studies relevant to at least one selected objective
  const relevantCaseStudies = CASE_STUDIES.filter((cs) =>
    cs.relatedObjectives.some((id) => ids.includes(id)),
  );

  // Curate EO platforms shown — at the Status level, keep it to core Copernicus platforms
  const platforms = level === "status" ? EO_PLATFORMS.slice(0, 5) : EO_PLATFORMS;

  // Hydrological hazards focus — surfaced when flood-risk and/or drought are selected
  const hydroHazards: Hazard[] = [
    ...(ids.includes("flood-risk") ? (["flood"] as Hazard[]) : []),
    ...(ids.includes("drought") ? (["drought"] as Hazard[]) : []),
  ];
  const showHydro = hydroHazards.length > 0;
  const hydroSensors = EO_SENSOR_FAMILIES.filter((f) =>
    f.roles.some((r) => hydroHazards.includes(r.hazard)),
  );
  const hydroIndicators = EO_INDICATORS.filter((i) =>
    hydroHazards.some((h) => (h === "flood" ? i.flood : i.drought)),
  );
  const hydroServices = EO_HYDRO_SERVICES.filter((s) =>
    s.hazards.some((h) => hydroHazards.includes(h)),
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      {/* Header */}
      <header className="border-b border-border pb-8">
        <p className="text-xs font-semibold text-muted-foreground">Data requirement profile</p>
        <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">
          {city ? `${city} — ` : ""}Urban Digital Twin readiness
        </h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground">
          Generated from {selected.length} environmental objective{selected.length === 1 ? "" : "s"}{" "}
          at the{" "}
          <span className="font-medium text-foreground">
            {levelInfo.title.split(" — ")[0].toLowerCase()}
          </span>{" "}
          technical maturity level.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {selected.map((o) => (
            <span
              key={o.id}
              className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-foreground"
            >
              {o.label}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/configure"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            ← Adjust configuration
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Export / print
          </button>
        </div>
      </header>

      {/* Your answers */}
      <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <h2 className="font-serif text-2xl text-foreground">Your answers</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Objectives
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">
              {selected.map((o) => o.label).join(", ")}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Data you already have
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">
              {Object.keys(status).length === 0
                ? "Not specified"
                : `${haveCount} of ${datasets.length} datasets`}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Budget
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">
              {budget ? "Open and commercial data" : "Open data only"}
            </p>
          </div>
        </div>
      </section>

      {/* 1. Data to add */}
      <section className="mt-10">
        <h2 className="font-serif text-3xl text-foreground">Satellite data to add</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          These datasets bring environmental information into your digital twin. Where your city
          already has something more detailed, keep it.
        </p>
        {toAdd.length === 0 && (
          <p className="mt-5 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-foreground/85">
            Everything on this list is already in your twin. Keep it up to date.
          </p>
        )}
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {toAdd.map((d) => {
            const plain = PLAIN_DATASETS[d.name];
            const have = d.names.some((n) => status[n] === "have");
            const local = d.names.map((n) => LOCAL_ALTERNATIVE[n]).find(Boolean);
            return (
              <li
                key={d.title}
                className={`rounded-lg border border-border bg-card p-4 ${have ? "opacity-70" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-foreground">{d.title}</p>
                  {have && (
                    <span className="shrink-0 rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[11px] font-semibold text-accent">
                      Already in your twin
                    </span>
                  )}
                </div>
                {plain && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{plain.what}</p>
                )}
                {d.examples.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Example sources: </span>
                    {d.examples.slice(0, 3).join(", ")}
                  </p>
                )}
                {local && (
                  <p className="mt-2 rounded-md border border-recommended/30 bg-recommended/10 px-2.5 py-1.5 text-xs leading-relaxed text-foreground/85">
                    {have
                      ? "You already have this in your twin. Keep yours unless the satellite version covers more of the city."
                      : local}
                  </p>
                )}
                <DataLinks
                  links={d.links}
                  label={local ? "Free fallback" : have ? "Optional source" : "Open the data"}
                />
              </li>
            );
          })}
        </ul>
        {inTwin.length > 0 && (
          <details className="mt-4 rounded-lg border border-border bg-card p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">
              Already in your twin ({inTwin.length})
            </summary>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {inTwin.map((d) => (
                <li key={d.title}>{d.title}</li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {/* 2. Commercial imagery â only when the city indicated a budget */}
      {showCommercial && (
        <section className="mt-10">
          <h2 className="font-serif text-3xl text-foreground">With a budget: commercial imagery</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            You indicated the city can invest in data. These paid products add resolution, speed or
            all-weather coverage beyond the open baseline. Use them where free data is not enough.
          </p>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {commercialDatasets.map((d) => (
              <li key={d.name} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-foreground">{d.name}</p>
                  <span className="shrink-0 rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                    Commercial
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {d.description}
                </p>
                {d.examples.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Examples: </span>
                    {d.examples.join(", ")}
                  </p>
                )}
                {(d.resolution || d.access) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[d.resolution, d.access].filter(Boolean).join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. Where to start */}
      <section className="mt-10">
        <h2 className="font-serif text-3xl text-foreground">Where to start</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          You do not need everything at once. A suggested order, starting from the lowest-cost,
          highest-value sources.
        </p>
        <ol className="mt-6 space-y-4">
          <li className="grid gap-3 rounded-lg border border-border bg-card p-5 shadow-card sm:grid-cols-[120px_1fr] sm:gap-6">
            <div>
              <p className="text-xs font-semibold text-accent">Phase 1</p>
              <span className="mt-2 inline-block rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                Start here
              </span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-foreground">Essential datasets</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Non-negotiable for the selected objectives — acquire these first, favouring open
                sources where available.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {datasets
                  .filter((d) => d.priority === "essential")
                  .map((d) => (
                    <span
                      key={d.name}
                      className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-foreground/80"
                    >
                      {d.name}
                    </span>
                  ))}
              </div>
            </div>
          </li>
          {datasets.some((d) => d.priority === "recommended") && (
            <li className="grid gap-3 rounded-lg border border-border bg-card p-5 shadow-card sm:grid-cols-[120px_1fr] sm:gap-6">
              <div>
                <p className="text-xs font-semibold text-accent">Phase 2</p>
                <span className="mt-2 inline-block rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  Build capacity
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-foreground">Recommended datasets</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Once essentials are in place, these sharpen accuracy and add resolution.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {datasets
                    .filter((d) => d.priority === "recommended")
                    .map((d) => (
                      <span
                        key={d.name}
                        className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-foreground/80"
                      >
                        {d.name}
                      </span>
                    ))}
                </div>
              </div>
            </li>
          )}
          <li className="grid gap-3 rounded-lg border border-border bg-card p-5 shadow-card sm:grid-cols-[120px_1fr] sm:gap-6">
            <div>
              <p className="text-xs font-semibold text-accent">Phase 3</p>
              <span className="mt-2 inline-block rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                Advance
              </span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-foreground">
                {nextLevelInfo
                  ? `Reach ${nextLevelInfo.title.replace(/^Level \d+ . /, "")}`
                  : "Sustain and refine"}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {nextLevelInfo
                  ? "Once the data foundation above is in place, these steps move toward the next maturity level."
                  : "This is already the most advanced maturity level. Focus shifts to sustaining data quality and governance."}
              </p>
              <ul className="mt-3 space-y-1.5">
                {(nextLevelInfo?.nextSteps ?? levelInfo.nextSteps).map((step) => (
                  <li
                    key={step}
                    className="flex gap-2.5 text-sm leading-relaxed text-foreground/80"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ol>
      </section>

      <p className="mt-10 text-sm text-muted-foreground print:hidden">
        Want to see how a real city did it?{" "}
        <Link to="/turin" className="font-medium text-primary underline-offset-4 hover:underline">
          See how Turin added satellite data to its digital twin
        </Link>
        .
      </p>

      <p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
        This profile is a research-based decision-support output, intended to inform early scoping
        and stakeholder discussion, not to replace a formal technical feasibility study.
      </p>
    </div>
  );
}
