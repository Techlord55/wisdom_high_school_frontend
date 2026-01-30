// ===== src/app/(dashboard)/dashboard/teacher/salary/page.jsx =====
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function TeacherSalary() {
  // In production, fetch real data from backend
  const salaryData = {
    monthlySalary: 250000,
    yearlyTotal: 3000000,
    lastPaymentDate: '2024-01-15',
    nextPaymentDate: '2024-02-15',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Salary Information</h1>
        <p className="text-gray-500 mt-1">View your salary details</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Monthly Salary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salaryData.monthlySalary)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Yearly Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salaryData.yearlyTotal)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Next Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {new Date(salaryData.nextPaymentDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Payment history feature coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}