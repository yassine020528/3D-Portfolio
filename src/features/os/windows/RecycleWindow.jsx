import WindowFrame from '../WindowFrame';

export default function RecycleWindow({ windowState, controls }) {
  return (
    <WindowFrame
      windowId="recycle"
      title="Recycle"
      windowState={windowState}
      width="420px"
      height="300px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      contentStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}
      maximizeOnDoubleClick
    >
      <div style={{ fontSize: '3rem', textAlign: 'center' }}>♻</div>
      <p style={{ margin: 0, textAlign: 'center', fontSize: '1rem', lineHeight: '1.7' }}>
        None of my work is thrown away. It just gets recycled into more interesting and better projects.
      </p>
      <div style={{ margin: '0 auto', padding: '8px 12px', border: '1px dashed var(--border-color)', borderRadius: '999px', fontSize: '0.85rem', opacity: 0.8 }}>
        empty
      </div>
    </WindowFrame>
  );
}
