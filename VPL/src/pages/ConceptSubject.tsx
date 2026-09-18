import { Link, useParams } from "react-router-dom";
import { CONCEPTS } from "@/data/concepts";
import { getExperiment } from "@/experiments/catalog";

export function ConceptSubject() {
  const { id } = useParams();
  const topic = CONCEPTS.find((c) => c.id === id);
  if (!topic) return <p className="px-4 py-20 text-center text-lab-mute">Unknown subject.</p>;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/concepts" className="text-sm text-lab-phosphor">
        ← Concepts
      </Link>
      <h1 className="mt-4 text-4xl font-semibold">{topic.title}</h1>
      <p className="mt-3 text-lab-mute">{topic.blurb}</p>
      <div className="mt-8 space-y-4 text-lab-ink/90">
        {topic.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="mt-8 space-y-2">
        {topic.equations.map((e) => (
          <p key={e} className="readout rounded-md bg-lab-panel px-4 py-2 text-lab-amber">
            {e}
          </p>
        ))}
      </div>
      {topic.experiments.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm uppercase tracking-[0.2em] text-lab-phosphor">On the bench</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {topic.experiments.map((eid) => {
              const ex = getExperiment(eid);
              return (
                <Link key={eid} to={`/experiments/${eid}`} className="rounded-lg border border-lab-line px-4 py-2 text-sm">
                  {ex?.title ?? eid}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
