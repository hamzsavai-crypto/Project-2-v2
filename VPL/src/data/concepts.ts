import type { ConceptTopic } from "@/lib/types";

export const CONCEPTS: ConceptTopic[] = [
  {
    id: "mechanics",
    title: "Mechanics",
    blurb: "Motion, forces, energy, and gravity — the skeleton of classical physics.",
    body: [
      "Mechanics describes how objects move and why. Kinematics tracks position, velocity and acceleration. Dynamics introduces force. Energy and momentum give conserved quantities that survive messy collisions.",
      "A simple pendulum is SHM for small angles: T = 2π√(L/g). A projectile is two independent motions: uniform horizontal, uniformly accelerated vertical.",
    ],
    equations: ["T = 2π √(L/g)", "R = v² sin 2θ / g", "F = ma"],
    experiments: ["simple-pendulum", "projectile-motion"],
  },
  {
    id: "electricity",
    title: "Electricity",
    blurb: "Charge, current, potential, and the linear world of ohmic conductors.",
    body: [
      "Current is the flow of charge. Potential difference is the work per unit charge. Ohm's law ties them together for metallic conductors at constant temperature: V = IR.",
      "In the laboratory you never trust a single reading. You sweep V, record I, and let the graph confess whether the conductor is ohmic.",
    ],
    equations: ["V = I R", "P = V I", "R = ρ L / A"],
    experiments: ["ohms-law"],
  },
  {
    id: "optics",
    title: "Optics",
    blurb: "Lenses, images, and the geometry of light on an optical bench.",
    body: [
      "A convex lens converges a parallel beam to its focal point. For a real object beyond f, a real inverted image forms on the far side.",
      "The school form of the thin-lens equation is 1/f = 1/v + 1/u with real distances taken positive. Several (u, v) pairs average to a better f.",
    ],
    equations: ["1/f = 1/v + 1/u", "m = h'/h = v/u"],
    experiments: ["convex-lens"],
  },
  {
    id: "waves",
    title: "Waves",
    blurb: "Oscillation that travels — period, frequency, wavelength, superposition.",
    body: [
      "A wave carries energy without carrying the medium as a whole. Frequency is set by the source; wavelength by the medium.",
      "The pendulum is a wave-adjacent oscillator: energy sloshes between kinetic and potential each half cycle.",
    ],
    equations: ["v = f λ", "T = 1/f"],
    experiments: ["simple-pendulum"],
  },
  {
    id: "thermodynamics",
    title: "Thermodynamics",
    blurb: "Heat, work, temperature, and the direction of processes.",
    body: [
      "Temperature is the average kinetic energy of microscopic degrees of freedom. Heat is energy in transit because of a temperature difference.",
      "Structured thermodynamics experiments (Carnot, kinetic theory) live in the PhysicsSims source library and will enter VPL in a later phase.",
    ],
    equations: ["ΔU = Q − W", "PV = nRT"],
    experiments: [],
  },
  {
    id: "modern",
    title: "Modern Physics",
    blurb: "Photons, spectra, and the first cracks in the classical picture.",
    body: [
      "Modern physics begins when light and matter refuse to be only waves or only particles. Photoelectric effect, Bohr model, and de Broglie waves belong here.",
      "No structured VPL experiment in this subject yet — the engine is ready when the apparatus is.",
    ],
    equations: ["E = hf", "λ = h / p"],
    experiments: [],
  },
];
