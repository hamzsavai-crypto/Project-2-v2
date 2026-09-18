import { useParams } from "react-router-dom";
import { getExperiment } from "@/experiments/catalog";
import { ExperimentEngine } from "@/lab/ExperimentEngine";

export function ExperimentPage() {
  const { id } = useParams();
  const experiment = id ? getExperiment(id) : undefined;
  if (!experiment) {
    return <p className="px-4 py-24 text-center text-lab-mute">That experiment is not on the bench.</p>;
  }
  return <ExperimentEngine experiment={experiment} />;
}
