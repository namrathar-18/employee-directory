import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, Select, TextInput, Textarea } from '../ui/Field';
import { Button } from '../ui/Button';
import { employeeFormSchema, type EmployeeFormSchema } from '../../lib/employeeSchema';
import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYMENT_TYPES } from '../../lib/constants';
import { toDateInputValue } from '../../lib/format';
import type { ApiFieldError } from '../../lib/api';
import type { Employee } from '../../types/employee';
import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
  employee?: Employee;
  submitting: boolean;
  serverErrors: ApiFieldError[];
  onSubmit: (values: EmployeeFormSchema) => void;
  onCancel: () => void;
}

function toDefaults(employee?: Employee): EmployeeFormSchema {
  return {
    firstName: employee?.firstName ?? '',
    lastName: employee?.lastName ?? '',
    email: employee?.email ?? '',
    phone: employee?.phone ?? '',
    department: employee?.department ?? '',
    jobTitle: employee?.jobTitle ?? '',
    location: employee?.location ?? '',
    employmentType: employee?.employmentType ?? 'Full-time',
    status: employee?.status ?? 'Active',
    hireDate: toDateInputValue(employee?.hireDate),
    bio: employee?.bio ?? '',
  };
}

export function EmployeeForm({
  employee,
  submitting,
  serverErrors,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: toDefaults(employee),
  });

  useEffect(() => {
    serverErrors.forEach((fieldError) => {
      setError(fieldError.field as keyof EmployeeFormSchema, { message: fieldError.message });
    });
  }, [serverErrors, setError]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.body}>
        <div className={styles.grid}>
          <Field label="First name" required error={errors.firstName?.message}>
            <TextInput {...register('firstName')} invalid={!!errors.firstName} placeholder="Ada" autoFocus />
          </Field>
          <Field label="Last name" required error={errors.lastName?.message}>
            <TextInput {...register('lastName')} invalid={!!errors.lastName} placeholder="Lovelace" />
          </Field>

          <Field label="Email" required error={errors.email?.message} className={styles.full}>
            <TextInput
              type="email"
              {...register('email')}
              invalid={!!errors.email}
              placeholder="ada@company.com"
            />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <TextInput {...register('phone')} invalid={!!errors.phone} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Location" error={errors.location?.message}>
            <TextInput {...register('location')} invalid={!!errors.location} placeholder="Bengaluru, IN" />
          </Field>

          <Field label="Job title" required error={errors.jobTitle?.message}>
            <TextInput
              {...register('jobTitle')}
              invalid={!!errors.jobTitle}
              placeholder="Software Engineer"
            />
          </Field>
          <Field label="Department" required error={errors.department?.message}>
            <Select {...register('department')} invalid={!!errors.department}>
              <option value="" disabled>
                Select department
              </option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Employment type" error={errors.employmentType?.message}>
            <Select {...register('employmentType')}>
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <Select {...register('status')}>
              {EMPLOYEE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Hire date" error={errors.hireDate?.message}>
            <TextInput type="date" {...register('hireDate')} invalid={!!errors.hireDate} />
          </Field>
          <div />

          <Field
            label="Short bio"
            error={errors.bio?.message}
            hint="Optional — a sentence or two."
            className={styles.full}
          >
            <Textarea
              {...register('bio')}
              invalid={!!errors.bio}
              rows={3}
              placeholder="A short note about this person…"
            />
          </Field>
        </div>
      </div>

      <div className={styles.footer}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {employee ? 'Save changes' : 'Add employee'}
        </Button>
      </div>
    </form>
  );
}
