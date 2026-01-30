'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Award, BookOpen, Calendar, Download, BarChart3, FileText, AlertCircle } from 'lucide-react';
import { gradesApi } from '@/lib/api/grades';
import { studentsApi } from '@/lib/api/students';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('FIRST');
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    fetchStudentResults();
  }, [selectedTerm]);

  const fetchStudentResults = async () => {
    setLoading(true);
    try {
      // Fetch student info
      const studentData = await studentsApi.getCurrent();
      setStudentInfo(studentData);

      // Fetch grades for selected term  
      const gradesData = await gradesApi.getMy({ term: selectedTerm });
      
      setResults(gradesData || []);
    } catch (error) {
      console.error('Failed to fetch results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, lowest: 0, totalExams: 0 };

    const scores = results.map(r => parseFloat(r.percentage || 0));
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    return {
      average: average.toFixed(1),
      highest: highest.toFixed(1),
      lowest: lowest.toFixed(1),
      totalExams: results.length
    };
  };

  const getGradeColor = (percentage) => {
    const perc = parseFloat(percentage);
    if (perc >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (perc >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (perc >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getGradeLetter = (percentage) => {
    const perc = parseFloat(percentage);
    if (perc >= 90) return 'A';
    if (perc >= 80) return 'B';
    if (perc >= 70) return 'C';
    if (perc >= 60) return 'D';
    return 'F';
  };

  const getPerformanceMessage = (average) => {
    if (average >= 90) return { text: 'Outstanding Performance!', color: 'text-green-600', icon: Trophy };
    if (average >= 75) return { text: 'Great Work!', color: 'text-blue-600', icon: Award };
    if (average >= 60) return { text: 'Good Progress', color: 'text-yellow-600', icon: TrendingUp };
    return { text: 'Keep Working Hard', color: 'text-red-600', icon: BookOpen };
  };

  const groupBySubject = () => {
    const grouped = {};
    results.forEach(result => {
      const subject = result.subject || 'Unknown';
      if (!grouped[subject]) {
        grouped[subject] = [];
      }
      grouped[subject].push(result);
    });
    return grouped;
  };

  const stats = calculateStats();
  const performance = getPerformanceMessage(parseFloat(stats.average));
  const PerformanceIcon = performance.icon;
  const subjectGroups = groupBySubject();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Results</h1>
        <p className="text-gray-600">View your academic performance and grades</p>
      </div>

      {/* Student Info Card */}
      {studentInfo && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {studentInfo.first_name} {studentInfo.last_name}
              </h2>
              <p className="text-indigo-100">Admission No: {studentInfo.admission_number}</p>
              <p className="text-indigo-100">Class: {studentInfo.current_class?.name}</p>
            </div>
            <div className="text-right">
              <PerformanceIcon className="w-16 h-16 mb-2 mx-auto" />
              <p className="text-lg font-semibold">{performance.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Term Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Select Term:</span>
          <div className="flex gap-2">
            {['FIRST', 'SECOND', 'THIRD'].map(term => (
              <button
                key={term}
                onClick={() => setSelectedTerm(term)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTerm === term
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {term} Term
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.average}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Highest Score</p>
              <p className="text-2xl font-bold text-green-600">{stats.highest}%</p>
            </div>
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lowest Score</p>
              <p className="text-2xl font-bold text-red-600">{stats.lowest}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalExams}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Results by Subject */}
      {Object.keys(subjectGroups).length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Available</h3>
          <p className="text-gray-600">
            You don't have any results for the {selectedTerm.toLowerCase()} term yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(subjectGroups).map(([subject, subjectResults]) => {
            const subjectAverage = subjectResults.reduce(
              (sum, r) => sum + parseFloat(r.percentage || 0),
              0
            ) / subjectResults.length;

            return (
              <div key={subject} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{subject}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subject Average</p>
                      <p className="text-xl font-bold text-gray-900">{subjectAverage.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {subjectResults.map(result => {
                      const percentage = parseFloat(result.percentage || 0);
                      const grade = getGradeLetter(percentage);

                      return (
                        <div
                          key={result.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{result.exam_name || 'Exam'}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                result.exam_type === 'QUIZ' ? 'bg-blue-100 text-blue-800' :
                                result.exam_type === 'MIDTERM' ? 'bg-yellow-100 text-yellow-800' :
                                result.exam_type === 'FINAL' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {result.exam_type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Date: {result.exam_date ? new Date(result.exam_date).toLocaleDateString() : 'N/A'}
                            </p>
                            {result.remarks && (
                              <p className="text-sm text-gray-600 mt-1 italic">
                                Remarks: {result.remarks}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Score</p>
                              <p className="text-lg font-bold text-gray-900">
                                {result.marks_obtained} / {result.total_marks}
                              </p>
                            </div>
                            <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center ${
                              getGradeColor(percentage)
                            }`}>
                              <span className="text-2xl font-bold">{grade}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Percentage</p>
                              <p className="text-lg font-bold text-gray-900">{percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Download Transcript Button */}
      {results.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => window.location.href = `/dashboard/student/transcript?term=${selectedTerm}`}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download {selectedTerm} Term Transcript
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentResults;