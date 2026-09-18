import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "The pass is down.");
  }
  return data as T;
}

export type Ingredient = {
  slug: string;
  name: string;
  repo: string;
  github: string;
  role: string;
  station: string;
  category: string;
  flavor: string;
  summary: string;
  uses: string[];
  pairsWith: string[];
  accent: string;
};

export type Recipe = {
  slug: string;
  name: string;
  course: string;
  time: string;
  summary: string;
  ingredients: string[];
  method: string[];
  yield: string;
};

export type Snippet = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  language: string;
  code: string;
  source: string;
};

export type Protip = {
  id: number;
  slug: string;
  title: string;
  body: string;
  code: string | null;
  source: string;
};

export type Plate = {
  id?: string;
  name: string;
  slugs: string[];
  score: number;
  style: string;
  narrative: string;
  warnings: string[];
  method: string[];
  createdAt?: string;
};

export type Stats = {
  ingredients: number;
  recipes: number;
  snippets: number;
  protips: number;
  algorithms: number;
  practices: number;
  plates: number;
  waitlist: number;
};
