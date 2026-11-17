import { useEffect, useRef } from "react";
import { mountTurinViewer } from "./turin-engine";
import "./turin-viewer.css";

const MODES = [
  { id: "screening", label: "Screening result" },
  { id: "heat", label: "Surface temperature" },
  { id: "drought", label: "Drought years" },
  { id: "flood", label: "Flood exposure" },
];

export function TurinViewer() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    return mountTurinViewer(rootRef.current, "/data/turin/");
  }, []);

  return (
    <div ref={rootRef} className="tv">
      <div className="tv-head">
        <div>
          <h1>Environmental screening of city objects, Turin</h1>
          <p>
            Po&ndash;Stura district: 1,987 buildings, 1,258 vegetation objects, 828 pedestrian
            areas, water bodies and 82 road segments. Click any object.
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
            Select an object in the view to see the indicators that were derived for it, and the
            geometry each value was measured over.
          </p>
          <div className="counts" id="counts" />
        </aside>
      </div>
    </div>
  );
}
