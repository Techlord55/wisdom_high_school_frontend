// File: src/lib/hooks/use-student.js
// ==================== src/lib/hooks/use-student.js ====================
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/lib/api';

export function useCurrentStudent(options = {}) {
  return useQuery({
    queryKey: ['student', 'current'],
    queryFn: studentsApi.getCurrent,
    retry: false, // Don't retry on 404
    ...options, // Allow enabled: false to be passed
  });
}

export function useStudents(params) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentsApi.getAll(params),
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsApi.getById(id),
    enabled: !!id,
  });
}
