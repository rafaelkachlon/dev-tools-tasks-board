import type { ReactNode } from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: ReactNode;
  tone: 'blue' | 'green' | 'amber';
  loading?: boolean;
}

export function StatCard({ label, value, hint, icon, tone, loading = false }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={`${styles.icon} ${styles[tone]}`}>{icon}</span>
      <div className={styles.body}>
        <p className={styles.label}>{label}</p>
        {loading ? (
          <>
            <Skeleton width={72} height={28} className={styles.valueSkeleton} />
            <Skeleton width={110} height={12} />
          </>
        ) : (
          <>
            <p className={styles.value}>{value}</p>
            {hint && <p className={styles.hint}>{hint}</p>}
          </>
        )}
      </div>
    </div>
  );
}
