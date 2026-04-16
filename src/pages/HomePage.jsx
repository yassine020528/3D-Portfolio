import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import Bio from '../Bio';
import ComputerModel from '../ComputerModel';
import ComputerOS from '../ComputerOS';
import Yassine from '../Yassine';
import LoadingScreen from '../components/shared/LoadingScreen';
import OccludedHtml from '../components/shared/OccludedHtml';
import StatusOverlay from '../components/shared/StatusOverlay';
import useAmbientAudio from '../hooks/useAmbientAudio';
import { playClickSound, playPowerToggleSound } from '../lib/sound';

function CameraRig({ view, controlsRef, setIsReturning, isReturning }) {
  useFrame((state, delta) => {
    if (view === 'screen') {
      const targetPosition = new THREE.Vector3(-5, 95, 75);
      const targetLook = new THREE.Vector3(-5, 95, 0);

      state.camera.position.lerp(targetPosition, 4 * delta);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, 4 * delta);
        controlsRef.current.update();
      }

      return;
    }

    if (isReturning) {
      const targetPosition = new THREE.Vector3(-30, 200, 300);
      const targetLook = new THREE.Vector3(50, 35, 0);

      state.camera.position.lerp(targetPosition, 3 * delta);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, 3 * delta);
        controlsRef.current.update();
      }

      if (state.camera.position.distanceTo(targetPosition) < 1) {
        setIsReturning(false);
      }

      return;
    }

    if (controlsRef.current) {
      const target = controlsRef.current.target;
      const minPan = new THREE.Vector3(-150, 0, -100);
      const maxPan = new THREE.Vector3(150, 150, 100);

      target.x = THREE.MathUtils.clamp(target.x, minPan.x, maxPan.x);
      target.y = THREE.MathUtils.clamp(target.y, minPan.y, maxPan.y);
      target.z = THREE.MathUtils.clamp(target.z, minPan.z, maxPan.z);
      controlsRef.current.update();
    }
  });

  return null;
}

function DynamicBackground() {
  const { scene, camera } = useThree();
  const colors = useMemo(
    () => ({
      dark: new THREE.Color('#ad9d9d'),
      light: new THREE.Color('#ffffff'),
    }),
    [],
  );
  const direction = new THREE.Vector3();

  useFrame(() => {
    camera.getWorldDirection(direction);
    const intensity = (direction.z + 1) / 2;

    if (!scene.background) {
      scene.background = new THREE.Color('#ffffff');
    }

    scene.background.copy(colors.dark).lerp(colors.light, intensity);
  });

  return null;
}

function RoomModel({ onComputerClick }) {
  const { scene } = useThree();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <ComputerModel onScreenClick={onComputerClick} />;
}

function RoomShell() {
  const wallMaterial = <meshStandardMaterial color="#ad9d9d" />;
  const wallGeometry = <planeGeometry args={[1500, 500]} />;

  return (
    <>
      <group>
        <mesh position={[0, 250, -400]} receiveShadow>{wallGeometry}{wallMaterial}</mesh>
        <mesh position={[-500, 250, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>{wallGeometry}{wallMaterial}</mesh>
        <mesh position={[500, 250, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>{wallGeometry}{wallMaterial}</mesh>
        <mesh position={[0, 250, 400]} rotation={[0, Math.PI, 0]} receiveShadow>{wallGeometry}{wallMaterial}</mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </>
  );
}

function PromptTag({ text }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: 'black',
        padding: '5px 10px',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        pointerEvents: 'none',
        border: '1px solid white',
        animation: 'bounce 2s infinite',
      }}
    >
      {text}
      <div style={{ fontSize: '20px', marginTop: '-5px' }}>▼</div>
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const [view, setView] = useState('room');
  const [isReturning, setIsReturning] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const controlsRef = useRef(null);
  const isMobile = window.innerWidth < 768;
  const { soundEnabled, toggleSound, unlockAudio } = useAmbientAudio({
    src: '/sounds/ambient.mp3',
    active: started,
    muffled: view === 'screen',
  });

  useEffect(() => {
    if (started && view === 'room') {
      setIsReturning(true);
    }
  }, [started, view]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {!started && <LoadingScreen onStarted={() => setStarted(true)} onUnlockAudio={unlockAudio} />}

      <StatusOverlay
        visible={started}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
      />
      <Bio visible={showBio && view === 'room'} onClose={() => setShowBio(false)} />
      {view === 'screen' && (
        <ComputerOS
          onExit={() => setView('room')}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
        />
      )}

      <Canvas shadows camera={{ position: isMobile ? [0, 250, 500] : [0, 200, 300], fov: isMobile ? 90 : 45 }}>
        <DynamicBackground />
        <CameraRig
          view={view}
          controlsRef={controlsRef}
          isReturning={isReturning}
          setIsReturning={setIsReturning}
        />

        <ambientLight intensity={0.9} />
        <hemisphereLight skyColor="#ffffff" groundColor="#6f6f6f" intensity={0.9} />
        <directionalLight position={[100, 200, 100]} intensity={2.8} castShadow shadow-mapSize={[2048, 2048]}>
          <orthographicCamera attach="shadow-camera" args={[-200, 200, 200, -200]} />
        </directionalLight>
        <spotLight position={[0, 80, 300]} intensity={3.2} angle={0.4} penumbra={0.5} />
        <pointLight position={[-120, 120, 220]} intensity={1.5} />

        <Suspense fallback={null}>
          <RoomModel
            onComputerClick={() => {
              playPowerToggleSound();
              setView('screen');
              setShowBio(false);
            }}
          />

          <Yassine
            position={[130, 0, 60]}
            rotation={[0, -0.5, 0]}
            scale={80}
            visible={view === 'room'}
            onClick={(event) => {
              event.stopPropagation();
              playClickSound();
              setShowBio((previous) => !previous);
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          />

          {started && view === 'room' && !showBio && (
            <>
              <OccludedHtml position={[130, 155, 60]} center distanceFactor={150}>
                <PromptTag text="CLICK ON MY AVATAR" />
              </OccludedHtml>
              <OccludedHtml position={[-3, 120, 30]} center distanceFactor={150}>
                <PromptTag text="CLICK ON THE COMPUTER" />
              </OccludedHtml>
            </>
          )}
        </Suspense>

        <RoomShell />

        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan
          panSpeed={1}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={75}
          maxDistance={400}
          enabled={started && view === 'room' && !isReturning}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
      </Canvas>
    </div>
  );
}
