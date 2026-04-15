import useClock from '../../hooks/useClock';
import useAmbientAudio from '../../hooks/useAmbientAudio';
import { playClickSound } from '../../lib/sound';
import SpeakerIcon from './SpeakerIcon';

export default function StatusOverlay({
  visible,
  ambientTrack,
  muffled = false,
  subtitle = 'Computer Engineering Student',
}) {
  const time = useClock();
  const { soundEnabled, toggleSound } = useAmbientAudio({
    src: ambientTrack,
    active: visible,
    muffled,
  });

  const boxStyle = {
    backgroundColor: 'black',
    color: 'white',
    padding: '5px 10px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '10px',
    display: 'inline-block',
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        zIndex: 10,
        display: visible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'flex-start',
        pointerEvents: 'none',
      }}
    >
      <div style={boxStyle}>Yassine Abassi</div>
      <div style={boxStyle}>{subtitle}</div>
      <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto' }}>
        <div style={boxStyle}>{time}</div>
        <button
          type="button"
          onClick={() => {
            playClickSound();
            toggleSound();
          }}
          style={{
            ...boxStyle,
            border: 'none',
            cursor: 'pointer',
            minWidth: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SpeakerIcon enabled={soundEnabled} />
        </button>
      </div>
    </div>
  );
}
