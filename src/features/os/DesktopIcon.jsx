export default function DesktopIcon({ icon, label, className, iconStyle, iconClassName, children, onClick }) {
  return (
    <div className={`icon ${className}`.trim()} onClick={onClick}>
      <div className={`icon-img ${iconClassName || ''}`.trim()} style={iconStyle}>
        {children || icon}
      </div>
      <span className="icon-label">{label}</span>
    </div>
  );
}
