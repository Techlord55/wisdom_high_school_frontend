// src/app/providers.jsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { ApiProvider } from '@/components/providers/api-provider';

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
        gcTime: 10 * 60 * 1000, // 10 minutes - cache persists longer (formerly cacheTime)
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Don't refetch if data is still fresh
        retry: 1,
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        {children}
        <Toaster position="top-right" />
      </ApiProvider>
    </QueryClientProvider>
  );
}
