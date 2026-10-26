import type { Task } from '../../types/task';
import { Avatar } from '../Avatar/Avatar';
import { ClockIcon } from '../Icons';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { UrgentBadge } from '../UrgentBadge/UrgentBadge';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  isUrgent: boolean | string;
  onSelect: (task: Task) => void;
}

export function TaskCard({ task, isUrgent, onSelect }: TaskCardProps) {
  return (
    <button type="button" className={styles.card} onClick={() => onSelect(task)}>
      <span className={styles.top}>
        <StatusBadge status={task.status} />
        {isUrgent && <UrgentBadge />}
      </span>

      <span className={styles.title}>{task.title}</span>

      <span className={styles.footer}>
        <span className={styles.assignee}>
          <Avatar member={task.assignee} size="sm" />
          <span className={task.assignee ? styles.assigneeName : styles.unassigned}>
            {task.assignee ? task.assignee.name : 'Unassigned'}
          </span>
        </span>
        <span className={styles.estimate}>
          <ClockIcon width={14} height={14} />
          {task.estimateHours}h
        </span>
      </span>
    </button>
  );
}
