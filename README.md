# Yassine's 3D Interactive Portfolio

An immersive portfolio built as a navigable 3D room with a fully interactive desktop experience inside the computer screen.

Live site: [yassineabassi.com](https://yassineabassi.com)

![3D room demo](./demos/3d_demo.gif)

## Overview

This project combines a real-time 3D scene with a browser-based operating system to turn a personal portfolio into something playful and explorable.

Visitors can:

- Orbit around a stylized 3D room
- Interact with the room cat and desktop cat
- Click the computer to enter a desktop-style portfolio OS
- Open draggable windows
- Use a built-in terminal with commands that launch portfolio apps
- Chat with an AI portfolio assistant
- Launch built-in games including Flappy Bird and Minesweeper
- Switch between multiple desktop themes
- Toggle ambient and UI sound effects

![OS demo](./demos/os_demo.gif)

## Features

### 3D Scene

- Built with React Three Fiber, Drei, and Three.js
- Interactive camera movement with room and screen-focused views
- Custom lighting, shadows, and GLB models
- Clickable 3D avatar, computer screen, and cat interactions
- Cat interaction feedback with sound and temporary on-screen status messaging

### Portfolio OS

- Window manager with open, focus, drag, minimize, maximize, and close behavior
- Desktop icons, taskbar, start menu, and fullscreen media viewer
- About, projects, games, mobile, VS Code, flower, recycle, chatbot, terminal, and contact windows
- Playable Flappy Bird and Minesweeper apps integrated directly into the desktop
- Theme presets: `dark`, `light`, `matrix`, and `cyber`
- Live clock and browser battery status support when available
- Interactive desktop cat with sit, stand, and sleep states
- Terminal commands for `about`, `projects`, `contact`, `games`, `mobile`, `flower`, `vscode`, `chatbot`, `recycle`, `clear`, and `exit`

### Media and Interaction

- Ambient audio and interface sound effects
- Contact form powered by EmailJS
- Resume PDF and project/media assets served from `public/`
- Fullscreen project, mobile app, game, and about-image previews
- Responsive room controls for mouse, scroll, touch drag, and pinch zoom

### AI Portfolio Assistant

- Chatbot window embedded inside the desktop OS
- Gemini-powered Netlify Function at `/.netlify/functions/chatbot`
- Answers are grounded in `netlify/functions/chatbot-knowledge.txt`
- Conversation context is sent with each request, capped to recent messages
- Per-session daily usage count shown in the chatbot composer
- Prompt length limit, cooldown handling, and clear chat support in the UI
- CORS allowlist support for production, deploy previews, and local development
- Upstash Redis-backed minute and daily rate limiting with in-memory fallback for local development

### Flower System

- Built with `p5.js` embedded in React for a custom procedural art experience
- Uses an offscreen graphics buffer and post-process style remapping into `ASCII`, `DOTS`, and `PIXEL` render modes
- Supports uploaded images that can be transformed through the same visual pipeline
- Combines easing functions, trigonometry, manual 3D rotation, and perspective scaling to animate bloom, rotation, and wilting
- Shapes petals, leaves, and sepals mathematically with layered polar placement, sine-based deformation, and Bezier curves

## Tech Stack

- React 18
- Vite
- React Router
- Three.js
- @react-three/fiber
- @react-three/drei
- EmailJS
- Google Gen AI SDK
- Netlify Functions
- Upstash Redis and Ratelimit
- p5.js

## Project Structure

```text
netlify/
  functions/
    chatbot.js              Gemini assistant function with CORS and rate limiting
    chatbot-knowledge.txt   Grounding data for the portfolio assistant
src/
  components/
    shared/        Shared UI building blocks
  data/            Portfolio content, desktop icons, and project/game metadata
  features/
    flower/        Procedural flower renderer and controls
    os/            Desktop OS shell, state, and interaction logic
    os/windows/    App windows 
  hooks/           Reusable interaction and audio hooks
  lib/             Sound helpers
  pages/           Route-level pages
public/
  flappy/          Flappy Bird sprite and audio assets
  glb/             3D models
  images/          Project and gallery images
  logos/           Tech and app logos
  minesweeper/     Minesweeper board and sprite assets
  sounds/          Ambient and UI audio
demos/
  *.gif            README preview assets
```

## Environment Variables

The frontend can run without the chatbot, but the assistant function needs these variables when enabled:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | API key used by the Netlify chatbot function |
| `GEMINI_MODEL` | No | Gemini model override, defaults to `gemini-2.0-flash` |
| `ALLOWED_ORIGINS` | No | Comma-separated list of allowed browser origins |
| `UPSTASH_REDIS_REST_URL` | No | Enables shared rate limiting and daily usage counters |
| `UPSTASH_REDIS_REST_TOKEN` | No | Token for the Upstash Redis REST API |

The function also trusts Netlify's `URL` and `DEPLOY_PRIME_URL` origins when present, plus local Vite origins during development.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

In development, Vite registers a local middleware route for `/.netlify/functions/chatbot`, so the chatbot can call the Netlify function code without running a separate Netlify dev process.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build in `dist/`
- `npm run preview` serves the production build locally
- `npm run lint` runs ESLint

## Deployment

This project includes `netlify.toml` for Netlify deployment:

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

`public/_redirects` is included so client-side routes fall back to the React app on static hosting.

## Notes

- Some interactive features depend on browser capabilities such as audio autoplay permissions and the Battery Status API.
- The chatbot limits prompts to 800 characters, keeps up to 12 recent context messages, and returns up to 700 model output tokens.
- Without Upstash variables, chatbot limits still work in memory during a single function/runtime session.

## Flower Math and Rendering

The flower experience in `src/features/flower/` is one of the most custom parts of the project. It uses `p5.js` for the drawing loop and procedural geometry, while React manages UI state, audio, renderer selection, and uploaded images.

Core ideas used in the flower renderer:

- Easing functions such as `easeInOutCubic` and `easeOutQuart` control bloom timing, stem growth, and transition pacing.
- Trigonometric formulas based on `sin` and `cos` drive petal placement, ruffle motion, stem curvature, and subtle idle rotation.
- Manual 3D rotation is applied with custom X/Y/Z rotation math before projecting shapes onto the 2D canvas.
- Perspective scaling uses formulas like `focal / (focal + z)` so depth changes the apparent size of petals and inner flower structures.
- Petals are generated in layers using radial placement around `2 * PI`, then shaped with width envelopes such as `sin(t * PI)` and phase-shifted ripple terms.
- Leaves and sepals are drawn with Bezier curves for more organic silhouettes instead of relying on image assets.
