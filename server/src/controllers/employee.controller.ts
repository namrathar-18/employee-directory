import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { ApiError } from '../utils/ApiError';
import { escapeRegex } from '../utils/escapeRegex';
import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYMENT_TYPES } from '../constants';

const SORTABLE_FIELDS = new Set([
  'firstName',
  'lastName',
  'department',
  'jobTitle',
  'status',
  'hireDate',
  'createdAt',
]);

const includes = (list: readonly string[], value?: string): value is string =>
  typeof value === 'string' && list.includes(value);

/** GET /api/employees — paginated list with search, filters and sorting. */
export async function listEmployees(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

  const { q, department, status, employmentType } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};

  if (q && q.trim()) {
    const rx = new RegExp(escapeRegex(q.trim()), 'i');
    filter.$or = [{ firstName: rx }, { lastName: rx }, { email: rx }, { jobTitle: rx }];
  }
  if (includes(DEPARTMENTS, department)) filter.department = department;
  if (includes(EMPLOYEE_STATUSES, status)) filter.status = status;
  if (includes(EMPLOYMENT_TYPES, employmentType)) filter.employmentType = employmentType;

  let sortField = 'createdAt';
  let sortDir: 1 | -1 = -1;
  if (typeof req.query.sort === 'string') {
    const [field, dir] = req.query.sort.split(':');
    if (SORTABLE_FIELDS.has(field)) {
      sortField = field;
      sortDir = dir === 'asc' ? 1 : -1;
    }
  }

  const [data, total] = await Promise.all([
    Employee.find(filter)
      .collation({ locale: 'en', strength: 2 })
      .sort({ [sortField]: sortDir, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Employee.countDocuments(filter),
  ]);

  res.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}

/** GET /api/employees/:id */
export async function getEmployee(req: Request, res: Response) {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new ApiError(404, 'Employee not found');
  res.json({ data: employee });
}

/** POST /api/employees */
export async function createEmployee(req: Request, res: Response) {
  const employee = await Employee.create(req.body);
  res.status(201).json({ data: employee });
}

/** PATCH /api/employees/:id */
export async function updateEmployee(req: Request, res: Response) {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!employee) throw new ApiError(404, 'Employee not found');
  res.json({ data: employee });
}

/** DELETE /api/employees/:id */
export async function deleteEmployee(req: Request, res: Response) {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) throw new ApiError(404, 'Employee not found');
  res.status(204).send();
}
