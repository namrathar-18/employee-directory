import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { EmployeeStats } from '../types/employee';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get<{ data: EmployeeStats }>('/stats');
      return data.data;
    },
  });
}
