# UrbanTwinReadiness

**A Decision-Support Prototype for Urban Digital Twin Development in Urban Environmental Management**

**Live application:** https://urban-twin-readiness.sona-guliyeva.workers.dev/
**License:** PolyForm Noncommercial 1.0.0 (source-available; free for noncommercial, research, and educational use)

---

## Overview

**UrbanTwinReadiness** is a research-driven web application that helps cities, planners, and institutions identify the **minimum data requirements** for developing **Urban Digital Twins (UDTs)** for environmental management and disaster resilience.

Given a set of policy objectives and a declared technical maturity level, the tool returns a structured, prioritised data-requirement profile: required datasets, source typologies, relevant Earth Observation (EO) platforms, open spatial layers, real-world reference deployments, and a phased acquisition roadmap.

> **Note on "minimum":** in this project, *minimum* refers to the **essential-priority datasets** defined by the tool's expert-curated recommendation rules, not to a statistically or empirically validated minimum set. See [Limitations](#limitations).

---

## Purpose

Cities increasingly need data-driven tools to plan Urban Digital Twins across a wide range of domains, from air quality and flood risk to energy, public safety, and health. The gap is rarely data availability alone, it is knowing what to acquire first, in what order, and from where. UrbanTwinReadiness addresses this by translating stated policy priorities and technical maturity into a concrete, sourced, sequenced data-acquisition plan.

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

- **Summary** of the selected maturity level (what a city at this level can typically support, per the tool's own maturity definitions)
- **Minimum required datasets**, each tagged by priority (essential / recommended / optional) and source type (satellite/EO, ground sensor, open data, administrative)
- **Role of Earth Observation data**, with 9 EO reference platforms linked directly to their data-access interfaces
- **Open Spatial Layers** — 6 open foundational layers
- **Real-world case studies**, surfaced when relevant to the selected objectives
- **Key limitations** at the selected maturity level
- **A phased, city-specific roadmap** (Phase 1: essential datasets, Phase 2: recommended datasets, Phase 3: qualitative steps toward the next maturity level)

---

## Turin — Next Development Step

Integration of a fully worked, object-level city case, based on independently produced Turin road-network data, is planned as the platform's next development milestone. Until then, the tool's dataset recommendations remain illustrative rather than empirically cross-checked against measured conditions for a specific city.

---

## Development Approach

UrbanTwinReadiness was developed iteratively across three platforms, each chosen for a specific, practical reason:

1. **base44** (no-code) — an initial prototype used to test whether the core interaction (objectives in → data profile out) made sense to a user, before investing further effort.
2. **Lovable** (AI-assisted development) — a substantial rebuild into a real, inspectable React/TypeScript codebase. Lovable's built-in GitHub integration made it possible to move the prototype's logic into a version-controlled repository within minutes, enabling the five-level maturity model and dataset recommendation rules to be developed as real, extensible code rather than no-code configuration.
3. **Independent deployment** — the Lovable-generated codebase was migrated into this **source-available** GitHub repository, licensed under PolyForm Noncommercial 1.0.0, and subsequently developed and deployed outside the Lovable platform. The application is currently deployed as a **Cloudflare Worker** on Cloudflare's **Workers Free plan**, under the author's own Cloudflare account. This removes dependence on base44 or Lovable for application hosting and credit-metered development, while the application still runs on managed serverless infrastructure (Cloudflare) rather than a privately owned server. All subsequent development, the 5-level maturity model, the 10-domain/30-objective taxonomy, direct EO/open-layer deep links, and the roadmap logic, was built directly against this independent codebase.

### Tech stack

- [TanStack Start](https://tanstack.com/start) (React) + Vite
- Tailwind CSS
- Deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/) (Workers Free plan; usage-limited, not a paid dedicated server)

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

- **V1.0 — Current.** Minimum dataset readiness. Identifies the minimum datasets, source types and Earth Observation inputs required for a given combination of policy objectives and technical maturity level.
- **V2.0 — Planned.** Integration of Open Spatial (OS) layers. Couples each policy objective with a curated set of open spatial layers (OSM, Urban Atlas, DEM, administrative boundaries, local portals) ready for ingestion.
- **V3.0 — Planned.** Discovery catalog with metadata and access. Adds a structured catalog with provider, resolution, temporal coverage, licence and access endpoint for every dataset and layer.
- **V4.0 — Planned.** Interactive visualizer. Embeds an interactive map allowing users to explore datasets, inspect metadata and preview integration into an Urban Digital Twin.

---

## Research Context

This application is part of ongoing doctoral research in **Urban and Regional Development** at **Politecnico di Torino**, focused on Earth Observation, Urban Digital Twins, environmental data integration, and policy-oriented decision support. It is a research prototype, not a validated operational UDT system.

---

## Limitations

- Research prototype; outputs are indicative, not prescriptive.
- Dataset priority tiers (essential / recommended / optional) reflect **expert judgement**, not an empirically calibrated or statistically validated minimum set, and no sensitivity analysis has yet been performed on these assignments.
- Not yet tested prospectively with municipal users (no usability testing, interviews, or task-completion evaluation to date).
- Not yet validated through a real municipal deployment; the planned Turin case study (see above) is the first step toward this.
- Not connected to real-time data sources; no live GIS or simulation engine.
- The application is deployed on managed third-party cloud infrastructure (Cloudflare Workers); it is independent of the original no-code/AI-assisted development platforms (base44, Lovable) but not infrastructure-independent in an absolute sense.

---

## License

This project is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE) — the source code is publicly viewable and free to use for noncommercial, research, and educational purposes. Commercial use requires the author's permission.

---

## Contact

**Sona Guliyeva**
PhD Candidate — Politecnico di Torino
Urban Digital Twins | Earth Observation | Environmental Management
