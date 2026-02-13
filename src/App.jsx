import React, { Suspense, useEffect, useMemo, useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three'; 
import ComputerModel from './ComputerModel';
import Yassine from './Yassine';
import Bio from './Bio';
import ComputerOS from './ComputerOS';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './NotFound';

function LoadingScreen({ onStarted }) {
  const { progress } = useProgress();
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'black', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, fontFamily: 'monospace' }}>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        {progress < 100 ? `LOADING ${Math.round(progress)}%` : "SYSTEM READY"}
      </div>
      <div style={{ width: '200px', height: '2px', background: '#333', marginBottom: '40px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'white', transition: 'width 0.5s' }} />
      </div>
      {progress === 100 && (
        <button 
          onClick={() => {
            playClickSound();
            onStarted();
          }}
          style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '10px 30px', fontFamily: 'monospace', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
          onMouseEnter={(e) => (e.target.style.background = 'white') && (e.target.style.color = 'black')}
          onMouseLeave={(e) => (e.target.style.background = 'transparent') && (e.target.style.color = 'white')}
        >
          [ ENTER ]
        </button>
      )}
    </div>
  );
}

function SpeakerIcon({ enabled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white" />
      {enabled && <path d="M15.54 8.46L16.95 7.05C18.07 8.17 18.79 9.71 18.79 11.42C18.79 13.13 18.07 14.67 16.95 15.79L15.54 14.38C16.32 13.6 16.79 12.56 16.79 11.42C16.79 10.28 16.32 9.24 15.54 8.46Z" fill="white"/>}
      {!enabled && <path d="M21.59 7.59L19 10.17L16.41 7.59L15 9L17.59 11.58L15 14.17L16.41 15.59L19 13L21.59 15.59L23 14.17L20.41 11.58L23 9L21.59 7.59Z" fill="white"/>}
    </svg>
  );
}

function Overlay({ visible, view, setView }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const audioCtxRef = useRef(null);
  const ambientSourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filterNodeRef = useRef(null);
  const ambientBufferRef = useRef(null);

  const playAudio = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !ambientBufferRef.current) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (ambientSourceRef.current) return;

    const source = ctx.createBufferSource();
    source.buffer = ambientBufferRef.current;
    source.loop = true;
    source.connect(filterNodeRef.current);
    filterNodeRef.current.connect(gainNodeRef.current);
    source.start(0);
    ambientSourceRef.current = source;

    gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
    gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);
  };

  const stopAudio = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !ambientSourceRef.current) return;
    const fadeOutTime = 1;
    gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
    gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeOutTime);
    setTimeout(() => {
      if (ambientSourceRef.current) {
        ambientSourceRef.current.stop();
        ambientSourceRef.current.disconnect();
        ambientSourceRef.current = null;
      }
    }, fadeOutTime * 1000);
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    gainNodeRef.current = audioCtxRef.current.createGain();
    filterNodeRef.current = audioCtxRef.current.createBiquadFilter();
    filterNodeRef.current.type = 'lowpass';
    filterNodeRef.current.frequency.value = 20000; 
    gainNodeRef.current.connect(audioCtxRef.current.destination);
    gainNodeRef.current.gain.value = 0;

    fetch('/sounds/ambient.mp3')
      .then(r => r.arrayBuffer())
      .then(ab => audioCtxRef.current.decodeAudioData(ab))
      .then(buf => { 
        ambientBufferRef.current = buf;
        if (soundEnabled) playAudio();
      })
      .catch(e => console.error(e));

    return () => { 
      clearInterval(timer);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  useEffect(() => { if (visible && soundEnabled) playAudio(); }, [visible]); 

  useEffect(() => {
    if (!audioCtxRef.current || !filterNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const filter = filterNodeRef.current;
    const now = ctx.currentTime;
    filter.frequency.cancelScheduledValues(now);
    filter.frequency.setValueAtTime(filter.frequency.value, now);

    if (view === 'screen') {
      filter.frequency.exponentialRampToValueAtTime(600, now + 1);
    } else {
      filter.frequency.exponentialRampToValueAtTime(20000, now + 1);
    }
  }, [view]);

  const toggleSound = () => {
    playClickSound();
    if (!soundEnabled) { playAudio(); setSoundEnabled(true); } 
    else { stopAudio(); setSoundEnabled(false); }
  };

  const boxStyle = { backgroundColor: 'black', color: 'white', padding: '5px 10px', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', display: 'inline-block' };
  const containerStyle = { position: 'absolute', top: '40px', left: '40px', zIndex: 10, display: visible ? 'flex' : 'none', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'none' };
  const rowStyle = { display: 'flex', gap: '10px', pointerEvents: 'auto' };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>Yassine Abassi</div>
      <div style={boxStyle}>Computer Engineering Student</div>
      <div style={rowStyle}>
        <div style={boxStyle}>{time}</div>
        <button onClick={toggleSound} style={{ ...boxStyle, border: 'none', cursor: 'pointer', minWidth: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SpeakerIcon enabled={soundEnabled} />
        </button>
      </div>
    </div>
  );
}

function CameraRig({ view, controlsRef, setIsReturning, isReturning }) {
  const isMobile = window.innerWidth < 768;

  useFrame((state, delta) => {
    if (view === 'screen') {
      const targetPos = new THREE.Vector3(-5, 95, 75); 
      const targetLook = new THREE.Vector3(-5, 95, 0); 
      
      state.camera.position.lerp(targetPos, 4 * delta);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, 4 * delta);
        controlsRef.current.update();
      }
    } 
    else if (isReturning) {
      const targetPos = isMobile ? new THREE.Vector3(-30, 200, 300) : new THREE.Vector3(-30, 200, 300);
      const targetLook = isMobile ? new THREE.Vector3(50, 35, 0) : new THREE.Vector3(50, 35, 0);
      
      state.camera.position.lerp(targetPos, 3 * delta);
      
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, 3 * delta);
        controlsRef.current.update();
      }

      if (state.camera.position.distanceTo(targetPos) < 1) {
        setIsReturning(false);
      }
    }

    if (view === 'room' && !isReturning && controlsRef.current) {
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
  const colors = useMemo(() => ({ dark: new THREE.Color('#ad9d9d'), light: new THREE.Color('#ffffff') }), []);
  const dir = new THREE.Vector3();
  useFrame(() => {
    camera.getWorldDirection(dir);
    const intensity = (dir.z + 1) / 2;
    if (!scene.background) scene.background = new THREE.Color('#ffffff');
    scene.background.copy(colors.dark).lerp(colors.light, intensity);
  });
  return null;
}

function ModelWithShadows({ onComputerClick }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
    });
  }, [scene]);

  return (
    <group> 
        <ComputerModel onScreenClick={onComputerClick} />
    </group>
  );
}

function Walls() {
  const wallMat = <meshStandardMaterial color="#ad9d9d" />;
  const geo = <planeGeometry args={[1500, 500]} />;
  return (
    <group>
      <mesh position={[0, 250, -400]} receiveShadow>{geo}{wallMat}</mesh>
      <mesh position={[-500, 250, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>{geo}{wallMat}</mesh>
      <mesh position={[500, 250, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>{geo}{wallMat}</mesh>
      <mesh position={[0, 250, 400]} rotation={[0, Math.PI, 0]} receiveShadow>{geo}{wallMat}</mesh>
    </group>
  );
}

function ShadowFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[2000, 2000]} />
      <shadowMaterial opacity={0.5} />
    </mesh>
  );
}
function OccludedHtml({ children, ...props }) {
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
const playClickSound = () => {
    const clickSound = new Audio('/sounds/click.mp3');
    clickSound.play().catch(e => console.error(e));
};

function Home(){
  const [started, setStarted] = useState(false);
  const [view, setView] = useState('room'); 
  const [isReturning, setIsReturning] = useState(false);
  const controlsRef = useRef();
  const isMobile = window.innerWidth < 768;
  const [showBio, setShowBio] = useState(false);

  const toggleBio = (e) => {
    if (e) e.stopPropagation();
    playClickSound();
    setShowBio(!showBio);
  };

  const handleStart = () => {
    setStarted(true);
  };

  useEffect(() => {
    if (view === 'room' && started) {
      setIsReturning(true);
    }
  }, [view, started]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {!started && <LoadingScreen onStarted={handleStart} />}
      
      <Overlay visible={started} view={view} setView={setView} />
      <Bio visible={showBio && view === 'room'} onClose={() => setShowBio(false)} />
      {view === 'screen' && (
        <ComputerOS onExit={() => setView('room')} />
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
          <ModelWithShadows 
            onComputerClick={() => {
              setView('screen');
              setShowBio(false);
            }} 
            isScreenView={view === 'screen'} 
          />
          <Yassine 
            position={[130, 0, 60]} 
            rotation={[0, -0.5, 0]}
            scale={80}
            visible={view === 'room'}
            onClick={toggleBio}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          />
          {started && view === 'room' && !showBio && (
            <OccludedHtml position={[130, 155, 60]} center distanceFactor={150}>
              <div style={{
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
                animation: 'bounce 2s infinite'
              }}>
                CLICK ON MY AVATAR
                <div style={{ fontSize: '20px', marginTop: '-5px' }}>▾</div>
                
                <style>{`
                  @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                  }
                `}</style>
              </div>
            </OccludedHtml>
          )}
          {started && view === 'room' && !showBio && (
            <OccludedHtml position={[-3, 120, 30]} center distanceFactor={150}>
              <div style={{
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
                animation: 'bounce 2s infinite'
              }}>
                CLICK ON THE COMPUTER
                <div style={{ fontSize: '20px', marginTop: '-5px' }}>▾</div>
                
                <style>{`
                  @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                  }
                `}</style>
              </div>
            </OccludedHtml>
          )}
        </Suspense>
        
        <Walls />
        <ShadowFloor />

        <OrbitControls 
          ref={controlsRef}
          enableZoom={true} 
          enablePan={true}
          panSpeed={1}
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={75} 
          maxDistance={400}
          enabled={started && view === 'room' && !isReturning} 
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN 
          }}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />
      </Canvas>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
