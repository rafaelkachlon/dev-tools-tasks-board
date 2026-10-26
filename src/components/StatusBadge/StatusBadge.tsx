import type { TaskStatus } from '../../types/task';
import { STATUS_LABELS } from '../../utils/format';
import styles from './StatusBadge.module.css';

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
