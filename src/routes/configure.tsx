import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { POLICY_THEMES, type ImplementationLevel } from "@/lib/udt-data";

export const Route = createFileRoute("/configure")({
  head: () => ({
    meta: [
      { title: "Configurator — UrbanTwinReadiness" },
      {
        name: "description",
        content:
          "Select your policy objectives and implementation level to generate a minimum data requirements profile for your Urban Digital Twin.",
      },
    ],
  }),
  component: ConfigurePage,
});

const LEVELS: { id: ImplementationLevel; title: string; tag: string; desc: string }[] = [
  {
    id: "beginner",
    title: "Just getting started",
    tag: "First steps",
    desc: "You're starting from scratch. You'll mostly use free open data and build a simple map of your city.",
  },
  {
    id: "moderate",
    title: "Already on the way",
    tag: "Some systems in place",
    desc: "You collect some data already and use a few sensors. You're ready to add satellite updates and basic analysis.",
  },
  {
    id: "advanced",
    title: "Running advanced systems",
    tag: "Real-time & AI",
    desc: "You have live data flowing in and use AI to support decisions. You're ready to combine many sources together.",
  },
];

function ConfigurePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [level, setLevel] = useState<ImplementationLevel>("moderate");
  const [city, setCity] = useState("");

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const canSubmit = selected.size > 0;
  const totalSelected = selected.size;

  const themes = useMemo(() => POLICY_THEMES, []);

  const handleGenerate = () => {
    if (!canSubmit) return;
    navigate({
      to: "/results",
      search: {
        objectives: Array.from(selected).join(","),
        level,
        city: city.trim() || undefined,
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Step 1 — Tell us about your city
        </p>
        <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">Build your plan</h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Pick the goals that matter most to your city and tell us where you stand today. We'll do
          the rest and put together a clear list of the data you'll need.
        </p>
      </header>

      {/* Policy objectives */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-foreground">What does your city want to improve?</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {totalSelected} selected
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick as many goals as you like. They're sorted by topic to make it easier to find what you need.
        </p>

        <div className="mt-8 space-y-8">
          {themes.map((group) => (
            <div key={group.theme}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  {group.theme}
                </h3>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.objectives.map((obj) => {
                  const active = selected.has(obj.id);
                  return (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => toggle(obj.id)}
                      className={[
                        "group flex items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition-all",
                        active
                          ? "border-primary bg-primary/5 text-foreground shadow-card"
                          : "border-border bg-surface-elevated text-foreground hover:border-primary/40 hover:bg-muted",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      <span
                        className={[
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background",
                        ].join(" ")}
                        aria-hidden
                      >
                        {active && (
                          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="leading-snug">{obj.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Implementation level */}
      <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <h2 className="font-serif text-2xl text-foreground">Where is your city today?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Don't overthink it — pick the option that best describes where you are right now.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {LEVELS.map((l) => {
            const active = level === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className={[
                  "rounded-lg border p-5 text-left transition-all",
                  active
                    ? "border-primary bg-primary/5 shadow-card"
                    : "border-border bg-surface-elevated hover:border-primary/40 hover:bg-muted",
                ].join(" ")}
                aria-pressed={active}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-xl text-foreground">{l.title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {l.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* City + Generate */}
      <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label htmlFor="city" className="font-serif text-2xl text-foreground">
              Your city's name <span className="text-sm font-sans text-muted-foreground">(optional)</span>
            </label>
            <p className="mt-2 text-sm text-muted-foreground">
              Adding a name makes your plan feel more personal. We don't save anything.
            </p>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Bologna, Lisbon, Helsinki"
              className="mt-4 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Show me my plan
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {!canSubmit && (
          <p className="mt-4 text-xs text-muted-foreground">
            Pick at least one goal above to continue.
          </p>
        )}
      </section>
    </div>
  );
}
