// ==================== src/lib/hooks/use-attendance.js ====================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/lib/api';
import { toast } from 'sonner';

export function useMyAttendance(params) {
  return useQuery({
    queryKey: ['attendance', 'my', params],
    queryFn: () => attendanceApi.getMy(params),
  });
}

export function useAttendance(params) {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: () => attendanceApi.getAll(params),
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => attendanceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance marked successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to mark attendance');
    },
  });
}

export function useBulkMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => attendanceApi.bulkMark(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success(`Attendance marked for ${data.count} students`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to mark attendance');
    },
  });
}

export function useAttendanceStats(studentId) {
  return useQuery({
    queryKey: ['attendance', 'stats', studentId],
    queryFn: () => attendanceApi.getStats(studentId),
    enabled: !!studentId,
  });
}