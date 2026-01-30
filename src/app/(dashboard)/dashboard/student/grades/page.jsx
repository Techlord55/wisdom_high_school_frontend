// File: src/app/(dashboard)/dashboard/student/grades/page.jsx


// ==================== src/app/(dashboard)/dashboard/student/grades/page.jsx ====================
'use client';

import { useState } from 'react';
import { useMyGrades, useGradeStats } from '@/lib/hooks/use-grades';
import { useCurrentUser } from '@/lib/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/dashboard/stats-card';
import { TrendingUp, Award } from 'lucide-react';

function getPercentageColor(percentage) {
  if (percentage >= 75) return 'text-green-600 font-semibold';
  if (percentage >= 60) return 'text-blue-600 font-semibold';
  if (percentage >= 50) return 'text-yellow-600 font-semibold';
  return 'text-red-600 font-semibold';
}

function getGradeBadgeColor(grade) {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
  if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

export default function StudentGrades() {
  const { data: user } = useCurrentUser();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('all');

  const { data: grades } = useMyGrades({
    subject: selectedSubject === 'all' ? undefined : selectedSubject,
    term: selectedTerm === 'all' ? undefined : selectedTerm,
  });

  const { data: stats } = useGradeStats(user?.id);

  const subjects = Array.from(new Set(grades?.map(g => g.subject) || []));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Grades</h1>
        <p className="text-gray-500 mt-1">View your academic performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Overall Average"
          value={`${stats?.overall.average.toFixed(1)}%`}
          icon={TrendingUp}
          description={`Based on ${stats?.overall.total_exams || 0} exams`}
        />
        <StatsCard
          title="Highest Grade"
          value={`${stats?.overall.highest.toFixed(1)}%`}
          icon={Award}
          description="Personal best"
          className="text-green-600"
        />
        <StatsCard
          title="Total Subjects"
          value={Object.keys(stats?.by_subject || {}).length}
          icon={Award}
          description="Active subjects"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger>
                <SelectValue placeholder="All Terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="1">Term 1</SelectItem>
                <SelectItem value="2">Term 2</SelectItem>
                <SelectItem value="3">Term 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grade History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades && grades.length > 0 ? (
                grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.subject}</TableCell>
                    <TableCell>{grade.exam_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {grade.exam_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {grade.marks_obtained}/{grade.total_marks}
                    </TableCell>
                    <TableCell>
                      <span className={getPercentageColor(grade.percentage)}>
                        {grade.percentage.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getGradeBadgeColor(grade.grade_letter)}>
                        {grade.grade_letter}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {grade.exam_date
                        ? new Date(grade.exam_date).toLocaleDateString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No grades available yet
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
