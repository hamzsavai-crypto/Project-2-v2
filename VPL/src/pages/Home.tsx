import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Cpu, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  return (
    <div>
      <section className="relative min-h-[86vh] overflow-hidden">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-lab-bg via-lab-bg/85 to-lab-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-lab-bg via-transparent to-lab-bg/50" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] uppercase tracking-[0.32em] text-lab-phosphor"
          >
            Station online · Virtual Physics Laboratory
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl"
          >
            A bench, not a
            <span className="text-lab-phosphor"> textbook.</span>
          </motion.h1>
          <p className="mt-5 max-w-xl text-lg text-lab-mute">
            Learn the idea. Run the apparatus. Capture readings. Let the graph speak. VPL is a digital laboratory for
            school, undergraduate, and independent work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/experiments/ohms-law"
              className="inline-flex items-center gap-2 rounded-lg bg-lab-phosphor px-5 py-2.5 text-sm font-semibold text-lab-bg"
            >
              Enter Ohm&apos;s Law <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/experiments"
              className="inline-flex items-center gap-2 rounded-lg border border-lab-line px-5 py-2.5 text-sm text-lab-ink"
            >
              All experiments
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-14 md:grid-cols-3">
        {[
          {
            icon: BookOpen,
            title: "Concepts",
            body: "Mechanics, electricity, optics, waves — the physics behind the bench.",
            to: "/concepts",
          },
          {
            icon: Cpu,
            title: "Simulations",
            body: "Free exploration. Change a parameter and watch the model respond.",
            to: "/simulations",
          },
          {
            icon: FlaskConical,
            title: "Experiments",
            body: "Structured labs with theory, apparatus, table, graph and result.",
            to: "/experiments",
          },
        ].map((c) => (
          <Link key={c.title} to={c.to} className="bezel group rounded-xl p-6 transition hover:border-lab-phosphor/40">
            <c.icon className="h-5 w-5 text-lab-phosphor" />
            <h2 className="mt-4 text-xl">{c.title}</h2>
            <p className="mt-2 text-sm text-lab-mute">{c.body}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="grid overflow-hidden rounded-2xl border border-lab-line md:grid-cols-2">
          <img src="/images/bench.jpg" alt="" className="h-full min-h-[280px] w-full object-cover" />
          <div className="bg-lab-panel p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-lab-amber">Workflow</p>
            <h2 className="mt-2 text-3xl">Learn → Experiment → Measure → Graph → Result</h2>
            <ol className="mt-6 space-y-3 text-sm text-lab-mute">
              <li>01  Theory and apparatus — know what you are holding.</li>
              <li>02  Interactive lab — one reusable experiment engine.</li>
              <li>03  Observation table — capture, don&apos;t type physics by hand.</li>
              <li>04  Analysis — regression, g, f, range. Then save to the notebook.</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
