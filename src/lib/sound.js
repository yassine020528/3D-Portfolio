const preload = (src, volume = 1) => {
  const audio = new Audio(src);
  audio.volume = volume;
  return audio;
};

const replay = (audio) => {
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

const clickAudio = preload('/sounds/click.mp3');
const powerAudio = preload('/sounds/on-off-sound.mp3', 0.5);
const catAudio = preload('/sounds/cat-meow.mp3', 0.2);
const keyboardAudios = [
  '/sounds/keyboard/key_1.mp3',
  '/sounds/keyboard/key_2.mp3',
  '/sounds/keyboard/key_3.mp3',
  '/sounds/keyboard/key_4.mp3',
  '/sounds/keyboard/key_5.mp3',
  '/sounds/keyboard/key_6.mp3',
].map((src) => preload(src));

export const playClickSound = () => replay(clickAudio);
export const playCatSound = () => replay(catAudio);
export const playPowerToggleSound = () => replay(powerAudio);
export const playKeyboardSound = () => {
  replay(keyboardAudios[Math.floor(Math.random() * keyboardAudios.length)]);
};
