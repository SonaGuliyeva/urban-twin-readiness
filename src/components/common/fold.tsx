import type { ReactNode } from "react";

/**
 * Collapsible section built on native <details>. Closed by default so the
 * page stays short; everything is opened automatically before printing
 * (see the beforeprint handler in the results page).
 */
export function Fold({
  title,
  hint,
  children,
  defaultOpen = false,
  id,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
}) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group rounded-lg border border-border bg-card shadow-card [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <span className="min-w-0">
          <span className="block font-serif text-lg text-foreground">{title}</span>
          {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-border px-5 py-5">{children}</div>
    </details>
  );
}
