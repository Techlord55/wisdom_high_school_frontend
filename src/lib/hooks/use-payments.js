
// File: src/lib/hooks/use-payments.js
// ==================== src/lib/hooks/use-payments.js ====================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api';
import { toast } from 'sonner'; 

export function useMyPayments(options = {}) {
  return useQuery({
    queryKey: ['payments', 'my'],
    queryFn: paymentsApi.getMy,
    retry: false, // Don't retry on 404
    placeholderData: [], // Return empty array while loading
    ...options, // Allow enabled: false to be passed
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: paymentsApi.getAll,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => paymentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment initiated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create payment');
    },
  });
}

export function usePayment(id) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.getById(id),
    enabled: !!id,
  });
}