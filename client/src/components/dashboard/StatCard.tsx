import type { ReactNode } from 'react';
import { withAlpha } from '../../lib/format';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  accent: string;
  hint?: string;
}

export function StatCard({ label, value, icon, accent, hint }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.icon} style={{ backgroundColor: withAlpha(accent, 0.14), color: accent }}>
        {icon}
      </span>
      <div className={styles.body}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    </div>
  );
}
