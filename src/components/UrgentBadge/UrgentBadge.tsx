import { FlameIcon } from '../Icons';
import styles from './UrgentBadge.module.css';

export function UrgentBadge() {
  return (
    <span className={styles.badge}>
      <FlameIcon width={12} height={12} strokeWidth={2.5} />
      Urgent
    </span>
  );
}
