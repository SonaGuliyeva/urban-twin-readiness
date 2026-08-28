export const FUTURE_ROADMAP: {
  version: string;
  title: string;
  description: string;
  status: "current" | "planned";
}[] = [
  {
    version: "V1.0",
    title: "Minimum dataset readiness",
    description:
      "Identifies the minimum datasets, source types and Earth Observation inputs required for a given combination of policy objectives and technical maturity level.",
    status: "current",
  },
  {
    version: "V2.0",
    title: "Integration of Open Spatial (OS) layers",
    description:
      "Couples each policy objective with a curated set of open spatial layers (OSM, Urban Atlas, DEM, administrative boundaries, local portals) ready for ingestion.",
    status: "planned",
  },
  {
    version: "V3.0",
    title: "Discovery catalog with metadata and access",
    description:
      "Adds a structured catalog with provider, resolution, temporal coverage, licence and access endpoint for every dataset and layer.",
    status: "planned",
  },
  {
    version: "V4.0",
    title: "Interactive visualizer",
    description:
      "Embeds an interactive map allowing users to explore datasets, inspect metadata and preview integration into an Urban Digital Twin.",
    status: "planned",
  },
];
