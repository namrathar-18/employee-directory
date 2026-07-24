import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { Avatar } from '../ui/Avatar';
import { DepartmentBadge, StatusBadge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '../../lib/format';
import type { Employee, SortState } from '../../types/employee';
import styles from './EmployeeTable.module.css';

const columns = [
  { key: 'firstName', label: 'Employee' },
  { key: 'department', label: 'Department' },
  { key: 'jobTitle', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'hireDate', label: 'Joined' },
] as const;

interface EmployeeTableProps {
  employees: Employee[];
  sort: SortState;
  onSortChange: (field: string) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  loading?: boolean;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortState['dir'] }) {
  if (!active) return <ChevronsUpDown size={14} className={styles.sortIconIdle} />;
  return dir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
}

function SkeletonRow() {
  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <div className={styles.person}>
          <Skeleton width={38} height={38} radius="50%" />
          <div className={styles.personText}>
            <Skeleton width={130} height={13} />
            <Skeleton width={170} height={11} />
          </div>
        </div>
      </td>
      <td className={styles.td}>
        <Skeleton width={110} height={22} radius={999} />
      </td>
      <td className={styles.td}>
        <Skeleton width={120} height={13} />
      </td>
      <td className={styles.td}>
        <Skeleton width={70} height={22} radius={999} />
      </td>
      <td className={styles.td}>
        <Skeleton width={80} height={13} />
      </td>
      <td className={styles.td} />
    </tr>
  );
}

export function EmployeeTable({
  employees,
  sort,
  onSortChange,
  onEdit,
  onDelete,
  loading = false,
}: EmployeeTableProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={styles.th}>
                <button
                  type="button"
                  className={clsx(styles.sortBtn, sort.field === column.key && styles.sortActive)}
                  onClick={() => onSortChange(column.key)}
                >
                  {column.label}
                  <SortIcon active={sort.field === column.key} dir={sort.dir} />
                </button>
              </th>
            ))}
            <th className={clsx(styles.th, styles.actionsHead)}>
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={index} />)
            : employees.map((employee) => (
                <tr
                  key={employee.id}
                  className={styles.row}
                  onClick={() => navigate(`/employees/${employee.id}`)}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(`/employees/${employee.id}`);
                  }}
                >
                  <td className={styles.td}>
                    <div className={styles.person}>
                      <Avatar
                        firstName={employee.firstName}
                        lastName={employee.lastName}
                        department={employee.department}
                        size={38}
                      />
                      <div className={styles.personText}>
                        <span className={styles.name}>{employee.fullName}</span>
                        <span className={styles.email}>{employee.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <DepartmentBadge department={employee.department} />
                  </td>
                  <td className={styles.td}>
                    <span className={styles.role}>{employee.jobTitle}</span>
                    <span className={styles.sub}>{employee.location || '—'}</span>
                  </td>
                  <td className={styles.td}>
                    <StatusBadge status={employee.status} />
                  </td>
                  <td className={styles.td}>
                    <span className={styles.muted}>{formatDate(employee.hireDate)}</span>
                  </td>
                  <td
                    className={clsx(styles.td, styles.actions)}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => onEdit(employee)}
                      aria-label={`Edit ${employee.fullName}`}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className={clsx(styles.iconBtn, styles.danger)}
                      onClick={() => onDelete(employee)}
                      aria-label={`Delete ${employee.fullName}`}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
