import { games } from '../../../data/osData';
import ExternalLinkButton from '../ExternalLinkButton';
import FigureThumbnail from '../FigureThumbnail';
import WindowFrame from '../WindowFrame';

function LaunchGameButton({ label, onLaunch }) {
  return (
    <button
      onClick={onLaunch}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '180px',
        background: 'var(--accent-color)',
        color: 'var(--bg-color)',
        fontWeight: 'bold',
        padding: '10px 14px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        fontSize: '1rem',
      }}
    >
      <span style={{ flex: 1, textAlign: 'center' }}>{label}</span>
      <span style={{ marginLeft: '10px', fontSize: '16px', lineHeight: 1 }}>▶</span>
    </button>
  );
}

export default function GamesWindow({ windowState, controls, expandedGameId, onToggleGame, onOpenFigure, onLaunchWindow }) {
  return (
    <WindowFrame
      windowId="games"
      title="~/games"
      windowState={windowState}
      width="620px"
      height="580px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      maximizeOnDoubleClick
    >
      <h3 style={{ marginTop: 0, color: 'var(--accent-color)' }}>Games and experiments</h3>
      <p style={{ lineHeight: '1.6', marginBottom: '18px' }}>
        This directory is a small collection of game projects and playful experiments, ranging from browser-based atmosphere and survival ideas to desktop strategy builds with a more classic feel.
      </p>
      {games.map((game) => (
        <div key={game.id} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', background: expandedGameId === game.id ? 'rgba(255,255,255,0.04)' : 'transparent', marginBottom: '14px', overflow: 'hidden' }}>
          <div
            onClick={() => onToggleGame(game.id)}
            className="project-header"
            style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
              <div style={{ width: '62px', height: '62px', borderRadius: '14px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                <img src={game.appLogo} alt={`${game.title} logo`} style={{ width: '54px', height: '54px', objectFit: 'contain' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--accent-color)' }}>{expandedGameId === game.id ? '🎮 ' : '🕹️ '} {game.title}</h4>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{game.tech}</span>
              </div>
            </div>
            <span style={{ transform: expandedGameId === game.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}>▼</span>
          </div>

          {expandedGameId === game.id && (
            <div style={{ padding: '0 16px 16px 16px', lineHeight: '1.6', animation: 'fadeIn 0.2s ease' }}>
              <div className="project-detail-layout" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <p style={{ marginTop: 0, marginBottom: '10px', fontSize: '0.95rem' }}>{game.description}</p>
                  <p style={{ marginTop: 0, marginBottom: '14px', fontSize: '0.95rem' }}>{game.details}</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {game.techLogos.map((logo, index) => (
                      <img key={`${game.title}-${index}`} src={logo} alt={`${game.title} tech ${index + 1}`} style={{ height: '24px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }} />
                    ))}
                  </div>
                  {game.actionWindowId
                    ? <LaunchGameButton label={game.actionLabel} onLaunch={() => onLaunchWindow(game.actionWindowId)} />
                    : game.actionHref && <ExternalLinkButton href={game.actionHref} label={game.actionLabel} compact />}
                </div>

                {game.figureImage && (
                  <FigureThumbnail
                    src={game.figureImage}
                    alt={game.title}
                    caption={game.caption}
                    figureLabel={`Figure ${game.id}`}
                    onOpen={() => onOpenFigure(game.figureImage, game.title, `Figure ${game.id}: ${game.figureCaptionText}`)}
                    wrapperStyle={{ flexShrink: 0 }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: '4px', paddingTop: '14px', borderTop: '1px dashed var(--border-color)', textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-color)' }}>
        More games coming soon...
      </div>
    </WindowFrame>
  );
}
