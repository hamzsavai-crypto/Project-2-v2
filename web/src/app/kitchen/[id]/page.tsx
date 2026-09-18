"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, type Plate } from "@/lib/utils";

export default function PlatePage() {
  const { id } = useParams<{ id: string }>();
  const [plate, setPlate] = useState<Plate | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Plate>(`/api/plates/${id}`)
      .then(setPlate)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="px-5 py-24 text-center text-smoke">{error}</p>;
  if (!plate) return <p className="px-5 py-24 text-center text-smoke">Finding the ticket…</p>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-[11px] uppercase tracking-[0.25em] text-brass">
        Ticket {plate.id} · {plate.style}
      </p>
      <h1 className="display mt-4 text-6xl">{plate.name}</h1>
      <p className="display mt-6 text-7xl text-paprika">{plate.score}</p>
      <p className="mt-6 text-lg text-smoke">{plate.narrative}</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {plate.slugs.map((s) => (
          <Link key={s} href={`/ingredients/${s}`} className="rounded-full border border-parchment/15 px-3 py-1 text-sm">
            {s}
          </Link>
        ))}
      </div>
      {plate.warnings.length > 0 && (
        <ul className="mt-8 space-y-2 text-paprika">
          {plate.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <ol className="mt-10 space-y-4">
        {plate.method.map((m, i) => (
          <li key={i} className="flex gap-4">
            <span className="display text-2xl text-brass">{String(i + 1).padStart(2, "0")}</span>
            <p>{m}</p>
          </li>
        ))}
      </ol>
      <Link href="/kitchen" className="mt-12 inline-block text-sm text-paprika">
        ← Back to the kitchen
      </Link>
    </div>
  );
}
