import { useEffect, useRef } from 'react';

export default function ResumeViewer({ onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => {
      dialog.close();
      previousFocus?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="resume-viewer"
      aria-labelledby="resume-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="resume-viewer__toolbar">
        <button type="button" onClick={onClose} autoFocus>← Back to room</button>
        <h1 id="resume-title">Yassine Abassi · Resume</h1>
        <a href="/yassine_abassi.pdf" download="Yassine_Abassi_Resume.pdf">Download PDF ↓</a>
      </header>
      <object
        className="resume-viewer__document"
        data="/yassine_abassi.pdf#view=FitH"
        type="application/pdf"
        aria-label="Yassine Abassi's resume"
      >
        <div className="resume-viewer__fallback">
          <a href="/yassine_abassi.pdf" target="_blank" rel="noreferrer">Open the original PDF</a>
          <img src="/images/resume.png" alt="Yassine Abassi's resume: education, experience, projects, and technical skills. Open the original PDF for selectable text." />
        </div>
      </object>
    </dialog>
  );
}
