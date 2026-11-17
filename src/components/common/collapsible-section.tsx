import { useEffect, useState, type ReactNode } from "react";

/**
 * A results-page section that is collapsed by default.
 * - Opens automatically when the URL hash points at it (e.g. via the jump-to nav).
 * - Always expanded when printing / exporting.
 */
export function CollapsibleSection({
  id,
  eyebrow,
  title,
  hint,
  defaultOpen = false,
  className = "mt-10",
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  hint?: string;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const openIfTargeted = () => {
      if (window.location.hash === `#${id}`) {
        setOpen(true);
        requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
      }
    };
    openIfTargeted();
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [id]);

  return (
    <section
      id={id}
      className={`scroll-mt-16 rounded-xl border border-border bg-card shadow-card ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-body`}
        className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6 print:cursor-default"
      >
        <span>
          <span className="block text-xs font-semibold text-accent">
            {eyebrow}
          </span>
          <span className="mt-1 block font-serif text-xl text-foreground sm:text-2xl">{title}</span>
          {hint && !open && (
            <span className="mt-1 block text-sm text-muted-foreground">{hint}</span>
          )}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform print:hidden ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id={`${id}-body`}
        className={`border-t border-border p-5 sm:p-6 ${open ? "" : "hidden print:block"}`}
      >
        {children}
      </div>
    </section>
  );
}
