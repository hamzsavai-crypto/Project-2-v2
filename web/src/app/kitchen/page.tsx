"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type Ingredient, type Plate } from "@/lib/utils";

export default function KitchenPage() {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [picked, setPicked] = useState<string[]>(["react", "next.js", "ui", "lucide"]);
  const [plate, setPlate] = useState<Plate | null>(null);
  const [recent, setRecent] = useState<Plate[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: Ingredient[] }>("/api/ingredients").then((d) => setItems(d.items));
    api<{ items: Plate[] }>("/api/plates").then((d) => setRecent(d.items));
  }, []);

  function toggle(slug: string) {
    setPicked((curr) => (curr.includes(slug) ? curr.filter((s) => s !== slug) : [...curr, slug]));
  }

  async function compose() {
    setBusy(true);
    setError("");
    try {
      const res = await api<Plate>("/api/plates", {
        method: "POST",
        body: JSON.stringify({ slugs: picked }),
      });
      setPlate(res);
      api<{ items: Plate[] }>("/api/plates").then((d) => setRecent(d.items));
    } catch (e) {
      setError(e instanceof Error ? e.message : "The pass refused the ticket.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-[11px] uppercase tracking-[0.25em] text-brass">The kitchen</p>
      <h1 className="display mt-3 text-6xl md:text-7xl">
        Compose
        <br />
        a <span className="serif-italic text-paprika">plate.</span>
      </h1>
      <p className="mt-5 max-w-xl text-smoke">
        Pick from the nineteen. The pass scores the combination, warns you about fusion no one ordered, and writes a
        method. Saved to SQLite — this is a real ticket, not a mock.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            {items.map((i) => {
              const on = picked.includes(i.slug);
              return (
                <button
                  key={i.slug}
                  onClick={() => toggle(i.slug)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    on ? "bg-parchment text-ink" : "border border-parchment/15 text-smoke hover:text-parchment"
                  }`}
                >
                  {i.name}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={compose}
              disabled={busy || picked.length === 0}
              className="rounded-full bg-paprika px-6 py-3 text-sm font-medium disabled:opacity-50"
            >
              {busy ? "On the pass…" : "Send to the pass"}
            </button>
            <p className="text-sm text-smoke">{picked.length} on the board</p>
          </div>
          {error && <p className="mt-3 text-sm text-paprika">{error}</p>}
        </div>

        <div className="ink-card min-h-[320px] rounded-3xl p-8">
          {!plate && <p className="serif-italic text-2xl text-smoke">Nothing on the pass yet.</p>}
          {plate && (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-brass">{plate.style}</p>
                  <h2 className="display mt-2 text-4xl">{plate.name}</h2>
                </div>
                <p className="display text-5xl text-paprika">{plate.score}</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-parchment/80">{plate.narrative}</p>
              {plate.warnings.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-paprika">
                  {plate.warnings.map((w) => (
                    <li key={w}>— {w}</li>
                  ))}
                </ul>
              )}
              <ol className="mt-6 space-y-3 text-sm text-smoke">
                {plate.method.map((m, i) => (
                  <li key={i}>
                    <span className="text-brass">{String(i + 1).padStart(2, "0")} · </span>
                    {m}
                  </li>
                ))}
              </ol>
              {plate.id && (
                <p className="mt-6 text-xs text-smoke">
                  Ticket <span className="text-parchment">{plate.id}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {recent.length > 0 && (
        <section className="mt-20">
          <h2 className="display text-4xl">Recent tickets</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {recent.map((p) => (
              <Link key={p.id} href={`/kitchen/${p.id}`} className="ink-card rounded-2xl p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-brass">{p.style}</p>
                <h3 className="display mt-2 text-2xl">{p.name}</h3>
                <p className="mt-2 text-sm text-smoke">Score {p.score}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
