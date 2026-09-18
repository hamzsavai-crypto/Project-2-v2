import type { ExperimentModule } from "@/lib/types";
import { ohmsLaw } from "./ohms-law";
import { pendulum } from "./pendulum";
import { lens } from "./lens";
import { projectile } from "./projectile";

export const EXPERIMENTS: ExperimentModule[] = [ohmsLaw, pendulum, lens, projectile];

export function getExperiment(id: string) {
  return EXPERIMENTS.find((e) => e.id === id);
}
