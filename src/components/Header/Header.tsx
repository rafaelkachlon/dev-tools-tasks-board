import type { TeamMember } from '../../types/task';
import { AvatarGroup } from '../AvatarGroup/AvatarGroup';
import { PlusIcon } from '../Icons';
import { Skeleton } from '../Skeleton/Skeleton';
import styles from './Header.module.css';

interface HeaderProps {
  members: TeamMember[];
  loading: boolean;
  onNewTask: () => void;
}

export function Header({ members, loading, onNewTask }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          <div>
            <h1 className={styles.title}>TDP Task Board</h1>
            <p className={styles.subtitle}>Team Development Project · Sprint 4</p>
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.team}>
            {loading ? (
              <div className={styles.teamSkeleton}>
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} width={34} height={34} radius="50%" />
                ))}
              </div>
            ) : (
              <AvatarGroup members={members} />
            )}
          </div>
          <button type="button" className={styles.newTaskButton} onClick={onNewTask}>
            <PlusIcon width={16} height={16} strokeWidth={2.5} />
            New Task
          </button>
        </div>
      </div>
    </header>
  );
}
