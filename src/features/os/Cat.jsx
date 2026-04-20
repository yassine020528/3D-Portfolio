import { useEffect, useRef, useState } from 'react';
const CAT_INTERVAL_MS = 125;
const CAT_CROP_TOP = 16;
const CAT_CROP_HEIGHT = 32;
const CAT_CROP_LEFT_RATIO = 1 / 4;
const CAT_CROP_WIDTH_RATIO = 0.6;

const CAT_IDLE_FRAMES = 8;
const CAT_SLEEP_FRAMES = 8;
const CAT_WAKE_UP_FRAMES = 2;
const CAT_LICK_FRAMES = 15;
const CAT_IDLE_SPRITE = '/cat/IDLE.png';
const CAT_SLEEP_SPRITE = '/cat/SLEEP.png';
const CAT_WAKE_UP_SPRITE = '/cat/WAKING_UP.png';
const CAT_LICK_SPRITE = '/cat/LICK.png';
const CAT_LICK_INTERVAL_MS = 10000;

export default function Cat({ onClick, menuOpen = false, isSleeping = false }) {
  const [visualState, setVisualState] = useState(isSleeping ? 'sleep' : 'idle');
  const [frameIndex, setFrameIndex] = useState(0);
  const [spriteSize, setSpriteSize] = useState({ frameWidth: 0, width: 0, height: 0 });
  const previousSleepingRef = useRef(isSleeping);

  const frameCount = visualState === 'idle'
    ? CAT_IDLE_FRAMES
    : visualState === 'sleep'
      ? CAT_SLEEP_FRAMES
      : visualState === 'lick'
        ? CAT_LICK_FRAMES
      : CAT_WAKE_UP_FRAMES;

  const spriteSrc = visualState === 'idle'
    ? CAT_IDLE_SPRITE
    : visualState === 'sleep'
      ? CAT_SLEEP_SPRITE
      : visualState === 'lick'
        ? CAT_LICK_SPRITE
      : CAT_WAKE_UP_SPRITE;

  useEffect(() => {
    const sprite = new Image();

    sprite.src = spriteSrc;
    sprite.onload = () => {
      const frameWidth = sprite.naturalWidth / frameCount;

      setSpriteSize({
        frameWidth,
        width: frameWidth * CAT_CROP_WIDTH_RATIO,
        height: CAT_CROP_HEIGHT,
      });
    };
  }, [frameCount, spriteSrc]);

  useEffect(() => {
    setFrameIndex(0);
  }, [visualState]);

  useEffect(() => {
    if (visualState === 'idle' || visualState === 'sleep') {
      const intervalId = window.setInterval(() => {
        setFrameIndex((currentFrame) => (currentFrame + 1) % frameCount);
      }, CAT_INTERVAL_MS);

      return () => window.clearInterval(intervalId);
    }

    if (visualState === 'lick') {
      setFrameIndex(0);

      let sequenceIndex = 0;
      const intervalId = window.setInterval(() => {
        sequenceIndex += 1;

        if (sequenceIndex >= CAT_LICK_FRAMES) {
          window.clearInterval(intervalId);
          setVisualState('idle');
          return;
        }

        setFrameIndex(sequenceIndex);
      }, CAT_INTERVAL_MS);

      return () => window.clearInterval(intervalId);
    }

    const frameSequence = isSleeping
      ? Array.from({ length: CAT_WAKE_UP_FRAMES }, (_, index) => CAT_WAKE_UP_FRAMES - 1 - index)
      : Array.from({ length: CAT_WAKE_UP_FRAMES }, (_, index) => index);

    setFrameIndex(frameSequence[0]);

    let sequenceIndex = 0;
    const intervalId = window.setInterval(() => {
      sequenceIndex += 1;

      if (sequenceIndex >= frameSequence.length) {
        window.clearInterval(intervalId);
        setVisualState(isSleeping ? 'sleep' : 'idle');
        return;
      }

      setFrameIndex(frameSequence[sequenceIndex]);
    }, CAT_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [frameCount, isSleeping, visualState]);

  useEffect(() => {
    if (previousSleepingRef.current === isSleeping) {
      return;
    }

    previousSleepingRef.current = isSleeping;
    setVisualState('transition');
  }, [isSleeping]);

  useEffect(() => {
    if (isSleeping || visualState !== 'idle') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setVisualState('lick');
    }, CAT_LICK_INTERVAL_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isSleeping, visualState]);

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
