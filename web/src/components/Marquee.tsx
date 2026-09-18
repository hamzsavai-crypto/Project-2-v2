import type { Ingredient } from "@/lib/utils";

export function Marquee({ items }: { items: Ingredient[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-parchment/10 bg-clay/60 py-4">
      <div className="marquee">
        {row.map((item, i) => (
          <span key={`${item.slug}-${i}`} className="flex items-center gap-3 text-sm text-parchment/80">
            <span className="h-1.5 w-1.5 rounded-full bg-paprika" />
            <span className="display text-xl">{item.name}</span>
            <span className="text-smoke">· {item.role}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
