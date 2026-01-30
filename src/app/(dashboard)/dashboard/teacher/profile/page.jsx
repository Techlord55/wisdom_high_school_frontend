// ===== src/app/(dashboard)/dashboard/teacher/profile/page.jsx =====
'use client';

import { useCurrentUser, useUpdateProfile } from '@/lib/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/loading';
import { useState, useEffect } from 'react';

export default function TeacherProfile() {
  const { data: user, isLoading, error } = useCurrentUser();
  const updateMutation = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    place_of_birth: '',
    date_of_birth: '',
  });

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        place_of_birth: user.place_of_birth || '',
        date_of_birth: user.date_of_birth || '',
      });
    }
  }, [user]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading profile: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No user data available</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
      place_of_birth: user.place_of_birth || '',
      date_of_birth: user.date_of_birth || '',
    });
    setEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate(formData, {
      onSuccess: () => setEditing(false)
    });
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form to user data
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
      place_of_birth: user.place_of_birth || '',
      date_of_birth: user.date_of_birth || '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500 mt-1">View and edit your profile</p>
        </div>
        {!editing ? (
          <Button onClick={handleEdit} disabled={updateMutation.isPending}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className="mt-2"
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="mt-2"
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    className="mt-2"
                    disabled={updateMutation.isPending}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.full_name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{user.phone_number || 'Not provided'}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="text-sm font-medium">Place of Birth</label>
                  <Input
                    value={formData.place_of_birth}
                    onChange={(e) => setFormData({...formData, place_of_birth: e.target.value})}
                    className="mt-2"
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    className="mt-2"
                    disabled={updateMutation.isPending}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Place of Birth</p>
                    <p className="font-medium">{user.place_of_birth || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {user.date_of_birth 
                        ? new Date(user.date_of_birth).toLocaleDateString()
                        : 'Not provided'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
