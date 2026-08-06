import type { Dataset, Priority, SourceType } from "@/data/types";

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

export function DatasetCard({ dataset }: { dataset: Dataset }) {
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

      {(dataset.provider || dataset.resolution || dataset.access) && (
        <dl className="mt-4 grid grid-cols-1 gap-2 border-t border-border pt-3 text-xs">
          {dataset.provider && (
            <div className="flex gap-2">
              <dt className="w-20 shrink-0 font-mono uppercase tracking-[0.12em] text-muted-foreground">
                Provider
              </dt>
              <dd className="text-foreground/85">{dataset.provider}</dd>
            </div>
          )}
          {dataset.resolution && (
            <div className="flex gap-2">
              <dt className="w-20 shrink-0 font-mono uppercase tracking-[0.12em] text-muted-foreground">
                Resolution
              </dt>
              <dd className="text-foreground/85">{dataset.resolution}</dd>
            </div>
          )}
          {dataset.access && (
            <div className="flex gap-2">
              <dt className="w-20 shrink-0 font-mono uppercase tracking-[0.12em] text-muted-foreground">
                Access
              </dt>
              <dd className="text-foreground/85">{dataset.access}</dd>
            </div>
          )}
        </dl>
      )}

      {dataset.examples.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Example sources
          </p>
          <p className="mt-1 text-sm text-foreground/80">{dataset.examples.join(" · ")}</p>
        </div>
      )}
    </article>
  );
}
