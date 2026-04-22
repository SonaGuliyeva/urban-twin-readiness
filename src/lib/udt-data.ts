export type ImplementationLevel = "beginner" | "moderate" | "advanced";

export type Priority = "essential" | "recommended" | "optional";

export type SourceType = "satellite" | "ground" | "open-data" | "administrative";

export interface PolicyObjective {
  id: string;
  label: string;
  theme: string;
}

export interface Dataset {
  name: string;
  description: string;
  source: SourceType;
  priority: Priority;
  examples: string[];
}

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
      { id: "disaster-response", label: "Disaster Response & Civil Protection", theme: "Climate & Risk" },
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
      { id: "green-infra", label: "Green Infrastructure Planning", theme: "Green & Nature-Based Solutions" },
      { id: "biodiversity", label: "Urban Biodiversity Support", theme: "Green & Nature-Based Solutions" },
      { id: "nbs", label: "Nature-Based Solutions Implementation", theme: "Green & Nature-Based Solutions" },
    ],
  },
  {
    theme: "Urban Planning & Land Use",
    objectives: [
      { id: "land-use", label: "Land Use & Change Monitoring", theme: "Urban Planning & Land Use" },
      { id: "regeneration", label: "Urban Regeneration & Densification", theme: "Urban Planning & Land Use" },
      { id: "spatial-planning", label: "Sustainable Spatial Planning", theme: "Urban Planning & Land Use" },
    ],
  },
  {
    theme: "Mobility & Emissions",
    objectives: [
      { id: "transport-emissions", label: "Reduce Transport Emissions", theme: "Mobility & Emissions" },
      { id: "sustainable-mobility", label: "Support Sustainable Mobility", theme: "Mobility & Emissions" },
      { id: "traffic-flows", label: "Optimize Traffic Flows", theme: "Mobility & Emissions" },
    ],
  },
  {
    theme: "Carbon & Sustainability",
    objectives: [
      { id: "carbon-footprint", label: "Carbon Footprint Monitoring", theme: "Carbon & Sustainability" },
      { id: "climate-neutrality", label: "Climate Neutrality Targets", theme: "Carbon & Sustainability" },
      { id: "sustainable-development", label: "Sustainable Urban Development", theme: "Carbon & Sustainability" },
    ],
  },
];

const D = (name: string, description: string, source: SourceType, priority: Priority, examples: string[]): Dataset =>
  ({ name, description, source, priority, examples });

const DATASETS_BY_OBJECTIVE: Record<string, Dataset[]> = {
  "air-quality": [
    D("Tropospheric NO₂ & Aerosol Concentrations", "Satellite-derived pollutant concentrations at city scale.", "satellite", "essential", ["Sentinel-5P TROPOMI", "Copernicus CAMS"]),
    D("Ground-Based Air Quality Stations", "Reference measurements of PM2.5, PM10, NO₂, O₃.", "ground", "essential", ["EEA AirBase", "Local AQ networks"]),
    D("Low-Cost Sensor Networks", "Distributed PM and gas sensors for hyperlocal mapping.", "ground", "recommended", ["PurpleAir", "Municipal IoT networks"]),
    D("Traffic & Emission Inventories", "Activity data driving urban emission models.", "administrative", "recommended", ["EMEP/EEA inventories", "Local transport data"]),
  ],
  "urban-emissions": [
    D("CO₂ & CH₄ Column Concentrations", "Satellite observations of greenhouse gas plumes.", "satellite", "essential", ["Sentinel-5P", "GOSAT", "Copernicus CO2M (upcoming)"]),
    D("Energy Consumption by Sector", "Buildings, industry, transport energy use.", "administrative", "essential", ["Municipal energy registers", "DSO data"]),
    D("Emission Inventory Database", "Sector-resolved emission factors.", "open-data", "recommended", ["EDGAR", "EMEP/EEA"]),
  ],
  "pollution": [
    D("Multi-Pollutant Satellite Products", "Atmospheric, water and soil contamination indicators.", "satellite", "essential", ["Sentinel-5P", "Sentinel-2/3", "CAMS"]),
    D("Soil & Water Quality Surveys", "Ground sampling for heavy metals and nutrients.", "ground", "recommended", ["LUCAS Soil", "WISE WFD"]),
    D("Industrial Emission Registers", "Reported emissions from regulated facilities.", "administrative", "recommended", ["E-PRTR"]),
  ],
  "flood-risk": [
    D("High-Resolution Digital Elevation Model", "Terrain data driving hydraulic models.", "satellite", "essential", ["Copernicus DEM", "National LiDAR DTMs"]),
    D("Precipitation & Hydrological Records", "Rainfall, river discharge, soil moisture.", "ground", "essential", ["National hydromet services", "Copernicus EMS"]),
    D("Flood Hazard & Risk Maps", "Modelled inundation extents and probabilities.", "open-data", "essential", ["EU Floods Directive maps", "JRC GloFAS"]),
    D("Land Cover & Imperviousness", "Surface runoff parameters for urban hydrology.", "satellite", "recommended", ["Copernicus Land Monitoring Service"]),
  ],
  "disaster-response": [
    D("Rapid Mapping Imagery", "On-demand high-resolution imagery for emergencies.", "satellite", "essential", ["Copernicus EMS Rapid Mapping", "International Charter"]),
    D("Critical Infrastructure Inventory", "Hospitals, shelters, lifelines geolocated.", "administrative", "essential", ["Municipal asset registers"]),
    D("Real-Time Sensor Feeds", "Hydrological, seismic and meteorological alerts.", "ground", "recommended", ["National civil protection networks"]),
  ],
  "climate-resilience": [
    D("Climate Projections (Downscaled)", "Regional CORDEX scenarios for impact assessment.", "open-data", "essential", ["Copernicus C3S CDS", "EURO-CORDEX"]),
    D("Historical Climate Reanalysis", "Multi-decadal temperature and precipitation records.", "open-data", "essential", ["ERA5", "UERRA"]),
    D("Vulnerability & Exposure Indicators", "Socio-demographic and infrastructure exposure data.", "administrative", "recommended", ["Eurostat", "Census data"]),
  ],
  "uhi": [
    D("Land Surface Temperature (LST)", "Thermal satellite data revealing heat hotspots.", "satellite", "essential", ["Landsat 8/9 TIRS", "ECOSTRESS", "Sentinel-3 SLSTR"]),
    D("Urban Morphology & Building Heights", "3D city models and SVF for microclimate analysis.", "open-data", "essential", ["Copernicus Urban Atlas", "OSM 3D", "national 3D registers"]),
    D("Surface Albedo & Imperviousness", "Reflectivity and sealed surface fractions.", "satellite", "recommended", ["Sentinel-2", "Copernicus HRL"]),
    D("Air Temperature Sensor Network", "Ground microclimate stations.", "ground", "recommended", ["Municipal weather networks", "Citizen weather stations"]),
  ],
  "climate-adaptation": [
    D("Multi-Hazard Climate Indicators", "Heat, drought, flood and storm indices.", "open-data", "essential", ["Copernicus C3S European Climate Adaptation"]),
    D("Land Cover Change Time Series", "Long-term urban expansion and green loss.", "satellite", "recommended", ["Copernicus Global/Local Land Cover"]),
  ],
  "thermal-comfort": [
    D("Land Surface Temperature & Humidity", "Inputs for UTCI / PET comfort indices.", "satellite", "essential", ["Landsat", "Sentinel-3", "ERA5-Land"]),
    D("Urban Tree Canopy & Shade Maps", "Canopy cover supporting cooling strategies.", "satellite", "recommended", ["Sentinel-2", "Aerial LiDAR"]),
    D("Pedestrian Microclimate Sensors", "Street-level temperature and radiation.", "ground", "optional", ["Research/IoT deployments"]),
  ],
  "stormwater": [
    D("High-Resolution DEM & Drainage Network", "Detailed terrain plus pipe/channel inventory.", "administrative", "essential", ["Utility GIS", "LiDAR DTM"]),
    D("Imperviousness & Land Cover", "Surface runoff coefficients.", "satellite", "essential", ["Copernicus HRL Imperviousness"]),
    D("Rainfall Radar & Gauges", "High-frequency precipitation for urban runoff.", "ground", "recommended", ["National radar networks"]),
  ],
  "water-resources": [
    D("Surface Water Extent & Quality", "Reservoir levels, turbidity, chlorophyll.", "satellite", "essential", ["Sentinel-2", "Sentinel-3 OLCI"]),
    D("Groundwater Monitoring Wells", "Aquifer level and quality measurements.", "ground", "essential", ["National hydrogeological services"]),
    D("Water Supply & Consumption Records", "Utility metering data.", "administrative", "recommended", ["Water utilities"]),
  ],
  "drought": [
    D("Soil Moisture & Vegetation Indices", "NDVI, NDWI, SMOS soil moisture for stress.", "satellite", "essential", ["Sentinel-2", "Sentinel-1", "SMOS", "EDO"]),
    D("Standardized Precipitation Index", "Meteorological drought indicators.", "open-data", "essential", ["Copernicus EDO", "C3S CDS"]),
  ],
  "green-infra": [
    D("Urban Tree Canopy & Green Space Maps", "Vegetation cover and connectivity.", "satellite", "essential", ["Sentinel-2 NDVI", "Copernicus Urban Atlas Street Tree Layer"]),
    D("Land Cover & Permeability", "Sealed vs vegetated surface distribution.", "satellite", "recommended", ["Copernicus HRL"]),
    D("Park & Green Asset Inventory", "Municipally managed green areas.", "administrative", "recommended", ["Municipal cadastres"]),
  ],
  "biodiversity": [
    D("Habitat & Land Cover Mapping", "Ecosystem distribution within the urban matrix.", "satellite", "essential", ["Copernicus Land Cover", "EUNIS"]),
    D("Species Occurrence Data", "Citizen science and surveys.", "open-data", "recommended", ["GBIF", "iNaturalist"]),
  ],
  "nbs": [
    D("Vegetation Indices Time Series", "Tracking NBS performance over seasons.", "satellite", "essential", ["Sentinel-2 NDVI/EVI"]),
    D("Site-Level Monitoring Sensors", "Soil moisture, runoff, temperature at NBS sites.", "ground", "recommended", ["Project IoT networks"]),
    D("NBS Project Registry", "Geolocated catalogue of interventions.", "administrative", "recommended", ["Municipal/EU project registers"]),
  ],
  "land-use": [
    D("Land Cover / Land Use Change", "Multi-temporal classification of urban change.", "satellite", "essential", ["Copernicus CLC+", "Urban Atlas", "Sentinel-2"]),
    D("Cadastral & Zoning Data", "Legal land use boundaries and regulations.", "administrative", "essential", ["National cadastres"]),
    D("Building Footprints", "Up-to-date building inventory.", "open-data", "recommended", ["OpenStreetMap", "Microsoft/Google footprints"]),
  ],
  "regeneration": [
    D("Building Age & Condition Records", "Inputs for renovation prioritisation.", "administrative", "essential", ["Cadastres", "Energy performance registers"]),
    D("3D City Model", "Massing and density for regeneration scenarios.", "open-data", "recommended", ["CityGML datasets", "national 3D registers"]),
  ],
  "spatial-planning": [
    D("Integrated Land Use & Demographics", "Combined planning and population data.", "administrative", "essential", ["Eurostat", "National statistical offices"]),
    D("Accessibility & Service Coverage", "Walkability and proximity indicators.", "open-data", "recommended", ["OSM-based isochrones"]),
  ],
  "transport-emissions": [
    D("NO₂ & CO₂ Satellite Observations", "Traffic-related emission proxies.", "satellite", "essential", ["Sentinel-5P", "CAMS"]),
    D("Traffic Counts & Fleet Composition", "Activity data for emission modelling.", "administrative", "essential", ["Municipal traffic systems", "Vehicle registries"]),
    D("Floating Car / Telematics Data", "Real-world driving patterns.", "ground", "recommended", ["Telematics providers"]),
  ],
  "sustainable-mobility": [
    D("Multimodal Transport Network", "Roads, transit, cycling and walking layers.", "open-data", "essential", ["GTFS feeds", "OpenStreetMap"]),
    D("Active Mobility Counters", "Bike and pedestrian flow sensors.", "ground", "recommended", ["Municipal counters"]),
  ],
  "traffic-flows": [
    D("Real-Time Traffic Feeds", "Speed, volume and incident data.", "ground", "essential", ["DATEX II feeds", "Municipal ITS"]),
    D("Road Network Topology", "Routable network for simulation.", "open-data", "essential", ["OpenStreetMap", "National road registers"]),
  ],
  "carbon-footprint": [
    D("Sectoral GHG Inventory", "Buildings, transport, waste, industry emissions.", "administrative", "essential", ["GPC-compliant inventories", "CDP-ICLEI Track"]),
    D("Atmospheric GHG Observations", "Independent verification of emissions.", "satellite", "recommended", ["Sentinel-5P", "Copernicus CO2M"]),
    D("Energy Consumption Data", "Sector-resolved energy use.", "administrative", "essential", ["DSO/utility data"]),
  ],
  "climate-neutrality": [
    D("Baseline Emission Inventory", "Reference year sectoral emissions.", "administrative", "essential", ["SECAP baseline", "GPC"]),
    D("Renewable Energy & Grid Data", "Generation, storage and grid mix.", "administrative", "recommended", ["TSO/DSO open data"]),
    D("Land Carbon & Vegetation Stocks", "Urban carbon sinks.", "satellite", "recommended", ["Sentinel-2 biomass proxies"]),
  ],
  "sustainable-development": [
    D("SDG-Aligned Urban Indicators", "Cross-sectoral monitoring framework.", "open-data", "essential", ["UN-Habitat City Prosperity", "Eurostat SDG"]),
    D("Land Cover & Urban Form", "Compactness, sprawl and green ratios.", "satellite", "recommended", ["Copernicus Urban Atlas"]),
  ],
};

export function getDatasetsForObjectives(ids: string[], level: ImplementationLevel): Dataset[] {
  const map = new Map<string, Dataset>();
  ids.forEach((id) => {
    (DATASETS_BY_OBJECTIVE[id] ?? []).forEach((d) => {
      const existing = map.get(d.name);
      if (!existing || priorityRank(d.priority) < priorityRank(existing.priority)) {
        map.set(d.name, d);
      }
    });
  });
  let datasets = Array.from(map.values());

  if (level === "beginner") {
    datasets = datasets.filter((d) => d.priority === "essential" || d.source === "open-data");
  } else if (level === "moderate") {
    datasets = datasets.filter((d) => d.priority !== "optional");
  }

  return datasets.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

function priorityRank(p: Priority): number {
  return p === "essential" ? 0 : p === "recommended" ? 1 : 2;
}

export const LEVEL_DESCRIPTIONS: Record<ImplementationLevel, {
  title: string;
  short: string;
  capable: string[];
  missing: string[];
  nextSteps: string[];
}> = {
  beginner: {
    title: "Beginner — Static Foundation",
    short: "A basic 2D/3D digital twin built primarily on open data, with limited integration. Suitable for cities starting from scratch.",
    capable: [
      "Visualise the city in 2D/3D using open base maps and building footprints.",
      "Overlay periodic open environmental indicators (e.g. land cover, basic air quality).",
      "Communicate baseline diagnostics to decision-makers and the public.",
    ],
    missing: [
      "Continuous data flows from sensors and operational systems.",
      "Analytical and modelling capacity for what-if scenarios.",
      "Interoperability across municipal departments.",
    ],
    nextSteps: [
      "Establish a data governance framework and metadata catalogue.",
      "Begin periodic ingestion of Copernicus and national open datasets.",
      "Pilot one thematic use case (e.g. heat islands or flood risk).",
    ],
  },
  moderate: {
    title: "Moderate — Semi-Dynamic Twin",
    short: "Periodic satellite updates combined with local sensor integration and basic analytics. Suitable for cities with established GIS capacity.",
    capable: [
      "Update environmental layers on a regular cadence (daily to monthly).",
      "Integrate municipal IoT sensors and SCADA feeds for selected domains.",
      "Run descriptive analytics, dashboards and trend monitoring.",
    ],
    missing: [
      "Real-time data fusion across multiple operational systems.",
      "AI-driven predictive models and decision-support workflows.",
      "Standardised APIs aligned with international interoperability frameworks.",
    ],
    nextSteps: [
      "Deploy a city data platform with standardised APIs (e.g. OGC, FIWARE).",
      "Develop predictive models for priority objectives.",
      "Strengthen cross-departmental governance and data sharing agreements.",
    ],
  },
  advanced: {
    title: "Advanced — Operational Digital Twin",
    short: "Real-time or near-real-time twin with AI-supported analytics, multi-source data fusion, and operational decision support.",
    capable: [
      "Fuse satellite, sensor and administrative data in near real-time.",
      "Run AI/ML models for forecasting, anomaly detection and scenario testing.",
      "Support operational decisions across departments through shared services.",
    ],
    missing: [
      "Continuous validation against ground truth and uncertainty quantification.",
      "Long-term funding and skills sustainability.",
      "Citizen-facing transparency and participatory layers.",
    ],
    nextSteps: [
      "Institutionalise the twin as core municipal infrastructure.",
      "Extend interoperability with regional and EU data spaces.",
      "Embed ethical AI, transparency and citizen engagement mechanisms.",
    ],
  },
};

export const EO_PLATFORMS: { name: string; description: string; url: string }[] = [
  { name: "Copernicus Data Space Ecosystem", description: "Free access to Sentinel-1/2/3/5P imagery and processing tools.", url: "https://dataspace.copernicus.eu" },
  { name: "Copernicus Land Monitoring Service", description: "Pan-European land cover, Urban Atlas and High Resolution Layers.", url: "https://land.copernicus.eu" },
  { name: "Copernicus Atmosphere Monitoring Service (CAMS)", description: "Air quality and greenhouse gas reanalyses and forecasts.", url: "https://atmosphere.copernicus.eu" },
  { name: "Copernicus Climate Change Service (C3S)", description: "Climate reanalyses, projections and indicators (CDS).", url: "https://climate.copernicus.eu" },
  { name: "Copernicus Emergency Management Service", description: "Rapid mapping and risk & recovery products.", url: "https://emergency.copernicus.eu" },
  { name: "NASA Earthdata", description: "Landsat, MODIS, ECOSTRESS and global EO archives.", url: "https://earthdata.nasa.gov" },
  { name: "Google Earth Engine", description: "Cloud-based EO analytics over multi-decadal archives.", url: "https://earthengine.google.com" },
  { name: "ESA Earth Online", description: "ESA mission data, third-party missions and tools.", url: "https://earth.esa.int" },
];
