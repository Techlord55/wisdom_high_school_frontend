'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, FileText, AlertCircle, BookOpen, Users } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { examsApi } from '@/lib/api/exams';

const AdminExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [filterExamType, setFilterExamType] = useState('');

  const [formData, setFormData] = useState({
    exam_name: '',
    classes: [],
    subjects: [],
    term: '1',
    exam_type: 'midterm',
    total_marks: 100,
    start_date: '',
    end_date: '',
    academic_year: '2024/2025',
    instructions: '',
    is_published: true
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Available options
  const availableClasses = [
    'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 
    'Lower Sixth', 'Upper Sixth'
  ];

  const availableSubjects = [
    'Mathematics', 'English', 'French', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geography', 'Literature', 'Computer Science',
    'Economics', 'Commerce'
  ];

  const termChoices = [
    { value: '1', label: 'Term 1' },
    { value: '2', label: 'Term 2' },
    { value: '3', label: 'Term 3' }
  ];

  const examTypeChoices = [
    { value: 'quiz', label: 'Quiz' },
    { value: 'test', label: 'Class Test' },
    { value: 'midterm', label: 'Mid-Term Exam' },
    { value: 'final', label: 'Final Exam' },
    { value: 'mock', label: 'Mock Exam' }
  ];

  const { isLoaded } = useAuth();

  useEffect(() => {
    // Only fetch exams when Clerk is fully loaded
    if (isLoaded) {
      fetchExams();
    }
  }, [isLoaded]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await examsApi.getAll();
      setExams(data || []);
    } catch (error) {
      showNotification('Failed to load exams', 'error');
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.exam_name.trim()) newErrors.exam_name = 'Exam name is required';
    if (formData.classes.length === 0) newErrors.classes = 'At least one class is required';
    if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (formData.total_marks <= 0) newErrors.total_marks = 'Total marks must be positive';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingExam) {
        await examsApi.update(editingExam.id, formData);
        showNotification('Exam updated successfully!');
      } else {
        await examsApi.create(formData);
        showNotification('Exam created successfully!');
      }
      fetchExams();
      closeModal();
    } catch (error) {
      showNotification(error.message || 'Failed to save exam', 'error');
      console.error('Error saving exam:', error);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      exam_name: exam.exam_name,
      classes: exam.classes || [],
      subjects: exam.subjects || [],
      term: exam.term,
      exam_type: exam.exam_type,
      total_marks: exam.total_marks,
      start_date: exam.start_date,
      end_date: exam.end_date,
      academic_year: exam.academic_year || '2024/2025',
      instructions: exam.instructions || '',
      is_published: exam.is_published
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam? All associated grades will be lost.')) return;
    
    try {
      await examsApi.delete(id);
      showNotification('Exam deleted successfully!');
      fetchExams();
    } catch (error) {
      showNotification('Failed to delete exam', 'error');
      console.error('Error deleting exam:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExam(null);
    setFormData({
      exam_name: '',
      classes: [],
      subjects: [],
      term: '1',
      exam_type: 'midterm',
      total_marks: 100,
      start_date: '',
      end_date: '',
      academic_year: '2024/2025',
      instructions: '',
      is_published: true
    });
    setErrors({});
  };

  const filteredExams = exams.filter(exam => {
    const examName = exam.exam_name || '';
    const subjects = exam.subjects || [];
    const classes = exam.classes || [];
    
    const matchesSearch = examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         classes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTerm = !filterTerm || exam.term === filterTerm;
    const matchesExamType = !filterExamType || exam.exam_type === filterExamType;
    
    return matchesSearch && matchesTerm && matchesExamType;
  });

  const toggleClassSelection = (className) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  const toggleSubjectSelection = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const getExamTypeColor = (type) => {
    const colors = {
      'quiz': 'bg-blue-100 text-blue-800',
      'test': 'bg-green-100 text-green-800',
      'midterm': 'bg-yellow-100 text-yellow-800',
      'final': 'bg-red-100 text-red-800',
      'mock': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTermColor = (term) => {
    const colors = {
      '1': 'bg-indigo-100 text-indigo-800',
      '2': 'bg-cyan-100 text-cyan-800',
      '3': 'bg-teal-100 text-teal-800'
    };
    return colors[term] || 'bg-gray-100 text-gray-800';
  };

  const formatExamType = (type) => {
    return examTypeChoices.find(t => t.value === type)?.label || type;
  };

  const formatTerm = (term) => {
    return termChoices.find(t => t.value === term)?.label || `Term ${term}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white transition-all duration-300`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Management</h1>
        <p className="text-gray-600">Create and manage exams, tests, and assessments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
            </div>
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Term 1</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.filter(e => e.term === '1').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Term 2</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.filter(e => e.term === '2').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Term 3</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.filter(e => e.term === '3').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
          >
            <option value="">All Terms</option>
            {termChoices.map(term => (
              <option key={term.value} value={term.value}>{term.label}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={filterExamType}
            onChange={(e) => setFilterExamType(e.target.value)}
          >
            <option value="">All Types</option>
            {examTypeChoices.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Exam
          </button>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Term
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No exams found</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-3 text-indigo-600 hover:text-indigo-700"
                    >
                      Create your first exam
                    </button>
                  </td>
                </tr>
              ) : (
                filteredExams.map(exam => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{exam.exam_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {exam.subjects.includes('all') ? 'All Subjects' : exam.subjects.slice(0, 2).join(', ')}
                      {!exam.subjects.includes('all') && exam.subjects.length > 2 && ` +${exam.subjects.length - 2}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {exam.classes.includes('all') ? 'All Classes' : exam.classes.slice(0, 2).join(', ')}
                        {!exam.classes.includes('all') && exam.classes.length > 2 && ` +${exam.classes.length - 2}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTermColor(exam.term)}`}>
                        {formatTerm(exam.term)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExamTypeColor(exam.exam_type)}`}>
                        {formatExamType(exam.exam_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exam.total_marks} pts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(exam.start_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                      {exam.start_date !== exam.end_date && (
                        <> - {new Date(exam.end_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}</>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(exam)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                        title="Edit exam"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingExam ? 'Edit Exam' : 'Create New Exam'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Exam Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics Mid-Term Exam"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.exam_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.exam_name}
                    onChange={(e) => setFormData({...formData, exam_name: e.target.value})}
                  />
                  {errors.exam_name && <p className="text-red-500 text-xs mt-1">{errors.exam_name}</p>}
                </div>

                {/* Classes Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classes <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={formData.classes.includes('all')}
                        onChange={(e) => setFormData({
                          ...formData,
                          classes: e.target.checked ? ['all'] : []
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 font-medium text-gray-900">All Classes</span>
                    </label>
                    {!formData.classes.includes('all') && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 pt-2 border-t">
                        {availableClasses.map(cls => (
                          <label key={cls} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.classes.includes(cls)}
                              onChange={() => toggleClassSelection(cls)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{cls}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.classes && <p className="text-red-500 text-xs mt-1">{errors.classes}</p>}
                </div>

                {/* Subjects Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes('all')}
                        onChange={(e) => setFormData({
                          ...formData,
                          subjects: e.target.checked ? ['all'] : []
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 font-medium text-gray-900">All Subjects</span>
                    </label>
                    {!formData.subjects.includes('all') && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 pt-2 border-t">
                        {availableSubjects.map(subject => (
                          <label key={subject} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.subjects.includes(subject)}
                              onChange={() => toggleSubjectSelection(subject)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{subject}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.subjects && <p className="text-red-500 text-xs mt-1">{errors.subjects}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Term <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.term}
                      onChange={(e) => setFormData({...formData, term: e.target.value})}
                    >
                      {termChoices.map(term => (
                        <option key={term.value} value={term.value}>{term.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.exam_type}
                      onChange={(e) => setFormData({...formData, exam_type: e.target.value})}
                    >
                      {examTypeChoices.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Marks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="100"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.total_marks ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.total_marks}
                      onChange={(e) => setFormData({...formData, total_marks: parseFloat(e.target.value) || 0})}
                    />
                    {errors.total_marks && <p className="text-red-500 text-xs mt-1">{errors.total_marks}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.academic_year}
                      onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                    >
                      <option value="2024/2025">2024/2025</option>
                      <option value="2025/2026">2025/2026</option>
                      <option value="2026/2027">2026/2027</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.start_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    />
                    {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.end_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    />
                    {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions (Optional)
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Additional instructions for this exam..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  />
                </div>

                {/* Publish Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="is_published" className="ml-2 text-sm text-gray-700">
                    Publish exam (students can see it)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingExam ? 'Update Exam' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExamManagement;