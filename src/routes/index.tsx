import { createFileRoute, Link } from "@tanstack/react-router";
import { StartNow } from "@/components/common/start-now";
import { TwoExtremes } from "@/components/home/two-extremes";

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
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-primary">UrbanTwinReadiness</p>
            <h1 className="mt-4 text-5xl leading-[1.04] text-foreground sm:text-6xl">
              Is your city&rsquo;s digital twin ready for floods and droughts?
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
              Be ready before the event. Find out which data a digital twin needs, which of it your city already has, and which you can get free from satellites.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
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
            <p className="mt-6 text-sm text-muted-foreground">No account needed.</p>
          </div>
          <TwoExtremes />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl text-foreground sm:text-4xl">Three steps to your data profile</h2>
        <ol className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {[
            {
              n: "1",
              t: "Choose the challenge",
              d: "Floods, droughts or both, and the objectives that matter to your city, such as flood risk reduction or drought preparedness.",
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

      <div className="mx-auto max-w-6xl px-6 pb-20">
        <StartNow />
      </div>

      {/* Scope */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
          <div className="border-l-4 border-flood pl-6">
            <h2 className="font-serif text-3xl text-foreground">Floods</h2>
            <p className="mt-3 leading-relaxed text-foreground/80">
              Heavy rain, rivers and sealed streets. The tool covers flood risk reduction and
              stormwater and drainage management.
            </p>
          </div>
          <div className="border-l-4 border-drought pl-6">
            <h2 className="font-serif text-3xl text-foreground">Droughts</h2>
            <p className="mt-3 leading-relaxed text-foreground/80">
              Water shortage, dry soil and heat. The tool covers drought preparedness, water
              resource monitoring, urban heat island mitigation and green infrastructure.
            </p>
          </div>
          <p className="max-w-2xl leading-relaxed text-muted-foreground md:col-span-2">
            Most of the data comes from open Earth Observation programmes such as Copernicus, so a
            city can start without buying anything. Floods and droughts come first. The same method will be extended to other city objectives, such as air quality, energy and mobility, in later versions.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
          Find out how ready your city is
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          Answer a few questions and get a clear list of the data your city needs, has and is missing.
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
