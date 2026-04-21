import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import ComputerOS from '../ComputerOS';
import Bio from '../Bio';
import Cat from '../3d-cat';
import Room from '../Room';
import Yassine from '../Yassine';
import LoadingScreen from '../components/shared/LoadingScreen';
import OccludedHtml from '../components/shared/OccludedHtml';
import StatusOverlay from '../components/shared/StatusOverlay';
import { playClickSound, playCatSound,playPowerToggleSound } from '../lib/sound';

const ROOM_CAMERA_POSITION = [60, 80, -60];

const MOBILE_ROOM_CAMERA_POSITION = [-20, 70, -10];
const ROOM_CAMERA_TARGET = [-50, 50, 50];
const SCREEN_CAMERA_POSITION = [-50, 30, 90];
const SCREEN_CAMERA_TARGET = [-50, 50, 100];
const LEFT_ROTATION_LIMIT_POSITION = [-100, 70, -271];
const RIGHT_ROTATION_LIMIT_POSITION = [205, 8, 120];
const FLOOR_SURFACE_NAME = 'Cube005_Material003_0';
const FLOOR_BASE_NAME = 'Cube006_Material013_0';
const FLOOR_SURFACE_LIFT = 0.12;
const HIDDEN_MESH_NAMES = new Set(['Plane001_Material042_0']);
const CAT_BANNER_DURATION_MS = 2000;

function getAzimuthAngleFromPosition(position, target) {
  return Math.atan2(position[0] - target[0], position[2] - target[2]);
}

const MIN_AZIMUTH_ANGLE = getAzimuthAngleFromPosition(RIGHT_ROTATION_LIMIT_POSITION, ROOM_CAMERA_TARGET);
const MAX_AZIMUTH_ANGLE = getAzimuthAngleFromPosition(LEFT_ROTATION_LIMIT_POSITION, ROOM_CAMERA_TARGET) + Math.PI * 2;

function CameraRig({ view, controlsRef, setIsReturning, isReturning, roomCameraPosition }) {
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);

    if (view === 'screen') {
      const targetPosition = new THREE.Vector3(...SCREEN_CAMERA_POSITION);
      const targetLook = new THREE.Vector3(...SCREEN_CAMERA_TARGET);

      state.camera.position.lerp(targetPosition, 4 * d);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, 4 * d);
        controlsRef.current.update();
      }

      return;
    }

    if (isReturning) {
      const targetPosition = new THREE.Vector3(...roomCameraPosition);
      const targetLook = new THREE.Vector3(...ROOM_CAMERA_TARGET);

      state.camera.position.lerp(targetPosition, 3 * d);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, 3 * d);
        controlsRef.current.update();
      }

      if (state.camera.position.distanceTo(targetPosition) < 1) {
        setIsReturning(false);
      }

      return;
    }
  });

  return null;
}

function InitialCameraPose({ controlsRef, position }) {
  const { camera } = useThree();

  useLayoutEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...ROOM_CAMERA_TARGET);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(...ROOM_CAMERA_TARGET);
      controlsRef.current.update();
    }
  }, [camera, controlsRef, position]);

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

function RoomModel({ onCatClick, onAvatarClick, onComputerClick }) {
  const roomRef = useRef(null);

  useEffect(() => {
    if (!roomRef.current) {
      return;
    }

    roomRef.current.traverse((child) => {
      if (child.isMesh) {
        if (HIDDEN_MESH_NAMES.has(child.name)) {
          child.visible = false;
          return;
        }

        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name === FLOOR_SURFACE_NAME) {
          child.position.y += FLOOR_SURFACE_LIFT;
          child.castShadow = false;
          child.receiveShadow = false;
        }

        if (child.name === FLOOR_BASE_NAME) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      }
    });
  }, []);

  return (
    <group ref={roomRef}>
      <Room scale={45} position={[-20, 0, 40]} rotation={[0, Math.PI / 2, 0]} onScreenClick={onComputerClick} />
      <group scale={4} position={[-30, 5.1, 100]} rotation={[0, Math.PI / 2 + Math.PI / 6, 0]}>
        <Cat
          onClick={(event) => {
            event.stopPropagation();
            onCatClick();
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        />
      </group>
      <group position={[-90, 4, 60]} rotation={[0, Math.PI / 2 + Math.PI / 6, 0]}>
        <Yassine
          scale={35}
          onClick={(event) => {
            event.stopPropagation();
            onAvatarClick();
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        />
      </group>
    </group>
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

function SceneBanner({ text, visible, isMobile }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: isMobile ? '50%' : '40px',
        left: '50%',
        transform: isMobile ? 'translate(-50%, -50%)' : 'translateX(-50%)',
        zIndex: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        color: 'white',
        border: '1px solid white',
        padding: '12px 18px',
        fontFamily: 'monospace',
        fontSize: '15px',
        fontWeight: 'bold',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        opacity: visible ? 1 : 0,
        transition: 'opacity 320ms ease',
      }}
    >
      {text}
    </div>
  );
}

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const [view, setView] = useState('room');
  const [isReturning, setIsReturning] = useState(false);
  const [canvasFrameloop, setCanvasFrameloop] = useState('always');
  const [showBio, setShowBio] = useState(false);
  const [isCatBannerVisible, setIsCatBannerVisible] = useState(false);
  const controlsRef = useRef(null);
  const previousViewRef = useRef('room');
  const catBannerTimerRef = useRef(null);
  const isMobile = window.innerWidth < 830;
  const initialCameraPosition = isMobile ? MOBILE_ROOM_CAMERA_POSITION : ROOM_CAMERA_POSITION;

  useEffect(() => {
    if (started && previousViewRef.current === 'screen' && view === 'room') {
      setIsReturning(true);
    }

    previousViewRef.current = view;
  }, [started, view]);

  useEffect(() => {
    if (view === 'screen') {
      const timer = setTimeout(() => setCanvasFrameloop('never'), 1500);
      return () => clearTimeout(timer);
    }
    setCanvasFrameloop('always');
  }, [view]);

  useEffect(() => () => {
    if (catBannerTimerRef.current) {
      window.clearTimeout(catBannerTimerRef.current);
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {!started && <LoadingScreen onStarted={() => setStarted(true)} />}

      <Bio visible={showBio} onClose={() => setShowBio(false)} />
      <StatusOverlay visible={started} />
      {view === 'room' && (
        <SceneBanner
          text="Stop disturbing the cat"
          visible={isCatBannerVisible}
          isMobile={isMobile}
        />
      )}
      {view === 'screen' && (
        <ComputerOS
          onExit={() => {
            setView('room');
            setCanvasFrameloop('always');
          }}
        />
      )}

      <Canvas
        shadows
        frameloop={canvasFrameloop}
        camera={{
          position: initialCameraPosition,
          fov: isMobile ? 90 : 45,
          near: 1,
          far: 1200,
        }}
      >
        <InitialCameraPose controlsRef={controlsRef} position={initialCameraPosition} />
        <DynamicBackground />
        <CameraRig
          view={view}
          controlsRef={controlsRef}
          isReturning={isReturning}
          setIsReturning={setIsReturning}
          roomCameraPosition={initialCameraPosition}
        />

        <ambientLight intensity={0.9} />
        <hemisphereLight skyColor="#ffffff" groundColor="#6f6f6f" intensity={0.9} />
        <directionalLight
          position={[100, 200, 100]}
          intensity={2.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0008}
          shadow-normalBias={0.04}
        >
          <orthographicCamera attach="shadow-camera" args={[-200, 200, 200, -200]} />
        </directionalLight>
        <spotLight position={[0, 80, 300]} intensity={3.2} angle={0.4} penumbra={0.5} />
        <pointLight position={[-120, 120, 220]} intensity={1.5} />

        <Suspense fallback={null}>
          <RoomModel
            onCatClick={() => {
              playCatSound();
              setIsCatBannerVisible(true);

              if (catBannerTimerRef.current) {
                window.clearTimeout(catBannerTimerRef.current);
              }

              catBannerTimerRef.current = window.setTimeout(() => {
                setIsCatBannerVisible(false);
              }, CAT_BANNER_DURATION_MS);
            }}
            onAvatarClick={() => {
              playClickSound();
              setShowBio((previous) => !previous);
            }}
            onComputerClick={() => {
              playPowerToggleSound();
              setView('screen');
              setShowBio(false);
            }}
          />
          {started && view === 'room' && !showBio && (
            <>
              <OccludedHtml position={[-90, 75, 60]} center distanceFactor={80}>
                <PromptTag text="CLICK ON MY AVATAR" />
              </OccludedHtml>
              <OccludedHtml position={[-57, 65, 125]} center distanceFactor={100}>
                <PromptTag text="CLICK ON THE COMPUTER" />
              </OccludedHtml>
              <OccludedHtml position={[-30, 15, 100]} center distanceFactor={90}>
                <PromptTag text="DON'T CLICK ON THE CAT" />
              </OccludedHtml>
            </>)}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          target={ROOM_CAMERA_TARGET}
          enableZoom
          enablePan={false}
          panSpeed={1}
          minAzimuthAngle={MIN_AZIMUTH_ANGLE}
          maxAzimuthAngle={MAX_AZIMUTH_ANGLE}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={0}
          maxDistance={400}
          enabled={started && view === 'room' && !isReturning}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_ROTATE,
          }}
        />
      </Canvas>
    </div>
  );
}
