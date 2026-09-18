import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FlaskConical, Save } from "lucide-react";
import { Graph } from "@/components/Graph";
import { Slider } from "@/components/Slider";
import type { ExperimentModule, LabStep, ObservationRow } from "@/lib/types";
import { LAB_STEPS } from "@/lib/types";
import { ObservationTable } from "./ObservationTable";
import { makeRun, saveRun } from "@/lib/notebook";

export function ExperimentEngine({ experiment }: { experiment: ExperimentModule }) {
  const [step, setStep] = useState<LabStep>("theory");
  const [vars, setVars] = useState<Record<string, number>>({ ...experiment.defaults });
  const [running, setRunning] = useState(false);
  const [rows, setRows] = useState<ObservationRow[]>([]);
  const [saved, setSaved] = useState(false);
  const [flash, setFlash] = useState(false);

  const analysis = useMemo(() => {
    if (rows.length < 2) return null;
    return experiment.analyze(rows);
  }, [rows, experiment]);

  function setVar(key: string, value: number) {
    setVars((v) => ({ ...v, [key]: value }));
  }

  function capture() {
    const row = experiment.capture(vars);
    setRows((r) => [...r, row]);
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
    setSaved(false);
  }

  function persist() {
    if (!analysis) return;
    saveRun(makeRun(experiment.id, experiment.title, rows, vars, analysis));
    setSaved(true);
  }

  const Sim = experiment.Simulation;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-lab-phosphor">
          {experiment.subject} · {experiment.level} · {experiment.duration}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{experiment.title}</h1>
        <p className="mt-1 text-lab-mute">{experiment.subtitle}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="bezel h-fit rounded-xl p-2">
          {LAB_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                step === s.id ? "bg-lab-bg text-lab-phosphor" : "text-lab-mute hover:text-lab-ink"
              }`}
            >
              <span className="font-mono text-[10px] text-lab-amber">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </button>
          ))}
        </aside>

        <div className="min-w-0">
          <div className="bezel relative overflow-hidden rounded-xl p-5">
            <div className="scan pointer-events-none absolute inset-0 opacity-40" />
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="relative"
              >
                {step === "theory" && (
                  <Section title="Theory" kicker="Aim">
                    <p className="mb-5 text-lab-ink/90">{experiment.aim}</p>
                    <div className="space-y-5">
                      {experiment.theory.map((t) => (
                        <article key={t.title}>
                          <h3 className="text-lab-phosphor">{t.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-lab-mute">{t.body}</p>
                          {t.equation && (
                            <p className="readout mt-2 rounded-md bg-lab-bg px-3 py-2 text-lab-amber">{t.equation}</p>
                          )}
                        </article>
                      ))}
                    </div>
                  </Section>
                )}

                {step === "apparatus" && (
                  <Section title="Apparatus" kicker="On the bench">
                    <ul className="grid gap-3 md:grid-cols-2">
                      {experiment.apparatus.map((a) => (
                        <li key={a.name} className="rounded-lg border border-lab-line bg-lab-bg p-4">
                          <p className="text-lab-ink">{a.name}</p>
                          <p className="mt-1 text-sm text-lab-mute">{a.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {step === "procedure" && (
                  <Section title="Procedure" kicker="Method">
                    <ol className="space-y-3">
                      {experiment.procedure.map((p, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="font-mono text-lab-amber">{String(i + 1).padStart(2, "0")}</span>
                          <span className="text-lab-ink/90">{p}</span>
                        </li>
                      ))}
                    </ol>
                    <h3 className="mt-6 text-sm text-lab-phosphor">Precautions</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-lab-mute">
                      {experiment.precautions.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </Section>
                )}

                {step === "lab" && (
                  <Section title="Interactive lab" kicker="Workspace">
                    <Sim vars={vars} setVar={setVar} running={running} setRunning={setRunning} />
                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                      <div className="space-y-3 rounded-xl border border-lab-line bg-lab-bg p-4">
                        {experiment.controls.map((c) => (
                          <Slider key={c.key} def={c} value={vars[c.key]} onChange={(v) => setVar(c.key, v)} />
                        ))}
                      </div>
                      <div className="flex flex-col justify-end gap-2">
                        <button
                          onClick={capture}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${
                            flash ? "bg-lab-amber text-lab-bg" : "bg-lab-phosphor text-lab-bg"
                          }`}
                        >
                          <FlaskConical className="h-4 w-4" />
                          Capture reading
                        </button>
                        <p className="text-center font-mono text-[10px] text-lab-mute">
                          {rows.length} / {experiment.minRows} min
                        </p>
                      </div>
                    </div>
                  </Section>
                )}

                {step === "observations" && (
                  <Section title="Observation table" kicker="Raw data">
                    <ObservationTable
                      columns={experiment.columns}
                      rows={rows}
                      onDelete={(i) => setRows((r) => r.filter((_, idx) => idx !== i))}
                    />
                  </Section>
                )}

                {step === "analysis" && (
                  <Section title="Analysis" kicker="Calculations & graph">
                    {rows.length < 2 ? (
                      <p className="text-lab-mute">Capture at least two readings before analysis.</p>
                    ) : (
                      analysis && (
                        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                          <ul className="space-y-2">
                            {analysis.lines.map((l) => (
                              <li key={l.label} className="flex justify-between rounded-lg border border-lab-line bg-lab-bg px-3 py-2 text-sm">
                                <span className="text-lab-mute">{l.label}</span>
                                <span className="readout text-lab-phosphor">{l.value}</span>
                              </li>
                            ))}
                          </ul>
                          <Graph spec={analysis.graph} />
                        </div>
                      )
                    )}
                  </Section>
                )}

                {step === "result" && (
                  <Section title="Result" kicker="Lab notebook">
                    {!analysis ? (
                      <p className="text-lab-mute">Complete the table and analysis first.</p>
                    ) : (
                      <div>
                        <p className="text-lg text-lab-ink">{analysis.conclusion}</p>
                        {analysis.accepted && (
                          <p className="mt-3 text-sm text-lab-mute">
                            Accepted value: <span className="text-lab-amber">{analysis.accepted}</span>
                            {analysis.errorPct != null && <> · error {analysis.errorPct.toFixed(2)}%</>}
                          </p>
                        )}
                        <button
                          onClick={persist}
                          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lab-phosphor px-4 py-2 text-sm font-semibold text-lab-bg"
                        >
                          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                          {saved ? "Saved to notebook" : "Save experiment"}
                        </button>
                        <p className="mt-2 text-xs text-lab-mute">Stored locally in this browser — no account required.</p>
                      </div>
                    )}
                  </Section>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {(step === "lab" || step === "observations") && rows.length > 0 && (
            <div className="mt-4">
              <ObservationTable columns={experiment.columns} rows={rows} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-lab-amber">{kicker}</p>
      <h2 className="mb-4 text-xl text-lab-ink">{title}</h2>
      {children}
    </div>
  );
}
