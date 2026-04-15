import { useNavigate } from 'react-router-dom';

import StatusOverlay from '../components/shared/StatusOverlay';
import { playClickSound } from '../lib/sound';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
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
      }}
    >
      <StatusOverlay visible ambientTrack="/sounds/hold-music.mp3" />
      <h1 style={{ color: 'white', fontFamily: 'monospace', marginTop: '150px' }}>
        SYSTEM ERROR: PAGE_NOT_FOUND
      </h1>
      <button
        type="button"
        onClick={() => {
          playClickSound();
          navigate('/');
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
        [ REBOOT TO HOME ]
      </button>
    </div>
  );
}
