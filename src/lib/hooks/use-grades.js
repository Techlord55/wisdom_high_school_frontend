// ==================== src/lib/hooks/use-grades.js ====================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradesApi } from '@/lib/api';
import { toast } from 'sonner';

export function useMyGrades(params) {
  return useQuery({
    queryKey: ['grades', 'my', params],
    queryFn: () => gradesApi.getMy(params),
  });
}

export function useGrades(params) {
  return useQuery({
    queryKey: ['grades', params],
    queryFn: () => gradesApi.getAll(params),
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => gradesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      toast.success('Grade added successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add grade');
    },
  });
}

export function useBulkCreateGrades() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => gradesApi.bulkCreate(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      toast.success(`${data.length} grades added successfully`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add grades');
    },
  });
}

export function useGradeStats(studentId, params) {
  return useQuery({
    queryKey: ['grades', 'stats', studentId, params],
    queryFn: () => gradesApi.getStats(studentId, params),
    enabled: !!studentId,
  });
}