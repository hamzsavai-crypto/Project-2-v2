"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/ingredients", label: "Ingredients" },
  { href: "/pantry", label: "Pantry" },
  { href: "/recipes", label: "Recipes" },
  { href: "/kitchen", label: "Kitchen" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-parchment/10 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/mark.png" alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-brass/40" />
          <span className="display text-2xl text-parchment">Mise</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-smoke md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "tracking-wide transition hover:text-parchment",
                pathname.startsWith(l.href) && "text-brass",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/kitchen"
            className="rounded-full bg-paprika px-4 py-2 text-sm font-medium text-parchment transition hover:bg-[#c04c14]"
          >
            Compose a plate
          </Link>
        </div>
      </div>
      <nav className="flex gap-5 overflow-x-auto px-5 pb-3 text-xs uppercase tracking-[0.18em] text-smoke md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={cn(pathname.startsWith(l.href) && "text-brass")}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
