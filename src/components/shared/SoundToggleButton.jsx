import SpeakerIcon from './SpeakerIcon';

export default function SoundToggleButton({
  enabled,
  onToggle,
  iconColor = 'white',
  title,
  style,
}) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={() => {
        onToggle();
      }}
      style={{
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <SpeakerIcon enabled={enabled} color={iconColor} />
    </button>
  );
}
