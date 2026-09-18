# Mise

Nineteen open-source ingredients. One kitchen.

A full-stack atelier built from the cloned Web Development pantry: **Next.js + React + Tailwind + Lucide** on the dining room side, a **Node.js + SQLite API** on the pass. The backend reads the repositories on disk and serves them as inventory — snippets, CSS protips, algorithms, and Node practices.

## Run

```bash
npm install
npm run install:all
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:8787/api/health](http://localhost:8787/api/health)

The Next.js app proxies `/api/*` to the backend.

## What you get

| Station | Route | What it does |
| --- | --- | --- |
| Dining room | `/` | Cinematic home, daily knife work, waitlist |
| Inventory | `/ingredients` | All 19 cloned repos as ingredients |
| Pantry | `/pantry` | Live-parsed snippets, protips, algorithms, practices |
| Recipes | `/recipes` | House combinations (T3, Vue, study, banquet) |
| Kitchen | `/kitchen` | Compose a plate — scored, saved to SQLite |

## API

| Method | Path | |
| --- | --- | --- |
| GET | `/api/ingredients` | Catalog |
| GET | `/api/ingredients/:slug` | Detail + pairings |
| GET | `/api/snippets` | From `30-seconds-of-code` |
| GET | `/api/protips` | From `css-protips` |
| GET | `/api/algorithms` | From `javascript-algorithms` |
| GET | `/api/practices` | From `nodebestpractices` |
| GET | `/api/daily` | One of each, by day |
| POST | `/api/plates` | `{ slugs: string[] }` → composed ticket |
| POST | `/api/waitlist` | `{ email, note? }` |

## Ingredients (cloned into `repos/`)

shadcn/ui · Lucide · T3 Stack · Directus · freeCodeCamp · 30-seconds-of-code · javascript-algorithms · React · Vue · Angular · Next.js · Nuxt · awesome-react · awesome-vue · nodebestpractices · Storybook · css-protips · awesome-tailwindcss · jsDelivr

Re-clone with `./clone-repos.sh`.
