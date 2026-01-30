// File: src/app/(dashboard)/dashboard/teacher/page.jsx

// ==================== src/app/(dashboard)/dashboard/teacher/page.jsx ====================
'use client';

import { useCurrentUser } from '@/lib/hooks/use-user';
import { useAssignments } from '@/lib/hooks/use-assignments';
import { useStudents } from '@/lib/hooks/use-student';
import { useQuery } from '@tanstack/react-query';
import { submissionsApi, gradesApi } from '@/lib/api';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, ClipboardCheck, Award } from 'lucide-react';
import { useEffect } from 'react';

function QuickActionButton({ href, children }) {
  return (
    <a
      href={href}
      className="block w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-center font-medium transition-colors"
    >
      {children}
    </a>
  );
}

export default function TeacherDashboard() {
  const { data: user } = useCurrentUser();
  const { data: assignments } = useAssignments();
  const { data: students } = useStudents();
  
  // Fetch pending submissions (not graded yet)
  const { data: submissions } = useQuery({
    queryKey: ['submissions', 'pending'],
    queryFn: () => submissionsApi.getAll({ status: 'pending' }),
    enabled: !!user && user.role === 'teacher',
  });

  // Fetch grade statistics (overall for all students, no student_id needed)
  const { data: gradeStats, isLoading: gradeStatsLoading, error: gradeStatsError } = useQuery({
    queryKey: ['grades', 'stats'],
    queryFn: () => gradesApi.getStats(), // No student_id - gets overall stats
    enabled: !!user && user.role === 'teacher',
  });

  // Debug logging
  useEffect(() => {
    if (gradeStats) {
      console.log('📊 Grade Stats Response:', gradeStats);
      console.log('📊 Average Grade:', gradeStats?.average_grade);
      console.log('📊 Overall Average:', gradeStats?.overall?.average);
    }
    if (gradeStatsError) {
      console.error('❌ Grade Stats Error:', gradeStatsError);
    }
  }, [gradeStats, gradeStatsError]);

  const totalStudents = students?.length || 0;
  const totalAssignments = assignments?.length || 0;
  const pendingGrading = submissions?.filter(s => !s.is_graded)?.length || 0;
  
  // Calculate average grade from stats - handle both possible response structures
  let avgGrade = null;
  
  if (gradeStats) {
    // Try different possible locations for the average
    avgGrade = gradeStats.average_grade ?? gradeStats.overall?.average ?? null;
  }
  
  // Format the average grade display
  const avgGradeDisplay = avgGrade !== null && avgGrade !== undefined && !isNaN(avgGrade)
    ? `${Math.round(avgGrade)}%`
    : gradeStatsLoading 
      ? 'Loading...'
      : gradeStats?.total_grades === 0
        ? 'No grades'
        : 'N/A';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.first_name || 'Teacher'}!</h1>
        <p className="text-gray-500 mt-1">Here's your teaching overview</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={totalStudents.toString()}
          icon={Users}
          description="Across all classes"
        />
        <StatsCard
          title="Assignments"
          value={totalAssignments.toString()}
          icon={BookOpen}
          description="Total created"
        />
        <StatsCard
          title="Pending Grading"
          value={pendingGrading.toString()}
          icon={ClipboardCheck}
          description="Submissions to grade"
          className="text-orange-600"
        />
        <StatsCard
          title="Avg. Grade"
          value={avgGradeDisplay}
          icon={Award}
          description="Class average"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments && assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.slice(0, 5).map((assignment) => (
                  <div key={assignment.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-gray-500">{assignment.subject}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No assignments yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickActionButton href="/dashboard/teacher/attendance">
              Mark Attendance
            </QuickActionButton>
            <QuickActionButton href="/dashboard/teacher/grades">
              Enter Grades
            </QuickActionButton>
            <QuickActionButton href="/dashboard/teacher/assignments">
              Create Assignment
            </QuickActionButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
