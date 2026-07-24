import type { Employee } from '../types/employee';
import { formatDate } from './format';

const COLUMNS: { header: string; value: (e: Employee) => string }[] = [
  { header: 'First name', value: (e) => e.firstName },
  { header: 'Last name', value: (e) => e.lastName },
  { header: 'Email', value: (e) => e.email },
  { header: 'Phone', value: (e) => e.phone },
  { header: 'Department', value: (e) => e.department },
  { header: 'Job title', value: (e) => e.jobTitle },
  { header: 'Location', value: (e) => e.location },
  { header: 'Employment type', value: (e) => e.employmentType },
  { header: 'Status', value: (e) => e.status },
  { header: 'Hire date', value: (e) => formatDate(e.hireDate) },
];

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Turns the current employees into a CSV file and triggers a download. */
export function exportEmployeesToCsv(employees: Employee[]): void {
  const header = COLUMNS.map((c) => c.header).join(',');
  const rows = employees.map((e) => COLUMNS.map((c) => escapeCell(c.value(e))).join(','));
  const csv = [header, ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `employees-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
