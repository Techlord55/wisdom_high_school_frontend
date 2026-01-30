import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { toast } from 'sonner'; // Keep this import

export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: usersApi.getCurrent,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  // REMOVED: const { toast } = useToast(); 

  return useMutation({
    mutationFn: (data) => usersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'current'] });
      // UPDATED: Sonner uses toast('title', { options }) or toast.success()
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      // UPDATED: Sonner uses toast.error()
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useUsers(role) {
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => usersApi.getAll({ role }),
  });
}