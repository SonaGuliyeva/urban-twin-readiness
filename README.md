# UrbanTwinReadiness

**A Decision-Support Prototype for Urban Digital Twin Development in Urban Environmental Management**

---

## Table of Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [How It Works](#how-it-works)
- [Output Structure](#output-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Development Approach](#development-approach)
- [Research Context](#research-context)
- [Limitations](#limitations)
- [Future Directions](#future-directions)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

---

## Overview

**UrbanTwinReadiness** is a research-driven web application designed to support cities, planners, and institutions in identifying the **minimum data requirements** for developing **Urban Digital Twins (UDTs)** focused on **urban environmental management**.

The tool translates academic research into a practical interface that links:

- **Policy objectives**
- **Implementation levels**
- **Required datasets**
- **Earth Observation (EO) capabilities**

---

## Purpose

Cities increasingly need data-driven tools to address environmental challenges such as:

- Flood risk and disaster management
- Air quality and emissions
- Urban heat and climate adaptation
- Water resource management
- Land use and urban planning

However, there is often a gap between **data availability** and **operational use**.

**UrbanTwinReadiness** helps bridge this gap by providing a structured way to understand:

> What data is minimally required to develop a functional Urban Digital Twin for specific environmental objectives.

---

## How It Works

### 1. Select Policy Objectives

Users choose one or more environmental goals, such as:

- Improve Air Quality
- Flood Risk Reduction
- Urban Heat Island Mitigation
- Water Resource Management
- Green Infrastructure Planning
- Climate Neutrality Targets

### 2. Select Implementation Level

- **Beginner**  
  Basic static UDT using open data

- **Moderate**  
  Semi-dynamic UDT integrating sensors and periodic satellite data

- **Advanced**  
  Near real-time UDT with AI-supported analytics and multi-source data fusion

### 3. Generate Results

The application produces:

- **Summary of requirements**
- **Minimum required datasets**
- **Role of Earth Observation (EO) data**
- **Example data sources and platforms**
- **Interpretation for the city**
- **Open Spatial Layers (OS layers)**

---

## Output Structure

Each dataset includes:

- Name
- Description
- Source type:
  - Satellite
  - Ground
  - Open Data
  - Administrative
- Priority:
  - Essential
  - Recommended
  - Optional
- Examples (e.g. Sentinel-2, OpenStreetMap)

Additional outputs:

- EO capabilities and key platforms
- Practical interpretation (what the city can achieve)

---

## Tech Stack

- **[React 19](https://react.dev)** with **[TanStack Start](https://tanstack.com/start)** and **[TanStack Router](https://tanstack.com/router)** (file-based routing)
- **[Tailwind CSS 4](https://tailwindcss.com)** for styling, with [shadcn/ui](https://ui.shadcn.com) primitives (Radix UI under the hood)
- **[Vite](https://vite.dev)** as the build tool, deployed to **[Cloudflare Workers](https://workers.cloudflare.com)** via `@cloudflare/vite-plugin`
- **TypeScript**, **ESLint**, and **Prettier** for type safety and code style
- **[Bun](https://bun.sh)** as the package manager (an `npm` lockfile is also kept in sync)

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+ with npm

### Install

```bash
bun install
# or: npm install
```

### Run the dev server

```bash
bun run dev
# or: npm run dev
```

The app runs locally with hot module reload via Vite.

### Other scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `bun run dev`       | Start the local development server |
| `bun run build`     | Production build                   |
| `bun run build:dev` | Build in development mode          |
| `bun run preview`   | Preview a production build locally |
| `bun run lint`      | Run ESLint                         |
| `bun run format`    | Format the codebase with Prettier  |

---

## Project Structure

```
src/
  routes/          # File-based routes (TanStack Router): /, /configure, /results, /about
  components/
    ui/            # shadcn/ui primitives
    common/         # Shared presentational components (SectionHeading, StatCard, ...)
    results/        # Components specific to the results page (DatasetCard, OSLayerCard, ...)
  data/            # Domain data: policy objectives, datasets, EO platforms, hydro hazards, roadmap
  hooks/           # Shared React hooks
  lib/             # Generic utilities (e.g. `cn()` class-name helper)
```

The `src/data` module is the single source of truth for policy objectives, the dataset catalog, Earth Observation platforms, Open Spatial Layers, and the flood/drought hazard reference tables — re-exported through `src/data/index.ts` so routes and components can import from `@/data`.

---

## Roadmap

This prototype is designed as a staged system:

### **V1.0 — Current Version**

Minimum dataset readiness tool based on policy objectives and implementation levels

### **V2.0 — Open Spatial Layers**

Integration of open datasets such as:

- OpenStreetMap
- Copernicus datasets
- Local open data

### **V3.0 — Discovery Catalog**

Metadata-driven system including:

- dataset providers
- resolution
- access methods
- licensing

### **V4.0 — Visualizer Tool**

Interactive spatial interface integrating datasets and metadata into a unified environment

---

## Development Approach

The prototype was developed through an **iterative workflow**:

- **Concept & Research:**  
  Based on PhD research on Earth Observation and Urban Digital Twins

- **Logic Prototyping:**  
  Initial testing of dataset recommendation logic using AI-assisted tools

- **Interface Development:**  
  MVP interface generated and refined using modern frontend tools

- **Version Control:**  
  GitHub used for transparency, iteration, and future scalability

---

## Research Context

This application is part of ongoing doctoral research in:

**Urban and Regional Development**  
Politecnico di Torino

Focus:

- Earth Observation (EO)
- Urban Digital Twins (UDTs)
- Environmental data integration
- Policy-oriented decision support

The tool represents a **prototype**, not a full operational UDT system.

---

## Limitations

- Prototype-level application
- Outputs are indicative, not prescriptive
- Not connected to real-time data sources
- No live GIS or simulation engine
- Not validated through municipal deployment

---

## Future Directions

- Integration with real EO data services
- Development of structured dataset catalog
- Interactive spatial visualization
- Institutional readiness assessment module
- Expansion toward a full UDT support platform

---

## License

(To be defined — e.g. MIT, CC BY-NC)

---

## Acknowledgments

Developed within doctoral research in Urban and Regional Development,  
with academic supervision and interdisciplinary support.

---

## Contact

**Sona Guliyeva**  
PhD Candidate – Politecnico di Torino  
Urban Digital Twins | Earth Observation | Environmental Management
