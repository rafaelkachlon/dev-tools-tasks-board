import type { Task } from '../../types/task';
import { calculateTotalHours, countCompleted } from '../../utils/stats';
import { CheckCircleIcon, ClockIcon, ListIcon } from '../Icons';
import { StatCard } from '../StatCard/StatCard';
import styles from './SummaryBar.module.css';

interface SummaryBarProps {
  tasks: Task[];
  loading: boolean;
}

export function SummaryBar({ tasks, loading }: SummaryBarProps) {
  const total = tasks.length;
  const completed = countCompleted(tasks);
  const totalHours = calculateTotalHours(tasks);
  const completedPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className={styles.bar} aria-label="Summary">
      <StatCard
        label="Total tasks"
        value={total}
        hint="In the current sprint"
        icon={<ListIcon width={22} height={22} />}
        tone="blue"
        loading={loading}
      />
      <StatCard
        label="Completed"
        value={completed}
        hint={`${completedPercent}% of all tasks`}
        icon={<CheckCircleIcon width={22} height={22} />}
        tone="green"
        loading={loading}
      />
      <StatCard
        label="Total estimated hours"
        value={`${totalHours}h`}
        hint="Sum of all task estimates"
        icon={<ClockIcon width={22} height={22} />}
        tone="amber"
        loading={loading}
      />
    </section>
  );
}
