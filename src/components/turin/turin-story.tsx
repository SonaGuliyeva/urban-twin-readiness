/**
 * Turin worked example in three steps: what the city already had, what open satellite data
 * added, what it made possible. All facts and figures are from thesis Chapter 3.
 */
const COLUMNS = [
  {
    title: "What the road digital twin already had",
    tone: "border-foreground/40",
    items: [
      "The city's official topographic map at 1:1000, with the road network split into segments.",
      "A 3D city model from an airborne survey in January 2022: 5 cm photos plus LiDAR terrain and surface models.",
      "The condition of the road pavement, scanned from a survey vehicle in February 2025.",
    ],
    note: "This twin was built for roads. One airborne survey shows the city at a single moment, in winter, so it cannot show how conditions change through the year.",
  },
  {
    title: "What was added for the environment",
    tone: "border-eo",
    items: [
      "Free Sentinel-2 images (10 m, every five days): four dates in 2022 for plants and water, plus April and August of every year from 2018 to 2025.",
      "A thermal satellite image (SDGSAT-1, 30 m, 22 July 2022) for surface temperature, checked against Landsat 8/9.",
      "The official flood hazard maps of the Po River District (PGRA), which the twin did not have.",
    ],
    note: "The existing detailed data stayed the base. Satellites added change over time, and the hazard maps added flood exposure.",
  },
  {
    title: "What it made possible",
    tone: "border-primary",
    items: [
      "Vegetation, water, sealed surface, tree canopy, terrain and surface temperature stored on every road segment.",
      "82 road segments screened: 61 flagged by at least one of four criteria (drought impact on roadside plants 40, green space deficit 24, surface heat 21, flood exposure 9).",
      "The same steps applied to 5,918 city objects of six classes.",
      "An eight-year record that picked out 2022 and 2025 as the unusually dry summers, without being told which years to look for.",
    ],
    note: "Flood exposure came from the hazard maps. Satellite data supplied heat, plant stress and the history.",
  },
];

export function TurinStory() {
  return (
    <section aria-labelledby="turin-story" className="mt-10">
      <h2 id="turin-story" className="font-serif text-2xl text-foreground sm:text-3xl">
        How Turin did it
      </h2>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {COLUMNS.map((c, i) => (
          <article key={c.title} className={`border-t-4 pt-4 ${c.tone}`}>
            <h3 className="font-serif text-xl text-foreground">
              {i + 1}. {c.title}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {c.items.map((t) => (
                <li key={t} className="text-sm leading-relaxed text-foreground/85">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        The road digital twin is the work of Scolamiero and Boccardo (
        <a
          href="https://doi.org/10.3390/s26030947"
          target="_blank"
          rel="noreferrer"
          className="text-eo underline-offset-2 hover:underline"
        >
          2026
        </a>
        ); the environmental enrichment with satellite data and flood hazard maps is the work
        presented in this thesis. Your city can follow the same path: keep the detailed data you
        have, and add free satellite data to see how things change. The 3D view below shows the
        result on individual city objects.
      </p>
    </section>
  );
}
