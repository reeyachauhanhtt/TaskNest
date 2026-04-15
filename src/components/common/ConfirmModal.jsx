import { createPortal } from 'react-dom';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return createPortal(
    <div className={`${styles.overlay} ${styles.show}`} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles.show}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p>{message || 'Are you sure?'}</p>

        <div className={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
