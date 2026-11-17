// Direct links to the portals where each dataset can be found.
// Sources of the addresses: the author's two reviews (Destefanis et al., 2025, reference list;
// Guliyeva & Boccardo, 2026) and the platform list already used in this tool. Deep links were
// kept only where the page was confirmed; otherwise the link points to the portal itself.
export interface DataLink {
  label: string;
  url: string;
}

const L = {
  cdse: {
    label: "Copernicus Data Space (Sentinel-1/2/3)",
    url: "https://dataspace.copernicus.eu/browser/",
  },
  dem: {
    label: "Copernicus DEM (30 m)",
    url: "https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM",
  },
  clms: {
    label: "Copernicus Land Monitoring Service",
    url: "https://land.copernicus.eu/en/products",
  },
  clmsVeg: {
    label: "Copernicus Land: vegetation products",
    url: "https://land.copernicus.eu/en/products/vegetation",
  },
  gdo: {
    label: "Copernicus Global Drought Observatory",
    url: "https://drought.emergency.copernicus.eu",
  },
  cems: {
    label: "Copernicus Emergency: rapid mapping",
    url: "https://mapping.emergency.copernicus.eu/activations/",
  },
  gfm: {
    label: "Global Flood Monitoring (GloFAS-GFM)",
    url: "https://global-flood.emergency.copernicus.eu/technical-information/glofas-gfm/",
  },
  cds: { label: "Copernicus Climate Data Store", url: "https://cds.climate.copernicus.eu/" },
  earthdata: {
    label: "NASA Earthdata (MODIS, SMAP, GRACE, ECOSTRESS)",
    url: "https://search.earthdata.nasa.gov/",
  },
  usgs: { label: "USGS EarthExplorer (Landsat)", url: "https://earthexplorer.usgs.gov/" },
  imerg: { label: "NASA GPM IMERG rainfall", url: "https://gpm.nasa.gov/data/imerg" },
  dfo: { label: "Dartmouth Flood Observatory", url: "https://floodobservatory.colorado.edu/" },
} satisfies Record<string, DataLink>;

export const DATASET_LINKS: Record<string, DataLink[]> = {
  "High-Resolution Digital Elevation Model (DEM/DTM)": [L.dem],
  "High-Resolution DEM & Drainage Network": [L.dem],
  "SAR Inundation Mapping (All-Weather)": [L.gfm, L.cdse],
  "Optical Surface Water & Damage Imagery": [L.cdse, L.usgs],
  "Satellite Precipitation & Hydrological Records": [L.imerg, L.dfo],
  "Flood Hazard & Risk Maps": [L.cems],
  "Imperviousness & Land Cover": [L.clms],
  "Land Cover & Imperviousness": [L.clms],
  "Land Cover & Permeability": [L.clms],
  "Surface Albedo & Imperviousness": [L.clms, L.earthdata],
  "Soil Moisture Anomaly Products": [L.gdo, L.earthdata],
  "Soil Moisture & Root-Zone Anomalies": [L.gdo, L.earthdata],
  "Vegetation Condition Indices (NDVI / VCI / VHI)": [L.clmsVeg, L.earthdata],
  "Land Surface Temperature & Evaporative Stress (ESI)": [L.earthdata, L.usgs],
  "Land Surface Temperature (LST)": [L.earthdata, L.usgs],
  "Standardized Precipitation Indices (SPI / SPEI)": [L.gdo, L.cds],
  "Surface Water Extent & Quality": [L.cdse],
  "Surface Water Extent (Reservoirs & Lakes)": [L.cdse],
  "Total Water Storage Anomalies": [L.earthdata],
  "Urban Tree Canopy & Green Space Maps": [L.clms],
  "Solar-Induced Chlorophyll Fluorescence (SIF)": [L.earthdata],
};

/** Portals for a dataset; satellite datasets without a specific entry fall back to the two main archives. */
export function linksFor(name: string, source?: string): DataLink[] {
  const found = DATASET_LINKS[name];
  if (found) return found;
  return source === "satellite" ? [L.cdse, L.earthdata] : [];
}

/** The two reviews this tool is based on. */
export const EVIDENCE_BASE = [
  {
    short: "Destefanis et al., 2025",
    citation:
      "Destefanis, T., Guliyeva, S., Boccardo, P., & Fissore, V. (2025). Advancing flood detection and mapping: A review of Earth observation services, 3D data integration, and AI-based techniques. Remote Sensing, 17(17), 2943.",
    url: "https://doi.org/10.3390/rs17172943",
  },
  {
    short: "Guliyeva & Boccardo, 2026",
    citation:
      "Guliyeva, S., & Boccardo, P. (2026). Geospatial Technologies for Flood and Drought Management: A Review of Earth Observation Data, Procedures, and their Operational Effectiveness. Aerotecnica Missili & Spazio, 105(5), 707–728.",
    url: "https://doi.org/10.1007/s42496-026-00309-4",
  },
];
