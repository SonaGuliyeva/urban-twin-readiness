import type { Dataset } from "@/data/types";

export type HaveStatus = "have" | "partial" | "missing";

export const STATUS_OPTIONS: { id: HaveStatus; short: string; long: string }[] = [
  { id: "have", short: "Yes", long: "Yes, it is already in our digital twin" },
  {
    id: "partial",
    short: "Have it, not in twin",
    long: "We have it, but it is not in the digital twin",
  },
  { id: "missing", short: "No", long: "No, we do not have it" },
];

export type StatusMap = Record<string, HaveStatus>;

export function summarise(datasets: Dataset[], status: StatusMap) {
  const get = (d: Dataset): HaveStatus | undefined => status[d.name];
  const answered = datasets.filter((d) => get(d)).length;
  const essential = datasets.filter((d) => d.priority === "essential");
  const count = (list: Dataset[], s: HaveStatus) => list.filter((d) => get(d) === s).length;
  return {
    total: datasets.length,
    answered,
    have: count(datasets, "have"),
    partial: count(datasets, "partial"),
    missing: count(datasets, "missing"),
    unanswered: datasets.length - answered,
    essentialTotal: essential.length,
    essentialHave: count(essential, "have"),
    // gaps = everything essential/recommended that is not yet in the twin
    gaps: datasets.filter((d) => d.priority !== "optional" && get(d) !== "have"),
  };
}

// ---- Starting point -------------------------------------------------------
export type StartKey =
  | "none"
  | "status"
  | "informative"
  | "predictive"
  | "optimisation"
  | "autonomous";

export const START_OPTIONS: { id: StartKey; title: string; desc: string }[] = [
  {
    id: "none",
    title: "Nothing yet",
    desc: "No digital twin and no environmental data in a shared system.",
  },
  {
    id: "status",
    title: "A static 3D or 2D model",
    desc: "A visual model of the city with limited analysis. Mostly fixed data.",
  },
  {
    id: "informative",
    title: "Dashboards and analysis",
    desc: "Several datasets combined, with dashboards and basic scenario checks.",
  },
  {
    id: "predictive",
    title: "Forecasts and simulation",
    desc: "The twin forecasts or simulates how the city may change.",
  },
  {
    id: "optimisation",
    title: "Scenario planning for decisions",
    desc: "Advanced scenarios that support policy or operational choices.",
  },
  {
    id: "autonomous",
    title: "Real-time and automated",
    desc: "Live data feeds and automated decision support.",
  },
];

/**
 * Suggested starting answers for the data checklist. This is a simplifying assumption, not a
 * measured rule: static reference layers (city records, open data) are assumed from level 1,
 * local sensors from level 2. Satellite data is never pre-ticked, because showing what free
 * satellite data can add is the purpose of the tool. The city can change every answer.
 */
export function prefillFor(start: StartKey, datasets: Dataset[]): StatusMap {
  const out: StatusMap = {};
  if (start === "none") return out;
  for (const d of datasets) {
    const staticLayer = d.source === "administrative" || d.source === "open-data";
    const sensors = d.source === "ground";
    if (staticLayer || (sensors && start !== "status")) out[d.name] = "have";
  }
  return out;
}

// ---- Compact URL encoding of the answers (order = dataset pool order) ----
const CODE: Record<HaveStatus, string> = { have: "y", partial: "p", missing: "n" };
const DECODE: Record<string, HaveStatus> = { y: "have", p: "partial", n: "missing" };

export function encodeStatus(names: string[], status: StatusMap): string {
  return names.map((n) => (status[n] ? CODE[status[n]] : "-")).join("");
}

export function decodeStatus(names: string[], code: string): StatusMap {
  const out: StatusMap = {};
  names.forEach((n, i) => {
    const v = DECODE[code[i] ?? ""];
    if (v) out[n] = v;
  });
  return out;
}
