import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-parchment/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="display text-3xl">Mise</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-smoke">
            Nineteen open-source ingredients. A proper backend. A kitchen that plates what you already have.
          </p>
        </div>
        <div className="text-sm text-smoke">
          <p className="mb-3 uppercase tracking-[0.2em] text-brass">Stations</p>
          <div className="flex flex-col gap-2">
            <Link href="/ingredients" className="hover:text-parchment">
              Ingredients
            </Link>
            <Link href="/pantry" className="hover:text-parchment">
              Pantry
            </Link>
            <Link href="/recipes" className="hover:text-parchment">
              Recipes
            </Link>
            <Link href="/kitchen" className="hover:text-parchment">
              Kitchen
            </Link>
          </div>
        </div>
        <div className="text-sm text-smoke">
          <p className="mb-3 uppercase tracking-[0.2em] text-brass">The house</p>
          <p>Built with Next.js, React, Tailwind, Lucide, and a Node API reading the cloned repositories as inventory.</p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} Mise Atelier</p>
        </div>
      </div>
    </footer>
  );
}
