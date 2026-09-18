import { useState } from "react";
import { Link } from "react-router-dom";
import { EXPERIMENTS } from "@/experiments/catalog";
import { Slider } from "@/components/Slider";

export function Simulations() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-lab-phosphor">Free exploration</p>
      <h1 className="mt-2 text-4xl font-semibold">Simulations</h1>
      <p className="mt-3 max-w-2xl text-lab-mute">
        Same physics, no lab protocol. Change parameters and watch. Structured measurement lives under Experiments.
      </p>
      <div className="mt-10 space-y-10">
        {EXPERIMENTS.map((ex) => (
          <Explorer key={ex.id} id={ex.id} />
        ))}
      </div>
    </div>
  );
}

function Explorer({ id }: { id: string }) {
  const ex = EXPERIMENTS.find((e) => e.id === id)!;
  const [vars, setVars] = useState({ ...ex.defaults });
  const [running, setRunning] = useState(id !== "ohms-law");
  const Sim = ex.Simulation;
  return (
    <section className="bezel rounded-2xl p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl">{ex.title}</h2>
          <p className="text-sm text-lab-mute">{ex.subtitle}</p>
        </div>
        <Link to={`/experiments/${ex.id}`} className="text-sm text-lab-phosphor">
          Open as experiment →
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <Sim vars={vars} setVar={(k, v) => setVars((s) => ({ ...s, [k]: v }))} running={running} setRunning={setRunning} />
        <div className="space-y-4 rounded-xl border border-lab-line bg-lab-bg p-4">
          {ex.controls.map((c) => (
            <Slider key={c.key} def={c} value={vars[c.key]} onChange={(v) => setVars((s) => ({ ...s, [c.key]: v }))} />
          ))}
        </div>
      </div>
    </section>
  );
}
