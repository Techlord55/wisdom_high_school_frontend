'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { examsApi } from '@/lib/api';
import { toast } from 'sonner';

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exam_name: '',
    exam_type: 'midterm',
    term: '1',
    academic_year: '2024/2025',
    start_date: '',
    end_date: '',
    total_marks: 100,
    instructions: '',
    classes: [],
    subjects: [],
    is_published: true
  });

  const allClasses = [
    'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5',
    'Lower Sixth', 'Upper Sixth'
  ];

  const allSubjects = [
    'Mathematics', 'English', 'French', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geography', 'Literature', 'Economics',
    'Computer Science', 'ICT'
  ];

  const handleClassToggle = (className) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSelectAllClasses = () => {
    if (formData.classes.includes('all')) {
      setFormData(prev => ({ ...prev, classes: [] }));
    } else {
      setFormData(prev => ({ ...prev, classes: ['all'] }));
    }
  };

  const handleSelectAllSubjects = () => {
    if (formData.subjects.includes('all')) {
      setFormData(prev => ({ ...prev, subjects: [] }));
    } else {
      setFormData(prev => ({ ...prev, subjects: ['all'] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.classes.length === 0) {
      toast.error('Please select at least one class');
      return;
    }
    
    if (formData.subjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    setLoading(true);
    try {
      await examsApi.create(formData);
      toast.success('Exam created successfully!');
      router.push('/dashboard/admin/exams');
    } catch (error) {
      toast.error(error.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Exam</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Exam Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.exam_name}
                onChange={(e) => setFormData({...formData, exam_name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Exam Type</label>
              <select
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.exam_type}
                onChange={(e) => setFormData({...formData, exam_type: e.target.value})}
              >
                <option value="quiz">Quiz</option>
                <option value="test">Class Test</option>
                <option value="midterm">Mid-Term Exam</option>
                <option value="final">Final Exam</option>
                <option value="mock">Mock Exam</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Total Marks</label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.total_marks}
                onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Term</label>
              <select
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.term}
                onChange={(e) => setFormData({...formData, term: e.target.value})}
              >
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Academic Year</label>
              <input
                type="text"
                required
                placeholder="2024/2025"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.academic_year}
                onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Instructions (Optional)</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Classes Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Select Classes</h2>
            <button
              type="button"
              onClick={handleSelectAllClasses}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {formData.classes.includes('all') ? 'Deselect All' : 'Select All Classes'}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {allClasses.map(className => (
              <label key={className} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.classes.includes(className) || formData.classes.includes('all')}
                  onChange={() => handleClassToggle(className)}
                  disabled={formData.classes.includes('all')}
                  className="rounded"
                />
                <span>{className}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Subjects Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Select Subjects</h2>
            <button
              type="button"
              onClick={handleSelectAllSubjects}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {formData.subjects.includes('all') ? 'Deselect All' : 'Select All Subjects'}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {allSubjects.map(subject => (
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(subject) || formData.subjects.includes('all')}
                  onChange={() => handleSubjectToggle(subject)}
                  disabled={formData.subjects.includes('all')}
                  className="rounded"
                />
                <span>{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Exam'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}