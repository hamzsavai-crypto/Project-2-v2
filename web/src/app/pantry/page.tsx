"use client";

import { useEffect, useState } from "react";
import { api, type Protip, type Snippet } from "@/lib/utils";

type Algo = {
  id: number;
  slug: string;
  name: string;
  category: string;
  level: string;
  blurb: string;
  path: string;
};
type Practice = { id: number; slug: string; code: string; title: string; section: string };

const tabs = [
  { id: "snippets", label: "Knife work" },
  { id: "protips", label: "Seasoning" },
  { id: "algorithms", label: "Technique" },
  { id: "practices", label: "Hygiene" },
] as const;

export default function PantryPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("snippets");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string | null>(null);
  const [protips, setProtips] = useState<Protip[]>([]);
  const [algos, setAlgos] = useState<Algo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cat, setCat] = useState<string | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    api<{ items: Snippet[]; tags: string[] }>("/api/snippets?limit=80").then((d) => {
      setSnippets(d.items);
      setTags(d.tags);
    });
    api<{ items: Protip[] }>("/api/protips").then((d) => setProtips(d.items));
    api<{ items: Algo[]; categories: string[] }>("/api/algorithms").then((d) => {
      setAlgos(d.items);
      setCategories(d.categories);
    });
    api<{ items: Practice[] }>("/api/practices").then((d) => setPractices(d.items));
  }, []);

  const shownSnippets = tag ? snippets.filter((s) => s.tags.includes(tag)) : snippets;
  const shownAlgos = cat ? algos.filter((a) => a.category === cat) : algos;

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src="/images/plaster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 to-ink" />
        <div className="relative mx-auto max-w-6xl px-5 py-20">
          <p className="text-[11px] uppercase tracking-[0.25em] text-brass">The pantry</p>
          <h1 className="display mt-3 text-6xl md:text-7xl">
            What the clones
            <br />
            actually <span className="serif-italic text-paprika">hold.</span>
          </h1>
          <p className="mt-6 max-w-xl text-smoke">
            Parsed live from the repositories on disk: 30-seconds snippets, CSS protips, JavaScript algorithms, and
            Node hygiene. This is inventory, not a screenshot.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-wrap gap-2 border-b border-parchment/10 pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm ${
                tab === t.id ? "bg-parchment text-ink" : "text-smoke hover:text-parchment"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "snippets" && (
          <div className="mt-8">
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setTag(null)}
                className={`rounded-full px-3 py-1 text-xs ${!tag ? "bg-paprika" : "border border-parchment/15 text-smoke"}`}
              >
                All
              </button>
              {tags.slice(0, 18).map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    tag === t ? "bg-paprika" : "border border-parchment/15 text-smoke"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {shownSnippets.map((s) => (
                <article key={s.slug} className="ink-card rounded-2xl p-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-brass">{s.tags.join(" · ")}</p>
                  <h3 className="display mt-2 text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-smoke">{s.excerpt}</p>
                  <pre className="mt-4 overflow-x-auto rounded-xl bg-ink p-4 text-[11px] leading-relaxed text-brass/90">
                    <code>{s.code.slice(0, 420)}</code>
                  </pre>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "protips" && (
          <div className="mt-8 space-y-4">
            {protips.map((p) => (
              <article key={p.slug} className="ink-card rounded-2xl p-6">
                <button className="w-full text-left" onClick={() => setOpen(open === p.slug ? null : p.slug)}>
                  <h3 className="display text-2xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-smoke">{p.body}</p>
                </button>
                {open === p.slug && p.code && (
                  <pre className="mt-4 overflow-x-auto rounded-xl bg-ink p-4 text-[11px] text-brass">
                    <code>{p.code}</code>
                  </pre>
                )}
              </article>
            ))}
          </div>
        )}

        {tab === "algorithms" && (
          <div className="mt-8">
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setCat(null)}
                className={`rounded-full px-3 py-1 text-xs ${!cat ? "bg-paprika" : "border border-parchment/15 text-smoke"}`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    cat === c ? "bg-paprika" : "border border-parchment/15 text-smoke"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {shownAlgos.map((a) => (
                <article key={a.slug} className="ink-card rounded-2xl p-5">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-brass">
                    <span>{a.category}</span>
                    <span>{a.level}</span>
                  </div>
                  <h3 className="mt-3 font-medium">{a.name}</h3>
                  {a.blurb && <p className="mt-2 text-xs leading-relaxed text-smoke">{a.blurb}</p>}
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "practices" && (
          <div className="mt-8 space-y-3">
            {practices.map((p) => (
              <article key={p.slug} className="ink-card flex items-start gap-4 rounded-2xl p-5">
                <span className="display text-xl text-paprika">{p.code}</span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-brass">{p.section}</p>
                  <h3 className="mt-1">{p.title}</h3>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
