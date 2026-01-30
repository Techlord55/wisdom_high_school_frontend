'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { examsApi, examSubmissionsApi } from '@/lib/api';
import { useCurrentUser } from '@/lib/hooks/use-user';
import { Upload, Download, FileText, CheckCircle, Clock, AlertCircle, FileSpreadsheet, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardSkeleton } from '@/components/shared/loading';

const TeacherExamManagement = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const [selectedTab, setSelectedTab] = useState('submissions');
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch exams
  const { data: exams = [], isLoading: examsLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => examsApi.getAll(),
    enabled: !!user && user.role === 'teacher',
  });

  // Fetch teacher assignments (classes and subjects)
  const { data: teacherAssignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['teacher-assignments'],
    queryFn: () => examSubmissionsApi.getTeacherAssignments(),
    enabled: !!user && user.role === 'teacher',
  });

  // Fetch submissions
  const { data: submissions = [], isLoading: submissionsLoading, refetch: refetchSubmissions } = useQuery({
    queryKey: ['exam-submissions'],
    queryFn: () => examSubmissionsApi.getAll(),
    enabled: !!user && user.role === 'teacher',
  });

  // Filter exams for teacher - BACKEND ALREADY FILTERS, so we just use all returned exams
  const filteredExams = exams; // Backend already filtered these correctly

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { color: 'bg-green-100 text-green-800 border border-green-300', icon: CheckCircle, text: 'Submitted' },
      pending: { color: 'bg-yellow-100 text-yellow-800 border border-yellow-300', icon: Clock, text: 'Pending' },
      approved: { color: 'bg-blue-100 text-blue-800 border border-blue-300', icon: CheckCircle, text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800 border border-red-300', icon: AlertCircle, text: 'Rejected' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const handleDownloadTemplate = async () => {
    if (!selectedExam || !selectedClass || !selectedSubject) {
      toast.error('Please select exam, class, and subject');
      return;
    }

    setIsDownloading(true);
    try {
      toast.loading('Downloading template...');
      const blob = await examSubmissionsApi.downloadTemplate(
        selectedExam.id,
        selectedClass,
        selectedSubject
      );
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Grade_Template_${selectedClass}_${selectedSubject}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Template downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || 'Failed to download template');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileUpload = async (type) => {
    if (!selectedExam || !selectedClass || !selectedSubject) {
      toast.error('Please select exam, class, and subject');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'questions' ? '.pdf,.doc,.docx' : '.csv,.xlsx';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);
      toast.loading(`Uploading ${type}...`);

      try {
        if (type === 'questions') {
          await examSubmissionsApi.uploadQuestions(
            selectedExam.id,
            selectedClass,
            selectedSubject,
            file
          );
        } else {
          await examSubmissionsApi.uploadGrades(
            selectedExam.id,
            selectedClass,
            selectedSubject,
            file
          );
        }
        
        toast.dismiss();
        toast.success(`${type === 'questions' ? 'Question paper' : 'Grades'} uploaded successfully!`);
        refetchSubmissions();
      } catch (error) {
        toast.dismiss();
        toast.error(error.message || `Failed to upload ${type}`);
      } finally {
        setIsUploading(false);
      }
    };
    
    input.click();
  };

 const handleViewFile = async (submission) => {
    try {
      toast.loading('Loading file...');
      
      // Get the file blob from the API
      const blob = await examSubmissionsApi.downloadFile(submission.id);
      
      // Determine the content type based on file extension
      const fileName = submission.file_name || 'download';
      let contentType = 'application/octet-stream';
      
      if (fileName.endsWith('.pdf')) {
        contentType = 'application/pdf';
      } else if (fileName.endsWith('.doc')) {
        contentType = 'application/msword';
      } else if (fileName.endsWith('.docx')) {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (fileName.endsWith('.csv')) {
        contentType = 'text/csv';
      } else if (fileName.endsWith('.xls')) {
        contentType = 'application/vnd.ms-excel';
      } else if (fileName.endsWith('.xlsx')) {
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }
      
      // Create a new Blob with the correct content type
      const fileBlob = new Blob([blob], { type: contentType });
      const blobUrl = window.URL.createObjectURL(fileBlob);
      
      toast.dismiss();
      
      // For PDFs, open in new tab; for other files, trigger download
      if (fileName.endsWith('.pdf')) {
        // Open PDF in new window
        const newWindow = window.open(blobUrl, '_blank');
        if (newWindow) {
          toast.success('PDF opened in new tab!');
        } else {
          toast.error('Please allow popups to view PDFs');
        }
      } else {
        // Trigger download for other file types
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success('File downloaded successfully!');
      }
      
      // Clean up the blob URL after some time
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
    } catch (error) {
      toast.dismiss();
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to load file');
    }
  };

  if (userLoading || examsLoading || submissionsLoading || assignmentsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Management</h1>
          <p className="text-gray-600">Manage exam questions and submit student grades</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('submissions')}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedTab === 'submissions'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Submissions
            </button>
            <button
              onClick={() => setSelectedTab('upload')}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedTab === 'upload'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload Submission
            </button>
          </div>
        </div>

        {/* Submissions Tab */}
        {selectedTab === 'submissions' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submission History</h2>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No submissions yet</p>
                  <button
                    onClick={() => setSelectedTab('upload')}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Upload your first submission
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {sub.exam_name || 'Unknown Exam'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {sub.class_level}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {sub.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              {sub.submission_type === 'questions' ? 
                                <FileText className="w-4 h-4" /> : 
                                <FileSpreadsheet className="w-4 h-4" />
                              }
                              {sub.submission_type === 'questions' ? 'Questions' : 'Grades'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              {getStatusBadge(sub.status)}
                              {sub.status === 'rejected' && sub.remarks && (
                                <div className="mt-1">
                                  <details className="text-xs">
                                    <summary className="cursor-pointer text-red-600 hover:text-red-800 font-medium">
                                      View Remarks
                                    </summary>
                                    <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-700">
                                      {sub.remarks}
                                    </div>
                                  </details>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {sub.file || sub.file_url ? (
                              <button 
                                onClick={() => handleViewFile(sub)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View File
                              </button>
                            ) : (
                              <span className="text-gray-400">No file</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {selectedTab === 'upload' && (
          <div className="space-y-6">
            {/* Select Exam */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Exam</h2>
              {filteredExams.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No exams assigned to you yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredExams.map((exam) => (
                    <div
                      key={exam.id}
                      onClick={() => setSelectedExam(exam)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedExam?.id === exam.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exam.exam_name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Term {exam.term} - {exam.academic_year}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(exam.start_date).toLocaleDateString()} - {new Date(exam.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          new Date(exam.end_date) >= new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {new Date(exam.end_date) >= new Date() ? 'Active' : 'Ended'}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-4 text-sm">
                        <span className="text-gray-600">
                          <strong>Classes:</strong> {exam.classes?.includes('all') ? 'All Classes' : exam.classes?.join(', ')}
                        </span>
                        <span className="text-gray-600">
                          <strong>Subjects:</strong> {exam.subjects?.includes('all') ? 'All Subjects' : exam.subjects?.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Forms */}
            {selectedExam && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Questions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Upload Question Paper</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                      <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select class...</option>
                        {(selectedExam.classes?.includes('all') ? teacherAssignments?.classes : selectedExam.classes)?.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select 
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select subject...</option>
                        {(selectedExam.subjects?.includes('all') ? teacherAssignments?.subjects : selectedExam.subjects)?.map(subj => (
                          <option key={subj} value={subj}>{subj}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleFileUpload('questions')}
                      disabled={!selectedClass || !selectedSubject || isUploading}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className={`w-5 h-5 ${isUploading ? 'animate-spin' : ''}`} />
                      {isUploading ? 'Uploading...' : 'Upload Questions (PDF/Word)'}
                    </button>

                    <p className="text-xs text-gray-500">
                      Accepted formats: PDF, Word (.doc, .docx)
                    </p>
                  </div>
                </div>

                {/* Upload Grades */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Upload Grade Sheet</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                      <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select class...</option>
                        {(selectedExam.classes?.includes('all') ? teacherAssignments?.classes : selectedExam.classes)?.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select 
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select subject...</option>
                        {(selectedExam.subjects?.includes('all') ? teacherAssignments?.subjects : selectedExam.subjects)?.map(subj => (
                          <option key={subj} value={subj}>{subj}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleDownloadTemplate}
                      disabled={!selectedClass || !selectedSubject || isDownloading}
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className={`w-5 h-5 ${isDownloading ? 'animate-spin' : ''}`} />
                      {isDownloading ? 'Downloading...' : 'Download Grade Template'}
                    </button>

                    <button
                      onClick={() => handleFileUpload('grades')}
                      disabled={!selectedClass || !selectedSubject || isUploading}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className={`w-5 h-5 ${isUploading ? 'animate-spin' : ''}`} />
                      {isUploading ? 'Uploading...' : 'Upload Filled Grades (CSV/Excel)'}
                    </button>

                    <p className="text-xs text-gray-500">
                      1. Download template<br />
                      2. Fill in the marks<br />
                      3. Upload completed file
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherExamManagement;
