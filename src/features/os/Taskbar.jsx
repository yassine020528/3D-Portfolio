import { useEffect, useRef } from 'react';
import { startMenuItems } from '../../data/osData';
import SoundToggleButton from '../../components/shared/SoundToggleButton';

function BatteryIndicator({ battery, batteryColor, batteryFillWidth, batteryBoltColor, batteryBoltStrokeColor }) {
  if (!battery) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.8rem',
        opacity: 0.9,
        padding: '2px 8px',
        border: '1px solid var(--border-color)',
        borderRadius: '999px',
        color: batteryColor,
      }}
      title={battery.charging ? 'Device is charging' : 'Device is running on battery'}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          width: '18px',
          height: '10px',
          border: `1px solid ${batteryColor}`,
          borderRadius: '2px',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            right: '-3px',
            width: '2px',
            height: '4px',
            borderRadius: '0 1px 1px 0',
            background: batteryColor,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '1px',
            left: '1px',
            height: '6px',
            width: `calc(${batteryFillWidth} - 2px)`,
            maxWidth: '14px',
            background: batteryColor,
            transition: 'width 0.2s ease',
          }}
        />
        {battery.charging && (
          <div
            style={{
              position: 'absolute',
              top: '-3px',
              left: '4px',
              width: '14px',
              height: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 12 12"
              aria-hidden="true"
              style={{ display: 'block', filter: `drop-shadow(0 0 1px ${batteryColor})` }}
            >
              <path
                d="M7.2 0.8L2.8 6h2.1L4.6 11.2 9.2 5.7H7.1L7.2 0.8z"
                fill={batteryBoltColor}
                stroke={batteryBoltStrokeColor}
                strokeWidth="0.7"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      <span>{battery.level}%</span>
    </div>
  );
}

export default function Taskbar({
  windows,
  battery,
  soundEnabled,
  toggleSound,
  time,
  showStartMenu,
  setShowStartMenu,
  openWindow,
  onShutdown,
  batteryColor,
  batteryFillWidth,
  batteryBoltColor,
  batteryBoltStrokeColor,
}) {
  const startMenuRef = useRef(null);
  const startButtonRef = useRef(null);

  useEffect(() => {
    if (!showStartMenu) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      const target = event.target;

      if (startMenuRef.current?.contains(target) || startButtonRef.current?.contains(target)) {
        return;
      }

      setShowStartMenu(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [showStartMenu, setShowStartMenu]);

  return (
    <>
      <div
        className="taskbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 15px',
          height: '45px',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div
            ref={startButtonRef}
            className="start-btn"
            style={{ flexShrink: 0 }}
            onClick={() => setShowStartMenu((value) => !value)}
          >
            START
          </div>
          <div className="running-apps" style={{ display: 'flex', gap: '5px', overflow: 'hidden' }}>
            {Object.values(windows)
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((windowState) => windowState.isOpen && (
                <div
                  key={windowState.id}
                  onClick={() => openWindow(windowState.id)}
                  style={{
                    padding: '2px 10px',
                    background: windowState.isMinimized ? 'transparent' : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${windowState.isMinimized ? 'transparent' : 'var(--border-color)'}`,
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: windowState.isMinimized ? 'gray' : 'var(--text-color)',
                    flexShrink: 0,
                  }}
                >
                  {windowState.title}
                </div>
              ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
            marginLeft: '15px',
            whiteSpace: 'nowrap',
          }}
        >
          <SoundToggleButton
            enabled={soundEnabled}
            onToggle={toggleSound}
            iconColor="var(--text-color)"
            title={soundEnabled ? 'Mute ambient audio' : 'Unmute ambient audio'}
            style={{
              width: '34px',
              height: '34px',
              padding: 0,
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '999px',
            }}
          />
          <BatteryIndicator
            battery={battery}
            batteryColor={batteryColor}
            batteryFillWidth={batteryFillWidth}
            batteryBoltColor={batteryBoltColor}
            batteryBoltStrokeColor={batteryBoltStrokeColor}
          />
          <div className="clock" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{time}</div>
        </div>
      </div>

      {showStartMenu && (
        <div className="start-menu" ref={startMenuRef}>
          {startMenuItems.map((item) => (
            <div
              key={item.id}
              className="menu-item"
              onClick={() => {
                setShowStartMenu(false);
                openWindow(item.id);
              }}
            >
              {item.label}
            </div>
          ))}
          <hr style={{ width: '100%', borderColor: 'var(--border-color)', margin: '5px 0' }} />
          <div
            className="menu-item danger"
            onClick={(event) => {
              setShowStartMenu(false);
              onShutdown(event);
            }}
          >
            <strong>⏻ Shut Down</strong>
          </div>
        </div>
      )}
    </>
  );
}
