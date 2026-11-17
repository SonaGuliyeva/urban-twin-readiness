import type { PolicyObjective } from "@/data/types";

export interface WaterCategory {
  id: "flood" | "drought";
  title: string;
  subtitle: string;
  description: string;
  objectiveIds: string[];
}

/**
 * Objectives available in the current version, grouped by the two water-related challenges
 * described in Chapter 1. All other objectives are planned extensions.
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

export interface HazardType {
  id: string;
  category: "flood" | "drought";
  label: string;
  note: string;
  /** What the data profile should emphasise for this type (see thesis Chapter 1, Fig. 1-1; Chapter 2, Tables 2-1 and 2-3). */
  focus: string;
}

/** Hazard types as shown in Figure 1-1 of the thesis. */
export const HAZARD_TYPES: HazardType[] = [
  {
    id: "river-flood",
    category: "flood",
    label: "River flood",
    note: "Rivers overflow their banks",
    focus:
      "Inundation mapping from SAR and optical water indices, official flood hazard maps, and elevation data to relate flood extent to individual city objects.",
  },
  {
    id: "pluvial-flood",
    category: "flood",
    label: "Pluvial (urban) flood",
    note: "Heavy rain exceeds drainage and infiltration",
    focus:
      "Sealed surfaces, high-resolution elevation and the drainage network, since sealing reduces infiltration and increases runoff during heavy rainfall.",
  },
  {
    id: "flash-flood",
    category: "flood",
    label: "Flash flood",
    note: "Rapid onset, short warning time",
    focus:
      "Frequent or on-demand revisit, all-weather SAR and rainfall data, because the time between rainfall and impact is short.",
  },
  {
    id: "agricultural-drought",
    category: "drought",
    label: "Agricultural drought",
    note: "Soil moisture deficit affects vegetation",
    focus:
      "Vegetation stress indices (NDVI anomaly, VCI, VHI), land surface temperature anomalies and soil moisture anomalies.",
  },
  {
    id: "ecological-drought",
    category: "drought",
    label: "Ecological drought",
    note: "Water shortage stresses ecosystems",
    focus:
      "Vegetation condition and early physiological stress of urban greenery and tree canopy (NDVI anomaly, solar-induced fluorescence).",
  },
  {
    id: "hydrological-drought",
    category: "drought",
    label: "Hydrological drought",
    note: "Low river flow, reservoirs and groundwater",
    focus:
      "Surface water extent, water level and total water storage anomalies, together with precipitation anomalies (SPI, SPEI).",
  },
  {
    id: "flash-drought",
    category: "drought",
    label: "Flash drought",
    note: "Develops within weeks, often heat-driven",
    focus:
      "Frequent temperature, land surface temperature and soil moisture observations, because heat accelerates evaporation and dries the soil within weeks.",
  },
];

export const CORE_OBJECTIVE_IDS: readonly string[] = WATER_CATEGORIES.flatMap(
  (c) => c.objectiveIds,
);

export const POLICY_THEMES: { theme: string; objectives: PolicyObjective[] }[] = [
  {
    theme: "Urban Planning & Development",
    objectives: [
      {
        id: "land-use",
        label: "Land Use & Change Monitoring",
        theme: "Urban Planning & Development",
      },
      {
        id: "regeneration",
        label: "Urban Regeneration & Densification",
        theme: "Urban Planning & Development",
      },
      {
        id: "spatial-planning",
        label: "Sustainable Spatial Planning",
        theme: "Urban Planning & Development",
      },
    ],
  },
  {
    theme: "Mobility & Transport",
    objectives: [
      { id: "traffic-flows", label: "Optimize Traffic Flows", theme: "Mobility & Transport" },
      {
        id: "sustainable-mobility",
        label: "Support Sustainable Mobility",
        theme: "Mobility & Transport",
      },
      {
        id: "transport-emissions",
        label: "Reduce Transport Emissions",
        theme: "Mobility & Transport",
      },
    ],
  },
  {
    theme: "Water & Sanitation",
    objectives: [
      {
        id: "stormwater",
        label: "Stormwater and Drainage Management",
        theme: "Water & Sanitation",
      },
      { id: "water-resources", label: "Water Resource Monitoring", theme: "Water & Sanitation" },
      {
        id: "wastewater-sanitation",
        label: "Wastewater & Sanitation Management",
        theme: "Water & Sanitation",
      },
    ],
  },
  {
    theme: "Green Spaces & Environment",
    objectives: [
      {
        id: "green-infra",
        label: "Green Infrastructure Planning",
        theme: "Green Spaces & Environment",
      },
      {
        id: "biodiversity",
        label: "Urban Biodiversity Support",
        theme: "Green Spaces & Environment",
      },
      {
        id: "nbs",
        label: "Nature-Based Solutions Implementation",
        theme: "Green Spaces & Environment",
      },
    ],
  },
  {
    theme: "Air Quality",
    objectives: [
      { id: "air-quality", label: "Improve Air Quality", theme: "Air Quality" },
      { id: "urban-emissions", label: "Reduce Urban Emissions", theme: "Air Quality" },
      { id: "pollution", label: "Monitor Environmental Pollution", theme: "Air Quality" },
    ],
  },
  {
    theme: "Disaster Management",
    objectives: [
      { id: "flood-risk", label: "Flood Risk Reduction", theme: "Disaster Management" },
      {
        id: "disaster-response",
        label: "Disaster Response & Civil Protection",
        theme: "Disaster Management",
      },
      { id: "early-warning", label: "Early Warning Systems", theme: "Disaster Management" },
    ],
  },
  {
    theme: "Energy",
    objectives: [
      {
        id: "energy-efficiency",
        label: "Building Energy Efficiency Monitoring",
        theme: "Energy",
      },
      {
        id: "renewable-energy",
        label: "Renewable Energy Potential Mapping",
        theme: "Energy",
      },
      { id: "carbon-footprint", label: "Carbon Footprint Monitoring", theme: "Energy" },
    ],
  },
  {
    theme: "Public Safety & Security",
    objectives: [
      {
        id: "public-safety",
        label: "Public Safety & Crime Monitoring",
        theme: "Public Safety & Security",
      },
      {
        id: "critical-infrastructure",
        label: "Critical Infrastructure Protection",
        theme: "Public Safety & Security",
      },
      {
        id: "emergency-coordination",
        label: "Emergency Response Coordination",
        theme: "Public Safety & Security",
      },
    ],
  },
  {
    theme: "Health & Social Services",
    objectives: [
      {
        id: "thermal-comfort",
        label: "Thermal Comfort Improvement",
        theme: "Health & Social Services",
      },
      {
        id: "healthcare-access",
        label: "Healthcare Accessibility Planning",
        theme: "Health & Social Services",
      },
      {
        id: "social-vulnerability",
        label: "Social Vulnerability Mapping",
        theme: "Health & Social Services",
      },
    ],
  },
  {
    theme: "Climate Risk & Resilience",
    objectives: [
      {
        id: "climate-resilience",
        label: "Climate Resilience Planning",
        theme: "Climate Risk & Resilience",
      },
      { id: "uhi", label: "Urban Heat Island Mitigation", theme: "Climate Risk & Resilience" },
      { id: "drought", label: "Drought Preparedness", theme: "Climate Risk & Resilience" },
    ],
  },
];
