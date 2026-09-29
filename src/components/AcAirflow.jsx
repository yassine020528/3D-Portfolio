import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, Vector3 } from 'three';

// Only emission timing varies; overlapping stripes follow the same motion.
const variation = (seed) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};
const LANE_ORDER = [0, 4, 2, 6, 1, 5, 3];
const STRIPES = Array.from({ length: 21 }, (_, index) => index);
const TRAVEL_DURATION = 2.6;
const CURVE_SEGMENTS = 80;
const RADIAL_SEGMENTS = 5;
const smoothstep = (value) => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
};
const AIR_CURVE = new CatmullRomCurve3([
  new Vector3(0, 0, 0),
  new Vector3(0, -6, 20),
  new Vector3(1.5, -14, 46),
  new Vector3(0, -20, 76),
]);
const NO_RAYCAST = () => null;

export default function AcAirflow({ active }) {
  const meshRefs = useRef([]);
  const agesRef = useRef(STRIPES.map(() => TRAVEL_DURATION));
  const nextEmissionRef = useRef(0);
  const cycleRef = useRef(0);
  const powerRef = useRef(0);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    powerRef.current = Math.max(0, Math.min(1,
      powerRef.current + (active ? step / 0.55 : -step / 0.9),
    ));
    for (let slot = 0; slot < agesRef.current.length; slot += 1) {
      agesRef.current[slot] += step;
    }
    if (active) {
      nextEmissionRef.current -= step;
    } else {
      nextEmissionRef.current = 0;
    }
    if (active && nextEmissionRef.current <= 0) {
      // A single emission clock prevents separate lanes from firing in batches.
      agesRef.current[cycleRef.current % STRIPES.length] = -nextEmissionRef.current;
      cycleRef.current += 1;
      nextEmissionRef.current += 0.16 + variation(cycleRef.current * 7) * 0.12;
    }

    meshRefs.current.forEach((mesh, slot) => {
      const progress = agesRef.current[slot] / TRAVEL_DURATION;
      mesh.visible = progress < 1 && powerRef.current > 0;
      if (!mesh.visible) return;

      const lane = LANE_ORDER[slot % LANE_ORDER.length];
      mesh.position.set((lane - 3) * 10, -progress * 18, progress * 54);
      // Reveal the curve outward from the vent instead of popping in a full stripe.
      const revealedSegments = Math.ceil(CURVE_SEGMENTS * smoothstep(agesRef.current[slot] / 0.85));
      mesh.geometry.setDrawRange(0, revealedSegments * RADIAL_SEGMENTS * 6);
      const fade = smoothstep(progress / 0.2) * smoothstep((1 - progress) / 0.35);
      mesh.material.opacity = fade * smoothstep(powerRef.current) * 0.42;
    });
  });

  return (
    <group position={[85.603, 145, -148]}>
      {STRIPES.map((slot) => (
        <mesh
          key={slot}
          ref={(mesh) => { meshRefs.current[slot] = mesh; }}
          raycast={NO_RAYCAST}
          userData={{ disableShadows: true }}
          castShadow={false}
          receiveShadow={false}
        >
          <tubeGeometry args={[AIR_CURVE, CURVE_SEGMENTS, 0.5, RADIAL_SEGMENTS, false]} />
          <meshBasicMaterial color="#d9f5ff" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
