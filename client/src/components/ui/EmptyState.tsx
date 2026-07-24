import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: ReactNode;
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, illustration, title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      {illustration ? (
        <div className={styles.illustration}>{illustration}</div>
      ) : (
        icon && <div className={styles.icon}>{icon}</div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
