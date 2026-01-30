// src/app/(dashboard)/dashboard/student/attendance/page.jsx
'use client';

import { useMyAttendance, useAttendanceStats } from '@/lib/hooks/use-attendance';
import { useCurrentUser } from '@/lib/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/loading';

function getStatusBadge(status) {
  const variants = {
    present: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    absent: { color: 'bg-red-100 text-red-800', icon: XCircle },
    late: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    excused: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  };
  
  const variant = variants[status] || variants.present;
  const Icon = variant.icon;
  
  return (
    <Badge className={variant.color}>
      <Icon className="h-3 w-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function StudentAttendance() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: attendance, isLoading: attendanceLoading } = useMyAttendance();
  const { data: stats, isLoading: statsLoading } = useAttendanceStats(user?.id);

  if (userLoading || attendanceLoading || statsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-gray-500 mt-1">View your attendance records</p>
      </div>

      {stats && (
        <div className="grid gap-6 md:grid-cols-4">
          <StatsCard
            title="Total Days"
            value={stats.total.toString()}
            icon={Calendar}
            description="Total recorded days"
          />
          <StatsCard
            title="Present"
            value={stats.present.toString()}
            icon={CheckCircle}
            description={`${stats.attendance_rate.toFixed(1)}% attendance rate`}
            className="text-green-600"
          />
          <StatsCard
            title="Absent"
            value={stats.absent.toString()}
            icon={XCircle}
            description="Days absent"
            className="text-red-600"
          />
          <StatsCard
            title="Late"
            value={stats.late.toString()}
            icon={Clock}
            description="Days late"
            className="text-yellow-600"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance && attendance.length > 0 ? (
                attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{record.subject}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-gray-500">
                      {record.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    No attendance records yet
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