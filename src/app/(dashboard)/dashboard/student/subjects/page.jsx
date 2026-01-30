// src/app/(dashboard)/dashboard/student/subjects/page.jsx
'use client';

import { useCurrentStudent } from '@/lib/hooks/use-student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap } from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/loading';

export default function StudentSubjects() {
  const { data: student, isLoading } = useCurrentStudent();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Subjects</h1>
        <p className="text-gray-500 mt-1">View your enrolled subjects</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Class Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Class Level</p>
                <p className="text-lg font-semibold">{student?.class_level || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Section</p>
                <p className="text-lg font-semibold capitalize">
                  {student?.section || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Subjects</p>
                <p className="text-lg font-semibold">
                  {student?.subjects?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Enrolled Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student?.subjects && student.subjects.length > 0 ? (
              <ul className="space-y-3">
                {student.subjects.map((subject, index) => (
                  <li 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{subject}</p>
                      <p className="text-xs text-gray-500">
                        {student.class_level} - {student.section}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No subjects assigned yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Contact the administration to enroll in subjects
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}