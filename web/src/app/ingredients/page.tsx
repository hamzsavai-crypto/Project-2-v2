"use client";

import { useEffect, useMemo, useState } from "react";
import { IngredientCard } from "@/components/IngredientCard";
import { api, type Ingredient } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "framework", label: "Stock" },
  { id: "interface", label: "Plating" },
  { id: "scaffold", label: "Prep" },
  { id: "data", label: "Stores" },
  { id: "learn", label: "Academy" },
  { id: "list", label: "Menus" },
  { id: "tooling", label: "Lab" },
  { id: "infra", label: "Service" },
];

export default function IngredientsPage() {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  useEffect(() => {
    api<{ items: Ingredient[] }>("/api/ingredients").then((d) => setItems(d.items));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const okCat = cat === "all" || i.category === cat;
      const okQ =
        !q ||
        [i.name, i.role, i.flavor, i.summary, i.repo].join(" ").toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [items, q, cat]);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-parchment/10">
        <img src="/images/pantry.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 to-ink" />
        <div className="relative mx-auto max-w-6xl px-5 py-24">
          <p className="text-[11px] uppercase tracking-[0.25em] text-brass">Inventory</p>
          <h1 className="display mt-3 text-6xl md:text-7xl">The nineteen.</h1>
          <p className="mt-5 max-w-xl text-smoke">
            Each clone is an ingredient: a role on the line, a station, and the company it keeps. Nothing here is
            decorative.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.16em] ${
                  cat === c.id ? "bg-paprika text-parchment" : "border border-parchment/15 text-smoke"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the pantry…"
            className="rounded-full border border-parchment/15 bg-clay px-4 py-2 text-sm outline-none ring-paprika/40 focus:ring-2"
          />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {filtered.map((item, i) => (
            <IngredientCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
