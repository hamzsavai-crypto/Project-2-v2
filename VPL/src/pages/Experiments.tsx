import { Link } from "react-router-dom";
import { EXPERIMENTS } from "@/experiments/catalog";

export function Experiments() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-lab-phosphor">Structured labs</p>
      <h1 className="mt-2 text-4xl font-semibold">Experiments</h1>
      <p className="mt-3 max-w-2xl text-lab-mute">
        One experiment engine. Four modules. Theory → apparatus → procedure → interactive lab → table → graph →
        result.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {EXPERIMENTS.map((e, i) => (
          <Link key={e.id} to={`/experiments/${e.id}`} className="bezel rounded-xl p-6 hover:border-lab-phosphor/50">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-lab-amber">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>
                {e.subject} · {e.duration}
              </span>
            </div>
            <h2 className="mt-3 text-2xl">{e.title}</h2>
            <p className="mt-2 text-sm text-lab-mute">{e.subtitle}</p>
            <p className="mt-4 text-xs text-lab-phosphor">{e.level}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
