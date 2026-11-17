import type { Dataset } from "@/data/types";
import { PLAIN_DATASETS } from "@/data/plain-language";
import { summarise, type StatusMap } from "./readiness";

export function ReadinessPanel({
  datasets,
  status,
  onReset,
  platforms = [],
}: {
  datasets: Dataset[];
  status: StatusMap;
  onReset: () => void;
  platforms?: { name: string; description: string; url: string }[];
}) {
  const s = summarise(datasets, status);
  const pct = (n: number) => (s.total ? (n / s.total) * 100 : 0);
  const readiness = Math.round(pct(s.have));
  const started = s.answered > 0;
  const rank = { essential: 0, recommended: 1, optional: 2 } as const;
  const seenTitles = new Set<string>();
  const gaps = [...s.gaps]
    .sort((a, b) => rank[a.priority] - rank[b.priority])
    // two datasets can share one plain-language title: list it once
    .filter((d) => {
      const t = PLAIN_DATASETS[d.name]?.title ?? d.name;
      if (seenTitles.has(t)) return false;
      seenTitles.add(t);
      return true;
    });
  const eoGaps = gaps.filter((d) => d.source === "satellite").length;

  return (
    <article className="rounded-xl border border-accent/40 bg-accent/5 p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-accent">How ready is your city?</p>
          <h3 className="mt-1 font-serif text-xl text-foreground">
            Which of these data do you already have?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Answer Yes, Have it but not in the twin, or No for each item below. The result updates
            as you answer.
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
            <span className="font-medium text-foreground">{s.have}</span> of {s.total} data items
            are ready in your twin
            {s.essentialTotal > 0 && (
              <>
                {" · "}must have:{" "}
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
            <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Ready in twin ({s.have})
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-recommended" /> Have it, not in the twin (
            {s.partial})
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/35" /> Do not have ({s.missing})
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
          <p className="text-xs font-semibold text-muted-foreground">
            What to get next, most important first
          </p>
          {gaps.length === 0 ? (
            <p className="mt-2 text-sm text-foreground/85">
              Everything important is already in your twin.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-foreground/85">
                {gaps.length} important {gaps.length === 1 ? "item is" : "items are"} not yet in
                your twin
                {eoGaps > 0 && (
                  <>
                    ; <span className="font-medium text-eo">{eoGaps}</span> can be obtained free
                    from satellites
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
                    <span className="text-foreground/90">
                      {PLAIN_DATASETS[d.name]?.title ?? d.name}
                    </span>
                    <span className="flex shrink-0 gap-1">
                      {d.source === "satellite" && (
                        <span className="rounded border border-eo/30 bg-eo/10 px-1.5 py-0.5 text-[11px] font-semibold text-eo">
                          Free
                        </span>
                      )}
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[11px] font-semibold ${
                          d.priority === "essential"
                            ? "border-essential/30 bg-essential/10 text-essential"
                            : "border-recommended/30 bg-recommended/10 text-recommended"
                        }`}
                      >
                        {d.priority === "essential" ? "Must have" : "Good to have"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {eoGaps > 0 && platforms.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground">
                Where to get the free satellite data
              </p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {platforms.map((p) => (
                  <li key={p.name}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-md border border-border bg-card px-3 py-2 text-sm hover:border-eo/50 hover:bg-muted"
                    >
                      <span className="font-medium text-eo">{p.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {p.description}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
