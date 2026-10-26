import { useEffect } from 'react';
import { AlertIcon, CheckCircleIcon, CloseIcon } from '../Icons';
import styles from './Toast.module.css';

export interface ToastMessage {
  id: number;
  kind: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 4000;

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.kind]}`}>
          {toast.kind === 'success' ? <CheckCircleIcon /> : <AlertIcon />}
          <span className={styles.message}>{toast.message}</span>
          <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss notification">
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      )}
    </div>
  );
}
