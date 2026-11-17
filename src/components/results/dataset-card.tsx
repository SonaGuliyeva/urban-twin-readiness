import { useState } from "react";
import type { Dataset, Priority, SourceType } from "@/data/types";
import { PLAIN_DATASETS } from "@/data/plain-language";
import { linksFor } from "@/data/dataset-links";
import { DataLinks } from "./data-links";
import { STATUS_OPTIONS, type HaveStatus } from "./readiness";

const PRIORITY_LABEL: Record<Priority, string> = {
  essential: "Must have",
  recommended: "Good to have",
  optional: "Optional",
};

const SOURCE_LABEL: Record<SourceType, string> = {
  satellite: "Free satellite data",
  ground: "Local sensors",
  "open-data": "Open data portal",
  administrative: "City records",
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

const STATUS_CARD: Record<HaveStatus, string> = {
  have: "border-accent/60 bg-accent/5",
  partial: "border-recommended/50 bg-recommended/5",
  missing: "border-foreground/25",
};
const STATUS_ACTIVE: Record<HaveStatus, string> = {
  have: "bg-accent text-accent-foreground",
  partial: "bg-recommended text-white",
  missing: "bg-foreground/70 text-background",
};

export function DatasetCard({
  dataset,
  status,
  onStatus,
}: {
  dataset: Dataset;
  status?: HaveStatus;
  onStatus?: (s: HaveStatus | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const plain = PLAIN_DATASETS[dataset.name];
  const hasDetails = Boolean(dataset.provider || dataset.resolution || dataset.access);
  return (
    <article
      className={`flex h-full flex-col rounded-lg border p-5 shadow-card transition-shadow hover:shadow-elevated ${
        status ? STATUS_CARD[status] + " bg-card" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg leading-snug text-foreground">
            {plain ? plain.title : dataset.name}
          </h3>
          {plain && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{plain.what}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityClasses(
            dataset.priority,
          )}`}
        >
          {PRIORITY_LABEL[dataset.priority]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${sourceClasses(
            dataset.source,
          )}`}
        >
          {SOURCE_LABEL[dataset.source]}
        </span>
      </div>

      {onStatus && (
        <div className="mt-4 print:hidden">
          <p className="mb-1.5 text-xs font-medium text-foreground">Does your city have this?</p>
          <div
            role="group"
            aria-label={`Status of ${dataset.name}`}
            className="grid grid-cols-3 overflow-hidden rounded-md border border-border text-xs"
          >
            {STATUS_OPTIONS.map((o) => {
              const active = status === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  title={o.long}
                  aria-pressed={active}
                  onClick={() => onStatus(active ? undefined : o.id)}
                  className={`px-2 py-1.5 transition-colors ${
                    active
                      ? STATUS_ACTIVE[o.id]
                      : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${o.id !== "have" ? "border-l border-border" : ""}`}
                >
                  {o.short}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {status && (
        <p className="mt-3 hidden text-xs font-medium text-foreground print:block">
          {STATUS_OPTIONS.find((o) => o.id === status)?.long}
        </p>
      )}

      <DataLinks links={linksFor(dataset.name, dataset.source)} label="Where to find it" />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-3 self-start text-xs text-accent underline-offset-2 hover:underline print:hidden"
      >
        {open ? "Hide technical details" : "Technical details"}
      </button>

      <div className={open ? "" : "hidden print:block"}>
        {plain && (
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">{dataset.name}</p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dataset.description}</p>
        {hasDetails && (
          <dl className="mt-4 grid grid-cols-1 gap-2 border-t border-border pt-3 text-xs">
            {dataset.provider && (
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-medium text-muted-foreground">Provider</dt>
                <dd className="text-foreground/85">{dataset.provider}</dd>
              </div>
            )}
            {dataset.resolution && (
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-medium text-muted-foreground">Resolution</dt>
                <dd className="text-foreground/85">{dataset.resolution}</dd>
              </div>
            )}
            {dataset.access && (
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-medium text-muted-foreground">Access</dt>
                <dd className="text-foreground/85">{dataset.access}</dd>
              </div>
            )}
          </dl>
        )}

        {dataset.examples.length > 0 && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs font-semibold text-muted-foreground">Example sources</p>
            <p className="mt-1 text-sm text-foreground/80">{dataset.examples.join(" · ")}</p>
          </div>
        )}
      </div>
    </article>
  );
}
