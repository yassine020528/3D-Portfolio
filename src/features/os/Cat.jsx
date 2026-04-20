import { useEffect, useState } from 'react';
const CAT_INTERVAL_MS = 125;
const CAT_SLEEP_INTERVAL_MS = 250;
const CAT_CROP_TOP = 16;
const CAT_CROP_HEIGHT = 32;
const CAT_CROP_LEFT_RATIO = 1 / 6;
const CAT_CROP_WIDTH_RATIO = 0.8;

const CAT_IDLE_FRAMES = 12;
const CAT_SIT_FRAMES = 7;
const CAT_SLEEP_FRAMES = 4;
const CAT_MEOW_FRAMES = 7;
const CAT_IDLE_SPRITE = '/cat/IDLE.png';
const CAT_SIT_SPRITE = '/cat/SIT.png';
const CAT_SLEEP_SPRITE = '/cat/SLEEP.png';
const CAT_MEOW_SPRITE = '/cat/MEOW.png';
const CAT_MEOW_INTERVAL_MS = 10000;

export default function Cat({ onClick, menuOpen = false, posture = 'idle' }) {
  const restingState = posture === 'sleep' ? 'sleep' : posture === 'sit' ? 'sit' : 'idle';
  const [visualState, setVisualState] = useState(restingState);
  const [frameIndex, setFrameIndex] = useState(0);
  const [spriteSize, setSpriteSize] = useState({ frameWidth: 0, width: 0, height: 0 });

  const interval = visualState === 'sleep' ? CAT_SLEEP_INTERVAL_MS : CAT_INTERVAL_MS;

  const frameCount = visualState === 'idle'
    ? CAT_IDLE_FRAMES
    : visualState === 'sit'
      ? CAT_SIT_FRAMES
    : visualState === 'sleep'
      ? CAT_SLEEP_FRAMES
      : CAT_MEOW_FRAMES;

  const spriteSrc = visualState === 'idle'
    ? CAT_IDLE_SPRITE
    : visualState === 'sit'
      ? CAT_SIT_SPRITE
    : visualState === 'sleep'
      ? CAT_SLEEP_SPRITE
      : CAT_MEOW_SPRITE;

  useEffect(() => {
    const sprite = new Image();
    let isMounted = true;

    sprite.src = spriteSrc;
    sprite.onload = () => {
      if (!isMounted) {
        return;
      }

      const frameWidth = sprite.naturalWidth / frameCount;

      setSpriteSize({
        frameWidth,
        width: frameWidth * CAT_CROP_WIDTH_RATIO,
        height: CAT_CROP_HEIGHT,
      });
    };

    return () => {
      isMounted = false;
    };
  }, [frameCount, spriteSrc]);

  useEffect(() => {
    setFrameIndex(0);
  }, [visualState]);

  useEffect(() => {
    if (visualState === 'sleep') {
      const sleepFrames = [0, 3, 2, 1, 2, 3];

      let sequenceIndex = 0;
      const intervalId = window.setInterval(() => {
        sequenceIndex = (sequenceIndex + 1) % sleepFrames.length;
        setFrameIndex(sleepFrames[sequenceIndex]);
      }, interval);

      return () => window.clearInterval(intervalId);
    }

    if (visualState === 'idle' || visualState === 'sit') {
      const intervalId = window.setInterval(() => {
        setFrameIndex((currentFrame) => (currentFrame + 1) % frameCount);
      }, interval);

      return () => window.clearInterval(intervalId);
    }

    if (visualState === 'meow') {
      setFrameIndex(0);

      let sequenceIndex = 0;
      const intervalId = window.setInterval(() => {
        sequenceIndex += 1;

        if (sequenceIndex >= CAT_MEOW_FRAMES) {
          window.clearInterval(intervalId);
          setVisualState('sit');
          return;
        }

        setFrameIndex(sequenceIndex);
      }, interval);

      return () => window.clearInterval(intervalId);
    }

    return undefined;
  }, [frameCount, interval, visualState]);

  useEffect(() => {
    if (visualState === 'meow' && posture === 'sit') {
      return;
    }

    setVisualState(restingState);
  }, [posture, restingState, visualState]);

  useEffect(() => {
    if (posture !== 'sit' || visualState !== 'sit') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setVisualState('meow');
    }, CAT_MEOW_INTERVAL_MS);

    return () => window.clearTimeout(timeoutId);
  }, [posture, visualState]);

  if (!spriteSize.width || !spriteSize.height) {
    return null;
  }

  return (
    <button
      type="button"
      className={`cat ${menuOpen ? 'open' : ''}`}
      aria-label="Open Sanjer actions"
      aria-haspopup="menu"
      aria-expanded={menuOpen}
      onClick={onClick}
      style={{
        width: `${spriteSize.width}px`,
        height: `${spriteSize.height}px`,
        backgroundImage: `url("${spriteSrc}")`,
        backgroundPosition: `${-((frameIndex + CAT_CROP_LEFT_RATIO) * spriteSize.frameWidth)}px -${CAT_CROP_TOP}px`,
        backgroundSize: `${spriteSize.frameWidth * frameCount}px auto`,
      }}
    />
  );
}
