import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UrbanTwinReadiness — What data does your city need?" },
      {
        name: "description",
        content:
          "Find the minimum data your city needs to start an Urban Digital Twin for environmental management.",
      },
    ],
  }),
  component: HomePage,
});

const STEPS = [
  { n: "1", t: "Pick your goals", d: "e.g. flood risk, heat, air quality" },
  { n: "2", t: "Say where you are", d: "from a 3D map to real-time data" },
  { n: "3", t: "Get your data list", d: "what to collect first, and where" },
];

function HomePage() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 grid-paper opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
        <div className="max-w-2xl">
          <h1 className="text-5xl leading-[1.05] text-foreground sm:text-6xl">
            What data does your city need?
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Find the minimum data to start an Urban Digital Twin for environmental management. Takes
            about one minute.
          </p>
          <Link
            to="/configure"
            className="mt-9 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-elevated"
          >
            Start
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <ol className="mt-20 grid gap-4 border-t border-border/70 pt-8 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="font-serif text-3xl text-accent">{s.n}</span>
              <div>
                <p className="font-medium text-foreground">{s.t}</p>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
