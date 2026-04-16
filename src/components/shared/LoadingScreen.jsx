import { useProgress } from '@react-three/drei';

import { playClickSound } from '../../lib/sound';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'black',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  fontFamily: 'monospace',
};

export default function LoadingScreen({ onStarted, onUnlockAudio }) {
  const { progress } = useProgress();

  return (
    <div style={overlayStyle}>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        {progress < 100 ? `LOADING ${Math.round(progress)}%` : 'SYSTEM READY'}
      </div>
      <div style={{ width: '200px', height: '2px', background: '#333', marginBottom: '40px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'white', transition: 'width 0.5s' }} />
      </div>
      {progress === 100 && (
        <button
          type="button"
          onPointerDown={() => {
            onUnlockAudio?.();
          }}
          onTouchStart={() => {
            onUnlockAudio?.();
          }}
          onClick={() => {
            playClickSound();
            onStarted();
          }}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '10px 30px',
            fontFamily: 'monospace',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onMouseEnter={(event) => {
            event.target.style.background = 'white';
            event.target.style.color = 'black';
          }}
          onMouseLeave={(event) => {
            event.target.style.background = 'transparent';
            event.target.style.color = 'white';
          }}
        >
          [ ENTER ]
        </button>
      )}
    </div>
  );
}
