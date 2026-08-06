import { createFileRoute, Link } from "@tanstack/react-router";
import {
  EO_PLATFORMS,
  EO_SENSOR_FAMILIES,
  EO_INDICATORS,
  EO_HYDRO_SERVICES,
  HYDRO_INTEGRATION_APPROACHES,
  HYDRO_REFERENCE,
  FUTURE_ROADMAP,
  LEVEL_DESCRIPTIONS,
  OPEN_SPATIAL_LAYERS,
  POLICY_THEMES,
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
    const level = (search.level as ImplementationLevel) ?? "moderate";
    const validLevel: ImplementationLevel =
      level === "beginner" || level === "moderate" || level === "advanced" ? level : "moderate";
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

  // Curate EO platforms shown — for beginner show core Copernicus, otherwise all
  const platforms = level === "beginner" ? EO_PLATFORMS.slice(0, 5) : EO_PLATFORMS;

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
          implementation level.
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

      {/* Summary */}
      <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
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
        </article>

        <aside className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <StatCard label="Datasets identified" value={datasets.length} />
          <StatCard label="Essential" value={essentialCount} accent="essential" />
          <StatCard label="Satellite / EO" value={satelliteCount} accent="eo" />
          <StatCard label="Reference platforms" value={platforms.length} />
        </aside>
      </section>

      {/* Datasets */}
      <section className="mt-12">
        <SectionHeading eyebrow="Data inventory" title="Minimum required datasets" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {datasets.map((d) => (
            <DatasetCard key={d.name} dataset={d} />
          ))}
        </div>
      </section>

      {/* Hydrological hazards focus — flood and/or drought */}
      {showHydro && (
        <section className="mt-16">
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
      <section className="mt-16 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
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
      <section className="mt-12">
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
      <section className="mt-16">
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
      <section className="mt-16">
        <SectionHeading eyebrow="Interpretation for the city" title="What this means in practice" />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80">
          The interpretation below translates the selected implementation level into operational
          terms: what the city can realistically achieve today, where the main limitations lie, and
          what would be required to progress to the next maturity stage.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <PathwayCard
            title="What the city can realistically achieve"
            tone="accent"
            items={levelInfo.capable}
          />
          <PathwayCard title="Key limitations" tone="muted" items={levelInfo.missing} />
          <PathwayCard
            title="Requirements to reach the next level"
            tone="primary"
            items={levelInfo.nextSteps}
          />
        </div>
      </section>

      {/* Future Integration Pathway */}
      <section className="mt-16 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <SectionHeading eyebrow="Roadmap" title="Future integration pathway" inline />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80">
          UrbanTwinReadiness is developed iteratively as a doctoral research prototype. Each version
          extends the scope from minimum dataset readiness toward a discoverable, visual and
          integrated decision-support environment.
        </p>
        <ol className="mt-6 space-y-4">
          {FUTURE_ROADMAP.map((step) => (
            <li
              key={step.version}
              className="grid gap-3 rounded-lg border border-border bg-card p-5 shadow-card sm:grid-cols-[120px_1fr] sm:gap-6"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  {step.version}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
                    step.status === "current"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {step.status === "current" ? "Current" : "Planned"}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Future Data Visualization */}
      <section className="mt-12 rounded-xl border border-dashed border-border bg-surface-elevated p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Future data visualization
        </p>
        <h2 className="mt-2 font-serif text-2xl text-foreground">
          An interactive visualizer is planned
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
          Future versions of UrbanTwinReadiness will include an interactive map for exploring the
          recommended datasets and Open Spatial Layers, inspecting their metadata (provider,
          resolution, access) and previewing how they combine within an Urban Digital Twin. The
          visualizer is not part of the current research prototype.
        </p>
        <div className="mt-5 flex h-32 items-center justify-center rounded-md border border-dashed border-border bg-card text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Interactive map · planned for V4.0
        </div>
      </section>

      {/* Footer note */}
      <p className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
        This profile is a research-based decision-support output. It is intended to inform early
        scoping and stakeholder discussion, not to replace a formal technical feasibility study.
      </p>
    </div>
  );
}
