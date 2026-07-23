import { z } from 'zod';
import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYMENT_TYPES } from '../constants';

const phoneRegex = /^[+]?[\d\s().-]{7,20}$/;

const optionalString = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(''));

export const createEmployeeSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(60),
  lastName: z.string().trim().min(1, 'Last name is required').max(60),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  department: z.enum([...DEPARTMENTS] as [string, ...string[]], {
    errorMap: () => ({ message: 'Choose a department' }),
  }),
  jobTitle: z.string().trim().min(1, 'Job title is required').max(120),
  location: optionalString(120),
  employmentType: z.enum([...EMPLOYMENT_TYPES] as [string, ...string[]]).default('Full-time'),
  status: z.enum([...EMPLOYEE_STATUSES] as [string, ...string[]]).default('Active'),
  hireDate: z.coerce.date().optional(),
  bio: optionalString(600),
  avatarUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
