import { createFileRoute, Link } from "@tanstack/react-router";
import { TurinViewer } from "@/components/turin/turin-viewer";

export const Route = createFileRoute("/turin")({
  head: () => ({
    meta: [
      { title: "Turin object screening — UrbanTwinReadiness" },
      {
        name: "description",
        content:
          "Interactive 3D view of the Turin city model, with satellite-derived heat, drought and flood indicators attached to individual city objects.",
      },
    ],
  }),
  component: TurinPage,
});

function TurinPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs font-semibold text-accent">
        Worked example &middot; Turin
      </p>
      <h1 className="mt-2 text-3xl text-foreground sm:text-4xl">
        What satellite data look like on the objects of a city model
      </h1>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
        Each indicator is stored as an attribute of a city object, with the geometry and date it was
        measured over. This is how open satellite data, even at coarse resolution, become usable in
        an Urban Digital Twin, and how finer sources can be added later without changing the model.
      </p>

      <div className="mt-8">
        <TurinViewer />
      </div>

      <p className="mt-4 max-w-4xl text-xs leading-relaxed text-muted-foreground">
        Sentinel-2 (10&ndash;20&nbsp;m) &middot; SDGSAT-1 thermal (30&nbsp;m,
        22&nbsp;July&nbsp;2022) &middot; airborne imagery and LiDAR (5&nbsp;cm / 0.5&nbsp;m,
        January&nbsp;2022) &middot; PGRA flood hazard maps &middot; Copernicus EMS EMSR192
        (November&nbsp;2016). City objects derived from Citt&agrave; di Torino open geodata,{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-foreground"
        >
          CC&nbsp;BY&nbsp;4.0
        </a>
        . Screening and prioritisation, not detailed design.
      </p>

      <Link
        to="/configure"
        className="mt-8 inline-flex items-center rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
      >
        Build a data profile for your city &rarr;
      </Link>
    </div>
  );
}
