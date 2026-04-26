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

const D = (
  name: string,
  description: string,
  source: SourceType,
  priority: Priority,
  examples: string[],
  meta?: { provider?: string; resolution?: string; access?: string },
): Dataset => ({ name, description, source, priority, examples, ...meta });

// Default metadata applied per source type when a dataset does not specify its own.
const DEFAULT_META: Record<SourceType, { provider: string; resolution: string; access: string }> = {
  satellite: { provider: "ESA / Copernicus / NASA", resolution: "10–1000 m, daily to monthly revisit", access: "Open access (Copernicus / Earthdata)" },
  ground: { provider: "National agency or municipality", resolution: "Point measurements, sub-hourly to daily", access: "Open data portal or API (varies)" },
  "open-data": { provider: "EU / international open data initiative", resolution: "Variable", access: "Open access download or API" },
  administrative: { provider: "Local or national authority", resolution: "Administrative units, annual updates", access: "Restricted or on request" },
};

function enrichDataset(d: Dataset): Dataset {
  const def = DEFAULT_META[d.source];
  return {
    ...d,
    provider: d.provider ?? def.provider,
    resolution: d.resolution ?? def.resolution,
    access: d.access ?? def.access,
  };
}


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
    D("High-Resolution Digital Elevation Model (DEM/DTM)", "Bare-earth terrain model driving 1D/2D hydraulic and inundation models. LiDAR-derived DTMs significantly improve depth and extent accuracy.", "satellite", "essential", ["Copernicus DEM (GLO-30 / EEA-10)", "National LiDAR DTMs", "ICESat-2", "SWOT"], { provider: "ESA / National mapping agencies", resolution: "1–30 m, episodic updates", access: "Open access (Copernicus) / national open data" }),
    D("SAR Inundation Mapping (All-Weather)", "Cloud- and night-independent flood extent mapping during emergencies, including levee breach and infrastructure impact detection.", "satellite", "essential", ["Sentinel-1 SAR", "COSMO-SkyMed", "TerraSAR-X", "ICEYE", "RADARSAT-2"], { provider: "ESA Copernicus / ASI / DLR", resolution: "1–20 m, 6–12 d revisit (on-demand for VHR)", access: "Open (Sentinel-1) / commercial (VHR)" }),
    D("Optical Surface Water & Damage Imagery", "High-resolution optical imagery for inundation delineation (NDWI/MNDWI) and post-event damage assessment in cloud-free conditions.", "satellite", "essential", ["Sentinel-2", "Landsat 8/9", "PlanetScope", "Pléiades", "Gaofen-1", "UAV optical"]),
    D("Satellite Precipitation & Hydrological Records", "Near-real-time rainfall, river discharge and soil moisture for forcing flood early warning systems and hydrological models.", "ground", "essential", ["GPM IMERG", "GSMaP", "National hydromet rain gauges & radar", "Copernicus EMS", "GloFAS / EFAS"], { provider: "NASA / JAXA / ECMWF / national agencies", resolution: "0.1° satellite; sub-hourly gauges", access: "Open (NASA, ECMWF, Copernicus)" }),
    D("Flood Hazard & Risk Maps", "Modelled inundation extents and probabilities for return periods (10/100/500-yr) under EU Floods Directive 2007/60/EC.", "open-data", "essential", ["EU Floods Directive maps", "JRC GloFAS", "EFAS LISFLOOD"]),
    D("Soil Moisture Anomaly Products", "Pre-event antecedent wetness for runoff forecasting; rapid saturation detection signals reduced infiltration capacity.", "satellite", "recommended", ["SMAP", "SMOS", "ASCAT", "H SAF NRT SM/RZSM", "Sentinel-1 derived"], { provider: "ESA / NASA / EUMETSAT H SAF", resolution: "1–50 km, sub-daily to daily", access: "Open access (Copernicus / Earthdata / H SAF)" }),
    D("Land Cover & Imperviousness", "Surface runoff coefficients and exposure layer for urban hydrological models.", "satellite", "recommended", ["Copernicus HRL Imperviousness", "Urban Atlas", "CLC+"]),
    D("Critical Infrastructure & Exposure Layer", "Hospitals, shelters, lifelines, ground-floor elevations supporting impact and evacuation planning.", "administrative", "recommended", ["Municipal asset registers", "Mobile LiDAR (MMS) building elevations"]),
    D("UAV Rapid Mapping (Local)", "Centimetre-scale flood extent and depth in dense urban environments for tactical response and recovery.", "ground", "optional", ["UAV optical surveys", "UAV LiDAR"], { provider: "Municipal / civil protection / contractor", resolution: "cm–dm, on-demand", access: "Owned / commissioned" }),
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
    D("Soil Moisture & Root-Zone Anomalies", "Early deficit detection — passive microwave soil moisture frequently anticipates vegetation stress by several weeks (extending forecast lead times).", "satellite", "essential", ["SMAP", "SMOS", "ASCAT", "AMSR-2", "H SAF NRT SM/RZSM"], { provider: "NASA / ESA / EUMETSAT H SAF", resolution: "5–50 km, sub-daily to daily", access: "Open access" }),
    D("Vegetation Condition Indices (NDVI / VCI / VHI)", "Canopy stress detection at field to regional scale; NDVI time series enables retrospective drought-impact analysis.", "satellite", "essential", ["MODIS", "VIIRS", "AVHRR", "Sentinel-2", "Landsat 8/9"], { provider: "NASA / ESA / NOAA", resolution: "10–1000 m, daily to 16-day", access: "Open access (Earthdata / Copernicus)" }),
    D("Land Surface Temperature & Evaporative Stress (ESI)", "Thermal anomalies and evapotranspiration deficits — ECOSTRESS-derived ESI has detected drought onset ~2 weeks before SPI.", "satellite", "essential", ["ECOSTRESS", "MODIS LST", "Landsat TIRS", "Sentinel-3 SLSTR"], { provider: "NASA / ESA", resolution: "70 m – 1 km, daily to 16-day", access: "Open access" }),
    D("Standardized Precipitation Indices (SPI / SPEI)", "Meteorological drought indicators combining satellite precipitation and reanalysis temperature for severity classification.", "open-data", "essential", ["Copernicus EDO", "GPM IMERG", "ERA5", "C3S CDS"]),
    D("Total Water Storage Anomalies", "Groundwater depletion and basin-scale water loss signals from gravimetric satellite missions.", "satellite", "recommended", ["GRACE", "GRACE-FO"], { provider: "NASA / DLR", resolution: "~300 km, monthly", access: "Open access" }),
    D("Surface Water Extent (Reservoirs & Lakes)", "Long-term monitoring of reservoir and lake shrinkage as a hydrological drought signal.", "satellite", "recommended", ["Sentinel-2", "Sentinel-1 SAR", "Landsat", "Sentinel-3 / Jason-3 / SWOT altimetry"]),
    D("Solar-Induced Chlorophyll Fluorescence (SIF)", "Highly sensitive early indicator of physiological plant stress, often preceding NDVI anomalies.", "satellite", "optional", ["Sentinel-5P", "OCO-2 / OCO-3"], { provider: "ESA / NASA", resolution: "3.5–7 km, daily", access: "Open access" }),
    D("Ground Soil Moisture & Agro-Meteorological Network", "In-situ validation network supporting calibration of satellite products and operational drought bulletins.", "ground", "recommended", ["National agro-meteorological networks", "ISMN", "Local irrigation district sensors"]),
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

  return datasets
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .map(enrichDataset);
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

export const OPEN_SPATIAL_LAYERS: OpenSpatialLayer[] = [
  {
    name: "OpenStreetMap",
    description: "Collaborative base map with road network, buildings, land use and points of interest.",
    provider: "OpenStreetMap Foundation",
    coverage: "Global, vector, continuously updated",
    access: "Open access (ODbL) — direct download, Overpass API, tile services",
    url: "https://www.openstreetmap.org",
  },
  {
    name: "Copernicus Urban Atlas",
    description: "Harmonised land use and land cover for European Functional Urban Areas, including street tree layer and building heights.",
    provider: "Copernicus Land Monitoring Service",
    coverage: "EEA-39 cities, ~10 m, updated every ~6 years",
    access: "Open access via Copernicus Land portal",
    url: "https://land.copernicus.eu/local/urban-atlas",
  },
  {
    name: "Copernicus DEM (GLO-30 / EEA-10)",
    description: "Global and European digital elevation models supporting hydrology, line-of-sight and 3D city modelling.",
    provider: "ESA / Copernicus",
    coverage: "30 m global, 10 m over EEA-39",
    access: "Open access via Copernicus Data Space",
    url: "https://dataspace.copernicus.eu",
  },
  {
    name: "GADM / EU Administrative Boundaries (GISCO)",
    description: "Reference administrative boundaries (countries, regions, municipalities) for spatial aggregation and reporting.",
    provider: "Eurostat GISCO / GADM",
    coverage: "Global and European, multiple administrative levels",
    access: "Open access download (shapefile, GeoJSON)",
    url: "https://ec.europa.eu/eurostat/web/gisco",
  },
  {
    name: "Microsoft / Google Open Building Footprints",
    description: "AI-derived building footprints filling gaps in OSM, useful for density and exposure analysis.",
    provider: "Microsoft / Google Research",
    coverage: "Global, vector polygons",
    access: "Open access (ODbL / CDLA)",
    url: "https://github.com/microsoft/GlobalMLBuildingFootprints",
  },
  {
    name: "Local Open Data Portals",
    description: "Municipal and regional portals publishing cadastres, transport networks, environmental sensors and planning layers.",
    provider: "Local authorities",
    coverage: "City / regional scale, varies",
    access: "Open data portals, often CKAN-based, with APIs",
    url: "https://data.europa.eu",
  },
];

export const FUTURE_ROADMAP: { version: string; title: string; description: string; status: "current" | "planned" }[] = [
  {
    version: "V1.0",
    title: "Minimum dataset readiness",
    description: "Identifies the minimum datasets, source types and Earth Observation inputs required for a given combination of policy objectives and implementation level.",
    status: "current",
  },
  {
    version: "V2.0",
    title: "Integration of Open Spatial (OS) layers",
    description: "Couples each policy objective with a curated set of open spatial layers (OSM, Urban Atlas, DEM, administrative boundaries, local portals) ready for ingestion.",
    status: "planned",
  },
  {
    version: "V3.0",
    title: "Discovery catalog with metadata and access",
    description: "Adds a structured catalog with provider, resolution, temporal coverage, licence and access endpoint for every dataset and layer.",
    status: "planned",
  },
  {
    version: "V4.0",
    title: "Interactive visualizer",
    description: "Embeds an interactive map allowing users to explore datasets, inspect metadata and preview integration into an Urban Digital Twin.",
    status: "planned",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hydrological hazards module — flood & drought
// Adapted from Guliyeva, S. & Boccardo, P. (2026). Geospatial Technologies for
// Flood and Drought Management: A Review of Earth Observation Data, Procedures,
// and their Operational Effectiveness. Aerotecnica Missili & Spazio.
// https://doi.org/10.1007/s42496-026-00309-4
// ─────────────────────────────────────────────────────────────────────────────

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

export interface EOService {
  name: string;
  scope: "Global" | "Regional" | "National/Local";
  hazards: Hazard[];
  description: string;
  url: string;
}

export const EO_SENSOR_FAMILIES: EOSensorFamily[] = [
  {
    family: "Optical (VNIR / SWIR)",
    missions: ["MODIS", "VIIRS", "Landsat 8/9", "Sentinel-2", "PlanetScope", "Pléiades", "Gaofen-1", "UAV"],
    resolution: "Low (250–1000 m, daily) · Moderate (30 m, 5–16 d) · High (<30 m, daily/on-demand)",
    roles: [
      { hazard: "drought", description: "Vegetation condition and stress (NDVI, VCI, VHI)." },
      { hazard: "flood", description: "Surface water and inundation mapping (NDWI, MNDWI); land-cover and damage assessment." },
    ],
    scale: "Global to local",
    limitations: "Cloud and daylight dependency",
  },
  {
    family: "Thermal infrared (TIR)",
    missions: ["MODIS", "VIIRS", "Sentinel-3 SLSTR", "Landsat TIRS", "ASTER TIR", "ECOSTRESS", "GOES"],
    resolution: "Low (375 m–1 km, daily) · Moderate (70–100 m, 4–16 d)",
    roles: [
      { hazard: "drought", description: "LST anomalies, evapotranspiration and canopy stress monitoring." },
      { hazard: "flood", description: "Residual floodwater and soil-wetness detection via thermal contrast." },
    ],
    scale: "Global to regional",
    limitations: "Coarse resolution; cloud and atmospheric effects",
  },
  {
    family: "Microwave — active SAR",
    missions: ["Sentinel-1", "RADARSAT-2", "TerraSAR-X", "COSMO-SkyMed", "ICEYE"],
    resolution: "High (1–20 m, 6–12 d or on-demand)",
    roles: [
      { hazard: "flood", description: "All-weather inundation mapping, flood duration and dynamics, levee breach and infrastructure impact." },
    ],
    scale: "Regional to local",
    limitations: "Urban layover/shadow effects; cost of VHR data",
  },
  {
    family: "Microwave — passive radiometers",
    missions: ["SMAP", "SMOS", "AMSR-2", "GPM", "ASCAT", "GRACE / GRACE-FO"],
    resolution: "Low (5–50 km, sub-daily to multi-day)",
    roles: [
      { hazard: "drought", description: "Soil moisture deficit and groundwater storage anomalies." },
      { hazard: "flood", description: "Precipitation forcing and basin-scale hydrological anomalies." },
    ],
    scale: "Global to regional",
    limitations: "Very coarse resolution; limited local applicability",
  },
  {
    family: "LiDAR (laser altimetry)",
    missions: ["ICESat-2", "GEDI", "SWOT", "Airborne / UAV LiDAR", "Mobile LiDAR (MMS)"],
    resolution: "High (cm–m, on-demand) · Moderate–low (50–250 m, 10–90 d)",
    roles: [
      { hazard: "flood", description: "High-resolution DEMs, flood depth and hydraulic modelling; detailed post-event damage mapping." },
      { hazard: "drought", description: "Vegetation structure and biomass loss assessment." },
    ],
    scale: "Regional to local",
    limitations: "Cost, weather sensitivity, limited temporal coverage",
  },
];

export const EO_INDICATORS: EOIndicator[] = [
  { group: "Hydrological", indicator: "Soil moisture anomaly", flood: "Rapid saturation detection", drought: "Early deficit detection", sources: ["SMAP", "SMOS", "AMSR-2", "Sentinel-1", "H SAF NRT SM/RZSM"] },
  { group: "Hydrological", indicator: "Surface water extent anomaly", flood: "Inundation delineation", drought: "Reservoir / lake shrinkage", sources: ["Sentinel-1", "Sentinel-2", "Landsat", "MODIS"] },
  { group: "Hydrological", indicator: "Water level anomaly", flood: "Rising river / lake stage", drought: "Declining water levels", sources: ["Sentinel-3", "Jason-2/3", "SWOT"] },
  { group: "Hydrological", indicator: "Total Water Storage (TWS) anomaly", flood: null, drought: "Groundwater depletion", sources: ["GRACE", "GRACE-FO"] },
  { group: "Hydrological", indicator: "Snow Water Equivalent (SWE) anomaly", flood: "Snowmelt-induced floods", drought: "Reduced snowpack", sources: ["AMSR-2 SWE", "MODIS"] },
  { group: "Biophysical", indicator: "NDVI anomaly · VCI / VHI", flood: "Post-flood vegetation impact", drought: "Canopy stress detection", sources: ["MODIS", "AVHRR", "VIIRS", "Sentinel-2"] },
  { group: "Biophysical", indicator: "LST anomaly · Evaporative Stress Index (ESI)", flood: "Cooling over floodwater", drought: "High LST & low ET", sources: ["MODIS LST", "ECOSTRESS"] },
  { group: "Biophysical", indicator: "Solar-Induced Chlorophyll Fluorescence (SIF)", flood: null, drought: "Early physiological stress", sources: ["OCO-2 / OCO-3", "Sentinel-5P"] },
  { group: "Meteorological", indicator: "Precipitation anomaly (SPI / SPEI)", flood: "Wet anomaly / triggering rainfall", drought: "Dry anomaly", sources: ["GPM", "TRMM", "ERA5"] },
  { group: "Meteorological", indicator: "Temperature anomaly / heat stress", flood: null, drought: "Heat-induced stress", sources: ["MODIS", "ERA5"] },
];

export const EO_HYDRO_SERVICES: EOService[] = [
  { name: "Copernicus Emergency Management Service (CEMS)", scope: "Regional", hazards: ["flood"], description: "On-demand rapid mapping and risk & recovery products supporting civil protection across Europe and globally.", url: "https://emergency.copernicus.eu" },
  { name: "Global Flood Awareness System (GloFAS)", scope: "Global", hazards: ["flood"], description: "Operational flood forecasts integrating hydrological and meteorological inputs at global scale.", url: "https://global-flood.emergency.copernicus.eu" },
  { name: "European Flood Awareness System (EFAS / LISFLOOD)", scope: "Regional", hazards: ["flood"], description: "Continental flood early warning combining SAR, DEMs and meteorological forcings via the LISFLOOD model.", url: "https://www.efas.eu" },
  { name: "European Drought Observatory (EDO)", scope: "Regional", hazards: ["drought"], description: "Combined drought indicators (SPI, soil moisture, VHI) for monitoring and early warning across Europe.", url: "https://edo.jrc.ec.europa.eu" },
  { name: "NASA Global Flood Monitoring System (GFMS)", scope: "Global", hazards: ["flood"], description: "Cross-spectral integration (optical + microwave + thermal) generating near-real-time global flood alerts.", url: "https://flood.umd.edu" },
  { name: "EUMETSAT H SAF", scope: "Regional", hazards: ["flood", "drought"], description: "Operational hydrology products (precipitation, soil moisture, snow) supporting national hydromet services.", url: "https://hsaf.meteoam.it" },
  { name: "Google Earth Engine (GEE)", scope: "Global", hazards: ["flood", "drought"], description: "Cloud-based EO analytics over multi-decadal archives, widely used for hydrological hazard monitoring.", url: "https://earthengine.google.com" },
];

export const HYDRO_INTEGRATION_APPROACHES: { approach: string; data: string; example: string; scale: string; performance: string }[] = [
  { approach: "Data-level fusion (pixel)", data: "Sentinel-1 SAR + Sentinel-2 optical", example: "Bihar (India) monsoon flood 2020 — paddy rice fields", scale: "Regional", performance: "+ Cloud/night-robust mapping; − limited by revisit/clouds." },
  { approach: "Feature-level fusion (indices)", data: "NDVI + LST + soil moisture (e.g. VHI, HiDRI)", example: "Brazil 2020–22 agricultural drought", scale: "National / Regional", performance: "+ Detects stress 2–4 weeks before yield loss; − coarse soil-moisture resolution." },
  { approach: "Decision-level fusion (model assimilation)", data: "SAR / optical + DEM + hydrological model", example: "EFAS LISFLOOD flood forecasting, Europe", scale: "Continental", performance: "+ >90% flood-depth accuracy; − DEM calibration critical." },
  { approach: "Cross-spectral integration", data: "Optical + microwave + thermal", example: "NASA GFMS global flood alerts", scale: "Global", performance: "+ Global near-real-time alerts; − coarse spatial detail." },
  { approach: "Multi-platform integration", data: "UAV + Sentinel-1 SAR", example: "Zhengzhou (China) urban flood 2021", scale: "Local", performance: "+ Sub-meter flood depth; − UAV deployment / weather restrictions." },
  { approach: "Multi-scale integration", data: "MODIS + Sentinel-2 + PlanetScope", example: "Central Asia 2021–23 drought monitoring", scale: "Regional", performance: "+ Balances temporal/spatial coverage; − data harmonisation needed." },
];

export const HYDRO_REFERENCE = {
  citation:
    "Guliyeva, S. & Boccardo, P. (2026). Geospatial Technologies for Flood and Drought Management: A Review of Earth Observation Data, Procedures, and their Operational Effectiveness. Aerotecnica Missili & Spazio.",
  doi: "10.1007/s42496-026-00309-4",
  url: "https://doi.org/10.1007/s42496-026-00309-4",
};

