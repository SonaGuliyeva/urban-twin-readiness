/**
 * Hero illustration: one city between two water extremes, observed from space.
 * Colours follow Figure 1-1 of the thesis (blue = floods, orange = droughts).
 */
export function TwoExtremes() {
  const buildings = [
    { x: 150, w: 44, h: 120 },
    { x: 200, w: 36, h: 170 },
    { x: 242, w: 52, h: 100 },
    { x: 300, w: 40, h: 205 },
    { x: 346, w: 48, h: 140 },
    { x: 400, w: 38, h: 110 },
  ];
  const ground = 330;
  return (
    <svg
      viewBox="0 0 580 420"
      role="img"
      aria-label="A city between a flood on the left and a drought on the right, observed by a satellite"
      className="h-auto w-full"
    >
      <defs>
        <clipPath id="tx-panel">
          <rect width="580" height="420" rx="22" />
        </clipPath>
      </defs>
      <g clipPath="url(#tx-panel)">
        <rect width="290" height="420" fill="#EBF6FA" />
        <rect x="290" width="290" height="420" fill="#FDF4E8" />

        {/* rain */}
        <g stroke="#028FBE" strokeWidth="2" strokeLinecap="round" opacity=".55">
          {[
            [30, 70], [70, 120], [110, 60], [55, 175], [100, 205], [20, 230], [135, 150], [78, 260], [128, 245],
          ].map(([x, y]) => (
            <line key={`${x}-${y}`} x1={x} y1={y} x2={x - 8} y2={y + 22} />
          ))}
        </g>
        {/* sun */}
        <circle cx="500" cy="82" r="34" fill="#EF7B00" />
        <g stroke="#EF7B00" strokeWidth="3" strokeLinecap="round">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line
                key={i}
                x1={500 + Math.cos(a) * 44}
                y1={82 + Math.sin(a) * 44}
                x2={500 + Math.cos(a) * 54}
                y2={82 + Math.sin(a) * 54}
              />
            );
          })}
        </g>

        {/* skyline */}
        {buildings.map((b, i) => (
          <g key={b.x}>
            <rect x={b.x} y={ground - b.h} width={b.w} height={b.h} fill={i % 2 ? "#0A7F86" : "#2B5784"} />
            {Array.from({ length: Math.floor(b.h / 26) }).map((_, r) =>
              [0, 1].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={b.x + 8 + c * ((b.w - 16) / 2 + 2)}
                  y={ground - b.h + 12 + r * 26}
                  width={(b.w - 16) / 2 - 2}
                  height="10"
                  rx="1.5"
                  fill="#fff"
                  opacity=".35"
                />
              )),
            )}
          </g>
        ))}

        {/* flood water, left */}
        <path
          d="M0 300 C40 288 80 312 120 300 C160 288 200 312 240 300 C262 294 278 298 292 300 L292 420 L0 420 Z"
          fill="#028FBE"
          opacity=".85"
        />
        <path
          d="M0 332 C50 320 90 344 140 332 C190 320 230 344 292 332 L292 420 L0 420 Z"
          fill="#028FBE"
        />
        {/* dry, cracked ground, right */}
        <rect x="290" y={ground} width="290" height="90" fill="#EF7B00" opacity=".9" />
        <g stroke="#FDF4E8" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M310 340 L336 358 L330 378 M336 358 L372 362 L388 380" />
          <path d="M420 336 L440 358 L476 356 L492 378 M440 358 L434 380" />
          <path d="M520 342 L540 360 L566 364 M540 360 L534 380" />
        </g>
        <rect x="0" y={ground} width="290" height="0" />

        {/* satellite and its view of the city */}
        <g transform="translate(262 34)">
          <rect x="-9" y="-9" width="18" height="18" rx="3" fill="#0A7F86" transform="rotate(45)" />
          <rect x="-44" y="-5" width="28" height="10" rx="2" fill="#2B5784" />
          <rect x="16" y="-5" width="28" height="10" rx="2" fill="#2B5784" />
        </g>
        <path
          d="M262 52 L222 150 M262 52 L342 150"
          stroke="#0A7F86"
          strokeWidth="1.8"
          strokeDasharray="5 6"
          fill="none"
        />
      </g>
      <rect width="580" height="420" rx="22" fill="none" stroke="#2B5784" strokeOpacity=".18" />
      <text x="24" y="402" fill="#fff" fontSize="17" fontWeight="600" fontFamily="inherit">
        Floods
      </text>
      <text x="556" y="402" fill="#fff" fontSize="17" fontWeight="600" fontFamily="inherit" textAnchor="end">
        Droughts
      </text>
    </svg>
  );
}
