import { z } from 'zod';
import { DEPARTMENTS } from './constants';

const phoneRegex = /^[+]?[\d\s().-]{7,20}$/;

/** Mirrors the server-side validation so the form catches issues before submit. */
export const employeeFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(60),
  lastName: z.string().trim().min(1, 'Last name is required').max(60),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid phone number')
    .or(z.literal('')),
  department: z.enum([...DEPARTMENTS] as [string, ...string[]], {
    errorMap: () => ({ message: 'Choose a department' }),
  }),
  jobTitle: z.string().trim().min(1, 'Job title is required').max(120),
  location: z.string().trim().max(120).or(z.literal('')),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Intern']),
  status: z.enum(['Active', 'On Leave', 'Inactive']),
  hireDate: z.string().or(z.literal('')),
  bio: z.string().trim().max(600, 'Keep it under 600 characters').or(z.literal('')),
});

export type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;
