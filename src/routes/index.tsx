import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UrbanTwinReadiness: a web-based decision-support tool" },
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
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center sm:pt-24">
          <div>
            <p className="text-sm font-semibold text-primary">UrbanTwinReadiness</p>
            <h1 className="mt-4 mx-auto max-w-3xl text-5xl leading-[1.04] text-foreground sm:text-6xl lg:text-7xl">
              Open satellite data for your city&rsquo;s digital twin
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80">
              Whether your city already has a digital twin or is only planning one, find out which
              data it needs, which of it you already have, and which you can get from satellites.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/configure"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-elevated"
              >
                Start the assessment
              </Link>
              <Link
                to="/turin"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
              >
                See the Turin example
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No account needed.{" "}
              <a
                href="/UrbanTwinReadiness-brief.pdf"
                download
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Download the two-page brief (PDF)
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl text-foreground sm:text-4xl">Three steps to your data profile</h2>
        <ol className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {[
            {
              n: "1",
              t: "Choose your objective",
              d: "Pick the objectives that matter most to your city. Each one shows which data it needs.",
            },
            {
              n: "2",
              t: "Say where your city starts",
              d: "From nothing at all to a real-time twin.",
            },
            {
              n: "3",
              t: "Get your minimum",
              d: "You get the open satellite data to add to your twin and where to download it. You can also mark what you already have.",
            },
          ].map((s) => (
            <li key={s.n} className="border-t-2 border-primary pt-5">
              <span className="font-serif text-3xl text-primary">{s.n}</span>
              <h3 className="mt-2 font-serif text-2xl text-foreground">{s.t}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
