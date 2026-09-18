import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteRun, loadNotebook } from "@/lib/notebook";

export function Notebook() {
  const [runs, setRuns] = useState(() => loadNotebook());

  function remove(id: string) {
    deleteRun(id);
    setRuns(loadNotebook());
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-lab-phosphor">Local only</p>
      <h1 className="mt-2 text-4xl font-semibold">Notebook</h1>
      <p className="mt-3 text-lab-mute">
        Saved experiments live in this browser. Accounts and cloud history are a later phase.
      </p>
      <div className="mt-8 space-y-3">
        {runs.length === 0 && <p className="text-lab-mute">No runs saved yet.</p>}
        {runs.map((r) => (
          <article key={r.id} className="bezel rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link to={`/experiments/${r.experimentId}`} className="text-lg text-lab-ink hover:text-lab-phosphor">
                  {r.title}
                </Link>
                <p className="mt-1 font-mono text-xs text-lab-mute">{new Date(r.savedAt).toLocaleString()}</p>
                <p className="mt-2 text-sm text-lab-mute">{r.analysis.conclusion}</p>
              </div>
              <button onClick={() => remove(r.id)} className="text-xs text-lab-rose">
                delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
