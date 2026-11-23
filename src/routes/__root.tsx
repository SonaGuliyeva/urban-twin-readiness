import { useState } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold text-muted-foreground">Error 404</p>
        <h1 className="mt-3 text-5xl text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UrbanTwinReadiness: a web-based decision-support tool" },
      {
        name: "description",
        content:
          "A decision-support tool helping cities identify the minimum datasets and Earth Observation inputs needed to develop Urban Digital Twins for urban environmental management.",
      },
      {
        property: "og:title",
        content: "UrbanTwinReadiness — Data Requirements for Urban Digital Twins",
      },
      {
        property: "og:description",
        content:
          "Assessing the minimum data requirements for Urban Digital Twins in urban environmental management.",
      },
      { property: "og:type", content: "website" },
      {
        name: "twitter:title",
        content: "UrbanTwinReadiness — Data Requirements for Urban Digital Twins",
      },
      {
        name: "description",
        content:
          "UrbanTwinReadiness assesses minimum data and EO needs for Urban Digital Twins in environmental management.",
      },
      {
        property: "og:description",
        content:
          "UrbanTwinReadiness assesses minimum data and EO needs for Urban Digital Twins in environmental management.",
      },
      {
        name: "twitter:description",
        content:
          "UrbanTwinReadiness assesses minimum data and EO needs for Urban Digital Twins in environmental management.",
      },
      {
        property: "og:image",
        content: "https://urban-twin-readiness.sona-guliyeva.workers.dev/og-image.png",
      },
      {
        name: "twitter:image",
        content: "https://urban-twin-readiness.sona-guliyeva.workers.dev/og-image.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { to: "/", label: "Overview", exact: true },
    { to: "/configure", label: "Configurator", exact: false },
    { to: "/turin", label: "Turin example", exact: false },
    { to: "/about", label: "About", exact: false },
  ] as const;

  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-gradient text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <rect x="3.20" y="18.20" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="3.20" y="14.90" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="6.50" y="18.20" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="6.50" y="14.90" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="6.50" y="11.60" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="6.50" y="8.30" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="9.80" y="18.20" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="9.80" y="14.90" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="9.80" y="11.60" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="9.80" y="8.30" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="9.80" y="5.00" width="2.8" height="2.8" rx="0.55" fill="#BFF3EC" />
              <rect x="13.10" y="18.20" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="13.10" y="14.90" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect
                x="13.10"
                y="11.60"
                width="2.8"
                height="2.8"
                rx="0.55"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.95"
              />
              <rect x="16.40" y="18.20" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
              <rect x="16.40" y="14.90" width="2.8" height="2.8" rx="0.55" fill="currentColor" />
            </svg>
          </span>
          <div className="flex min-w-0 flex-col leading-none">
            <span className="font-serif text-base text-foreground">UrbanTwinReadiness</span>
            <span className="hidden text-xs font-semibold text-muted-foreground sm:block">
              Decision-support prototype
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden shrink-0 items-center gap-6 text-sm sm:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeOptions={l.exact ? { exact: true } : undefined}
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground sm:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth="2"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav className="border-t border-border/70 bg-background px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeOptions={l.exact ? { exact: true } : undefined}
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function AboutThisTool() {
  const link = "text-primary underline-offset-4 hover:underline";
  return (
    <section className="mt-24 border-t border-border/70 bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="font-serif text-lg text-foreground">Credits</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          UrbanTwinReadiness, a web-based decision-support tool. Research prototype, version 1.0.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">Author</p>
            <p className="text-sm text-foreground">Sona Guliyeva</p>
            <p className="text-xs text-muted-foreground">
              PhD candidate, Politecnico di Torino, Italy
            </p>
            <p className="text-xs text-muted-foreground">Supervisor: Prof. Piero Boccardo</p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="text-xs font-semibold text-muted-foreground">Funding</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This research is part of a PhD funded by the Italian National Recovery and Resilience
              Plan (PNRR), Mission 4, Component 1, Investment 3.4, under Ministerial Decree No. 118
              of 2 March 2023 (NextGenerationEU).
            </p>
          </div>

          <div className="md:col-span-3">
            <a
              href="https://github.com/SonaGuliyeva/urban-twin-readiness"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm ${link}`}
            >
              Source code on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AboutThisTool />
    </div>
  );
}
