"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type Recipe } from "@/lib/utils";

export default function RecipesPage() {
  const [items, setItems] = useState<Recipe[]>([]);
  useEffect(() => {
    api<{ items: Recipe[] }>("/api/recipes").then((d) => setItems(d.items));
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-[11px] uppercase tracking-[0.25em] text-brass">House recipes</p>
        <h1 className="display mt-3 text-6xl md:text-7xl">
          Combinations,
          <br />
          <span className="serif-italic text-paprika">not chaos.</span>
        </h1>
        <p className="mt-6 max-w-xl text-smoke">
          Four ways to cook with the nineteen. Each recipe is a method, a yield, and a list of what belongs on the
          board.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((r) => (
            <Link key={r.slug} href={`/recipes/${r.slug}`} className="group overflow-hidden rounded-3xl">
              <div className="relative h-52">
                <img
                  src={r.slug.includes("vue") ? "/images/atelier.jpg" : "/images/copper.jpg"}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                <p className="absolute bottom-4 left-5 text-[11px] uppercase tracking-[0.2em] text-brass">
                  {r.course} · {r.time}
                </p>
              </div>
              <div className="ink-card rounded-none border-t-0 p-7">
                <h2 className="display text-4xl">{r.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-smoke">{r.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
