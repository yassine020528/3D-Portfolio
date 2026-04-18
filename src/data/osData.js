export const initialWindows = {
  about: { id: 'about', title: 'user_profile.txt', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 150, y: 70 },
  projects: { id: 'projects', title: '~/projects', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 200, y: 80 },
  contact: { id: 'contact', title: 'contact.exe', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 300, y: 110 },
  terminal: { id: 'terminal', title: 'bash', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 250, y: 250 },
  settings: { id: 'settings', title: 'System Preferences', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 200, y: 200 },
  mobile: { id: 'mobile', title: '~/mobile', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 300, y: 40 },
  vscode: { id: 'vscode', title: 'vscode.exe', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 400, y: 90 },
  flower: { id: 'flower', title: 'flower.mp4', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 250, y: 40 },
  recycle: { id: 'recycle', title: 'Recycle', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 380, y: 160 },
  games: { id: 'games', title: '~/games', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 240, y: 60 },
  flappyBird: { id: 'flappyBird', title: 'flappy_bird.exe', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 280, y: 100 },
  minesweeper: { id: 'minesweeper', title: 'minesweeper.exe', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, x: 320, y: 80 },
};

export const themeVars = {
  dark: { '--bg-color': '#0d1117', '--window-bg': '#161b22', '--text-color': '#c9d1d9', '--accent-color': '#58a6ff', '--header-bg': '#21262d', '--border-color': '#30363d', '--scan-color': 'rgba(88, 166, 255, 0.1)' },
  light: { '--bg-color': '#f0f2f5', '--window-bg': '#ffffff', '--text-color': '#1c1e21', '--accent-color': '#0066cc', '--header-bg': '#e4e6eb', '--border-color': '#ccc', '--scan-color': 'rgba(0, 0, 0, 0.1)' },
  matrix: { '--bg-color': '#000000', '--window-bg': '#001100', '--text-color': '#00ff41', '--accent-color': '#00ff41', '--header-bg': '#002200', '--border-color': '#00ff41', '--scan-color': 'rgba(0, 255, 65, 0.1)' },
  cyber: { '--bg-color': '#2b213a', '--window-bg': '#241b35', '--text-color': '#e9488b', '--accent-color': '#03a9f4', '--header-bg': '#1a1325', '--border-color': '#e9488b', '--scan-color': 'rgba(233, 72, 139, 0.1)' },
};

export const themeOptions = [
  { id: 'dark', label: 'Dark Mode', icon: '🌑' },
  { id: 'light', label: 'Light Mode', icon: '☀️' },
  { id: 'matrix', label: 'Hacker', icon: '📟' },
  { id: 'cyber', label: 'Cyberpunk', icon: '👾' },
];

export const desktopIcons = [
  { id: 'about', label: 'About', icon: '👤', className: 'icon-about' },
  { id: 'projects', label: 'Projects', icon: '📂', className: 'icon-projects' },
  { id: 'contact', label: 'Contact', icon: '✉️', className: 'icon-contact', iconStyle: { background: '#ff9800', color: '#ffffff' } },
  { id: 'terminal', label: 'Terminal', icon: '>_', className: 'icon-terminal', iconStyle: { background: '#333', color: '#0f0' } },
  { id: 'games', label: 'Games', icon: '🎮', className: 'icon-games', iconClassName: 'icon-img-games' },
  { id: 'settings', label: 'Settings', icon: '⚙️', className: 'icon-settings', usesVsCodeBackground: true },
  { id: 'mobile', label: 'Mobile', icon: '📱', className: 'icon-mobile' },
  { id: 'vscode', label: 'VS Code', className: 'icon-vscode', isImageIcon: true, usesVsCodeBackground: true, imageSrc: '/images/vscode.png', imageAlt: 'VS Code' },
  { id: 'flower', label: 'Flower', icon: '🌸', className: 'icon-flower', iconStyle: { background: 'linear-gradient(135deg, #ffd0dd 0%, #e9b8ff 100%)', color: '#5c2345' } },
  { id: 'recycle', label: 'Recycle', icon: '♻', className: 'icon-recycle', iconStyle: { background: '#8ecae6', color: '#10354a' } },
];

export const startMenuItems = [
  { id: 'about', label: 'About Me' },
  { id: 'projects', label: 'Projects' },
  { id: 'games', label: 'Games' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'flower', label: 'Flower' },
  { id: 'vscode', label: 'VS Code' },
  { id: 'contact', label: 'Contact' },
];

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Yassine020528', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yassine-abassi-b9ba721a6', external: true },
  { label: 'yassine020528@gmail.com', href: 'mailto:yassine020528@gmail.com', external: false },
];

export const aboutFigures = [
  {
    src: '/images/young_self.JPG',
    alt: 'Young Yassine',
    caption: 'Figure 1: Younger me coding this website :)',
  },
  {
    src: '/images/old_self.jpg',
    alt: 'Old Yassine',
    caption: 'Figure 2: Older me caffeinated up and ready to code more!',
  },
];

export const experienceEntries = [
  {
    version: '[v1.0] Software Quality Assurance Intern',
    date: 'May 2024 - Sep 2024',
    location: '@ UpToTest',
    accent: true,
    bullets: [
      'Designed, automated, and maintained e2e test cases',
      'Used Cypress with Cucumber within a full BDD workflow',
    ],
    logos: ['/logos/cypress.svg', '/logos/cucumber.svg'],
  },
  {
    version: '[v2.0] Private Tutor',
    date: 'Aug 2021 - Present',
    location: '@ Montreal, QC',
    accent: false,
    bullets: [
      'Provided academic support to college and university students.',
      'Helped learners with mathematics, physics, programming.',
    ],
  },
];

export const mobileApps = [
  {
    id: 1,
    title: 'Finance Tracker',
    platform: 'Android',
    tech: 'Kotlin, Jetpack Compose',
    appLogo: '/images/android-logo1.png',
    techLogos: ['/logos/kotlin.svg', '/logos/jetpack-compose.svg'],
    screenshots: ['/images/android1.png', '/images/android2.png'],
    description: 'A personal finance tracker built with Kotlin and Jetpack Compose around a clean MVVM flow. It focuses on fast expense logging, local Room persistence, and adaptive Material 3 layouts so the dashboard stays readable whether the user is checking balances quickly or digging into spending habits.',
  },
  {
    id: 2,
    title: 'Bluetooth Tracker',
    platform: 'Android',
    tech: 'Kotlin, Jetpack Compose',
    appLogo: '/images/android-logo2.png',
    techLogos: ['/logos/kotlin.svg', '/logos/jetpack-compose.svg'],
    screenshots: ['/images/android3.png', '/images/android4.png'],
    description: 'An Android app for tracking nearby Bluetooth devices. I combined asynchronous device scanning, Coroutines-based state updates, and a map-driven UI to make live location history easier to follow in real time offering live visualization for how to reach them with GPS trajectories.',
  },
  {
    id: 3,
    title: 'Running Tracker',
    platform: 'Android',
    tech: 'Kotlin, Jetpack Compose',
    appLogo: '/images/android-logo3.png',
    techLogos: ['/logos/kotlin.svg', '/logos/jetpack-compose.svg'],
    screenshots: ['/images/android5.jpg', '/images/android6.jpg'],
    description: 'A location-aware running and walking app designed around session flow, route awareness, and lightweight networking. It uses Retrofit and OkHttp for connected features, Compose Navigation for a smooth in-app structure, and a mobile-first UI that keeps the important stats front and center while moving.',
  },
  {
    id: 4,
    title: 'School Tracker',
    platform: 'iOS',
    tech: 'Swift',
    appLogo: '/images/ios-logo1.png',
    techLogos: ['/logos/swift.svg'],
    screenshots: ['/images/ios1.PNG', '/images/ios2.PNG'],
    description: 'An iOS school tracker built in SwiftUI to organize classes, deadlines, and weighted progress and grade calculations in one place. The app uses on-device persistence with UserDefaults and Codable JSON encoding, and it centers the experience around planning coursework visually in a calendar based approach instead of letting assignments pile up invisibly.',
  },
];

export const projects = [
  {
    id: 1,
    title: 'Embedded Obstacle Detection',
    tech: 'C++, ATmega164A, Assembly',
    description: 'Built an autonomous search system using the ATmega164A microcontroller. Implemented low-level I/O control, sensor data acquisition, and real-time decision logic in C++ based on strict timing specifications.',
    image: '/images/project1.JPG',
    logos: ['/logos/c++.svg', '/logos/assembly.svg'],
    caption: 'Held together by\n1% wires, and 99% faith.',
  },
  {
    id: 2,
    title: 'Real-Time Combat Game',
    tech: 'Angular, NestJS, WebSockets',
    description: 'Developed a real-time multiplayer game featuring seamless bidirectional communication. Designed event synchronization and matchmaking logic to ensure smooth gameplay under concurrent loads.',
    image: '/images/project2.png',
    logos: ['/logos/html.svg', '/logos/css.svg', '/logos/typescript.svg', '/logos/angular.svg', '/logos/nestjs.svg', '/logos/websocket.svg'],
    caption: 'Bug-free*\n(*allegedly).',
  },
  {
    id: 3,
    title: 'Multi-Robot Exploration System',
    tech: 'ROS2, Gazebo, Python, Docker',
    description: 'Designed an autonomous exploration system integrating AgileX Limo robots. Implemented navigation and inter-robot coordination in Python while containerizing software modules using Docker for portability.',
    image: '/images/project3.gif',
    logos: ['/logos/gazebo.svg', '/logos/python.svg', '/logos/docker.svg'],
    caption: "Haven't crashed\ninto each other... yet.",
  },
  {
    id: 4,
    title: 'Hydro-Quebec Weather Forecasting Platform',
    tech: 'Angular, .NET, GDAL, Leaflet, SQLite, RESTful API',
    description: 'Developed a full-stack weather visualization platform for real-time multi-model forecast. Implemented GDAL raster processing and Leaflet for interactive geospatial mapping, supported by a RESTful API and SQLite database.',
    image: '/images/project4.png',
    logos: ['/logos/angular.svg', '/logos/dotnet.svg', '/logos/gdal.svg', '/logos/leaflet.svg', '/logos/sqlite.svg', '/logos/restful-api.svg'],
    caption: "It's so cold,\neven the code froze.",
  },
  {
    id: 5,
    title: 'PolyHacks 2025 - WildGuard',
    tech: 'YOLOv8, OpenCV, Python, Flask, PyTorch, Ultralytics',
    description: 'Led the development of WildGuard, an AI-powered wildlife monitoring system that detects and classifies animals in real-time using YOLOv8. Engineered data pipelines and a Flask web interface for live video streaming and alerts.',
    image: '/images/hackathon.png',
    logos: ['/logos/python.svg', '/logos/pytorch.svg', '/logos/yolov8.svg'],
    caption: "Look Mom!\nIt's a cat!",
  },
  {
    id: 6,
    title: 'Personal Portfolio OS',
    tech: 'HTML5, CSS, JS, React, ThreeJS',
    description: 'Built this portfolio as an interactive 3D room and browser-based operating system, complete with draggable windows, terminal commands, theme switching, fullscreen media, procedural flower art, and built-in games like Flappy Bird and Minesweeper.',
    image: '/images/portfolio.png',
    logos: ['/logos/html.svg', '/logos/css.svg', '/logos/javascript.svg', '/logos/react.svg', '/logos/threejs.svg'],
    caption: 'Feels weird,\nweirdly familiar.',
  },
];

export const games = [
  {
    id: 1,
    title: 'Lost Woods',
    tech: 'React, TypeScript, Vite',
    appLogo: '/images/lost-woods-logo.png',
    figureImage: '/images/lost-woods1.png',
    techLogos: ['/logos/react.svg', '/logos/typescript.svg', '/logos/vite.svg'],
    description: 'A browser horror game where you cross a haunted forest, gather five keys, and break into an abandoned building before the ritual finishes.',
    details: 'I built it around a custom canvas loop, procedural forest generation, enemy AI, and layered audio.',
    caption: 'Who turned\nthe lights off?',
    figureCaptionText: 'Who turned the lights off?',
    actionLabel: 'Open Demo',
    actionHref: 'https://lost-woods.netlify.app',
  },
  {
    id: 2,
    title: 'Chess',
    tech: 'C++, Qt Widgets',
    appLogo: '/images/desktop-chess-logo.png',
    figureImage: '/images/desktop-chess1.png',
    techLogos: ['/logos/c++.svg', '/logos/qt.svg'],
    description: 'A desktop chess app with an interactive 8x8 board, SVG pieces, and click-to-move gameplay built in C++ with Qt Widgets.',
    details: 'The current version already validates standard piece movement, blocking paths, and illegal moves that leave your king exposed.',
    caption: 'Zero blunders.',
    figureCaptionText: 'Zero blunders.',
    actionLabel: 'GitHub Repo',
    actionHref: 'https://github.com/yassine020528/chess-cpp-qt',
  },
  {
    id: 3,
    title: 'Flappy Bird',
    tech: 'React, JavaScript, Canvas API',
    appLogo: '/flappy/sprites/yellowbird-midflap.png',
    figureImage: '/images/flappy-bird1.png',
    techLogos: ['/logos/react.svg', '/logos/javascript.svg'],
    description: 'A Flappy Bird game embedded directly inside the portfolio OS, with sprite-based rendering, score tracking and collision checks.',
    details: 'Built in React with a native Canvas API render loop, using custom game state, sprite assets, and lightweight audio without a separate game engine.',
    caption: 'Just one\nmore run.',
    figureCaptionText: 'Just one more run.',
    actionLabel: 'Launch Game',
    actionWindowId: 'flappyBird',
  },
  {
    id: 4,
    title: 'Minesweeper',
    tech: 'React, Canvas API',
    appLogo: '/images/minesweeper-logo.png',
    figureImage: '/images/minesweeper1.png',
    techLogos: ['/logos/react.svg', '/logos/javascript.svg'],
    description: 'Classic 9×9 Minesweeper with a guaranteed safe first click, right-click flagging, and a live timer.',
    details: 'Built with a flood-fill reveal algorithm, Fisher-Yates mine placement, and all original sprites rendered via the Canvas API.',
    caption: 'One click\nfrom disaster.',
    figureCaptionText: 'One click from disaster.',
    actionLabel: 'Launch Game',
    actionWindowId: 'minesweeper',
  },
];

export const codeFiles = [
  {
    id: 'main',
    label: 'main.txt',
    language: 'Markdown',
    lines: [
      '# please, take a break',
      '# grab a coffee and sit back',
      '# stack overflow can wait',
      '# breathe in. breathe out.',
      '# unclench your jaw',
      '# enjoy the stay',
    ],
  },
  {
    id: 'todo',
    label: 'todo-list.md',
    language: 'Markdown',
    lines: [
      'TODO: touch grass / urgent priority',
      'TODO: sleep / high priority',
      'TODO: refactor social life',
      'TODO: git push --force',
      'TODO: stop saying "one last fix"',
      'TODO: drink water / low priority',
    ],
  },
  {
    id: 'readme',
    label: 'README.md',
    language: 'Markdown',
    lines: [
      'v2.0.1',
      '- Reduced burnout by 12%',
      '- Improved back posture',
      '- Patched brain overheating',
      '- Optimized sanity, less hallucinations',
      '- Issue: may still open another terminal',
    ],
  },
];
