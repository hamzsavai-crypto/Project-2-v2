# Attribution

VPL is an original Virtual Physics Laboratory application.

## PhysicsSims (source material)

Cloned into `../PhysicsSims` from `hamzsavai-crypto/VPL` (PhysicsSims / IlliniOpenEdu lineage).

Reused as reference, not as the product:

- Physical constants (`src/lib/physics.ts`) adapted from `PhysicsSims/src/utils/constants.ts`
- Simple-pendulum integrator (velocity Verlet) adapted from `PhysicsSims/src/pages/mechanics/PendulumExplorer.tsx`
- Projectile kinematic formulae (standard, also used in PhysicsSims kinematics modules)

License: MIT. See `../PhysicsSims/LICENSE`.

## ANIMATe (source / reference)

Cloned into `../ANIMATe`. This repository is a Unity UI-material animation package (Animate UI Materials, MIT, Copyright Lou Garczynski). It is not a web runtime.

VPL does **not** embed Unity code. Interface motion (step transitions, capture flash) follows the same idea as ANIMATe: animate isolated properties rather than restyling the whole tree.

License: MIT. See `../ANIMATe/LICENSE`.
