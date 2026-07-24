export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  location: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  hireDate: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedEmployees {
  data: Employee[];
  pagination: Pagination;
}

export interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
  departments: number;
  byDepartment: { department: string; count: number }[];
  byStatus: { status: string; count: number }[];
  recentHires: Employee[];
}

/** Shape submitted from the add / edit form. */
export interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  location: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  hireDate?: string;
  bio: string;
}

export interface EmployeeQuery {
  q?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export type SortDir = 'asc' | 'desc';

export interface SortState {
  field: string;
  dir: SortDir;
}
