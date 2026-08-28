import type { Dataset, ImplementationLevel, Priority, SourceType } from "@/data/types";

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
  satellite: {
    provider: "ESA / Copernicus / NASA",
    resolution: "10–1000 m, daily to monthly revisit",
    access: "Open access (Copernicus / Earthdata)",
  },
  ground: {
    provider: "National agency or municipality",
    resolution: "Point measurements, sub-hourly to daily",
    access: "Open data portal or API (varies)",
  },
  "open-data": {
    provider: "EU / international open data initiative",
    resolution: "Variable",
    access: "Open access download or API",
  },
  administrative: {
    provider: "Local or national authority",
    resolution: "Administrative units, annual updates",
    access: "Restricted or on request",
  },
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
    D(
      "Tropospheric NO₂ & Aerosol Concentrations",
      "Satellite-derived pollutant concentrations at city scale.",
      "satellite",
      "essential",
      ["Sentinel-5P TROPOMI", "Copernicus CAMS"],
    ),
    D(
      "Ground-Based Air Quality Stations",
      "Reference measurements of PM2.5, PM10, NO₂, O₃.",
      "ground",
      "essential",
      ["EEA AirBase", "Local AQ networks"],
    ),
    D(
      "Low-Cost Sensor Networks",
      "Distributed PM and gas sensors for hyperlocal mapping.",
      "ground",
      "recommended",
      ["PurpleAir", "Municipal IoT networks"],
    ),
    D(
      "Traffic & Emission Inventories",
      "Activity data driving urban emission models.",
      "administrative",
      "recommended",
      ["EMEP/EEA inventories", "Local transport data"],
    ),
  ],
  "urban-emissions": [
    D(
      "CO₂ & CH₄ Column Concentrations",
      "Satellite observations of greenhouse gas plumes.",
      "satellite",
      "essential",
      ["Sentinel-5P", "GOSAT", "Copernicus CO2M (upcoming)"],
    ),
    D(
      "Energy Consumption by Sector",
      "Buildings, industry, transport energy use.",
      "administrative",
      "essential",
      ["Municipal energy registers", "DSO data"],
    ),
    D(
      "Emission Inventory Database",
      "Sector-resolved emission factors.",
      "open-data",
      "recommended",
      ["EDGAR", "EMEP/EEA"],
    ),
  ],
  pollution: [
    D(
      "Multi-Pollutant Satellite Products",
      "Atmospheric, water and soil contamination indicators.",
      "satellite",
      "essential",
      ["Sentinel-5P", "Sentinel-2/3", "CAMS"],
    ),
    D(
      "Soil & Water Quality Surveys",
      "Ground sampling for heavy metals and nutrients.",
      "ground",
      "recommended",
      ["LUCAS Soil", "WISE WFD"],
    ),
    D(
      "Industrial Emission Registers",
      "Reported emissions from regulated facilities.",
      "administrative",
      "recommended",
      ["E-PRTR"],
    ),
  ],
  "flood-risk": [
    D(
      "High-Resolution Digital Elevation Model (DEM/DTM)",
      "Bare-earth terrain model driving 1D/2D hydraulic and inundation models. LiDAR-derived DTMs significantly improve depth and extent accuracy.",
      "satellite",
      "essential",
      ["Copernicus DEM (GLO-30 / EEA-10)", "National LiDAR DTMs", "ICESat-2", "SWOT"],
      {
        provider: "ESA / National mapping agencies",
        resolution: "1–30 m, episodic updates",
        access: "Open access (Copernicus) / national open data",
      },
    ),
    D(
      "SAR Inundation Mapping (All-Weather)",
      "Cloud- and night-independent flood extent mapping during emergencies, including levee breach and infrastructure impact detection.",
      "satellite",
      "essential",
      ["Sentinel-1 SAR", "COSMO-SkyMed", "TerraSAR-X", "ICEYE", "RADARSAT-2"],
      {
        provider: "ESA Copernicus / ASI / DLR",
        resolution: "1–20 m, 6–12 d revisit (on-demand for VHR)",
        access: "Open (Sentinel-1) / commercial (VHR)",
      },
    ),
    D(
      "Optical Surface Water & Damage Imagery",
      "High-resolution optical imagery for inundation delineation (NDWI/MNDWI) and post-event damage assessment in cloud-free conditions.",
      "satellite",
      "essential",
      ["Sentinel-2", "Landsat 8/9", "PlanetScope", "Pléiades", "Gaofen-1", "UAV optical"],
    ),
    D(
      "Satellite Precipitation & Hydrological Records",
      "Near-real-time rainfall, river discharge and soil moisture for forcing flood early warning systems and hydrological models.",
      "ground",
      "essential",
      [
        "GPM IMERG",
        "GSMaP",
        "National hydromet rain gauges & radar",
        "Copernicus EMS",
        "GloFAS / EFAS",
      ],
      {
        provider: "NASA / JAXA / ECMWF / national agencies",
        resolution: "0.1° satellite; sub-hourly gauges",
        access: "Open (NASA, ECMWF, Copernicus)",
      },
    ),
    D(
      "Flood Hazard & Risk Maps",
      "Modelled inundation extents and probabilities for return periods (10/100/500-yr) under EU Floods Directive 2007/60/EC.",
      "open-data",
      "essential",
      ["EU Floods Directive maps", "JRC GloFAS", "EFAS LISFLOOD"],
    ),
    D(
      "Soil Moisture Anomaly Products",
      "Pre-event antecedent wetness for runoff forecasting; rapid saturation detection signals reduced infiltration capacity.",
      "satellite",
      "recommended",
      ["SMAP", "SMOS", "ASCAT", "H SAF NRT SM/RZSM", "Sentinel-1 derived"],
      {
        provider: "ESA / NASA / EUMETSAT H SAF",
        resolution: "1–50 km, sub-daily to daily",
        access: "Open access (Copernicus / Earthdata / H SAF)",
      },
    ),
    D(
      "Land Cover & Imperviousness",
      "Surface runoff coefficients and exposure layer for urban hydrological models.",
      "satellite",
      "recommended",
      ["Copernicus HRL Imperviousness", "Urban Atlas", "CLC+"],
    ),
    D(
      "Critical Infrastructure & Exposure Layer",
      "Hospitals, shelters, lifelines, ground-floor elevations supporting impact and evacuation planning.",
      "administrative",
      "recommended",
      ["Municipal asset registers", "Mobile LiDAR (MMS) building elevations"],
    ),
    D(
      "UAV Rapid Mapping (Local)",
      "Centimetre-scale flood extent and depth in dense urban environments for tactical response and recovery.",
      "ground",
      "optional",
      ["UAV optical surveys", "UAV LiDAR"],
      {
        provider: "Municipal / civil protection / contractor",
        resolution: "cm–dm, on-demand",
        access: "Owned / commissioned",
      },
    ),
  ],
  "disaster-response": [
    D(
      "Rapid Mapping Imagery",
      "On-demand high-resolution imagery for emergencies.",
      "satellite",
      "essential",
      ["Copernicus EMS Rapid Mapping", "International Charter"],
    ),
    D(
      "Critical Infrastructure Inventory",
      "Hospitals, shelters, lifelines geolocated.",
      "administrative",
      "essential",
      ["Municipal asset registers"],
    ),
    D(
      "Real-Time Sensor Feeds",
      "Hydrological, seismic and meteorological alerts.",
      "ground",
      "recommended",
      ["National civil protection networks"],
    ),
  ],
  "climate-resilience": [
    D(
      "Climate Projections (Downscaled)",
      "Regional CORDEX scenarios for impact assessment.",
      "open-data",
      "essential",
      ["Copernicus C3S CDS", "EURO-CORDEX"],
    ),
    D(
      "Historical Climate Reanalysis",
      "Multi-decadal temperature and precipitation records.",
      "open-data",
      "essential",
      ["ERA5", "UERRA"],
    ),
    D(
      "Vulnerability & Exposure Indicators",
      "Socio-demographic and infrastructure exposure data.",
      "administrative",
      "recommended",
      ["Eurostat", "Census data"],
    ),
  ],
  uhi: [
    D(
      "Land Surface Temperature (LST)",
      "Thermal satellite data revealing heat hotspots.",
      "satellite",
      "essential",
      ["Landsat 8/9 TIRS", "ECOSTRESS", "Sentinel-3 SLSTR"],
    ),
    D(
      "Urban Morphology & Building Heights",
      "3D city models and SVF for microclimate analysis.",
      "open-data",
      "essential",
      ["Copernicus Urban Atlas", "OSM 3D", "national 3D registers"],
    ),
    D(
      "Surface Albedo & Imperviousness",
      "Reflectivity and sealed surface fractions.",
      "satellite",
      "recommended",
      ["Sentinel-2", "Copernicus HRL"],
    ),
    D("Air Temperature Sensor Network", "Ground microclimate stations.", "ground", "recommended", [
      "Municipal weather networks",
      "Citizen weather stations",
    ]),
  ],
  "thermal-comfort": [
    D(
      "Land Surface Temperature & Humidity",
      "Inputs for UTCI / PET comfort indices.",
      "satellite",
      "essential",
      ["Landsat", "Sentinel-3", "ERA5-Land"],
    ),
    D(
      "Urban Tree Canopy & Shade Maps",
      "Canopy cover supporting cooling strategies.",
      "satellite",
      "recommended",
      ["Sentinel-2", "Aerial LiDAR"],
    ),
    D(
      "Pedestrian Microclimate Sensors",
      "Street-level temperature and radiation.",
      "ground",
      "optional",
      ["Research/IoT deployments"],
    ),
  ],
  stormwater: [
    D(
      "High-Resolution DEM & Drainage Network",
      "Detailed terrain plus pipe/channel inventory.",
      "administrative",
      "essential",
      ["Utility GIS", "LiDAR DTM"],
    ),
    D("Imperviousness & Land Cover", "Surface runoff coefficients.", "satellite", "essential", [
      "Copernicus HRL Imperviousness",
    ]),
    D(
      "Rainfall Radar & Gauges",
      "High-frequency precipitation for urban runoff.",
      "ground",
      "recommended",
      ["National radar networks"],
    ),
  ],
  "water-resources": [
    D(
      "Surface Water Extent & Quality",
      "Reservoir levels, turbidity, chlorophyll.",
      "satellite",
      "essential",
      ["Sentinel-2", "Sentinel-3 OLCI"],
    ),
    D(
      "Groundwater Monitoring Wells",
      "Aquifer level and quality measurements.",
      "ground",
      "essential",
      ["National hydrogeological services"],
    ),
    D(
      "Water Supply & Consumption Records",
      "Utility metering data.",
      "administrative",
      "recommended",
      ["Water utilities"],
    ),
  ],
  drought: [
    D(
      "Soil Moisture & Root-Zone Anomalies",
      "Early deficit detection — passive microwave soil moisture frequently anticipates vegetation stress by several weeks (extending forecast lead times).",
      "satellite",
      "essential",
      ["SMAP", "SMOS", "ASCAT", "AMSR-2", "H SAF NRT SM/RZSM"],
      {
        provider: "NASA / ESA / EUMETSAT H SAF",
        resolution: "5–50 km, sub-daily to daily",
        access: "Open access",
      },
    ),
    D(
      "Vegetation Condition Indices (NDVI / VCI / VHI)",
      "Canopy stress detection at field to regional scale; NDVI time series enables retrospective drought-impact analysis.",
      "satellite",
      "essential",
      ["MODIS", "VIIRS", "AVHRR", "Sentinel-2", "Landsat 8/9"],
      {
        provider: "NASA / ESA / NOAA",
        resolution: "10–1000 m, daily to 16-day",
        access: "Open access (Earthdata / Copernicus)",
      },
    ),
    D(
      "Land Surface Temperature & Evaporative Stress (ESI)",
      "Thermal anomalies and evapotranspiration deficits — ECOSTRESS-derived ESI has detected drought onset ~2 weeks before SPI.",
      "satellite",
      "essential",
      ["ECOSTRESS", "MODIS LST", "Landsat TIRS", "Sentinel-3 SLSTR"],
      { provider: "NASA / ESA", resolution: "70 m – 1 km, daily to 16-day", access: "Open access" },
    ),
    D(
      "Standardized Precipitation Indices (SPI / SPEI)",
      "Meteorological drought indicators combining satellite precipitation and reanalysis temperature for severity classification.",
      "open-data",
      "essential",
      ["Copernicus EDO", "GPM IMERG", "ERA5", "C3S CDS"],
    ),
    D(
      "Total Water Storage Anomalies",
      "Groundwater depletion and basin-scale water loss signals from gravimetric satellite missions.",
      "satellite",
      "recommended",
      ["GRACE", "GRACE-FO"],
      { provider: "NASA / DLR", resolution: "~300 km, monthly", access: "Open access" },
    ),
    D(
      "Surface Water Extent (Reservoirs & Lakes)",
      "Long-term monitoring of reservoir and lake shrinkage as a hydrological drought signal.",
      "satellite",
      "recommended",
      ["Sentinel-2", "Sentinel-1 SAR", "Landsat", "Sentinel-3 / Jason-3 / SWOT altimetry"],
    ),
    D(
      "Solar-Induced Chlorophyll Fluorescence (SIF)",
      "Highly sensitive early indicator of physiological plant stress, often preceding NDVI anomalies.",
      "satellite",
      "optional",
      ["Sentinel-5P", "OCO-2 / OCO-3"],
      { provider: "ESA / NASA", resolution: "3.5–7 km, daily", access: "Open access" },
    ),
    D(
      "Ground Soil Moisture & Agro-Meteorological Network",
      "In-situ validation network supporting calibration of satellite products and operational drought bulletins.",
      "ground",
      "recommended",
      ["National agro-meteorological networks", "ISMN", "Local irrigation district sensors"],
    ),
  ],
  "green-infra": [
    D(
      "Urban Tree Canopy & Green Space Maps",
      "Vegetation cover and connectivity.",
      "satellite",
      "essential",
      ["Sentinel-2 NDVI", "Copernicus Urban Atlas Street Tree Layer"],
    ),
    D(
      "Land Cover & Permeability",
      "Sealed vs vegetated surface distribution.",
      "satellite",
      "recommended",
      ["Copernicus HRL"],
    ),
    D(
      "Park & Green Asset Inventory",
      "Municipally managed green areas.",
      "administrative",
      "recommended",
      ["Municipal cadastres"],
    ),
  ],
  biodiversity: [
    D(
      "Habitat & Land Cover Mapping",
      "Ecosystem distribution within the urban matrix.",
      "satellite",
      "essential",
      ["Copernicus Land Cover", "EUNIS"],
    ),
    D("Species Occurrence Data", "Citizen science and surveys.", "open-data", "recommended", [
      "GBIF",
      "iNaturalist",
    ]),
  ],
  nbs: [
    D(
      "Vegetation Indices Time Series",
      "Tracking NBS performance over seasons.",
      "satellite",
      "essential",
      ["Sentinel-2 NDVI/EVI"],
    ),
    D(
      "Site-Level Monitoring Sensors",
      "Soil moisture, runoff, temperature at NBS sites.",
      "ground",
      "recommended",
      ["Project IoT networks"],
    ),
    D(
      "NBS Project Registry",
      "Geolocated catalogue of interventions.",
      "administrative",
      "recommended",
      ["Municipal/EU project registers"],
    ),
  ],
  "land-use": [
    D(
      "Land Cover / Land Use Change",
      "Multi-temporal classification of urban change.",
      "satellite",
      "essential",
      ["Copernicus CLC+", "Urban Atlas", "Sentinel-2"],
    ),
    D(
      "Cadastral & Zoning Data",
      "Legal land use boundaries and regulations.",
      "administrative",
      "essential",
      ["National cadastres"],
    ),
    D("Building Footprints", "Up-to-date building inventory.", "open-data", "recommended", [
      "OpenStreetMap",
      "Microsoft/Google footprints",
    ]),
  ],
  regeneration: [
    D(
      "Building Age & Condition Records",
      "Inputs for renovation prioritisation.",
      "administrative",
      "essential",
      ["Cadastres", "Energy performance registers"],
    ),
    D(
      "3D City Model",
      "Massing and density for regeneration scenarios.",
      "open-data",
      "recommended",
      ["CityGML datasets", "national 3D registers"],
    ),
  ],
  "spatial-planning": [
    D(
      "Integrated Land Use & Demographics",
      "Combined planning and population data.",
      "administrative",
      "essential",
      ["Eurostat", "National statistical offices"],
    ),
    D(
      "Accessibility & Service Coverage",
      "Walkability and proximity indicators.",
      "open-data",
      "recommended",
      ["OSM-based isochrones"],
    ),
  ],
  "transport-emissions": [
    D(
      "NO₂ & CO₂ Satellite Observations",
      "Traffic-related emission proxies.",
      "satellite",
      "essential",
      ["Sentinel-5P", "CAMS"],
    ),
    D(
      "Traffic Counts & Fleet Composition",
      "Activity data for emission modelling.",
      "administrative",
      "essential",
      ["Municipal traffic systems", "Vehicle registries"],
    ),
    D("Floating Car / Telematics Data", "Real-world driving patterns.", "ground", "recommended", [
      "Telematics providers",
    ]),
  ],
  "sustainable-mobility": [
    D(
      "Multimodal Transport Network",
      "Roads, transit, cycling and walking layers.",
      "open-data",
      "essential",
      ["GTFS feeds", "OpenStreetMap"],
    ),
    D("Active Mobility Counters", "Bike and pedestrian flow sensors.", "ground", "recommended", [
      "Municipal counters",
    ]),
  ],
  "traffic-flows": [
    D("Real-Time Traffic Feeds", "Speed, volume and incident data.", "ground", "essential", [
      "DATEX II feeds",
      "Municipal ITS",
    ]),
    D("Road Network Topology", "Routable network for simulation.", "open-data", "essential", [
      "OpenStreetMap",
      "National road registers",
    ]),
  ],
  "carbon-footprint": [
    D(
      "Sectoral GHG Inventory",
      "Buildings, transport, waste, industry emissions.",
      "administrative",
      "essential",
      ["GPC-compliant inventories", "CDP-ICLEI Track"],
    ),
    D(
      "Atmospheric GHG Observations",
      "Independent verification of emissions.",
      "satellite",
      "recommended",
      ["Sentinel-5P", "Copernicus CO2M"],
    ),
    D("Energy Consumption Data", "Sector-resolved energy use.", "administrative", "essential", [
      "DSO/utility data",
    ]),
  ],
  "renewable-energy": [
    D(
      "Renewable Energy & Grid Data",
      "Generation, storage and grid mix.",
      "administrative",
      "recommended",
      ["TSO/DSO open data"],
    ),
    D(
      "Solar Irradiance & Rooftop Potential",
      "Surface-level solar resource mapping for rooftop and ground-mounted PV siting.",
      "satellite",
      "essential",
      ["Copernicus Atmosphere Monitoring Service", "PVGIS"],
    ),
    D(
      "Geothermal & Building-Level Energy Atlas",
      "Building energy demand and geothermal potential by depth.",
      "administrative",
      "recommended",
      ["National geothermal registers", "Municipal energy atlases"],
    ),
  ],
  "energy-efficiency": [
    D(
      "Building Energy Performance Certificates",
      "Consumption, heating systems and retrofit status by building.",
      "administrative",
      "essential",
      ["National EPC registers", "Municipal building databases"],
    ),
    D(
      "Land Surface Temperature (Building-Scale)",
      "Thermal anomalies indicating heat loss and retrofit priority.",
      "satellite",
      "recommended",
      ["Landsat 8/9 TIRS", "Airborne thermal survey"],
    ),
    D(
      "Smart Meter Consumption Data",
      "Sub-daily electricity and gas consumption by sector.",
      "ground",
      "optional",
      ["DSO smart meter feeds"],
    ),
  ],
  "wastewater-sanitation": [
    D(
      "Sewer & Wastewater Network Maps",
      "Network topology, capacity and treatment plant locations.",
      "administrative",
      "essential",
      ["Municipal utility registers"],
    ),
    D(
      "Wastewater Treatment Performance Data",
      "Effluent quality and treatment plant load.",
      "administrative",
      "recommended",
      ["National environmental agency reporting"],
    ),
    D(
      "Combined Sewer Overflow Monitoring",
      "Overflow event frequency and volume, linked to rainfall.",
      "ground",
      "optional",
      ["Utility SCADA/telemetry"],
    ),
  ],
  "early-warning": [
    D(
      "Multi-Hazard Alert Feeds",
      "Real-time hazard notifications for flood, storm and heat.",
      "open-data",
      "essential",
      ["Copernicus Emergency Management Service", "National meteorological services"],
    ),
    D(
      "Weather Radar & Nowcasting",
      "Short-range precipitation forecasting for rapid-onset events.",
      "satellite",
      "recommended",
      ["EUMETSAT", "National radar networks"],
    ),
    D(
      "Population & Asset Exposure Layers",
      "Who and what is exposed within alert zones.",
      "administrative",
      "recommended",
      ["Census grids", "Building registers"],
    ),
  ],
  "public-safety": [
    D(
      "Incident & Crime Reporting Data",
      "Geolocated incident records for spatial risk analysis.",
      "administrative",
      "essential",
      ["Municipal/police open data portals"],
    ),
    D(
      "Public Lighting & CCTV Coverage",
      "Streetlight and camera coverage informing safety planning.",
      "administrative",
      "recommended",
      ["Municipal asset registers"],
    ),
    D(
      "Footfall & Public Space Usage",
      "Pedestrian activity patterns for risk-informed design.",
      "ground",
      "optional",
      ["Municipal mobility counters"],
    ),
  ],
  "critical-infrastructure": [
    D(
      "Critical Infrastructure Asset Register",
      "Locations and interdependencies of key facilities.",
      "administrative",
      "essential",
      ["National critical infrastructure inventories"],
    ),
    D(
      "Infrastructure Exposure to Hazards",
      "Overlay of assets with flood, heat and seismic hazard layers.",
      "open-data",
      "recommended",
      ["Copernicus hazard layers", "National risk atlases"],
    ),
    D(
      "Network Redundancy & Downtime Records",
      "Historical outage data for resilience assessment.",
      "administrative",
      "optional",
      ["Utility incident logs"],
    ),
  ],
  "emergency-coordination": [
    D(
      "Emergency Services Facility Locations",
      "Police, fire, ambulance and hospital coverage areas.",
      "administrative",
      "essential",
      ["Municipal/regional civil protection registers"],
    ),
    D(
      "Real-Time Situational Awareness Feeds",
      "Live incident, traffic and hazard data for dispatch coordination.",
      "ground",
      "recommended",
      ["Emergency CAD systems", "Traffic management centres"],
    ),
    D(
      "Response Time & Coverage Analysis",
      "Historical response times against service-area targets.",
      "administrative",
      "optional",
      ["Civil protection performance records"],
    ),
  ],
  "healthcare-access": [
    D(
      "Healthcare Facility Locations & Capacity",
      "Hospitals, clinics and their catchment capacity.",
      "administrative",
      "essential",
      ["National health facility registers"],
    ),
    D(
      "Population Demographics & Density",
      "Age structure and density for accessibility modelling.",
      "open-data",
      "essential",
      ["National census", "Eurostat"],
    ),
    D(
      "Transport Accessibility to Care",
      "Travel time to nearest facility by mode.",
      "open-data",
      "recommended",
      ["OpenStreetMap routing", "GTFS transit feeds"],
    ),
  ],
  "social-vulnerability": [
    D(
      "Socio-Economic Vulnerability Indices",
      "Income, age, housing quality and deprivation indicators.",
      "open-data",
      "essential",
      ["Eurostat", "National statistical offices"],
    ),
    D(
      "Vulnerable Facility Locations",
      "Schools, elderly care and social housing needing priority protection.",
      "administrative",
      "essential",
      ["Municipal facility registers"],
    ),
    D(
      "Environmental Exposure Overlay",
      "Heat, flood and air-quality exposure cross-referenced with vulnerability.",
      "satellite",
      "recommended",
      ["Combined LST / AQ / flood layers"],
    ),
  ],
};

function priorityRank(p: Priority): number {
  return p === "essential" ? 0 : p === "recommended" ? 1 : 2;
}

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

  if (level === "status") {
    datasets = datasets.filter((d) => d.priority === "essential" || d.source === "open-data");
  } else if (level === "informative") {
    datasets = datasets.filter((d) => d.priority !== "optional");
  }
  // predictive, optimisation and autonomous levels draw on the full dataset pool;
  // what distinguishes them is analytical/governance capacity, not data breadth
  // (see LEVEL_DESCRIPTIONS — consistent with Masoumi et al., 2023, who note that
  // higher-maturity twins are differentiated less by which data they hold than by
  // what they do with it).

  return datasets
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .map(enrichDataset);
}

// Technical Maturity Levels, as used in the author's related Urban Digital Twin
// survey instrument (national and subnational government questionnaires),
// broadly consistent with the maturity staging described in the wider
// literature (e.g. Liu et al., 2024; Masoumi et al., 2023).
export const LEVEL_DESCRIPTIONS: Record<
  ImplementationLevel,
  {
    title: string;
    short: string;
    capable: string[];
    missing: string[];
    nextSteps: string[];
  }
> = {
  status: {
    title: "Level 1 — Static Digital Model",
    short:
      "Provides 3D or 2D visualization with limited analytics; relies on mostly static data and is used primarily for basic visualization and communication.",
    capable: [
      "Visualise the city in 2D/3D using open base maps and building footprints.",
      "Overlay static or periodically refreshed environmental layers (e.g. land cover, basic air quality).",
      "Communicate baseline diagnostics to decision-makers and the public.",
    ],
    missing: [
      "Any continuous or automated data connection to real-world conditions.",
      "Analytical or modelling capacity beyond visualisation.",
      "Interoperability across municipal departments.",
    ],
    nextSteps: [
      "Establish a data governance framework and metadata catalogue.",
      "Begin periodic ingestion of Copernicus and national open datasets.",
      "Pilot one thematic use case (e.g. heat islands or flood risk).",
    ],
  },
  informative: {
    title: "Level 2 — Analytical Digital Twin",
    short:
      "Integrates multiple datasets and leverages dashboards and analytics to perform limited scenario analysis.",
    capable: [
      "Update environmental layers on a regular cadence (daily to monthly).",
      "Integrate data across several institutional and open sources for a given domain.",
      "Run descriptive analytics, dashboards and trend monitoring.",
    ],
    missing: [
      "Real-time or near-real-time data fusion.",
      "Forecasting or predictive modelling capacity.",
      "Standardised APIs aligned with international interoperability frameworks.",
    ],
    nextSteps: [
      "Deploy a city data platform with standardised APIs (e.g. OGC, FIWARE).",
      "Begin piloting predictive analytics for one priority domain.",
      "Formalise cross-departmental data-sharing agreements.",
    ],
  },
  predictive: {
    title: "Level 3 — Predictive Digital Twin",
    short:
      "Incorporates predictive modeling, forecasting, or simulation of urban systems and trends.",
    capable: [
      "Fuse satellite, sensor and administrative data in near real-time.",
      "Run forecasting and scenario-testing models for priority domains.",
      "Support early-warning and situational-awareness functions.",
    ],
    missing: [
      "Logic that translates forecasts into recommended actions (prescriptive capacity).",
      "Two-way interaction with physical urban systems.",
      "Continuous validation against ground truth and uncertainty quantification.",
    ],
    nextSteps: [
      "Develop AI/ML forecasting models for priority objectives.",
      "Build decision-support views that turn forecasts into option sets for planners.",
      "Establish a validation routine against ground-truth or independent reference data.",
    ],
  },
  optimisation: {
    title: "Level 4 — Prescriptive Digital Twin",
    short:
      "Employs advanced simulations and scenario planning specifically designed to support policy or operational decisions.",
    capable: [
      "Run AI/ML models for optimisation and anomaly detection across domains.",
      "Generate prescriptive recommendations to support policy and operational decisions.",
      "Trigger automated alerts or limited actuation in selected systems.",
    ],
    missing: [
      "Full closed-loop automation across all connected systems.",
      "Long-term funding and technical-skills sustainability.",
      "Citizen-facing transparency and participatory layers.",
    ],
    nextSteps: [
      "Institutionalise the twin as core municipal infrastructure.",
      "Extend interoperability with regional and national data spaces.",
      "Embed ethical-AI, transparency and citizen-engagement mechanisms.",
    ],
  },
  autonomous: {
    title: "Level 5 — Autonomous Digital Twin",
    short:
      "Features real-time data integration, artificial intelligence (AI), and automated decision support to trigger interventions.",
    capable: [
      "Operate continuous bidirectional physical–digital feedback loops.",
      "Autonomously adjust selected operational systems within governed limits.",
      "Self-monitor performance and recalibrate underlying models over time.",
    ],
    missing: [
      "Full-scale deployment remains rare even among leading global cities.",
      "Mature governance, liability and public-trust frameworks for autonomous actuation.",
    ],
    nextSteps: [
      "Establish clear governance and liability frameworks before enabling autonomous actuation.",
      "Pilot autonomous control in low-risk domains before scaling further.",
      "Maintain human-in-the-loop oversight and override mechanisms at all times.",
    ],
  },
};
