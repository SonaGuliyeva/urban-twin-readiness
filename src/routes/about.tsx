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
      <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">About the tool</h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground/85">
        <p>
          UrbanTwinReadiness is a decision-support tool that helps cities and public authorities
          identify the minimum datasets and Earth Observation inputs needed to develop an Urban
          Digital Twin (UDT) for urban environmental management.
        </p>
        <p>
          An Urban Digital Twin is a dynamic, data-driven representation of the urban environment
          that supports monitoring, analysis, and scenario testing. This tool focuses specifically
          on the environmental dimension — air quality, water and flood risk, urban climate, green
          infrastructure, and land use — rather than on smart-city services more broadly.
        </p>
        <p>
          Given a set of policy objectives and a declared implementation level, the tool returns a
          structured profile: required datasets, source typologies, priority levels, relevant Earth
          Observation platforms, and a qualitative implementation pathway.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Methodological basis</h2>
        <p>
          Recommendations are derived from European environmental policy frameworks, the Copernicus
          programme and related EO services, and recent literature on Urban Digital Twins. The
          underlying mappings are intentionally conservative and transparent, and are revised as the
          evidence base evolves.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Intended audience</h2>
        <p>
          The tool is designed for city administrations, urban planners, environmental agencies,
          researchers, and students working on Urban Digital Twins. It supports early scoping and
          stakeholder dialogue and is <em>not</em> a substitute for a formal technical feasibility
          study.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Status</h2>
        <p>
          This application is a research prototype developed in the context of doctoral research on
          Urban Digital Twins for environmental management.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="font-serif text-xl text-foreground">Run an assessment</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure your policy objectives and implementation level to generate a profile.
        </p>
        <Link
          to="/configure"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open the configurator
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
