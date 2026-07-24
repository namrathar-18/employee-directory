import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from '../lib/api';
import type {
  Employee,
  EmployeeFormValues,
  EmployeeQuery,
  PaginatedEmployees,
} from '../types/employee';

const LIST_KEY = 'employees';

export function useEmployees(query: EmployeeQuery) {
  return useQuery({
    queryKey: [LIST_KEY, query],
    queryFn: async () => {
      const { data } = await api.get<PaginatedEmployees>('/employees', { params: query });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: [LIST_KEY, 'detail', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Employee }>(`/employees/${id}`);
      return data.data;
    },
    enabled: Boolean(id),
  });
}

function useInvalidateEmployees() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [LIST_KEY] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  };
}

export function useCreateEmployee() {
  const invalidate = useInvalidateEmployees();
  return useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const { data } = await api.post<{ data: Employee }>('/employees', values);
      return data.data;
    },
    onSuccess: invalidate,
  });
}

export function useUpdateEmployee() {
  const invalidate = useInvalidateEmployees();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: EmployeeFormValues }) => {
      const { data } = await api.patch<{ data: Employee }>(`/employees/${id}`, values);
      return data.data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteEmployee() {
  const invalidate = useInvalidateEmployees();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/${id}`);
      return id;
    },
    onSuccess: invalidate,
  });
}
