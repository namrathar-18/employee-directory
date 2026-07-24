import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react';
import clsx from 'clsx';
import { Avatar } from '../components/ui/Avatar';
import { DepartmentBadge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmployeeFormPanel } from '../components/employees/EmployeeFormPanel';
import { useDeleteEmployee, useEmployee } from '../hooks/useEmployees';
import { useToast } from '../context/ToastProvider';
import { formatDate, formatTenure } from '../lib/format';
import { parseApiError } from '../lib/api';
import styles from './EmployeeProfilePage.module.css';

function BackLink() {
  return (
    <Link to="/employees" className={styles.back}>
      <ArrowLeft size={16} />
      Back to directory
    </Link>
  );
}

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className={styles.detail}>
      <span className={styles.detailIcon}>{icon}</span>
      <dt className={styles.detailLabel}>{label}</dt>
      <dd className={styles.detailValue}>{value}</dd>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div>
      <BackLink />
      <div className={styles.header}>
        <div className={styles.identity}>
          <Skeleton width={72} height={72} radius="50%" />
          <div className={styles.identityText}>
            <Skeleton width={200} height={22} />
            <Skeleton width={140} height={14} />
            <Skeleton width={220} height={22} radius={999} />
          </div>
        </div>
      </div>
      <div className={styles.grid}>
        <Skeleton height={200} radius={16} />
        <Skeleton height={200} radius={16} />
      </div>
    </div>
  );
}

export function EmployeeProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: employee, isLoading, isError } = useEmployee(id);
  const deleteEmployee = useDeleteEmployee();

  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!employee) return;
    try {
      await deleteEmployee.mutateAsync(employee.id);
      toast.success(`${employee.fullName} was removed`);
      navigate('/employees');
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !employee) {
    return (
      <div>
        <BackLink />
        <div className={styles.card}>
          <EmptyState
            title="Employee not found"
            description="This profile may have been removed or the link is incorrect."
            action={
              <Link to="/employees">
                <Button variant="secondary">Back to directory</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink />

      <div className={styles.header}>
        <div className={styles.identity}>
          <Avatar
            firstName={employee.firstName}
            lastName={employee.lastName}
            department={employee.department}
            size={72}
          />
          <div className={styles.identityText}>
            <h1 className={styles.name}>{employee.fullName}</h1>
            <p className={styles.role}>{employee.jobTitle}</p>
            <div className={styles.badges}>
              <DepartmentBadge department={employee.department} />
              <StatusBadge status={employee.status} />
              <span className={styles.type}>{employee.employmentType}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => setEditing(true)}>
            <Pencil size={16} />
            Edit
          </Button>
          <Button variant="danger" onClick={() => setConfirming(true)}>
            <Trash2 size={16} />
            Remove
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Contact</h3>
          <dl className={styles.details}>
            <DetailRow
              icon={<Mail size={16} />}
              label="Email"
              value={
                <a href={`mailto:${employee.email}`} className={styles.link}>
                  {employee.email}
                </a>
              }
            />
            <DetailRow icon={<Phone size={16} />} label="Phone" value={employee.phone || '—'} />
            <DetailRow icon={<MapPin size={16} />} label="Location" value={employee.location || '—'} />
          </dl>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Employment</h3>
          <dl className={styles.details}>
            <DetailRow
              icon={<Building2 size={16} />}
              label="Department"
              value={employee.department}
            />
            <DetailRow
              icon={<BadgeCheck size={16} />}
              label="Type"
              value={employee.employmentType}
            />
            <DetailRow
              icon={<CalendarDays size={16} />}
              label="Hire date"
              value={formatDate(employee.hireDate)}
            />
            <DetailRow
              icon={<Clock size={16} />}
              label="Tenure"
              value={formatTenure(employee.hireDate)}
            />
          </dl>
        </section>

        {employee.bio && (
          <section className={clsx(styles.card, styles.full)}>
            <h3 className={styles.cardTitle}>About</h3>
            <p className={styles.bio}>{employee.bio}</p>
          </section>
        )}
      </div>

      <EmployeeFormPanel open={editing} employee={employee} onClose={() => setEditing(false)} />

      <ConfirmDialog
        open={confirming}
        title="Remove employee"
        message={
          <>
            This will permanently remove <strong>{employee.fullName}</strong> from the directory.
            This can't be undone.
          </>
        }
        confirmLabel="Remove"
        danger
        loading={deleteEmployee.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
