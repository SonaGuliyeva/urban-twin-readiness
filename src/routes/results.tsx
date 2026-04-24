import { createFileRoute, Link } from "@tanstack/react-router";
import {
  EO_PLATFORMS,
  LEVEL_DESCRIPTIONS,
  POLICY_THEMES,
  getDatasetsForObjectives,
  type Dataset,
  type ImplementationLevel,
  type Priority,
  type SourceType,
} from "@/lib/udt-data";

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

const PRIORITY_LABEL: Record<Priority, string> = {
  essential: "Essential",
  recommended: "Recommended",
  optional: "Optional",
};

const SOURCE_LABEL: Record<SourceType, string> = {
  satellite: "Satellite / EO",
  ground: "Ground sensor",
  "open-data": "Open data",
  administrative: "Administrative",
};

function priorityClasses(p: Priority): string {
  if (p === "essential") return "border-essential/30 bg-essential/10 text-essential";
  if (p === "recommended") return "border-recommended/30 bg-recommended/10 text-recommended";
  return "border-optional/30 bg-optional/10 text-optional";
}

function sourceClasses(s: SourceType): string {
  if (s === "satellite") return "border-eo/30 bg-eo/10 text-eo";
  return "border-border bg-muted text-muted-foreground";
}

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
          <span className="font-medium text-foreground">{levelInfo.title.split(" — ")[0].toLowerCase()}</span>{" "}
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
            <span className="font-medium text-foreground">{datasets.length} datasets</span>, of which{" "}
            <span className="font-medium text-foreground">{essentialCount} are essential</span> and{" "}
            <span className="font-medium text-foreground">{satelliteCount} can be sourced from Earth Observation</span>.
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

      {/* EO Role */}
      <section className="mt-16 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <SectionHeading
          eyebrow="Earth Observation"
          title="Role of satellite and EO data"
          inline
        />
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

      {/* Implementation pathway */}
      <section className="mt-16">
        <SectionHeading eyebrow="Implementation pathway" title="Capabilities, gaps, and next steps" />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <PathwayCard title="What this level enables" tone="accent" items={levelInfo.capable} />
          <PathwayCard title="Current limitations" tone="muted" items={levelInfo.missing} />
          <PathwayCard title="Path to the next level" tone="primary" items={levelInfo.nextSteps} />
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

function SectionHeading({ eyebrow, title, inline = false }: { eyebrow: string; title: string; inline?: boolean }) {
  return (
    <div className={inline ? "" : "flex items-end justify-between gap-6"}>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">{title}</h2>
      </div>
      {!inline && <div className="hidden h-px flex-1 bg-border sm:block" />}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "essential" | "eo" }) {
  const accentClass =
    accent === "essential" ? "text-essential" : accent === "eo" ? "text-eo" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className={`font-serif text-3xl ${accentClass}`}>{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function DatasetCard({ dataset }: { dataset: Dataset }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-lg leading-snug text-foreground">{dataset.name}</h3>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${priorityClasses(
            dataset.priority,
          )}`}
        >
          {PRIORITY_LABEL[dataset.priority]}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dataset.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${sourceClasses(
            dataset.source,
          )}`}
        >
          {SOURCE_LABEL[dataset.source]}
        </span>
      </div>

      {dataset.examples.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Example sources
          </p>
          <p className="mt-1 text-sm text-foreground/80">{dataset.examples.join(" · ")}</p>
        </div>
      )}
    </article>
  );
}

function PathwayCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "accent" | "muted" | "primary";
}) {
  const toneClasses =
    tone === "accent"
      ? "border-accent/30 bg-accent/5"
      : tone === "primary"
      ? "border-primary/30 bg-primary/5"
      : "border-border bg-surface";
  const dotClass =
    tone === "accent" ? "bg-accent" : tone === "primary" ? "bg-primary" : "bg-muted-foreground";
  return (
    <div className={`rounded-lg border p-6 shadow-card ${toneClasses}`}>
      <h3 className="font-serif text-lg text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
