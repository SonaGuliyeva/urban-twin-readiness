import type { CaseStudy } from "@/data/types";

// Real-world UDT examples, drawn from publicly documented sources (not survey
// responses) referenced in the author's related Urban Digital Twin research
// (forthcoming). Shown on the results page when a selected objective relates
// to one of these deployments.
export const CASE_STUDIES: CaseStudy[] = [
  {
    name: "Rotterdam Digital Twin",
    city: "Rotterdam, Netherlands",
    summary:
      "An integrated system for urban data exchange combining a 3D city model with real-time sensor data. Launched in 2025 under the Digital City programme, it brings public and private datasets together into an open-access platform under a public–private partnership governance model. EU-funded projects (RUGGEDISED, MAGPIE) enabled early applications such as smart EV charging infrastructure, intelligent street lighting, and a smart, green, multimodal Port of Rotterdam.",
    relatedObjectives: ["sustainable-mobility", "transport-emissions", "spatial-planning"],
    source: "City of Rotterdam (2026); Hartmann, Pawelzik and Wimmer (2024)",
  },
  {
    name: "Helsinki 3D + Energy and Climate Atlas",
    city: "Helsinki, Finland",
    summary:
      "An open-access digital twin covering the full metropolitan area, launched in 2015 by the City of Helsinki with Forum Virium. Structured around a photogrammetry-based 3D mesh, a semantic CityGML data model, and the Helsinki Energy and Climate Atlas — which integrates building-level energy and construction data (consumption, heating systems, materials, refurbishment history) to support renewable-energy and sustainability assessments, including solar-radiation and geothermal-potential calculations for every building surface.",
    relatedObjectives: [
      "renewable-energy",
      "energy-efficiency",
      "carbon-footprint",
      "thermal-comfort",
    ],
    source: "City of Helsinki (2026)",
  },
  {
    name: "Digital Twin of Antwerp",
    city: "Antwerp, Belgium",
    summary:
      "A predictive urban model launched in 2018 by Imec and TNO, integrating noise pollution data, real-time air quality, and traffic sensor data with computational models. It offers scenario-simulation capabilities that let policymakers test the impact of interventions — such as traffic changes — on mobility, air quality, and noise levels through an interactive planning interface.",
    relatedObjectives: ["air-quality", "pollution", "traffic-flows"],
    source: "Imec (2018)",
  },
  {
    name: "Digital Twin Victoria",
    city: "Victoria, Australia",
    summary:
      "A statewide digital twin launched in 2022 by the Victorian Government (Department of Environment, Land, Water and Planning), covering over 60,000 km\u00b2 — 99% of the state's population and 95%+ of its buildings — and integrating more than 5,000 datasets. Organised into seven components, including Advanced Earth Observation (a dedicated statewide data-acquisition engine) and Enhanced Disaster Response (machine learning and spatial data to improve emergency management).",
    relatedObjectives: ["disaster-response", "climate-resilience", "flood-risk"],
    source: "Victoria State Government (2022, 2024, 2025)",
  },
];
