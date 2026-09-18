import { useMemo } from "react";
import { currentFromVR, fmt, linearFit } from "@/lib/physics";
import type { ExperimentModule, SimProps } from "@/lib/types";

function OhmsSim({ vars }: SimProps) {
  const V = vars.voltage;
  const R = vars.resistance;
  const I = currentFromVR(V, R);
  const glow = Math.min(1, I / 2.5);

  return (
    <div className="bezel relative overflow-hidden rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-lab-mute">
        <span>Circuit bench</span>
        <span className="text-lab-amber">DC · closed loop</span>
      </div>
      <svg viewBox="0 0 640 280" className="h-auto w-full">
        <rect width="640" height="280" fill="#07090d" />
        <path
          d="M80 80 H560 V200 H80 Z"
          fill="none"
          stroke="#3ee0c4"
          strokeWidth="2.5"
          opacity={0.35 + glow * 0.65}
        />
        {/* battery */}
        <line x1="78" y1="60" x2="78" y2="100" stroke="#e8eef5" strokeWidth="3" />
        <line x1="92" y1="68" x2="92" y2="92" stroke="#e8eef5" strokeWidth="6" />
        <text x="85" y="48" fill="#f0b429" fontSize="12" textAnchor="middle">
          ε {fmt(V, 1)} V
        </text>
        {/* resistor */}
        <path
          d="M250 80 l12 -16 12 32 12 -32 12 32 12 -32 12 16"
          fill="none"
          stroke="#f0b429"
          strokeWidth="2.5"
        />
        <text x="310" y="48" fill="#f0b429" fontSize="12" textAnchor="middle">
          R {fmt(R, 0)} Ω
        </text>
        {/* ammeter */}
        <circle cx="430" cy="80" r="22" fill="#10151c" stroke="#3ee0c4" />
        <text x="430" y="84" textAnchor="middle" fill="#3ee0c4" fontSize="13" fontFamily="monospace">
          A
        </text>
        {/* voltmeter */}
        <line x1="250" y1="80" x2="250" y2="140" stroke="#8b9bb0" strokeDasharray="4 3" />
        <line x1="370" y1="80" x2="370" y2="140" stroke="#8b9bb0" strokeDasharray="4 3" />
        <circle cx="310" cy="168" r="22" fill="#10151c" stroke="#f0b429" />
        <text x="310" y="172" textAnchor="middle" fill="#f0b429" fontSize="13" fontFamily="monospace">
          V
        </text>
        {/* electrons */}
        {Array.from({ length: 8 }).map((_, i) => {
          const t = (Date.now() / 400 + i / 8) % 1;
          return (
            <circle key={i} r="3.5" fill="#3ee0c4">
              <animateMotion dur={`${2.4 / Math.max(0.2, I)}s`} repeatCount="indefinite" begin={`${i * 0.15}s`}>
                <mpath href="#loop" />
              </animateMotion>
            </circle>
          );
        })}
        <path id="loop" d="M80 80 H560 V200 H80 Z" fill="none" />
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Meter label="Voltage" value={`${fmt(V, 2)} V`} tone="amber" />
        <Meter label="Resistance" value={`${fmt(R, 1)} Ω`} tone="amber" />
        <Meter label="Current" value={`${fmt(I, 3)} A`} tone="phos" />
      </div>
    </div>
  );
}

function Meter({ label, value, tone }: { label: string; value: string; tone: "amber" | "phos" }) {
  return (
    <div className="rounded-lg border border-lab-line bg-lab-bg px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-mute">{label}</p>
      <p className={`readout mt-1 text-lg ${tone === "amber" ? "text-lab-amber" : "text-lab-phosphor"}`}>{value}</p>
    </div>
  );
}

export const ohmsLaw: ExperimentModule = {
  id: "ohms-law",
  title: "Ohm's Law",
  subtitle: "Verify V = IR and determine resistance from an I–V graph.",
  subject: "electricity",
  level: "Class 10–12 / UG intro",
  duration: "25 min",
  aim: "To verify Ohm's law by measuring current through a resistor for several voltages, then finding R from the slope of the I–V graph.",
  theory: [
    {
      title: "Statement",
      body: "At constant temperature, the current I through a metallic conductor is directly proportional to the potential difference V across its ends.",
      equation: "V = I R    or    I = V / R",
    },
    {
      title: "Resistance",
      body: "R is the slope of V versus I, or the reciprocal of the slope of I versus V. It depends on material, length, cross-section and temperature — not on V or I themselves.",
      equation: "R = V / I = ΔV / ΔI",
    },
    {
      title: "Graph",
      body: "A plot of I (y) against V (x) is a straight line through the origin for an ohmic conductor. Slope = 1/R.",
    },
  ],
  apparatus: [
    { name: "DC source", detail: "Variable 1–12 V supply (battery / power pack)." },
    { name: "Resistor", detail: "Unknown ohmic resistor under test." },
    { name: "Ammeter", detail: "Series instrument measuring current in amperes." },
    { name: "Voltmeter", detail: "Parallel instrument measuring potential difference." },
    { name: "Rheostat / key", detail: "To set voltage and close the circuit." },
  ],
  procedure: [
    "Keep the resistance fixed. You are testing one conductor.",
    "Set a voltage, close the circuit, and read the ammeter.",
    "Capture the reading into the observation table.",
    "Increase voltage in steps (at least 5 readings).",
    "Plot I against V. Draw the best-fit line.",
    "R_exp = 1 / slope. Compare with the set resistance.",
  ],
  precautions: [
    "Do not overheat the resistor — keep current moderate.",
    "Ammeter in series, voltmeter in parallel.",
    "Take several points; one reading is not a law.",
  ],
  controls: [
    { key: "voltage", label: "Supply voltage", unit: "V", min: 1, max: 12, step: 0.5 },
    { key: "resistance", label: "Resistance", unit: "Ω", min: 4, max: 40, step: 1 },
  ],
  defaults: { voltage: 6, resistance: 10 },
  columns: [
    { key: "voltage", label: "V", unit: "V" },
    { key: "resistance", label: "R (set)", unit: "Ω" },
    { key: "current", label: "I", unit: "A" },
  ],
  minRows: 5,
  Simulation: OhmsSim,
  capture: (vars) => ({
    voltage: vars.voltage,
    resistance: vars.resistance,
    current: currentFromVR(vars.voltage, vars.resistance),
  }),
  analyze: (rows) => {
    const xs = rows.map((r) => r.voltage);
    const ys = rows.map((r) => r.current);
    const fit = linearFit(xs, ys);
    const Rexp = 1 / fit.slope;
    const Rset = rows[0]?.resistance ?? NaN;
    const errorPct = Math.abs((Rexp - Rset) / Rset) * 100;
    return {
      lines: [
        { label: "Points", value: String(rows.length) },
        { label: "Slope dI/dV", value: `${fmt(fit.slope, 4)} A/V` },
        { label: "R from slope", value: `${fmt(Rexp, 3)} Ω` },
        { label: "R set on bench", value: `${fmt(Rset, 2)} Ω` },
        { label: "R² of fit", value: fmt(fit.r2, 4) },
        { label: "Relative error", value: `${fmt(errorPct, 2)} %` },
      ],
      graph: {
        title: "I versus V",
        xLabel: "Voltage V (V)",
        yLabel: "Current I (A)",
        points: rows.map((r) => ({ x: r.voltage, y: r.current })),
        fit: { slope: fit.slope, intercept: fit.intercept },
      },
      conclusion: `The I–V graph is linear (R² = ${fmt(fit.r2, 3)}), so the conductor is ohmic. Experimental resistance is ${fmt(Rexp, 2)} Ω.`,
      accepted: `${fmt(Rset, 2)} Ω (set value)`,
      errorPct,
    };
  },
};

export function OhmsExplorer() {
  const vars = { voltage: 6, resistance: 10 };
  const setVar = () => {};
  return <OhmsSim vars={vars} setVar={setVar} running={false} setRunning={() => {}} />;
}

export function useLiveOhm(vars: Record<string, number>) {
  return useMemo(() => currentFromVR(vars.voltage, vars.resistance), [vars]);
}
