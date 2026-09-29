import { useEffect, useMemo, useState } from 'react';
import { Color } from 'three';

export default function Lamp({ nodes, materials, isOn, onClick }) {
  const [hovered, setHovered] = useState(false);
  const lampMaterials = useMemo(() => {
    const highlight = (original) => {
      const material = original.clone();
      material.color.lerp(new Color('#79d9ff'), 0.45);
      material.emissive.set('#79d9ff');
      material.emissiveIntensity = 0.35;
      return material;
    };
    const litShade = materials['Material.028'].clone();
    litShade.emissive.set('#ffd18a');
    litShade.emissiveIntensity = 1.2;
    return {
      highlightedBase: highlight(materials['Material.027']),
      highlightedShade: highlight(materials['Material.028']),
      litShade,
    };
  }, [materials]);

  useEffect(() => () => {
    Object.values(lampMaterials).forEach((material) => material.dispose());
  }, [lampMaterials]);

  return (
    <group
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
      <mesh
        geometry={nodes.Cylinder003_Material027_0.geometry}
        material={hovered ? lampMaterials.highlightedBase : materials['Material.027']}
        position={[167.724, 53.006, -149.46]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={7.715}
      />
      <mesh
        geometry={nodes.Cylinder004_Material028_0.geometry}
        material={hovered ? lampMaterials.highlightedShade : isOn ? lampMaterials.litShade : materials['Material.028']}
        position={[167.925, 64.412, -149.386]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={5.539}
      />
      <pointLight
        position={[167.925, 61, -145]}
        color="#ffd18a"
        intensity={isOn ? 220 : 0}
        distance={65}
        decay={2}
      />
    </group>
  );
}
