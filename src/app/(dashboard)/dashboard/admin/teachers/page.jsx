// ===== src/app/(dashboard)/dashboard/admin/teachers/page.jsx =====
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Users, BookOpen, Clock, Key, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardSkeleton } from '@/components/shared/loading';

// List of available subjects
const SUBJECTS = [
  'Mathematics', 'English Language', 'French', 'Physics', 'Chemistry', 
  'Biology', 'History', 'Geography', 'Economics', 'Literature',
  'Computer Science', 'Physical Education', 'Arts', 'Music',
  'Religious Studies', 'Citizenship Education'
];

// List of available classes
const CLASS_LEVELS = [
  'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5',
  'Lower Sixth', 'Upper Sixth'
];

const DEPARTMENTS = [
  'Science', 'Arts & Humanities', 'Commercial', 'Technical', 'Languages', 'General'
];

// Generate a strong random password
const generatePassword = () => {
  const length = 12;
  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()-_=+[]{}|;:,.<>?'
  };
  
  // Ensure at least one character from each set
  let password = '';
  password += charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
  password += charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
  password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
  password += charset.special[Math.floor(Math.random() * charset.special.length)];
  
  // Fill the rest randomly
  const allChars = charset.uppercase + charset.lowercase + charset.numbers + charset.special;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export default function AdminTeachers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const queryClient = useQueryClient();

  // Fetch teachers
  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => teachersApi.getAll(),
  });

  // Create teacher mutation
  const createMutation = useMutation({
    mutationFn: teachersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
      setIsAddDialogOpen(false);
      toast.success('Teacher added successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add teacher');
    },
  });

  // Update teacher mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => teachersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
      setIsEditDialogOpen(false);
      setSelectedTeacher(null);
      toast.success('Teacher updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update teacher');
    },
  });

  // Delete teacher mutation
  const deleteMutation = useMutation({
    mutationFn: teachersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
      toast.success('Teacher deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete teacher');
    },
  });

  // Set password mutation
  const setPasswordMutation = useMutation({
    mutationFn: ({ id, password }) => teachersApi.setPassword(id, password),
    onSuccess: () => {
      setIsPasswordDialogOpen(false);
      setSelectedTeacher(null);
      setGeneratedPassword('');
      toast.success('Password set successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to set password');
    },
  });

  const handleAddTeacher = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      email: formData.get('email'),
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      department: formData.get('department'),
      specialization: formData.get('specialization'),
      phone_number: formData.get('phone_number'),
      years_of_experience: parseInt(formData.get('years_of_experience')) || 0,
      hours_per_week: parseInt(formData.get('hours_per_week')) || 0,
      subjects: formData.get('subjects')?.split(',').map(s => s.trim()).filter(Boolean) || [],
      classes_assigned: formData.get('classes')?.split(',').map(c => c.trim()).filter(Boolean) || [],
    };

    createMutation.mutate(data);
  };

  const handleUpdateTeacher = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      department: formData.get('department'),
      specialization: formData.get('specialization'),
      phone_number: formData.get('phone_number'),
      years_of_experience: parseInt(formData.get('years_of_experience')) || 0,
      hours_per_week: parseInt(formData.get('hours_per_week')) || 0,
      subjects: formData.get('subjects')?.split(',').map(s => s.trim()).filter(Boolean) || [],
      classes_assigned: formData.get('classes')?.split(',').map(c => c.trim()).filter(Boolean) || [],
    };

    updateMutation.mutate({ id: selectedTeacher.id, data });
  };

  const handleDelete = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteMutation.mutate(teacherId);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    // Also set it in the form inputs
    document.getElementById('password').value = newPassword;
    document.getElementById('confirm_password').value = newPassword;
    setShowPassword(true);
    setShowConfirmPassword(true);
  };

  const handleSetPassword = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setPasswordMutation.mutate({ id: selectedTeacher.id, password });
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = {
    total: teachers?.length || 0,
    withClasses: teachers?.filter(t => t.classes_assigned?.length > 0).length || 0,
    totalHours: teachers?.reduce((sum, t) => sum + (t.hours_per_week || 0), 0) || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Teachers</h1>
          <p className="text-gray-500 mt-1">Add, edit, and assign teachers to classes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddTeacher}>
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Create a new teacher profile and assign classes and subjects
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input id="first_name" name="first_name" required />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input id="last_name" name="last_name" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input id="phone_number" name="phone_number" type="tel" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select name="department">
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" name="specialization" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="years_of_experience">Years of Experience</Label>
                    <Input 
                      id="years_of_experience" 
                      name="years_of_experience" 
                      type="number" 
                      min="0"
                      defaultValue="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hours_per_week">Hours per Week</Label>
                    <Input 
                      id="hours_per_week" 
                      name="hours_per_week" 
                      type="number" 
                      min="0"
                      defaultValue="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                  <Input 
                    id="subjects" 
                    name="subjects" 
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Common subjects: {SUBJECTS.slice(0, 5).join(', ')}
                  </p>
                </div>
                <div>
                  <Label htmlFor="classes">Classes Assigned (comma-separated)</Label>
                  <Input 
                    id="classes" 
                    name="classes" 
                    placeholder="e.g., Form 1, Form 2, Form 3"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Available classes: {CLASS_LEVELS.join(', ')}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Adding...' : 'Add Teacher'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">Active teaching staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assigned Teachers</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withClasses}</div>
            <p className="text-xs text-gray-500 mt-1">With class assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teaching Hours</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-gray-500 mt-1">Per week</p>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers ({teachers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Hours/Week</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers && teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      {teacher.full_name || `${teacher.user?.first_name} ${teacher.user?.last_name}`}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {teacher.email || teacher.user?.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {teacher.department || 'Not set'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {teacher.subjects?.slice(0, 2).map((subject, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjects?.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{teacher.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {teacher.classes_assigned?.slice(0, 2).map((cls, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cls}
                          </Badge>
                        ))}
                        {teacher.classes_assigned?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.classes_assigned.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.hours_per_week || 0}h</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setIsPasswordDialogOpen(true);
                            setGeneratedPassword('');
                          }}
                          title="Set Password"
                        >
                          <Key className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setIsEditDialogOpen(true);
                          }}
                          title="Edit Teacher"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(teacher.id)}
                          title="Delete Teacher"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No teachers found. Click "Add Teacher" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleUpdateTeacher}>
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
              <DialogDescription>
                Update teacher information and assignments
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Teacher Name</Label>
                <Input 
                  value={selectedTeacher?.full_name || `${selectedTeacher?.user?.first_name} ${selectedTeacher?.user?.last_name}`} 
                  disabled 
                />
              </div>
              <div>
                <Label htmlFor="edit_phone_number">Phone Number</Label>
                <Input 
                  id="edit_phone_number" 
                  name="phone_number" 
                  type="tel"
                  defaultValue={selectedTeacher?.phone_number || ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_department">Department</Label>
                  <Select name="department" defaultValue={selectedTeacher?.department || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_specialization">Specialization</Label>
                  <Input 
                    id="edit_specialization" 
                    name="specialization"
                    defaultValue={selectedTeacher?.specialization || ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_years_of_experience">Years of Experience</Label>
                  <Input 
                    id="edit_years_of_experience" 
                    name="years_of_experience" 
                    type="number" 
                    min="0"
                    defaultValue={selectedTeacher?.years_of_experience || 0}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_hours_per_week">Hours per Week</Label>
                  <Input 
                    id="edit_hours_per_week" 
                    name="hours_per_week" 
                    type="number" 
                    min="0"
                    defaultValue={selectedTeacher?.hours_per_week || 0}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit_subjects">Subjects (comma-separated)</Label>
                <Input 
                  id="edit_subjects" 
                  name="subjects" 
                  defaultValue={selectedTeacher?.subjects?.join(', ') || ''}
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                />
              </div>
              <div>
                <Label htmlFor="edit_classes">Classes Assigned (comma-separated)</Label>
                <Input 
                  id="edit_classes" 
                  name="classes" 
                  defaultValue={selectedTeacher?.classes_assigned?.join(', ') || ''}
                  placeholder="e.g., Form 1, Form 2, Form 3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedTeacher(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Teacher'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Set Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSetPassword}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Set Password
              </DialogTitle>
              <DialogDescription>
                Set a new password for {selectedTeacher?.full_name || `${selectedTeacher?.user?.first_name} ${selectedTeacher?.user?.last_name}`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="teacher_email">Teacher Email</Label>
                <Input 
                  id="teacher_email"
                  value={selectedTeacher?.email || selectedTeacher?.user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              {/* Generate Password Button */}
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Generate Strong Password</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Click to auto-generate a secure password
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGeneratePassword}
                  className="ml-3"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Generate
                </Button>
              </div>

              <div>
                <Label htmlFor="password">New Password *</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (min 8 characters)"
                    minLength={8}
                    required
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with uppercase, lowercase, numbers, and special characters
                </p>
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm Password *</Label>
                <div className="relative">
                  <Input 
                    id="confirm_password" 
                    name="confirm_password" 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    minLength={8}
                    required
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  ⚠️ <strong>Security Note:</strong> Avoid common passwords. Clerk validates against known data breaches.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  setSelectedTeacher(null);
                  setGeneratedPassword('');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={setPasswordMutation.isPending}>
                {setPasswordMutation.isPending ? 'Setting Password...' : 'Set Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
