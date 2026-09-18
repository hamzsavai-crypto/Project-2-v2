import type { Analysis, ObservationRow, SavedRun } from "./types";

const KEY = "vpl.notebook.v1";

export function loadNotebook(): SavedRun[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedRun[]) : [];
  } catch {
    return [];
  }
}

export function saveRun(run: SavedRun) {
  const all = loadNotebook().filter((r) => r.id !== run.id);
  all.unshift(run);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 40)));
}

export function deleteRun(id: string) {
  localStorage.setItem(KEY, JSON.stringify(loadNotebook().filter((r) => r.id !== id)));
}

export function makeRun(
  experimentId: string,
  title: string,
  rows: ObservationRow[],
  vars: Record<string, number>,
  analysis: Analysis,
): SavedRun {
  return {
    id: crypto.randomUUID(),
    experimentId,
    title,
    savedAt: new Date().toISOString(),
    rows,
    vars,
    analysis,
  };
}
