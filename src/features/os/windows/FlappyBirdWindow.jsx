import { useCallback, useEffect, useRef } from 'react';
import WindowFrame from '../WindowFrame';

const W = 420;
const H = 480;
const BIRD_X = 80;
const BIRD_W = 50;
const BIRD_H = 35;
const GRAVITY = 0.38;
const JUMP_VY = -8;
const PIPE_W = 62;
const PIPE_GAP = 150;
const PIPE_SPEED = 2.8;
const PIPE_INTERVAL = 170;
const BASE_H = 70;
const DIGIT_W = 26;
const DIGIT_H = 38;
const SMALL_DIGIT_W = 18;
const SMALL_DIGIT_H = 26;

function loadImg(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const SPRITES = {
  bg: loadImg('/flappy/sprites/background-day.png'),
  pipe: loadImg('/flappy/sprites/pipe-green.png'),
  base: loadImg('/flappy/sprites/base.png'),
  birdFrames: [
    loadImg('/flappy/sprites/yellowbird-upflap.png'),
    loadImg('/flappy/sprites/yellowbird-midflap.png'),
    loadImg('/flappy/sprites/yellowbird-downflap.png'),
  ],
  message: loadImg('/flappy/sprites/message.png'),
  gameover: loadImg('/flappy/sprites/gameover.png'),
  digits: Array.from({ length: 10 }, (_, i) => loadImg(`/flappy/sprites/${i}.png`)),
};

const SOUNDS = {
  wing: '/flappy/audio/wing.wav',
  point: '/flappy/audio/point.wav',
  hit: '/flappy/audio/hit.wav',
};

function playSound(src) {
  try {
    new Audio(src).play().catch(() => {});
  } catch {}
}

function initState() {
  return {
    phase: 'idle',
    bird: { y: (H - BASE_H) / 2, vy: 0, frame: 1, animTick: 0 },
    pipes: [],
    score: 0,
    frame: 0,
    baseX: 0,
    deadAt: null,
  };
}

function drawImg(ctx, img, x, y, w, h) {
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
    return true;
  }
  return false;
}

function drawDigitRow(ctx, score, centerX, y, dw, dh) {
  const digits = String(score).split('').map(Number);
  const totalW = digits.length * (dw + 2) - 2;
  let x = Math.round(centerX - totalW / 2);
  for (const d of digits) {
    drawImg(ctx, SPRITES.digits[d], x, y, dw, dh);
    x += dw + 2;
  }
}

function drawTopPipe(ctx, pipe, gapY) {
  ctx.save();
  ctx.translate(pipe.x + PIPE_W / 2, gapY / 2);
  ctx.rotate(Math.PI);
  drawImg(ctx, SPRITES.pipe, -PIPE_W / 2, -gapY / 2, PIPE_W, gapY);
  ctx.restore();
}

function drawLabel(ctx, text, x, y) {
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 3;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

export default function FlappyBirdWindow({ windowState, controls }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(initState());
  const highScoreRef = useRef(0);
  const isActive = windowState.isOpen && !windowState.isMinimized;

  // Reset everything when the window is closed
  useEffect(() => {
    if (!windowState.isOpen) {
      highScoreRef.current = 0;
      stateRef.current = initState();
    }
  }, [windowState.isOpen]);

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === 'idle') {
      s.phase = 'playing';
      s.bird.vy = JUMP_VY;
      playSound(SOUNDS.wing);
    } else if (s.phase === 'playing') {
      s.bird.vy = JUMP_VY;
      playSound(SOUNDS.wing);
    } else if (s.phase === 'dead') {
      if (s.deadAt !== null && Date.now() - s.deadAt < 1000) {
        return;
      }
      stateRef.current = initState();
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isActive, flap]);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;
    const playableH = H - BASE_H;

    const die = (s) => {
      playSound(SOUNDS.hit);
      s.phase = 'dead';
      s.deadAt = Date.now();
      if (s.score > highScoreRef.current) {
        highScoreRef.current = s.score;
      }
    };

    const loop = () => {
      const s = stateRef.current;

      if (s.phase === 'playing') {
        s.bird.vy += GRAVITY;
        s.bird.y += s.bird.vy;
        s.frame++;
        s.bird.animTick++;

        if (s.bird.animTick % 6 === 0) {
          s.bird.frame = (s.bird.frame + 1) % 3;
        }

        const baseImgW = SPRITES.base.naturalWidth || 336;
        s.baseX -= PIPE_SPEED;
        if (s.baseX < -baseImgW) s.baseX = 0;

        if (s.frame % PIPE_INTERVAL === 0) {
          const gapY = 60 + Math.random() * (playableH - PIPE_GAP - 80);
          s.pipes.push({ x: W, gapY, passed: false });
        }

        for (const p of s.pipes) {
          p.x -= PIPE_SPEED;
          if (!p.passed && p.x + PIPE_W < BIRD_X) {
            p.passed = true;
            s.score++;
            playSound(SOUNDS.point);
          }
        }
        s.pipes = s.pipes.filter((p) => p.x + PIPE_W > 0);

        if (s.bird.y + BIRD_H / 2 > playableH || s.bird.y - BIRD_H / 2 < 0) {
          die(s);
        }

        const bx1 = BIRD_X - BIRD_W / 2 + 8;
        const bx2 = BIRD_X + BIRD_W / 2 - 8;
        const by1 = s.bird.y - BIRD_H / 2 + 5;
        const by2 = s.bird.y + BIRD_H / 2 - 5;
        for (const p of s.pipes) {
          if (bx2 > p.x + 4 && bx1 < p.x + PIPE_W - 4) {
            if (by1 < p.gapY || by2 > p.gapY + PIPE_GAP) {
              die(s);
            }
          }
        }
      }

      // Background
      const bgOk = drawImg(ctx, SPRITES.bg, 0, 0, W, H);
      if (!bgOk) {
        ctx.fillStyle = '#4ec0ca';
        ctx.fillRect(0, 0, W, H);
      }

      // Pipes
      for (const p of s.pipes) {
        drawTopPipe(ctx, p, p.gapY);
        const botY = p.gapY + PIPE_GAP;
        drawImg(ctx, SPRITES.pipe, p.x, botY, PIPE_W, playableH - botY);
      }

      // Base (tiling)
      const baseImg = SPRITES.base;
      const bw = baseImg.complete && baseImg.naturalWidth > 0 ? baseImg.naturalWidth : 336;
      const baseY = H - BASE_H;
      for (let bx = s.baseX; bx < W; bx += bw) {
        const drawn = drawImg(ctx, baseImg, bx, baseY, bw, BASE_H);
        if (!drawn) {
          ctx.fillStyle = '#ded895';
          ctx.fillRect(0, baseY, W, BASE_H);
          break;
        }
      }

      // Bird
      const birdImg = SPRITES.birdFrames[s.bird.frame];
      const angle = Math.min(Math.max(s.bird.vy * 0.06, -0.5), 1.2);
      ctx.save();
      ctx.translate(BIRD_X, s.bird.y);
      ctx.rotate(angle);
      const didDraw = drawImg(ctx, birdImg, -BIRD_W / 2, -BIRD_H / 2, BIRD_W, BIRD_H);
      if (!didDraw) {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // In-game score (large digit sprites at top)
      if (s.phase !== 'idle') {
        drawDigitRow(ctx, s.score, W / 2, 16, DIGIT_W, DIGIT_H);
      }

      // Idle: message sprite + best score
      if (s.phase === 'idle') {
        const msg = SPRITES.message;
        const mw = 190;
        const mh = msg.complete && msg.naturalWidth > 0
          ? Math.round((mw / msg.naturalWidth) * msg.naturalHeight)
          : 275;
        const msgY = (playableH - mh) / 2 - 20;
        drawImg(ctx, msg, (W - mw) / 2, msgY, mw, mh);

        const bestY = msgY + mh + 18;
        drawLabel(ctx, 'BEST', W / 2, bestY);
        drawDigitRow(ctx, highScoreRef.current, W / 2, bestY + 6, SMALL_DIGIT_W, SMALL_DIGIT_H);
      }

      // Dead: gameover sprite + score + best
      if (s.phase === 'dead') {
        const go = SPRITES.gameover;
        const gw = 240;
        const gh = go.complete && go.naturalWidth > 0
          ? Math.round((gw / go.naturalWidth) * go.naturalHeight)
          : 52;
        const goY = playableH / 2 - gh - 30;
        drawImg(ctx, go, (W - gw) / 2, goY, gw, gh);

        // Score column
        const scoreColX = W / 2 - 60;
        const bestColX = W / 2 + 60;
        const labelY = goY + gh + 22;
        const digitsY = labelY + 8;

        drawLabel(ctx, 'SCORE', scoreColX, labelY);
        drawDigitRow(ctx, s.score, scoreColX, digitsY, SMALL_DIGIT_W, SMALL_DIGIT_H);

        drawLabel(ctx, 'BEST', bestColX, labelY);
        drawDigitRow(ctx, highScoreRef.current, bestColX, digitsY, SMALL_DIGIT_W, SMALL_DIGIT_H);

        ctx.font = '13px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 3;
        ctx.fillText('Click or Space to restart', W / 2, digitsY + SMALL_DIGIT_H + 18);
        ctx.shadowBlur = 0;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isActive]);

  return (
    <WindowFrame
      windowId="flappyBird"
      title="flappy_bird.exe"
      windowState={windowState}
      className="flappy-window"
      contentClassName="flappy-window-content"
      width={`${W + 2}px`}
      height={`${H + 40}px`}
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      contentStyle={{ padding: 0, overflow: 'hidden', display: 'flex', background: '#000' }}
      preserveOnMinimize
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={flap}
        style={{ display: 'block', width: '100%', height: 'auto', cursor: 'pointer' }}
      />
    </WindowFrame>
  );
}
