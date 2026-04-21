const bufferCache = new Map();
let audioContext = null;
let unlockListenersAttached = false;

const setPlaybackAudioSession = () => {
  if (typeof navigator === 'undefined' || !('audioSession' in navigator)) {
    return;
  }

  try {
    if (navigator.audioSession.type !== 'playback') {
      navigator.audioSession.type = 'playback';
    }
  } catch {}
};

const getAudioContext = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass({ latencyHint: 'interactive' });
  }

  return audioContext;
};

const attachUnlockListeners = () => {
  if (typeof window === 'undefined' || unlockListenersAttached) {
    return;
  }

  unlockListenersAttached = true;

  const unlock = () => {
    setPlaybackAudioSession();

    const context = getAudioContext();
    if (!context) {
      return;
    }

    if (context.state === 'suspended') {
      context.resume().catch(() => {});
    }
  };

  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
};

const preloadFallbackAudio = (src, volume = 1) => {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.volume = volume;
  return audio;
};

const loadBuffer = (src) => {
  if (bufferCache.has(src)) {
    return bufferCache.get(src);
  }

  const context = getAudioContext();
  if (!context || typeof fetch !== 'function') {
    return null;
  }

  const bufferPromise = fetch(src)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer.slice(0)))
    .catch(() => null);

  bufferCache.set(src, bufferPromise);
  return bufferPromise;
};

export const registerSoundEffect = (src, volume = 1) => {
  attachUnlockListeners();

  const sound = {
    src,
    volume,
    fallbackAudio: preloadFallbackAudio(src, volume),
  };

  sound.bufferPromise = loadBuffer(src);
  return sound;
};

const playWithFallback = (sound) => {
  sound.fallbackAudio.currentTime = 0;
  sound.fallbackAudio.play().catch(() => {});
};

export const playSoundEffect = (sound) => {
  setPlaybackAudioSession();

  const context = getAudioContext();
  if (!context) {
    playWithFallback(sound);
    return;
  }

  if (context.state === 'suspended') {
    context.resume().catch(() => {});
  }

  sound.bufferPromise
    ?.then((buffer) => {
      if (!buffer) {
        playWithFallback(sound);
        return;
      }

      const source = context.createBufferSource();
      const gainNode = context.createGain();

      gainNode.gain.value = sound.volume;
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(context.destination);
      source.start(0);
    })
    .catch(() => {
      playWithFallback(sound);
    });

  if (!sound.bufferPromise) {
    playWithFallback(sound);
  }
};

const clickAudio = registerSoundEffect('/sounds/click.mp3');
const powerAudio = registerSoundEffect('/sounds/on-off-sound.mp3', 0.5);
const catAudio = registerSoundEffect('/sounds/cat-meow.mp3', 0.2);
const keyboardAudios = [
  '/sounds/keyboard/key_1.mp3',
  '/sounds/keyboard/key_2.mp3',
  '/sounds/keyboard/key_3.mp3',
  '/sounds/keyboard/key_4.mp3',
  '/sounds/keyboard/key_5.mp3',
  '/sounds/keyboard/key_6.mp3',
].map((src) => registerSoundEffect(src));

export const playClickSound = () => playSoundEffect(clickAudio);
export const playCatSound = () => playSoundEffect(catAudio);
export const playPowerToggleSound = () => playSoundEffect(powerAudio);
export const playKeyboardSound = () => {
  playSoundEffect(keyboardAudios[Math.floor(Math.random() * keyboardAudios.length)]);
};
