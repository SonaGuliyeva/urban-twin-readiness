import type { PolicyObjective, EoFit } from "@/data/types";

/**
 * Environmental objectives for UrbanTwinReadiness.
 *
 * The objectives are grouped under the environmental themes of the European Green Capital
 * Award (EGCA), mapped to the targets of SDG 11, and validated against the climate strategies
 * of eight European cities (Turin, Barcelona, Bologna, Milan, Copenhagen, Paris, Vienna,
 * Rotterdam). The wording is the author's own, kept short while remaining traceable to each
 * source. Srinivas (GDRC Concept Note E-259) provides the conceptual background.
 *
 * `eoFit` records how well open satellite data can support the objective:
 *   strong    = observable directly from open Earth observation
 *   screening = EO provides a useful proxy indicator, not the full picture
 *   partial   = EO covers only part; local data are needed for the rest
 *
 * `source` names the EGCA theme; `sdg` the SDG 11 target.
 */
export const POLICY_THEMES: { theme: string; blurb?: string; objectives: PolicyObjective[] }[] = [
  {
    theme: "Climate & hazards",
    blurb: "Floods and droughts — the focus of the current version.",
    objectives: [
      {
        id: "uhi",
        label: "Reduce urban heat",
        theme: "Climate & hazards",
        source: "EGCA: Climate change adaptation",
        sdg: "SDG 11.b",
        eoFit: "screening",
        alsoUses: ["thermal-comfort"],
      },
      {
        id: "stormwater",
        label: "Manage stormwater and rainfall flooding",
        theme: "Climate & hazards",
        source: "EGCA: Water / Adaptation",
        sdg: "SDG 11.5",
        eoFit: "screening",
      },
      {
        id: "flood-risk",
        label: "Reduce river and coastal flood risk",
        theme: "Climate & hazards",
        source: "EGCA: Climate change adaptation",
        sdg: "SDG 11.5",
        eoFit: "screening",
      },
      {
        id: "drought",
        label: "Prepare for drought and water scarcity",
        theme: "Climate & hazards",
        source: "EGCA: Water / Adaptation",
        sdg: "SDG 11.5",
        eoFit: "screening",
      },
    ],
  },
  {
    theme: "Water",
    objectives: [
      {
        id: "water-resources",
        label: "Monitor water resources",
        theme: "Water",
        source: "EGCA: Water",
        sdg: "SDG 11.6",
        eoFit: "partial",
      },
      {
        id: "water-quality",
        label: "Protect surface water quality",
        theme: "Water",
        source: "EGCA: Water",
        sdg: "SDG 11.6",
        eoFit: "partial",
      },
    ],
  },
  {
    theme: "Land",
    objectives: [
      {
        id: "land-use",
        label: "Limit land degradation and soil sealing",
        theme: "Land",
        source: "EGCA: Biodiversity, green areas & land use",
        sdg: "SDG 11.3",
        eoFit: "strong",
        alsoUses: ["spatial-planning", "regeneration"],
      },
    ],
  },
  {
    theme: "Green & biodiversity",
    objectives: [
      {
        id: "green-infra",
        label: "Expand green and blue infrastructure",
        theme: "Green & biodiversity",
        source: "EGCA: Biodiversity, green areas & land use",
        sdg: "SDG 11.7",
        eoFit: "strong",
      },
      {
        id: "biodiversity",
        label: "Protect biodiversity and nature",
        theme: "Green & biodiversity",
        source: "EGCA: Biodiversity, green areas & land use",
        sdg: "SDG 11.4",
        eoFit: "screening",
        alsoUses: ["nbs"],
      },
    ],
  },
  {
    theme: "Air",
    objectives: [
      {
        id: "air-quality",
        label: "Improve air quality",
        theme: "Air",
        source: "EGCA: Air quality",
        sdg: "SDG 11.6",
        eoFit: "screening",
        alsoUses: ["urban-emissions", "pollution"],
      },
    ],
  },
];

/** The objectives available (selectable) in the current version. */
export const CORE_OBJECTIVE_IDS: readonly string[] = [
  "uhi",
  "stormwater",
  "flood-risk",
  "drought",
  "water-resources",
  "green-infra",
];

export const SOURCE_NOTE =
  "Objectives are grouped under the European Green Capital Award themes, mapped to SDG 11, and validated against the climate strategies of eight European cities.";

export const EO_FIT_LABEL: Record<EoFit, string> = {
  strong: "Observable directly from open satellite data",
  screening: "Open satellite data give a screening indicator",
  partial: "Open satellite data cover part; local data needed for the rest",
};

/** Objective ids whose dataset lists are merged into a selected objective. */
export const OBJECTIVE_ALIASES: Record<string, string[]> = Object.fromEntries(
  POLICY_THEMES.flatMap((g) => g.objectives)
    .filter((o) => o.alsoUses?.length)
    .map((o) => [o.id, o.alsoUses as string[]]),
);
