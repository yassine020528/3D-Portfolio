const createAudio = (src, volume = 1) => {
  const audio = new Audio(src);
  audio.volume = volume;
  return audio;
};

const playAudio = (src, volume = 1) => {
  createAudio(src, volume).play().catch((error) => console.error(error));
};

const KEYBOARD_SOUNDS = [
  '/sounds/keyboard/key_1.mp3',
  '/sounds/keyboard/key_2.mp3',
  '/sounds/keyboard/key_3.mp3',
  '/sounds/keyboard/key_4.mp3',
  '/sounds/keyboard/key_5.mp3',
  '/sounds/keyboard/key_6.mp3',
];

export const playClickSound = () => playAudio('/sounds/click.mp3');

export const playPowerToggleSound = () => playAudio('/sounds/on-off-sound.mp3', 0.5);

export const playKeyboardSound = () => {
  const randomIndex = Math.floor(Math.random() * KEYBOARD_SOUNDS.length);
  playAudio(KEYBOARD_SOUNDS[randomIndex]);
};
