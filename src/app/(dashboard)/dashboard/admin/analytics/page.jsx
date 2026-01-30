'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, BookOpen, Award, AlertTriangle, 
  Download, Filter, Calendar, Trophy, Target, Activity 
} from 'lucide-react';
import { examsApi } from '@/lib/api/exams';
import { studentsApi } from '@/lib/api/students';
import { gradesApi } from '@/lib/api/grades';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('FIRST');
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedTerm, selectedClass]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch classes
      const classesData = await examsApi.getClasses();
      setClasses(classesData || []);

      // Build query parameters
      const params = { term: selectedTerm };
      if (selectedClass) params.class_id = selectedClass;

      // Fetch grades
      const grades = await gradesApi.getAll(params);

      // Fetch students
      const studentParams = selectedClass ? { class_id: selectedClass } : {};
      const students = await studentsApi.getAll(studentParams);

      // Calculate analytics
      const analyticsData = calculateAnalytics(grades || [], students || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set empty analytics on error
      setAnalytics({
        totalStudents: 0,
        totalExams: 0,
        averageScore: 0,
        topPerformers: [],
        weakPerformers: [],
        subjectPerformance: [],
        gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
        examTypePerformance: []
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (grades, students) => {
    if (grades.length === 0) {
      return {
        totalStudents: students.length,
        totalExams: 0,
        averageScore: 0,
        topPerformers: [],
        weakPerformers: [],
        subjectPerformance: [],
        gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
        examTypePerformance: []
      };
    }

    // Calculate average score using percentage field from backend
    const totalPercentage = grades.reduce((sum, g) => sum + parseFloat(g.percentage || 0), 0);
    const averagePercentage = (totalPercentage / grades.length).toFixed(1);

    // Get unique exams
    const uniqueExams = [...new Set(grades.map(g => g.exam))];

    // Calculate student averages
    const studentAverages = {};
    grades.forEach(grade => {
      const studentId = grade.student || grade.student_id;
      if (!studentAverages[studentId]) {
        studentAverages[studentId] = {
          student: {
            id: studentId,
            first_name: grade.student_name?.split(' ')[0] || 'Unknown',
            last_name: grade.student_name?.split(' ').slice(1).join(' ') || ''
          },
          scores: [],
          total: 0,
          maxTotal: 0
        };
      }
      studentAverages[studentId].scores.push(grade);
      studentAverages[studentId].total += parseFloat(grade.marks_obtained || 0);
      studentAverages[studentId].maxTotal += parseFloat(grade.total_marks || 100);
    });

    // Calculate percentages and sort
    const studentPerformances = Object.values(studentAverages).map(data => ({
      student: data.student,
      percentage: (data.total / data.maxTotal * 100).toFixed(1),
      totalScore: data.total,
      maxScore: data.maxTotal,
      examCount: data.scores.length
    })).sort((a, b) => b.percentage - a.percentage);

    const topPerformers = studentPerformances.slice(0, 5);
    const weakPerformers = studentPerformances.slice(-5).reverse();

    // Subject performance
    const subjectGroups = {};
    grades.forEach(grade => {
      const subject = grade.subject || 'Unknown';
      if (!subjectGroups[subject]) {
        subjectGroups[subject] = { total: 0, maxTotal: 0, count: 0 };
      }
      subjectGroups[subject].total += parseFloat(grade.marks_obtained || 0);
      subjectGroups[subject].maxTotal += parseFloat(grade.total_marks || 100);
      subjectGroups[subject].count += 1;
    });

    const subjectPerformance = Object.entries(subjectGroups).map(([subject, data]) => ({
      subject,
      percentage: (data.total / data.maxTotal * 100).toFixed(1),
      examCount: data.count
    })).sort((a, b) => b.percentage - a.percentage);

    // Grade distribution
    const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    grades.forEach(grade => {
      const percentage = parseFloat(grade.percentage || 0);
      if (percentage >= 90) gradeDistribution.A++;
      else if (percentage >= 80) gradeDistribution.B++;
      else if (percentage >= 70) gradeDistribution.C++;
      else if (percentage >= 60) gradeDistribution.D++;
      else gradeDistribution.F++;
    });

    // Exam type performance
    const examTypeGroups = {};
    grades.forEach(grade => {
      const type = grade.exam_type || 'Unknown';
      if (!examTypeGroups[type]) {
        examTypeGroups[type] = { total: 0, maxTotal: 0, count: 0 };
      }
      examTypeGroups[type].total += parseFloat(grade.marks_obtained || 0);
      examTypeGroups[type].maxTotal += parseFloat(grade.total_marks || 100);
      examTypeGroups[type].count += 1;
    });

    const examTypePerformance = Object.entries(examTypeGroups).map(([type, data]) => ({
      type,
      percentage: (data.total / data.maxTotal * 100).toFixed(1),
      count: data.count
    }));

    return {
      totalStudents: students.length,
      totalExams: uniqueExams.length,
      averageScore: averagePercentage,
      topPerformers,
      weakPerformers,
      subjectPerformance,
      gradeDistribution,
      examTypePerformance
    };
  };

  const getGradeColor = (percentage) => {
    const perc = parseFloat(percentage);
    if (perc >= 90) return 'text-green-600 bg-green-50';
    if (perc >= 75) return 'text-blue-600 bg-blue-50';
    if (perc >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const exportReport = () => {
    // In a real app, this would generate a detailed PDF or Excel report
    const csvContent = `Analytics Report - ${selectedTerm} Term\n\n`;
    alert('Export functionality would generate a detailed report here');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Safety check - if analytics is still null after loading, show error state
  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load analytics</h2>
        <p className="text-gray-600 mb-4">Unable to fetch analytics data</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reporting</h1>
        <p className="text-gray-600">Comprehensive performance analytics and insights</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              Select Term
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="FIRST">First Term</option>
              <option value="SECOND">Second Term</option>
              <option value="THIRD">Third Term</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="inline w-4 h-4 mr-1" />
              Select Class
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={exportReport}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-indigo-600" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
          <p className="text-sm text-gray-600">Students</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">Conducted</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalExams}</p>
          <p className="text-sm text-gray-600">Exams</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-sm text-gray-500">Overall</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.averageScore}%</p>
          <p className="text-sm text-gray-600">Average Score</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-gray-500">Status</span>
          </div>
          <p className={`text-2xl font-bold ${parseFloat(analytics.averageScore) >= 75 ? 'text-green-600' : 'text-yellow-600'}`}>
            {parseFloat(analytics.averageScore) >= 75 ? 'Good' : 'Needs Attention'}
          </p>
          <p className="text-sm text-gray-600">Performance</p>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Grade Distribution
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(analytics.gradeDistribution).map(([grade, count]) => {
            const colors = {
              A: 'bg-green-500',
              B: 'bg-blue-500',
              C: 'bg-yellow-500',
              D: 'bg-orange-500',
              F: 'bg-red-500'
            };
            const total = Object.values(analytics.gradeDistribution).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;

            return (
              <div key={grade} className="text-center">
                <div className={`${colors[grade]} text-white rounded-lg p-4 mb-2`}>
                  <p className="text-3xl font-bold">{count}</p>
                  <p className="text-sm">{percentage}%</p>
                </div>
                <p className="font-semibold text-gray-900">Grade {grade}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top and Weak Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Top 5 Performers
          </h2>
          <div className="space-y-3">
            {analytics.topPerformers.map((performer, index) => (
              <div key={performer.student.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {performer.student.first_name} {performer.student.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{performer.examCount} exams</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">{performer.percentage}%</p>
                  <p className="text-xs text-gray-600">{performer.totalScore}/{performer.maxScore}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Performers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Students Needing Support
          </h2>
          <div className="space-y-3">
            {analytics.weakPerformers.map((performer, index) => (
              <div key={performer.student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center font-bold text-white">
                    !
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {performer.student.first_name} {performer.student.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{performer.examCount} exams</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600">{performer.percentage}%</p>
                  <p className="text-xs text-gray-600">{performer.totalScore}/{performer.maxScore}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Subject-wise Performance
        </h2>
        <div className="space-y-3">
          {analytics.subjectPerformance.map(subject => (
            <div key={subject.subject} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{subject.subject}</p>
                <p className="text-sm text-gray-600">{subject.examCount} exams conducted</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-64 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      parseFloat(subject.percentage) >= 75 ? 'bg-green-500' : 
                      parseFloat(subject.percentage) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
                <span className={`text-lg font-bold min-w-[60px] text-right ${getGradeColor(subject.percentage)}`}>
                  {subject.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Type Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Performance by Assessment Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.examTypePerformance.map(type => (
            <div key={type.type} className={`p-4 rounded-lg border-2 ${getGradeColor(type.percentage)}`}>
              <p className="font-semibold text-gray-900 mb-1">{type.type}</p>
              <p className="text-2xl font-bold mb-1">{type.percentage}%</p>
              <p className="text-sm text-gray-600">{type.count} assessments</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;