import type React from "react";
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
  TURIN_SEGMENTS,
  TURIN_SUMMARY,
  getDatasetsForObjectives,
  type Dataset,
  type Hazard,
  type ImplementationLevel,
} from "@/data";
import { SectionHeading } from "@/components/common/section-heading";
import { StatCard } from "@/components/common/stat-card";
import { DatasetCard } from "@/components/results/dataset-card";
import { OSLayerCard } from "@/components/results/os-layer-card";
import { PathwayCard } from "@/components/results/pathway-card";

type Search = {
  objectives: string;
  level: ImplementationLevel;
  city?: string;
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
      city: typeof search.city === "string" ? search.city : undefined,
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
  const { objectives, level, city } = Route.useSearch();
  const ids = objectives ? objectives.split(",").filter(Boolean) : [];

  const allObjectives = POLICY_THEMES.flatMap((g) => g.objectives);
  const selected = ids
    .map((id) => allObjectives.find((o) => o.id === id))
    .filter((o): o is NonNullable<typeof o> => Boolean(o));

  const datasets = getDatasetsForObjectives(ids, level);
  const levelInfo = LEVEL_DESCRIPTIONS[level];
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
          Return to the configurator and select at least one policy objective to generate a profile.
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
    cs.relatedObjectives.some((id) => ids.includes(id))
  );

  // Turin worked example: shown only when the user names Turin/Torino as their city
  const isTurin = city ? /^(turin|torino)$/i.test(city.trim()) : false;
  const turinRelevant = ["uhi", "drought", "climate-resilience", "green-infra"].some((id) =>
    ids.includes(id)
  );
  const showTurinCase = isTurin && turinRelevant;
  const turinHottest = [...TURIN_SEGMENTS].sort((a, b) => b.lst - a.lst).slice(0, 8);

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

  // ---- Roadmap groupings: the concrete result of the assessment ----
  const isFree = (d: Dataset) => d.source === "satellite" || d.source === "open-data";
  const essential = datasets.filter((d) => d.priority === "essential");
  const essentialFree = essential.filter(isFree);
  const essentialRequest = essential.filter((d) => !isFree(d));
  const recommended = datasets.filter((d) => d.priority === "recommended");
  const optional = datasets.filter((d) => d.priority === "optional");
  const freeCount = datasets.filter(isFree).length;

  const handlePrint = () => {
    // Open every collapsed section so the printout contains the full profile
    document.querySelectorAll("details").forEach((el) => el.setAttribute("open", ""));
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <header className="border-b border-border pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Your Urban Digital Twin roadmap
        </p>
        <h1 className="mt-2 text-3xl text-foreground sm:text-4xl">
          {city ? `${city}: ` : ""}what to do, in what order
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          {selected.map((o) => o.label).join(" · ")} — at{" "}
          <span className="font-medium text-foreground">{levelInfo.title}</span>
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 print:hidden">
          <Link
            to="/configure"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            ← Change selection
          </Link>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Export / print
          </button>
        </div>
      </header>

      {/* At a glance */}
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Datasets in total" value={datasets.length} />
        <StatCard label="Must-have (Phase 1)" value={essentialCount} accent="essential" />
        <StatCard label="Free to download" value={freeCount} accent="eo" />
        <StatCard label="Need a request" value={datasets.length - freeCount} />
      </section>

      {/* ROADMAP — the main result */}
      <section id="roadmap" className="mt-10">
        <ol className="space-y-5">
          {/* Phase 1 */}
          <PhaseCard
            n={1}
            badge="Start here"
            title="Collect the must-have data"
            outcome={`After this step you have the minimum data foundation for ${
              selected.length === 1 ? "this objective" : "these objectives"
            }.`}
            highlight
          >
            {essentialFree.length > 0 && (
              <ChecklistGroup
                label="1a · Free — download now"
                hint="Open satellite and open-data sources; no agreement needed."
                items={essentialFree}
              />
            )}
            {essentialRequest.length > 0 && (
              <ChecklistGroup
                label="1b · Request from agencies"
                hint="Ground sensors and administrative records; usually need a data-sharing request."
                items={essentialRequest}
              />
            )}
          </PhaseCard>

          {/* Phase 2 */}
          {recommended.length > 0 && (
            <PhaseCard
              n={2}
              badge="Next"
              title="Add data that improves accuracy"
              outcome="After this step your outputs are more detailed and more reliable."
            >
              <ChecklistGroup items={recommended} />
              {optional.length > 0 && (
                <p className="mt-4 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">Optional, if resources allow:</span>{" "}
                  {optional.map((d) => d.name).join(" · ")}
                </p>
              )}
            </PhaseCard>
          )}

          {/* Phase 3 */}
          <PhaseCard
            n={recommended.length > 0 ? 3 : 2}
            badge="Then"
            title={
              nextLevelInfo
                ? `Move up to ${nextLevelInfo.title.replace(/^Level \d+ . /, "")}`
                : "Sustain and refine"
            }
            outcome={
              nextLevelInfo
                ? `After this step the city can: ${nextLevelInfo.capable[0].replace(/\.$/, "").toLowerCase()}.`
                : "The twin stays accurate, governed and trusted over time."
            }
          >
            <ol className="space-y-2">
              {(nextLevelInfo?.nextSteps ?? levelInfo.nextSteps).map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[10px] text-muted-foreground">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </PhaseCard>
        </ol>
      </section>

      {/* DETAILS — everything else, collapsed by default */}
      <section className="mt-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Details and evidence
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Background for the roadmap above. Open a section only when you need it.
        </p>

        <div className="mt-5 space-y-3">
          <Fold
            id="level"
            title={`Your maturity level: ${levelInfo.title}`}
            meta="What a city at this level can and cannot do"
          >
            <p className="text-sm leading-relaxed text-foreground/80">{levelInfo.short}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <PathwayCard title="Can do" tone="primary" items={levelInfo.capable} />
              <PathwayCard title="Limitations" tone="muted" items={levelInfo.missing} />
            </div>
          </Fold>

          <Fold
            id="datasets"
            title="Full dataset descriptions"
            meta={`${datasets.length} datasets with provider, resolution and access`}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {datasets.map((d) => (
                <DatasetCard key={d.name} dataset={d} />
              ))}
            </div>
          </Fold>

          {showTurinCase && (
            <Fold
              id="turin-case"
              title="Turin: worked example with real data"
              meta={`${TURIN_SUMMARY.segmentCount} road segments, SDGSAT-1 LST and NDVI`}
            >
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                The same approach applied to {TURIN_SUMMARY.segmentCount} road segments in Turin's
                Barriera di Milano / Po&ndash;Stura confluence area, enriched with airborne and
                Sentinel-2 vegetation indices and SDGSAT-1 summer land surface temperature (
                {TURIN_SUMMARY.acquisitionDate}), from the author&rsquo;s doctoral research.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Segments analysed" value={TURIN_SUMMARY.segmentCount} />
                <StatCard
                  label="Environmentally stressed"
                  value={`${TURIN_SUMMARY.envStressedCount} (${Math.round(
                    (TURIN_SUMMARY.envStressedCount / TURIN_SUMMARY.segmentCount) * 100,
                  )}%)`}
                  accent="essential"
                />
                <StatCard
                  label={`Thermal stress (>${TURIN_SUMMARY.thermalThresholdC}°C)`}
                  value={TURIN_SUMMARY.thermalStressedCount}
                  accent="eo"
                />
                <StatCard label="Mean summer LST" value={`${TURIN_SUMMARY.lstMean}°C`} />
              </div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Hottest segments in the analysed network
              </p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2.5">Street</th>
                      <th className="px-4 py-2.5">LST</th>
                      <th className="px-4 py-2.5">Impervious</th>
                      <th className="px-4 py-2.5">Stress flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turinHottest.map((s) => (
                      <tr key={s.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 text-foreground/85">{s.street}</td>
                        <td className="px-4 py-2.5 text-foreground/85">{s.lst}&deg;C</td>
                        <td className="px-4 py-2.5 text-foreground/85">{s.imperviousPct}%</td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1.5">
                            {s.thermalStressed && (
                              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                                thermal
                              </span>
                            )}
                            {s.droughtStressed && (
                              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                drought
                              </span>
                            )}
                            {!s.thermalStressed && !s.droughtStressed && s.envStressed && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                other
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Source: SDGSAT-1 TIS land surface temperature, airborne and Sentinel-2 NDVI/NDWI.
                Full methodology in Guliyeva, S., Scolamiero, V., Boccardo, P., Di Rita, M.,
                Vizireanu, A., &amp; Alaskarov, E. (2026).{" "}
                <span className="italic">
                  Integrating Multi-source Earth Observation Data into Urban Digital Twin
                  Architectures: Environmental Data Enrichment for the City of Turin.
                </span>{" "}
                In Proceedings of the 77th International Astronautical Congress (IAC 2026),
                International Astronautical Federation.
              </p>
            </Fold>
          )}

          {relevantCaseStudies.length > 0 && (
            <Fold
              id="in-practice"
              title="Cities already doing this"
              meta={`${relevantCaseStudies.length} documented deployment${
                relevantCaseStudies.length === 1 ? "" : "s"
              } related to your objectives`}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {relevantCaseStudies.map((cs) => (
                  <div key={cs.name} className="rounded-xl border border-border bg-card p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {cs.city}
                    </p>
                    <h4 className="mt-1 font-serif text-lg text-foreground">{cs.name}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">{cs.summary}</p>
                    <p className="mt-3 text-xs text-muted-foreground">Source: {cs.source}</p>
                  </div>
                ))}
              </div>
            </Fold>
          )}

          {showHydro && (
            <Fold
              id="hydro"
              title={
                hydroHazards.length === 2
                  ? "Flood and drought: EO technical reference"
                  : hydroHazards[0] === "flood"
                    ? "Flood: EO technical reference"
                    : "Drought: EO technical reference"
              }
              meta="Sensors, indicators, integration approaches and operational services"
            >
              <p className="max-w-3xl text-sm leading-relaxed text-foreground/80">
                Adapted from a peer-reviewed review of Earth Observation for flood and drought
                management (Guliyeva &amp; Boccardo, 2026).
              </p>

              <h4 className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Sensor families and operational roles
              </h4>
              <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border bg-surface-elevated">
                    <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      <th className="px-4 py-3">Sensor family</th>
                      <th className="px-4 py-3">Key missions</th>
                      <th className="px-4 py-3">Resolution / revisit</th>
                      <th className="px-4 py-3">Operational role</th>
                      <th className="px-4 py-3">Limitations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hydroSensors.map((f) => (
                      <tr key={f.family} className="border-b border-border/60 align-top last:border-0">
                        <td className="px-4 py-3 font-medium text-foreground">{f.family}</td>
                        <td className="px-4 py-3 text-muted-foreground">{f.missions.join(", ")}</td>
                        <td className="px-4 py-3 text-muted-foreground">{f.resolution}</td>
                        <td className="px-4 py-3 text-foreground/85">
                          <ul className="space-y-1">
                            {f.roles
                              .filter((r) => hydroHazards.includes(r.hazard))
                              .map((r) => (
                                <li key={r.hazard}>
                                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                                    {r.hazard}
                                  </span>{" "}
                                  — {r.description}
                                </li>
                              ))}
                          </ul>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{f.limitations}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                EO-derived indicators
              </h4>
              <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border bg-surface-elevated">
                    <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      <th className="px-4 py-3">Group</th>
                      <th className="px-4 py-3">Indicator</th>
                      {hydroHazards.includes("flood") && <th className="px-4 py-3">Flood</th>}
                      {hydroHazards.includes("drought") && <th className="px-4 py-3">Drought</th>}
                      <th className="px-4 py-3">EO sources</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hydroIndicators.map((i) => (
                      <tr key={i.indicator} className="border-b border-border/60 align-top last:border-0">
                        <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          {i.group}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{i.indicator}</td>
                        {hydroHazards.includes("flood") && (
                          <td className="px-4 py-3 text-foreground/85">{i.flood ?? "—"}</td>
                        )}
                        {hydroHazards.includes("drought") && (
                          <td className="px-4 py-3 text-foreground/85">{i.drought ?? "—"}</td>
                        )}
                        <td className="px-4 py-3 text-muted-foreground">{i.sources.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Multi-source integration approaches
              </h4>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {HYDRO_INTEGRATION_APPROACHES.map((a) => (
                  <div key={a.approach} className="rounded-lg border border-border bg-card p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h5 className="font-serif text-base text-foreground">{a.approach}</h5>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {a.scale}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground/85">{a.data}</p>
                    <p className="mt-2 text-xs italic text-muted-foreground">Example — {a.example}</p>
                    <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                      {a.performance}
                    </p>
                  </div>
                ))}
              </div>

              <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Operational services
              </h4>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hydroServices.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h5 className="font-serif text-base leading-tight text-foreground">{s.name}</h5>
                      <span className="shrink-0 rounded-full border border-border bg-surface-elevated px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {s.scope}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  </a>
                ))}
              </div>

              <p className="mt-6 text-xs text-muted-foreground">
                Adapted from{" "}
                <a
                  href={HYDRO_REFERENCE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted underline-offset-2 hover:text-foreground"
                >
                  {HYDRO_REFERENCE.citation}
                </a>{" "}
                (DOI: {HYDRO_REFERENCE.doi}).
              </p>
            </Fold>
          )}

          <Fold
            id="platforms"
            title="Where to download satellite data"
            meta={`${platforms.length} Earth Observation platforms, with direct links`}
          >
            <p className="max-w-3xl text-sm leading-relaxed text-foreground/80">
              Earth Observation gives repeated, city-wide measurements of variables that ground
              networks miss (atmospheric composition, land surface temperature, vegetation, soil
              moisture). It works best combined with in-situ sensors and administrative records;
              Copernicus provides the free, open baseline.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <h4 className="font-serif text-base leading-tight text-foreground">
                    {p.name} <span className="text-muted-foreground group-hover:text-accent">↗</span>
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                </a>
              ))}
            </div>
          </Fold>

          <Fold
            id="open-layers"
            title="Base map layers (free)"
            meta={`${OPEN_SPATIAL_LAYERS.length} open layers: streets, buildings, terrain, boundaries`}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {OPEN_SPATIAL_LAYERS.map((layer) => (
                <OSLayerCard key={layer.name} layer={layer} />
              ))}
            </div>
          </Fold>
        </div>
      </section>

      <p className="mt-14 border-t border-border pt-6 text-xs text-muted-foreground">
        Research-based decision-support output for early scoping and stakeholder discussion; it
        does not replace a formal technical feasibility study.
      </p>
    </div>
  );
}

/* ---------- Local presentational components ---------- */

function PhaseCard({
  n,
  badge,
  title,
  outcome,
  highlight = false,
  children,
}: {
  n: number;
  badge: string;
  title: string;
  outcome: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      className={`rounded-xl border p-5 shadow-card sm:p-6 ${
        highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm ${
            highlight ? "bg-primary text-primary-foreground" : "border border-border text-foreground"
          }`}
        >
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Step {n} · {badge}
          </p>
          <h2 className="mt-1 font-serif text-xl text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">Result:</span> {outcome}
          </p>
          <div className="mt-4 space-y-5">{children}</div>
        </div>
      </div>
    </li>
  );
}

function ChecklistGroup({
  label,
  hint,
  items,
}: {
  label?: string;
  hint?: string;
  items: Dataset[];
}) {
  return (
    <div>
      {label && (
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/80">{label}</p>
      )}
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border bg-background">
        {items.map((d) => (
          <li key={d.name} className="flex gap-3 px-3 py-2.5">
            <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-sm border border-muted-foreground/50" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{d.name}</p>
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground/70">Get it from:</span> {d.examples.join(" · ")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fold({
  id,
  title,
  meta,
  children,
}: {
  id: string;
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <details id={id} className="group rounded-xl border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <h3 className="font-serif text-base text-foreground sm:text-lg">{title}</h3>
          {meta && <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>}
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-border px-5 py-5">{children}</div>
    </details>
  );
}
