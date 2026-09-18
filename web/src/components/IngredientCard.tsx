import Link from "next/link";
import type { Ingredient } from "@/lib/utils";

export function IngredientCard({ item, index }: { item: Ingredient; index?: number }) {
  return (
    <Link
      href={`/ingredients/${item.slug}`}
      className="ink-card group relative flex flex-col overflow-hidden rounded-2xl p-6 transition duration-300 hover:-translate-y-1"
    >
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60"
        style={{ background: item.accent }}
      />
      <div className="flex items-start justify-between">
        <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
          {String((index ?? 0) + 1).padStart(2, "0")} · {item.role}
        </p>
        <span className="rounded-full border border-parchment/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-smoke">
          {item.station}
        </span>
      </div>
      <h3 className="display mt-6 text-3xl text-parchment">{item.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-smoke">{item.flavor}</p>
      <p className="mt-6 text-xs text-parchment/50">{item.repo}</p>
    </Link>
  );
}
