// File: src/components/dashboard/role-guard.jsx

// ==================== src/components/dashboard/role-guard.jsx ====================
'use client';

import { useCurrentUser } from '@/lib/hooks/use-user';
import { redirect } from 'next/navigation';

export function RoleGuard({ allowedRoles, children }) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}