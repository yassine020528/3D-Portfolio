function renderMultilineCaption(caption) {
  return caption.split('\n').map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < caption.split('\n').length - 1 && <br />}
    </span>
  ));
}

export default function FigureThumbnail({
  src,
  alt,
  caption,
  onOpen,
  frameStyle,
  imageStyle,
  captionStyle,
  wrapperStyle,
  figureLabel,
}) {
  return (
    <div style={{ textAlign: 'center', display: 'block', ...wrapperStyle }}>
      <div
        style={{
          width: '120px',
          height: '120px',
          margin: '0 auto',
          background: '#000',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          overflow: 'hidden',
          ...frameStyle,
        }}
      >
        <img
          src={src}
          alt={alt}
          className="figure-image"
          onClick={onOpen}
          style={{ width: '100%', height: '100%', objectFit: 'cover', ...imageStyle }}
          onError={(event) => {
            event.target.style.display = 'none';
            event.target.parentNode.style.color = 'var(--text-color)';
            event.target.parentNode.innerText = 'IMG_ERR';
          }}
        />
      </div>
      {caption && (
        <div style={{ textAlign: 'center', fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.7, ...captionStyle }}>
          {figureLabel ? `${figureLabel}: ` : null}
          {renderMultilineCaption(caption)}
        </div>
      )}
    </div>
  );
}
