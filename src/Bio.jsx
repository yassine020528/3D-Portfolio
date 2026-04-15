import { playClickSound } from './lib/sound';

const cardStyle = {
  position: 'fixed',
  bottom: 'calc(20px + env(safe-area-inset-bottom))',
  right: '20px',
  left: '20px',
  maxWidth: '300px',
  marginLeft: 'auto',
  backgroundColor: 'rgba(15, 15, 15, 0.9)',
  backdropFilter: 'blur(12px)',
  color: 'white',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
  fontFamily: 'monospace',
  zIndex: 1000,
};

export default function Bio({ visible, onClose }) {
  if (!visible) {
    return null;
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <span style={{ color: '#555', fontSize: '12px' }}>[SYSTEM_INFO]</span>
        <button
          type="button"
          onClick={() => {
            onClose();
            playClickSound();
          }}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '16px' }}
        >
          ×
        </button>
      </div>

      <h1 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold', color: '#4CAF50' }}>
        Yup, that's me, Yassine!
      </h1>
      <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#eee' }}>
        You're wondering how I got here?<br />Even I am not sure how.<br />
        But since you're here, let me tell you a bit about myself as you click on the computer screen.
      </div>
    </div>
  );
}
