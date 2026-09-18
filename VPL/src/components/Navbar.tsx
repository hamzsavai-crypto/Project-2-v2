import { NavLink, Link } from "react-router-dom";
import { Activity } from "lucide-react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/concepts", label: "Concepts" },
  { to: "/simulations", label: "Simulations" },
  { to: "/experiments", label: "Experiments" },
  { to: "/notebook", label: "Notebook" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-lab-line bg-lab-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-lab-phosphor/40 bg-lab-panel text-lab-phosphor shadow-glow">
            <Activity className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-lab-phosphor">VPL</p>
            <p className="text-sm text-lab-ink">Virtual Physics Lab</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 transition ${
                  isActive ? "bg-lab-bezel text-lab-phosphor" : "text-lab-mute hover:text-lab-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
