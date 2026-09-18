"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { api, type Ingredient, type Recipe } from "@/lib/utils";

export default function IngredientDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<Ingredient | null>(null);
  const [pairs, setPairs] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ item: Ingredient; pairs: Ingredient[]; recipes: Recipe[] }>(`/api/ingredients/${slug}`)
      .then((d) => {
        setItem(d.item);
        setPairs(d.pairs);
        setRecipes(d.recipes);
      })
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error) return <p className="px-5 py-24 text-center text-smoke">{error}</p>;
  if (!item) return <p className="px-5 py-24 text-center text-smoke">Pulling from the stores…</p>;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-[11px] uppercase tracking-[0.25em] text-brass">
        {item.station} · {item.role}
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <h1 className="display text-6xl md:text-8xl">{item.name}</h1>
        <a
          href={item.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-parchment/20 px-4 py-2 text-sm hover:border-brass"
        >
          {item.repo} <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
      <p className="serif-italic mt-8 max-w-2xl text-2xl text-parchment/80">{item.flavor}</p>
      <p className="mt-6 max-w-2xl text-smoke">{item.summary}</p>

      <div className="mt-12 grid gap-4 md:grid-cols-4">
        {item.uses.map((u) => (
          <div key={u} className="ink-card rounded-2xl p-5 text-sm">
            {u}
          </div>
        ))}
      </div>

      {pairs.length > 0 && (
        <section className="mt-16">
          <h2 className="display text-4xl">Pairs with</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {pairs.map((p) => (
              <Link
                key={p.slug}
                href={`/ingredients/${p.slug}`}
                className="rounded-full border border-parchment/15 px-4 py-2 text-sm hover:border-paprika"
              >
                {p.name}
                <span className="ml-2 text-smoke">{p.role}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recipes.length > 0 && (
        <section className="mt-16">
          <h2 className="display text-4xl">Used in</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {recipes.map((r) => (
              <Link key={r.slug} href={`/recipes/${r.slug}`} className="ink-card rounded-2xl p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-brass">{r.course}</p>
                <h3 className="display mt-2 text-3xl">{r.name}</h3>
                <p className="mt-2 text-sm text-smoke">{r.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
