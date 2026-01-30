'use client';

import React from 'react';
import { Download, Printer, ArrowLeft, Calendar, User, School, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentStudent } from '@/lib/hooks/use-student';
import { useCurrentUser } from '@/lib/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSkeleton } from '@/components/shared/loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const TranscriptPage = () => {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: student, isLoading: studentLoading } = useCurrentStudent();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // For now, we'll just print. In production, generate PDF server-side
    window.print();
  };

  if (userLoading || studentLoading) {
    return <DashboardSkeleton />;
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Student Profile Not Found</AlertTitle>
          <AlertDescription>
            Your student profile hasn't been created yet. Please contact the administration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Bar - Hidden when printing */}
      <div className="bg-white border-b border-gray-200 print:hidden mb-6">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard/student')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Document */}
      <div className="max-w-5xl mx-auto p-6 print:p-0">
        <div className="bg-white shadow-lg print:shadow-none rounded-lg">
          {/* Header */}
          <div className="border-b-4 border-blue-600 p-8 print:border-b-2">
            <div className="text-center mb-6">
              <School className="w-16 h-16 mx-auto mb-2 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Wisdom High School</h1>
              <p className="text-gray-600">Academic Excellence Center</p>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Academic Transcript
            </h2>
            
            <div className="flex justify-center">
              <div className="inline-block bg-blue-100 px-4 py-2 rounded-lg">
                <p className="text-blue-900 font-semibold">
                  Academic Year {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Student Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="font-medium text-gray-900">{student.student_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-medium text-gray-900">{student.class_level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Section</p>
                <p className="font-medium text-gray-900 capitalize">{student.section}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Education Stream</p>
                <p className="font-medium text-gray-900">
                  {student.display_stream || student.section}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date Generated</p>
                <p className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Enrolled Subjects */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Enrolled Subjects
            </h3>
            
            {student.subjects && student.subjects.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {student.subjects.map((subject, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">{subject}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No subjects enrolled</p>
            )}
          </div>

          {/* Academic Performance Notice */}
          <div className="p-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Coming Soon</AlertTitle>
              <AlertDescription>
                Full academic performance records including grades, exams, and assessments will be available here. 
                Currently, you can view your grades in the "My Grades" section and exam results in "My Results".
              </AlertDescription>
            </Alert>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {student.subjects?.length || 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Class Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">
                    {student.class_level}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Academic Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date().getFullYear()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">View Detailed Records</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => router.push('/dashboard/student/grades')}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
                >
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">My Grades</p>
                    <p className="text-xs text-gray-600">View all grades</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/student/results')}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">My Results</p>
                    <p className="text-xs text-gray-600">View exam results</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/student/subjects')}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
                >
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">My Subjects</p>
                    <p className="text-xs text-gray-600">View all subjects</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-8 text-center text-sm text-gray-600 print:block">
            <p className="mb-2">This is an official transcript generated by Wisdom High School</p>
            <p>Date of Issue: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            
            <div className="mt-8 pt-6 border-t border-gray-200 hidden print:block">
              <div className="flex justify-around max-w-2xl mx-auto">
                <div>
                  <div className="border-t-2 border-gray-400 pt-2 w-48">
                    <p className="font-semibold">Class Teacher</p>
                  </div>
                </div>
                <div>
                  <div className="border-t-2 border-gray-400 pt-2 w-48">
                    <p className="font-semibold">Principal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TranscriptPage;
