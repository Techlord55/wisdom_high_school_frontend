// ===== src/app/(dashboard)/dashboard/admin/payments/page.jsx =====
'use client';

import { usePayments } from '@/lib/hooks/use-payments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/loading';
import { formatCurrency } from '@/lib/utils';

function getStatusBadge(status) {
  const variants = {
    completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    partial: { color: 'bg-blue-100 text-blue-800', icon: Clock },
  };
  
  const variant = variants[status] || variants.pending;
  const Icon = variant.icon;
  
  return (
    <Badge className={variant.color}>
      <Icon className="h-3 w-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function AdminPayments() {
  const { data: payments, isLoading } = usePayments();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totalCollected = payments?.reduce((sum, p) => 
    p.payment_status === 'completed' ? sum + parseFloat(p.amount) : sum, 0
  ) || 0;
  
  const pendingAmount = payments?.reduce((sum, p) => 
    p.payment_status === 'pending' ? sum + parseFloat(p.amount) : sum, 0
  ) || 0;

  const completedCount = payments?.filter(p => p.payment_status === 'completed').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-gray-500 mt-1">Track all payments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard
          title="Total Collected"
          value={formatCurrency(totalCollected)}
          icon={DollarSign}
          description={`${completedCount} payments`}
          className="text-green-600"
        />
        <StatsCard
          title="Pending"
          value={formatCurrency(pendingAmount)}
          icon={Clock}
          description="Awaiting confirmation"
          className="text-yellow-600"
        />
        <StatsCard
          title="This Month"
          value={formatCurrency(totalCollected * 0.3)}
          icon={TrendingUp}
          description="30% of total"
        />
        <StatsCard
          title="Total Payments"
          value={(payments?.length || 0).toString()}
          icon={CheckCircle}
          description="All transactions"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments && payments.length > 0 ? (
                payments.slice(0, 20).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.student_name}
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {payment.payment_method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.payment_status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No payments yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}