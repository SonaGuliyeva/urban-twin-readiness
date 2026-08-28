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

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      {/* Header */}
      <header className="border-b border-border pb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Data requirement profile
        </p>
        <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">
          {city ? `${city} — ` : ""}Urban Digital Twin readiness
        </h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground">
          Generated from {selected.length} policy objective{selected.length === 1 ? "" : "s"} at the{" "}
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

      {/* Jump-to section nav — sticky under the main site header */}
      <nav
        aria-label="Sections in this profile"
        className="sticky top-0 z-10 -mx-6 mt-0 flex gap-1 overflow-x-auto border-b border-border bg-background/95 px-6 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80 print:hidden"
      >
        {[
          { id: "summary", label: "Summary" },
          { id: "datasets", label: "Datasets" },
          ...(showTurinCase ? [{ id: "turin-case", label: "Turin example" }] : []),
          ...(relevantCaseStudies.length > 0 ? [{ id: "in-practice", label: "In practice" }] : []),
          ...(showHydro ? [{ id: "hydro", label: "Hydro focus" }] : []),
          { id: "eo-role", label: "EO role" },
          { id: "platforms", label: "Platforms" },
          { id: "open-layers", label: "Open layers" },
          { id: "interpretation", label: "Limitations" },
          { id: "roadmap", label: "Roadmap" },
        ].map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 rounded-full px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* Summary */}
      <section id="summary" className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Summary</p>
          <h2 className="mt-2 font-serif text-2xl text-foreground">{levelInfo.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">{levelInfo.short}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The selected configuration requires{" "}
            <span className="font-medium text-foreground">{datasets.length} datasets</span>, of
            which{" "}
            <span className="font-medium text-foreground">{essentialCount} are essential</span> and{" "}
            <span className="font-medium text-foreground">
              {satelliteCount} can be sourced from Earth Observation
            </span>
            .
          </p>

          <div className="mt-6 border-t border-border pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              At this level, a city can
            </p>
            <ul className="mt-3 space-y-2">
              {levelInfo.capable.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <StatCard label="Datasets identified" value={datasets.length} />
          <StatCard label="Essential" value={essentialCount} accent="essential" />
          <StatCard label="Satellite / EO" value={satelliteCount} accent="eo" />
          <StatCard label="Reference platforms" value={platforms.length} />
        </aside>
      </section>

      {/* Turin worked example — real object-level data from the author's PhD research */}
      {showTurinCase && (
        <section id="turin-case" className="mt-16 rounded-xl border border-accent/30 bg-accent/5 p-6 shadow-card sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            Worked example — real data
          </p>
          <h2 className="mt-2 font-serif text-2xl text-foreground">
            Turin: what this looks like with real object-level data
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The recommendations above are generic. This is what the same approach produces when
            applied to real infrastructure: {TURIN_SUMMARY.segmentCount} road segments in Turin's
            Barriera di Milano / Po&ndash;Stura confluence area, enriched with airborne and
            Sentinel-2 vegetation indices and SDGSAT-1 summer land surface temperature (
            {TURIN_SUMMARY.acquisitionDate}), from the author&rsquo;s doctoral research.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Segments analysed" value={TURIN_SUMMARY.segmentCount} />
            <StatCard
              label="Environmentally stressed"
              value={`${TURIN_SUMMARY.envStressedCount} (${Math.round(
                (TURIN_SUMMARY.envStressedCount / TURIN_SUMMARY.segmentCount) * 100
              )}%)`}
              accent="essential"
            />
            <StatCard
              label={`Thermal stress (>${TURIN_SUMMARY.thermalThresholdC}\u00b0C)`}
              value={TURIN_SUMMARY.thermalStressedCount}
              accent="eo"
            />
            <StatCard label="Mean summer LST" value={`${TURIN_SUMMARY.lstMean}\u00b0C`} />
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Hottest segments in the analysed network
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Street
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    LST
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Impervious
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Stress flags
                  </th>
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
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Source: SDGSAT-1 TIS land surface temperature, airborne and Sentinel-2 NDVI/NDWI. Full
            methodology in Guliyeva, S., Scolamiero, V., Boccardo, P., Di Rita, M., Vizireanu, A.,
            &amp; Alaskarov, E. (2026).{" "}
            <span className="italic">
              Integrating Multi-source Earth Observation Data into Urban Digital Twin
              Architectures: Environmental Data Enrichment for the City of Turin.
            </span>{" "}
            In Proceedings of the 77th International Astronautical Congress (IAC 2026),
            International Astronautical Federation.
          </p>
        </section>
      )}

      {/* Datasets */}
      <section id="datasets" className="mt-12">
        <SectionHeading eyebrow="Data inventory" title="Minimum required datasets" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {datasets.map((d) => (
            <DatasetCard key={d.name} dataset={d} />
          ))}
        </div>
      </section>

      {/* Real-world case studies relevant to the selected objectives */}
      {relevantCaseStudies.length > 0 && (
        <section id="in-practice" className="mt-16">
          <SectionHeading eyebrow="In practice" title="Cities already doing this" />
          <p className="mt-2 text-sm text-muted-foreground">
            Publicly documented deployments related to the objectives you selected.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {relevantCaseStudies.map((cs) => (
              <div
                key={cs.name}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {cs.city}
                </p>
                <h3 className="mt-1 font-serif text-lg text-foreground">{cs.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{cs.summary}</p>
                <p className="mt-3 text-xs text-muted-foreground">Source: {cs.source}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hydrological hazards focus — flood and/or drought */}
      {showHydro && (
        <section id="hydro" className="mt-16">
          <SectionHeading
            eyebrow="Hydrological hazards focus"
            title={
              hydroHazards.length === 2
                ? "Flood and drought — EO operational reference"
                : hydroHazards[0] === "flood"
                  ? "Flood — EO operational reference"
                  : "Drought — EO operational reference"
            }
          />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80">
            The synthesis below is adapted from a peer-reviewed review of Earth Observation for
            flood and drought management (Guliyeva &amp; Boccardo, 2026). It maps EO sensor
            families, derived indicators, multi-source integration approaches and operational
            services to the selected hazard(s), supporting evidence-based scoping of the Urban
            Digital Twin.
          </p>

          <div className="mt-8">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              EO sensor families and operational roles
            </h3>
            <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card shadow-card">
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
                    <tr
                      key={f.family}
                      className="border-b border-border/60 align-top last:border-0"
                    >
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
          </div>

          <div className="mt-10">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              EO-derived indicators for hydrological monitoring
            </h3>
            <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card shadow-card">
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
                    <tr
                      key={i.indicator}
                      className="border-b border-border/60 align-top last:border-0"
                    >
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
          </div>

          <div className="mt-10">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Multi-source EO integration approaches
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {HYDRO_INTEGRATION_APPROACHES.map((a) => (
                <div
                  key={a.approach}
                  className="rounded-lg border border-border bg-card p-5 shadow-card"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="font-serif text-base text-foreground">{a.approach}</h4>
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
          </div>

          <div className="mt-10">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Operational EO services for{" "}
              {hydroHazards.length === 2 ? "flood and drought" : hydroHazards[0]}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hydroServices.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-serif text-base leading-tight text-foreground">{s.name}</h4>
                    <span className="shrink-0 rounded-full border border-border bg-surface-elevated px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {s.scope}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                    {s.hazards.join(" · ")}
                  </p>
                </a>
              ))}
            </div>
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
        </section>
      )}

      {/* EO Role */}
      <section id="eo-role" className="mt-16 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <SectionHeading eyebrow="Earth Observation" title="Role of satellite and EO data" inline />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80">
          Earth Observation provides repeated, spatially consistent measurements across the entire
          urban area. It supports the monitoring of variables that are difficult to capture with
          ground networks alone — atmospheric composition, land surface temperature, vegetation
          condition, soil moisture, and morphological change.
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground/80">
          EO data is most effective when integrated with in-situ sensors and administrative records.
          The Copernicus programme provides a free, open, and operationally maintained baseline,
          complemented by national and thematic platforms.
        </p>
      </section>

      {/* Platforms */}
      <section id="platforms" className="mt-12">
        <SectionHeading eyebrow="Reference platforms" title="Key Earth Observation sources" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-lg leading-tight text-foreground">{p.name}</h3>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Open Spatial Layers */}
      <section id="open-layers" className="mt-16">
        <SectionHeading
          eyebrow="Open Spatial Layers (OS Layers)"
          title="Open spatial layers for integration"
        />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80">
          The following open spatial datasets provide a foundational geospatial baseline for an
          Urban Digital Twin. They complement Earth Observation products by adding street networks,
          buildings, terrain and administrative reference layers — and are typically free to access.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {OPEN_SPATIAL_LAYERS.map((layer) => (
            <OSLayerCard key={layer.name} layer={layer} />
          ))}
        </div>
      </section>

      {/* Interpretation for the City */}
      <section id="interpretation" className="mt-16">
        <SectionHeading eyebrow="Interpretation for the city" title="Key limitations at this level" />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80">
          Beyond the data itself, these are the capability gaps that typically remain at this
          technical maturity level — worth flagging to stakeholders alongside the data profile above.
        </p>
        <div className="mt-6 max-w-2xl">
          <PathwayCard title="Key limitations" tone="muted" items={levelInfo.missing} />
        </div>
      </section>

      {/* City data roadmap — a phased path forward for this specific configuration */}
      <section id="roadmap" className="mt-16 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <SectionHeading
          eyebrow="Roadmap"
          title={city ? `Recommended path for ${city}` : "Recommended path for your city"}
          inline
        />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80">
          Not every dataset above needs to be acquired at once. This is a suggested sequence for
          building toward the selected configuration, starting from the lowest-cost, highest-value
          sources.
        </p>

        <ol className="mt-6 space-y-4">
          <li className="grid gap-3 rounded-lg border border-border bg-card p-5 shadow-card sm:grid-cols-[120px_1fr] sm:gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Phase 1</p>
              <span className="mt-2 inline-block rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
                Start here
              </span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-foreground">Essential datasets</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                These are non-negotiable for the selected objectives — prioritise acquiring them
                first, favouring open-access sources where available.
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
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Phase 2</p>
                <span className="mt-2 inline-block rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Build capacity
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-foreground">Recommended datasets</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Once essentials are in place, these sharpen accuracy and add resolution — typically
                  ground sensors or administrative records requiring a data-sharing agreement.
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
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Phase 3</p>
              <span className="mt-2 inline-block rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
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
                  ? "Once the data foundation above is in place, these steps move the city toward the next technical maturity level."
                  : "This configuration already reflects the most advanced technical maturity level. Focus shifts to sustaining data quality and governance."}
              </p>
              <ul className="mt-3 space-y-1.5">
                {(nextLevelInfo?.nextSteps ?? levelInfo.nextSteps).map((step) => (
                  <li key={step} className="flex gap-2.5 text-sm leading-relaxed text-foreground/80">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ol>
      </section>

      {/* Footer note */}
      <p className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
        This profile is a research-based decision-support output. It is intended to inform early
        scoping and stakeholder discussion, not to replace a formal technical feasibility study.
      </p>
    </div>
  );
}
