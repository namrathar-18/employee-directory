import { Search, X } from 'lucide-react';
import { Select } from '../ui/Field';
import { DEPARTMENTS, EMPLOYEE_STATUSES } from '../../lib/constants';
import styles from './EmployeeFilters.module.css';

interface EmployeeFiltersProps {
  search: string;
  department: string;
  status: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function EmployeeFilters({
  search,
  department,
  status,
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  onClear,
  hasActiveFilters,
}: EmployeeFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.searchWrap}>
        <Search size={17} className={styles.searchIcon} aria-hidden />
        <input
          type="search"
          className={styles.search}
          placeholder="Search by name, email or role…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search employees"
        />
        {search && (
          <button
            type="button"
            className={styles.clearSearch}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <Select
        className={styles.select}
        value={department}
        onChange={(event) => onDepartmentChange(event.target.value)}
        aria-label="Filter by department"
      >
        <option value="">All departments</option>
        {DEPARTMENTS.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>

      <Select
        className={styles.select}
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {EMPLOYEE_STATUSES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>

      {hasActiveFilters && (
        <button type="button" className={styles.clearBtn} onClick={onClear}>
          <X size={15} />
          Clear
        </button>
      )}
    </div>
  );
}
