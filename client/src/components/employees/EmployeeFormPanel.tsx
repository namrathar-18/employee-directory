import { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { EmployeeForm } from './EmployeeForm';
import { useCreateEmployee, useUpdateEmployee } from '../../hooks/useEmployees';
import { useToast } from '../../context/ToastProvider';
import { parseApiError, type ApiFieldError } from '../../lib/api';
import type { EmployeeFormSchema } from '../../lib/employeeSchema';
import type { Employee, EmployeeFormValues } from '../../types/employee';

interface EmployeeFormPanelProps {
  open: boolean;
  employee?: Employee;
  onClose: () => void;
}

/** Turns the form values into an API payload, dropping empty optional fields. */
function toPayload(values: EmployeeFormSchema): EmployeeFormValues {
  const payload: EmployeeFormValues = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
    department: values.department,
    jobTitle: values.jobTitle,
    location: values.location,
    employmentType: values.employmentType,
    status: values.status,
    bio: values.bio,
  };
  if (values.hireDate) payload.hireDate = values.hireDate;
  return payload;
}

export function EmployeeFormPanel({ open, employee, onClose }: EmployeeFormPanelProps) {
  const toast = useToast();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const [serverErrors, setServerErrors] = useState<ApiFieldError[]>([]);

  const submitting = createEmployee.isPending || updateEmployee.isPending;

  const handleSubmit = async (values: EmployeeFormSchema) => {
    setServerErrors([]);
    const payload = toPayload(values);

    try {
      if (employee) {
        await updateEmployee.mutateAsync({ id: employee.id, values: payload });
        toast.success(`${payload.firstName}'s profile was updated`);
      } else {
        await createEmployee.mutateAsync(payload);
        toast.success(`${payload.firstName} was added to the directory`);
      }
      onClose();
    } catch (error) {
      const { message, fieldErrors } = parseApiError(error);
      setServerErrors(fieldErrors);
      toast.error(message);
    }
  };

  if (!open) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={employee ? 'Edit employee' : 'Add employee'}
      description={
        employee ? `Update ${employee.fullName}'s details` : 'Create a new employee record'
      }
    >
      <EmployeeForm
        key={employee?.id ?? 'new'}
        employee={employee}
        submitting={submitting}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Drawer>
  );
}
