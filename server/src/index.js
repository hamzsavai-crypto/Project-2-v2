import express from "express";
import cors from "cors";
import morgan from "morgan";
import crypto from "node:crypto";
import { z } from "zod";
import { db, rowToIngredient, rowToRecipe, rowToSnippet, rowToProtip, rowToPlate } from "./db.js";
import { seed, stats } from "./seed.js";
import { composePlate } from "./compose.js";

seed();

const app = express();
const PORT = Number(process.env.PORT || 8787);

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);
app.use(express.json({ limit: "32kb" }));
app.use(morgan("tiny"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "mise-api", time: new Date().toISOString() });
});

app.get("/api/stats", (_req, res) => {
  res.json(stats());
});

app.get("/api/ingredients", (req, res) => {
  const category = req.query.category ? String(req.query.category) : null;
  const q = req.query.q ? String(req.query.q).toLowerCase() : null;
  let rows = db.prepare("SELECT * FROM ingredients ORDER BY name").all();
  if (category) rows = rows.filter((r) => r.category === category);
  let items = rows.map(rowToIngredient);
  if (q) {
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.role.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.flavor.toLowerCase().includes(q),
    );
  }
  res.json({ items, total: items.length });
});

app.get("/api/ingredients/:slug", (req, res) => {
  const row = db.prepare("SELECT * FROM ingredients WHERE slug = ?").get(req.params.slug);
  if (!row) return res.status(404).json({ error: "Unknown ingredient." });
  const item = rowToIngredient(row);
  const pairs = item.pairsWith
    .map((slug) => rowToIngredient(db.prepare("SELECT * FROM ingredients WHERE slug = ?").get(slug)))
    .filter(Boolean);
  const recipes = db
    .prepare("SELECT * FROM recipes")
    .all()
    .map(rowToRecipe)
    .filter((r) => r.ingredients.includes(item.slug));
  res.json({ item, pairs, recipes });
});

app.get("/api/recipes", (_req, res) => {
  res.json({ items: db.prepare("SELECT * FROM recipes").all().map(rowToRecipe) });
});

app.get("/api/recipes/:slug", (req, res) => {
  const row = db.prepare("SELECT * FROM recipes WHERE slug = ?").get(req.params.slug);
  if (!row) return res.status(404).json({ error: "Unknown recipe." });
  const recipe = rowToRecipe(row);
  const ingredients = recipe.ingredients
    .map((slug) => rowToIngredient(db.prepare("SELECT * FROM ingredients WHERE slug = ?").get(slug)))
    .filter(Boolean);
  res.json({ recipe, ingredients });
});

app.get("/api/snippets", (req, res) => {
  const tag = req.query.tag ? String(req.query.tag) : null;
  const limit = Math.min(Number(req.query.limit || 24), 80);
  const offset = Number(req.query.offset || 0);
  let rows = db.prepare("SELECT * FROM snippets ORDER BY id").all();
  if (tag) rows = rows.filter((r) => JSON.parse(r.tags_json).includes(tag));
  const total = rows.length;
  const items = rows.slice(offset, offset + limit).map(rowToSnippet);
  const tags = [
    ...new Set(
      db
        .prepare("SELECT tags_json FROM snippets")
        .all()
        .flatMap((r) => JSON.parse(r.tags_json)),
    ),
  ].sort();
  res.json({ items, total, tags });
});

app.get("/api/protips", (_req, res) => {
  res.json({ items: db.prepare("SELECT * FROM protips ORDER BY id").all().map(rowToProtip) });
});

app.get("/api/algorithms", (req, res) => {
  const category = req.query.category ? String(req.query.category) : null;
  let rows = db.prepare("SELECT * FROM algorithms ORDER BY category, name").all();
  if (category) rows = rows.filter((r) => r.category === category);
  const categories = [...new Set(db.prepare("SELECT category FROM algorithms").all().map((r) => r.category))];
  res.json({ items: rows, categories });
});

app.get("/api/practices", (_req, res) => {
  const rows = db.prepare("SELECT * FROM practices ORDER BY code").all();
  const sections = [...new Set(rows.map((r) => r.section))];
  res.json({ items: rows, sections });
});

app.get("/api/daily", (_req, res) => {
  const day = Math.floor(Date.now() / 86400000);
  const pick = (table) => {
    const n = db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n;
    if (!n) return null;
    return db.prepare(`SELECT * FROM ${table} LIMIT 1 OFFSET ?`).get(day % n);
  };
  res.json({
    snippet: rowToSnippet(pick("snippets")),
    protip: rowToProtip(pick("protips")),
    algorithm: pick("algorithms"),
    practice: pick("practices"),
  });
});

const plateSchema = z.object({
  slugs: z.array(z.string().min(1)).min(1).max(12),
});

app.post("/api/plates", (req, res) => {
  const parsed = plateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Choose between 1 and 12 ingredients.", details: parsed.error.flatten() });
  }
  try {
    const composed = composePlate(parsed.data.slugs);
    const id = crypto.randomBytes(4).toString("hex");
    db.prepare(
      `INSERT INTO plates (id, name, slugs_json, score, style, narrative, warnings_json, method_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      composed.name,
      JSON.stringify(composed.slugs),
      composed.score,
      composed.style,
      composed.narrative,
      JSON.stringify(composed.warnings),
      JSON.stringify(composed.method),
      new Date().toISOString(),
    );
    res.status(201).json({ id, ...composed });
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

app.get("/api/plates", (_req, res) => {
  const items = db
    .prepare("SELECT * FROM plates ORDER BY created_at DESC LIMIT 24")
    .all()
    .map(rowToPlate);
  res.json({ items });
});

app.get("/api/plates/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM plates WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Plate not found." });
  res.json(rowToPlate(row));
});

const waitlistSchema = z.object({
  email: z.string().email(),
  note: z.string().max(280).optional(),
});

app.post("/api/waitlist", (req, res) => {
  const parsed = waitlistSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "A real email, please." });
  }
  try {
    db.prepare("INSERT INTO waitlist (email, note, created_at) VALUES (?, ?, ?)").run(
      parsed.data.email.toLowerCase(),
      parsed.data.note || null,
      new Date().toISOString(),
    );
    res.status(201).json({ ok: true, message: "You're on the book." });
  } catch {
    res.json({ ok: true, message: "Already on the book." });
  }
});

app.post("/api/events", (req, res) => {
  const name = String(req.body?.name || "unknown").slice(0, 64);
  const payload = req.body?.payload ?? {};
  db.prepare("INSERT INTO events (name, payload_json, created_at) VALUES (?, ?, ?)").run(
    name,
    JSON.stringify(payload),
    new Date().toISOString(),
  );
  res.status(202).json({ ok: true });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "The pass is down. Try again." });
});

app.listen(PORT, "0.0.0.0", () => {
  const s = stats();
  console.log(`Mise API on :${PORT}`);
  console.log(
    `Seeded ${s.ingredients} ingredients, ${s.snippets} snippets, ${s.protips} protips, ${s.algorithms} algorithms, ${s.practices} practices.`,
  );
});
