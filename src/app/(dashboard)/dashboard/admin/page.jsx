// File: src/app/(dashboard)/dashboard/admin/page.jsx

// ==================== src/app/(dashboard)/dashboard/admin/page.jsx ====================
'use client';

import { RoleGuard } from '@/components/dashboard/role-guard';
import { useUsers } from '@/lib/hooks/use-user';
import { usePayments } from '@/lib/hooks/use-payments';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboard() {
  const { data: allUsers } = useUsers();
  const { data: payments } = usePayments();

  const students = allUsers?.filter(u => u.role === 'student') || [];
  const teachers = allUsers?.filter(u => u.role === 'teacher') || [];
  const totalCollected = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <RoleGuard allowedRoles={['admin']}>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">School management overview</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={students.length.toString()}
          icon={GraduationCap}
          description="+12% from last month"
        />
        <StatsCard
          title="Total Teachers"
          value={teachers.length.toString()}
          icon={Users}
          description="+2 new this month"
        />
        <StatsCard
          title="Fees Collected"
          value={formatCurrency(totalCollected)}
          icon={DollarSign}
          description="+8% from last month"
        />
        <StatsCard
          title="Active Classes"
          value="12"
          icon={TrendingUp}
          description="All sections running"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Activity feed coming soon...</p>
        </CardContent>
      </Card>
    </div>
    </RoleGuard>
  );
}