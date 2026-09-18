import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "./db.js";
import { INGREDIENTS, RECIPES } from "./ingredients.js";
import { parseSnippets, parseProtips, parseAlgorithms, parsePractices } from "./parsers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "repos");

export function seed() {
  const ingredientCount = db.prepare("SELECT COUNT(*) AS n FROM ingredients").get().n;
  if (ingredientCount === 0) {
    const insert = db.prepare(`
      INSERT INTO ingredients
        (slug, name, repo, github, role, station, category, flavor, summary, uses_json, pairs_json, accent)
      VALUES
        (@slug, @name, @repo, @github, @role, @station, @category, @flavor, @summary, @uses_json, @pairs_json, @accent)
    `);
    for (const i of INGREDIENTS) {
      insert.run({
        slug: i.slug,
        name: i.name,
        repo: i.repo,
        github: i.github,
        role: i.role,
        station: i.station,
        category: i.category,
        flavor: i.flavor,
        summary: i.summary,
        uses_json: JSON.stringify(i.uses),
        pairs_json: JSON.stringify(i.pairsWith),
        accent: i.accent,
      });
    }
  }

  const recipeCount = db.prepare("SELECT COUNT(*) AS n FROM recipes").get().n;
  if (recipeCount === 0) {
    const insert = db.prepare(`
      INSERT INTO recipes
        (slug, name, course, time, summary, ingredients_json, method_json, yield)
      VALUES
        (@slug, @name, @course, @time, @summary, @ingredients_json, @method_json, @yield)
    `);
    for (const r of RECIPES) {
      insert.run({
        slug: r.slug,
        name: r.name,
        course: r.course,
        time: r.time,
        summary: r.summary,
        ingredients_json: JSON.stringify(r.ingredients),
        method_json: JSON.stringify(r.method),
        yield: r.yield,
      });
    }
  }

  if (db.prepare("SELECT COUNT(*) AS n FROM snippets").get().n === 0) {
    const insert = db.prepare(`
      INSERT INTO snippets (slug, title, excerpt, tags_json, language, code, source)
      VALUES (@slug, @title, @excerpt, @tags_json, @language, @code, @source)
    `);
    const rows = parseSnippets(repoRoot);
    for (const s of rows) {
      insert.run({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        tags_json: JSON.stringify(s.tags),
        language: s.language,
        code: s.code,
        source: s.source,
      });
    }
  }

  if (db.prepare("SELECT COUNT(*) AS n FROM protips").get().n === 0) {
    const insert = db.prepare(`
      INSERT INTO protips (slug, title, body, code, source)
      VALUES (@slug, @title, @body, @code, @source)
    `);
    const rows = parseProtips(repoRoot);
    for (const p of rows) {
      try {
        insert.run(p);
      } catch {
        /* duplicate slugs */
      }
    }
  }

  if (db.prepare("SELECT COUNT(*) AS n FROM algorithms").get().n === 0) {
    const insert = db.prepare(`
      INSERT INTO algorithms (slug, name, category, level, blurb, path)
      VALUES (@slug, @name, @category, @level, @blurb, @path)
    `);
    const rows = parseAlgorithms(repoRoot);
    for (const a of rows) {
      try {
        insert.run(a);
      } catch {
        /* duplicate slugs */
      }
    }
  }

  if (db.prepare("SELECT COUNT(*) AS n FROM practices").get().n === 0) {
    const insert = db.prepare(`
      INSERT INTO practices (slug, code, title, section)
      VALUES (@slug, @code, @title, @section)
    `);
    const rows = parsePractices(repoRoot);
    for (const p of rows) {
      try {
        insert.run(p);
      } catch {
        /* duplicate */
      }
    }
  }
}

export function stats() {
  const count = (table) => db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n;
  return {
    ingredients: count("ingredients"),
    recipes: count("recipes"),
    snippets: count("snippets"),
    protips: count("protips"),
    algorithms: count("algorithms"),
    practices: count("practices"),
    plates: count("plates"),
    waitlist: count("waitlist"),
  };
}
