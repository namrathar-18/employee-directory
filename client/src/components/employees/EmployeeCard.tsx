import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { DepartmentBadge, StatusBadge } from '../ui/Badge';
import { formatDate } from '../../lib/format';
import type { Employee } from '../../types/employee';
import styles from './EmployeeCard.module.css';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/employees/${employee.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(`/employees/${employee.id}`);
      }}
    >
      <div className={styles.top}>
        <Avatar
          firstName={employee.firstName}
          lastName={employee.lastName}
          department={employee.department}
          size={44}
        />
        <div className={styles.info}>
          <span className={styles.name}>{employee.fullName}</span>
          <span className={styles.role}>{employee.jobTitle}</span>
        </div>
        <StatusBadge status={employee.status} />
      </div>

      <div className={styles.meta}>
        <DepartmentBadge department={employee.department} />
        <span className={styles.location}>{employee.location || '—'}</span>
      </div>

      <div className={styles.footer} onClick={(event) => event.stopPropagation()}>
        <span className={styles.hired}>Joined {formatDate(employee.hireDate)}</span>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onEdit(employee)}
            aria-label={`Edit ${employee.fullName}`}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onDelete(employee)}
            aria-label={`Delete ${employee.fullName}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
