import type { PolicyObjective, EoFit, Agenda } from "@/data/types";

export interface WaterCategory {
  id: "flood" | "drought";
  title: string;
  subtitle: string;
  description: string;
  objectiveIds: string[];
}

/**
 * Objectives available in the current version, grouped by the two water-related categories.
 * All other objectives are planned extensions.
 */
export const WATER_CATEGORIES: WaterCategory[] = [
  {
    id: "flood",
    title: "Floods",
    subtitle: "Water abundance",
    description:
      "Heavy rainfall, river flooding and surface runoff, including the role of sealed surfaces and drainage.",
    objectiveIds: ["flood-risk", "stormwater"],
  },
  {
    id: "drought",
    title: "Droughts",
    subtitle: "Water scarcity",
    description:
      "Water shortage and its effects on water resources, vegetation and surface heat, which is treated as a drought-related stress.",
    objectiveIds: ["drought", "water-resources", "uhi", "green-infra"],
  },
];

export const CORE_OBJECTIVE_IDS: readonly string[] = WATER_CATEGORIES.flatMap(
  (c) => c.objectiveIds,
);

export const POLICY_THEMES: { theme: string; objectives: PolicyObjective[] }[] = [
  {
    theme: "Urban risks",
    objectives: [
      {
        id: "flood-risk",
        label: "Reduce flood risk",
        theme: "Urban risks",
        source: "Table 7",
        agenda: "Blue",
        eoFit: "strong",
      },
      {
        id: "stormwater",
        label: "Manage stormwater and drainage",
        theme: "Urban risks",
        source: "Table 7",
        agenda: "Blue",
        eoFit: "strong",
      },
      {
        id: "drought",
        label: "Prepare for drought and water scarcity",
        theme: "Urban risks",
        source: "Table 7",
        agenda: "Blue",
        eoFit: "strong",
      },
      {
        id: "uhi",
        label: "Reduce urban heat",
        theme: "Urban risks",
        source: "Table 7",
        agenda: "Green",
        eoFit: "strong",
        alsoUses: ["thermal-comfort"],
      },
      {
        id: "green-infra",
        label: "Expand green and blue infrastructure",
        theme: "Urban risks",
        source: "Table 7",
        agenda: "Green",
        eoFit: "strong",
      },
      {
        id: "climate-resilience",
        label: "Plan climate adaptation",
        theme: "Urban risks",
        source: "Table 7",
        agenda: "Green",
        eoFit: "partial",
      },
      {
        id: "early-warning",
        label: "Early warning and emergency response",
        theme: "Urban risks",
        source: "Table 7",
        agenda: "Brown",
        eoFit: "partial",
        alsoUses: ["disaster-response", "emergency-coordination"],
      },
      {
        id: "social-vulnerability",
        label: "Reduce social vulnerability",
        theme: "Urban risks",
        source: "Table 7",
        agenda: "Brown",
        eoFit: "partial",
      },
      {
        id: "informal-settlements",
        label: "Upgrade informal settlements",
        theme: "Urban risks",
        source: "Table 7",
        agenda: "Brown",
        eoFit: "partial",
      },
    ],
  },
  {
    theme: "Water",
    objectives: [
      {
        id: "water-resources",
        label: "Monitor water resources and groundwater",
        theme: "Water",
        source: "Table 2",
        agenda: "Blue",
        eoFit: "strong",
      },
      {
        id: "water-quality",
        label: "Protect surface, coastal and lake water quality",
        theme: "Water",
        source: "Table 2",
        agenda: "Blue",
        eoFit: "partial",
      },
      {
        id: "wastewater-sanitation",
        label: "Treat wastewater and sewage",
        theme: "Water",
        source: "Table 2",
        agenda: "Brown",
        eoFit: "limited",
      },
    ],
  },
  {
    theme: "Land",
    objectives: [
      {
        id: "land-use",
        label: "Limit land degradation and urban sprawl",
        theme: "Land",
        source: "Table 3",
        agenda: "Green",
        eoFit: "strong",
        alsoUses: ["spatial-planning", "regeneration"],
      },
      {
        id: "biodiversity",
        label: "Protect ecosystems and biodiversity",
        theme: "Land",
        source: "Table 3",
        agenda: "Green",
        eoFit: "strong",
        alsoUses: ["nbs"],
      },
      {
        id: "heritage",
        label: "Protect cultural and historical property",
        theme: "Land",
        source: "Table 3",
        agenda: "Brown",
        eoFit: "limited",
      },
    ],
  },
  {
    theme: "Air",
    objectives: [
      {
        id: "air-quality",
        label: "Improve outdoor air quality",
        theme: "Air",
        source: "Table 1",
        agenda: "Brown",
        eoFit: "partial",
        alsoUses: ["urban-emissions", "pollution"],
      },
      {
        id: "indoor-air",
        label: "Reduce indoor air pollution",
        theme: "Air",
        source: "Table 1",
        agenda: "Brown",
        eoFit: "limited",
      },
    ],
  },
  {
    theme: "Energy",
    objectives: [
      {
        id: "energy-access",
        label: "Improve energy supply and access",
        theme: "Energy",
        source: "Table 6",
        agenda: "Gray",
        eoFit: "limited",
      },
      {
        id: "energy-efficiency",
        label: "Improve building energy efficiency",
        theme: "Energy",
        source: "Table 6",
        agenda: "Gray",
        eoFit: "partial",
      },
      {
        id: "renewable-energy",
        label: "Reduce fossil-fuel dependence",
        theme: "Energy",
        source: "Table 6",
        agenda: "Gray",
        eoFit: "partial",
        alsoUses: ["carbon-footprint"],
      },
      {
        id: "critical-infrastructure",
        label: "Make energy systems resilient",
        theme: "Energy",
        source: "Table 6",
        agenda: "Gray",
        eoFit: "partial",
      },
      {
        id: "energy-poverty",
        label: "Reduce energy poverty",
        theme: "Energy",
        source: "Table 6",
        agenda: "Gray",
        eoFit: "limited",
      },
    ],
  },
  {
    theme: "Mobility",
    objectives: [
      {
        id: "traffic-flows",
        label: "Make mobility more sustainable",
        theme: "Mobility",
        source: "Box 3 (thematic areas)",
        agenda: "Gray",
        eoFit: "partial",
        alsoUses: ["sustainable-mobility", "transport-emissions"],
      },
    ],
  },
  {
    theme: "Waste",
    objectives: [
      {
        id: "solid-waste",
        label: "Manage solid waste",
        theme: "Waste",
        source: "Table 4",
        agenda: "Brown",
        eoFit: "partial",
      },
      {
        id: "hazardous-waste",
        label: "Manage hazardous and industrial waste",
        theme: "Waste",
        source: "Table 4",
        agenda: "Brown",
        eoFit: "partial",
      },
    ],
  },
  {
    theme: "Food security",
    objectives: [
      {
        id: "food-supply",
        label: "Secure food supply",
        theme: "Food security",
        source: "Table 5",
        agenda: "Green",
        eoFit: "partial",
      },
      {
        id: "food-access",
        label: "Improve access to food",
        theme: "Food security",
        source: "Table 5",
        agenda: "Brown",
        eoFit: "limited",
      },
      {
        id: "food-waste",
        label: "Reduce food loss and waste",
        theme: "Food security",
        source: "Table 5",
        agenda: "Brown",
        eoFit: "limited",
      },
    ],
  },
];

/** Challenges that follow Srinivas; mobility is added from his list of thematic areas (Box 3). */
export const SOURCE_NOTE =
  "Srinivas, H. Urban Environmental Management: Concepts, Frameworks, and Practice. GDRC Concept Note E-259.";

export const EO_FIT_LABEL: Record<EoFit, string> = {
  strong: "Strong fit with satellite data",
  partial: "Partial fit",
  limited: "Limited fit",
};

export const AGENDA_LABEL: Record<Agenda, string> = {
  Blue: "Blue agenda (water)",
  Green: "Green agenda (nature)",
  Brown: "Brown agenda (pollution, health)",
  Gray: "Gray agenda (infrastructure, energy)",
};

/** Objective ids whose dataset lists are merged into a selected objective. */
export const OBJECTIVE_ALIASES: Record<string, string[]> = Object.fromEntries(
  POLICY_THEMES.flatMap((g) => g.objectives)
    .filter((o) => o.alsoUses?.length)
    .map((o) => [o.id, o.alsoUses as string[]]),
);
