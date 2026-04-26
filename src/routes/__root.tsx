import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Error 404</p>
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
      { title: "UrbanTwinReadiness — Data Requirements for Urban Digital Twins" },
      {
        name: "description",
        content:
          "A decision-support tool helping cities identify the minimum datasets and Earth Observation inputs needed to develop Urban Digital Twins for urban environmental management.",
      },
      { property: "og:title", content: "UrbanTwinReadiness — Data Requirements for Urban Digital Twins" },
      {
        property: "og:description",
        content:
          "Assessing the minimum data requirements for Urban Digital Twins in urban environmental management.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "UrbanTwinReadiness — Data Requirements for Urban Digital Twins" },
      { name: "description", content: "UrbanTwinReadiness assesses minimum data and EO needs for Urban Digital Twins in environmental management." },
      { property: "og:description", content: "UrbanTwinReadiness assesses minimum data and EO needs for Urban Digital Twins in environmental management." },
      { name: "twitter:description", content: "UrbanTwinReadiness assesses minimum data and EO needs for Urban Digital Twins in environmental management." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bcb206c5-d8be-46df-a88a-018596ea5e04/id-preview-dcf6548b--4cc2f126-1d58-4e1a-9550-02913e5d1557.lovable.app-1776872212161.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bcb206c5-d8be-46df-a88a-018596ea5e04/id-preview-dcf6548b--4cc2f126-1d58-4e1a-9550-02913e5d1557.lovable.app-1776872212161.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
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
  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-gradient text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-base text-foreground">UrbanTwinReadiness</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Decision-support prototype
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground" }}
          >
            Overview
          </Link>
          <Link
            to="/configure"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Configurator
          </Link>
          <Link
            to="/about"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

function AboutThisTool() {
  return (
    <section className="mt-24 border-t border-border/70 bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v.01M11 12h1v4h1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="font-serif text-lg text-foreground">About this tool</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Author
            </p>
            <p className="text-sm text-foreground">Sona Guliyeva</p>
            <p className="text-xs text-muted-foreground">
              PhD Candidate, Politecnico di Torino
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Description
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              UrbanTwinReadiness is a research-driven prototype that supports cities in
              identifying the minimum data requirements for Urban Digital Twin development
              in urban environmental management.
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Research reference
            </p>
            <p className="text-sm text-foreground">
              Guliyeva, S., &amp; Boccardo, P. (2026).{" "}
              <span className="italic">Geospatial Technologies for Flood and Drought Management.</span>{" "}
              Aerotecnica Missili &amp; Spazio.
            </p>
            <a
              href="https://doi.org/10.1007/s42496-026-00309-4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs text-primary underline-offset-4 hover:underline"
            >
              DOI: 10.1007/s42496-026-00309-4
            </a>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Repository
            </p>
            <a
              href="https://github.com/SonaGuliyeva/urban-twin-readiness"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              github.com/SonaGuliyeva/urban-twin-readiness
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>UrbanTwinReadiness · Research prototype for urban environmental management.</p>
          <p className="font-mono uppercase tracking-[0.18em]">v0.1 · MVP</p>
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
      <SiteFooter />
    </div>
  );
}
