import { useEffect, useRef, useState } from 'react';

export default function useAmbientAudio({ src, enabled = true, active = true, muffled = false, gain = 0.5 }) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const filterNodeRef = useRef(null);
  const bufferRef = useRef(null);
  const stopTimeoutRef = useRef(null);
  const loopTimeoutRef = useRef(null);
  const loopLayersRef = useRef(new Set());

  const clearLoopTimeout = () => {
    if (loopTimeoutRef.current) {
      window.clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
  };

  const clearStopTimeout = () => {
    if (stopTimeoutRef.current) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
  };

  const disconnectLayer = (layer) => {
    layer.source.onended = null;

    try {
      layer.source.disconnect();
    } catch (error) {
      console.error(error);
    }

    try {
      layer.gainNode.disconnect();
    } catch (error) {
      console.error(error);
    }
  };

  const stopAllLayers = () => {
    loopLayersRef.current.forEach((layer) => {
      try {
        layer.source.stop();
      } catch (error) {
        console.error(error);
      }

      disconnectLayer(layer);
    });

    loopLayersRef.current.clear();
  };

  const createLoopLayer = ({ context, buffer, startTime, fadeInDuration = 0 }) => {
    const layerGain = context.createGain();
    const source = context.createBufferSource();

    source.buffer = buffer;
    source.connect(layerGain);
    layerGain.connect(filterNodeRef.current);

    layerGain.gain.cancelScheduledValues(startTime);
    layerGain.gain.setValueAtTime(fadeInDuration > 0 ? 0 : 1, startTime);

    if (fadeInDuration > 0) {
      layerGain.gain.linearRampToValueAtTime(1, startTime + fadeInDuration);
    }

    const layer = { source, gainNode: layerGain };
    source.onended = () => {
      loopLayersRef.current.delete(layer);
      disconnectLayer(layer);
    };

    source.start(startTime);
    loopLayersRef.current.add(layer);

    return layer;
  };

  const scheduleLoop = (startTime) => {
    const context = audioContextRef.current;
    const buffer = bufferRef.current;
    const currentLayer = [...loopLayersRef.current].at(-1);

    if (!context || !buffer || !currentLayer) {
      return;
    }

    const overlapDuration = Math.min(0.18, buffer.duration / 4);
    const nextStartTime = startTime + Math.max(buffer.duration - overlapDuration, 0.01);
    const scheduleDelay = Math.max((nextStartTime - context.currentTime - 0.05) * 1000, 0);

    clearLoopTimeout();

    loopTimeoutRef.current = window.setTimeout(() => {
      if (!audioContextRef.current || !bufferRef.current || !loopLayersRef.current.has(currentLayer)) {
        return;
      }

      const nextLayer = createLoopLayer({
        context,
        buffer,
        startTime: nextStartTime,
        fadeInDuration: overlapDuration,
      });

      currentLayer.gainNode.gain.cancelScheduledValues(nextStartTime);
      currentLayer.gainNode.gain.setValueAtTime(currentLayer.gainNode.gain.value, nextStartTime);
      currentLayer.gainNode.gain.linearRampToValueAtTime(0, nextStartTime + overlapDuration);
      currentLayer.source.stop(nextStartTime + overlapDuration);

      scheduleLoop(nextStartTime);

      return nextLayer;
    }, scheduleDelay);
  };

  const playAudio = () => {
    const context = audioContextRef.current;
    const buffer = bufferRef.current;

    if (!context || !buffer) {
      return;
    }

    if (context.state === 'suspended') {
      context.resume();
    }

    if (loopLayersRef.current.size > 0) {
      return;
    }

    const startTime = context.currentTime;

    createLoopLayer({
      context,
      buffer,
      startTime,
    });
    scheduleLoop(startTime);

    masterGainRef.current.gain.cancelScheduledValues(startTime);
    masterGainRef.current.gain.setValueAtTime(0, startTime);
    masterGainRef.current.gain.linearRampToValueAtTime(gain, startTime + 2);
  };

  const stopAudio = ({ immediate = false } = {}) => {
    const context = audioContextRef.current;

    if (!context || loopLayersRef.current.size === 0) {
      return;
    }

    clearLoopTimeout();
    clearStopTimeout();

    masterGainRef.current.gain.cancelScheduledValues(context.currentTime);

    if (immediate) {
      stopAllLayers();
      masterGainRef.current.gain.setValueAtTime(0, context.currentTime);
      return;
    }

    const fadeOutDuration = 1;
    masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, context.currentTime);
    masterGainRef.current.gain.linearRampToValueAtTime(0, context.currentTime + fadeOutDuration);

    stopTimeoutRef.current = window.setTimeout(() => {
      if (loopLayersRef.current.size === 0) {
        return;
      }

      stopAllLayers();
      stopTimeoutRef.current = null;
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
    filterNode.connect(gainNode);

    audioContextRef.current = context;
    masterGainRef.current = gainNode;
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
      clearLoopTimeout();
      clearStopTimeout();
      stopAllLayers();

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
        stopAudio({ immediate: true });
        setIsEnabled(false);
        return;
      }

      playAudio();
      setIsEnabled(true);
    },
  };
}
