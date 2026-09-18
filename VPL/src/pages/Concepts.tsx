import { Link } from "react-router-dom";
import { CONCEPTS } from "@/data/concepts";

export function Concepts() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-lab-phosphor">Library</p>
      <h1 className="mt-2 text-4xl font-semibold">Concepts</h1>
      <p className="mt-3 max-w-2xl text-lab-mute">
        The physics behind the experiments. Each subject links into the laboratory when a structured experiment exists.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {CONCEPTS.map((c) => (
          <Link key={c.id} to={`/concepts/${c.id}`} className="bezel rounded-xl p-6 hover:border-lab-phosphor/40">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lab-amber">{c.id}</p>
            <h2 className="mt-2 text-2xl">{c.title}</h2>
            <p className="mt-2 text-sm text-lab-mute">{c.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
