"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/utils";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await api<{ message: string }>("/api/waitlist", {
        method: "POST",
        body: JSON.stringify({ email, note }),
      });
      setStatus("ok");
      setMessage(res.message);
      setEmail("");
      setNote("");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Could not take the reservation.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="ink-card rounded-3xl p-8 md:p-10">
      <p className="text-[11px] uppercase tracking-[0.25em] text-brass">The book</p>
      <h2 className="display mt-3 text-4xl md:text-5xl">Reserve a stool at the pass.</h2>
      <p className="mt-4 max-w-lg text-smoke">
        Mise is a kitchen, not a newsletter mill. Leave an email if you want the next tasting — new recipes, new plates.
      </p>
      <div className="mt-8 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@atelier.dev"
          className="rounded-full border border-parchment/15 bg-ink px-5 py-3 text-sm outline-none ring-paprika/40 placeholder:text-smoke focus:ring-2"
        />
        <button
          disabled={status === "loading"}
          className="rounded-full bg-paprika px-6 py-3 text-sm font-medium text-parchment transition hover:bg-[#c04c14] disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Hold my place"}
        </button>
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Anything we should know? (optional)"
        className="mt-3 w-full rounded-full border border-parchment/10 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-smoke/70"
      />
      {message && (
        <p className={`mt-4 text-sm ${status === "err" ? "text-paprika" : "text-brass"}`}>{message}</p>
      )}
    </form>
  );
}
