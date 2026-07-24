import { useEffect, useMemo, useState } from 'react';
import { Download, Plus, SearchX } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmployeeFilters } from '../components/employees/EmployeeFilters';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeCard } from '../components/employees/EmployeeCard';
import { EmployeeFormPanel } from '../components/employees/EmployeeFormPanel';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Skeleton } from '../components/ui/Skeleton';
import { useDeleteEmployee, useEmployees } from '../hooks/useEmployees';
import { useDebounce } from '../hooks/useDebounce';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useToast } from '../context/ToastProvider';
import { api, parseApiError } from '../lib/api';
import { exportEmployeesToCsv } from '../lib/exportCsv';
import { PAGE_SIZE } from '../lib/constants';
import type { Employee, PaginatedEmployees, SortState } from '../types/employee';
import styles from './EmployeesPage.module.css';

export function EmployeesPage() {
  const toast = useToast();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 350);
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState<SortState>({ field: 'firstName', dir: 'asc' });
  const [page, setPage] = useState(1);

  const [panel, setPanel] = useState<{ open: boolean; employee?: Employee }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const query = useMemo(
    () => ({
      q: search || undefined,
      department: department || undefined,
      status: status || undefined,
      sort: `${sort.field}:${sort.dir}`,
      page,
      limit: PAGE_SIZE,
    }),
    [search, department, status, sort, page],
  );

  const { data, isLoading, isError, isFetching } = useEmployees(query);
  const deleteEmployee = useDeleteEmployee();

  // Return to the first page whenever the search or filters change.
  useEffect(() => {
    setPage(1);
  }, [search, department, status, sort.field, sort.dir]);

  // Keep the page in range if the last item on the last page is removed.
  useEffect(() => {
    if (data && page > data.pagination.totalPages) {
      setPage(data.pagination.totalPages);
    }
  }, [data, page]);

  const hasActiveFilters = Boolean(search || department || status);

  const handleSort = (field: string) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: 'asc' },
    );
  };

  const clearFilters = () => {
    setSearchInput('');
    setDepartment('');
    setStatus('');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEmployee.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.fullName} was removed`);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data: result } = await api.get<PaginatedEmployees>('/employees', {
        params: { ...query, page: 1, limit: 1000 },
      });
      if (result.data.length === 0) {
        toast.info('There is nothing to export');
        return;
      }
      exportEmployeesToCsv(result.data);
      toast.success(`Exported ${result.data.length} employees`);
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const employees = data?.data ?? [];
  const showEmpty = !isLoading && employees.length === 0;

  return (
    <div>
      <PageHeader
        title="Directory"
        subtitle={
          data ? `${data.pagination.total} people in your organisation` : 'Manage your team'
        }
        actions={
          <>
            <Button variant="secondary" onClick={handleExport} loading={isExporting}>
              <Download size={16} />
              Export
            </Button>
            <Button onClick={() => setPanel({ open: true })}>
              <Plus size={16} />
              Add employee
            </Button>
          </>
        }
      />

      <div className={styles.toolbar}>
        <EmployeeFilters
          search={searchInput}
          department={department}
          status={status}
          onSearchChange={setSearchInput}
          onDepartmentChange={setDepartment}
          onStatusChange={setStatus}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {isError ? (
        <div className={styles.error}>
          We couldn't load employees. Make sure the API server is running.
        </div>
      ) : showEmpty ? (
        <div className={styles.panel}>
          <EmptyState
            icon={<SearchX size={26} />}
            title={hasActiveFilters ? 'No matching employees' : 'No employees yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Add your first employee to get started.'
            }
            action={
              hasActiveFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => setPanel({ open: true })}>
                  <Plus size={16} />
                  Add employee
                </Button>
              )
            }
          />
        </div>
      ) : (
        <>
          <div className={clsx(styles.results, isFetching && styles.busy)}>
            {isMobile ? (
              <div className={styles.cards}>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} height={134} radius={12} />
                    ))
                  : employees.map((employee) => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onEdit={(emp) => setPanel({ open: true, employee: emp })}
                        onDelete={setDeleteTarget}
                      />
                    ))}
              </div>
            ) : (
              <div className={styles.tableCard}>
                <EmployeeTable
                  employees={employees}
                  sort={sort}
                  onSortChange={handleSort}
                  onEdit={(emp) => setPanel({ open: true, employee: emp })}
                  onDelete={setDeleteTarget}
                  loading={isLoading}
                />
              </div>
            )}
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                total={data.pagination.total}
                limit={data.pagination.limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      <EmployeeFormPanel
        open={panel.open}
        employee={panel.employee}
        onClose={() => setPanel({ open: false })}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove employee"
        message={
          deleteTarget ? (
            <>
              This will permanently remove <strong>{deleteTarget.fullName}</strong> from the
              directory. This can't be undone.
            </>
          ) : (
            ''
          )
        }
        confirmLabel="Remove"
        danger
        loading={deleteEmployee.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
