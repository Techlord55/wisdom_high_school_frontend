// src/app/(dashboard)/dashboard/student/payments/page.jsx
'use client';

import { useMyPayments } from '@/lib/hooks/use-payments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DollarSign, CreditCard, CheckCircle, Clock } from 'lucide-react';
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

function getMethodBadge(method) {
  const labels = {
    mtn: 'MTN Mobile Money',
    orange: 'Orange Money',
    bank: 'Bank Transfer',
    cash: 'Cash',
    stripe: 'Card',
  };
  
  return (
    <Badge variant="outline">
      {labels[method] || method}
    </Badge>
  );
}

export default function StudentPayments() {
  const { data: payments, isLoading } = useMyPayments();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totalPaid = payments?.reduce((sum, p) => 
    p.payment_status === 'completed' ? sum + parseFloat(p.amount) : sum, 0
  ) || 0;
  
  const totalPending = payments?.reduce((sum, p) => 
    p.payment_status === 'pending' ? sum + parseFloat(p.amount) : sum, 0
  ) || 0;

  const totalFees = 350000; // Annual fees
  const balance = totalFees - totalPaid;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-gray-500 mt-1">View your payment records</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard
          title="Total Fees"
          value={formatCurrency(totalFees)}
          icon={DollarSign}
          description="Annual school fees"
        />
        <StatsCard
          title="Paid"
          value={formatCurrency(totalPaid)}
          icon={CheckCircle}
          description={`${payments?.filter(p => p.payment_status === 'completed').length || 0} payments`}
          className="text-green-600"
        />
        <StatsCard
          title="Pending"
          value={formatCurrency(totalPending)}
          icon={Clock}
          description={`${payments?.filter(p => p.payment_status === 'pending').length || 0} payments`}
          className="text-yellow-600"
        />
        <StatsCard
          title="Balance"
          value={formatCurrency(balance)}
          icon={CreditCard}
          description="Amount remaining"
          className={balance > 0 ? 'text-red-600' : 'text-green-600'}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments && payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.description}
                    </TableCell>
                    <TableCell>
                      {getMethodBadge(payment.payment_method)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.payment_status)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 font-mono">
                      {payment.transaction_id || '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No payment records yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {balance > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900">Outstanding Balance</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  You have an outstanding balance of {formatCurrency(balance)}. 
                  Please contact the administration office to make a payment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}