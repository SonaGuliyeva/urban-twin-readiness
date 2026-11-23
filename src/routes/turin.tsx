import { createFileRoute, Link } from "@tanstack/react-router";
import { TurinStory } from "@/components/turin/turin-story";
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
      <p className="text-xs font-semibold text-accent">Worked example &middot; Turin</p>
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

      <TurinStory />

      <Link
        to="/configure"
        className="mt-8 inline-flex items-center rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
      >
        Build a data profile for your city &rarr;
      </Link>
    </div>
  );
}
