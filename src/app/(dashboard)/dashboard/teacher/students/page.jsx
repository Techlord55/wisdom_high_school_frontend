// ===== src/app/(dashboard)/dashboard/teacher/students/page.jsx =====
'use client';

import { useState } from 'react';
import { useStudents } from '@/lib/hooks/use-student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap } from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/loading';

export default function TeacherStudents() {
  const [selectedClass, setSelectedClass] = useState('all');
  const { data: students, isLoading } = useStudents({ 
    class_level: selectedClass === 'all' ? undefined : selectedClass 
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Students</h1>
        <p className="text-gray-500 mt-1">View and manage students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="Form 1">Form 1</SelectItem>
              <SelectItem value="Form 2">Form 2</SelectItem>
              <SelectItem value="Form 3">Form 3</SelectItem>
              <SelectItem value="Form 4">Form 4</SelectItem>
              <SelectItem value="Form 5">Form 5</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Students ({students?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students && students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono font-semibold">
                      {student.student_id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.user.full_name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.class_level}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="capitalize">{student.section}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No students found. Select a class to view students.
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
