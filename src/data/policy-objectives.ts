import type { PolicyObjective } from "@/data/types";

export const POLICY_THEMES: { theme: string; objectives: PolicyObjective[] }[] = [
  {
    theme: "Environmental Quality",
    objectives: [
      { id: "air-quality", label: "Improve Air Quality", theme: "Environmental Quality" },
      { id: "urban-emissions", label: "Reduce Urban Emissions", theme: "Environmental Quality" },
      { id: "pollution", label: "Monitor Environmental Pollution", theme: "Environmental Quality" },
    ],
  },
  {
    theme: "Climate & Risk",
    objectives: [
      { id: "flood-risk", label: "Flood Risk Reduction", theme: "Climate & Risk" },
      {
        id: "disaster-response",
        label: "Disaster Response & Civil Protection",
        theme: "Climate & Risk",
      },
      { id: "climate-resilience", label: "Climate Resilience Planning", theme: "Climate & Risk" },
    ],
  },
  {
    theme: "Urban Climate",
    objectives: [
      { id: "uhi", label: "Urban Heat Island Mitigation", theme: "Urban Climate" },
      { id: "climate-adaptation", label: "Climate Adaptation Strategies", theme: "Urban Climate" },
      { id: "thermal-comfort", label: "Thermal Comfort Improvement", theme: "Urban Climate" },
    ],
  },
  {
    theme: "Water Management",
    objectives: [
      { id: "stormwater", label: "Stormwater and Drainage Management", theme: "Water Management" },
      { id: "water-resources", label: "Water Resource Monitoring", theme: "Water Management" },
      { id: "drought", label: "Drought Preparedness", theme: "Water Management" },
    ],
  },
  {
    theme: "Green & Nature-Based Solutions",
    objectives: [
      {
        id: "green-infra",
        label: "Green Infrastructure Planning",
        theme: "Green & Nature-Based Solutions",
      },
      {
        id: "biodiversity",
        label: "Urban Biodiversity Support",
        theme: "Green & Nature-Based Solutions",
      },
      {
        id: "nbs",
        label: "Nature-Based Solutions Implementation",
        theme: "Green & Nature-Based Solutions",
      },
    ],
  },
  {
    theme: "Urban Planning & Land Use",
    objectives: [
      { id: "land-use", label: "Land Use & Change Monitoring", theme: "Urban Planning & Land Use" },
      {
        id: "regeneration",
        label: "Urban Regeneration & Densification",
        theme: "Urban Planning & Land Use",
      },
      {
        id: "spatial-planning",
        label: "Sustainable Spatial Planning",
        theme: "Urban Planning & Land Use",
      },
    ],
  },
  {
    theme: "Mobility & Emissions",
    objectives: [
      {
        id: "transport-emissions",
        label: "Reduce Transport Emissions",
        theme: "Mobility & Emissions",
      },
      {
        id: "sustainable-mobility",
        label: "Support Sustainable Mobility",
        theme: "Mobility & Emissions",
      },
      { id: "traffic-flows", label: "Optimize Traffic Flows", theme: "Mobility & Emissions" },
    ],
  },
  {
    theme: "Carbon & Sustainability",
    objectives: [
      {
        id: "carbon-footprint",
        label: "Carbon Footprint Monitoring",
        theme: "Carbon & Sustainability",
      },
      {
        id: "climate-neutrality",
        label: "Climate Neutrality Targets",
        theme: "Carbon & Sustainability",
      },
      {
        id: "sustainable-development",
        label: "Sustainable Urban Development",
        theme: "Carbon & Sustainability",
      },
    ],
  },
];
