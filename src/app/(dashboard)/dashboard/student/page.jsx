// File: src/app/(dashboard)/dashboard/student/page.jsx

'use client';

import { useCurrentUser } from '@/lib/hooks/use-user';
import { useCurrentStudent } from '@/lib/hooks/use-student';
import { useMyPayments } from '@/lib/hooks/use-payments';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DashboardSkeleton } from '@/components/shared/loading';
import { DollarSign, BookOpen, Award, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentDashboard() {
  const router = useRouter();
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();
  
  // Clear the redirecting flag when dashboard loads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('redirecting');
    }
  }, []);
  
  // Only fetch student data if user is actually a student
  const shouldFetchStudentData = user?.role === 'student';
  
  const { data: student, isLoading: studentLoading, error: studentError } = useCurrentStudent({
    enabled: shouldFetchStudentData,
  });
  
  const { data: payments = [], isLoading: paymentsLoading } = useMyPayments({
    enabled: shouldFetchStudentData,
  });

  // Redirect non-students to appropriate dashboard
  useEffect(() => {
    if (!userLoading && user) {
      if (user.role === 'admin' || user.is_staff || user.is_superuser) {
        router.push('/dashboard/admin');
      } else if (user.role === 'teacher') {
        router.push('/dashboard/teacher');
      }
    }
  }, [user, userLoading, router]);

  // Redirect to profile completion if student profile doesn't exist
  useEffect(() => {
    if (!studentLoading && !student && user?.role === 'student' && !studentError) {
      router.push('/dashboard/student/complete-profile');
    }
  }, [student, studentLoading, user, router, studentError]);

  // Loading state
  if (userLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (userError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load user data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check if user is not a student
  if (!user || user.role !== 'student') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This page is only accessible to students. You are logged in as: <strong>{user?.role || 'unknown'}</strong>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Student loading state
  if (studentLoading) {
    return <DashboardSkeleton />;
  }

  // Student not found - show error only if there's an actual error
  if (studentError && !student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Profile</AlertTitle>
          <AlertDescription>
            {studentError.response?.status === 404 
              ? 'Your student profile hasn\'t been created yet. Redirecting to profile setup...'
              : 'Failed to load your student profile. Please try refreshing the page.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Still loading or no student (will redirect)
  if (!student) {
    return <DashboardSkeleton />;
  }

  // Calculate total paid from payments (only if there are payments)
  const totalPaid = Array.isArray(payments) && payments.length > 0
    ? payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.first_name}!</h1>
        <p className="text-gray-500 mt-1">Here's your academic overview</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Student ID"
          value={student?.student_id || 'N/A'}
          icon={Award}
          description="Your unique identifier"
        />
        <StatsCard
          title="Class"
          value={student?.class_level || 'N/A'}
          icon={BookOpen}
          description={student?.display_stream || student?.section || 'Section'}
        />
        {payments.length > 0 && (
          <StatsCard
            title="Total Paid"
            value={formatCurrency(totalPaid)}
            icon={DollarSign}
            description={`${payments.length} payment${payments.length !== 1 ? 's' : ''} made`}
            className="text-green-600"
          />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {student?.subjects && student.subjects.length > 0 ? (
              <ul className="space-y-2">
                {student.subjects.map((subject, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>{subject}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No subjects assigned yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <p className="text-sm text-gray-500">Loading payments...</p>
            ) : payments && payments.length > 0 ? (
              <div className="space-y-3">
                {payments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{payment.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(parseFloat(payment.amount))}
                    </span>
                  </div>
                ))}
                {payments.length > 3 && (
                  <button
                    onClick={() => router.push('/dashboard/student/payments')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all {payments.length} payments →
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">No payments recorded yet</p>
                <p className="text-xs text-gray-400">
                  Payment history will appear here once payments are made
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
