// ==================== src/lib/hooks/use-assignments.js ====================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi, submissionsApi } from '@/lib/api';
import { toast } from 'sonner';



// src/lib/hooks/use-assignments.js

export function useAssignments(params) {
  // Check if we actually have the required filter
  const hasRequiredParams = !!params?.class_level;

  return useQuery({
    queryKey: ['assignments', params],
    queryFn: () => assignmentsApi.getAll(params),
    // VALIDATION: Only run if we have the params AND enabled isn't explicitly false
    enabled: hasRequiredParams && params?.enabled !== false,
    // Optional: avoid retrying 3 times on auth failure
    retry: (failureCount, error) => {
      if (error.response?.status === 403) return false;
      return failureCount < 3;
    }
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => assignmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast.success('Assignment created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create assignment');
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => assignmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast.success('Assignment updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update assignment');
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => assignmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast.success('Assignment deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete assignment');
    },
  });
}

export function useSubmissions(params) {
  return useQuery({
    queryKey: ['submissions', params],
    queryFn: () => submissionsApi.getAll(params),
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => submissionsApi.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast.success('Assignment submitted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit assignment');
    },
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, marks, feedback }) =>
      submissionsApi.grade(id, marks, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast.success('Submission graded successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to grade submission');
    },
  });
}