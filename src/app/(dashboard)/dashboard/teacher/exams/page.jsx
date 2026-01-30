// ==================== src/app/(dashboard)/dashboard/teacher/exams/page.jsx ====================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/use-user';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardSkeleton } from '@/components/shared/loading';
import { Plus, BookOpen, Calendar, Edit, Users, AlertCircle, FileText } from 'lucide-react';

export default function TeacherExamsPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();

  // Fetch all exams
  const { data: exams = [], isLoading: examsLoading, error } = useQuery({
    queryKey: ['exams'],
    queryFn: () => examsApi.getAll(),
    enabled: !!user && user.role === 'teacher',
  });

  const handleViewExam = (exam) => {
    // Navigate to exam management page for this specific exam
    router.push(`/dashboard/teacher/exam-management?exam=${exam.id}`);
  };

  const handleEnterGrades = (exam, cls, subject) => {
    // Navigate to grades page with exam, class, and subject pre-selected
    const params = new URLSearchParams({
      exam_id: exam.id,
      exam_name: exam.exam_name,
      class_level: cls,
      subject: subject,
      total_marks: exam.total_marks,
      term: exam.term,
      academic_year: exam.academic_year,
      start_date: exam.start_date,
    });
    router.push(`/dashboard/teacher/grades?${params.toString()}`);
  };

  const getTermColor = (term) => {
    const colors = {
      '1': 'bg-indigo-100 text-indigo-800',
      '2': 'bg-cyan-100 text-cyan-800',
      '3': 'bg-teal-100 text-teal-800'
    };
    return colors[term] || 'bg-gray-100 text-gray-800';
  };

  const getExamTypeColor = (type) => {
    const colors = {
      'quiz': 'bg-blue-100 text-blue-800',
      'test': 'bg-green-100 text-green-800',
      'midterm': 'bg-yellow-100 text-yellow-800',
      'final': 'bg-red-100 text-red-800',
      'mock': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatExamType = (type) => {
    const types = {
      'quiz': 'Quiz',
      'test': 'Class Test',
      'midterm': 'Mid-Term Exam',
      'final': 'Final Exam',
      'mock': 'Mock Exam'
    };
    return types[type] || type;
  };

  const formatTerm = (term) => {
    return `Term ${term}`;
  };

  // Filter exams that match teacher's subjects and classes
  const teacherProfile = user?.teacher_profile;
  const filteredExams = exams.filter(exam => {
    if (!teacherProfile) return false;
    
    const teacherSubjects = teacherProfile.subjects || [];
    const teacherClasses = teacherProfile.classes_assigned || [];
    
    const examSubjects = exam.subjects || [];
    const examClasses = exam.classes || [];
    
    // Check if teacher's subjects overlap with exam subjects
    const hasMatchingSubject = examSubjects.includes('all') || 
      examSubjects.some(s => teacherSubjects.includes(s));
    
    // Check if teacher's classes overlap with exam classes
    const hasMatchingClass = examClasses.includes('all') || 
      examClasses.some(c => teacherClasses.includes(c));
    
    return hasMatchingSubject && hasMatchingClass;
  });

  if (userLoading || examsLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>Error loading exams: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Exams</h1>
          <p className="text-gray-500 mt-1">View and manage exams for your classes</p>
        </div>
        <Button onClick={() => router.push('/dashboard/teacher/exam-management')}>
          <FileText className="h-4 w-4 mr-2" />
          Manage Submissions
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredExams.length}</div>
            <p className="text-xs text-muted-foreground">
              Assigned to you
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredExams.filter(e => new Date(e.end_date) >= new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently ongoing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Subjects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teacherProfile?.subjects?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Subjects teaching
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExams && filteredExams.length > 0 ? (
          filteredExams.map((exam) => {
            const examSubjects = exam.subjects?.includes('all') ? ['All Subjects'] : exam.subjects || [];
            const examClasses = exam.classes?.includes('all') ? ['All Classes'] : exam.classes || [];
            
            // Get teacher's relevant classes and subjects for this exam
            const relevantClasses = examClasses.filter(c => 
              c === 'All Classes' || teacherProfile?.classes_assigned?.includes(c)
            );
            const relevantSubjects = examSubjects.filter(s => 
              s === 'All Subjects' || teacherProfile?.subjects?.includes(s)
            );

            return (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{exam.exam_name}</CardTitle>
                      <CardDescription className="mt-1">
                        {exam.academic_year}
                      </CardDescription>
                    </div>
                    <Badge className={getTermColor(exam.term)}>
                      {formatTerm(exam.term)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className={getExamTypeColor(exam.exam_type)}>
                      {formatExamType(exam.exam_type)}
                    </Badge>
                    <span className="text-gray-600">{exam.total_marks} marks</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {new Date(exam.start_date).toLocaleDateString()} - {new Date(exam.end_date).toLocaleDateString()}
                  </div>

                  <div className="text-sm">
                    <p className="font-medium text-gray-700 mb-1">Your Classes:</p>
                    <div className="flex flex-wrap gap-1">
                      {relevantClasses.map((cls, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium text-gray-700 mb-1">Your Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {relevantSubjects.map((subj, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {subj}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewExam(exam)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        // For simplicity, use first relevant class and subject
                        const cls = relevantClasses[0] === 'All Classes' ? teacherProfile?.classes_assigned?.[0] : relevantClasses[0];
                        const subj = relevantSubjects[0] === 'All Subjects' ? teacherProfile?.subjects?.[0] : relevantSubjects[0];
                        handleEnterGrades(exam, cls, subj);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Enter Grades
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">No exams assigned to you yet</p>
              <p className="text-sm text-gray-400">
                Exams will appear here once they are created by the admin for your classes and subjects.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
