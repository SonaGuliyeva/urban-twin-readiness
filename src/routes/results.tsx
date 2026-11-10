import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
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
import { Fold } from "@/components/common/fold";
import { StatCard } from "@/components/common/stat-card";
import { DatasetRow } from "@/components/results/dataset-row";

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
      { title: "Your data list — UrbanTwinReadiness" },
      {
        name: "description",
        content: "The minimum datasets your city needs first, and the next steps.",
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

  // Folded sections must be open when the page is printed / saved as PDF.
  useEffect(() => {
    const openAll = () =>
      document.querySelectorAll("main details").forEach((d) => d.setAttribute("open", ""));
    window.addEventListener("beforeprint", openAll);
    return () => window.removeEventListener("beforeprint", openAll);
  }, []);

  if (selected.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">No goals selected</h1>
        <Link
          to="/configure"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Pick goals
        </Link>
      </div>
    );
  }

  // Real-world case studies relevant to at least one selected objective
  const relevantCaseStudies = CASE_STUDIES.filter((cs) =>
    cs.relatedObjectives.some((id) => ids.includes(id)),
  );

  // Turin worked example: shown only when the user names Turin/Torino as their city
  const isTurin = city ? /^(turin|torino)$/i.test(city.trim()) : false;
  const turinRelevant = ["uhi", "drought", "climate-resilience", "green-infra"].some((id) =>
    ids.includes(id),
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

  const essentials = datasets.filter((d) => d.priority === "essential");
  const extras = datasets.filter((d) => d.priority !== "essential");
  const essentialSatCount = essentials.filter((d) => d.source === "satellite").length;
  const levelNumber = LEVEL_ORDER.indexOf(level) + 1;
  const levelName = levelInfo.title.replace(/^Level \d+ . /, "");
  const nextSteps = (nextLevelInfo?.nextSteps ?? levelInfo.nextSteps).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      {/* Header */}
      <header>
        <h1 className="text-4xl text-foreground sm:text-5xl">
          {city ? `${city}: your data list` : "Your data list"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Level {levelNumber} · {levelName}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {selected.map((o) => (
            <span
              key={o.id}
              className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-foreground"
            >
              {o.label}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
          <Link
            to="/configure"
            className="rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
          >
            ← Change
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
          >
            Print / PDF
          </button>
        </div>
      </header>

      {/* Start here — essential datasets only */}
      <section className="mt-10 rounded-xl border border-primary/30 bg-card p-6 shadow-card">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Start here</p>
        <h2 className="mt-1 font-serif text-2xl text-foreground">
          {essentials.length} essential dataset{essentials.length === 1 ? "" : "s"}
        </h2>
        {essentialSatCount > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            {essentialSatCount} from satellites, most of them free.
          </p>
        )}
        <div className="mt-4">
          {essentials.map((d) => (
            <DatasetRow key={d.name} dataset={d} />
          ))}
        </div>
      </section>

      {/* Next step */}
      <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Then</p>
        <h2 className="mt-1 font-serif text-2xl text-foreground">
          {nextLevelInfo ? `Move to level ${levelNumber + 1}` : "Keep data up to date"}
        </h2>
        <ol className="mt-4 space-y-2">
          {nextSteps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-foreground/85">
              <span className="text-accent">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Everything else, folded */}
      <h2 className="mt-14 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        More details
      </h2>
      <div className="mt-3 space-y-2">
        {showTurinCase && (
          <Fold
            id="turin-case"
            title="Turin example"
            hint={`Real results for ${TURIN_SUMMARY.segmentCount} road segments`}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Segments" value={TURIN_SUMMARY.segmentCount} />
              <StatCard
                label="Stressed"
                value={`${Math.round(
                  (TURIN_SUMMARY.envStressedCount / TURIN_SUMMARY.segmentCount) * 100,
                )}%`}
                accent="essential"
              />
              <StatCard
                label={`Hot (>${TURIN_SUMMARY.thermalThresholdC}°C)`}
                value={TURIN_SUMMARY.thermalStressedCount}
                accent="eo"
              />
              <StatCard label="Mean surface temp." value={`${TURIN_SUMMARY.lstMean}°C`} />
            </div>
            <p className="mt-5 text-xs text-muted-foreground">Hottest streets</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="py-2 pr-3 font-normal">Street</th>
                    <th className="py-2 pr-3 font-normal">Surface temp.</th>
                    <th className="py-2 pr-3 font-normal">Sealed</th>
                    <th className="py-2 font-normal">Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {turinHottest.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="py-2 pr-3 text-foreground/85">{s.street}</td>
                      <td className="py-2 pr-3 text-foreground/85">{s.lst}&deg;C</td>
                      <td className="py-2 pr-3 text-foreground/85">{s.imperviousPct}%</td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {[s.thermalStressed && "heat", s.droughtStressed && "drought"]
                          .filter(Boolean)
                          .join(", ") || (s.envStressed ? "other" : "—")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              SDGSAT-1 surface temperature ({TURIN_SUMMARY.acquisitionDate}), airborne and
              Sentinel-2 vegetation indices. Guliyeva et al. (2026), IAC 2026.
            </p>
          </Fold>
        )}

        {extras.length > 0 && (
          <Fold title="Other useful datasets" hint={`${extras.length} recommended or optional`}>
            {extras.map((d) => (
              <DatasetRow key={d.name} dataset={d} />
            ))}
          </Fold>
        )}

        {showHydro && (
          <Fold
            id="hydro"
            title={
              hydroHazards.length === 2
                ? "Flood and drought: satellite methods"
                : hydroHazards[0] === "flood"
                  ? "Flood: satellite methods"
                  : "Drought: satellite methods"
            }
            hint="Services, indicators and sensors"
          >
            <h3 className="text-sm font-medium text-foreground">Ready-to-use services</h3>
            <ul className="mt-2 space-y-2">
              {hydroServices.map((s) => (
                <li key={s.name} className="text-sm">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {s.name}
                  </a>{" "}
                  <span className="text-muted-foreground">
                    · {s.scope} · {s.description}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-medium text-foreground">Indicators</h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="py-2 pr-3 font-normal">Indicator</th>
                    {hydroHazards.includes("flood") && (
                      <th className="py-2 pr-3 font-normal">Flood</th>
                    )}
                    {hydroHazards.includes("drought") && (
                      <th className="py-2 pr-3 font-normal">Drought</th>
                    )}
                    <th className="py-2 font-normal">Sources</th>
                  </tr>
                </thead>
                <tbody>
                  {hydroIndicators.map((i) => (
                    <tr
                      key={i.indicator}
                      className="border-b border-border align-top last:border-0"
                    >
                      <td className="py-2 pr-3 font-medium text-foreground">{i.indicator}</td>
                      {hydroHazards.includes("flood") && (
                        <td className="py-2 pr-3 text-foreground/85">{i.flood ?? "—"}</td>
                      )}
                      {hydroHazards.includes("drought") && (
                        <td className="py-2 pr-3 text-foreground/85">{i.drought ?? "—"}</td>
                      )}
                      <td className="py-2 text-muted-foreground">{i.sources.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-6 text-sm font-medium text-foreground">Sensor types</h3>
            <ul className="mt-2 space-y-2">
              {hydroSensors.map((f) => (
                <li key={f.family} className="text-sm">
                  <span className="font-medium text-foreground">{f.family}</span>{" "}
                  <span className="text-muted-foreground">
                    · {f.missions.join(", ")} · Limits: {f.limitations}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-medium text-foreground">Combining sources</h3>
            <ul className="mt-2 space-y-2">
              {HYDRO_INTEGRATION_APPROACHES.map((a) => (
                <li key={a.approach} className="text-sm">
                  <span className="font-medium text-foreground">{a.approach}</span>{" "}
                  <span className="text-muted-foreground">· {a.data}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-muted-foreground">
              From{" "}
              <a
                href={HYDRO_REFERENCE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-foreground"
              >
                {HYDRO_REFERENCE.citation}
              </a>
              .
            </p>
          </Fold>
        )}

        {relevantCaseStudies.length > 0 && (
          <Fold
            title="Cities already doing this"
            hint={`${relevantCaseStudies.length} example${relevantCaseStudies.length === 1 ? "" : "s"}`}
          >
            <ul className="space-y-4">
              {relevantCaseStudies.map((cs) => (
                <li key={cs.name} className="text-sm">
                  <p className="font-medium text-foreground">
                    {cs.city} · {cs.name}
                  </p>
                  <p className="mt-1 text-muted-foreground">{cs.summary}</p>
                </li>
              ))}
            </ul>
          </Fold>
        )}

        <Fold title="Free satellite data" hint={`${platforms.length} sources`}>
          <ul className="space-y-2">
            {platforms.map((p) => (
              <li key={p.name} className="text-sm">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {p.name}
                </a>{" "}
                <span className="text-muted-foreground">· {p.description}</span>
              </li>
            ))}
          </ul>
        </Fold>

        <Fold title="Free base map layers" hint="Streets, buildings, terrain, boundaries">
          <ul className="space-y-2">
            {OPEN_SPATIAL_LAYERS.map((l) => (
              <li key={l.name} className="text-sm">
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {l.name}
                </a>{" "}
                <span className="text-muted-foreground">· {l.description}</span>
              </li>
            ))}
          </ul>
        </Fold>

        <Fold title={`What level ${levelNumber} can and cannot do`}>
          <div className="grid gap-6 sm:grid-cols-2">
            <SimpleList title="Can" items={levelInfo.capable} />
            <SimpleList title="Cannot yet" items={levelInfo.missing} />
          </div>
        </Fold>
      </div>

      <p className="mt-14 text-xs text-muted-foreground">
        Research prototype. Use for early planning, not as a feasibility study.
      </p>
    </div>
  );
}

function SimpleList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-foreground/85">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
