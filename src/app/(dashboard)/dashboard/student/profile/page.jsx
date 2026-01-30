// File: src/app/(dashboard)/dashboard/student/profile/page.jsx
'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/lib/hooks/use-user';
import { useCurrentStudent } from '@/lib/hooks/use-student';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardSkeleton } from '@/components/shared/loading';
import { User, Mail, Phone, Calendar, MapPin, Award, BookOpen, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { usersApi } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserButton } from '@clerk/nextjs';

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading, refetch: refetchUser } = useCurrentUser();
  const { data: student, isLoading: studentLoading } = useCurrentStudent();

  // Update profile mutation with improved cache handling
  const updateMutation = useMutation({
    mutationFn: (data) => usersApi.updateProfile(data),
    onSuccess: async (updatedUser) => {
      // Strategy 1: Immediately update the cache with the new data from the server
      queryClient.setQueryData(['user', 'current'], updatedUser);
      
      // Strategy 2: Also invalidate to ensure fresh data on next render
      await queryClient.invalidateQueries({ queryKey: ['user', 'current'] });
      
      // Strategy 3: Force a refetch to be absolutely sure
      await refetchUser();
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const handleEdit = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
      sex: user?.sex || '',
      place_of_birth: user?.place_of_birth || '',
      date_of_birth: user?.date_of_birth || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = () => {
    const dataToSend = { ...formData };
    
    // Clean up empty values
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === '' || dataToSend[key] === null || dataToSend[key] === undefined) {
        delete dataToSend[key];
      }
    });
    
    // Validate we have at least some data to send
    if (Object.keys(dataToSend).length === 0) {
      toast.error('No changes to save');
      return;
    }
    
    console.log('Sending update with data:', dataToSend);
    updateMutation.mutate(dataToSend);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (userLoading || studentLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500 mt-1">View and manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-24 h-24"
                    }
                  }}
                />
              </div>
            </div>
            <CardTitle>{user?.full_name}</CardTitle>
            <CardDescription>
              <Badge variant="outline" className="mt-2">
                {user?.role?.toUpperCase()}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Award className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Student ID</p>
                <p className="font-medium">{student?.student_id || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Class</p>
                <p className="font-medium">{student?.class_level || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-xs break-all">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                {isEditing ? (
                  <Input
                    id="first_name"
                    value={formData.first_name || ''}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{user?.first_name || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="last_name"
                    value={formData.last_name || ''}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{user?.last_name || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone_number"
                    type="tel"
                    value={formData.phone_number || ''}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user?.phone_number || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Gender</Label>
                {isEditing ? (
                  <Select 
                    value={formData.sex || ''} 
                    onValueChange={(value) => handleChange('sex', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>
                      {user?.sex === 'M' ? 'Male' : user?.sex === 'F' ? 'Female' : 'Not set'}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {user?.date_of_birth 
                        ? new Date(user.date_of_birth).toLocaleDateString() 
                        : 'Not set'}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="place_of_birth">Place of Birth</Label>
                {isEditing ? (
                  <Input
                    id="place_of_birth"
                    value={formData.place_of_birth || ''}
                    onChange={(e) => handleChange('place_of_birth', e.target.value)}
                    placeholder="City, Country"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{user?.place_of_birth || 'Not set'}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your class and educational details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Student ID</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="font-mono">{student?.student_id || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Class Level</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span>{student?.class_level || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stream/Section</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="capitalize">{student?.education_stream || student?.section || 'N/A'}</span>
                </div>
              </div>

              {student?.specialization && (
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span>{student.specialization}</span>
                  </div>
                </div>
              )}

              {student?.art_or_science && (
                <div className="space-y-2">
                  <Label>Stream Type</Label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="capitalize">{student.art_or_science}</span>
                  </div>
                </div>
              )}

              {student?.a_level_stream && (
                <div className="space-y-2">
                  <Label>A-Level Stream</Label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span>{student.a_level_stream}</span>
                  </div>
                </div>
              )}
            </div>

            {student?.subjects && student.subjects.length > 0 && (
              <div className="mt-6">
                <Label className="mb-3 block">My Subjects</Label>
                <div className="flex flex-wrap gap-2">
                  {student.subjects.map((subject, i) => (
                    <Badge key={i} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
