import clsx from 'clsx';
import { departmentColor, withAlpha } from '../../lib/format';
import type { EmployeeStatus } from '../../types/employee';
import styles from './Badge.module.css';

export function DepartmentBadge({ department }: { department: string }) {
  const color = departmentColor(department);
  return (
    <span className={styles.badge} style={{ backgroundColor: withAlpha(color, 0.14), color }}>
      <span className={styles.dot} style={{ backgroundColor: color }} />
      {department}
    </span>
  );
}

const statusClass: Record<EmployeeStatus, string> = {
  Active: styles.active,
  'On Leave': styles.onLeave,
  Inactive: styles.inactive,
};

export function StatusBadge({ status }: { status: EmployeeStatus }) {
  return <span className={clsx(styles.status, statusClass[status])}>{status}</span>;
}
