import { useEffect } from 'react';
import { X } from 'lucide-react';
import './game-ui.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  theme?: 'clinical' | 'game';
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, theme = 'clinical', children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`modal-backdrop ${theme === 'game' ? 'modal-backdrop--game' : ''}`} onClick={onClose}>
      <div
        className={`modal-dialog ${theme === 'game' ? 'modal-dialog--game' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
