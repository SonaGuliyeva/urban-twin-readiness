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
              UrbanTwinReadiness helps cities and public authorities identify the datasets, data
              sources, and Earth Observation inputs needed to develop an Urban Digital Twin. Select
              your policy objectives and implementation level to generate a structured, evidence-based
              data requirement profile.
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
              { k: "8", v: "Thematic domains" },
              { k: "3", v: "Implementation levels" },
              { k: "Open", v: "Grounded in EU open data" },
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
              How it works
            </p>
            <h2 className="mt-2 text-3xl text-foreground sm:text-4xl">A three-step assessment</h2>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Select policy objectives",
              d: "Choose one or more environmental priorities, from air quality and flood risk to urban heat and green infrastructure.",
            },
            {
              n: "02",
              t: "Define implementation level",
              d: "Indicate the city's current capacity — beginner, moderate, or advanced — to align recommendations with realistic conditions.",
            },
            {
              n: "03",
              t: "Review the data profile",
              d: "Receive a structured profile of required datasets, source types, Earth Observation platforms, and an implementation pathway.",
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
              The tool deliberately concentrates on the environmental dimension of urban systems —
              air quality, water and flood risk, urban climate, green infrastructure, and land use.
              This focus keeps the recommendations operational and methodologically consistent.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Earth Observation
            </p>
            <h2 className="mt-2 font-serif text-3xl text-foreground">A central role for satellite data</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              Copernicus and complementary Earth Observation programmes provide cities with open,
              continuous, and standardised data — from atmospheric composition to land surface
              temperature. The tool maps these sources to each policy objective and integrates them
              with ground sensors and administrative data.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
          Generate your data requirement profile
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          A short configuration produces a structured profile you can review, share, and use as a
          starting point for technical scoping.
        </p>
        <Link
          to="/configure"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-elevated"
        >
          Start the assessment
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </>
  );
}
