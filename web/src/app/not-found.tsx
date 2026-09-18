import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-32 text-center">
      <p className="text-[11px] uppercase tracking-[0.25em] text-brass">86</p>
      <h1 className="display mt-4 text-6xl">Off the menu.</h1>
      <p className="mt-4 text-smoke">That plate isn&apos;t running tonight.</p>
      <Link href="/" className="mt-8 inline-block text-paprika">
        Return to the dining room
      </Link>
    </div>
  );
}
