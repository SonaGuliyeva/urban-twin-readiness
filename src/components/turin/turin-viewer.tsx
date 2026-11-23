import { useEffect, useRef } from "react";
import { mountTurinViewer } from "./turin-engine";
import "./turin-viewer.css";

const S2_DATES: [string, string][] = [
  ["2018-04-22", "spring"],
  ["2018-08-10", "summer"],
  ["2019-04-30", "spring"],
  ["2019-08-03", "summer"],
  ["2020-04-11", "spring"],
  ["2020-08-07", "summer"],
  ["2021-04-14", "spring"],
  ["2021-08-09", "summer"],
  ["2022-04-19", "delivered at 14.40 m, unlike every other date"],
  ["2022-08-02", "summer"],
  ["2023-04-26", "spring"],
  ["2023-08-07", "summer"],
  ["2024-04-13", "spring"],
  ["2024-08-08", "summer"],
  ["2025-04-25", "spring"],
  ["2025-08-05", "summer"],
  ["2022-01-22", "winter reference"],
  ["2022-09-18", "early autumn reference"],
];

const OTHER_SOURCES: string[][] = [
  [
    "SDGSAT-1 TIS",
    "2022-07-22 09:38 UTC",
    "B2, B3 (L4B)",
    "30 m",
    "land surface temperature; one clear-sky scene",
  ],
  [
    "Leica CityMapper-2, airborne",
    "2022-01",
    "RGB + NIR",
    "5 cm / 0.5 m",
    "ground sealing and canopy, flown along the road corridors",
  ],
  ["Airborne LiDAR, DTM and DSM", "2022-01", "\u2014", "2 m", "height above nearest drainage"],
  [
    "PGRA flood hazard maps",
    "in force",
    "vector",
    "\u2014",
    "modelled flood exposure, Po River District Authority",
  ],
  ["Copernicus EMS, EMSR192", "2016-11", "vector", "\u2014", "flood extent actually observed"],
  [
    "City of Turin topographic database",
    "2025-12",
    "vector",
    "\u2014",
    "the city objects themselves",
  ],
];

const MODES = [
  { id: "screening", label: "Screening result" },
  { id: "heat", label: "Surface temperature" },
  { id: "drought", label: "Drought stress" },
  { id: "flood", label: "Flood exposure" },
];

export function TurinViewer() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    return mountTurinViewer(rootRef.current, "/data/turin/");
  }, []);

  return (
    <div>
      <div ref={rootRef} className="tv">
        <div className="tv-head">
          <div>
            <h1>Environmental screening of city objects, Turin</h1>
            <p>
              Po&ndash;Stura confluence district. Satellite measurements attached to each object of
              a 3D city model (CityGML): 1,987 buildings, 1,800 land-use areas, 1,258 vegetation
              objects, 828 pedestrian areas, the Po and Stura di Lanzo water bodies, and the 82 road
              segments of the published analysis. Click any object; the scenes behind every number
              are listed below.
            </p>
          </div>
          <div className="modes" role="group" aria-label="Colour the city by">
            {MODES.map((m) => (
              <button key={m.id} data-mode={m.id} aria-pressed={m.id === "screening"}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="tv-main">
          <div className="stage">
            <canvas id="tv-c" />
            <div className="legend" id="legend" hidden>
              <h3 id="legend-title">Screening result</h3>
              <div id="legend-body" />
            </div>
            <div className="hint">
              Drag to turn &middot; scroll to zoom &middot; double-click to reset
            </div>
            <div className="loading" id="loading">
              Loading the city model&hellip;
            </div>
          </div>
          <aside id="panel">
            <p className="empty">
              Select an object in the view to see the satellite measurements made for it, and the
              geometry each value was measured over.
            </p>
            <div className="counts" id="counts" />
          </aside>
        </div>
      </div>
      <div className="tv-foot">
        <p>
          Sentinel-2 (10&ndash;20&nbsp;m) &middot; SDGSAT-1 thermal (30&nbsp;m,
          22&nbsp;July&nbsp;2022) &middot; airborne imagery and LiDAR (5&nbsp;cm / 0.5&nbsp;m,
          January&nbsp;2022) &middot; PGRA flood hazard maps &middot; Copernicus EMS EMSR192
          (November&nbsp;2016). City objects derived from Citt&agrave; di Torino open geodata,{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/">CC&nbsp;BY&nbsp;4.0</a>. Meant for
          spotting and prioritising problems, not for detailed design.
        </p>
        <details>
          <summary>The satellite scenes behind these numbers</summary>
          <div className="tv-table">
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Acquired</th>
                  <th>Bands</th>
                  <th>Resolution</th>
                  <th>What it feeds</th>
                </tr>
              </thead>
              <tbody>
                {S2_DATES.map(([d, n]) => (
                  <tr key={d}>
                    <td>Sentinel-2 MSI</td>
                    <td>{d}</td>
                    <td>B04, B08, B11, B8A</td>
                    <td>10 m / 20 m</td>
                    <td>{n}</td>
                  </tr>
                ))}
                {OTHER_SOURCES.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c, i) => (
                      <td key={i}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
