import FlowerExperience from '../../flower/FlowerExperience';
import WindowFrame from '../WindowFrame';

export default function FlowerWindow({ windowState, controls }) {
  return (
    <WindowFrame
      windowId="flower"
      title="flower.mp4"
      windowState={windowState}
      width="860px"
      height="580px"
      className="flower-window"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      contentClassName="flower-window-content"
      contentStyle={{ padding: 0, overflow: 'hidden', background: '#000000' }}
      preserveOnMinimize
      maximizeOnDoubleClick
    >
      <FlowerExperience isActive={!windowState.isMinimized} />
    </WindowFrame>
  );
}
