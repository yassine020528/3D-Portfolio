import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

import { codeFiles, desktopIcons, initialWindows, themeVars } from './data/osData';
import useClock from './hooks/useClock';
import useWindowManager from './hooks/useWindowManager';
import { playClickSound, playKeyboardSound, playPowerToggleSound } from './lib/sound';
import DesktopIcon from './features/os/DesktopIcon';
import Cat from './features/os/Cat';
import FullscreenFigureModal from './features/os/FullscreenFigureModal';
import osStyles from './features/os/osStyles';
import Taskbar from './features/os/Taskbar';
import AboutWindow from './features/os/windows/AboutWindow';
import ContactWindow from './features/os/windows/ContactWindow';
import GamesWindow from './features/os/windows/GamesWindow';
import MobileWindow from './features/os/windows/MobileWindow';
import ProjectsWindow from './features/os/windows/ProjectsWindow';
import RecycleWindow from './features/os/windows/RecycleWindow';
import SettingsWindow from './features/os/windows/SettingsWindow';
import TerminalWindow from './features/os/windows/TerminalWindow';
import VscodeWindow from './features/os/windows/VscodeWindow';

const FlappyBirdWindow = lazy(() => import('./features/os/windows/FlappyBirdWindow'));
const FlowerWindow = lazy(() => import('./features/os/windows/FlowerWindow'));
const MinesweeperWindow = lazy(() => import('./features/os/windows/MinesweeperWindow'));

function useBatteryStatus() {
  const [battery, setBattery] = useState(null);

  useEffect(() => {
    if (typeof navigator === 'undefined' || typeof navigator.getBattery !== 'function') {
      return undefined;
    }

    let batteryManager;

    const syncBatteryState = () => {
      if (!batteryManager) {
        return;
      }

      setBattery({
        charging: batteryManager.charging,
        level: Math.round(batteryManager.level * 100),
      });
    };

    navigator.getBattery()
      .then((manager) => {
        batteryManager = manager;
        syncBatteryState();
        manager.addEventListener('chargingchange', syncBatteryState);
        manager.addEventListener('levelchange', syncBatteryState);
      })
      .catch((error) => {
        console.error('Battery API unavailable:', error);
      });

    return () => {
      if (!batteryManager) {
        return;
      }

      batteryManager.removeEventListener('chargingchange', syncBatteryState);
      batteryManager.removeEventListener('levelchange', syncBatteryState);
    };
  }, []);

  return battery;
}

export default function ComputerOS({ onExit, soundEnabled, toggleSound }) {
  const [booted, setBooted] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [catPosture, setCatPosture] = useState('sit');
  const [termInput, setTermInput] = useState('');
  const [termHistory, setTermHistory] = useState(["Welcome to Shell v1.0. Type 'help' for commands."]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [expandedGameId, setExpandedGameId] = useState(null);
  const [expandedMobileId, setExpandedMobileId] = useState(null);
  const [activeCodeFile, setActiveCodeFile] = useState('main');
  const [activeCodePanel, setActiveCodePanel] = useState('explorer');
  const [fullscreenFigure, setFullscreenFigure] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const time = useClock(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const battery = useBatteryStatus();
  const formRef = useRef(null);
  const termEndRef = useRef(null);
  const catMenuRef = useRef(null);
  const catTriggerRef = useRef(null);

  const {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    maximizeWindow,
    minimizeWindow,
    startDrag,
    handlePointerMove,
    handlePointerUp,
  } = useWindowManager(initialWindows);

  const currentCodeFile = codeFiles.find((file) => file.id === activeCodeFile) || codeFiles[0];
  const vscodeIconBg = theme === 'light' ? '#d1d5db' : '#ffffff';

  const batteryFillWidth = battery ? `${Math.max(8, battery.level)}%` : '0%';
  const batteryColor = battery?.charging
    ? 'var(--accent-color)'
    : battery && battery.level <= 20
      ? '#ff5f56'
      : 'var(--text-color)';
  const batteryBoltColor = theme === 'matrix'
    ? '#0b0b0b'
    : theme === 'light'
      ? '#000000'
      : '#ffffff';
  const batteryBoltStrokeColor = batteryBoltColor === '#ffffff' ? '#000000' : '#ffffff';

  const controlsFor = (windowId) => ({
    focus: () => focusWindow(windowId),
    startDrag: (event) => startDrag(event, windowId),
    minimize: () => minimizeWindow(windowId),
    maximize: () => maximizeWindow(windowId),
    close: () => closeWindow(windowId),
  });

  const handleShutdown = (event) => {
    if (event) {
      event.stopPropagation();
    }

    playPowerToggleSound();
    onExit();
  };

  const handleTerminalKeyDown = (event) => {
    playKeyboardSound();

    if (event.key !== 'Enter') {
      return;
    }

    const command = termInput.trim();
    const normalizedCommand = command.toLowerCase();

    if (normalizedCommand === 'clear') {
      setTermHistory([]);
      setTermInput('');
      return;
    }

    if (normalizedCommand === 'exit') {
      handleShutdown(event);
      return;
    }

    let response = '';

    switch (normalizedCommand) {
      case 'help':
        response = 'Available: help, about, projects, contact, games, mobile, flower, vscode, recycle, clear, exit';
        break;
      case 'about':
        openWindow('about');
        response = 'Opening user_profile.txt...';
        break;
      case 'projects':
        openWindow('projects');
        response = 'Opening ~/projects...';
        break;
      case 'contact':
        openWindow('contact');
        response = 'Launching contact.exe...';
        break;
      case 'games':
        openWindow('games');
        response = 'Opening ~/games...';
        break;
      case 'mobile':
        openWindow('mobile');
        response = 'Opening ~/mobile...';
        break;
      case 'vscode':
        openWindow('vscode');
        response = 'Launching vscode.exe...';
        break;
      case 'flower':
        openWindow('flower');
        response = 'Opening flower.mp4...';
        break;
      case 'recycle':
        openWindow('recycle');
        response = 'Opening Recycle...';
        break;
      case 'whoami':
        response = 'guest@portfolio_os';
        break;
      default:
        response = `Command not found: ${normalizedCommand}`;
    }

    setTermHistory((previous) => [...previous, `user@compeng:~$ ${command}`, response]);
    setTermInput('');
  };

  const handleContactFieldChange = (field, value) => {
    playKeyboardSound();
    setContactForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    setIsSending(true);

    emailjs.sendForm('service_a3mgnwe', 'template_rmyiku1', formRef.current, 'q78LulzRTYcFOXmd0')
      .then(() => {
        setIsSending(false);
        setContactForm({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        setIsSending(false);
        console.error(error);
        alert('Transmission failed: Connection refused.');
      });
  };

  const openFullscreenFigure = (src, alt, caption) => {
    setFullscreenFigure({ src, alt, caption });
  };

  const closeFullscreenFigure = (soundType) => {
    if (soundType === 'keyboard') {
      playKeyboardSound();
    } else if (soundType === 'click') {
      playClickSound();
    }

    setFullscreenFigure(null);
  };

  const handleCatToggle = (event) => {
    playClickSound();
    event.stopPropagation();
    setShowStartMenu(false);
    setShowCatMenu((current) => !current);
  };

  const handleCatSleepToggle = () => {
    playClickSound();
    setCatPosture((current) => (current === 'sleep' ? 'sit' : 'sleep'));
    setShowCatMenu(false);
  };

  const handleCatSitToggle = () => {
    playClickSound();
    setCatPosture((current) => (current === 'sit' ? 'idle' : 'sit'));
    setShowCatMenu(false);
  };

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setBooted(true), 1000);
    return () => window.clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [termHistory]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && fullscreenFigure) {
        closeFullscreenFigure('keyboard');
      }

      if (event.key === 'Escape' && showCatMenu) {
        setShowCatMenu(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullscreenFigure, showCatMenu]);

  useEffect(() => {
    if (!showCatMenu) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      const target = event.target;

      if (catMenuRef.current?.contains(target) || catTriggerRef.current?.contains(target)) {
        return;
      }

      setShowCatMenu(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [showCatMenu]);

  if (!booted) {
    return null;
  }

  return (
    <div
      className="os-container"
      style={{ ...themeVars[theme], position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', zIndex: 200, fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onClick={playClickSound}
    >
      <style>{osStyles}</style>

      <div className="desktop">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            className={icon.className}
            label={icon.label}
            icon={icon.icon}
            iconClassName={icon.iconClassName}
            iconStyle={icon.usesVsCodeBackground ? { background: vscodeIconBg, ...icon.iconStyle } : icon.iconStyle}
            onClick={() => openWindow(icon.id)}
          >
            {icon.isImageIcon ? <img src={icon.imageSrc} alt={icon.imageAlt} className="vscode-icon" /> : null}
          </DesktopIcon>
        ))}
      </div>

      <AboutWindow windowState={windows.about} controls={controlsFor('about')} onOpenFigure={openFullscreenFigure} />
      <ContactWindow
        windowState={windows.contact}
        controls={controlsFor('contact')}
        formRef={formRef}
        time={time}
        contactForm={contactForm}
        isSending={isSending}
        onSubmit={handleContactSubmit}
        onType={handleContactFieldChange}
      />
      <ProjectsWindow
        windowState={windows.projects}
        controls={controlsFor('projects')}
        expandedProjectId={expandedProjectId}
        onToggleProject={(projectId) => setExpandedProjectId((current) => (current === projectId ? null : projectId))}
        onOpenFigure={openFullscreenFigure}
      />
      <SettingsWindow windowState={windows.settings} controls={controlsFor('settings')} theme={theme} setTheme={setTheme} />
      <MobileWindow
        windowState={windows.mobile}
        controls={controlsFor('mobile')}
        expandedMobileId={expandedMobileId}
        onToggleMobile={(mobileId) => setExpandedMobileId((current) => (current === mobileId ? null : mobileId))}
        onOpenFigure={openFullscreenFigure}
      />
      <GamesWindow
        windowState={windows.games}
        controls={controlsFor('games')}
        expandedGameId={expandedGameId}
        onToggleGame={(gameId) => setExpandedGameId((current) => (current === gameId ? null : gameId))}
        onOpenFigure={openFullscreenFigure}
        onLaunchWindow={openWindow}
      />
      {windows.flappyBird.isOpen && (
        <Suspense fallback={null}>
          <FlappyBirdWindow windowState={windows.flappyBird} controls={controlsFor('flappyBird')} />
        </Suspense>
      )}
      {windows.minesweeper.isOpen && (
        <Suspense fallback={null}>
          <MinesweeperWindow windowState={windows.minesweeper} controls={controlsFor('minesweeper')} />
        </Suspense>
      )}
      <VscodeWindow
        windowState={windows.vscode}
        controls={controlsFor('vscode')}
        currentCodeFile={currentCodeFile}
        activeCodeFile={activeCodeFile}
        setActiveCodeFile={setActiveCodeFile}
        activeCodePanel={activeCodePanel}
        setActiveCodePanel={setActiveCodePanel}
      />
      {windows.flower.isOpen && (
        <Suspense fallback={null}>
          <FlowerWindow windowState={windows.flower} controls={controlsFor('flower')} />
        </Suspense>
      )}
      <RecycleWindow windowState={windows.recycle} controls={controlsFor('recycle')} />
      <TerminalWindow
        windowState={windows.terminal}
        controls={controlsFor('terminal')}
        termHistory={termHistory}
        termInput={termInput}
        setTermInput={setTermInput}
        onKeyDown={handleTerminalKeyDown}
        termEndRef={termEndRef}
      />

      <div className="cat-shell" ref={catTriggerRef}>
        <Cat onClick={handleCatToggle} menuOpen={showCatMenu} posture={catPosture} />
        {showCatMenu && (
          <div className="cat-menu" ref={catMenuRef} role="menu" aria-label="Sanjer actions">
            <div className="cat-menu-title">"Sanjer" the cat</div>
            {catPosture === 'sleep' ? (
              <button
                type="button"
                className="cat-menu-item"
                role="menuitem"
                onClick={handleCatSleepToggle}
              >
                Wake Up
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="cat-menu-item"
                  role="menuitem"
                  onClick={handleCatSitToggle}
                >
                  {catPosture === 'sit' ? 'Stand Up' : 'Sit'}
                </button>
                <button
                  type="button"
                  className="cat-menu-item"
                  role="menuitem"
                  onClick={handleCatSleepToggle}
                >
                  Sleep
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <Taskbar
        windows={windows}
        battery={battery}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        time={time}
        showStartMenu={showStartMenu}
        setShowStartMenu={(value) => {
          setShowCatMenu(false);
          setShowStartMenu(value);
        }}
        openWindow={openWindow}
        onShutdown={handleShutdown}
        batteryColor={batteryColor}
        batteryFillWidth={batteryFillWidth}
        batteryBoltColor={batteryBoltColor}
        batteryBoltStrokeColor={batteryBoltStrokeColor}
      />

      <FullscreenFigureModal figure={fullscreenFigure} onClose={closeFullscreenFigure} />

      <div className="crt-overlay" />
    </div>
  );
}
