import { ChangeEvent, useEffect, useRef, useState } from 'react';
import SketchCanvas from './SketchCanvas';
import { playClickSound } from '../../lib/sound';
import { RenderMode } from './types';

function FlowerExperience() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [effectMode, setEffectMode] = useState<RenderMode>(0);
  const [isReady, setIsReady] = useState(false);
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
  }, [imageSrc]);

  useEffect(() => {
    if (!isReady || hasStarted) {
      setShowEnterPrompt(false);
    }
  }, [isReady, hasStarted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  const startExperience = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.log('Audio play blocked', error));
      setIsMuted(false);
    }

    setHasStarted(true);
  };

  const toggleMute = () => {
    if (!audioRef.current) {
      return;
    }

    if (isMuted) {
      audioRef.current.play().catch((error) => console.log('Audio play blocked', error));
      setIsMuted(false);
      return;
    }

    audioRef.current.pause();
    setIsMuted(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }

    setImageSrc(URL.createObjectURL(file));
    event.target.value = '';
  };

  const openFilePicker = (event?: { stopPropagation?: () => void }) => {
    event?.stopPropagation?.();
    playClickSound();
    fileInputRef.current?.click();
  };

  const controls = (
    <>
      <div className="mode-group">
        <div className="label-small">Renderer</div>
        {(['ascii', 'dots', 'pixel', 'all'] as const).map((mode, index) => (
          <div
            key={mode}
            className={`text-btn ${effectMode === index ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              playClickSound();
              setEffectMode(index as RenderMode);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                playClickSound();
                setEffectMode(index as RenderMode);
              }
            }}
          >
            {mode}
          </div>
        ))}
      </div>

      <div className="mode-group">
        <div className="label-small">Actions</div>
        <div className="text-btn" role="button" tabIndex={0} onClick={openFilePicker} onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFilePicker(event);
          }
        }}>
          Upload Photo
        </div>
        <div className="text-btn" role="button" tabIndex={0} onClick={(event) => {
          event.stopPropagation();
          playClickSound();
          toggleMute();
        }} onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            playClickSound();
            toggleMute();
          }
        }}>
          {isMuted ? 'Unmute' : 'Mute'}
        </div>
      </div>
    </>
  );

  return (
    <div className="app-container">
      <SketchCanvas
        imageSrc={imageSrc}
        effectMode={effectMode}
        onReady={setIsReady}
        hasStarted={hasStarted}
        onLoaderFade={() => {
          if (!hasStarted) {
            setShowEnterPrompt(true);
          }
        }}
      />

      <audio ref={audioRef} src="/sounds/flower-music.mp3" loop />

      <div className={`enter-overlay ${showEnterPrompt && !hasStarted ? 'visible' : ''}`}>
        <button className="flower-start-btn" onClick={startExperience}>
          enter
        </button>
      </div>

      <div className={`ui-overlay ${!hasStarted ? 'hidden' : ''}`}>
        <div className="flower-controls-panel">
          {controls}
        </div>

        {!isMuted ? (
          <div className="flower-audio-credit" aria-label="Current music credit">
            ♪ Sound Playing: Probe.mp3 by Oxy
          </div>
        ) : null}

        <input
          type="file"
          ref={fileInputRef}
          className="flower-hidden-input"
          accept="image/*"
          onClick={(event) => event.stopPropagation()}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default FlowerExperience;
