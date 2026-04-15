export default function FullscreenFigureModal({ figure, onClose }) {
  if (!figure) {
    return null;
  }

  return (
    <div
      className="fullscreen-figure-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          event.stopPropagation();
          onClose('click');
        }
      }}
    >
      <div className="fullscreen-figure-modal" onClick={(event) => event.stopPropagation()}>
        <div className="fullscreen-figure-shell">
          <button
            type="button"
            className="fullscreen-figure-close"
            aria-label="Close fullscreen figure"
            onClick={(event) => {
              event.stopPropagation();
              onClose('click');
            }}
          >
            ×
          </button>
          <img src={figure.src} alt={figure.alt} className="fullscreen-figure-image" />
        </div>
        {figure.caption && <div className="fullscreen-figure-caption">{figure.caption}</div>}
        <div className="fullscreen-figure-hint">Click outside or press Esc to close</div>
      </div>
    </div>
  );
}
