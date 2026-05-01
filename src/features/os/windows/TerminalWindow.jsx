import WindowFrame from '../WindowFrame';

export default function TerminalWindow({
  windowState,
  controls,
  termHistory,
  termInput,
  setTermInput,
  onKeyDown,
  termEndRef,
}) {
  return (
    <WindowFrame
      windowId="terminal"
      title="bash"
      windowState={windowState}
      width="600px"
      height="300px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      headerStyle={{ background: '#333' }}
      titleStyle={{ color: '#fff' }}
      contentStyle={{ padding: '10px', background: '#000', color: '#0f0', fontFamily: 'monospace' }}
      frameStyle={{ background: '#000', borderColor: '#333' }}
      maximizeOnDoubleClick
    >
      {termHistory.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}
      <div ref={termEndRef} />
      <div style={{ display: 'flex' }}>
        <span style={{ opacity: 0.7, marginRight: '5px' }}>user@compeng:~$</span>
        <input className="cmd-input" autoFocus value={termInput} onChange={(event) => setTermInput(event.target.value)} onKeyDown={onKeyDown} />
      </div>
    </WindowFrame>
  );
}
