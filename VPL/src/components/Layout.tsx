import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-lab-bg">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="mt-20 border-t border-lab-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-lab-mute md:flex-row md:justify-between">
          <p>Virtual Physics Laboratory — Learn → Experiment → Measure → Calculate → Graph → Result</p>
          <p>
            Physics models adapted from PhysicsSims (MIT). ANIMATe is retained as animation reference (MIT).
          </p>
        </div>
      </footer>
    </div>
  );
}
