import { useCallback, useEffect, useRef } from 'react';
import WindowFrame from '../WindowFrame';

const COLS = 9;
const ROWS = 9;
const MINES = 10;
const CELL = 40;
const STATUS_H = 56;
const CW = COLS * CELL;
const CH = STATUS_H + ROWS * CELL;
const RESTART_BTN = {
  x: CW / 2 + 28,
  y: STATUS_H / 2 - 14,
  w: 78,
  h: 28,
};

function loadImg(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const SPRITES = {
  covered: loadImg('/minesweeper/default.png'),
  flag: loadImg('/minesweeper/flag.png'),
  mine: loadImg('/minesweeper/mine.png'),
  activemine: loadImg('/minesweeper/activemine.png'),
  empty: Array.from({ length: 9 }, (_, i) => loadImg(`/minesweeper/empty${i}.png`)),
};

function drawSprite(ctx, img, x, y) {
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, CELL, CELL);
  }
}

function createGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, neighbors: 0 }))
  );
}

function initState() {
  return { phase: 'idle', grid: createGrid(), minesLeft: MINES, startTime: null, endTime: null, hitCell: null };
}

function placeMines(grid, safeRow, safeCol) {
  const eligible = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue;
      eligible.push([r, c]);
    }
  }
  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }
  for (let i = 0; i < MINES; i++) {
    const [r, c] = eligible[i];
    grid[r][c].mine = true;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc].mine) count++;
        }
      }
      grid[r][c].neighbors = count;
    }
  }
}

function floodReveal(grid, r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  const cell = grid[r][c];
  if (cell.revealed || cell.flagged || cell.mine) return;
  cell.revealed = true;
  if (cell.neighbors === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) floodReveal(grid, r + dr, c + dc);
      }
    }
  }
}

function isWon(grid) {
  return grid.every((row) => row.every((cell) => cell.mine || cell.revealed));
}

function getElapsed(s) {
  if (!s.startTime) return 0;
  return Math.min(999, Math.floor(((s.endTime ?? Date.now()) - s.startTime) / 1000));
}

function drawSmiley(ctx, phase) {
  const cx = CW / 2;
  const cy = STATUS_H / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#ffff00';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (phase === 'lost') {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    for (const ox of [-6, 6]) {
      const [ex, ey] = [cx + ox, cy - 5];
      ctx.beginPath();
      ctx.moveTo(ex - 3, ey - 3); ctx.lineTo(ex + 3, ey + 3);
      ctx.moveTo(ex + 3, ey - 3); ctx.lineTo(ex - 3, ey + 3);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, cy + 10, 6, Math.PI, 0);
    ctx.stroke();
  } else if (phase === 'won') {
    ctx.fillStyle = '#000';
    ctx.fillRect(cx - 10, cy - 8, 8, 5);
    ctx.fillRect(cx + 2, cy - 8, 8, 5);
    ctx.fillRect(cx - 10, cy - 8, 20, 2);
    ctx.beginPath();
    ctx.arc(cx, cy + 3, 8, 0, Math.PI);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else {
    ctx.fillStyle = '#000';
    for (const ox of [-5, 5]) {
      ctx.beginPath();
      ctx.arc(cx + ox, cy - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, cy + 3, 7, 0, Math.PI);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function drawCounter(ctx, value, x) {
  ctx.fillStyle = '#000';
  ctx.fillRect(x, STATUS_H / 2 - 14, 44, 28);
  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#ff0000';
  ctx.textAlign = 'center';
  ctx.fillText(String(Math.max(0, value)).padStart(3, '0'), x + 22, STATUS_H / 2 + 9);
}

function drawRestartButton(ctx) {
  const { x, y, w, h } = RESTART_BTN;

  ctx.fillStyle = '#d6d6d6';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, w, 2);
  ctx.fillRect(x, y, 2, h);
  ctx.fillStyle = '#7b7b7b';
  ctx.fillRect(x, y + h - 2, w, 2);
  ctx.fillRect(x + w - 2, y, 2, h);

  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#111';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Restart', x + w / 2, y + h / 2 + 1);
}

function drawStatusBar(ctx, s) {
  ctx.fillStyle = '#bdbdbd';
  ctx.fillRect(0, 0, CW, STATUS_H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CW, 2);
  ctx.fillRect(0, 0, 2, STATUS_H);
  ctx.fillStyle = '#7b7b7b';
  ctx.fillRect(0, STATUS_H - 2, CW, 2);
  ctx.fillRect(CW - 2, 0, 2, STATUS_H);

  drawCounter(ctx, s.minesLeft, 8);
  drawCounter(ctx, getElapsed(s), CW - 52);
  drawSmiley(ctx, s.phase);
  drawRestartButton(ctx);
}

function drawGrid(ctx, s) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = s.grid[r][c];
      const x = c * CELL;
      const y = STATUS_H + r * CELL;
      if (!cell.revealed) {
        drawSprite(ctx, cell.flagged ? SPRITES.flag : SPRITES.covered, x, y);
      } else if (cell.mine) {
        const isHit = s.hitCell?.[0] === r && s.hitCell?.[1] === c;
        drawSprite(ctx, isHit ? SPRITES.activemine : SPRITES.mine, x, y);
      } else {
        drawSprite(ctx, SPRITES.empty[cell.neighbors], x, y);
      }
    }
  }
}

function drawWinMessage(ctx) {
  const boxW = 220;
  const boxH = 72;
  const x = (CW - boxW) / 2;
  const y = STATUS_H + (ROWS * CELL - boxH) / 2;

  ctx.fillStyle = 'rgba(248, 248, 210, 0.96)';
  ctx.fillRect(x, y, boxW, boxH);
  ctx.strokeStyle = '#4e7d2b';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, boxW, boxH);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#1f3d11';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('You Win!', CW / 2, y + 28);
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('Hit Restart to play again', CW / 2, y + 50);
}

export default function MinesweeperWindow({ windowState, controls }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(initState());
  const isActive = windowState.isOpen && !windowState.isMinimized;

  useEffect(() => {
    if (!windowState.isOpen) stateRef.current = initState();
  }, [windowState.isOpen]);

  const restart = useCallback(() => { stateRef.current = initState(); }, []);

  const isInRestartButton = useCallback((px, py) => (
    px >= RESTART_BTN.x &&
    px <= RESTART_BTN.x + RESTART_BTN.w &&
    py >= RESTART_BTN.y &&
    py <= RESTART_BTN.y + RESTART_BTN.h
  ), []);

  const getCellCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (CW / rect.width);
    const py = (e.clientY - rect.top) * (CH / rect.height);
    if (py < STATUS_H) return { px, py, row: -1, col: -1 };
    const col = Math.floor(px / CELL);
    const row = Math.floor((py - STATUS_H) / CELL);
    return { px, py, row, col };
  }, []);

  const handleClick = useCallback((e) => {
    const coords = getCellCoords(e);
    if (!coords) return;
    const { px, py, row, col } = coords;

    if (Math.hypot(px - CW / 2, py - STATUS_H / 2) <= 18 || isInRestartButton(px, py)) { restart(); return; }
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;

    const s = stateRef.current;
    if (s.phase === 'won' || s.phase === 'lost') return;
    const cell = s.grid[row][col];
    if (cell.revealed || cell.flagged) return;

    if (s.phase === 'idle') {
      placeMines(s.grid, row, col);
      s.phase = 'playing';
      s.startTime = Date.now();
    }

    if (cell.mine) {
      s.hitCell = [row, col];
      s.phase = 'lost';
      s.endTime = Date.now();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (s.grid[r][c].mine) s.grid[r][c].revealed = true;
        }
      }
    } else {
      floodReveal(s.grid, row, col);
      if (isWon(s.grid)) { s.phase = 'won'; s.endTime = Date.now(); }
    }
  }, [getCellCoords, isInRestartButton, restart]);

  const handleRightClick = useCallback((e) => {
    e.preventDefault();
    const coords = getCellCoords(e);
    if (!coords) return;
    const { row, col } = coords;
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;

    const s = stateRef.current;
    if (s.phase === 'won' || s.phase === 'lost') return;
    const cell = s.grid[row][col];
    if (cell.revealed) return;
    if (!cell.flagged && s.minesLeft === 0) return;

    cell.flagged = !cell.flagged;
    s.minesLeft += cell.flagged ? -1 : 1;
  }, [getCellCoords]);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;

    const loop = () => {
      const s = stateRef.current;
      drawStatusBar(ctx, s);
      drawGrid(ctx, s);
      if (s.phase === 'won') drawWinMessage(ctx);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isActive]);

  return (
    <WindowFrame
      windowId="minesweeper"
      title="minesweeper.exe"
      windowState={windowState}
      className="minesweeper-window"
      contentClassName="minesweeper-window-content"
      width={`${CW + 2}px`}
      height={`${CH + 40}px`}
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      contentStyle={{ padding: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', background: '#bdbdbd' }}
      preserveOnMinimize
    >
      <div className="game-canvas-shell minesweeper-canvas-shell">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          onClick={handleClick}
          onContextMenu={handleRightClick}
          className="game-canvas minesweeper-canvas"
          style={{ cursor: 'default' }}
        />
      </div>
    </WindowFrame>
  );
}
