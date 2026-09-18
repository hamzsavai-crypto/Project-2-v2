import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(path.join(dataDir, "mise.sqlite"));

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS ingredients (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    repo TEXT NOT NULL,
    github TEXT NOT NULL,
    role TEXT NOT NULL,
    station TEXT NOT NULL,
    category TEXT NOT NULL,
    flavor TEXT NOT NULL,
    summary TEXT NOT NULL,
    uses_json TEXT NOT NULL,
    pairs_json TEXT NOT NULL,
    accent TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS recipes (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    course TEXT NOT NULL,
    time TEXT NOT NULL,
    summary TEXT NOT NULL,
    ingredients_json TEXT NOT NULL,
    method_json TEXT NOT NULL,
    yield TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    tags_json TEXT NOT NULL,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    source TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS protips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    code TEXT,
    source TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS algorithms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    blurb TEXT NOT NULL,
    path TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS practices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    section TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slugs_json TEXT NOT NULL,
    score INTEGER NOT NULL,
    style TEXT NOT NULL,
    narrative TEXT NOT NULL,
    warnings_json TEXT NOT NULL,
    method_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export function rowToIngredient(row) {
  if (!row) return null;
  return {
    slug: row.slug,
    name: row.name,
    repo: row.repo,
    github: row.github,
    role: row.role,
    station: row.station,
    category: row.category,
    flavor: row.flavor,
    summary: row.summary,
    uses: JSON.parse(row.uses_json),
    pairsWith: JSON.parse(row.pairs_json),
    accent: row.accent,
  };
}

export function rowToRecipe(row) {
  if (!row) return null;
  return {
    slug: row.slug,
    name: row.name,
    course: row.course,
    time: row.time,
    summary: row.summary,
    ingredients: JSON.parse(row.ingredients_json),
    method: JSON.parse(row.method_json),
    yield: row.yield,
  };
}

export function rowToSnippet(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    tags: JSON.parse(row.tags_json),
    language: row.language,
    code: row.code,
    source: row.source,
  };
}

export function rowToProtip(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    body: row.body,
    code: row.code,
    source: row.source,
  };
}

export function rowToPlate(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slugs: JSON.parse(row.slugs_json),
    score: row.score,
    style: row.style,
    narrative: row.narrative,
    warnings: JSON.parse(row.warnings_json),
    method: JSON.parse(row.method_json),
    createdAt: row.created_at,
  };
}
