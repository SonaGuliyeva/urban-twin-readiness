/**
 * Turin worked example: which data the city already had, what was added, how it was joined,
 * and what came out. All facts and figures are from thesis Chapter 3.
 */
type Row = { data: string; source: string; detail: string; gives: string };

const BASE: Row[] = [
  {
    data: "Road network and city objects",
    source: "City of Turin topographic database (1:1000, December 2025 edition)",
    detail: "Every road segment has a fixed ID (Road_ID)",
    gives: "The frame that every other dataset is attached to.",
  },
  {
    data: "Aerial photos and LiDAR",
    source: "Airborne survey (Leica CityMapper-2), January 2022",
    detail: "Photos at 5 cm; terrain and surface models",
    gives: "Terrain, sealed surfaces, tree canopy. A single winter snapshot.",
  },
  {
    data: "Pavement condition",
    source: "Survey vehicle scan (RIEGL VMY-2), January to February 2025",
    detail: "Pavement Condition Index per road",
    gives: "Road condition, kept next to the environmental values.",
  },
];

const ADDED: Row[] = [
  {
    data: "Sentinel-2 images",
    source: "Copernicus Data Space. Four dates in 2022, plus April and August of 2018 to 2025",
    detail: "10 m, a new image every five days",
    gives:
      "Plant health (NDVI), plant water (NDMI), open water (NDWI), and a history to compare 2022 against.",
  },
  {
    data: "Thermal satellite image",
    source: "SDGSAT-1, 22 July 2022",
    detail: "30 m, a new image every 11 days",
    gives: "Surface temperature. Shows the hottest road segments.",
  },
  {
    data: "Flood hazard maps",
    source: "Official maps of the Po River District (PGRA), updated January 2024",
    detail: "High, medium and low probability scenarios",
    gives: "Which segments lie in flood-prone areas. The twin did not have this before.",
  },
  {
    data: "Observed flood of 2016",
    source: "Copernicus Emergency Management Service, EMSR192",
    detail: "Mapped flood extent, November 2016",
    gives: "An independent check of the flood result.",
  },
];

const STEPS = [
  {
    t: "Give every road an ID",
    d: "Turin's own road ID stayed in the 3D model, so every new value knows which segment it belongs to.",
  },
  {
    t: "Measure around each road",
    d: "A 10 m strip for the 5 cm photos and a 30 m strip for the satellite pixels, so several pixels count and one odd pixel does not mislead.",
  },
  {
    t: "Store the value with its date",
    d: "Each value keeps its acquisition date and a label: measured, if the strip covers a whole satellite pixel, or context, if it does not.",
  },
];

const CHECKS = [
  {
    n: 40,
    t: "Drought impact on roadside plants",
    d: "Plants dried out more between April and August 2022 than in the seven other years (Sentinel-2).",
  },
  {
    n: 24,
    t: "Green space deficit",
    d: "Little vegetation in summer and more than 80% of the ground sealed (Sentinel-2 and airborne photos).",
  },
  {
    n: 21,
    t: "Surface heat",
    d: "Surface temperature in the hottest quarter of segments, above 41.2 °C (SDGSAT-1). Treated as a stress linked to drought.",
  },
  {
    n: 9,
    t: "Flood exposure",
    d: "At least 10% of the strip inside the medium-probability flood zone (PGRA). Where no official map exists, a terrain index from LiDAR can stand in.",
  },
];

function DataTable({ title, rows, tone }: { title: string; rows: Row[]; tone: string }) {
  return (
    <div className={`border-t-4 pt-4 ${tone}`}>
      <h3 className="font-serif text-xl text-foreground">{title}</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[44rem] table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-[17%]" />
            <col className="w-[33%]" />
            <col className="w-[22%]" />
            <col className="w-[28%]" />
          </colgroup>
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="py-2 pr-4 font-semibold">Data</th>
              <th className="py-2 pr-4 font-semibold">Source and date</th>
              <th className="py-2 pr-4 font-semibold">Detail</th>
              <th className="py-2 font-semibold">What it gives</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.data} className="border-t border-border align-top">
                <td className="py-3 pr-4 font-medium text-foreground">{r.data}</td>
                <td className="py-3 pr-4 text-foreground/85">{r.source}</td>
                <td className="py-3 pr-4 text-foreground/85">{r.detail}</td>
                <td className="py-3 text-foreground/85">{r.gives}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TurinStory() {
  return (
    <section aria-labelledby="turin-story" className="mt-10">
      <h2 id="turin-story" className="font-serif text-2xl text-foreground sm:text-3xl">
        How Turin did it
      </h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-foreground/85">
        Turin already had a detailed digital twin of its roads, built for road management. It knew
        where each road is and how its pavement looks, but little about plants, water and heat. The
        study added that environmental information from satellites and official flood maps, and
        attached it to each road segment.
      </p>

      <div className="mt-8 space-y-10">
        <DataTable title="What Turin already had" rows={BASE} tone="border-foreground/40" />
        <DataTable title="What was added" rows={ADDED} tone="border-eo" />
      </div>

      <h3 className="mt-12 font-serif text-xl text-foreground">How it was put together</h3>
      <ol className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.t} className="border-t-2 border-primary pt-3">
            <p className="font-serif text-lg text-foreground">
              {i + 1}. {s.t}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </li>
        ))}
      </ol>

      <h3 className="mt-12 font-serif text-xl text-foreground">What it showed</h3>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Each of the 82 road segments was checked against four criteria. 61 segments (74%) meet at
        least one. The numbers below are segments out of 82.
      </p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CHECKS.map((c) => (
          <li key={c.t} className="rounded-lg border border-border bg-card p-4">
            <p className="font-serif text-3xl text-primary">{c.n}</p>
            <p className="mt-1 font-medium text-foreground">{c.t}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-foreground/85">
        The same steps were then applied to 5,918 city objects of six classes (buildings,
        vegetation, pedestrian areas, land use, water bodies and bridges). An eight-year record
        picked out 2022 and 2025 as the unusually dry summers, without being told which years to
        look for.
      </p>

      <p className="mt-6 max-w-3xl rounded-lg border border-recommended/30 bg-recommended/10 p-4 text-sm leading-relaxed text-foreground/85">
        <span className="font-semibold">Where this stands.</span> The result is an enriched 3D
        model, not yet a live digital twin. How each source would update the model (Sentinel-2 every
        five days, SDGSAT-1 every 11 days, flood maps when the authorities revise them) is
        specified, but the update loop is not running.
      </p>

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
        ); the environmental enrichment is the work presented in this thesis. Your city can follow
        the same path: keep the detailed data you have, and add free satellite data to see how
        things change. The 3D view below shows the result on individual city objects.
      </p>
    </section>
  );
}
