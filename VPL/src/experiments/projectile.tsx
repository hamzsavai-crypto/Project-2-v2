import { useEffect, useRef } from "react";
import { fmt, projectileHeight, projectilePoint, projectileRange, projectileTime } from "@/lib/physics";
import type { ExperimentModule, SimProps } from "@/lib/types";

function ProjectileSim({ vars, running, setRunning }: SimProps) {
  const v = vars.speed;
  const th = vars.angle;
  const T = projectileTime(v, th);
  const R = projectileRange(v, th);
  const H = projectileHeight(v, th);
  const pathRef = useRef<SVGPathElement | null>(null);
  const ballRef = useRef<SVGCircleElement | null>(null);

  const W = 640;
  const Ht = 280;
  const sx = 520 / Math.max(8, R * 1.15);
  const sy = 200 / Math.max(2, H * 1.35);

  const d = (() => {
    let s = "";
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * T;
      const p = projectilePoint(v, th, t);
      const x = 40 + p.x * sx;
      const y = 240 - p.y * sy;
      s += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return s;
  })();

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = ((now - t0) / 1000) % Math.max(0.4, T);
      const p = projectilePoint(v, th, t);
      const x = 40 + p.x * sx;
      const y = 240 - Math.max(0, p.y) * sy;
      ballRef.current?.setAttribute("cx", x.toFixed(1));
      ballRef.current?.setAttribute("cy", y.toFixed(1));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running, v, th, T, sx, sy]);

  return (
    <div className="bezel rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-lab-mute">Range bay</p>
        <button
          onClick={() => setRunning(!running)}
          className="rounded-md bg-lab-phosphor px-3 py-1 text-xs font-semibold text-lab-bg"
        >
          {running ? "Pause" : "Launch"}
        </button>
      </div>
      <svg viewBox={`0 0 ${W} ${Ht}`} className="h-auto w-full">
        <rect width={W} height={Ht} fill="#07090d" />
        <line x1="40" y1="240" x2="620" y2="240" stroke="#2a3646" />
        <path ref={pathRef} d={d} fill="none" stroke="#3ee0c4" strokeOpacity="0.5" />
        <circle ref={ballRef} cx="40" cy="240" r="7" fill="#f0b429" />
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Chip label="Range R" value={`${fmt(R, 2)} m`} />
        <Chip label="Max height" value={`${fmt(H, 2)} m`} />
        <Chip label="Time of flight" value={`${fmt(T, 2)} s`} />
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-lab-line bg-lab-bg px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-lab-mute">{label}</p>
      <p className="readout text-lab-phosphor">{value}</p>
    </div>
  );
}

export const projectile: ExperimentModule = {
  id: "projectile-motion",
  title: "Projectile Motion",
  subtitle: "Investigate range, height and time of flight versus launch angle.",
  subject: "mechanics",
  level: "Class 11 / UG intro",
  duration: "25 min",
  aim: "To study how range, maximum height and time of flight of a projectile depend on launch angle at constant speed.",
  theory: [
    {
      title: "Decomposition",
      body: "Horizontal velocity is constant. Vertical motion is uniformly accelerated under g.",
      equation: "vx = v cosθ    vy = v sinθ − g t",
    },
    {
      title: "Range, height, time",
      body: "On level ground, range is maximum at 45°. Complementary angles give the same range.",
      equation: "R = v² sin 2θ / g    H = v² sin²θ / (2g)    T = 2 v sinθ / g",
    },
  ],
  apparatus: [
    { name: "Launcher", detail: "Variable angle, constant muzzle speed." },
    { name: "Landing plane", detail: "Level ground at the height of the muzzle." },
    { name: "Metre scale / timer", detail: "Range and time of flight." },
  ],
  procedure: [
    "Keep launch speed fixed.",
    "Set an angle, launch, and capture R, H and T.",
    "Sweep angle from ~15° to ~75° in steps.",
    "Plot range versus angle. Note the maximum near 45°.",
    "Check that 30° and 60° (complementary) give nearly equal ranges.",
  ],
  precautions: [
    "Keep speed constant while varying angle.",
    "Air resistance is neglected in this model.",
  ],
  controls: [
    { key: "speed", label: "Launch speed", unit: "m/s", min: 8, max: 25, step: 0.5 },
    { key: "angle", label: "Launch angle", unit: "deg", min: 15, max: 75, step: 1 },
  ],
  defaults: { speed: 18, angle: 45 },
  columns: [
    { key: "angle", label: "θ", unit: "deg" },
    { key: "range", label: "R", unit: "m" },
    { key: "height", label: "H", unit: "m" },
    { key: "time", label: "T", unit: "s" },
  ],
  minRows: 6,
  Simulation: ProjectileSim,
  capture: (vars) => ({
    angle: vars.angle,
    range: projectileRange(vars.speed, vars.angle),
    height: projectileHeight(vars.speed, vars.angle),
    time: projectileTime(vars.speed, vars.angle),
    speed: vars.speed,
  }),
  analyze: (rows) => {
    const max = rows.reduce((a, b) => (b.range > a.range ? b : a), rows[0]);
    return {
      lines: [
        { label: "Readings", value: String(rows.length) },
        { label: "Max range in table", value: `${fmt(max.range, 2)} m at ${fmt(max.angle, 0)}°` },
        { label: "Theory: max at", value: "45° (level ground)" },
        { label: "Speed held", value: `${fmt(rows[0]?.speed ?? 0, 1)} m/s` },
      ],
      graph: {
        title: "Range versus angle",
        xLabel: "θ (deg)",
        yLabel: "R (m)",
        points: rows.map((r) => ({ x: r.angle, y: r.range })),
      },
      conclusion: `Largest recorded range is ${fmt(max.range, 2)} m at ${fmt(max.angle, 0)}°. Theory predicts a maximum at 45° for level ground.`,
      accepted: "R_max at 45°",
    };
  },
};
