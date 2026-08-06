// Hydrological hazards module — flood & drought
// Adapted from Guliyeva, S. & Boccardo, P. (2026). Geospatial Technologies for
// Flood and Drought Management: A Review of Earth Observation Data, Procedures,
// and their Operational Effectiveness. Aerotecnica Missili & Spazio.
// https://doi.org/10.1007/s42496-026-00309-4

import type { EOIndicator, EOSensorFamily, EOService } from "@/data/types";

export const EO_SENSOR_FAMILIES: EOSensorFamily[] = [
  {
    family: "Optical (VNIR / SWIR)",
    missions: [
      "MODIS",
      "VIIRS",
      "Landsat 8/9",
      "Sentinel-2",
      "PlanetScope",
      "Pléiades",
      "Gaofen-1",
      "UAV",
    ],
    resolution: "Low (250–1000 m, daily) · Moderate (30 m, 5–16 d) · High (<30 m, daily/on-demand)",
    roles: [
      { hazard: "drought", description: "Vegetation condition and stress (NDVI, VCI, VHI)." },
      {
        hazard: "flood",
        description:
          "Surface water and inundation mapping (NDWI, MNDWI); land-cover and damage assessment.",
      },
    ],
    scale: "Global to local",
    limitations: "Cloud and daylight dependency",
  },
  {
    family: "Thermal infrared (TIR)",
    missions: [
      "MODIS",
      "VIIRS",
      "Sentinel-3 SLSTR",
      "Landsat TIRS",
      "ASTER TIR",
      "ECOSTRESS",
      "GOES",
    ],
    resolution: "Low (375 m–1 km, daily) · Moderate (70–100 m, 4–16 d)",
    roles: [
      {
        hazard: "drought",
        description: "LST anomalies, evapotranspiration and canopy stress monitoring.",
      },
      {
        hazard: "flood",
        description: "Residual floodwater and soil-wetness detection via thermal contrast.",
      },
    ],
    scale: "Global to regional",
    limitations: "Coarse resolution; cloud and atmospheric effects",
  },
  {
    family: "Microwave — active SAR",
    missions: ["Sentinel-1", "RADARSAT-2", "TerraSAR-X", "COSMO-SkyMed", "ICEYE"],
    resolution: "High (1–20 m, 6–12 d or on-demand)",
    roles: [
      {
        hazard: "flood",
        description:
          "All-weather inundation mapping, flood duration and dynamics, levee breach and infrastructure impact.",
      },
    ],
    scale: "Regional to local",
    limitations: "Urban layover/shadow effects; cost of VHR data",
  },
  {
    family: "Microwave — passive radiometers",
    missions: ["SMAP", "SMOS", "AMSR-2", "GPM", "ASCAT", "GRACE / GRACE-FO"],
    resolution: "Low (5–50 km, sub-daily to multi-day)",
    roles: [
      {
        hazard: "drought",
        description: "Soil moisture deficit and groundwater storage anomalies.",
      },
      {
        hazard: "flood",
        description: "Precipitation forcing and basin-scale hydrological anomalies.",
      },
    ],
    scale: "Global to regional",
    limitations: "Very coarse resolution; limited local applicability",
  },
  {
    family: "LiDAR (laser altimetry)",
    missions: ["ICESat-2", "GEDI", "SWOT", "Airborne / UAV LiDAR", "Mobile LiDAR (MMS)"],
    resolution: "High (cm–m, on-demand) · Moderate–low (50–250 m, 10–90 d)",
    roles: [
      {
        hazard: "flood",
        description:
          "High-resolution DEMs, flood depth and hydraulic modelling; detailed post-event damage mapping.",
      },
      { hazard: "drought", description: "Vegetation structure and biomass loss assessment." },
    ],
    scale: "Regional to local",
    limitations: "Cost, weather sensitivity, limited temporal coverage",
  },
];

export const EO_INDICATORS: EOIndicator[] = [
  {
    group: "Hydrological",
    indicator: "Soil moisture anomaly",
    flood: "Rapid saturation detection",
    drought: "Early deficit detection",
    sources: ["SMAP", "SMOS", "AMSR-2", "Sentinel-1", "H SAF NRT SM/RZSM"],
  },
  {
    group: "Hydrological",
    indicator: "Surface water extent anomaly",
    flood: "Inundation delineation",
    drought: "Reservoir / lake shrinkage",
    sources: ["Sentinel-1", "Sentinel-2", "Landsat", "MODIS"],
  },
  {
    group: "Hydrological",
    indicator: "Water level anomaly",
    flood: "Rising river / lake stage",
    drought: "Declining water levels",
    sources: ["Sentinel-3", "Jason-2/3", "SWOT"],
  },
  {
    group: "Hydrological",
    indicator: "Total Water Storage (TWS) anomaly",
    flood: null,
    drought: "Groundwater depletion",
    sources: ["GRACE", "GRACE-FO"],
  },
  {
    group: "Hydrological",
    indicator: "Snow Water Equivalent (SWE) anomaly",
    flood: "Snowmelt-induced floods",
    drought: "Reduced snowpack",
    sources: ["AMSR-2 SWE", "MODIS"],
  },
  {
    group: "Biophysical",
    indicator: "NDVI anomaly · VCI / VHI",
    flood: "Post-flood vegetation impact",
    drought: "Canopy stress detection",
    sources: ["MODIS", "AVHRR", "VIIRS", "Sentinel-2"],
  },
  {
    group: "Biophysical",
    indicator: "LST anomaly · Evaporative Stress Index (ESI)",
    flood: "Cooling over floodwater",
    drought: "High LST & low ET",
    sources: ["MODIS LST", "ECOSTRESS"],
  },
  {
    group: "Biophysical",
    indicator: "Solar-Induced Chlorophyll Fluorescence (SIF)",
    flood: null,
    drought: "Early physiological stress",
    sources: ["OCO-2 / OCO-3", "Sentinel-5P"],
  },
  {
    group: "Meteorological",
    indicator: "Precipitation anomaly (SPI / SPEI)",
    flood: "Wet anomaly / triggering rainfall",
    drought: "Dry anomaly",
    sources: ["GPM", "TRMM", "ERA5"],
  },
  {
    group: "Meteorological",
    indicator: "Temperature anomaly / heat stress",
    flood: null,
    drought: "Heat-induced stress",
    sources: ["MODIS", "ERA5"],
  },
];

export const EO_HYDRO_SERVICES: EOService[] = [
  {
    name: "Copernicus Emergency Management Service (CEMS)",
    scope: "Regional",
    hazards: ["flood"],
    description:
      "On-demand rapid mapping and risk & recovery products supporting civil protection across Europe and globally.",
    url: "https://emergency.copernicus.eu",
  },
  {
    name: "Global Flood Awareness System (GloFAS)",
    scope: "Global",
    hazards: ["flood"],
    description:
      "Operational flood forecasts integrating hydrological and meteorological inputs at global scale.",
    url: "https://global-flood.emergency.copernicus.eu",
  },
  {
    name: "European Flood Awareness System (EFAS / LISFLOOD)",
    scope: "Regional",
    hazards: ["flood"],
    description:
      "Continental flood early warning combining SAR, DEMs and meteorological forcings via the LISFLOOD model.",
    url: "https://www.efas.eu",
  },
  {
    name: "European Drought Observatory (EDO)",
    scope: "Regional",
    hazards: ["drought"],
    description:
      "Combined drought indicators (SPI, soil moisture, VHI) for monitoring and early warning across Europe.",
    url: "https://edo.jrc.ec.europa.eu",
  },
  {
    name: "NASA Global Flood Monitoring System (GFMS)",
    scope: "Global",
    hazards: ["flood"],
    description:
      "Cross-spectral integration (optical + microwave + thermal) generating near-real-time global flood alerts.",
    url: "https://flood.umd.edu",
  },
  {
    name: "EUMETSAT H SAF",
    scope: "Regional",
    hazards: ["flood", "drought"],
    description:
      "Operational hydrology products (precipitation, soil moisture, snow) supporting national hydromet services.",
    url: "https://hsaf.meteoam.it",
  },
  {
    name: "Google Earth Engine (GEE)",
    scope: "Global",
    hazards: ["flood", "drought"],
    description:
      "Cloud-based EO analytics over multi-decadal archives, widely used for hydrological hazard monitoring.",
    url: "https://earthengine.google.com",
  },
];

export const HYDRO_INTEGRATION_APPROACHES: {
  approach: string;
  data: string;
  example: string;
  scale: string;
  performance: string;
}[] = [
  {
    approach: "Data-level fusion (pixel)",
    data: "Sentinel-1 SAR + Sentinel-2 optical",
    example: "Bihar (India) monsoon flood 2020 — paddy rice fields",
    scale: "Regional",
    performance: "+ Cloud/night-robust mapping; − limited by revisit/clouds.",
  },
  {
    approach: "Feature-level fusion (indices)",
    data: "NDVI + LST + soil moisture (e.g. VHI, HiDRI)",
    example: "Brazil 2020–22 agricultural drought",
    scale: "National / Regional",
    performance: "+ Detects stress 2–4 weeks before yield loss; − coarse soil-moisture resolution.",
  },
  {
    approach: "Decision-level fusion (model assimilation)",
    data: "SAR / optical + DEM + hydrological model",
    example: "EFAS LISFLOOD flood forecasting, Europe",
    scale: "Continental",
    performance: "+ >90% flood-depth accuracy; − DEM calibration critical.",
  },
  {
    approach: "Cross-spectral integration",
    data: "Optical + microwave + thermal",
    example: "NASA GFMS global flood alerts",
    scale: "Global",
    performance: "+ Global near-real-time alerts; − coarse spatial detail.",
  },
  {
    approach: "Multi-platform integration",
    data: "UAV + Sentinel-1 SAR",
    example: "Zhengzhou (China) urban flood 2021",
    scale: "Local",
    performance: "+ Sub-meter flood depth; − UAV deployment / weather restrictions.",
  },
  {
    approach: "Multi-scale integration",
    data: "MODIS + Sentinel-2 + PlanetScope",
    example: "Central Asia 2021–23 drought monitoring",
    scale: "Regional",
    performance: "+ Balances temporal/spatial coverage; − data harmonisation needed.",
  },
];

export const HYDRO_REFERENCE = {
  citation:
    "Guliyeva, S. & Boccardo, P. (2026). Geospatial Technologies for Flood and Drought Management: A Review of Earth Observation Data, Procedures, and their Operational Effectiveness. Aerotecnica Missili & Spazio.",
  doi: "10.1007/s42496-026-00309-4",
  url: "https://doi.org/10.1007/s42496-026-00309-4",
};
