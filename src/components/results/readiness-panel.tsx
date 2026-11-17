import type { Dataset } from "@/data/types";
import { summarise, type StatusMap } from "./readiness";

export function ReadinessPanel({
  datasets,
  status,
  onReset,
}: {
  datasets: Dataset[];
  status: StatusMap;
  onReset: () => void;
}) {
  const s = summarise(datasets, status);
  const pct = (n: number) => (s.total ? (n / s.total) * 100 : 0);
  const readiness = Math.round(pct(s.have));
  const started = s.answered > 0;
  const gaps = [...s.gaps].sort((a, b) => {
    const rank = { essential: 0, recommended: 1, optional: 2 } as const;
    return rank[a.priority] - rank[b.priority];
  });
  const eoGaps = gaps.filter((d) => d.source === "satellite").length;

  return (
    <article className="mt-6 rounded-xl border border-accent/40 bg-accent/5 p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            Your readiness
          </p>
          <h3 className="mt-1 font-serif text-xl text-foreground">
            Which of these data does your twin already have?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Mark each dataset below. The bar and the gap list update as you go.
          </p>
        </div>
        {started && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground print:hidden"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between gap-3">
          <p className="font-serif text-4xl leading-none text-foreground">
            {readiness}
            <span className="text-xl text-muted-foreground">%</span>
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{s.have}</span> of {s.total} datasets in
            your twin
            {s.essentialTotal > 0 && (
              <>
                {" · "}essential:{" "}
                <span className="font-medium text-foreground">
                  {s.essentialHave} of {s.essentialTotal}
                </span>
              </>
            )}
          </p>
        </div>

        <div
          className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-muted"
          role="img"
          aria-label={`${s.have} in twin, ${s.partial} not integrated, ${s.missing} missing, ${s.unanswered} not answered`}
        >
          <div className="bg-accent transition-all" style={{ width: `${pct(s.have)}%` }} />
          <div className="bg-recommended transition-all" style={{ width: `${pct(s.partial)}%` }} />
          <div
            className="bg-foreground/35 transition-all"
            style={{ width: `${pct(s.missing)}%` }}
          />
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" /> In twin ({s.have})
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-recommended" /> Have it, not integrated (
            {s.partial})
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/35" /> Missing ({s.missing})
          </li>
          {s.unanswered > 0 && (
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-border bg-muted" /> Not
              answered ({s.unanswered})
            </li>
          )}
        </ul>
      </div>

      {started && (
        <div className="mt-6 border-t border-accent/30 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Gaps to close, most important first
          </p>
          {gaps.length === 0 ? (
            <p className="mt-2 text-sm text-foreground/85">
              All essential and recommended datasets are in your twin.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-foreground/85">
                {gaps.length} essential or recommended {gaps.length === 1 ? "dataset is" : "datasets are"} not
                yet in your twin
                {eoGaps > 0 && (
                  <>
                    ; <span className="font-medium text-eo">{eoGaps}</span> could be sourced from
                    open satellite data
                  </>
                )}
                .
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {gaps.map((d) => (
                  <li
                    key={d.name}
                    className="flex items-start justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span className="text-foreground/90">{d.name}</span>
                    <span className="flex shrink-0 gap-1">
                      {d.source === "satellite" && (
                        <span className="rounded border border-eo/30 bg-eo/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-eo">
                          EO
                        </span>
                      )}
                      <span
                        className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                          d.priority === "essential"
                            ? "border-essential/30 bg-essential/10 text-essential"
                            : "border-recommended/30 bg-recommended/10 text-recommended"
                        }`}
                      >
                        {d.priority === "essential" ? "Essential" : "Recomm."}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </article>
  );
}
