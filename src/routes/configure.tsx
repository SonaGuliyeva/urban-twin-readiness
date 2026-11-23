import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CORE_OBJECTIVE_IDS,
  EO_FIT_LABEL,
  POLICY_THEMES,
  getDatasetsForObjectives,
  type ImplementationLevel,
} from "@/data";
import { PLAIN_DATASETS } from "@/data/plain-language";
import {
  START_OPTIONS,
  STATUS_OPTIONS,
  encodeStatus,
  prefillFor,
  type HaveStatus,
  type StartKey,
  type StatusMap,
} from "@/components/results/readiness";

export const Route = createFileRoute("/configure")({
  head: () => ({
    meta: [
      { title: "Configurator — UrbanTwinReadiness" },
      {
        name: "description",
        content:
          "Select your policy objectives and technical maturity level to generate a minimum data requirements profile for your Urban Digital Twin.",
      },
    ],
  }),
  component: ConfigurePage,
});

// Technical Maturity Levels, as used in the author's related Urban Digital Twin survey
// instrument (national and subnational government questionnaires).

function ConfigurePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [start, setStart] = useState<StartKey>("status");
  const [status, setStatus] = useState<StatusMap>({});
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

  const objectiveById = useMemo(
    () => new Map(POLICY_THEMES.flatMap((g) => g.objectives).map((o) => [o.id, o])),
    [],
  );
  const plannedThemes = useMemo(
    () =>
      POLICY_THEMES.map((g) => ({
        theme: g.theme,
        objectives: g.objectives.filter((o) => !CORE_OBJECTIVE_IDS.includes(o.id)),
      })).filter((g) => g.objectives.length > 0),
    [],
  );

  // All datasets for the chosen objectives (full pool, independent of level)
  const pool = useMemo(
    () => getDatasetsForObjectives(Array.from(selected), "predictive"),
    [selected],
  );
  const poolNames = useMemo(() => pool.map((d) => d.name), [pool]);

  const chooseStart = (k: StartKey) => {
    setStart(k);
    setStatus(prefillFor(k, pool));
  };
  // Apply the suggested answers once the first objectives are chosen
  const [prefilled, setPrefilled] = useState(false);
  if (!prefilled && pool.length > 0) {
    setPrefilled(true);
    setStatus(prefillFor(start, pool));
  }
  const titleOf = (n: string) => PLAIN_DATASETS[n]?.title ?? n;
  // Rows: one per plain-language title (two datasets can describe the same thing)
  const rows = useMemo(() => {
    const seen = new Set<string>();
    return pool.filter((d) => {
      const t = titleOf(d.name);
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    });
  }, [pool]);
  const setOne = (name: string, v: HaveStatus | undefined) =>
    setStatus((prev) => {
      const next = { ...prev };
      for (const d of pool) {
        if (titleOf(d.name) !== titleOf(name)) continue;
        if (v) next[d.name] = v;
        else delete next[d.name];
      }
      return next;
    });
  const level: ImplementationLevel = start === "none" ? "status" : start;

  const handleGenerate = () => {
    if (!canSubmit) return;
    navigate({
      to: "/results",
      search: {
        objectives: Array.from(selected).join(","),
        level,
        start,
        have: encodeStatus(poolNames, status),
        city: city.trim() || undefined,
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="mb-10">
        <p className="text-xs font-semibold text-muted-foreground">Configurator</p>
        <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">Define your assessment</h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Choose your objectives, say where your city starts, and tell us which data you already
          have. You get a readiness score and a list of what to add first.
        </p>
      </header>

      {/* Policy objectives */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-foreground">Policy objectives</h2>
          <span className="font-mono text-xs text-muted-foreground">{totalSelected} selected</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Select the objectives that matter to your city. The first version covers the ones that can
          be selected now.
        </p>

        <div className="mt-6 space-y-6">
          {POLICY_THEMES.map((group) => (
            <details
              key={group.theme}
              open={group.objectives.some((o) => CORE_OBJECTIVE_IDS.includes(o.id))}
              className="group rounded-lg border border-border"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm font-semibold text-foreground">{group.theme}</span>
                <span className="text-xs text-muted-foreground">
                  {group.objectives.filter((o) => selected.has(o.id)).length > 0
                    ? `${group.objectives.filter((o) => selected.has(o.id)).length} selected · `
                    : ""}
                  {group.objectives.filter((o) => CORE_OBJECTIVE_IDS.includes(o.id)).length > 0
                    ? `${group.objectives.filter((o) => CORE_OBJECTIVE_IDS.includes(o.id)).length} available now`
                    : `${group.objectives.length} planned`}
                </span>
              </summary>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 px-4 pb-4">
                {group.objectives.map((obj) => {
                  const available = CORE_OBJECTIVE_IDS.includes(obj.id);
                  const active = selected.has(obj.id);
                  return (
                    <button
                      key={obj.id}
                      type="button"
                      disabled={!available}
                      onClick={() => toggle(obj.id)}
                      aria-pressed={available ? active : undefined}
                      title={obj.eoFit ? EO_FIT_LABEL[obj.eoFit] : undefined}
                      className={[
                        "flex items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition-all",
                        !available
                          ? "cursor-not-allowed border-dashed border-border bg-muted/30 text-muted-foreground"
                          : active
                            ? "border-primary bg-primary/10 text-foreground shadow-card"
                            : "border-border bg-white text-foreground hover:border-primary/50",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                          !available
                            ? "border-border bg-transparent"
                            : active
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-white",
                        ].join(" ")}
                        aria-hidden
                      >
                        {available && active && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-3 w-3"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="leading-snug">
                        {obj.label}
                        {!available && (
                          <span className="mt-0.5 block text-xs opacity-70">Planned</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Objectives marked Planned will be added in later versions. Objectives can be combined; the
          data list merges them.
        </p>
      </section>

      {/* Starting point */}
      <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <h2 className="font-serif text-2xl text-foreground">Where does your city start?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick the closest description of what you have today. It fills in the data list below, and
          you can change any answer.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {START_OPTIONS.map((o) => {
            const active = start === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => chooseStart(o.id)}
                aria-pressed={active}
                className={[
                  "rounded-lg border p-4 text-left transition-all",
                  active
                    ? "border-primary bg-primary/5 shadow-card"
                    : "border-border bg-surface-elevated hover:border-primary/40 hover:bg-muted",
                ].join(" ")}
              >
                <span className="font-serif text-lg text-foreground">{o.title}</span>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{o.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Data checklist */}
      <details className="group mt-8 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <summary className="cursor-pointer list-none">
          <span className="font-serif text-2xl text-foreground">
            Optional: mark the data you already have
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Skip this if you are not sure. You still get the minimum free satellite data to start
            with.
          </span>
        </summary>
        <div className="mt-6">
          {pool.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Choose at least one objective above and the data list appears here.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                For each item: is it already in your digital twin, do you have it but not in the
                twin, or do you not have it? Leave an item blank if you are not sure.
              </p>
              <ul className="mt-6 divide-y divide-border">
                {rows.map((d) => {
                  const plain = PLAIN_DATASETS[d.name];
                  const cur = status[d.name];
                  return (
                    <li
                      key={d.name}
                      className="grid gap-3 py-4 md:grid-cols-[1fr_auto] md:items-center"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {plain ? plain.title : d.name}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {plain?.what}
                          {d.priority === "essential" && (
                            <span className="ml-2 text-xs font-semibold text-essential">
                              Must have
                            </span>
                          )}
                          {d.source === "satellite" && (
                            <span className="ml-2 text-xs font-semibold text-eo">
                              Free satellite data
                            </span>
                          )}
                        </p>
                      </div>
                      <div
                        role="group"
                        aria-label={`Status of ${d.name}`}
                        className="grid min-w-[17rem] grid-cols-3 overflow-hidden rounded-md border border-border text-xs"
                      >
                        {STATUS_OPTIONS.map((o) => {
                          const active = cur === o.id;
                          const on =
                            o.id === "have"
                              ? "bg-accent text-accent-foreground"
                              : o.id === "partial"
                                ? "bg-recommended text-white"
                                : "bg-foreground/70 text-background";
                          return (
                            <button
                              key={o.id}
                              type="button"
                              title={o.long}
                              aria-pressed={active}
                              onClick={() => setOne(d.name, active ? undefined : o.id)}
                              className={`px-2 py-2 ${o.id !== "have" ? "border-l border-border" : ""} ${
                                active ? on : "bg-card text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {o.short}
                            </button>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </details>

      {/* City + Generate */}
      <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label htmlFor="city" className="font-serif text-2xl text-foreground">
              City name <span className="text-sm font-sans text-muted-foreground">(optional)</span>
            </label>
            <p className="mt-2 text-sm text-muted-foreground">
              Used only to label the generated profile. No data is stored.
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
            See your readiness
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
        </div>
        {!canSubmit && (
          <p className="mt-4 text-xs text-muted-foreground">
            Select at least one policy objective to continue.
          </p>
        )}
      </section>
    </div>
  );
}
