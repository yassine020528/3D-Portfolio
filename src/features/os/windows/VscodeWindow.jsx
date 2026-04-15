import { codeFiles } from '../../../data/osData';
import WindowFrame from '../WindowFrame';

export default function VscodeWindow({
  windowState,
  controls,
  currentCodeFile,
  activeCodeFile,
  setActiveCodeFile,
  activeCodePanel,
  setActiveCodePanel,
}) {
  return (
    <WindowFrame
      windowId="vscode"
      title="vscode.exe"
      windowState={windowState}
      width="760px"
      height="520px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      maximizeOnDoubleClick
      contentStyle={{ padding: 0, overflow: 'hidden' }}
      frameStyle={{ overflow: 'hidden' }}
    >
      <div className="code-window-shell">
        <div className="code-topbar">
          <div>{currentCodeFile.label}</div>
          <div>UTF-8</div>
        </div>

        <div className="code-body">
          <div className="code-activitybar">
            <span className={`code-activity-item ${activeCodePanel === 'explorer' ? 'active' : ''}`} onClick={() => setActiveCodePanel('explorer')}>📁</span>
            <span className={`code-activity-item ${activeCodePanel === 'search' ? 'active' : ''}`} onClick={() => setActiveCodePanel('search')}>🔎</span>
            <span className={`code-activity-item ${activeCodePanel === 'run' ? 'active' : ''}`} onClick={() => setActiveCodePanel('run')}>▶</span>
            <span className={`code-activity-item ${activeCodePanel === 'extensions' ? 'active' : ''}`} onClick={() => setActiveCodePanel('extensions')}>🧩</span>
          </div>

          <div className="code-sidebar">
            {activeCodePanel === 'explorer' && (
              <>
                <div className="code-sidebar-header">Explorer</div>
                <div className="code-filetree">
                  <div className="code-filetree-row">portfolio</div>
                  <div className="code-filetree-row">notes</div>
                  {codeFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`code-filetree-row ${activeCodeFile === file.id ? 'active' : ''}`}
                      onClick={() => setActiveCodeFile(file.id)}
                      style={{ paddingLeft: '18px' }}
                    >
                      {file.label}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeCodePanel === 'search' && (
              <>
                <div className="code-sidebar-header">Search</div>
                <input className="code-search-input" value="job" readOnly />
                <div className="code-sidebar-note">
                  <div className="code-sidebar-muted">0 results in workspace</div>
                  <div style={{ marginTop: '10px' }}>No results found.</div>
                </div>
              </>
            )}

            {activeCodePanel === 'run' && (
              <>
                <div className="code-sidebar-header">Run And Debug</div>
                <div className="code-sidebar-note">
                  <div className="code-sidebar-muted" style={{ marginBottom: '10px' }}>Nothing is running right now.</div>
                </div>
              </>
            )}

            {activeCodePanel === 'extensions' && (
              <>
                <div className="code-sidebar-header">Extensions</div>
                <div className="code-sidebar-note">
                  <div style={{ marginBottom: '10px' }}>Recommended install pack:</div>
                  <div>☕ `Caffeine Plugin`</div>
                </div>
              </>
            )}
          </div>

          <div className="code-main">
            <div className="code-editor-wrap">
              <div className="code-tabs">
                {codeFiles.map((file) => (
                  <div key={file.id} className={`code-tab ${activeCodeFile === file.id ? 'active' : ''}`} onClick={() => setActiveCodeFile(file.id)}>
                    {file.label}
                  </div>
                ))}
              </div>

              <div className="code-editor">
                <div className="code-editor-scroll">
                  <div className="code-gutter">
                    {currentCodeFile.lines.map((_, index) => (
                      <div key={`${currentCodeFile.id}-line-${index + 1}`} className="code-row">
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  <div className="code-content">
                    {currentCodeFile.lines.map((line, index) => (
                      <div key={`${currentCodeFile.id}-content-${index + 1}`} className="code-row">
                        {currentCodeFile.id === 'main' && <span className="code-comment">{line}</span>}
                        {currentCodeFile.id === 'todo' && (
                          <>
                            <span className="code-keyword">TODO</span>
                            <span className="code-plain">{line.slice(4)}</span>
                          </>
                        )}
                        {currentCodeFile.id === 'readme' && (
                          <span className={index === 0 ? 'code-number' : 'code-plain'}>{line}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="code-statusbar">
          <div className="code-statusbar-section">
            <span>main</span>
            <span>Break Mode</span>
            <span>0 problems</span>
          </div>
          <div className="code-statusbar-section">
            <span>Spaces: 2</span>
            <span>{currentCodeFile.language}</span>
            <span>Ln {currentCodeFile.lines.length}, Col 1</span>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
