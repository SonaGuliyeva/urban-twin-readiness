// Plain-language wording for non-technical users (city staff, decision-makers).
// Keyed by the dataset name used in datasets.ts. Datasets without an entry fall back to
// the technical name and description.
export interface PlainDataset {
  title: string;
  what: string;
}

export const PLAIN_DATASETS: Record<string, PlainDataset> = {
  "High-Resolution Digital Elevation Model (DEM/DTM)": {
    title: "A detailed map of the ground height",
    what: "Shows where water will flow and collect. Needed to calculate how deep and wide a flood can be.",
  },
  "SAR Inundation Mapping (All-Weather)": {
    title: "Satellite radar maps of flooded areas",
    what: "Shows which areas are under water during a flood, even at night or under clouds.",
  },
  "Optical Surface Water & Damage Imagery": {
    title: "Satellite photos of water and flood damage",
    what: "Shows where water stood and which buildings or land were damaged.",
  },
  "Satellite Precipitation & Hydrological Records": {
    title: "Rainfall and river records",
    what: "How much rain fell and how rivers behaved in the past. Helps to see how often floods happen.",
  },
  "Flood Hazard & Risk Maps": {
    title: "Official flood hazard maps",
    what: "Maps from the authorities showing which areas can flood and how likely it is.",
  },
  "Soil Moisture Anomaly Products": {
    title: "How wet or dry the soil is",
    what: "Shows whether the ground is drier or wetter than usual. Dry or saturated soil changes flood and drought risk.",
  },
  "Imperviousness & Land Cover": {
    title: "Map of sealed surfaces (asphalt, roofs) and green areas",
    what: "Sealed surfaces do not absorb water, so rain runs off quickly. The map shows where this happens.",
  },
  "Land Cover & Imperviousness": {
    title: "Map of sealed surfaces (asphalt, roofs) and green areas",
    what: "Sealed surfaces do not absorb water, so rain runs off quickly. The map shows where this happens.",
  },
  "Critical Infrastructure & Exposure Layer": {
    title: "Map of important places that could be hit",
    what: "Hospitals, schools, roads, power and water facilities. Shows what is at risk in a flood.",
  },
  "UAV Rapid Mapping (Local)": {
    title: "Drone images taken quickly after an event",
    what: "Very detailed local pictures of an affected area, taken within hours or days.",
  },
  "High-Resolution DEM & Drainage Network": {
    title: "Ground height map and a map of drains and pipes",
    what: "Shows where rainwater flows and where the drainage system may not cope.",
  },
  "Rainfall Radar & Gauges": {
    title: "Rain measurements, minute by minute",
    what: "Short, intense rain is what overloads city drains. Radar and rain gauges measure it.",
  },
  "Land Surface Temperature (LST)": {
    title: "How hot the ground and roofs are",
    what: "Satellite measurement of surface heat. Shows the hottest parts of the city.",
  },
  "Urban Morphology & Building Heights": {
    title: "Building shapes and heights",
    what: "Tall or dense buildings change shade, wind and heat in streets.",
  },
  "Surface Albedo & Imperviousness": {
    title: "How much sunlight surfaces reflect",
    what: "Dark surfaces get hotter than light ones. Shows which surfaces add to the heat.",
  },
  "Air Temperature Sensor Network": {
    title: "Air temperature stations in the city",
    what: "Local thermometers that show the real temperature people feel, street by street.",
  },
  "Surface Water Extent & Quality": {
    title: "Rivers, lakes and reservoirs: size and condition",
    what: "Shows how much surface water the city has and whether its quality is acceptable.",
  },
  "Groundwater Monitoring Wells": {
    title: "Groundwater levels from monitoring wells",
    what: "Shows how much water is stored underground and whether it is falling.",
  },
  "Water Supply & Consumption Records": {
    title: "How much water the city uses",
    what: "Supply and consumption figures. Show when demand becomes a problem during a dry period.",
  },
  "Soil Moisture & Root-Zone Anomalies": {
    title: "How dry the soil is for plants",
    what: "Shows whether the soil where roots grow is drier than normal. One of the first signs of drought.",
  },
  "Vegetation Condition Indices (NDVI / VCI / VHI)": {
    title: "How healthy the plants look from space",
    what: "Satellite measure of plant health. Stressed vegetation is an early sign of drought.",
  },
  "Land Surface Temperature & Evaporative Stress (ESI)": {
    title: "Heat and how much water plants are losing",
    what: "Shows heat stress on land and plants during dry periods.",
  },
  "Standardized Precipitation Indices (SPI / SPEI)": {
    title: "Is it drier than usual? (rain index)",
    what: "A simple score comparing recent rainfall with the normal for your area.",
  },
  "Total Water Storage Anomalies": {
    title: "Total water stored in the region",
    what: "Satellite estimate of all water stored in soil, groundwater and rivers. Coarse, but shows long dry periods.",
  },
  "Surface Water Extent (Reservoirs & Lakes)": {
    title: "Size of reservoirs and lakes",
    what: "Shows whether reservoirs and lakes are shrinking.",
  },
  "Solar-Induced Chlorophyll Fluorescence (SIF)": {
    title: "Very early plant stress signal",
    what: "A satellite signal from plants that can show drought stress before leaves change colour.",
  },
  "Ground Soil Moisture & Agro-Meteorological Network": {
    title: "Soil moisture and weather sensors on the ground",
    what: "Local sensors that check what the satellites see.",
  },
  "Urban Tree Canopy & Green Space Maps": {
    title: "Map of trees and green spaces",
    what: "Shows where the city is green. Trees cool streets and soak up rain.",
  },
  "Land Cover & Permeability": {
    title: "Map of surfaces that let water soak in",
    what: "Shows where rain can enter the ground and where it cannot.",
  },
  "Park & Green Asset Inventory": {
    title: "List of the city's parks and green assets",
    what: "Your own record of parks, street trees and green areas.",
  },
};
