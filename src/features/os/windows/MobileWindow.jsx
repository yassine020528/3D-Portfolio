import { mobileApps } from '../../../data/osData';
import WindowFrame from '../WindowFrame';

export default function MobileWindow({ windowState, controls, expandedMobileId, onToggleMobile, onOpenFigure }) {
  return (
    <WindowFrame
      windowId="mobile"
      title="~/mobile"
      windowState={windowState}
      width="860px"
      height="560px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
    >
      <h3 style={{ marginTop: 0, color: 'var(--accent-color)' }}>Mobile builds and experiments</h3>
      <p style={{ lineHeight: '1.6', marginBottom: '18px' }}>
        This directory is a collection of mobile apps and experiments, with a mix of Android and iOS work focused on practical UI, persistence, mapping, and day-to-day usability.
      </p>
      <div style={{ display: 'grid', gap: '14px' }}>
        {mobileApps.map((app) => (
          <div
            key={app.id}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              background: expandedMobileId === app.id ? 'rgba(255,255,255,0.04)' : 'transparent',
              overflow: 'hidden',
            }}
          >
            <div
              onClick={() => onToggleMobile(app.id)}
              className="project-header"
              style={{
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img src={app.appLogo} alt={`${app.title} logo`} style={{ width: '54px', height: '54px', objectFit: 'contain' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: 'var(--accent-color)' }}>
                    {expandedMobileId === app.id ? '📱 ' : '📲 '} {app.title}
                  </h4>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{app.tech}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: '0.78rem',
                    padding: '4px 8px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '999px',
                    opacity: 0.85,
                  }}
                >
                  {app.platform}
                </div>
                <span style={{ transform: expandedMobileId === app.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}>▼</span>
              </div>
            </div>

            {expandedMobileId === app.id && (
              <div style={{ padding: '0 16px 16px 16px', lineHeight: '1.6', animation: 'fadeIn 0.2s ease' }}>
                <div className="mobile-app-card">
                  <div className="mobile-app-content">
                    <div style={{ lineHeight: '1.6', opacity: 0.92 }}>{app.description}</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {app.techLogos.map((logo, index) => (
                        <img key={`${app.title}-${index}`} src={logo} alt="" aria-hidden="true" style={{ height: '24px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }} />
                      ))}
                    </div>
                  </div>

                  <div className="mobile-app-shots">
                    {app.screenshots.map((shot, shotIndex) => (
                      <div key={`${app.title}-shot-${shotIndex}`} style={{ width: '108px' }}>
                        <div style={{ width: '108px', height: '216px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)' }}>
                          <img
                            src={shot}
                            alt={`${app.title} screenshot ${shotIndex + 1}`}
                            className="figure-image"
                            onClick={() => onOpenFigure(shot, `${app.title} screenshot ${shotIndex + 1}`, `${app.title} - screenshot ${shotIndex + 1}`)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.72, marginTop: '6px' }}>Screen {shotIndex + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </WindowFrame>
  );
}
