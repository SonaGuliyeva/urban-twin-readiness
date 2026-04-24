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
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> A simple guide for cities · Research prototype
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] text-foreground sm:text-6xl">
              UrbanTwinReadiness
            </h1>
            <p className="mt-5 max-w-2xl font-serif text-xl leading-snug text-muted-foreground sm:text-2xl">
              Find out what data your city needs to build a digital twin for the environment.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/80">
              Building a digital twin can feel overwhelming. This tool makes it simple: tell us what
              your city wants to improve — like cleaner air, less flooding, or more green space — and
              we'll show you exactly which datasets you need, where to find them, and how satellite
              data from space can help.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/configure"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-elevated"
              >
                Start now — it's free
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
              { k: "24", v: "City goals to choose from" },
              { k: "8", v: "Environmental themes" },
              { k: "3", v: "Levels of readiness" },
              { k: "Open", v: "Built on free EU data" },
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
            <h2 className="mt-2 text-3xl text-foreground sm:text-4xl">Three steps, about two minutes</h2>
          </div>
          <div className="hidden h-px flex-1 bg-border sm:block" />
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Pick your city's goals",
              d: "Choose what matters most — cleaner air, flood protection, cooler streets, more green space, and more.",
            },
            {
              n: "02",
              t: "Tell us where you stand",
              d: "Are you just getting started, already collecting some data, or running advanced systems? Pick the level that fits.",
            },
            {
              n: "03",
              t: "Get your action plan",
              d: "We'll show you the data you need, where to get it, how satellites can help, and what to do next.",
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
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">What we focus on</p>
            <h2 className="mt-2 font-serif text-3xl text-foreground">The city's environment, not everything at once</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              We deliberately stay focused on what shapes daily life in cities: the air people breathe,
              water and flooding, heat and climate, green spaces, and how land is used. That focus
              keeps the advice clear and actionable instead of overwhelming.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Why satellites matter
            </p>
            <h2 className="mt-2 font-serif text-3xl text-foreground">A view from above, free and open</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              Europe's Copernicus satellites give every city free access to data that used to be out of
              reach: pollution maps, surface temperature, vegetation, and more. We show you which
              satellite sources fit your goals — alongside local sensors and city records.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
          Ready to see what your city needs?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          It only takes about two minutes. You'll get a clear, shareable plan you can use right away.
        </p>
        <Link
          to="/configure"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-elevated"
        >
          Start now
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </>
  );
}
