# UrbanTwinReadiness

**A Decision-Support Tool for Assessing Minimum Data Requirements for Urban Digital Twins in Environmental Management**

**Live app:** https://urban-twin-readiness.sona-guliyeva.workers.dev/

---

## Overview

**UrbanTwinReadiness** is a research-driven web application that helps cities, planners, and institutions identify the **minimum data requirements** for developing **Urban Digital Twins (UDTs)** for environmental management and disaster resilience.

Given a set of policy objectives and a declared technical maturity level, the tool generates a structured profile: required datasets, source typologies, priority levels, relevant Earth Observation (EO) platforms, real-world reference deployments, and a phased, city-specific acquisition roadmap.

---

## Purpose

Cities increasingly need data-driven tools to address environmental and resilience challenges across a wide range of domains, from air quality and flood risk to energy, public safety, and health. The gap is rarely data availability, it is knowing **what to acquire first, in what order, and from where**. UrbanTwinReadiness closes that gap by translating stated priorities directly into a concrete, sourced, prioritised data-acquisition plan, rather than a general readiness score.

---

## How It Works

### 1. Select Policy Objectives

Users choose one or more objectives across **10 thematic domains** (30 objectives in total):

- Urban Planning & Development
- Mobility & Transport
- Water & Sanitation
- Green Spaces & Environment
- Air Quality
- Disaster Management
- Energy
- Public Safety & Security
- Health & Social Services
- Climate Risk & Resilience

### 2. Select Technical Maturity Level

- **1 · Static Digital Model** — 3D/2D visualization, limited analytics, mostly static data
- **2 · Analytical Digital Twin** — integrated datasets, dashboards, limited scenario analysis
- **3 · Predictive Digital Twin** — predictive modeling, forecasting, simulation
- **4 · Prescriptive Digital Twin** — advanced simulations and scenario planning for decisions
- **5 · Autonomous Digital Twin** — real-time data, AI, automated decision support

### 3. Generate Results

The application produces:

- **Summary** of the selected maturity level (what the city can realistically achieve)
- **Minimum required datasets**, each tagged by priority (essential / recommended / optional) and source type (satellite/EO, ground sensor, open data, administrative)
- **Role of Earth Observation data**, with 9 EO reference platforms linked directly to their data-access interfaces (Copernicus Data Space Ecosystem, Copernicus Land Monitoring Service, CAMS, C3S, Copernicus Emergency Management Service, NASA Earthdata, USGS EarthExplorer, Google Earth Engine, ESA Earth Online)
- **Open Spatial Layers** — 6 open foundational layers (OpenStreetMap, Copernicus Urban Atlas, Copernicus DEM, GISCO administrative boundaries, open building footprints, local open data portals)
- **Real-world case studies** (Rotterdam, Helsinki, Antwerp, Digital Twin Victoria), surfaced when relevant to the selected objectives
- **Key limitations** at the selected maturity level
- **A phased, city-specific roadmap** (Phase 1: essential datasets to start with, Phase 2: recommended datasets to build capacity, Phase 3: qualitative steps to reach the next maturity level)

---

## Turin — Next Development Step

Integration of a fully worked, object-level city case, based on independently produced Turin road-network data (82 segments, enriched with airborne, Sentinel-2 and SDGSAT-1 land surface temperature), is planned as the platform's next development milestone. Until then, the tool's dataset recommendations remain illustrative rather than empirically cross-checked against measured conditions for a specific city.

---

## Development Approach

UrbanTwinReadiness was built iteratively across three platforms:

1. **base44** (no-code) — initial prototype, to validate the core interaction (objectives in → data profile out) before any real engineering investment.
2. **Lovable** (AI-assisted development) — substantial rebuild into a real, inspectable codebase (React / TanStack Start), hosted on Lovable's own infrastructure.
3. **Independent, open-source, self-hosted** — the codebase was migrated to this repository and deployed independently on Cloudflare Workers, removing dependence on any third-party platform. All subsequent development (the 5-level maturity model, the 10-domain/30-objective taxonomy, direct EO/open-layer deep links, roadmap logic) was built directly against this independent codebase.

### Tech stack

- [TanStack Start](https://tanstack.com/start) (React) + Vite
- Tailwind CSS
- Deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/)

### Running locally

```bash
npm install
npm run dev
```

### Deploying

```bash
npm run build
npx wrangler deploy
```

---

## Roadmap

- **V1.0 — Current.** Minimum dataset readiness across 30 objectives / 10 domains and 5 technical maturity levels.
- **V2.0 — Turin object-level case study.** Real, measured environmental data for a fully worked city example.
- **V3.0 — Discovery catalog.** Metadata-driven dataset browsing (provider, resolution, access, licensing).
- **V4.0 — Interactive visualizer.** A spatial interface for exploring recommended datasets and layers directly.

---

## Research Context

This application is part of ongoing doctoral research in **Urban and Regional Development** at **Politecnico di Torino**, focused on Earth Observation, Urban Digital Twins, environmental data integration, and policy-oriented decision support. It is a research prototype, not a full operational UDT system.

---

## Limitations

- Research prototype; outputs are indicative, not prescriptive.
- Dataset recommendation logic is expert-curated, not derived from a systematic survey of municipal practice.
- Not yet tested prospectively with municipal users.
- Not connected to real-time data sources; no live GIS or simulation engine.

---

## License

(To be defined — e.g. MIT, CC BY-NC)

---

## Contact

**Sona Guliyeva**
PhD Candidate — Politecnico di Torino
Urban Digital Twins | Earth Observation | Environmental Management
