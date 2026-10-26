import type { Task } from '../../types/task';
import { InboxIcon } from '../Icons';
import { Skeleton } from '../Skeleton/Skeleton';
import { TaskCard } from '../TaskCard/TaskCard';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onSelect: (task: Task) => void;
}

const SKELETON_COUNT = 6;

export function TaskList({ tasks, loading, onSelect }: TaskListProps) {
  if (loading) {
    return (
      <div className={styles.grid} aria-busy="true" aria-label="Loading tasks">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <Skeleton width={84} height={22} radius={999} />
            <Skeleton width="80%" height={18} />
            <div className={styles.skeletonFooter}>
              <Skeleton width={26} height={26} radius="50%" />
              <Skeleton width={96} height={12} />
              <Skeleton width={40} height={20} className={styles.skeletonEstimate} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <InboxIcon width={32} height={32} />
        <p className={styles.emptyTitle}>No tasks found</p>
        <p className={styles.emptyText}>Try a different status filter or search term.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} isUrgent={String(task.urgent)} onSelect={onSelect} />
      ))}
    </div>
  );
}
