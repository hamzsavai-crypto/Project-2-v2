import { useEffect, useRef, useState } from "react";
import { G, fmt, linearFit, pendulumPeriod, stepPendulum } from "@/lib/physics";
import type { ExperimentModule, SimProps } from "@/lib/types";

function PendulumSim({ vars, running, setRunning }: SimProps) {
  const L = vars.length;
  const g = vars.gravity;
  const Tth = pendulumPeriod(L, g);
  const canvas = useRef<SVGLineElement | null>(null);
  const bob = useRef<SVGCircleElement | null>(null);
  const [Tm, setTm] = useState<number | null>(null);
  const thetaRef = useRef(0.45);
  const omegaRef = useRef(0);
  const tRef = useRef(0);
  const lastPeak = useRef<number | null>(null);
  const prevSign = useRef(0);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last: number | null = null;
    const step = (ts: number) => {
      if (last == null) last = ts;
      const dt = Math.min(0.033, (ts - last) / 1000);
      last = ts;
      tRef.current += dt;
      const next = stepPendulum(thetaRef.current, omegaRef.current, g, L, dt);
      thetaRef.current = next.theta;
      omegaRef.current = next.omega;
      const sign = Math.sign(next.omega);
      if (prevSign.current !== 0 && sign !== 0 && sign !== prevSign.current) {
        if (lastPeak.current != null) setTm(tRef.current - lastPeak.current);
        lastPeak.current = tRef.current;
      }
      if (sign !== 0) prevSign.current = sign;
      const r = 90 + L * 28;
      const x = 200 + r * Math.sin(next.theta);
      const y = 36 + r * Math.cos(next.theta);
      canvas.current?.setAttribute("x2", x.toFixed(1));
      canvas.current?.setAttribute("y2", y.toFixed(1));
      bob.current?.setAttribute("cx", x.toFixed(1));
      bob.current?.setAttribute("cy", y.toFixed(1));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running, L, g]);

  useEffect(() => {
    thetaRef.current = 0.45;
    omegaRef.current = 0;
    tRef.current = 0;
    lastPeak.current = null;
    prevSign.current = 0;
    setTm(null);
  }, [L, g]);

  return (
    <div className="bezel rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-lab-mute">Pendulum bay</p>
        <button
          onClick={() => setRunning(!running)}
          className="rounded-md bg-lab-phosphor px-3 py-1 text-xs font-semibold text-lab-bg"
        >
          {running ? "Pause" : "Release"}
        </button>
      </div>
      <svg viewBox="0 0 400 340" className="mx-auto h-auto w-full max-h-[340px]">
        <rect width="400" height="340" fill="#07090d" />
        <line x1="140" y1="36" x2="260" y2="36" stroke="#8b9bb0" strokeWidth="6" />
        <line ref={canvas} x1="200" y1="36" x2="200" y2="200" stroke="#e8eef5" strokeWidth="2" />
        <circle ref={bob} cx="200" cy="200" r="16" fill="#3ee0c4" />
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <Chip label="L" value={`${fmt(L, 2)} m`} />
        <Chip label="T (theory)" value={`${fmt(Tth, 3)} s`} />
        <Chip label="T (measured)" value={Tm ? `${fmt(Tm, 3)} s` : "—"} />
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

export const pendulum: ExperimentModule = {
  id: "simple-pendulum",
  title: "Simple Pendulum",
  subtitle: "Measure period versus length and determine g from a T²–L graph.",
  subject: "mechanics",
  level: "Class 11 / UG intro",
  duration: "30 min",
  aim: "To determine the acceleration due to gravity by measuring the period of a simple pendulum for several lengths.",
  theory: [
    {
      title: "Small-angle motion",
      body: "For small angular displacements, a simple pendulum is simple harmonic. The restoring acceleration is −(g/L)θ.",
      equation: "T = 2π √(L / g)",
    },
    {
      title: "Finding g",
      body: "A graph of T² against L is a straight line through the origin with slope 4π²/g. Therefore g = 4π² / slope.",
      equation: "T² = (4π² / g) L",
    },
    {
      title: "Mass independence",
      body: "In the ideal model the period does not depend on bob mass. Heavier bobs need more force but also have more inertia.",
    },
  ],
  apparatus: [
    { name: "Bob & string", detail: "Dense spherical bob on a light inextensible string." },
    { name: "Rigid support", detail: "Clamp and split cork so length is well defined." },
    { name: "Metre scale", detail: "Length from point of suspension to bob centre." },
    { name: "Stopwatch", detail: "Here: period is measured from successive turning points." },
  ],
  procedure: [
    "Set a length L. Release the bob from a small angle (~25°).",
    "Wait for the measured period to appear (two turning points).",
    "Capture L and T into the table. Also record T².",
    "Repeat for at least five lengths.",
    "Plot T² versus L. Slope = 4π²/g.",
    "Compute g_exp = 4π² / slope and compare with 9.81 m/s².",
  ],
  precautions: [
    "Keep the amplitude small.",
    "Measure L to the centre of the bob.",
    "Avoid air drafts; do not push the bob.",
  ],
  controls: [
    { key: "length", label: "Length L", unit: "m", min: 0.4, max: 2.0, step: 0.05 },
    { key: "gravity", label: "g (environment)", unit: "m/s²", min: 9.7, max: 9.9, step: 0.01 },
  ],
  defaults: { length: 1.0, gravity: 9.81 },
  columns: [
    { key: "length", label: "L", unit: "m" },
    { key: "period", label: "T", unit: "s" },
    { key: "tsq", label: "T²", unit: "s²" },
  ],
  minRows: 5,
  Simulation: PendulumSim,
  capture: (vars) => {
    const T = pendulumPeriod(vars.length, vars.gravity);
    return { length: vars.length, period: T, tsq: T * T };
  },
  analyze: (rows) => {
    const xs = rows.map((r) => r.length);
    const ys = rows.map((r) => r.tsq);
    const fit = linearFit(xs, ys);
    const gExp = (4 * Math.PI * Math.PI) / fit.slope;
    const errorPct = Math.abs((gExp - G) / G) * 100;
    return {
      lines: [
        { label: "Slope d(T²)/dL", value: `${fmt(fit.slope, 3)} s²/m` },
        { label: "g from slope", value: `${fmt(gExp, 3)} m/s²` },
        { label: "Accepted g", value: `${G} m/s²` },
        { label: "R²", value: fmt(fit.r2, 4) },
        { label: "Relative error", value: `${fmt(errorPct, 2)} %` },
      ],
      graph: {
        title: "T² versus L",
        xLabel: "Length L (m)",
        yLabel: "T² (s²)",
        points: rows.map((r) => ({ x: r.length, y: r.tsq })),
        fit: { slope: fit.slope, intercept: fit.intercept },
      },
      conclusion: `T² is linear in L. Experimental g = ${fmt(gExp, 2)} m/s².`,
      accepted: `${G} m/s²`,
      errorPct,
    };
  },
};
