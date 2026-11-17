import type { DataLink } from "@/data/dataset-links";

/** Row of direct links to the portals where a dataset can be found. */
export function DataLinks({
  links,
  label = "Open the data",
}: {
  links: DataLink[];
  label?: string;
}) {
  if (links.length === 0) return null;
  return (
    <div className="mt-3 print:hidden">
      <p className="text-xs font-semibold text-foreground/80">{label}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-eo/30 bg-eo/10 px-2 py-1 text-xs font-medium text-eo hover:bg-eo/20"
            >
              {l.label}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden
              >
                <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
