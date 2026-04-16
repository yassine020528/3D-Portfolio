const controlStyles = {
  min: { background: '#febc2e' },
  max: { background: '#28c840' },
};

function getWindowStyle(windowState, width, height, extraStyle) {
  return {
    top: windowState.isMaximized ? 0 : windowState.y,
    left: windowState.isMaximized ? 0 : windowState.x,
    width: windowState.isMaximized ? '100vw' : width,
    height: windowState.isMaximized ? 'calc(100dvh - 45px)' : height,
    zIndex: windowState.zIndex,
    borderRadius: windowState.isMaximized ? '0' : '8px',
    ...extraStyle,
  };
}

export default function WindowFrame({
  windowId,
  title,
  windowState,
  width,
  height,
  onFocus,
  onStartDrag,
  onMinimize,
  onMaximize,
  onClose,
  children,
  className = '',
  contentClassName = '',
  contentStyle,
  headerStyle,
  titleStyle,
  frameStyle,
  maximizeOnDoubleClick = false,
  preserveOnMinimize = false,
}) {
  if (!windowState.isOpen) {
    return null;
  }

  const isVisuallyHidden = preserveOnMinimize && windowState.isMinimized;

  if (windowState.isMinimized && !preserveOnMinimize) {
    return null;
  }

  return (
    <div
      className={`window ${windowState.isMaximized ? 'maximized' : ''} ${className}`.trim()}
      style={{
        ...getWindowStyle(windowState, width, height, frameStyle),
        ...(isVisuallyHidden ? { display: 'none' } : null),
      }}
      onMouseDown={onFocus}
      aria-hidden={isVisuallyHidden}
    >
      <div
        className="window-header"
        style={headerStyle}
        onMouseDown={(event) => {
          if (!windowState.isMaximized) {
            onStartDrag(event, windowId);
          }
        }}
        onDoubleClick={maximizeOnDoubleClick ? () => onMaximize(windowId) : undefined}
      >
        <div className="window-title" style={titleStyle}>{title}</div>
        <div className="window-controls">
          <span className="min-btn" onClick={() => onMinimize(windowId)} style={controlStyles.min} />
          <span className="max-btn" onClick={() => onMaximize(windowId)} style={controlStyles.max} />
          <span className="close-btn" onClick={() => onClose(windowId)} />
        </div>
      </div>
      <div className={`window-content ${contentClassName}`.trim()} style={contentStyle}>
        {children}
      </div>
    </div>
  );
}
