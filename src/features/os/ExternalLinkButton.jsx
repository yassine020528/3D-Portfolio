export default function ExternalLinkButton({ href, label, compact = false }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={compact ? '' : 'theme-btn'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: compact ? '180px' : undefined,
        textDecoration: 'none',
        background: 'var(--accent-color)',
        color: 'var(--bg-color)',
        fontWeight: 'bold',
        padding: compact ? '10px 14px' : undefined,
        borderRadius: compact ? '4px' : undefined,
        flexShrink: 0,
      }}
    >
      <span style={{ flex: 1, textAlign: 'center' }}>{label}</span>
      <img
        src="/logos/expand.png"
        alt=""
        aria-hidden="true"
        style={{ width: '16px', height: '16px', marginLeft: '10px', objectFit: 'contain' }}
      />
    </a>
  );
}
