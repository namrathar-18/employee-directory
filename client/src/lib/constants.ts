import type { EmployeeStatus, EmploymentType } from '../types/employee';

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Security & GRC',
  'Sales',
  'Marketing',
  'Customer Success',
  'People & HR',
  'Finance',
  'Legal',
  'IT',
  'Operations',
] as const;

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Intern',
];

export const EMPLOYEE_STATUSES: EmployeeStatus[] = ['Active', 'On Leave', 'Inactive'];

/** A stable accent colour per department, used for badges and avatars. */
export const DEPARTMENT_COLORS: Record<string, string> = {
  Engineering: '#6366f1',
  Product: '#8b5cf6',
  Design: '#ec4899',
  'Security & GRC': '#14b8a6',
  Sales: '#f59e0b',
  Marketing: '#f97316',
  'Customer Success': '#10b981',
  'People & HR': '#f43f5e',
  Finance: '#3b82f6',
  Legal: '#64748b',
  IT: '#06b6d4',
  Operations: '#84cc16',
};

export const DEFAULT_ACCENT = '#6366f1';

export const PAGE_SIZE = 10;
