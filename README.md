# Project 2 — Virtual Physics Laboratory

VPL is the product. **ANIMATe** and **PhysicsSims** are source/reference repositories. They are not separate websites.

```
project-2/
├── VPL/            ← the application (React + TypeScript)
├── PhysicsSims/    ← physics/simulation source (cloned from hamzsavai-crypto/VPL)
└── ANIMATe/        ← Unity animation reference (not a web runtime)
```

## Run VPL

```bash
cd VPL
npm install
npm run dev
```

Open the preview on port 5173.

Workflow: **Learn → Experiment → Measure → Calculate → Graph → Result → Save**

## Experiment engine

One shell, many modules:

Theory → Apparatus → Procedure → Interactive Lab → Observations → Analysis → Result

MVP experiments:

1. Ohm's Law
2. Simple Pendulum
3. Convex Lens / Focal Length
4. Projectile Motion

No accounts. The notebook stores runs in `localStorage`.

## Source clones

```bash
git clone --depth 1 https://github.com/hamzsavai-crypto/VPL.git PhysicsSims
git clone --depth 1 https://github.com/hamzsavai-crypto/ANIMATe.git ANIMATe
```

See `VPL/ATTRIBUTION.md` for licenses.
