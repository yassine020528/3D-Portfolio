import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function ComputerOS({ onExit }) {
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [battery, setBattery] = useState(null);
  const formRef = useRef();
  
  const [windows, setWindows] = useState({
    about: { id: 'about', title: 'user_profile.txt', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 150, y: 70 },
    projects: { id: 'projects', title: '~/projects', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 200, y: 80 },
    contact: { id: 'contact', title: 'contact.exe', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 300, y: 110 },
    terminal: { id: 'terminal', title: 'bash', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 250, y: 250 },
    settings: { id: 'settings', title: 'System Preferences', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 200, y: 200 },
    mobile: { id: 'mobile', title: '~/mobile', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 330, y: 60 },
    recycleBin: { id: 'recycleBin', title: 'Recycle', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 380, y: 160 },
    games: { id: 'games', title: '~/games', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 240, y: 140 },
  });

  const [highestZ, setHighestZ] = useState(100);
  const [theme, setTheme] = useState('dark');
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [termInput, setTermInput] = useState("");
  const [termHistory, setTermHistory] = useState(["Welcome to Shell v1.0. Type 'help' for commands."]);
  const termEndRef = useRef(null);
  const dragRef = useRef({ id: null, offsetX: 0, offsetY: 0 });
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [fullscreenFigure, setFullscreenFigure] = useState(null);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const mobileList = [
    {
      title: 'Finance Tracker',
      platform: 'Android',
      appLogo: '/images/android-logo1.png',
      techLogos: ['/logos/kotlin.svg', '/logos/jetpack-compose.svg'],
      screenshots: ['/images/android1.png', '/images/android2.png'],
      description: 'A personal finance tracker built with Kotlin and Jetpack Compose around a clean MVVM flow. It focuses on fast expense logging, local Room persistence, and adaptive Material 3 layouts so the dashboard stays readable whether the user is checking balances quickly or digging into spending habits.'
    },
    {
      title: 'Bluetooth Tracker',
      platform: 'Android',
      appLogo: '/images/android-logo2.png',
      techLogos: ['/logos/kotlin.svg', '/logos/jetpack-compose.svg'],
      screenshots: ['/images/android3.png', '/images/android4.png'],
      description: 'An Android app for tracking nearby Bluetooth devices and visualizing their movement with GPS trajectories. I combined asynchronous device scanning, Coroutines-based state updates, and a map-driven UI to make live location history easier to follow in real time.'
    },
    {
      title: 'Running Tracker',
      platform: 'Android',
      appLogo: '/images/android-logo3.png',
      techLogos: ['/logos/kotlin.svg', '/logos/jetpack-compose.svg'],
      screenshots: ['/images/android5.jpg', '/images/android6.jpg'],
      description: 'A location-aware running and walking app designed around session flow, route awareness, and lightweight networking. It uses Retrofit and OkHttp for connected features, Compose Navigation for a smooth in-app structure, and a mobile-first UI that keeps the important stats front and center while moving.'
    },
    {
      title: 'School Tracker',
      platform: 'iOS',
      appLogo: '/images/ios-logo1.png',
      techLogos: ['/logos/swift.svg'],
      screenshots: ['/images/ios1.PNG', '/images/ios2.PNG'],
      description: 'An iOS school tracker built in SwiftUI to organize classes, deadlines, and weighted grade calculations in one place. The app uses on-device persistence with UserDefaults and Codable JSON encoding, and it centers the experience around planning coursework visually instead of letting assignments pile up invisibly.'
    }
  ];

  const projectsList = [
    {
      id: 1,
      title: "Embedded Obstacle Detection",
      tech: "C++, ATmega164A, Assembly",
      description: "Built an autonomous search system using the ATmega164A microcontroller. Implemented low-level I/O control, sensor data acquisition, and real-time decision logic in C++ based on strict timing specifications.",
      image: "/images/project1.JPG", 
      logos: ["/logos/c++.svg", "/logos/assembly.svg"],
      caption: <>Held together by <br/>1% wires, and 99% faith.</>
    },
    {
      id: 2,
      title: "Real-Time Combat Game",
      tech: "Angular, NestJS, WebSockets",
      description: "Developed a real-time multiplayer game featuring seamless bidirectional communication. Designed event synchronization and matchmaking logic to ensure smooth gameplay under concurrent loads.",
      image: "/images/project2.png", 
      logos: ["/logos/html.svg","/logos/css.svg", "/logos/typescript.svg","/logos/angular.svg", "/logos/nestjs.svg", "/logos/websocket.svg"],
      caption: <>Bug-free*<br/>(*allegedly).</>
    },
    {
      id: 3,
      title: "Multi-Robot Exploration System",
      tech: "ROS2, Gazebo, Python, Docker",
      description: "Designed an autonomous exploration system integrating AgileX Limo robots. Implemented navigation and inter-robot coordination in Python while containerizing software modules using Docker for portability.",
      image: "/images/project3.gif", 
      logos: ["/logos/gazebo.svg", "/logos/python.svg", "/logos/docker.svg"],
      caption: <>Haven't crashed<br/>into each other... yet.</>
    },
    {
      id: 4,
      title: "Hydro-Québec Weather Forecasting Platform",
      tech: "Angular, .NET, GDAL, Leaflet, SQLite, RESTful API",
      description: "Developed a full-stack weather visualization platform for real-time multi-model forecast. Implemented GDAL raster processing and Leaflet for interactive geospatial mapping, supported by a RESTful API and SQLite database.",
      image: "/images/project4.png", 
      logos: ["/logos/angular.svg","/logos/dotnet.svg", "/logos/gdal.svg", "/logos/leaflet.svg", "/logos/sqlite.svg", "/logos/restful-api.svg"],
      caption: <>It's so cold,<br/>even the code froze.</>
    },
    {
      id: 5,
      title: "PolyHacks 2025 - WildGuard",
      tech: "YOLOv8, OpenCV, Python, Flask, PyTorch, Ultralytics",
      description: "Led the development of WildGuard, an AI-powered wildlife monitoring system that detects and classifies animals in real-time using YOLOv8. Engineered data pipelines and a Flask web interface for live video streaming and alerts.",
      image: "/images/hackathon.png",
      logos: ["/logos/python.svg", "/logos/pytorch.svg", "/logos/yolov8.svg"],
      caption: <>Look Mom!<br/>It's a cat!</>
    },
    {
      id: 6,
      title: "Personal Portfolio OS",
      tech: "HTML5, CSS, JS, React, ThreeJS",
      description: "Created a 3D desk using ThreeJS with a web operating system using React. Implemented window management, terminal emulation, and interactive UI components to mimic classic OS behavior.",
      image: "/images/portfolio.png", 
      logos: ["/logos/html.svg", "/logos/css.svg", "/logos/javascript.svg", "/logos/react.svg", "/logos/threejs.svg", ],
      caption: <>Feels weird,<br/>weirdly familiar.</>
    }
  ];

  const maximizeWindow = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized, isMinimized: false }
    }));
    focusWindow(id);
  };

  const minimizeWindow = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
  };

  const toggleProject = (id) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  const playClickSound = () => {
    const clickSound = new Audio('/sounds/click.mp3');
    clickSound.play().catch(e => console.error(e));
  };
  const playKeystrokeSound = () => {
    const sounds = [
        '/sounds/keyboard/key_1.mp3', '/sounds/keyboard/key_2.mp3', 
        '/sounds/keyboard/key_3.mp3', '/sounds/keyboard/key_4.mp3', 
        '/sounds/keyboard/key_5.mp3', '/sounds/keyboard/key_6.mp3'
    ];
    const randomSound = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
    randomSound.play().catch(e => console.error(e));
  };

  useEffect(() => {
    const onAudio = new Audio('/sounds/on-off-sound.mp3');
    onAudio.volume = 0.5;
    onAudio.play().catch(e => console.error(e));
    const bootTimer = setTimeout(() => setBooted(true), 1000);
    const clockTimer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => { clearTimeout(bootTimer); clearInterval(clockTimer); };
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined' || typeof navigator.getBattery !== 'function') {
      return;
    }

    let batteryManager;

    const syncBatteryState = () => {
      if (!batteryManager) return;
      setBattery({
        charging: batteryManager.charging,
        level: Math.round(batteryManager.level * 100)
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
      if (!batteryManager) return;
      batteryManager.removeEventListener('chargingchange', syncBatteryState);
      batteryManager.removeEventListener('levelchange', syncBatteryState);
    };
  }, []);

  useEffect(() => { termEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [termHistory]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && fullscreenFigure) {
        closeFullscreenFigure('keyboard');
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullscreenFigure]);

  const handleShutdown = (e) => {
    if (e) e.stopPropagation(); 
    const offAudio = new Audio('/sounds/on-off-sound.mp3');
    offAudio.volume = 0.5;
    offAudio.play().catch(e => console.error(e));
    onExit();
  };

  const openWindow = (id) => { 
    setHighestZ(prev => prev + 1);
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: highestZ + 1 } })); 
  };
  const closeWindow = (id) => { setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false, isMaximized: false } })); };
  const focusWindow = (id) => { setHighestZ(prev => prev + 1); setWindows(prev => ({ ...prev, [id]: { ...prev[id], zIndex: highestZ + 1 } })); };
  const startDrag = (e, id) => { const winState = windows[id]; dragRef.current = { id: id, offsetX: e.clientX - winState.x, offsetY: e.clientY - winState.y }; focusWindow(id); };
  const onMouseMove = (e) => { if (dragRef.current.id) { const { id, offsetX, offsetY } = dragRef.current; setWindows(prev => ({ ...prev, [id]: { ...prev[id], x: e.clientX - offsetX, y: e.clientY - offsetY } })); } };
  const onMouseUp = () => { dragRef.current = { id: null, offsetX: 0, offsetY: 0 }; };

  const handleTermKeyDown = (e) => { 
    playKeystrokeSound();
    if (e.key === 'Enter') { 
      const cmd = termInput.trim().toLowerCase(); 
      let response = ""; 
      switch(cmd) { 
        case 'help': response = "Available: help, about, projects, contact, games, mobile, recycle, clear, exit"; break; 
        case 'about': openWindow('about'); response = "Opening user_profile.txt..."; break; 
        case 'projects': openWindow('projects'); response = "Opening ~/projects..."; break; 
        case 'contact': openWindow('contact'); response = "Launching contact.exe..."; break; 
        case 'mobile': openWindow('mobile'); response = "Opening ~/mobile..."; break;
        case 'games': openWindow('games'); response = "Opening ~/games..."; break;
        case 'recycle': openWindow('recycleBin'); response = "Opening Recycle..."; break;
        case 'whoami': response = "guest@portfolio_os"; break; 
        case 'exit': handleShutdown(e); return; 
        case 'clear': setTermHistory([]); setTermInput(""); return; 
        default: response = `Command not found: ${cmd}`; 
      } 
      setTermHistory(prev => [...prev, `user@compeng:~$ ${termInput}`, response]); 
      setTermInput(""); 
    } 
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    const SERVICE_ID = 'service_a3mgnwe';
    const TEMPLATE_ID = 'template_rmyiku1';
    const PUBLIC_KEY = 'q78LulzRTYcFOXmd0';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
          setIsSending(false);
          setContactForm({ name: '', email: '', message: '' });
      }, (error) => {
          setIsSending(false);
          console.error(error);
          alert("Transmission failed: Connection refused.");
      });
  };

  const openFullscreenFigure = (src, alt, caption) => {
    setFullscreenFigure({ src, alt, caption });
  };

  const closeFullscreenFigure = (soundType) => {
    if (soundType === 'keyboard') {
      playKeystrokeSound();
    } else if (soundType === 'click') {
      playClickSound();
    }
    setFullscreenFigure(null);
  };

  const getThemeVars = () => {
    switch(theme) {
      case 'light': return { '--bg-color': '#f0f2f5', '--window-bg': '#ffffff', '--text-color': '#1c1e21', '--accent-color': '#0066cc', '--header-bg': '#e4e6eb', '--border-color': '#ccc', '--scan-color': 'rgba(0, 0, 0, 0.1)'};
      case 'matrix': return { '--bg-color': '#000000', '--window-bg': '#001100', '--text-color': '#00ff41', '--accent-color': '#00ff41', '--header-bg': '#002200', '--border-color': '#00ff41', '--scan-color': 'rgba(0, 255, 65, 0.1)' };
      case 'cyber': return { '--bg-color': '#2b213a', '--window-bg': '#241b35', '--text-color': '#e9488b', '--accent-color': '#03a9f4', '--header-bg': '#1a1325', '--border-color': '#e9488b', '--scan-color': 'rgba(233, 72, 139, 0.1)' };
      default: return { '--bg-color': '#0d1117', '--window-bg': '#161b22', '--text-color': '#c9d1d9', '--accent-color': '#58a6ff', '--header-bg': '#21262d', '--border-color': '#30363d', '--scan-color': 'rgba(88, 166, 255, 0.1)' };
    }
  };

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

  if (!booted) return null; 

  return (
    <div 
      className="os-container"
      style={{ ...getThemeVars(), position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', zIndex: 200, fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onClick={playClickSound}
    >
      <style>{`
        .os-container, .os-container * { cursor: pointer; box-sizing: border-box; }
        .crt-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none; z-index: 9999;
          background: 
            radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.4) 100%),
            repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px);
        }
        .crt-overlay::after {
          content: ""; position: absolute; top: -25%; left: 0; width: 100%; height: 200%;
          background: linear-gradient(to bottom, transparent 40%, var(--scan-color) 50%, transparent 60%);
          animation: scanBand 10s linear infinite;
        }
        @keyframes scanBand { 0% { transform: translateY(-50%); } 100% { transform: translateY(25%); } }

        .os-container { background-color: var(--bg-color); color: var(--text-color); user-select: none; }
        
        .desktop { 
            position: relative;
            --desktop-pad: 20px;
            --desktop-step: 108px;
            padding: 20px; 
            height: calc(100dvh - 60px); 
        }

        .icon { width: 88px; text-align: center; padding: 10px; border-radius: 5px; transition: 0.2s; display: flex; flex-direction: column; align-items: center; position: absolute; }
        .icon:hover { background: rgba(255,255,255,0.1); }
        .icon-img { width: 40px; height: 40px; background: var(--accent-color); border-radius: 8px; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--bg-color); }
        .icon-img-games { padding-bottom: 3px; }
        .icon-label { display: block; width: 100%; line-height: 1.2; text-align: center; word-break: break-word; }
        .icon-about { top: var(--desktop-pad); left: var(--desktop-pad); }
        .icon-projects { top: calc(var(--desktop-pad) + var(--desktop-step)); left: var(--desktop-pad); }
        .icon-contact { top: calc(var(--desktop-pad) + (var(--desktop-step) * 2)); left: var(--desktop-pad); }
        .icon-terminal { top: calc(var(--desktop-pad) + (var(--desktop-step) * 3)); left: var(--desktop-pad); }
        .icon-games { position: absolute; top: var(--desktop-pad); left: calc(var(--desktop-pad) + var(--desktop-step)); }
        .icon-mobile { position: absolute; top: calc(var(--desktop-pad) + var(--desktop-step)); left: calc(var(--desktop-pad) + var(--desktop-step)); }
        .icon-recycle-bin { position: absolute; top: var(--desktop-pad); right: var(--desktop-pad); }
        .icon-settings { position: absolute; left: var(--desktop-pad); bottom: var(--desktop-pad); }
        
        .window { 
            position: absolute; 
            min-height: 200px; 
            max-height: calc(100vh - 60px);
            background: var(--window-bg); 
            border: 1px solid var(--border-color); 
            border-radius: 8px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
            display: flex; 
            flex-direction: column; 
            max-width: 100vw; 
        }
        .window-header { background: var(--header-bg); padding: 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); border-radius: 8px 8px 0 0; flex-shrink: 0; }
        .window-title { font-weight: bold; font-size: 0.9rem; }
        .window-controls span { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-left: 5px; }
        .close-btn { background: #ff5f56; }
        .window-content { padding: 20px; flex-grow: 1; overflow-y: auto; user-select: text; }
        
        .taskbar { 
            position: absolute; bottom: 0; width: 100%; 
            height: auto; min-height: 45px; 
            background: var(--header-bg); border-top: 1px solid var(--border-color); 
            display: flex; align-items: center; padding: 0 15px; 
            padding-bottom: env(safe-area-inset-bottom);
            justify-content: space-between; z-index: 1000; 
        }

        .start-btn { background: var(--accent-color); color: var(--bg-color); padding: 5px 15px; border-radius: 4px; font-weight: bold; margin-bottom: env(safe-area-inset-bottom); }
        .clock { margin-bottom: env(safe-area-inset-bottom); }
        
        .start-menu { position: absolute; bottom: 60px; left: 10px; width: 200px; background: var(--window-bg); border: 1px solid var(--border-color); border-radius: 5px; padding: 10px; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 2000; margin-bottom: env(safe-area-inset-bottom); }
        .menu-item { padding: 8px; border-radius: 3px; }
        .menu-item:hover { background: rgba(255,255,255,0.1); }
        .menu-item.danger { color: #ff5f56; }
        .theme-btn { display: block; width: 100%; padding: 10px; margin-bottom: 10px; background: var(--header-bg); border: 1px solid var(--border-color); color: var(--text-color); text-align: left; }
        .theme-btn:hover { border-color: var(--accent-color); }
        .project-item { border: 1px solid var(--border-color); padding: 10px; margin-bottom: 10px; border-radius: 5px; }
        .project-item h4 { margin: 0 0 5px 0; color: var(--accent-color); }
        input.cmd-input { background: transparent; border: none; color: #0f0; font-family: monospace; flex-grow: 1; outline: none; }
        
        .contact-form input, .contact-form textarea {
            width: 100%; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color);
            color: var(--text-color); padding: 8px; margin-bottom: 10px; borderRadius: 4px;
        }
        .contact-btn {
            background: var(--accent-color); color: var(--bg-color); border: none; padding: 8px 16px;
            border-radius: 4px; font-weight: bold; width: 100%;
        }
        .mobile-app-card { display: flex; gap: 18px; align-items: flex-start; justify-content: space-between; flex-wrap: nowrap; }
        .mobile-app-content { flex: 1; min-width: 0; }
        .mobile-app-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
        .mobile-app-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .mobile-app-shots { display: flex; gap: 12px; flex-shrink: 0; }
        .social-link { display: inline-flex; align-items: center; margin-right: 15px; text-decoration: none; color: var(--accent-color); }
        .social-link:hover { text-decoration: underline; }
        .figure-image {
            cursor: zoom-in;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .figure-image:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 24px rgba(0,0,0,0.28);
        }
        .fullscreen-figure-overlay {
            position: fixed;
            inset: 0;
            z-index: 12000;
            background: rgba(0,0,0,0.88);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .fullscreen-figure-modal {
            position: relative;
            max-height: 92dvh;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
            width: auto;
            max-width: 92vw;
        }
        .fullscreen-figure-shell {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            max-width: 92vw;
        }
        .fullscreen-figure-image {
            width: auto;
            max-width: 100%;
            height: clamp(320px, 72vh, 720px);
            object-fit: contain;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.14);
            box-shadow: 0 20px 50px rgba(0,0,0,0.45);
            background: rgba(0,0,0,0.35);
        }
        .fullscreen-figure-caption {
            text-align: center;
            font-size: 0.9rem;
            color: #f5f5f5;
            opacity: 0.9;
        }
        .fullscreen-figure-close {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 999px;
            background: rgba(20,20,20,0.92);
            color: #fff;
            font-size: 1.4rem;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .fullscreen-figure-hint {
            font-size: 0.8rem;
            color: rgba(255,255,255,0.7);
        }

        @media (max-width: 768px) {
            .window:not(.maximized) {
                width: 95vw !important;
                max-height: calc(100dvh - 85px - env(safe-area-inset-bottom)) !important;
                height: auto !important; 
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -55%) !important;
                max-width: 100vw;
            }
            .window.maximized {
                transform: none !important;
                width: 100vw !important;
                height: calc(100dvh - 45px) !important;
                left: 0 !important;
                top: 0 !important;
                border-radius: 0;
            }
            .window-content {
                padding: 15px;
            }
            .project-detail-layout {
                flex-direction: column;
            }
            .project-image-container {
                margin-bottom: 15px;
            }
            .mobile-app-card {
                flex-wrap: wrap;
            }
            .mobile-app-content {
                width: 100%;
            }
            .mobile-app-shots {
                width: 100%;
                justify-content: center;
                flex-wrap: wrap;
            }
            .fullscreen-figure-overlay {
                padding: 16px;
            }
            .fullscreen-figure-modal {
                max-width: 100%;
            }
            .fullscreen-figure-close {
                top: -4px;
                right: 0;
            }
            .fullscreen-figure-image {
                height: clamp(240px, 58vh, 520px);
            }
        }

        @media (max-width: 980px) {
            .mobile-app-card {
                flex-wrap: wrap;
            }
            .mobile-app-content {
                min-width: 100%;
            }
            .mobile-app-shots {
                width: 100%;
                justify-content: flex-start;
                flex-wrap: wrap;
            }
        }
      `}</style>

      <div className="desktop">
        <div className="icon icon-about" onClick={() => openWindow('about')}>
          <div className="icon-img">👤</div>
          <span className="icon-label">About</span>
        </div>
        <div className="icon icon-projects" onClick={() => openWindow('projects')}>
          <div className="icon-img">📂</div>
          <span className="icon-label">Projects</span>
        </div>

        <div className="icon icon-contact" onClick={() => openWindow('contact')}>
          <div className="icon-img" style={{background: '#ff9800', color: '#ffffff'}}>✉️</div>
          <span className="icon-label">Contact</span>
        </div>
        <div className="icon icon-terminal" onClick={() => openWindow('terminal')}>
          <div className="icon-img" style={{background: '#333', color: '#0f0'}}>&gt;_</div>
          <span className="icon-label">Terminal</span>
        </div>
        <div className="icon icon-games" onClick={() => openWindow('games')}>
          <div className="icon-img icon-img-games">🎮</div>
          <span className="icon-label">Games</span>
        </div>
        <div className="icon icon-settings" onClick={() => openWindow('settings')}>
          <div className="icon-img" style={{background: '#ccc', color: '#333'}}>⚙️</div>
          <span className="icon-label">Settings</span>
        </div>
        <div className="icon icon-mobile" onClick={() => openWindow('mobile')}>
          <div className="icon-img">📱</div>
          <span className="icon-label">Mobile</span>
        </div>
        <div className="icon icon-recycle-bin" onClick={() => openWindow('recycleBin')}>
          <div className="icon-img" style={{background: '#8ecae6', color: '#10354a'}}>♻</div>
          <span className="icon-label">Recycle</span>
        </div>
      </div>

      {windows.about.isOpen && !windows.about.isMinimized && (
        <div className={`window ${windows.about.isMaximized ? 'maximized' : ''}`} 
          style={{ 
            top: windows.about.isMaximized ? 0 : windows.about.y, 
            left: windows.about.isMaximized ? 0 : windows.about.x, 
            width: windows.about.isMaximized ? '100vw' : '600px',
            height: windows.about.isMaximized ? 'calc(100dvh - 45px)' : '500px',
            zIndex: windows.about.zIndex,
            borderRadius: windows.about.isMaximized ? '0' : '8px'
          }} onMouseDown={() => focusWindow('about')}>
          <div className="window-header" onMouseDown={(e) => !windows.about.isMaximized && startDrag(e, 'about')} onDoubleClick={() => maximizeWindow('about')}>
            <div className="window-title">user_profile.txt</div>
            <div className="window-controls">
            <span className="min-btn" onClick={() => minimizeWindow('about')} style={{ background: '#febc2e'}}></span>
            <span className="max-btn" onClick={() => maximizeWindow('about')} style={{ background: '#28c840'}}></span>
            <span className="close-btn" onClick={() => closeWindow('about')}></span></div>
          </div>
          <div className="window-content">
            <h2 style={{color: 'var(--accent-color)', marginTop: 0}}>Hello, I'm Yassine</h2>
            <p><strong>Comp. Eng. Student</strong>, at Polytechnique Montréal</p>
            <hr style={{borderColor: 'var(--border-color)'}}/>
            <p>
              I've been fascinated by how things work "under the hood" ever since I dismantled my first remote control car as a child.
              Back then, adults would called it "destruction", but I prefer the term curiosity. 
              <br />
              There was something addictive about seeing the raw circuit boards and gears that made the magic happen. 
              Eventually, I learned that putting things back together was just as fun as taking them apart.
            </p>
            <br />
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                  src="/images/young_self.JPG"
                  alt="Young Yassine"
                  className="figure-image"
                  onClick={() => openFullscreenFigure('/images/young_self.JPG', 'Young Yassine', 'Figure 1: Younger me coding this website :)')}
                  style={{ width: '100%', maxWidth: '250px', borderRadius: '4px', border: '2px solid var(--border-color)', filter: 'grayscale(0.8) sepia(0.2)' }}
                />
                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '5px', opacity: 0.7 }}>Figure 1: Younger me coding this website :)</p>
            </div>
            <p>My younger self's curiosity has blossomed into a full-blown passion for computer engineering, 
              and a slightly concerning relationship with caffeine.
              <br />
              <i>"Why build a simple portfolio when you can simulate an entire operating system?"</i>
               - Me, at 3 AM.
              </p>
            <br />
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src="/images/old_self.jpg"
                alt="Old Yassine"
                className="figure-image"
                onClick={() => openFullscreenFigure('/images/old_self.jpg', 'Old Yassine', 'Figure 2: Older me caffeinated up and ready to code more!')}
                style={{ width: '100%', maxWidth: '250px', borderRadius: '4px', border: '2px solid var(--border-color)', filter: 'grayscale(0.8) sepia(0.2)' }}
              />
              <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '5px', opacity: 0.7 }}>Figure 2: Older me caffeinated up and ready to code more!</p>
            </div>
            <p>Whether it's designing custom FPGA architectures, writing low-level embedded C, or building retro web operating systems like this one, I love solving complex engineering puzzles.</p>
            <br />
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'monospace' }}>
              <p style={{ margin: '0 0 10px 0', color: 'var(--accent-color)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '5px' }}>
                <strong>&gt; cat /var/log/experience.log</strong>
              </p>

              <div style={{ marginBottom: '15px', paddingLeft: '10px', borderLeft: '2px solid var(--accent-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#fff' }}>[v1.0] Software Quality Assurance Intern </strong>
                  <span style={{ opacity: 0.6 }}>May 2024 - Sep 2024</span>
                </div>
                <div style={{ color: 'var(--accent-color)', fontSize: '0.85rem' }}>@ UpToTest</div>
                <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '0.85rem', opacity: 0.9, listStyleType: 'square' }}>
                  <li>Designed, automated, and maintained e2e test cases</li>
                  <li>Used Cypress with Cucumber within a full BDD workflow</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                    <img 
                      src="/logos/cypress.svg" 
                      alt="Cypress" 
                      style={{ height: '20px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }}
                    />
                    <img 
                      src="/logos/cucumber.svg" 
                      alt="Cucumber" 
                      style={{ height: '20px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }}
                    />
                  </li>
                </ul>
              </div>

              <div style={{ marginBottom: '15px', paddingLeft: '10px', borderLeft: '2px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#fff' }}>[v2.0] Private Tutor</strong>
                  <span style={{ opacity: 0.6 }}>Aug 2021 - Present</span>
                </div>
                <div style={{ color: 'var(--accent-color)', fontSize: '0.85rem' }}>@ Montreal, QC</div>
                <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '0.85rem', opacity: 0.9, listStyleType: 'square' }}>
                  <li>Provided academic support to college and university students.</li>
                  <li>Helped learners with mathematics, physics, programming.</li>
                </ul>
              </div>
            </div>
            <br />
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <a
                href="/yassine_abassi.pdf"
                target="_blank"
                className="theme-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                  textDecoration: 'none',
                  background: 'var(--accent-color)',
                  color: 'var(--bg-color)',
                  fontWeight: 'bold'
                }}
              >
                <span style={{ flex: 1, textAlign: 'center' }}>View Resume</span>
                <img
                  src="/logos/expand.png"
                  alt=""
                  aria-hidden="true"
                  style={{ width: '16px', height: '16px', marginLeft: '10px', objectFit: 'contain' }}
                />
              </a>
            </div>
          </div>
          
        </div>
      )}

      {windows.contact.isOpen && !windows.contact.isMinimized && (
        <div className={`window ${windows.contact.isMaximized ? 'maximized' : ''}`} 
          style={{ 
            top: windows.contact.isMaximized ? 0 : windows.contact.y, 
            left: windows.contact.isMaximized ? 0 : windows.contact.x, 
            width: windows.contact.isMaximized ? '100vw' : '400px' ,
            height: windows.contact.isMaximized ? 'calc(100dvh - 45px)' : '490px',
            zIndex: windows.contact.zIndex, 
            borderRadius: windows.contact.isMaximized ? '0' : '8px'
          }} onMouseDown={() => focusWindow('contact')}>
          <div className="window-header" onMouseDown={(e) => !windows.contact.isMaximized && startDrag(e, 'contact')}>
            <div className="window-title">contact.exe</div>
            <div className="window-controls">
              <span className="min-btn" onClick={() => minimizeWindow('contact')} style={{ background: '#febc2e'}}></span>
              <span className="max-btn" onClick={() => maximizeWindow('contact')} style={{ background: '#28c840'}}></span>
              <span className="close-btn" onClick={() => closeWindow('contact')}></span>
            </div>
          </div>
          <div className="window-content contact-form">
            <h3 style={{marginTop: 0, color: 'var(--accent-color)'}}>Let's Connect</h3>
            <div style={{marginBottom: '20px'}}>
                <a href="#" className="social-link" onClick={(e) => { e.preventDefault(); window.open('https://github.com/Yassine020528', '_blank'); }}>GitHub</a>
                <a href="#" className="social-link" onClick={(e) => { e.preventDefault(); window.open('https://www.linkedin.com/in/yassine-abassi-b9ba721a6', '_blank'); }}>LinkedIn</a>
                <a href="mailto:yassine020528@gmail.com" className="social-link" target="_top">yassine020528@gmail.com</a>
            </div>
            <hr style={{borderColor: 'var(--border-color)', margin: '15px 0'}} />
            <form ref={formRef} onSubmit={handleContactSubmit}>
                <input type="hidden" name="time" value={time} />
                <label style={{fontSize: '0.9rem'}}>Name</label>
                <input 
                    type="text" 
                    name="name" 
                    value={contactForm.name} 
                    onChange={e => { playKeystrokeSound(); setContactForm({...contactForm, name: e.target.value}); }} 
                    required 
                />
                <label style={{fontSize: '0.9rem'}}>Email</label>
                <input 
                    type="email" 
                    name="email" 
                    value={contactForm.email} 
                    onChange={e => { playKeystrokeSound(); setContactForm({...contactForm, email: e.target.value}); }} 
                    required 
                />
                <label style={{fontSize: '0.9rem'}}>Message</label>
                <textarea 
                    rows="4" 
                    name="message" 
                    value={contactForm.message} 
                    onChange={e => { playKeystrokeSound(); setContactForm({...contactForm, message: e.target.value}); }} 
                    required
                ></textarea>
                <button type="submit" className="contact-btn" disabled={isSending}>
                    {isSending ? 'Sending...' : 'Send Message'}
                </button>
            </form>
          </div>
        </div>
      )}

      {windows.projects.isOpen && !windows.projects.isMinimized && (
        <div className={`window ${windows.projects.isMaximized ? 'maximized' : ''}`} 
          style={{ 
            top: windows.projects.isMaximized ? 0 : windows.projects.y, 
            left: windows.projects.isMaximized ? 0 : windows.projects.x, 
            width: windows.projects.isMaximized ? '100vw' :'600px', 
            height: windows.projects.isMaximized ? 'calc(100dvh - 45px)' :'550px' ,
            zIndex: windows.projects.zIndex, 
            borderRadius: windows.projects.isMaximized ? '0' : '8px'
          }} onMouseDown={() => focusWindow('projects')}>
          <div className="window-header" onMouseDown={(e) => !windows.projects.isMaximized && startDrag(e, 'projects')}>
            <div className="window-title">~/projects</div>
            <div className="window-controls">
              <span className="min-btn" onClick={() => minimizeWindow('projects')} style={{ background: '#febc2e'}}></span>
              <span className="max-btn" onClick={() => maximizeWindow('projects')} style={{ background: '#28c840'}}></span>
              <span className="close-btn" onClick={() => closeWindow('projects')}></span>
              </div>
          </div>
          <div className="window-content" style={{ padding: '0' }}>
            {projectsList.map((project) => (
              <div key={project.id} style={{ borderBottom: '1px solid var(--border-color)', background: expandedProjectId === project.id ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                <div onClick={() => toggleProject(project.id)} style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: '0.2s' }} className="project-header">
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: 'var(--accent-color)' }}>{expandedProjectId === project.id ? '📂 ' : '📁 '} {project.title}</h4>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{project.tech}</span>
                  </div>
                  <span style={{ transform: expandedProjectId === project.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}>▼</span>
                </div>
                {expandedProjectId === project.id && (
                  <div style={{ padding: '0 20px 20px 20px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="project-detail-layout" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                      <div className="project-image-container" style={{ flexShrink: 0, display : 'block'}}>
                        <div style={{ width: '120px', height: '120px', margin: '0 auto', background: '#000', border: '1px solid var(--border-color)', display: 'block', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', overflow: 'hidden' }}>
                           <img
                             src={project.image}
                             alt={project.title}
                             className="figure-image"
                             onClick={() => openFullscreenFigure(project.image, project.title, `Figure ${project.id}: ${typeof project.caption === 'string' ? project.caption : project.title}`)}
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                             onError={(e) => { e.target.style.display='none'; e.target.parentNode.style.color = 'var(--text-color)'; e.target.parentNode.innerText = 'IMG_ERR'; }}
                           />
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.7 }}>Figure {project.id}: {project.caption}</div>
                      </div>
                      <div style={{ flexGrow: 1 }}><p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>{project.description}</p>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                        {project.logos.map((logo, index) => (
                          <img 
                            key={index} src={logo} alt={`Logo ${index}`} style={{ height: '24px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px'  }} />
                        ))}
                      </li>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } } .project-header:hover { background: rgba(255,255,255,0.05); }`}</style>
          </div>
        </div>
      )}
            
      {windows.settings.isOpen && !windows.settings.isMinimized && (
        <div className="window" 
          style={{ 
            top: windows.settings.isMaximized ? 0 : windows.settings.y, 
            left: windows.settings.isMaximized ? 0 :  windows.settings.x, 
            width: windows.settings.isMaximized ? '100vw' : '300px',
            height: windows.settings.isMaximized ? 'calc(100dvh - 45px)' : '350px',
            borderRadius: windows.settings.isMaximized ? '0' : '8px',
            zIndex: windows.settings.zIndex 
          }} onMouseDown={() => focusWindow('settings')}>
          <div className="window-header" onMouseDown={(e) => !windows.settings.isMaximized && startDrag(e, 'settings')}>
            <div className="window-title">System Preferences</div>
            <div className="window-controls">
              <span className="min-btn" onClick={() => minimizeWindow('settings')} style={{ background: '#febc2e'}}></span>
              <span className="max-btn" onClick={() => maximizeWindow('settings')} style={{ background: '#28c840'}}></span>
              <span className="close-btn" onClick={() => closeWindow('settings')}></span>
            </div>
          </div>
          <div className="window-content">
            <p><strong>Theme Selection</strong></p>
            <button className="theme-btn" onClick={() => setTheme('dark')}>🌑 Dark Mode</button>
            <button className="theme-btn" onClick={() => setTheme('light')}>☀️ Light Mode</button>
            <button className="theme-btn" onClick={() => setTheme('matrix')}>📟 Hacker</button>
            <button className="theme-btn" onClick={() => setTheme('cyber')}>👾 Cyberpunk</button>
          </div>
        </div>
      )}

      {windows.mobile.isOpen && !windows.mobile.isMinimized && (
        <div className={`window ${windows.mobile.isMaximized ? 'maximized' : ''}`} 
          style={{ 
            top: windows.mobile.isMaximized ? 0 : windows.mobile.y, 
            left: windows.mobile.isMaximized ? 0 : windows.mobile.x, 
            width: windows.mobile.isMaximized ? '100vw' : '860px',
            height: windows.mobile.isMaximized ? 'calc(100dvh - 45px)' : '560px',
            zIndex: windows.mobile.zIndex, 
            borderRadius: windows.mobile.isMaximized ? '0' : '8px'
          }} onMouseDown={() => focusWindow('mobile')}>
          <div className="window-header" onMouseDown={(e) => !windows.mobile.isMaximized && startDrag(e, 'mobile')}>
            <div className="window-title">~/mobile</div>
            <div className="window-controls">
              <span className="min-btn" onClick={() => minimizeWindow('mobile')} style={{ background: '#febc2e'}}></span>
              <span className="max-btn" onClick={() => maximizeWindow('mobile')} style={{ background: '#28c840'}}></span>
              <span className="close-btn" onClick={() => closeWindow('mobile')}></span>
            </div>
          </div>
          <div className="window-content">
            <h3 style={{ marginTop: 0, color: 'var(--accent-color)' }}>Mobile builds and experiments</h3>
            <p style={{ lineHeight: '1.6', marginBottom: '18px' }}>
              This directory is a collection of mobile apps and experiments, with a mix of Android and iOS work focused on practical UI, persistence, mapping, and day-to-day usability.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {mobileList.map((quest, index) => (
                <div
                  key={quest.title}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '14px',
                    background: 'rgba(255,255,255,0.04)'
                  }}
                >
                  <div className="mobile-app-card">
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '18px',
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={quest.appLogo}
                        alt={`${quest.title} logo`}
                        style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                      />
                    </div>
                    <div className="mobile-app-content">
                      <div className="mobile-app-header">
                        <div className="mobile-app-title-row">
                          <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1rem' }}>
                            {quest.title}
                          </div>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {quest.techLogos.map((logo, logoIndex) => (
                              <img
                                key={`${quest.title}-logo-${logoIndex}`}
                                src={logo}
                                alt=""
                                aria-hidden="true"
                                style={{ height: '24px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }}
                              />
                            ))}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            padding: '4px 8px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '999px',
                            opacity: 0.85
                          }}
                        >
                          {quest.platform}
                        </div>
                      </div>
                      <div style={{ lineHeight: '1.6', opacity: 0.92 }}>
                        {quest.description}
                      </div>
                    </div>
                    <div className="mobile-app-shots">
                      {quest.screenshots.map((shot, shotIndex) => (
                        <div key={`${quest.title}-shot-${shotIndex}`} style={{ width: '108px' }}>
                          <div
                            style={{
                              width: '108px',
                              height: '216px',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              border: '1px solid var(--border-color)',
                              background: 'rgba(0,0,0,0.3)'
                            }}
                          >
                            <img
                              src={shot}
                              alt={`${quest.title} screenshot ${shotIndex + 1}`}
                              className="figure-image"
                              onClick={() => openFullscreenFigure(shot, `${quest.title} screenshot ${shotIndex + 1}`, `${quest.title} - screenshot ${shotIndex + 1}`)}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.72, marginTop: '6px' }}>
                            Screen { shotIndex + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {windows.games.isOpen && !windows.games.isMinimized && (
        <div className={`window ${windows.games.isMaximized ? 'maximized' : ''}`} 
          style={{ 
            top: windows.games.isMaximized ? 0 : windows.games.y, 
            left: windows.games.isMaximized ? 0 : windows.games.x, 
            width: windows.games.isMaximized ? '100vw' : '620px',
            height: windows.games.isMaximized ? 'calc(100dvh - 45px)' : '470px',
            zIndex: windows.games.zIndex, 
            borderRadius: windows.games.isMaximized ? '0' : '8px'
          }} onMouseDown={() => focusWindow('games')}>
          <div className="window-header" onMouseDown={(e) => !windows.games.isMaximized && startDrag(e, 'games')}>
            <div className="window-title">~/games</div>
            <div className="window-controls">
              <span className="min-btn" onClick={() => minimizeWindow('games')} style={{ background: '#febc2e'}}></span>
              <span className="max-btn" onClick={() => maximizeWindow('games')} style={{ background: '#28c840'}}></span>
              <span className="close-btn" onClick={() => closeWindow('games')}></span>
            </div>
          </div>
          <div className="window-content">
            <div
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '16px',
                background: 'rgba(255,255,255,0.04)',
                lineHeight: '1.6'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1, minWidth: '260px' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '18px',
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src="/images/lost-wood-logo.png"
                      alt="Lost Woods logo"
                      style={{ width: '72px', height: '72px', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ marginTop: 0, marginBottom: '8px', color: 'var(--accent-color)' }}>Lost Woods</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <img
                        src="/logos/react.svg"
                        alt="React"
                        style={{ height: '24px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }}
                      />
                      <img
                        src="/logos/typescript.svg"
                        alt="TypeScript"
                        style={{ height: '24px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }}
                      />
                      <img
                        src="/logos/vite.svg"
                        alt="Vite"
                        style={{ height: '24px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }}
                      />
                    </div>
                  </div>
                </div>
                <a
                  href="https://lost-woods.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '180px',
                    textDecoration: 'none',
                    background: 'var(--accent-color)',
                    color: 'var(--bg-color)',
                    fontWeight: 'bold',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}
                >
                  <span style={{ flex: 1, textAlign: 'center' }}>Open Demo</span>
                  <img
                    src="/logos/expand.png"
                    alt=""
                    aria-hidden="true"
                    style={{ width: '16px', height: '16px', marginLeft: '10px', objectFit: 'contain' }}
                  />
                </a>
              </div>
              <p style={{ marginTop: 0, marginBottom: '12px' }}>
                A browser-based horror game built with React, TypeScript, and Vite. You cross a haunted forest, collect five keys, unlock an abandoned building, and rescue a kidnapped baby before the ritual is completed.
              </p>
              <p style={{ marginBottom: 0 }}>
                Built around a custom canvas game loop, procedural forest generation, enemy AI, and layered audio, the project focuses on making the tension feel atmospheric.
              </p>
            </div>
            <div
              style={{
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '1px dashed var(--border-color)',
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'var(--accent-color)'
              }}
            >
              More games coming soon...
            </div>
          </div>
        </div>
      )}

      {windows.recycleBin.isOpen && !windows.recycleBin.isMinimized && (
        <div className={`window ${windows.recycleBin.isMaximized ? 'maximized' : ''}`} 
          style={{ 
            top: windows.recycleBin.isMaximized ? 0 : windows.recycleBin.y, 
            left: windows.recycleBin.isMaximized ? 0 : windows.recycleBin.x, 
            width: windows.recycleBin.isMaximized ? '100vw' : '420px',
            height: windows.recycleBin.isMaximized ? 'calc(100dvh - 45px)' : '300px',
            zIndex: windows.recycleBin.zIndex, 
            borderRadius: windows.recycleBin.isMaximized ? '0' : '8px'
          }} onMouseDown={() => focusWindow('recycleBin')}>
          <div className="window-header" onMouseDown={(e) => !windows.recycleBin.isMaximized && startDrag(e, 'recycleBin')}>
            <div className="window-title">Recycle</div>
            <div className="window-controls">
              <span className="min-btn" onClick={() => minimizeWindow('recycleBin')} style={{ background: '#febc2e'}}></span>
              <span className="max-btn" onClick={() => maximizeWindow('recycleBin')} style={{ background: '#28c840'}}></span>
              <span className="close-btn" onClick={() => closeWindow('recycleBin')}></span>
            </div>
          </div>
          <div className="window-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            <div style={{ fontSize: '3rem', textAlign: 'center' }}>♻</div>
            <p style={{ margin: 0, textAlign: 'center', fontSize: '1rem', lineHeight: '1.7' }}>
              None of my work is thrown away. It just gets recycled into more interesting and better projects.
            </p>
            <div
              style={{
                margin: '0 auto',
                padding: '8px 12px',
                border: '1px dashed var(--border-color)',
                borderRadius: '999px',
                fontSize: '0.85rem',
                opacity: 0.8
              }}
            >
              empty
            </div>
          </div>
        </div>
      )}

      {windows.terminal.isOpen && !windows.terminal.isMinimized && (
        <div className={`window ${windows.terminal.isMaximized ? 'maximized' : ''}`} 
          style={{ 
            top: windows.terminal.isMaximized ? 0 : windows.terminal.y, 
            left: windows.terminal.isMaximized ? 0 : windows.terminal.x, 
            width: windows.terminal.isMaximized ? '100vw' : '600px',
            height: windows.terminal.isMaximized ? 'calc(100dvh - 45px)' : '300px',
            zIndex: windows.terminal.zIndex, 
            borderRadius: windows.about.isMaximized ? '0' : '8px',
            background: '#000', 
            borderColor: '#333' 
          }} onMouseDown={() => focusWindow('terminal')}>
          <div className="window-header" style={{background: '#333'}} onMouseDown={(e) => !windows.terminal.isMaximized && startDrag(e, 'terminal')}>
            <div className="window-title" style={{color: '#fff'}}>bash</div>
            <div className="window-controls">
              <span className="min-btn" onClick={() => minimizeWindow('terminal')} style={{ background: '#febc2e'}}></span>
              <span className="max-btn" onClick={() => maximizeWindow('terminal')} style={{ background: '#28c840'}}></span>
              <span className="close-btn" onClick={() => closeWindow('terminal')}></span>
            </div>
          </div>
          <div className="window-content" style={{padding: '10px', background: '#000', color: '#0f0', fontFamily: 'monospace'}}>
            {termHistory.map((line, i) => <div key={i}>{line}</div>)}
            <div ref={termEndRef} />
            <div style={{display: 'flex'}}>
              <span style={{opacity: 0.7, marginRight: '5px'}}>user@compeng:~$</span>
              <input 
                className="cmd-input"
                autoFocus 
                value={termInput} 
                onChange={(e) => setTermInput(e.target.value)} 
                onKeyDown={handleTermKeyDown} 
              />
            </div>
          </div>
        </div>
      )}

      <div className="taskbar" 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 15px',
          height: '45px',
          overflow: 'hidden'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div className="start-btn" style={{ flexShrink: 0 }} onClick={() => setShowStartMenu(!showStartMenu)}>START</div>
          <div className="running-apps" style={{ display: 'flex', gap: '5px', overflow: 'hidden' }}>
            {Object.values(windows)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(win => win.isOpen && (
              <div 
                key={win.id}
                onClick={() => openWindow(win.id)}
                style={{
                  padding: '2px 10px',
                  background: win.isMinimized ? 'transparent' : 'rgba(255,255,255,0.1)',
                  border: `1px solid ${win.isMinimized ? 'transparent' : 'var(--border-color)'}`,
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: win.isMinimized ? 'gray' : 'var(--text-color)',
                  flexShrink: 0
                }}
              >
                {win.title}
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
            whiteSpace: 'nowrap'
          }}
        >
          {battery && (
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
                color: batteryColor
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
                  overflow: 'visible'
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
                    background: batteryColor
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
                    transition: 'width 0.2s ease'
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
                      pointerEvents: 'none'
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      style={{
                        display: 'block',
                        filter: `drop-shadow(0 0 1px ${batteryColor})`
                      }}
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
          )}
          <div className="clock"
            style={{ 
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}>{time}</div>
        </div>
      </div>

      {showStartMenu && (
        <div className="start-menu">
          <div className="menu-item" onClick={() => openWindow('about')}>About Me</div>
          <div className="menu-item" onClick={() => openWindow('projects')}>Projects</div>
          <div className="menu-item" onClick={() => openWindow('games')}>Games</div>
          <div className="menu-item" onClick={() => openWindow('mobile')}>Mobile</div>
          <div className="menu-item" onClick={() => openWindow('contact')}>Contact</div>
          <hr style={{width: '100%', borderColor: 'var(--border-color)', margin: '5px 0'}}/>
          <div className="menu-item danger" onClick={handleShutdown}><strong>⏻ Shut Down</strong></div>
        </div>
      )}

      {fullscreenFigure && (
        <div
          className="fullscreen-figure-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              closeFullscreenFigure('click');
            }
          }}
        >
          <div
            className="fullscreen-figure-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fullscreen-figure-shell">
              <button
                type="button"
                className="fullscreen-figure-close"
                aria-label="Close fullscreen figure"
                onClick={(e) => {
                  e.stopPropagation();
                  closeFullscreenFigure('click');
                }}
              >
                ×
              </button>
              <img
                src={fullscreenFigure.src}
                alt={fullscreenFigure.alt}
                className="fullscreen-figure-image"
              />
            </div>
            {fullscreenFigure.caption && (
              <div className="fullscreen-figure-caption">{fullscreenFigure.caption}</div>
            )}
            <div className="fullscreen-figure-hint">Click outside or press Esc to close</div>
          </div>
        </div>
      )}

      <div className="crt-overlay"></div>
    </div>
  );
}
