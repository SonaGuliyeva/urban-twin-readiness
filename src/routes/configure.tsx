import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { POLICY_THEMES, type ImplementationLevel } from "@/data";

export const Route = createFileRoute("/configure")({
  head: () => ({
    meta: [
      { title: "Start — UrbanTwinReadiness" },
      {
        name: "description",
        content: "Pick your goals and your city's current level to get a minimum data list.",
      },
    ],
  }),
  component: ConfigurePage,
});

// Technical maturity levels (same 5-level model as the author's UDT survey),
// described here in one plain sentence each.
const LEVELS: { id: ImplementationLevel; n: number; title: string; desc: string }[] = [
  { id: "status", n: 1, title: "Static model", desc: "We have a 2D/3D map of the city." },
  { id: "informative", n: 2, title: "Analytical", desc: "We combine data in dashboards." },
  { id: "predictive", n: 3, title: "Predictive", desc: "We forecast or simulate." },
  { id: "optimisation", n: 4, title: "Prescriptive", desc: "We test scenarios to decide." },
  { id: "autonomous", n: 5, title: "Autonomous", desc: "Real-time data triggers actions." },
];

function ConfigurePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [level, setLevel] = useState<ImplementationLevel>("status");
  const [city, setCity] = useState("");

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const canSubmit = selected.size > 0;

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
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl text-foreground sm:text-5xl">Your city</h1>

      {/* Step 1 — goals, grouped by domain, each domain collapsed */}
      <section className="mt-10">
        <StepTitle n={1} title="What do you want to manage?" note={`${selected.size} selected`} />
        <div className="mt-4 space-y-2">
          {POLICY_THEMES.map((group) => {
            const count = group.objectives.filter((o) => selected.has(o.id)).length;
            return (
              <details
                key={group.theme}
                className="group rounded-lg border border-border bg-card [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{group.theme}</span>
                  <span className="flex items-center gap-2">
                    {count > 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                        {count}
                      </span>
                    )}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
                  {group.objectives.map((obj) => {
                    const active = selected.has(obj.id);
                    return (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => toggle(obj.id)}
                        aria-pressed={active}
                        className={[
                          "rounded-full border px-3 py-1.5 text-sm transition-colors",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-surface-elevated text-foreground hover:border-primary/40",
                        ].join(" ")}
                      >
                        {obj.label}
                      </button>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* Step 2 — maturity level */}
      <section className="mt-12">
        <StepTitle n={2} title="Where is your city today?" />
        <div className="mt-4 space-y-2" role="radiogroup">
          {LEVELS.map((l) => {
            const active = level === l.id;
            return (
              <button
                key={l.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setLevel(l.id)}
                className={[
                  "flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {l.n}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{l.title}</span>
                  <span className="block text-sm text-muted-foreground">{l.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 3 — city + go */}
      <section className="mt-12">
        <StepTitle n={3} title="City name" note="optional" />
        <input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Turin"
          aria-label="City name"
          className="mt-4 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canSubmit}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Show my data list
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {!canSubmit && <p className="text-xs text-muted-foreground">Pick at least one goal.</p>}
      </div>
    </div>
  );
}

function StepTitle({ n, title, note }: { n: number; title: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="font-serif text-2xl text-foreground">
        <span className="mr-2 text-accent">{n}.</span>
        {title}
      </h2>
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </div>
  );
}
