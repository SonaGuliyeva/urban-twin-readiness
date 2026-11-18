/**
 * Hero illustration: a satellite feeding layers of environmental information
 * into the digital twin of a city. Neutral on purpose: it is not tied to one hazard.
 */
export function DataLayers() {
  const diamond = (cx: number, cy: number, w = 135, h = 46) =>
    `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
  const side = (cx: number, cy: number, w = 135, h = 46, t = 9) =>
    `${cx - w},${cy} ${cx},${cy + h} ${cx + w},${cy} ${cx + w},${cy + t} ${cx},${cy + h + t} ${cx - w},${cy + t}`;
  const layers = [
    { cy: 270, fill: "#B9DCDF", edge: "#8FC4C9", label: "Terrain and water" },
    { cy: 200, fill: "#7CC0C6", edge: "#4FA6AE", label: "Vegetation" },
    { cy: 130, fill: "#0A7F86", edge: "#075F65", label: "Surface temperature" },
  ];
  const cx = 215;
  const buildings = [
    { x: 115, w: 26, h: 44 },
    { x: 145, w: 22, h: 62 },
    { x: 171, w: 30, h: 38 },
    { x: 205, w: 24, h: 74 },
    { x: 233, w: 30, h: 50 },
    { x: 267, w: 24, h: 40 },
    { x: 295, w: 22, h: 58 },
  ];
  return (
    <svg
      viewBox="0 0 580 420"
      role="img"
      aria-label="A satellite sends layers of environmental information, such as temperature, vegetation, terrain and water, into the digital twin of a city"
      className="h-auto w-full"
    >
      <defs>
        <clipPath id="dl-panel">
          <rect width="580" height="420" rx="22" />
        </clipPath>
      </defs>
      <g clipPath="url(#dl-panel)">
        <rect width="580" height="420" fill="#E3F0F1" />

        {/* city at the bottom */}
        <g>
          {buildings.map((b, i) => (
            <rect
              key={b.x}
              x={b.x}
              y={400 - b.h}
              width={b.w}
              height={b.h}
              fill={i % 2 ? "#2B5784" : "#0A7F86"}
              opacity=".85"
            />
          ))}
          <rect x="85" y="400" width="260" height="20" fill="#2B5784" opacity=".25" />
        </g>

        {/* layers, bottom to top */}
        {layers.map((l) => (
          <g key={l.label}>
            <polygon points={side(cx, l.cy)} fill={l.edge} />
            <polygon
              points={diamond(cx, l.cy)}
              fill={l.fill}
              opacity=".92"
              stroke={l.edge}
              strokeWidth="1.5"
            />
            <line
              x1={cx + 135}
              y1={l.cy}
              x2="400"
              y2={l.cy}
              stroke="#5E7B80"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text x="408" y={l.cy + 5} fontSize="14" fill="#24383B" fontFamily="inherit">
              {l.label}
            </text>
          </g>
        ))}

        {/* satellite and beam */}
        <line
          x1="92"
          y1="62"
          x2={cx}
          y2="112"
          stroke="#0A7F86"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <g transform="translate(92 62) rotate(-18)">
          <rect x="-34" y="-5" width="22" height="10" fill="#2B5784" />
          <rect x="12" y="-5" width="22" height="10" fill="#2B5784" />
          <rect x="-9" y="-9" width="18" height="18" rx="3" fill="#0A7F86" />
        </g>

        <text x="362" y="396" fontSize="14" fill="#24383B" fontFamily="inherit">
          Digital twin
        </text>
      </g>
    </svg>
  );
}
