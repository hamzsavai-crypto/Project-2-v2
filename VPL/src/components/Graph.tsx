import type { GraphSpec } from "@/lib/types";

export function Graph({ spec }: { spec: GraphSpec }) {
  const w = 560;
  const h = 320;
  const pad = { l: 52, r: 18, t: 18, b: 42 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const xs = spec.points.map((p) => p.x);
  const ys = spec.points.map((p) => p.y);
  const xMin = 0;
  const xMax = Math.max(1, ...(xs.length ? xs : [1])) * 1.12;
  const yMin = 0;
  const yMax = Math.max(1, ...(ys.length ? ys : [1])) * 1.12;
  const X = (x: number) => pad.l + (x / xMax) * innerW;
  const Y = (y: number) => pad.t + innerH - (y / yMax) * innerH;

  const fitLine =
    spec.fit && Number.isFinite(spec.fit.slope)
      ? [
          { x: xMin, y: spec.fit.intercept },
          { x: xMax, y: spec.fit.slope * xMax + spec.fit.intercept },
        ]
      : null;

  return (
    <div className="bezel rounded-xl p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-lab-phosphor">{spec.title}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
        <rect x="0" y="0" width={w} height={h} fill="#07090d" />
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line
              x1={pad.l}
              x2={w - pad.r}
              y1={pad.t + innerH * (1 - t)}
              y2={pad.t + innerH * (1 - t)}
              stroke="#1c2733"
            />
            <text x={pad.l - 8} y={pad.t + innerH * (1 - t) + 4} textAnchor="end" fill="#8b9bb0" fontSize="10">
              {(yMax * t).toFixed(2)}
            </text>
          </g>
        ))}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke="#3ee0c4" strokeOpacity="0.4" />
        <line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke="#3ee0c4" strokeOpacity="0.4" />
        {fitLine && (
          <line
            x1={X(fitLine[0].x)}
            y1={Y(Math.max(0, fitLine[0].y))}
            x2={X(fitLine[1].x)}
            y2={Y(Math.max(0, fitLine[1].y))}
            stroke="#f0b429"
            strokeDasharray="5 4"
            strokeWidth="1.5"
          />
        )}
        {spec.points.map((p, i) => (
          <circle key={i} cx={X(p.x)} cy={Y(p.y)} r="4.5" fill="#3ee0c4" />
        ))}
        <text x={w / 2} y={h - 10} textAnchor="middle" fill="#8b9bb0" fontSize="11">
          {spec.xLabel}
        </text>
        <text
          x="16"
          y={h / 2}
          fill="#8b9bb0"
          fontSize="11"
          transform={`rotate(-90 16 ${h / 2})`}
          textAnchor="middle"
        >
          {spec.yLabel}
        </text>
      </svg>
    </div>
  );
}
