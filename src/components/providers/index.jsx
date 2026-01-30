    // File: src/components/providers/index.jsx

'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiProvider } from './api-provider';
import { useState } from 'react';

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          {children}
        </ApiProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}