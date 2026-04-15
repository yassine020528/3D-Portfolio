import { useEffect, useRef, useState } from 'react';

export default function useAmbientAudio({ src, enabled = true, active = true, muffled = false, gain = 0.5 }) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filterNodeRef = useRef(null);
  const bufferRef = useRef(null);

  const playAudio = () => {
    const context = audioContextRef.current;
    const buffer = bufferRef.current;

    if (!context || !buffer) {
      return;
    }

    if (context.state === 'suspended') {
      context.resume();
    }

    if (sourceRef.current) {
      return;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(filterNodeRef.current);
    filterNodeRef.current.connect(gainNodeRef.current);
    source.start(0);
    sourceRef.current = source;

    gainNodeRef.current.gain.cancelScheduledValues(context.currentTime);
    gainNodeRef.current.gain.setValueAtTime(0, context.currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime(gain, context.currentTime + 2);
  };

  const stopAudio = () => {
    const context = audioContextRef.current;
    const source = sourceRef.current;

    if (!context || !source) {
      return;
    }

    const fadeOutDuration = 1;
    gainNodeRef.current.gain.cancelScheduledValues(context.currentTime);
    gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, context.currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime(0, context.currentTime + fadeOutDuration);

    window.setTimeout(() => {
      if (!sourceRef.current) {
        return;
      }

      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }, fadeOutDuration * 1000);
  };

  useEffect(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return undefined;
    }

    const context = new AudioContextClass();
    const gainNode = context.createGain();
    const filterNode = context.createBiquadFilter();

    filterNode.type = 'lowpass';
    filterNode.frequency.value = 20000;
    gainNode.gain.value = 0;
    gainNode.connect(context.destination);

    audioContextRef.current = context;
    gainNodeRef.current = gainNode;
    filterNodeRef.current = filterNode;

    fetch(src)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        bufferRef.current = buffer;

        if (isEnabled && active) {
          playAudio();
        }
      })
      .catch((error) => console.error(error));

    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      }

      context.close();
    };
  }, [src]);

  useEffect(() => {
    if (isEnabled && active) {
      playAudio();
      return;
    }

    stopAudio();
  }, [active, isEnabled]);

  useEffect(() => {
    const context = audioContextRef.current;
    const filterNode = filterNodeRef.current;

    if (!context || !filterNode) {
      return;
    }

    const now = context.currentTime;
    filterNode.frequency.cancelScheduledValues(now);
    filterNode.frequency.setValueAtTime(filterNode.frequency.value, now);
    filterNode.frequency.exponentialRampToValueAtTime(muffled ? 600 : 20000, now + 1);
  }, [muffled]);

  return {
    soundEnabled: isEnabled,
    setSoundEnabled: setIsEnabled,
    playAudio,
    stopAudio,
    toggleSound: () => {
      if (isEnabled) {
        stopAudio();
        setIsEnabled(false);
        return;
      }

      playAudio();
      setIsEnabled(true);
    },
  };
}
