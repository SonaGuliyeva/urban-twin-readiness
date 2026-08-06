import type { OpenSpatialLayer } from "@/data/types";

export function OSLayerCard({ layer }: { layer: OpenSpatialLayer }) {
  return (
    <a
      href={layer.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-lg leading-snug text-foreground">{layer.name}</h3>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{layer.description}</p>
      <dl className="mt-4 grid grid-cols-1 gap-2 border-t border-border pt-3 text-xs">
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 font-mono uppercase tracking-[0.12em] text-muted-foreground">
            Provider
          </dt>
          <dd className="text-foreground/85">{layer.provider}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 font-mono uppercase tracking-[0.12em] text-muted-foreground">
            Coverage
          </dt>
          <dd className="text-foreground/85">{layer.coverage}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 font-mono uppercase tracking-[0.12em] text-muted-foreground">
            Access
          </dt>
          <dd className="text-foreground/85">{layer.access}</dd>
        </div>
      </dl>
    </a>
  );
}
