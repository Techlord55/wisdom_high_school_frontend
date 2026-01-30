// ===== src/app/(dashboard)/dashboard/admin/students/page.jsx =====
'use client';

import { useState } from 'react';
import { useStudents } from '@/lib/hooks/use-student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Users, Search, GraduationCap } from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/loading';

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const { data: students, isLoading } = useStudents();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const filteredStudents = students?.filter(s => {
    const matchesSearch = s.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !classFilter || classFilter === 'all' || s.class_level === classFilter;
    return matchesSearch && matchesClass;
  }) || [];

  const totalStudents = students?.length || 0;
  const byClass = students?.reduce((acc, s) => {
    acc[s.class_level] = (acc[s.class_level] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Students</h1>
        <p className="text-gray-500 mt-1">View and manage all students</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={totalStudents.toString()}
          icon={Users}
          description="Across all classes"
        />
        <StatsCard
          title="Form 1"
          value={(byClass?.['Form 1'] || 0).toString()}
          icon={GraduationCap}
          description="Students"
        />
        <StatsCard
          title="Form 2"
          value={(byClass?.['Form 2'] || 0).toString()}
          icon={GraduationCap}
          description="Students"
        />
        <StatsCard
          title="Form 3"
          value={(byClass?.['Form 3'] || 0).toString()}
          icon={GraduationCap}
          description="Students"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Classes" />
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
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
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
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
                    <TableCell className="text-sm text-gray-500">
                      {new Date(student.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No students found
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