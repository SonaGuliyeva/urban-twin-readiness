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

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          UrbanTwinReadiness · Research prototype for urban environmental management.
        </p>
        <p className="font-mono uppercase tracking-[0.18em]">v0.1 · MVP</p>
      </div>
    </footer>
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
