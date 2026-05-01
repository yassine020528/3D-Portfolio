import { aboutFigures, experienceEntries } from '../../../data/osData';
import ExternalLinkButton from '../ExternalLinkButton';
import FigureThumbnail from '../FigureThumbnail';
import WindowFrame from '../WindowFrame';

export default function AboutWindow({ windowState, controls, onOpenFigure }) {
  return (
    <WindowFrame
      windowId="about"
      title="user_profile.txt"
      windowState={windowState}
      width="600px"
      height="500px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      maximizeOnDoubleClick
    >
      <h2 style={{ color: 'var(--accent-color)', marginTop: 0 }}>Hello, I'm Yassine</h2>
      <p><strong>Comp. Eng. Graduate</strong>, from Polytechnique Montréal</p>
      <hr style={{ borderColor: 'var(--border-color)' }} />
      <p>
        I've been fascinated by how things work "under the hood" ever since I dismantled my first remote control car as a child.
        Back then, adults would have called it "destruction", but I prefer the term curiosity.
        <br />
        There was something addictive about seeing the raw circuit boards and gears that made the magic happen.
        Eventually, I learned that putting things back together was just as fun as taking them apart.
      </p>
      <br />

      <FigureThumbnail
        src={aboutFigures[0].src}
        alt={aboutFigures[0].alt}
        caption={aboutFigures[0].caption}
        onOpen={() => onOpenFigure(aboutFigures[0].src, aboutFigures[0].alt, aboutFigures[0].caption)}
        frameStyle={{ maxWidth: '250px', width: '100%', height: 'auto' }}
        imageStyle={{ objectFit: 'contain', border: '2px solid var(--border-color)', filter: 'grayscale(0.8) sepia(0.2)' }}
        wrapperStyle={{ marginBottom: '20px' }}
        captionStyle={{ marginTop: '5px' }}
      />

      <p>
        My younger self's curiosity has blossomed into a full-blown passion for computer engineering,
        and a slightly concerning relationship with caffeine.
        <br />
        <i>"Why build a simple portfolio when you can simulate an entire operating system?"</i>
        {' '} - Me, at 3 AM.
      </p>
      <br />

      <FigureThumbnail
        src={aboutFigures[1].src}
        alt={aboutFigures[1].alt}
        caption={aboutFigures[1].caption}
        onOpen={() => onOpenFigure(aboutFigures[1].src, aboutFigures[1].alt, aboutFigures[1].caption)}
        frameStyle={{ maxWidth: '250px', width: '100%', height: 'auto' }}
        imageStyle={{ objectFit: 'contain', border: '2px solid var(--border-color)', filter: 'grayscale(0.8) sepia(0.2)' }}
        wrapperStyle={{ marginBottom: '20px' }}
        captionStyle={{ marginTop: '5px' }}
      />

      <p>Whether it's designing custom FPGA architectures, writing low-level embedded C, or building retro web operating systems like this one, I love solving complex engineering puzzles.</p>
      <br />

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '5px', border: '1px solid var(--border-color)', fontFamily: 'monospace' }}>
        <p style={{ margin: '0 0 10px 0', color: 'var(--accent-color)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '5px' }}>
          <strong>&gt; cat /var/log/experience.log</strong>
        </p>

        {experienceEntries.map((entry) => (
          <div
            key={entry.version}
            style={{
              marginBottom: '15px',
              paddingLeft: '10px',
              borderLeft: `2px solid ${entry.accent ? 'var(--accent-color)' : 'var(--border-color)'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: '#fff' }}>{entry.version}</strong>
              <span style={{ opacity: 0.6 }}>{entry.date}</span>
            </div>
            <div style={{ color: 'var(--accent-color)', fontSize: '0.85rem' }}>{entry.location}</div>
            <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '0.85rem', opacity: 0.9, listStyleType: 'square' }}>
              {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              {entry.logos?.length ? (
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                  {entry.logos.map((logo) => (
                    <img
                      key={logo}
                      src={logo}
                      alt=""
                      aria-hidden="true"
                      style={{ height: '20px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '4px' }}
                    />
                  ))}
                </li>
              ) : null}
            </ul>
          </div>
        ))}
      </div>
      <br />

      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        <ExternalLinkButton href="/yassine_abassi.pdf" label="View Resume" />
      </div>
    </WindowFrame>
  );
}
