import { Link } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../lib/format';
import type { Employee } from '../../types/employee';
import styles from './RecentHires.module.css';

export function RecentHires({ employees }: { employees: Employee[] }) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Recent hires</h3>
      <ul className={styles.list}>
        {employees.map((employee) => (
          <li key={employee.id}>
            <Link to={`/employees/${employee.id}`} className={styles.item}>
              <Avatar
                firstName={employee.firstName}
                lastName={employee.lastName}
                department={employee.department}
                size={36}
              />
              <span className={styles.info}>
                <span className={styles.name}>{employee.fullName}</span>
                <span className={styles.role}>
                  {employee.jobTitle} · {employee.department}
                </span>
              </span>
              <span className={styles.date}>{formatDate(employee.hireDate)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
