import { projects } from '../../../data/osData';
import FigureThumbnail from '../FigureThumbnail';
import WindowFrame from '../WindowFrame';

export default function ProjectsWindow({ windowState, controls, expandedProjectId, onToggleProject, onOpenFigure }) {
  return (
    <WindowFrame
      windowId="projects"
      title="~/projects"
      windowState={windowState}
      width="650px"
      height="550px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      contentStyle={{ padding: 0 }}
    >
      <div style={{ padding: '20px 20px 0 20px' }}>
        <h3 style={{ marginTop: 0, color: 'var(--accent-color)' }}>Projects and builds</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '18px' }}>
          This directory is a collection of engineering projects across embedded systems, robotics, AI, multiplayer software, and full-stack web work, each built around solving a concrete technical problem with the right tools for the job.
        </p>
      </div>
      {projects.map((project) => (
        <div key={project.id} style={{ borderBottom: '1px solid var(--border-color)', background: expandedProjectId === project.id ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
          <div
            onClick={() => onToggleProject(project.id)}
            className="project-header"
            style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' }}
          >
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: 'var(--accent-color)' }}>{expandedProjectId === project.id ? '📂 ' : '📁 '} {project.title}</h4>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{project.tech}</span>
            </div>
            <span style={{ transform: expandedProjectId === project.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}>▼</span>
          </div>

          {expandedProjectId === project.id && (
            <div style={{ padding: '0 20px 20px 20px', animation: 'fadeIn 0.3s ease' }}>
              <div className="project-detail-layout" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <FigureThumbnail
                  src={project.image}
                  alt={project.title}
                  caption={project.caption}
                  figureLabel={`Figure ${project.id}`}
                  onOpen={() => onOpenFigure(project.image, project.title, `Figure ${project.id}: ${project.caption.replace(/\n/g, ' ')}`)}
                  wrapperStyle={{ flexShrink: 0 }}
                />
                <div style={{ flexGrow: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>{project.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                    {project.logos.map((logo, index) => (
                      <img key={`${project.title}-${index}`} src={logo} alt={`Logo ${index}`} style={{ height: '24px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </WindowFrame>
  );
}
