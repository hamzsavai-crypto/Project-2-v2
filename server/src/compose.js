import { INGREDIENTS } from "./ingredients.js";

const bySlug = Object.fromEntries(INGREDIENTS.map((i) => [i.slug, i]));

const NAMES = [
  ["House", "Fire", "Copper", "Night", "Sage", "Brass", "Parchment", "Ember", "Quiet", "Amber"],
  ["Plate", "Service", "Reduction", "Service", "Board", "Pass", "Supper", "Stack", "Service", "Cut"],
];

function hash(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export function composePlate(slugs) {
  const unique = [...new Set(slugs)].filter((s) => bySlug[s]);
  if (!unique.length) {
    throw Object.assign(new Error("Choose at least one ingredient."), { status: 400 });
  }

  const items = unique.map((s) => bySlug[s]);
  const cats = new Set(items.map((i) => i.category));
  const names = items.map((i) => i.name);

  let score = 54 + unique.length * 6;
  const warnings = [];
  const method = [];

  const has = (s) => unique.includes(s);

  if (has("react") && has("next.js")) score += 12;
  if (has("vue") && has("nuxt")) score += 12;
  if (has("ui") && has("lucide")) score += 8;
  if (has("create-t3-app") && has("next.js")) score += 8;
  if (has("nodebestpractices")) score += 6;
  if (has("storybook")) score += 5;
  if (has("css-protips") && (has("ui") || has("awesome-tailwindcss"))) score += 4;

  if (has("react") && has("vue") && has("angular")) {
    score -= 18;
    warnings.push("Three UI runtimes on one plate is a banquet no one ordered. Pick a stock.");
  } else if (has("react") && has("vue")) {
    score -= 6;
    warnings.push("React and Vue can share a pass, but not a runtime. Keep them in separate courses.");
  }

  if (has("next.js") && has("nuxt")) {
    score -= 8;
    warnings.push("Next and Nuxt are both dining rooms. One house, one pass.");
  }

  if (!items.some((i) => i.category === "framework") && items.some((i) => i.category === "interface")) {
    warnings.push("Beautiful plating without a stock. Add React, Vue, or Angular.");
    score -= 4;
  }

  if (has("directus") && !has("next.js") && !has("nuxt")) {
    warnings.push("A pantry needs a dining room. Pair Directus with Next.js or Nuxt.");
  }

  let style = "House combination";
  if (has("freeCodeCamp") || unique.filter((s) => bySlug[s].category === "learn").length >= 3) {
    style = "Study kitchen";
  }
  if (has("angular") && unique.length >= 3) style = "Banquet service";
  if (has("vue") && !has("react")) style = "Garden service";
  if (has("react") && has("next.js") && has("ui")) style = "Signature tasting";
  if (warnings.length >= 2) style = "Experimental fusion";

  if (has("create-t3-app")) {
    method.push("Start from the T3 scaffold so TypeScript and Tailwind are already on the board.");
  } else if (has("next.js")) {
    method.push("Open a Next.js app — App Router as the dining room, Route Handlers as the pass.");
  } else if (has("nuxt")) {
    method.push("Open a Nuxt app. File-based routing is your mise.");
  } else if (has("angular")) {
    method.push("Generate an Angular workspace. Let the compiler take the long prep.");
  } else {
    method.push(`Begin with ${names[0]} and keep the rest within reach.`);
  }

  if (has("ui")) method.push("Bring shadcn/ui in as owned source. Season components; don't wrap a black box.");
  if (has("lucide")) method.push("Garnish interactive states with Lucide so the icon language never drifts.");
  if (has("directus")) method.push("Inventory content in Directus. Editors stay out of the git pantry.");
  if (has("storybook")) method.push("Taste every shared component in Storybook before it reaches a page.");
  if (has("30-seconds-of-code")) method.push("Keep 30-seconds snippets at the board for knife work you shouldn't rewrite.");
  if (has("css-protips")) method.push("Season layout with CSS protips before reaching for another plugin.");
  if (has("javascript-algorithms")) method.push("When a helper gets clever, check javascript-algorithms instead of inventing a sort.");
  if (has("nodebestpractices")) method.push("Walk the Node hygiene list before the first deploy.");
  if (has("jsdelivr")) method.push("Send static garnish through jsDelivr when you need a courier, not a kitchen.");
  if (has("awesome-react") || has("awesome-vue") || has("awesome-tailwindcss")) {
    method.push("Use the awesome lists as annotated menus — specialists, not a second stack.");
  }
  if (!method.length) method.push("Cook simply. Stop when it tastes like itself.");

  score = Math.max(32, Math.min(99, score));

  const h = hash(unique.sort().join(","));
  const name = `${NAMES[0][h % NAMES[0].length]} ${NAMES[1][(h >> 4) % NAMES[1].length]}`;

  const narrative = `A ${style.toLowerCase()} of ${names.join(", ")}. ${
    cats.has("learn") && cats.has("framework")
      ? "Technique under the service — the kitchen that teaches while it plates."
      : cats.has("data")
        ? "Inventory on one side of the pass, presentation on the other."
        : "Built from the nineteen-ingredient pantry, nothing imported for spectacle."
  }`;

  return {
    name,
    slugs: unique,
    score,
    style,
    narrative,
    warnings,
    method,
  };
}
