# Yassine's 3D Interactive Portfolio

An immersive portfolio built as a navigable 3D room with a fully interactive desktop experience inside the computer screen.

Live site: [yassineabassi.com](https://yassineabassi.com)

![3D room demo](./demos/3d_demo.gif)

## Overview

This project combines a real-time 3D scene with a browser-based operating system to turn a personal portfolio into something playful and explorable.

Visitors can:

- Orbit around a stylized 3D room
- Click the computer to enter a desktop-style portfolio OS
- Open draggable windows
- Use a built-in terminal with command
- Switch between multiple desktop themes
- Toggle ambient and UI sound effects

![OS demo](./demos/os_demo.gif)

## Features

### 3D Scene

- Built with React Three Fiber, Drei, and Three.js
- Interactive camera movement with room and screen-focused views
- Custom lighting, shadows, and GLB models
- Clickable 3D avatar and computer screen interactions

### Portfolio OS

- Window manager with open, focus, drag, minimize, maximize, and close behavior
- Desktop icons, taskbar, start menu, and fullscreen media viewer
- About, projects, games, mobile, VS Code, flower, recycle, terminal, and contact windows
- Theme presets: `dark`, `light`, `matrix`, and `cyber`
- Live clock and browser battery status support when available

### Media and Interaction

- Ambient audio and interface sound effects
- Contact form powered by EmailJS
- Resume PDF and project/media assets served from `public/`

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
- p5.js

## Project Structure

```text
src/
  components/      Shared UI building blocks
  data/            Portfolio content and OS configuration
  features/        Desktop OS and flower experience
  hooks/           Reusable interaction and audio hooks
  lib/             Sound helpers
  pages/           Route-level pages
public/
  glb/             3D models
  images/          Project and gallery images
  logos/           Tech and app logos
  sounds/          Ambient and UI audio
demos/
  *.gif            README preview assets
```

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

## Notes

- The project includes a Netlify-style `public/_redirects` file for SPA routing support on static hosting.
- Some interactive features depend on browser capabilities such as audio autoplay permissions and the Battery Status API.

## Flower Math and Rendering

The flower experience in `src/features/flower/` is one of the most custom parts of the project. It uses `p5.js` for the drawing loop and procedural geometry, while React manages UI state, audio, renderer selection, and uploaded images.

Core ideas used in the flower renderer:

- Easing functions such as `easeInOutCubic` and `easeOutQuart` control bloom timing, stem growth, and transition pacing.
- Trigonometric formulas based on `sin` and `cos` drive petal placement, ruffle motion, stem curvature, and subtle idle rotation.
- Manual 3D rotation is applied with custom X/Y/Z rotation math before projecting shapes onto the 2D canvas.
- Perspective scaling uses formulas like `focal / (focal + z)` so depth changes the apparent size of petals and inner flower structures.
- Petals are generated in layers using radial placement around `2 * PI`, then shaped with width envelopes such as `sin(t * PI)` and phase-shifted ripple terms.
- Leaves and sepals are drawn with Bezier curves for more organic silhouettes instead of relying on image assets.
