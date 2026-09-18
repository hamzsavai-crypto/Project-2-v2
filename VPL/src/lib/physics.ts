/**
 * Physical constants and lab formulas.
 * Constants adapted from PhysicsSims (MIT License) — see ATTRIBUTION.md.
 */

export const G = 9.81;
export const PI = Math.PI;
export const TWO_PI = 2 * Math.PI;
export const DEG = Math.PI / 180;

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function round(n: number, d = 3) {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

export function fmt(n: number, d = 3) {
  if (!Number.isFinite(n)) return "—";
  return round(n, d).toFixed(d);
}

/** Ohm's law: I = V / R */
export function currentFromVR(V: number, R: number) {
  if (R <= 0) return Infinity;
  return V / R;
}

/** Small-angle pendulum period T = 2π √(L/g) */
export function pendulumPeriod(L: number, g = G) {
  if (L <= 0 || g <= 0) return 0;
  return TWO_PI * Math.sqrt(L / g);
}

/** Velocity-Verlet pendulum step. From PhysicsSims PendulumExplorer. */
export function stepPendulum(theta: number, omega: number, g: number, L: number, dt: number) {
  if (L <= 0 || dt <= 0) return { theta, omega };
  const alpha = -(g / L) * Math.sin(theta);
  const thetaNew = theta + omega * dt + 0.5 * alpha * dt * dt;
  const alphaNew = -(g / L) * Math.sin(thetaNew);
  const omegaNew = omega + 0.5 * (alpha + alphaNew) * dt;
  return { theta: thetaNew, omega: omegaNew };
}

/** Thin lens: 1/f = 1/v − 1/u  with sign convention u < 0 for real object. School form: 1/f = 1/v + 1/u using positive distances. */
export function imageDistance(u: number, f: number) {
  if (Math.abs(u - f) < 1e-9) return Infinity;
  return (u * f) / (u - f);
}

export function focalFromUV(u: number, v: number) {
  const s = 1 / u + 1 / v;
  if (Math.abs(s) < 1e-12) return Infinity;
  return 1 / s;
}

export function projectileRange(v: number, thetaDeg: number, g = G) {
  const th = thetaDeg * DEG;
  return (v * v * Math.sin(2 * th)) / g;
}

export function projectileHeight(v: number, thetaDeg: number, g = G) {
  const th = thetaDeg * DEG;
  return (v * v * Math.sin(th) ** 2) / (2 * g);
}

export function projectileTime(v: number, thetaDeg: number, g = G) {
  const th = thetaDeg * DEG;
  return (2 * v * Math.sin(th)) / g;
}

export function projectilePoint(v: number, thetaDeg: number, t: number, g = G) {
  const th = thetaDeg * DEG;
  const vx = v * Math.cos(th);
  const vy = v * Math.sin(th);
  return { x: vx * t, y: vy * t - 0.5 * g * t * t };
}

export function linearFit(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n < 2) return { slope: NaN, intercept: NaN, r2: NaN };
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const syy = ys.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const den = n * sxx - sx * sx;
  if (Math.abs(den) < 1e-12) return { slope: NaN, intercept: NaN, r2: NaN };
  const slope = (n * sxy - sx * sy) / den;
  const intercept = (sy - slope * sx) / n;
  const ssTot = syy - (sy * sy) / n;
  const ssRes = ys.reduce((a, y, i) => {
    const pred = slope * xs[i] + intercept;
    return a + (y - pred) ** 2;
  }, 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  return { slope, intercept, r2 };
}

export function mean(xs: number[]) {
  if (!xs.length) return NaN;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
