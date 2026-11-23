export type ImplementationLevel =
  | "status"
  | "informative"
  | "predictive"
  | "optimisation"
  | "autonomous";

export type Priority = "essential" | "recommended" | "optional";

export type SourceType = "satellite" | "ground" | "open-data" | "administrative";

export type EoFit = "strong" | "screening" | "partial";

export interface PolicyObjective {
  id: string;
  label: string;
  /** Challenge group (Srinivas): Urban risks, Water, Air, Land, Waste, Food security, Energy, Mobility */
  theme: string;
  /** Table and problem area in Srinivas the objective comes from */
  source?: string;
  /** SDG 11 target the objective maps to */
  sdg?: string;
  /** How well open satellite data can support the objective (draft judgement) */
  eoFit?: EoFit;
  /** Older objective ids whose data lists are merged into this one */
  alsoUses?: string[];
}

export interface Dataset {
  name: string;
  description: string;
  source: SourceType;
  priority: Priority;
  examples: string[];
  provider?: string;
  resolution?: string;
  access?: string;
}

export interface OpenSpatialLayer {
  name: string;
  description: string;
  provider: string;
  coverage: string;
  access: string;
  url: string;
}

export type Hazard = "flood" | "drought";

export interface EOSensorFamily {
  family: string;
  missions: string[];
  resolution: string;
  roles: { hazard: Hazard; description: string }[];
  scale: string;
  limitations: string;
}

export interface EOIndicator {
  group: "Hydrological" | "Biophysical" | "Meteorological";
  indicator: string;
  flood: string | null;
  drought: string | null;
  sources: string[];
}

export interface TurinSegment {
  id: number;
  street: string;
  lst: number;
  ndviAir: number;
  imperviousPct: number;
  distRiverM: number;
  envStressed: boolean;
  droughtStressed: boolean;
  thermalStressed: boolean;
}

export interface CaseStudy {
  name: string;
  city: string;
  summary: string;
  relatedObjectives: string[];
  source: string;
}

export interface EOService {
  name: string;
  scope: "Global" | "Regional" | "National/Local";
  hazards: Hazard[];
  description: string;
  url: string;
}
