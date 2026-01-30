'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { studentsApi } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, GraduationCap, Award } from 'lucide-react';

const CLASS_LEVELS = [
  'Form 1',
  'Form 2',
  'Form 3',
  'Form 4',
  'Form 5',
  'Lower Sixth',
  'Upper Sixth'
];

const STREAMS = [
  { value: 'grammar', label: 'Grammar' },
  { value: 'technical', label: 'Technical' },
  { value: 'commercial', label: 'Commercial' }
];

const COMMON_SUBJECTS = [
  'Mathematics',
  'English Language',
  'French',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Literature',
  'Economics',
  'Computer Science'
];

export default function CompleteProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  
  const [formData, setFormData] = useState({
    class_level: '',
    section: 'grammar',
    education_stream: 'grammar',
    subjects: []
  });
  
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const createProfileMutation = useMutation({
    mutationFn: (data) => studentsApi.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['current-student']);
      toast.success('Profile created successfully!');
      router.push('/dashboard/student');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message || 'Failed to create profile';
      toast.error(message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.class_level) {
      toast.error('Please select your class level');
      return;
    }

    const dataToSubmit = {
      ...formData,
      subjects: selectedSubjects
    };

    createProfileMutation.mutate(dataToSubmit);
  };

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Complete Your Student Profile</CardTitle>
          <CardDescription>
            Welcome {user?.first_name}! Please provide your academic information to get started.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Class Level */}
            <div className="space-y-2">
              <Label htmlFor="class_level" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Class Level <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.class_level} 
                onValueChange={(value) => setFormData({...formData, class_level: value})}
              >
                <SelectTrigger id="class_level">
                  <SelectValue placeholder="Select your class level" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stream/Section */}
            <div className="space-y-2">
              <Label htmlFor="section" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Education Stream <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.section} 
                onValueChange={(value) => {
                  setFormData({
                    ...formData, 
                    section: value,
                    education_stream: value
                  });
                }}
              >
                <SelectTrigger id="section">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STREAMS.map(stream => (
                    <SelectItem key={stream.value} value={stream.value}>
                      {stream.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                {formData.section === 'grammar' && 'Academic stream focusing on traditional subjects'}
                {formData.section === 'technical' && 'Technical and vocational education'}
                {formData.section === 'commercial' && 'Business and commercial education'}
              </p>
            </div>

            {/* Subjects */}
            <div className="space-y-3">
              <Label>Select Your Subjects (Optional)</Label>
              <p className="text-sm text-gray-500">
                Choose the subjects you're currently studying. You can update this later.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_SUBJECTS.map(subject => (
                  <Button
                    key={subject}
                    type="button"
                    variant={selectedSubjects.includes(subject) ? 'default' : 'outline'}
                    className="justify-start text-left h-auto py-2"
                    onClick={() => toggleSubject(subject)}
                  >
                    <span className="truncate">{subject}</span>
                  </Button>
                ))}
              </div>
              {selectedSubjects.length > 0 && (
                <p className="text-sm text-blue-600">
                  Selected {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={createProfileMutation.isPending || !formData.class_level}
                className="flex-1"
              >
                {createProfileMutation.isPending ? 'Creating Profile...' : 'Complete Profile & Continue'}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              You can always update your profile information later from your profile page.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
