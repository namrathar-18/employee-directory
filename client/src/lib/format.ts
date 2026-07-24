import { DEFAULT_ACCENT, DEPARTMENT_COLORS } from './constants';

/** Two-letter initials from a name, e.g. "Ada Lovelace" -> "AL". */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function departmentColor(department: string): string {
  return DEPARTMENT_COLORS[department] ?? DEFAULT_ACCENT;
}

/** Initials from a full name string, e.g. "Namratha R" -> "NR". */
export function initialsFromName(name: string | undefined): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'U';
}

/** Converts a hex colour to an rgba() string with the given alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function formatDate(value: string | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Human friendly "time since", e.g. "3 years", used for tenure. */
export function formatTenure(value: string | undefined): string {
  if (!value) return '—';
  const start = new Date(value).getTime();
  if (Number.isNaN(start)) return '—';
  const months = Math.max(0, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24 * 30.44)));
  if (months < 1) return 'New joiner';
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  return remaining ? `${years}y ${remaining}m` : `${years}y`;
}

/** Format a date value for a native <input type="date"> (YYYY-MM-DD). */
export function toDateInputValue(value: string | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}
