import { Html } from '@react-three/drei';
import { useState } from 'react';

export default function OccludedHtml({ children, ...props }) {
  const [hidden, setHidden] = useState(false);

  return (
    <Html
      {...props}
      occlude
      onOcclude={setHidden}
      style={{
        transition: 'opacity 0.2s',
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
      }}
    >
      {children}
    </Html>
  );
}
