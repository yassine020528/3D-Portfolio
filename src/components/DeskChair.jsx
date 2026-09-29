import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MathUtils } from 'three';

const LEFT_TURN = MathUtils.degToRad(55);

export default function DeskChair({ nodes, materials, turned, onClick }) {
  const swivelRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const highlights = useMemo(() => (
    ['Material.044', 'Material.025'].map((name) => {
      const material = materials[name].clone();
      material.color.lerp(new Color('#79d9ff'), 0.45);
      material.emissive.set('#79d9ff');
      material.emissiveIntensity = 0.35;
      return material;
    })
  ), [materials]);

  useEffect(() => () => {
    highlights.forEach((material) => material.dispose());
  }, [highlights]);

  useFrame(({ events }, delta) => {
    const target = turned ? LEFT_TURN : 0;
    const rotation = swivelRef.current.rotation;
    if (rotation.y === target) return;

    rotation.y = MathUtils.damp(rotation.y, target, 7, Math.min(delta, 0.05));
    if (Math.abs(rotation.y - target) < 0.001) rotation.y = target;

    // Raycast the new pose even when the mouse is stationary, including the final frame.
    swivelRef.current.updateWorldMatrix(true, true);
    events.update?.();
  });

  return (
    <group
      ref={swivelRef}
      position={[-107.444, 0, -77.384]}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Keep the model's original transforms, with the swivel centered on its pedestal. */}
      <group position={[107.444, 0, 77.384]}>
        <mesh
          geometry={nodes.Cube027_Material044_0.geometry}
          material={hovered ? highlights[0] : materials['Material.044']}
          position={[-107.432, 36.706, -77.177]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[18.608, 19.096, 1.655]}
        />
        <mesh
          geometry={nodes.Cylinder001_Material025_0.geometry}
          material={hovered ? highlights[1] : materials['Material.025']}
          position={[-107.444, 33.388, -77.384]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[9.638, 9.638, 1.74]}
        />
        <mesh
          geometry={nodes.Cube028_Material044_0.geometry}
          material={hovered ? highlights[0] : materials['Material.044']}
          position={[-90.385, 61.879, -77.177]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[18.608, 23.729, 1.655]}
        />
      </group>
    </group>
  );
}
