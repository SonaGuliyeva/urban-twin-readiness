import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — UrbanTwinReadiness" },
      {
        name: "description",
        content:
          "About UrbanTwinReadiness — a research-driven decision-support tool for Urban Digital Twins in urban environmental management.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">About</p>
      <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">A research-driven prototype</h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground/85">
        <p>
          UrbanTwinReadiness is a decision-support tool that helps cities identify the minimum datasets
          and Earth Observation inputs needed to develop Urban Digital Twins (UDT) for urban
          environmental management.
        </p>
        <p>
          The application is intentionally focused. Rather than addressing the full breadth of smart
          city topics, it concentrates on the environmental dimension — air, water, climate, land, and
          ecosystems — where Earth Observation provides distinctive analytical value.
        </p>
        <p>
          For each combination of policy objectives and implementation level, the tool produces a
          structured readiness profile: a curated list of minimum datasets, their priority and source
          type, the role of satellite and EO data, key European and international platforms, and a
          short implementation pathway describing what is feasible today and what is required to
          progress further.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Methodology</h2>
        <p>
          The mappings between policy objectives and datasets are based on a review of European urban
          environmental policy frameworks, Copernicus services documentation, and academic literature
          on Urban Digital Twins. They are designed to be transparent, conservative, and easy to update
          as the field evolves.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Intended use</h2>
        <p>
          The tool is intended for municipal practitioners, urban planners, researchers, and policy
          officers who are scoping Urban Digital Twin initiatives. It supports early-stage discussions
          and feasibility scoping. It does not replace detailed technical assessments or procurement
          studies.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="font-serif text-xl text-foreground">Try the configurator</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate a readiness profile in about two minutes.
        </p>
        <Link
          to="/configure"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start the assessment
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
