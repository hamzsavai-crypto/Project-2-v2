import type { ComponentType } from "react";

export type LabStep =
  | "theory"
  | "apparatus"
  | "procedure"
  | "lab"
  | "observations"
  | "analysis"
  | "result";

export const LAB_STEPS: { id: LabStep; label: string }[] = [
  { id: "theory", label: "Theory" },
  { id: "apparatus", label: "Apparatus" },
  { id: "procedure", label: "Procedure" },
  { id: "lab", label: "Interactive Lab" },
  { id: "observations", label: "Observations" },
  { id: "analysis", label: "Analysis" },
  { id: "result", label: "Result" },
];

export type ControlDef = {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
};

export type ColumnDef = {
  key: string;
  label: string;
  unit: string;
};

export type ObservationRow = Record<string, number>;

export type GraphSpec = {
  title: string;
  xLabel: string;
  yLabel: string;
  points: { x: number; y: number }[];
  fit?: { slope: number; intercept: number };
};

export type Analysis = {
  lines: { label: string; value: string }[];
  graph: GraphSpec;
  conclusion: string;
  accepted?: string;
  errorPct?: number;
};

export type SimProps = {
  vars: Record<string, number>;
  setVar: (key: string, value: number) => void;
  running: boolean;
  setRunning: (v: boolean) => void;
  onMeasure?: (row: ObservationRow) => void;
};

export type ExperimentModule = {
  id: string;
  title: string;
  subtitle: string;
  subject: "mechanics" | "electricity" | "optics" | "waves" | "thermodynamics" | "modern";
  level: string;
  duration: string;
  aim: string;
  theory: { title: string; body: string; equation?: string }[];
  apparatus: { name: string; detail: string }[];
  procedure: string[];
  precautions: string[];
  controls: ControlDef[];
  defaults: Record<string, number>;
  columns: ColumnDef[];
  minRows: number;
  Simulation: ComponentType<SimProps>;
  capture: (vars: Record<string, number>) => ObservationRow;
  analyze: (rows: ObservationRow[]) => Analysis;
};

export type ConceptTopic = {
  id: string;
  title: string;
  blurb: string;
  body: string[];
  equations: string[];
  experiments: string[];
};

export type SavedRun = {
  id: string;
  experimentId: string;
  title: string;
  savedAt: string;
  rows: ObservationRow[];
  vars: Record<string, number>;
  analysis: Analysis;
};
