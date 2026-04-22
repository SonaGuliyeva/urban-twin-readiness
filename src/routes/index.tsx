import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UrbanTwinReadiness — Minimum Data Requirements for Urban Digital Twins" },
      {
        name: "description",
        content:
          "Identify the minimum datasets, sources, and Earth Observation inputs required to develop Urban Digital Twins for urban environmental management.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 grid-paper opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Decision-support tool · Research prototype
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] text-foreground sm:text-6xl">
              UrbanTwinReadiness
            </h1>
            <p className="mt-5 max-w-2xl font-serif text-xl leading-snug text-muted-foreground sm:text-2xl">
              Assessing the minimum data requirements for Urban Digital Twins in urban environmental management.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/80">
              UrbanTwinReadiness helps cities and public authorities identify the minimum datasets,
              data sources, and Earth Observation inputs needed to develop an Urban Digital Twin.
              Configure your policy objectives and implementation maturity to obtain a structured,
              evidence-based readiness profile.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/configure"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-elevated"
              >
                Start the assessment
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Stat row */}
          <dl className="mt-20 grid grid-cols-2 gap-6 border-t border-border/70 pt-8 sm:grid-cols-4">
            {[
              { k: "24", v: "Policy objectives" },
              { k: "8", v: "Thematic clusters" },
              { k: "3", v: "Implementation levels" },
              { k: "EO-aligned", v: "Copernicus & beyond" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-serif text-3xl text-foreground">{s.k}</dt>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Methodology
            </p>
            <h2 className="mt-2 text-3xl text-foreground sm:text-4xl">How the assessment works</h2>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Define policy objectives",
              d: "Select one or more environmental policy objectives grouped by theme — from air quality to climate neutrality.",
            },
            {
              n: "02",
              t: "Choose maturity level",
              d: "Indicate whether your city is starting from scratch, has partial integration, or operates advanced systems.",
            },
            {
              n: "03",
              t: "Receive a readiness profile",
              d: "Get a structured dashboard of minimum datasets, source types, EO platforms, and an implementation pathway.",
            },
          ].map((s) => (
            <li
              key={s.n}
              className="rounded-lg border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="font-mono text-xs tracking-widest text-accent">{s.n}</div>
              <h3 className="mt-3 font-serif text-xl text-foreground">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Focus strip */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scope</p>
            <h2 className="mt-2 font-serif text-3xl text-foreground">Focused on urban environmental management</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              UrbanTwinReadiness intentionally narrows the scope of Urban Digital Twins to environmental
              management — air, water, climate, land, and ecosystems. This focus enables a clear,
              practical mapping between policy objectives and the datasets that actually support them.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Earth Observation
            </p>
            <h2 className="mt-2 font-serif text-3xl text-foreground">A central role for satellite data</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              Each readiness profile highlights the contribution of Earth Observation — primarily Copernicus
              Sentinel missions and complementary platforms — alongside ground sensors, open data, and
              administrative records.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
          Ready to assess your city's data foundation?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          The configurator takes about two minutes and produces a structured, citable readiness profile.
        </p>
        <Link
          to="/configure"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-elevated"
        >
          Open the configurator
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </>
  );
}
