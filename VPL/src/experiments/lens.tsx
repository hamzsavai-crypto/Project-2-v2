import { focalFromUV, fmt, imageDistance, mean } from "@/lib/physics";
import type { ExperimentModule, SimProps } from "@/lib/types";

function LensSim({ vars }: SimProps) {
  const f = vars.focal;
  const u = vars.object;
  const v = imageDistance(u, f);
  const W = 640;
  const H = 260;
  const lensX = 320;
  const scale = 12;
  const objX = lensX - u * scale;
  const imgX = Number.isFinite(v) ? lensX + v * scale : lensX + 400;
  const objH = 48;
  const mag = Number.isFinite(v) ? v / u : 1;
  const imgH = objH * mag;

  return (
    <div className="bezel rounded-xl p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-lab-mute">Optical bench</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        <rect width={W} height={H} fill="#07090d" />
        <line x1="20" y1={H / 2} x2={W - 20} y2={H / 2} stroke="#2a3646" />
        <ellipse cx={lensX} cy={H / 2} rx="10" ry="70" fill="none" stroke="#3ee0c4" strokeWidth="2" />
        <line x1={objX} y1={H / 2} x2={objX} y2={H / 2 - objH} stroke="#f0b429" strokeWidth="3" />
        <polygon points={`${objX},${H / 2 - objH} ${objX - 6},${H / 2 - objH + 12} ${objX + 6},${H / 2 - objH + 12}`} fill="#f0b429" />
        {Number.isFinite(v) && v > 0 && (
          <>
            <line x1={imgX} y1={H / 2} x2={imgX} y2={H / 2 + imgH} stroke="#3ee0c4" strokeWidth="3" />
            <line
              x1={objX}
              y1={H / 2 - objH}
              x2={imgX}
              y2={H / 2 + imgH}
              stroke="#3ee0c4"
              strokeOpacity="0.35"
            />
            <line x1={objX} y1={H / 2 - objH} x2={lensX} y2={H / 2} stroke="#3ee0c4" strokeOpacity="0.2" />
          </>
        )}
        <text x={objX} y={H - 18} textAnchor="middle" fill="#f0b429" fontSize="11">
          u = {fmt(u, 1)} cm
        </text>
        <text x={lensX} y={24} textAnchor="middle" fill="#3ee0c4" fontSize="11">
          lens f = {fmt(f, 1)} cm
        </text>
        <text x={Math.min(W - 40, Math.max(40, imgX))} y={H - 18} textAnchor="middle" fill="#3ee0c4" fontSize="11">
          v = {Number.isFinite(v) ? `${fmt(v, 1)} cm` : "∞"}
        </text>
      </svg>
    </div>
  );
}

export const lens: ExperimentModule = {
  id: "convex-lens",
  title: "Convex Lens · Focal Length",
  subtitle: "Use object and image distances on an optical bench to find f.",
  subject: "optics",
  level: "Class 12 / UG intro",
  duration: "30 min",
  aim: "To determine the focal length of a convex lens by the u–v method.",
  theory: [
    {
      title: "Thin-lens equation",
      body: "For a thin lens in air, using the school sign convention of positive real distances measured from the optical centre:",
      equation: "1/f = 1/v + 1/u",
    },
    {
      title: "Magnification",
      body: "Lateral magnification m = v/u = h'/h. A real image from a convex lens is inverted.",
    },
    {
      title: "Why several readings",
      body: "A single (u, v) pair gives f, but averaging several pairs reduces random error in locating the sharp image.",
    },
  ],
  apparatus: [
    { name: "Convex lens", detail: "Unknown focal length, on a lens holder." },
    { name: "Optical bench", detail: "Metre scale with uprights for object, lens and screen." },
    { name: "Object / lamp", detail: "Illuminated object or cross-wire." },
    { name: "Screen", detail: "To catch a sharp real image." },
  ],
  procedure: [
    "Set the object distance u greater than f (real image).",
    "Read the image distance v from the simulation (sharp image).",
    "Capture u, v and the computed f into the table.",
    "Repeat for at least five object distances.",
    "Average the experimental focal lengths.",
    "Compare with the true f of the lens.",
  ],
  precautions: [
    "u must be greater than f for a real image.",
    "Avoid parallax when reading the bench.",
    "Do not use u ≈ f; v flies to infinity.",
  ],
  controls: [
    { key: "focal", label: "True focal length", unit: "cm", min: 10, max: 25, step: 0.5 },
    { key: "object", label: "Object distance u", unit: "cm", min: 16, max: 60, step: 1 },
  ],
  defaults: { focal: 15, object: 30 },
  columns: [
    { key: "u", label: "u", unit: "cm" },
    { key: "v", label: "v", unit: "cm" },
    { key: "f", label: "f = uv/(u+v)", unit: "cm" },
  ],
  minRows: 5,
  Simulation: LensSim,
  capture: (vars) => {
    const u = vars.object;
    const v = imageDistance(u, vars.focal);
    const f = focalFromUV(u, v);
    return { u, v, f, trueF: vars.focal };
  },
  analyze: (rows) => {
    const fs = rows.map((r) => r.f).filter((n) => Number.isFinite(n));
    const fMean = mean(fs);
    const fTrue = rows[0]?.trueF ?? fMean;
    const errorPct = Math.abs((fMean - fTrue) / fTrue) * 100;
    return {
      lines: [
        { label: "Readings", value: String(fs.length) },
        { label: "Mean f", value: `${fmt(fMean, 2)} cm` },
        { label: "True f", value: `${fmt(fTrue, 2)} cm` },
        { label: "Relative error", value: `${fmt(errorPct, 2)} %` },
      ],
      graph: {
        title: "v versus u",
        xLabel: "Object distance u (cm)",
        yLabel: "Image distance v (cm)",
        points: rows.map((r) => ({ x: r.u, y: r.v })),
      },
      conclusion: `Mean experimental focal length is ${fmt(fMean, 2)} cm (true f = ${fmt(fTrue, 2)} cm).`,
      accepted: `${fmt(fTrue, 2)} cm`,
      errorPct,
    };
  },
};
