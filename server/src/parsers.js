import fs from "node:fs";
import path from "node:path";

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[`'"’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: raw };
  const yaml = raw.slice(4, end).trim();
  const body = raw.slice(end + 4).trim();
  const data = {};
  for (const line of yaml.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val === "true") val = true;
    else if (val === "false") val = false;
    else val = val.replace(/^["']|["']$/g, "");
    data[key] = val;
  }
  return { data, body };
}

function firstCodeBlock(markdown) {
  const match = markdown.match(/```(?:js|javascript|ts|css)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : "";
}

export function parseSnippets(repoRoot, limit = 72) {
  const dir = path.join(repoRoot, "30-seconds-of-code", "content", "snippets", "js", "s");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const out = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, body } = parseFrontmatter(raw);
    if (data.listed === false) continue;
    const code = firstCodeBlock(body);
    if (!code) continue;
    const tags = String(data.tags || "")
      .replace(/[\[\]]/g, "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    out.push({
      slug: file.replace(/\.md$/, ""),
      title: data.shortTitle || data.title || file,
      excerpt: data.excerpt || body.split("\n").find((l) => l && !l.startsWith("#") && !l.startsWith("```")) || "",
      tags,
      language: data.language || "javascript",
      code: code.slice(0, 1800),
      source: "30-seconds-of-code",
    });
    if (out.length >= limit) break;
  }
  return out;
}

export function parseProtips(repoRoot) {
  const file = path.join(repoRoot, "css-protips", "README.md");
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf8");
  const parts = raw.split(/\n### /).slice(1);
  return parts
    .map((part) => {
      const lines = part.split("\n");
      const title = lines[0].replace(/`/g, "").trim();
      if (!title || ["Support", "Translations"].includes(title)) return null;
      const rest = lines.slice(1).join("\n");
      const body = rest
        .replace(/```[\s\S]*?```/g, "")
        .replace(/#### \[Demo\][^\n]*/g, "")
        .replace(/<sup>[\s\S]*?<\/sup>/g, "")
        .replace(/> \[!\w+\][\s\S]*?(?=\n\n|$)/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, 600);
      const code = firstCodeBlock(rest);
      if (!body) return null;
      return {
        slug: slugify(title),
        title,
        body,
        code: code.slice(0, 900) || null,
        source: "css-protips",
      };
    })
    .filter(Boolean);
}

export function parseAlgorithms(repoRoot) {
  const file = path.join(repoRoot, "javascript-algorithms", "README.md");
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf8");
  const start = raw.indexOf("## Data Structures");
  const end = raw.indexOf("## How to use this repository");
  const section = raw.slice(start, end === -1 ? undefined : end);
  const items = [];
  let category = "General";
  for (const line of section.split("\n")) {
    const cat = line.match(/^\* \*\*(.+)\*\*/);
    if (cat) {
      category = cat[1];
      continue;
    }
    const heading = line.match(/^## (.+)/);
    if (heading && !heading[1].startsWith("Data") && !heading[1].startsWith("Algorithm")) {
      category = heading[1].replace(/\(.*\)/, "").trim();
      continue;
    }
    const item = line.match(/`([BA])` \[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.*))?/);
    if (!item) continue;
    items.push({
      slug: slugify(item[2]),
      name: item[2],
      category: category === "Data Structures" ? "Data Structures" : category,
      level: item[1] === "B" ? "Beginner" : "Advanced",
      blurb: (item[4] || "").replace(/<[^>]+>/g, "").trim(),
      path: item[3],
    });
  }
  return items;
}

export function parsePractices(repoRoot) {
  const file = path.join(repoRoot, "nodebestpractices", "README.md");
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf8");
  const items = [];
  const re = /## !\[✔\]\s+((\d+)\.(\d+))\s+(.+)/g;
  let match;
  const sections = {
    1: "Project structure",
    2: "Error handling",
    3: "Code style",
    4: "Testing",
    5: "Going to production",
    6: "Security",
    7: "Performance",
    8: "Docker",
  };
  while ((match = re.exec(raw))) {
    items.push({
      slug: slugify(match[1] + "-" + match[4]),
      code: match[1],
      title: match[4].trim(),
      section: sections[Number(match[2])] || "Practice",
    });
  }
  return items;
}
