import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Concepts } from "@/pages/Concepts";
import { ConceptSubject } from "@/pages/ConceptSubject";
import { Simulations } from "@/pages/Simulations";
import { Experiments } from "@/pages/Experiments";
import { ExperimentPage } from "@/pages/ExperimentPage";
import { Notebook } from "@/pages/Notebook";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/concepts" element={<Concepts />} />
        <Route path="/concepts/:id" element={<ConceptSubject />} />
        <Route path="/simulations" element={<Simulations />} />
        <Route path="/experiments" element={<Experiments />} />
        <Route path="/experiments/:id" element={<ExperimentPage />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
