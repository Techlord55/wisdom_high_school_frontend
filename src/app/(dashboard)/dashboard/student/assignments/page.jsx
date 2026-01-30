// src/app/(dashboard)/dashboard/student/assignments/page.jsx
'use client';

import { useState } from 'react';
import { useAssignments, useSubmitAssignment } from '@/lib/hooks/use-assignments';
import { useCurrentStudent } from '@/lib/hooks/use-student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Clock, CheckCircle, Upload, FileText } from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/loading';
import { toast } from 'sonner';

function getStatusBadge(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  
  if (due < now) {
    return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
  } else if ((due - now) / (1000 * 60 * 60 * 24) <= 3) {
    return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
  }
  return <Badge className="bg-green-100 text-green-800">Active</Badge>;
}

function SubmitDialog({ assignment }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const submitMutation = useSubmitAssignment();

  const handleSubmit = () => {
    submitMutation.mutate(
      {
        assignment: assignment.id,
        submission_text: text,
        attachment_url: url || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Assignment submitted successfully');
          setOpen(false);
          setText('');
          setUrl('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Submit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Assignment</DialogTitle>
          <DialogDescription>{assignment.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Your Answer</label>
            <Textarea
              placeholder="Type your answer here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Attachment URL (Optional)</label>
            <Input
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload your file to Google Drive or Dropbox and paste the link here
            </p>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={!text && !url}
            className="w-full"
          >
            Submit Assignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



export default function StudentAssignments() {  
 const { data: student, isLoading: studentLoading } = useCurrentStudent();

  const { data, isLoading: assignmentsLoading } = useAssignments({
    class_level: student?.class_level,
    // This tells the hook: "Don't even try until student data is back"
    enabled: !!student?.class_level, 
  });

  // Ensure we always have an array for the .filter() calls below
  const assignments = Array.isArray(data) ? data : [];

  // Important: Show loading state if either is loading
  if (studentLoading || (assignmentsLoading && !!student?.class_level)) {
    return <DashboardSkeleton />;
  }

  // Now .filter() will never fail
  const pendingAssignments = assignments.filter(a => {
    const due = new Date(a.due_date);
    return due > new Date();
  });

  const overdueAssignments = assignments.filter(a => {
    const due = new Date(a.due_date);
    return due < new Date();
  });



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Assignments</h1>
        <p className="text-gray-500 mt-1">View and submit assignments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingAssignments.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueAssignments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments && assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        {assignment.title}
                      </div>
                    </TableCell>
                    <TableCell>{assignment.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(assignment.due_date)}</TableCell>
                    <TableCell>
                      <SubmitDialog assignment={assignment} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No assignments yet
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