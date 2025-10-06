import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function Modal({ title, content, show, onClose, onConfirm, confirmText = "Conferma" }) {
  if (!show) return null;

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header d-flex justify-content-between align-items-center">
          <h2 id="modal-title" className="h5 mb-0">
            {title}
          </h2>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">{typeof content === "string" ? <p className="mb-0">{content}</p> : content}</div>

        <div className="modal-footer d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Annulla
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
