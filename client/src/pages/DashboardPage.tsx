import { Building2, UserCheck, UserMinus, Users } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/dashboard/StatCard';
import { DepartmentDistribution } from '../components/dashboard/DepartmentDistribution';
import { RecentHires } from '../components/dashboard/RecentHires';
import { Skeleton } from '../components/ui/Skeleton';
import { useStats } from '../hooks/useStats';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { data: stats, isLoading, isError } = useStats();

  const activeShare = stats && stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="A snapshot of your team at a glance." />

      {isError && (
        <div className={styles.error}>
          We couldn't load the dashboard. Make sure the API server is running.
        </div>
      )}

      <div className={styles.statsGrid}>
        {isLoading || !stats ? (
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} height={98} radius={16} />)
        ) : (
          <>
            <StatCard
              label="Total employees"
              value={stats.total}
              accent="#6366f1"
              icon={<Users size={22} />}
              hint={`Across ${stats.departments} departments`}
            />
            <StatCard
              label="Active"
              value={stats.active}
              accent="#10b981"
              icon={<UserCheck size={22} />}
              hint={`${activeShare}% of headcount`}
            />
            <StatCard
              label="On leave"
              value={stats.onLeave}
              accent="#f59e0b"
              icon={<UserMinus size={22} />}
            />
            <StatCard
              label="Departments"
              value={stats.departments}
              accent="#3b82f6"
              icon={<Building2 size={22} />}
            />
          </>
        )}
      </div>

      {stats && stats.total > 0 && (
        <div className={styles.grid}>
          <DepartmentDistribution data={stats.byDepartment} />
          <RecentHires employees={stats.recentHires} />
        </div>
      )}
    </div>
  );
}
