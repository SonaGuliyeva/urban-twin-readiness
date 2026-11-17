import type { Dataset } from "@/data/types";

export type HaveStatus = "have" | "partial" | "missing";

export const STATUS_OPTIONS: { id: HaveStatus; short: string; long: string }[] = [
  { id: "have", short: "In twin", long: "Already in our digital twin" },
  { id: "partial", short: "Not integrated", long: "We have it, but not in the twin" },
  { id: "missing", short: "Missing", long: "We do not have it" },
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
