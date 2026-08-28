import type { PolicyObjective } from "@/data/types";

export const POLICY_THEMES: { theme: string; objectives: PolicyObjective[] }[] = [
  {
    theme: "Urban Planning & Development",
    objectives: [
      { id: "land-use", label: "Land Use & Change Monitoring", theme: "Urban Planning & Development" },
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
