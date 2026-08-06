import type { OpenSpatialLayer } from "@/data/types";

export const OPEN_SPATIAL_LAYERS: OpenSpatialLayer[] = [
  {
    name: "OpenStreetMap",
    description:
      "Collaborative base map with road network, buildings, land use and points of interest.",
    provider: "OpenStreetMap Foundation",
    coverage: "Global, vector, continuously updated",
    access: "Open access (ODbL) — direct download, Overpass API, tile services",
    url: "https://www.openstreetmap.org",
  },
  {
    name: "Copernicus Urban Atlas",
    description:
      "Harmonised land use and land cover for European Functional Urban Areas, including street tree layer and building heights.",
    provider: "Copernicus Land Monitoring Service",
    coverage: "EEA-39 cities, ~10 m, updated every ~6 years",
    access: "Open access via Copernicus Land portal",
    url: "https://land.copernicus.eu/local/urban-atlas",
  },
  {
    name: "Copernicus DEM (GLO-30 / EEA-10)",
    description:
      "Global and European digital elevation models supporting hydrology, line-of-sight and 3D city modelling.",
    provider: "ESA / Copernicus",
    coverage: "30 m global, 10 m over EEA-39",
    access: "Open access via Copernicus Data Space",
    url: "https://dataspace.copernicus.eu",
  },
  {
    name: "GADM / EU Administrative Boundaries (GISCO)",
    description:
      "Reference administrative boundaries (countries, regions, municipalities) for spatial aggregation and reporting.",
    provider: "Eurostat GISCO / GADM",
    coverage: "Global and European, multiple administrative levels",
    access: "Open access download (shapefile, GeoJSON)",
    url: "https://ec.europa.eu/eurostat/web/gisco",
  },
  {
    name: "Microsoft / Google Open Building Footprints",
    description:
      "AI-derived building footprints filling gaps in OSM, useful for density and exposure analysis.",
    provider: "Microsoft / Google Research",
    coverage: "Global, vector polygons",
    access: "Open access (ODbL / CDLA)",
    url: "https://github.com/microsoft/GlobalMLBuildingFootprints",
  },
  {
    name: "Local Open Data Portals",
    description:
      "Municipal and regional portals publishing cadastres, transport networks, environmental sensors and planning layers.",
    provider: "Local authorities",
    coverage: "City / regional scale, varies",
    access: "Open data portals, often CKAN-based, with APIs",
    url: "https://data.europa.eu",
  },
];
