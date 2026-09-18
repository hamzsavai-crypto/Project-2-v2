"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, type Ingredient, type Recipe } from "@/lib/utils";

export default function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    api<{ recipe: Recipe; ingredients: Ingredient[] }>(`/api/recipes/${slug}`).then((d) => {
      setRecipe(d.recipe);
      setIngredients(d.ingredients);
    });
  }, [slug]);

  if (!recipe) return <p className="px-5 py-24 text-center text-smoke">Consulting the book…</p>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-[11px] uppercase tracking-[0.25em] text-brass">
        {recipe.course} · {recipe.time}
      </p>
      <h1 className="display mt-4 text-6xl md:text-7xl">{recipe.name}</h1>
      <p className="mt-6 text-lg text-smoke">{recipe.summary}</p>

      <div className="mt-12">
        <h2 className="text-[11px] uppercase tracking-[0.25em] text-brass">On the board</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {ingredients.map((i) => (
            <Link
              key={i.slug}
              href={`/ingredients/${i.slug}`}
              className="rounded-full border border-parchment/15 px-4 py-2 text-sm hover:border-paprika"
            >
              {i.name}
            </Link>
          ))}
        </div>
      </div>

      <ol className="mt-12 space-y-6">
        {recipe.method.map((step, i) => (
          <li key={i} className="flex gap-5">
            <span className="display text-3xl text-paprika">{String(i + 1).padStart(2, "0")}</span>
            <p className="pt-1 text-parchment/85">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 ink-card rounded-3xl p-8">
        <p className="text-[11px] uppercase tracking-[0.25em] text-brass">Yield</p>
        <p className="display mt-3 text-3xl">{recipe.yield}</p>
        <Link href="/kitchen" className="mt-6 inline-block text-sm text-paprika">
          Compose your own plate →
        </Link>
      </div>
    </div>
  );
}
