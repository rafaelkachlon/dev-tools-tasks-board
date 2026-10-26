import { AlertIcon } from '../Icons';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon}>
        <AlertIcon width={28} height={28} />
      </span>
      <h2 className={styles.title}>We couldn't load your tasks</h2>
      <p className={styles.text}>Please check your connection and try again.</p>
      <button type="button" className={styles.retryButton} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
