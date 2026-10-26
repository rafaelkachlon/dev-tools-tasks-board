import { useEffect } from 'react';
import type { Task } from '../../types/task';
import { formatDate } from '../../utils/format';
import { Avatar } from '../Avatar/Avatar';
import { CloseIcon } from '../Icons';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { UrgentBadge } from '../UrgentBadge/UrgentBadge';
import styles from './TaskDetails.module.css';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetails({ task, onClose }: TaskDetailsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <span className={styles.taskId}>TDP-{task.id}</span>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close details">
            <CloseIcon />
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.badges}>
            <StatusBadge status={task.status} />
            {task.urgent && <UrgentBadge />}
          </div>

          <h2 id="task-details-title" className={styles.title}>
            {task.title}
          </h2>

          <p className={task.description ? styles.description : styles.noDescription}>
            {task.description || 'No description provided.'}
          </p>

          <section className={styles.assigneeCard}>
            <Avatar member={task.assignee} size="lg" />
            <div>
              <p className={styles.assigneeName}>{task.assignee.name}</p>
              <p className={styles.assigneeRole}>{task.assignee.role}</p>
            </div>
          </section>

          <dl className={styles.fields}>
            <div className={styles.field}>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={task.status} />
              </dd>
            </div>
            <div className={styles.field}>
              <dt>Estimate</dt>
              <dd>{task.estimateHours} hours</dd>
            </div>
            <div className={styles.field}>
              <dt>Priority</dt>
              <dd>{task.urgent ? 'Urgent' : 'Normal'}</dd>
            </div>
            <div className={styles.field}>
              <dt>Created</dt>
              <dd>{formatDate(task.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
