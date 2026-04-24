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
      <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">What this tool is — and isn't</h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground/85">
        <p>
          UrbanTwinReadiness is a friendly starting point for cities that want to build a digital
          twin for the environment but don't know where to begin. It cuts through the jargon and
          shows you, in plain language, what data you'll actually need.
        </p>
        <p>
          A "digital twin" sounds futuristic, but in everyday terms it's just a living, digital copy
          of your city that helps decision-makers see what's happening — and try out ideas before
          spending real money on them. We focus only on the environment side: air, water, heat,
          green spaces, and how the city is changing.
        </p>
        <p>
          You tell us what your city wants to improve and where you stand today. We give you back a
          short, clear plan: the data you need, where to find it, how satellites can help, and what
          to work on next.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Where the advice comes from</h2>
        <p>
          The recommendations are based on European environmental policies, the free Copernicus
          satellite programme, and recent research on urban digital twins. We've kept things
          conservative and transparent, and we update the guidance as the field moves on.
        </p>

        <h2 className="!mt-12 font-serif text-2xl text-foreground">Who it's for</h2>
        <p>
          City staff, urban planners, students, researchers, and anyone who's curious about digital
          twins. It's a great way to start the conversation in your team or with partners. It is
          <em> not</em> a replacement for a proper technical study before launching a real project.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="font-serif text-xl text-foreground">Give it a try</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Two minutes is all it takes to get your first plan.
        </p>
        <Link
          to="/configure"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start now
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
