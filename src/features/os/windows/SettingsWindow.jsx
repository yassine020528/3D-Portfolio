import { themeOptions } from '../../../data/osData';
import WindowFrame from '../WindowFrame';

export default function SettingsWindow({ windowState, controls, theme, setTheme }) {
  return (
    <WindowFrame
      windowId="settings"
      title="System Preferences"
      windowState={windowState}
      width="300px"
      height="350px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      maximizeOnDoubleClick
    >
      <p><strong>Theme Selection</strong></p>
      {themeOptions.map((option) => (
        <button key={option.id} className="theme-btn" onClick={() => setTheme(option.id)}>
          {option.icon} {option.label}{theme === option.id ? ' *' : ''}
        </button>
      ))}
    </WindowFrame>
  );
}
