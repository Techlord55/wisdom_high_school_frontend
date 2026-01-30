'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Save, Users, BookOpen, Calendar, CheckCircle, AlertCircle, Filter, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi, studentsApi, gradesApi } from '@/lib/api';
import { toast } from 'sonner';

const TeacherGradeEntry = () => {
  const queryClient = useQueryClient();
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [grades, setGrades] = useState({});

  // Fetch all exams
  const { data: exams = [], isLoading: examsLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => examsApi.getAll(),
  });

  // Fetch students for selected class
  const { data: allStudents = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
    enabled: !!selectedClass,
  });

  // Filter students by selected class
  const students = useMemo(() => {
    if (!selectedClass || !allStudents) return [];
    return allStudents.filter(student => student.class_level === selectedClass);
  }, [allStudents, selectedClass]);

  // Fetch existing grades for selected exam, class, and subject
  const { data: existingGrades = [], isLoading: gradesLoading } = useQuery({
    queryKey: ['grades', selectedExam?.id, selectedClass, selectedSubject],
    queryFn: () => gradesApi.getAll({ 
      exam_id: selectedExam.id,
      class_level: selectedClass,
      subject: selectedSubject
    }),
    enabled: !!selectedExam?.id && !!selectedClass && !!selectedSubject,
  });

  // Convert existing grades to object using useMemo to avoid re-renders
  const initialGrades = useMemo(() => {
    if (!existingGrades || existingGrades.length === 0) return {};
    
    const gradesObj = {};
    existingGrades.forEach(grade => {
      gradesObj[grade.student.id] = {
        id: grade.id,
        marks_obtained: grade.marks_obtained,
        remarks: grade.remarks || ''
      };
    });
    return gradesObj;
  }, [existingGrades]);

  // Update grades when exam changes or grades are loaded
  useEffect(() => {
    setGrades(initialGrades);
  }, [selectedExam?.id, selectedClass, selectedSubject]);

  // Save grades mutation
  const saveGradesMutation = useMutation({
    mutationFn: (gradesData) => gradesApi.bulkCreate(gradesData),
    onSuccess: () => {
      toast.success('Grades saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['grades', selectedExam?.id, selectedClass, selectedSubject] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save grades');
    },
  });

  const handleScoreChange = (studentId, value) => {
    const score = parseFloat(value) || 0;
    if (score < 0 || score > selectedExam.total_marks) return;
    
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks_obtained: score
      }
    }));
  };

  const handleRemarksChange = (studentId, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: value
      }
    }));
  };

  const handleSaveGrades = async () => {
    if (!selectedExam || !selectedClass || !selectedSubject) return;
    
    // Prepare grades data
    const gradesData = {
      exam_id: selectedExam.id,
      class_level: selectedClass,
      subject: selectedSubject,
      grades: Object.entries(grades).map(([studentId, gradeData]) => ({
        student_id: parseInt(studentId),
        marks_obtained: gradeData.marks_obtained || 0,
        remarks: gradeData.remarks || ''
      }))
    };

    saveGradesMutation.mutate(gradesData);
  };

  const getGradeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.user.first_name} ${student.user.last_name}`.toLowerCase();
    const studentId = student.student_id?.toLowerCase() || '';
    return fullName.includes(searchTerm.toLowerCase()) || studentId.includes(searchTerm.toLowerCase());
  });

  const filteredExams = exams.filter(exam => {
    return !filterTerm || exam.term === filterTerm;
  });

  const calculateStats = () => {
    const enteredGrades = Object.values(grades).filter(g => g.marks_obtained > 0);
    const totalStudents = students.length;
    const gradedStudents = enteredGrades.length;
    const averageScore = enteredGrades.length > 0
      ? enteredGrades.reduce((sum, g) => sum + g.marks_obtained, 0) / enteredGrades.length
      : 0;

    return { totalStudents, gradedStudents, averageScore };
  };

  const stats = selectedExam && selectedClass && selectedSubject ? calculateStats() : { totalStudents: 0, gradedStudents: 0, averageScore: 0 };
  const loading = examsLoading || studentsLoading || gradesLoading;

  // Get available classes and subjects for selected exam
  const availableClasses = selectedExam ? selectedExam.applicable_classes || selectedExam.classes : [];
  const availableSubjects = selectedExam ? selectedExam.applicable_subjects || selectedExam.subjects : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grade Entry</h1>
        <p className="text-gray-600">Enter and manage student grades for exams</p>
      </div>

      {/* Exam Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Exam</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedExam?.id || ''}
              onChange={(e) => {
                const exam = exams.find(ex => ex.id === parseInt(e.target.value));
                setSelectedExam(exam);
                setSelectedClass('');
                setSelectedSubject('');
              }}
            >
              <option value="">Choose an exam...</option>
              {filteredExams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.exam_name} - Term {exam.term} ({exam.academic_year})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Term</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
            >
              <option value="">All Terms</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>
        </div>

        {/* Class and Subject Selection */}
        {selectedExam && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class <span className="text-red-500">*</span></label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select a class...</option>
                {availableClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select a subject...</option>
                {availableSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Exam Details */}
        {selectedExam && selectedClass && selectedSubject && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-indigo-600 font-medium">Exam</p>
                <p className="text-gray-900 font-semibold">{selectedExam.exam_name}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium">Subject</p>
                <p className="text-gray-900 font-semibold">{selectedSubject}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium">Class</p>
                <p className="text-gray-900 font-semibold">{selectedClass}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium">Total Marks</p>
                <p className="text-gray-900 font-semibold">{selectedExam.total_marks} points</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium">Date</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(selectedExam.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedExam && selectedClass && selectedSubject && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Graded</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.gradedStudents} / {stats.totalStudents}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Class Average</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageScore.toFixed(1)} / {selectedExam.total_marks}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleSaveGrades}
                disabled={saveGradesMutation.isPending}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saveGradesMutation.isPending ? 'Saving...' : 'Save All Grades'}
              </button>
            </div>
          </div>

          {/* Grades Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">No students found in this class</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => {
                      const studentGrade = grades[student.id] || { marks_obtained: 0, remarks: '' };
                      const percentage = selectedExam.total_marks > 0 
                        ? (studentGrade.marks_obtained / selectedExam.total_marks * 100).toFixed(1)
                        : 0;
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold">
                                  {student.user.first_name[0]}{student.user.last_name[0]}
                                </span>
                              </div>
                              <div className="ml-3">
                                <p className="font-medium text-gray-900">
                                  {student.user.first_name} {student.user.last_name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.student_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max={selectedExam.total_marks}
                                step="0.5"
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={studentGrade.marks_obtained || ''}
                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                              />
                              <span className="text-sm text-gray-500">/ {selectedExam.total_marks}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-lg font-bold ${getGradeColor(studentGrade.marks_obtained, selectedExam.total_marks)}`}>
                              {getGradeLetter(studentGrade.marks_obtained, selectedExam.total_marks)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-medium ${getGradeColor(studentGrade.marks_obtained, selectedExam.total_marks)}`}>
                              {percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              placeholder="Optional remarks..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              value={studentGrade.remarks || ''}
                              onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!selectedExam && !examsLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select an Exam to Begin</h3>
          <p className="text-gray-600">Choose an exam from the dropdown above to start entering grades</p>
        </div>
      )}

      {selectedExam && (!selectedClass || !selectedSubject) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Class and Subject</h3>
          <p className="text-gray-600">Choose a class and subject to view and enter grades</p>
        </div>
      )}
    </div>
  );
};

export default TeacherGradeEntry;
