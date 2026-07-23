// Reference data shared across the API. Kept in one place so the schema,
// validators and seed script never drift apart.

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

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'] as const;

export const EMPLOYEE_STATUSES = ['Active', 'On Leave', 'Inactive'] as const;

export type Department = (typeof DEPARTMENTS)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];
