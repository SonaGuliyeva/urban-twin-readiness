import { createFileRoute, Link } from "@tanstack/react-router";
import { TurinStory } from "@/components/turin/turin-story";
import { TurinViewer } from "@/components/turin/turin-viewer";
import { getDatasetsForObjectives } from "@/data";
import { encodeStatus, type HaveStatus, type StatusMap } from "@/components/results/readiness";

/**
 * The objectives, starting point and data Turin held before the study, written as an answer to
 * this tool's own assessment. The link below opens the resulting profile, so that what the tool
 * recommends can be read against what Turin in fact added and what came out of it.
 */
const TURIN_OBJECTIVES = ["flood-risk", "uhi", "drought", "green-infra"];
const TURIN_ANSWERS: Record<string, HaveStatus> = {
  "High-Resolution Digital Elevation Model (DEM/DTM)": "have",
  "Urban Morphology & Building Heights": "have",
  "Critical Infrastructure & Exposure Layer": "have",
  "Park & Green Asset Inventory": "have",
  "Flood Hazard & Risk Maps": "partial",
  "Urban Tree Canopy & Green Space Maps": "partial",
};

function turinSearch() {
  const pool = getDatasetsForObjectives(TURIN_OBJECTIVES, "status", false);
  const status: StatusMap = {};
  for (const d of pool) status[d.name] = TURIN_ANSWERS[d.name] ?? "missing";
  return {
    objectives: TURIN_OBJECTIVES.join(","),
    level: "status" as const,
    start: "status",
    have: encodeStatus(pool.map((d) => d.name), status),
    city: "Turin",
  };
}

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

      <section className="mt-12 rounded-lg border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-foreground">Turin's own assessment</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-foreground/85">
          Before the study, Turin had a static 3D model with terrain, building heights and road
          condition, and no environmental data in it. Those are its answers to this assessment, for
          the four objectives above.
        </p>
        <p className="mt-3 max-w-3xl leading-relaxed text-foreground/85">
          Most of what the profile asks for is what Turin went on to add. What it left out, rainfall
          and soil moisture records and radar images, is what the results could not then speak
          about.
        </p>
        <Link
          to="/results"
          search={turinSearch()}
          className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Open Turin's data profile &rarr;
        </Link>
      </section>

      <Link
        to="/configure"
        className="mt-8 inline-flex items-center rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
      >
        Build a data profile for your city &rarr;
      </Link>
    </div>
  );
}
