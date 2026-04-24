import { socialLinks } from '../../../data/osData';
import WindowFrame from '../WindowFrame';

export default function ContactWindow({
  windowState,
  controls,
  formRef,
  time,
  contactForm,
  isSending,
  onSubmit,
  onType,
}) {
  return (
    <WindowFrame
      windowId="contact"
      title="contact.exe"
      windowState={windowState}
      width="400px"
      height="490px"
      onFocus={controls.focus}
      onStartDrag={controls.startDrag}
      onMinimize={controls.minimize}
      onMaximize={controls.maximize}
      onClose={controls.close}
      contentClassName="contact-form"
    >
      <h3 style={{ marginTop: 0, color: 'var(--accent-color)' }}>Let's Connect</h3>
      <div style={{ marginBottom: '20px' }}>
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="social-link"
            target={link.external ? '_blank' : '_top'}
            rel={link.external ? 'noreferrer' : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
      <hr style={{ borderColor: 'var(--border-color)', margin: '15px 0' }} />
      <form ref={formRef} onSubmit={onSubmit}>
        <input type="hidden" name="time" value={time} />
        <label style={{ fontSize: '0.9rem' }}>Name</label>
        <input type="text" name="name" value={contactForm.name} onChange={(event) => onType('name', event.target.value)} required />
        <label style={{ fontSize: '0.9rem' }}>Email</label>
        <input type="email" name="email" value={contactForm.email} onChange={(event) => onType('email', event.target.value)} required />
        <label style={{ fontSize: '0.9rem' }}>Message</label>
        <textarea rows="4" name="message" value={contactForm.message} onChange={(event) => onType('message', event.target.value)} required />
        <button type="submit" className="contact-btn" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </WindowFrame>
  );
}
