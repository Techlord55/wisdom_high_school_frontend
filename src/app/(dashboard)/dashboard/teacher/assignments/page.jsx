// ===== src/app/(dashboard)/dashboard/teacher/assignments/page.jsx =====
'use client';

import { useState } from 'react';
import { useAssignments, useCreateAssignment, useDeleteAssignment } from '@/lib/hooks/use-assignments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/loading';

export default function TeacherAssignments() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class_level: '',
    due_date: '',
    total_marks: '100',
    attachment_url: '',
    is_published: true,
  });

  const { data: assignments, isLoading } = useAssignments();
  const createMutation = useCreateAssignment();
  const deleteMutation = useDeleteAssignment();

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      total_marks: parseFloat(formData.total_marks),
      attachment_url: formData.attachment_url || undefined,
    }, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          subject: '',
          class_level: '',
          due_date: '',
          total_marks: '100',
          attachment_url: '',
          is_published: true,
        });
      }
    });
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Assignments</h1>
          <p className="text-gray-500 mt-1">Create and manage assignments</p>
        </div>
        <Dialog open={open} onValueChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={formData.subject} onValueChange={(v) => setFormData({...formData, subject: v})}>
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
                <div>
                  <label className="text-sm font-medium">Class</label>
                  <Select value={formData.class_level} onValueChange={(v) => setFormData({...formData, class_level: v})}>
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
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Total Marks</label>
                  <Input
                    type="number"
                    value={formData.total_marks}
                    onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Attachment URL (Optional)</label>
                <Input
                  value={formData.attachment_url}
                  onChange={(e) => setFormData({...formData, attachment_url: e.target.value})}
                  placeholder="https://..."
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full">
                Create Assignment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments ({assignments?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
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
                    <TableCell>{assignment.class_level}</TableCell>
                    <TableCell>
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {assignment.submission_count || 0} submissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No assignments yet. Create your first assignment!
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
