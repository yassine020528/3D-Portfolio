import useClock from '../../hooks/useClock';

export default function StatusOverlay({
  visible,
  subtitle = 'Computer Engineering Student',
}) {
  const time = useClock();

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
      </div>
    </div>
  );
}
