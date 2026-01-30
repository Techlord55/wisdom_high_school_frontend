// ==================== src/app/(dashboard)/dashboard/teacher/exams/enter-grades/page.jsx ====================
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi, gradesApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DashboardSkeleton } from '@/components/shared/loading';
import { Save, ArrowLeft, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function EnterGradesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Get exam details from URL params
  const examDetails = {
    subject: searchParams.get('subject') || '',
    class_level: searchParams.get('class_level') || '',
    exam_type: searchParams.get('exam_type') || '',
    exam_name: searchParams.get('exam_name') || '',
    total_marks: searchParams.get('total_marks') || '100',
    term: searchParams.get('term') || '',
    academic_year: searchParams.get('academic_year') || new Date().getFullYear().toString(),
    exam_date: searchParams.get('exam_date') || '',
    remarks: searchParams.get('remarks') || '',
  };

  const [grades, setGrades] = useState({});

  // Fetch students for this class
  const { data: allStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });

  // Filter students by class level
  const students = allStudents?.filter(s => s.class_level === examDetails.class_level) || [];

  // Fetch existing grades for this exam
  const { data: existingGrades } = useQuery({
    queryKey: ['exam-grades', examDetails.exam_name, examDetails.subject, examDetails.term],
    queryFn: async () => {
      const params = {
        subject: examDetails.subject,
        exam_type: examDetails.exam_type,
        term: examDetails.term,
        academic_year: examDetails.academic_year,
      };
      return gradesApi.getAll(params);
    },
    enabled: !!examDetails.exam_name,
  });

  // Initialize grades from existing data
  useEffect(() => {
    if (existingGrades && existingGrades.length > 0) {
      const gradeMap = {};
      existingGrades.forEach(grade => {
        if (grade.exam_name === examDetails.exam_name) {
          gradeMap[grade.student] = {
            id: grade.id,
            marks_obtained: grade.marks_obtained,
            remarks: grade.remarks || '',
          };
        }
      });
      setGrades(gradeMap);
    }
  }, [existingGrades, examDetails.exam_name]);

  // Save grades mutation
  const saveGradesMutation = useMutation({
    mutationFn: async (gradeData) => {
      return gradesApi.bulkCreate({
        subject: examDetails.subject,
        exam_type: examDetails.exam_type,
        exam_name: examDetails.exam_name,
        total_marks: parseFloat(examDetails.total_marks),
        academic_year: examDetails.academic_year,
        term: examDetails.term,
        exam_date: examDetails.exam_date || null,
        grades: gradeData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher-exams']);
      queryClient.invalidateQueries(['exam-grades']);
      toast.success('Grades saved successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save grades');
    },
  });

  const handleGradeChange = (studentId, field, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSaveGrades = () => {
    // Prepare grade data
    const gradeData = Object.entries(grades)
      .filter(([_, data]) => data.marks_obtained !== undefined && data.marks_obtained !== '')
      .map(([studentId, data]) => ({
        student_id: parseInt(studentId),
        marks_obtained: parseFloat(data.marks_obtained),
        remarks: data.remarks || '',
      }));

    if (gradeData.length === 0) {
      toast.error('Please enter at least one grade');
      return;
    }

    saveGradesMutation.mutate(gradeData);
  };

  const calculatePercentage = (marks) => {
    if (!marks || !examDetails.total_marks) return 0;
    return ((parseFloat(marks) / parseFloat(examDetails.total_marks)) * 100).toFixed(1);
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'B-';
    if (percentage >= 60) return 'C+';
    if (percentage >= 55) return 'C';
    if (percentage >= 50) return 'C-';
    if (percentage >= 45) return 'D';
    return 'F';
  };

  if (studentsLoading) {
    return <DashboardSkeleton />;
  }

  if (!examDetails.exam_name) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Invalid exam details. Please go back and try again.</p>
            <Button onClick={() => router.push('/dashboard/teacher/exams')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/teacher/exams')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exams
          </Button>
          <h1 className="text-3xl font-bold">{examDetails.exam_name}</h1>
          <p className="text-gray-500 mt-1">
            {examDetails.subject} • {examDetails.class_level} • Term {examDetails.term} • {examDetails.academic_year}
          </p>
        </div>
        <Button 
          onClick={handleSaveGrades}
          disabled={saveGradesMutation.isPending}
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {saveGradesMutation.isPending ? 'Saving...' : 'Save All Grades'}
        </Button>
      </div>

      {/* Exam Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-gray-500">Type</Label>
            <p className="font-medium capitalize">{examDetails.exam_type}</p>
          </div>
          <div>
            <Label className="text-gray-500">Total Marks</Label>
            <p className="font-medium">{examDetails.total_marks}</p>
          </div>
          {examDetails.exam_date && (
            <div>
              <Label className="text-gray-500">Date</Label>
              <p className="font-medium">{new Date(examDetails.exam_date).toLocaleDateString()}</p>
            </div>
          )}
          <div>
            <Label className="text-gray-500">Students</Label>
            <p className="font-medium">{students.length}</p>
          </div>
        </CardContent>
      </Card>

      {/* Grades Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Marks for Each Student</CardTitle>
          <CardDescription>
            Enter marks out of {examDetails.total_marks}. Grade letters are calculated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <div className="space-y-4">
              {students.map((student) => {
                const studentGrade = grades[student.id] || {};
                const percentage = calculatePercentage(studentGrade.marks_obtained);
                const gradeLetter = getGradeLetter(parseFloat(percentage));
                
                return (
                  <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-medium">{student.user.full_name}</p>
                      <p className="text-sm text-gray-500">{student.student_id}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Label className="text-xs">Marks</Label>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min="0"
                            max={examDetails.total_marks}
                            step="0.5"
                            placeholder="0"
                            value={studentGrade.marks_obtained || ''}
                            onChange={(e) => handleGradeChange(student.id, 'marks_obtained', e.target.value)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">/ {examDetails.total_marks}</span>
                        </div>
                      </div>

                      {studentGrade.marks_obtained && (
                        <>
                          <div className="w-20 text-center">
                            <Label className="text-xs">%</Label>
                            <p className="text-lg font-semibold">{percentage}%</p>
                          </div>
                          
                          <div className="w-16">
                            <Label className="text-xs">Grade</Label>
                            <Badge 
                              variant={gradeLetter === 'F' ? 'destructive' : 'default'}
                              className="w-full justify-center text-sm"
                            >
                              {gradeLetter}
                            </Badge>
                          </div>
                        </>
                      )}

                      <div className="w-48">
                        <Label className="text-xs">Remarks (optional)</Label>
                        <Input
                          placeholder="Good, Needs improvement..."
                          value={studentGrade.remarks || ''}
                          onChange={(e) => handleGradeChange(student.id, 'remarks', e.target.value)}
                        />
                      </div>

                      {studentGrade.marks_obtained && (
                        <div className="w-8">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <p>No students found in {examDetails.class_level}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveGrades}
          disabled={saveGradesMutation.isPending}
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {saveGradesMutation.isPending ? 'Saving...' : 'Save All Grades'}
        </Button>
      </div>
    </div>
  );
}
