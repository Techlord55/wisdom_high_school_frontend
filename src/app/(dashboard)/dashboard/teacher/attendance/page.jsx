// ===== src/app/(dashboard)/dashboard/teacher/attendance/page.jsx =====
'use client';

import { useState } from 'react';
import { useStudents } from '@/lib/hooks/use-student';
import { useBulkMarkAttendance } from '@/lib/hooks/use-attendance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/loading';
import { toast } from 'sonner';

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});

  const { data: students, isLoading } = useStudents({ class_level: selectedClass });
  const markAttendanceMutation = useBulkMarkAttendance();

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    const records = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      student_id: studentId,
      status,
    }));

    if (records.length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    markAttendanceMutation.mutate({
      date: selectedDate,
      subject: selectedSubject,
      records,
    });
  };

  const statusButtons = [
    { value: 'present', icon: CheckCircle, color: 'bg-green-500 hover:bg-green-600', label: 'P' },
    { value: 'absent', icon: XCircle, color: 'bg-red-500 hover:bg-red-600', label: 'A' },
    { value: 'late', icon: Clock, color: 'bg-yellow-500 hover:bg-yellow-600', label: 'L' },
    { value: 'excused', icon: AlertCircle, color: 'bg-blue-500 hover:bg-blue-600', label: 'E' },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-gray-500 mt-1">Record student attendance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Form 1">Form 1</SelectItem>
                  <SelectItem value="Form 2">Form 2</SelectItem>
                  <SelectItem value="Form 3">Form 3</SelectItem>
                  <SelectItem value="Form 4">Form 4</SelectItem>
                  <SelectItem value="Form 5">Form 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle>Students - {selectedClass}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students && students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono">{student.student_id}</TableCell>
                      <TableCell className="font-medium">{student.user.full_name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {statusButtons.map(({ value, icon: Icon, color, label }) => (
                            <button
                              key={value}
                              onClick={() => handleStatusChange(student.id, value)}
                              className={`${
                                attendanceRecords[student.id] === value
                                  ? color
                                  : 'bg-gray-200 hover:bg-gray-300'
                              } text-white px-3 py-1 rounded transition-colors`}
                              title={value}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                      Select a class to view students
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {students && students.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSubmit} disabled={markAttendanceMutation.isPending}>
                  {markAttendanceMutation.isPending ? 'Submitting...' : 'Submit Attendance'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}