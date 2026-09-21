import { useCursor, useTexture } from '@react-three/drei';
import { useState } from 'react';
import { SRGBColorSpace } from 'three';

export default function ResumeSheet({ onClick }) {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture('/images/resume.png');
  texture.colorSpace = SRGBColorSpace;
  useCursor(hovered);

  return (
    <group position={[-145, 59.3, -25]} rotation={[0, 1.57, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          setHovered(false);
          onClick();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[24, 31.06]} />
        <meshBasicMaterial map={texture} toneMapped={false} color={hovered ? '#fff1d6' : '#ffffff'} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[24, 0.2, 31.06]} />
        <meshStandardMaterial color="#eee8df" />
      </mesh>
    </group>
  );
}
