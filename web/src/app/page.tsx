"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Flame, Library, UtensilsCrossed } from "lucide-react";
import { IngredientCard } from "@/components/IngredientCard";
import { Marquee } from "@/components/Marquee";
import { Waitlist } from "@/components/Waitlist";
import { api, type Ingredient, type Recipe, type Snippet, type Stats } from "@/lib/utils";

export default function HomePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [snippet, setSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    api<{ items: Ingredient[] }>("/api/ingredients").then((d) => setIngredients(d.items));
    api<{ items: Recipe[] }>("/api/recipes").then((d) => setRecipes(d.items));
    api<Stats>("/api/stats").then(setStats);
    api<{ snippet: Snippet }>("/api/daily").then((d) => setSnippet(d.snippet));
  }, []);

  const featured = ingredients.slice(0, 6);

  return (
    <div>
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Copper mise en place on a dark walnut table"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28">
          <p className="text-[11px] uppercase tracking-[0.35em] text-brass">Atelier · Nineteen ingredients</p>
          <h1 className="display mt-5 max-w-4xl text-6xl text-parchment md:text-8xl">
            Everything
            <br />
            in its <span className="serif-italic text-paprika">place.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-parchment/80">
            A kitchen built from the open-source pantry — React, Next, Vue, Angular, shadcn/ui, Lucide, Directus
            and the rest of the nineteen. Frontend for the dining room. A real Node API for the pass.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/kitchen"
              className="rounded-full bg-paprika px-6 py-3 text-sm font-medium text-parchment shadow-glow transition hover:bg-[#c04c14]"
            >
              Compose a plate
            </Link>
            <Link
              href="/ingredients"
              className="rounded-full border border-parchment/25 px-6 py-3 text-sm text-parchment transition hover:border-brass hover:text-brass"
            >
              Walk the pantry
            </Link>
          </div>
        </div>
      </section>

      {ingredients.length > 0 && <Marquee items={ingredients} />}

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-4">
        {[
          { k: "Ingredients", v: stats?.ingredients ?? 19, icon: UtensilsCrossed },
          { k: "Snippets on the board", v: stats?.snippets ?? "—", icon: Flame },
          { k: "CSS protips", v: stats?.protips ?? "—", icon: Library },
          { k: "Algorithms", v: stats?.algorithms ?? "—", icon: ArrowUpRight },
        ].map((s) => (
          <div key={s.k} className="ink-card rounded-2xl p-6">
            <s.icon className="h-4 w-4 text-paprika" />
            <p className="display mt-4 text-4xl">{s.v}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-smoke">{s.k}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-brass">The line</p>
            <h2 className="display mt-2 text-5xl md:text-6xl">Tonight&apos;s ingredients.</h2>
          </div>
          <Link href="/ingredients" className="hidden text-sm text-smoke hover:text-brass md:block">
            See all nineteen →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((item, i) => (
            <IngredientCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-[2rem] px-5">
        <div className="grid overflow-hidden rounded-[2rem] md:grid-cols-2">
          <img src="/images/atelier.jpg" alt="The atelier" className="h-full min-h-[420px] w-full object-cover" />
          <div className="bg-clay px-8 py-12 md:px-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-brass">How we cook</p>
            <h2 className="display mt-3 text-5xl">Frontend at the pass. Backend in the stores.</h2>
            <ul className="mt-8 space-y-5 text-sm leading-relaxed text-parchment/80">
              <li>
                <span className="text-brass">01 — </span>
                Next.js and React plate the dining room, with Tailwind and Lucide as garnish.
              </li>
              <li>
                <span className="text-brass">02 — </span>
                A Node + SQLite API reads the cloned repositories as inventory: snippets, protips, algorithms, practices.
              </li>
              <li>
                <span className="text-brass">03 — </span>
                The kitchen composes a plate from what you pick — score, warnings, and a method.
              </li>
            </ul>
            <Link href="/pantry" className="mt-10 inline-flex items-center gap-2 text-sm text-paprika">
              Open the pantry <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-brass">House recipes</p>
            <h2 className="display mt-2 text-5xl">Combinations that already work.</h2>
          </div>
          <Link href="/recipes" className="text-sm text-smoke hover:text-brass">
            All recipes →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {recipes.map((r) => (
            <Link key={r.slug} href={`/recipes/${r.slug}`} className="ink-card rounded-2xl p-7 transition hover:-translate-y-1">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-brass">
                <span>{r.course}</span>
                <span>{r.time}</span>
              </div>
              <h3 className="display mt-4 text-3xl">{r.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-smoke">{r.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {snippet && (
        <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="ink-card rounded-3xl p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-brass">Knife work · from 30-seconds-of-code</p>
            <h3 className="display mt-3 text-4xl">{snippet.title}</h3>
            <p className="mt-3 text-sm text-smoke">{snippet.excerpt}</p>
            <pre className="mt-6 overflow-x-auto rounded-2xl bg-ink p-5 text-xs leading-relaxed text-brass">
              <code>{snippet.code.slice(0, 700)}</code>
            </pre>
          </div>
          <div className="relative overflow-hidden rounded-3xl">
            <img src="/images/hands.jpg" alt="Hands at the board" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 display text-3xl">Daily cuts from the cloned pantry.</p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 py-10">
        <Waitlist />
      </section>
    </div>
  );
}
