import { departmentColor } from '../../lib/format';
import styles from './DepartmentDistribution.module.css';

interface DepartmentDistributionProps {
  data: { department: string; count: number }[];
}

export function DepartmentDistribution({ data }: DepartmentDistributionProps) {
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Headcount by department</h3>
      <div className={styles.list}>
        {data.map((item) => {
          const color = departmentColor(item.department);
          return (
            <div key={item.department} className={styles.row}>
              <span className={styles.name}>{item.department}</span>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  style={{ width: `${(item.count / max) * 100}%`, backgroundColor: color }}
                />
              </div>
              <span className={styles.count}>{item.count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
