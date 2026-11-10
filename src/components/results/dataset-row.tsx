import type { Dataset, SourceType } from "@/data/types";

const SOURCE_LABEL: Record<SourceType, string> = {
  satellite: "Satellite",
  ground: "Sensor",
  "open-data": "Open data",
  administrative: "City records",
};

/** Compact, expandable dataset line: name + source up front, details on click. */
export function DatasetRow({ dataset }: { dataset: Dataset }) {
  const details: [string, string | undefined][] = [
    ["Provider", dataset.provider],
    ["Resolution", dataset.resolution],
    ["Access", dataset.access],
    ["Examples", dataset.examples.length ? dataset.examples.join(" · ") : undefined],
  ];
  return (
    <details className="group border-b border-border last:border-0 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-3">
        <span
          className={[
            "shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
            dataset.source === "satellite"
              ? "border-eo/30 bg-eo/10 text-eo"
              : "border-border bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {SOURCE_LABEL[dataset.source]}
        </span>
        <span className="min-w-0 flex-1 text-sm text-foreground">{dataset.name}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="pb-4 pl-1 text-sm">
        <p className="text-muted-foreground">{dataset.description}</p>
        <dl className="mt-2 grid gap-1 text-xs">
          {details
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="w-20 shrink-0 text-muted-foreground">{k}</dt>
                <dd className="text-foreground/85">{v}</dd>
              </div>
            ))}
        </dl>
      </div>
    </details>
  );
}
