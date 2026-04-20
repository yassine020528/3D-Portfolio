const osStyles = `
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

  .os-container {
    --taskbar-height: 45px;
    background-color: var(--bg-color);
    color: var(--text-color);
    user-select: none;
  }

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
  .icon-vscode { position: absolute; top: calc(var(--desktop-pad) + (var(--desktop-step) * 2)); left: calc(var(--desktop-pad) + var(--desktop-step)); }
  .icon-flower { position: absolute; top: var(--desktop-pad); right: calc(var(--desktop-pad) + var(--desktop-step)); }
  .icon-recycle { position: absolute; top: var(--desktop-pad); right: var(--desktop-pad); }
  .icon-settings { position: absolute; left: var(--desktop-pad); bottom: var(--desktop-pad); }
  .vscode-icon { width: 26px; height: 26px; object-fit: contain; display: block; }

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
    height: auto; min-height: var(--taskbar-height);
    background: var(--header-bg); border-top: 1px solid var(--border-color);
    display: flex; align-items: center; padding: 0 15px;
    padding-bottom: env(safe-area-inset-bottom);
    justify-content: space-between; z-index: 1000;
  }

  .cat-shell {
    position: absolute;
    right: clamp(22px, 4vw, 48px);
    bottom: calc(var(--taskbar-height) + env(safe-area-inset-bottom));
    z-index: 1500;
  }

  .cat {
    position: relative;
    display: block;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    background-repeat: no-repeat;
    cursor: pointer;
    transform-origin: bottom right;
    transform: scale(3);
    filter: drop-shadow(0 6px 10px rgba(0,0,0,0.28));
    z-index: 1;
    border: none;
    padding: 0;
    line-height: 0;
    background-color: transparent;
  }
  .cat.open { filter: drop-shadow(0 0 0 rgba(0,0,0,0)) drop-shadow(0 10px 16px rgba(0,0,0,0.32)); }
  .cat:focus-visible { outline: 2px solid var(--accent-color); outline-offset: 4px; }

  .cat-menu {
    position: absolute;
    right: 0;
    bottom: calc(100% + 40px);
    width: 190px;
    background: color-mix(in srgb, var(--window-bg) 92%, #000000 8%);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 18px 40px rgba(0,0,0,0.32);
    display: flex;
    flex-direction: column;
    gap: 6px;
    animation: fadeIn 0.16s ease;
  }

  .cat-menu-title {
    padding: 2px 4px 8px;
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent-color);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 2px;
  }

  .cat-menu-item {
    width: 100%;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    color: var(--text-color);
    text-align: left;
    padding: 10px 12px;
    font-size: 0.88rem;
  }
  .cat-menu-item:hover,
  .cat-menu-item:focus-visible {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.08);
    outline: none;
  }

  .start-btn { background: var(--accent-color); color: var(--bg-color); padding: 5px 15px; border-radius: 4px; font-weight: bold; margin-bottom: env(safe-area-inset-bottom); }
  .clock { margin-bottom: env(safe-area-inset-bottom); }

  .start-menu { position: absolute; bottom: 60px; left: 10px; width: 200px; background: var(--window-bg); border: 1px solid var(--border-color); border-radius: 5px; padding: 10px; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 2000; margin-bottom: env(safe-area-inset-bottom); }
  .menu-item { padding: 8px; border-radius: 3px; }
  .menu-item:hover { background: rgba(255,255,255,0.1); }
  .menu-item.danger { color: #ff5f56; }
  .theme-btn { display: block; width: 100%; padding: 10px; margin-bottom: 10px; background: var(--header-bg); border: 1px solid var(--border-color); color: var(--text-color); text-align: left; }
  .theme-btn:hover { border-color: var(--accent-color); }
  input.cmd-input { background: transparent; border: none; color: #0f0; font-family: monospace; flex-grow: 1; outline: none; }

  .contact-form input, .contact-form textarea {
    width: 100%; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color);
    color: var(--text-color); padding: 8px; margin-bottom: 10px; border-radius: 4px;
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
  .project-header:hover { background: rgba(255,255,255,0.05); }
  .code-window-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #1e1e1e;
    color: #d4d4d4;
    font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
    overflow: hidden;
  }
  .code-topbar {
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    background: #181818;
    border-bottom: 1px solid #2a2a2a;
    color: #c5c5c5;
    font-size: 0.82rem;
    flex-shrink: 0;
  }
  .code-body {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
  }
  .code-activitybar {
    width: 48px;
    background: #181818;
    border-right: 1px solid #2a2a2a;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    color: #858585;
    flex-shrink: 0;
  }
  .code-activity-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    cursor: pointer;
    user-select: none;
    opacity: 0.72;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
  .code-activity-item:hover { opacity: 0.95; transform: translateY(-1px); }
  .code-activitybar .active { color: #ffffff; opacity: 1; position: relative; }
  .code-activitybar .active::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 22px;
    background: #ffffff;
    border-radius: 999px;
    display: block;
  }
  .code-sidebar {
    width: 220px;
    background: #252526;
    border-right: 1px solid #2a2a2a;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .code-sidebar-header {
    padding: 12px 14px 8px;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #bbbbbb;
  }
  .code-search-input {
    width: calc(100% - 20px);
    margin: 0 10px 10px;
    padding: 8px 10px;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    background: #1f1f1f;
    color: #d4d4d4;
    font-family: inherit;
    font-size: 0.82rem;
  }
  .code-sidebar-note {
    padding: 0 14px 12px;
    font-size: 0.82rem;
    line-height: 1.6;
    color: #c9c9c9;
  }
  .code-sidebar-muted { color: #8a8a8a; }
  .code-filetree { padding: 0 10px 12px; font-size: 0.82rem; }
  .code-filetree-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 6px;
    border-radius: 4px;
    color: #d4d4d4;
  }
  .code-filetree-row.active { background: #37373d; }
  .code-main { display: flex; flex: 1; min-width: 0; min-height: 0; background: #1e1e1e; }
  .code-editor-wrap { display: flex; flex-direction: column; flex: 1; min-width: 0; min-height: 0; }
  .code-tabs { display: flex; align-items: stretch; background: #252526; border-bottom: 1px solid #2a2a2a; overflow-x: hidden; flex-shrink: 0; }
  .code-tab { padding: 10px 14px; font-size: 0.82rem; color: #9d9d9d; border-right: 1px solid #2a2a2a; white-space: nowrap; cursor: pointer; }
  .code-tab.active { background: #1e1e1e; color: #ffffff; }
  .code-editor { display: flex; flex: 1; min-width: 0; min-height: 0; overflow: hidden; }
  .code-editor-scroll { display: flex; flex: 1; min-width: 0; min-height: 0; overflow-y: auto; overflow-x: hidden; }
  .code-gutter {
    width: 52px;
    padding: 16px 8px 16px 0;
    background: #1e1e1e;
    color: #858585;
    text-align: right;
    font-size: 0.84rem;
    flex-shrink: 0;
    user-select: none;
  }
  .code-content { flex: 1; padding: 16px 18px 16px 10px; min-width: 0; overflow: hidden; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 0.9rem; }
  .code-row { min-height: 28px; display: flex; align-items: flex-start; line-height: 28px; }
  .code-gutter .code-row { justify-content: flex-end; }
  .code-statusbar { min-height: 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 10px; background: #007acc; color: #ffffff; font-size: 0.76rem; }
  .code-statusbar-section { display: flex; align-items: center; gap: 12px; white-space: nowrap; }
  .code-plain { color: #d4d4d4; }
  .code-comment { color: #6a9955; }
  .code-keyword { color: #569cd6; }
  .code-number { color: #b5cea8; }
  .figure-image { cursor: zoom-in; transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .figure-image:hover { transform: scale(1.02); box-shadow: 0 10px 24px rgba(0,0,0,0.28); }
  .fullscreen-figure-overlay { position: fixed; inset: 0; z-index: 12000; background: rgba(0,0,0,0.88); display: flex; align-items: center; justify-content: center; padding: 24px; }
  .fullscreen-figure-modal { position: relative; max-height: 92dvh; display: flex; flex-direction: column; align-items: center; gap: 14px; width: auto; max-width: 92vw; }
  .fullscreen-figure-shell { position: relative; display: inline-flex; align-items: center; justify-content: center; max-width: 92vw; }
  .fullscreen-figure-image { width: auto; max-width: 100%; height: clamp(320px, 72vh, 720px); object-fit: contain; border-radius: 8px; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 20px 50px rgba(0,0,0,0.45); background: rgba(0,0,0,0.35); }
  .fullscreen-figure-caption { text-align: center; font-size: 0.9rem; color: #f5f5f5; opacity: 0.9; }
  .fullscreen-figure-close { position: absolute; top: -8px; right: -8px; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; background: rgba(20,20,20,0.92); color: #fff; font-size: 1.4rem; line-height: 1; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .fullscreen-figure-hint { font-size: 0.8rem; color: rgba(255,255,255,0.7); }
  .flower-window-content {
    min-height: 360px;
    height: 100%;
  }
  .flappy-window {
    width: min(422px, calc(100vw - 24px));
  }
  .flappy-window-content {
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  .minesweeper-window-content {
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  .game-canvas-shell {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    min-width: 0;
  }
  .game-canvas {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .flappy-canvas-shell {
    background: #4ec0ca;
  }
  .minesweeper-canvas-shell {
    background: #bdbdbd;
  }
  .flower-window-content .app-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: inherit;
    background:
      radial-gradient(circle at top, rgba(255,214,229,0.08), transparent 35%),
      linear-gradient(180deg, #050505 0%, #000000 100%);
    overflow: hidden;
  }
  .flower-window-content canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
  .flower-loader {
    position: absolute;
    inset: 0;
    z-index: 4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #000000;
    transition: opacity 0.8s ease;
  }
  .flower-loader.fade { opacity: 0; pointer-events: none; }
  .flower-loader-title,
  .flower-loader-pct,
  .flower-window-content .label-small,
  .flower-window-content .text-btn,
  .flower-start-btn {
    font-family: "Courier New", monospace;
  }
  .flower-loader-title {
    color: #ffffff;
    font-size: 14px;
    letter-spacing: 0.35em;
    opacity: 0.72;
    margin-bottom: 24px;
  }
  .flower-loader-bar-bg {
    width: 180px;
    height: 3px;
    background: #1a1a1a;
    border-radius: 999px;
    overflow: hidden;
  }
  .flower-loader-bar-fill {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #cf8099, #f3c8ff);
    transition: width 0.15s ease;
  }
  .flower-loader-pct {
    margin-top: 10px;
    color: rgba(255,255,255,0.38);
    font-size: 11px;
  }
  .flower-window-content .enter-overlay,
  .flower-window-content .ui-overlay {
    position: absolute;
    inset: 0;
  }
  .flower-window-content .enter-overlay {
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.45s ease;
    background: linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.3));
  }
  .flower-window-content .enter-overlay.visible { opacity: 1; pointer-events: auto; }
  .flower-start-btn {
    border: 1px solid rgba(255,255,255,0.22);
    background: rgba(255,255,255,0.04);
    color: #ffffff;
    padding: 12px 30px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.8rem;
    backdrop-filter: blur(8px);
  }
  .flower-start-btn:hover {
    background: rgba(255,255,255,0.92);
    color: #060606;
    border-color: rgba(255,255,255,0.92);
  }
  .flower-window-content .ui-overlay {
    z-index: 6;
    display: flex;
    align-items: flex-start;
    padding: 18px;
    pointer-events: none;
    transition: opacity 0.6s ease, visibility 0.6s ease;
  }
  .flower-window-content .ui-overlay.hidden { opacity: 0; visibility: hidden; }
  .flower-controls-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    max-width: 140px;
    pointer-events: auto;
  }
  .flower-window-content .mode-group {
    width: 100%;
    padding: 8px 0;
    border: none;
    border-radius: 0;
    background: transparent;
    backdrop-filter: none;
  }
  .flower-window-content .label-small {
    margin-bottom: 6px;
    color: rgba(255,255,255,0.38);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .flower-window-content .text-btn {
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.58);
    padding: 2px 0;
    border-radius: 0;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: color 0.2s ease, opacity 0.2s ease;
    cursor: pointer;
  }
  .flower-window-content .text-btn:hover,
  .flower-window-content .text-btn:focus-visible,
  .flower-window-content .text-btn.active {
    color: #ffffff;
    opacity: 1;
    outline: none;
  }
  .flower-audio-credit {
    position: absolute;
    left: 18px;
    bottom: 18px;
    color: rgba(255,255,255,0.58);
    font-family: "Courier New", monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    pointer-events: none;
  }
  .flower-hidden-input { display: none; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 830px) {
    .desktop {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-content: start;
      justify-items: stretch;
      gap: 12px 10px;
      padding: 16px 12px;
      overflow-y: auto;
    }
    .desktop .icon {
      position: static !important;
      inset: auto !important;
      left: auto !important;
      right: auto !important;
      top: auto !important;
      bottom: auto !important;
      width: 100%;
      max-width: none;
      min-height: 88px;
      justify-content: flex-start;
    }
    .desktop .icon-about { grid-column: 1; grid-row: 1; }
    .desktop .icon-projects { grid-column: 1; grid-row: 2; }
    .desktop .icon-contact { grid-column: 1; grid-row: 3; }
    .desktop .icon-terminal { grid-column: 1; grid-row: 4; }
    .desktop .icon-games { grid-column: 2; grid-row: 1; }
    .desktop .icon-mobile { grid-column: 2; grid-row: 2; }
    .desktop .icon-vscode { grid-column: 2; grid-row: 3; }
    .desktop .icon-settings {
      position: absolute !important;
      left: 12px !important;
      bottom: calc(16px + env(safe-area-inset-bottom)) !important;
      width: calc((100% - 54px) / 4);
      grid-column: auto;
      grid-row: auto;
    }
    .desktop .icon-flower { grid-column: 3; grid-row: 1; }
    .desktop .icon-recycle { grid-column: 4; grid-row: 1; }
    .window:not(.maximized) {
      width: 95vw !important;
      max-height: calc(100dvh - 85px - env(safe-area-inset-bottom)) !important;
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
    .flower-window:not(.maximized) {
      height: 460px !important;
      max-height: calc(100dvh - 120px - env(safe-area-inset-bottom)) !important;
    }
    .flappy-window:not(.maximized) {
      width: min(422px, 100vw) !important;
    }
    .minesweeper-window:not(.maximized) {
      width: min(362px, calc(100vw - 24px)) !important;
    }
    .flappy-window.maximized .game-canvas-shell {
      --mobile-game-bottom-pad: calc(12px + env(safe-area-inset-bottom));
      padding: 0 0 var(--mobile-game-bottom-pad) 0;
      align-items: flex-start;
      background: #ded895;
    }
    .minesweeper-window.maximized .game-canvas-shell {
      padding:
        calc(12px + env(safe-area-inset-top))
        0
        calc(12px + env(safe-area-inset-bottom))
        0;
    }
    .flappy-window.maximized .game-canvas,
    .minesweeper-window.maximized .game-canvas {
      width: 100%;
      height: auto;
      max-width: none;
      max-height: 100%;
    }
    .window-content { padding: 15px; }
    .project-detail-layout { flex-direction: column; }
    .project-image-container { margin-bottom: 15px; }
    .code-window-shell { font-size: 0.86rem; }
    .code-topbar { height: 30px; padding: 0 10px; font-size: 0.72rem; }
    .code-body { display: block; }
    .code-activitybar, .code-sidebar { display: none; }
    .code-main, .code-editor-wrap, .code-editor { min-height: 0; height: 300px; }
    .code-editor-scroll { height: 100%; }
    .code-tabs { overflow-x: auto; flex-wrap: nowrap; }
    .code-tab { padding: 9px 10px; font-size: 0.74rem; }
    .code-gutter { width: 40px; padding: 12px 6px 12px 0; font-size: 0.72rem; }
    .code-content { padding: 12px 12px 12px 8px; font-size: 0.76rem; }
    .code-row { min-height: 24px; line-height: 24px; }
    .code-statusbar { min-height: 34px; padding: 6px 8px; font-size: 0.68rem; flex-wrap: wrap; justify-content: center; }
    .code-statusbar-section { gap: 8px; justify-content: center; flex-wrap: wrap; width: 100%; }
    .code-topbar { justify-content: space-between; }
    .mobile-app-card { flex-wrap: wrap; }
    .mobile-app-content { width: 100%; }
    .mobile-app-shots { width: 100%; justify-content: center; flex-wrap: wrap; }
    .fullscreen-figure-overlay { padding: 16px; }
    .fullscreen-figure-modal { max-width: 100%; }
    .fullscreen-figure-close { top: -4px; right: 0; }
    .fullscreen-figure-image { height: clamp(240px, 58vh, 520px); }
    .cat-shell {
      right: clamp(16px, 4vw, 32px);
      bottom: calc(var(--taskbar-height) + env(safe-area-inset-bottom));
    }
    .cat {
      transform: scale(3);
    }
    .cat-menu {
      width: min(180px, calc(100vw - 24px));
      bottom: calc(100% + 32px);
    }
  }

  @media (max-width: 980px) {
    .code-body { flex-direction: column; }
    .code-activitybar { width: 100%; height: 38px; flex-direction: row; justify-content: center; gap: 18px; padding: 0 10px; border-right: none; border-bottom: 1px solid #2a2a2a; }
    .code-activitybar .active::before { left: 50%; top: auto; bottom: -10px; transform: translateX(-50%); width: 22px; height: 2px; }
    .code-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #2a2a2a; }
    .mobile-app-card { flex-wrap: wrap; }
    .mobile-app-content { min-width: 100%; }
    .mobile-app-shots { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
  }

  @media (min-width: 831px) {
    .flappy-window.maximized .game-canvas-shell,
    .minesweeper-window.maximized .game-canvas-shell {
      padding: 0 clamp(20px, 4vw, 48px);
    }
    .flappy-window.maximized .game-canvas,
    .minesweeper-window.maximized .game-canvas {
      width: auto;
      height: 100%;
      max-width: 100%;
      max-height: none;
    }
  }
`;

export default osStyles;
