import { describe, it, expect } from 'vitest';
import { createEmployeeSchema, updateEmployeeSchema } from './employee.validator';

const validEmployee = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  department: 'Engineering',
  jobTitle: 'Software Engineer',
};

describe('createEmployeeSchema', () => {
  it('accepts a valid employee and applies sensible defaults', () => {
    const result = createEmployeeSchema.safeParse(validEmployee);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('Active');
      expect(result.data.employmentType).toBe('Full-time');
    }
  });

  it('normalises the email to lowercase', () => {
    const result = createEmployeeSchema.safeParse({ ...validEmployee, email: 'ADA@Example.COM' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('ada@example.com');
  });

  it('rejects a missing first name', () => {
    const result = createEmployeeSchema.safeParse({ ...validEmployee, firstName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email address', () => {
    const result = createEmployeeSchema.safeParse({ ...validEmployee, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a department that is not on the list', () => {
    const result = createEmployeeSchema.safeParse({ ...validEmployee, department: 'Astronomy' });
    expect(result.success).toBe(false);
  });
});

describe('updateEmployeeSchema', () => {
  it('allows partial updates', () => {
    const result = updateEmployeeSchema.safeParse({ jobTitle: 'Staff Engineer' });
    expect(result.success).toBe(true);
  });
});
