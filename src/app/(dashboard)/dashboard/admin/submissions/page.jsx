'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examSubmissionsApi } from '@/lib/api';
import { useCurrentUser } from '@/lib/hooks/use-user';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  FileText, 
  FileSpreadsheet,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardSkeleton } from '@/components/shared/loading';

const AdminExamSubmissions = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('submitted');
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  // Fetch all submissions (admin can see all)
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['admin-exam-submissions'],
    queryFn: () => examSubmissionsApi.getAll(),
    enabled: !!user && user.role === 'admin',
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (submissionId) => examSubmissionsApi.approve(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-exam-submissions']);
      toast.success('Submission approved successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to approve submission');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ submissionId, remarks }) => 
      examSubmissionsApi.reject(submissionId, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-exam-submissions']);
      toast.success('Submission rejected');
      setShowRejectModal(null);
      setRejectRemarks('');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reject submission');
    },
  });

  // Filter submissions by status
  const filteredSubmissions = submissions.filter(
    (sub) => sub.status === selectedStatus
  );

  // Group submissions by exam
  const groupedSubmissions = filteredSubmissions.reduce((acc, sub) => {
    const examKey = sub.exam_name || 'Unknown Exam';
    if (!acc[examKey]) acc[examKey] = [];
    acc[examKey].push(sub);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      submitted: 'bg-green-100 text-green-800 border-green-300',
      approved: 'bg-blue-100 text-blue-800 border-blue-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      submitted: CheckCircle,
      approved: CheckCircle,
      rejected: XCircle,
    };
    return icons[status] || Clock;
  };

  const handleApprove = (submissionId) => {
    if (confirm('Are you sure you want to approve this submission?')) {
      approveMutation.mutate(submissionId);
    }
  };

  const handleRejectClick = (submission) => {
    setShowRejectModal(submission);
  };

  const handleRejectSubmit = () => {
    if (!rejectRemarks.trim()) {
      toast.error('Please provide remarks for rejection');
      return;
    }
    rejectMutation.mutate({
      submissionId: showRejectModal.id,
      remarks: rejectRemarks,
    });
  };

  const handleViewFile = async (submission) => {
    try {
      toast.loading('Loading file...');
      const blob = await examSubmissionsApi.downloadFile(submission.id);
      const fileName = submission.file_name || 'download';
      
      let contentType = 'application/octet-stream';
      if (fileName.endsWith('.pdf')) contentType = 'application/pdf';
      else if (fileName.endsWith('.docx')) 
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (fileName.endsWith('.xlsx')) 
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
      const fileBlob = new Blob([blob], { type: contentType });
      const blobUrl = window.URL.createObjectURL(fileBlob);
      
      toast.dismiss();
      
      if (fileName.endsWith('.pdf')) {
        window.open(blobUrl, '_blank');
        toast.success('PDF opened in new tab!');
      } else {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success('File downloaded!');
      }
      
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || 'Failed to load file');
    }
  };

  const toggleExpand = (id) => {
    setExpandedSubmission(expandedSubmission === id ? null : id);
  };

  if (userLoading || submissionsLoading) {
    return <DashboardSkeleton />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exam Submissions Review
          </h1>
          <p className="text-gray-600">
            Review and approve teacher submissions for exam questions and grades
          </p>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { key: 'submitted', label: 'Pending Review', count: submissions.filter(s => s.status === 'submitted').length },
              { key: 'approved', label: 'Approved', count: submissions.filter(s => s.status === 'approved').length },
              { key: 'rejected', label: 'Rejected', count: submissions.filter(s => s.status === 'rejected').length },
              { key: 'pending', label: 'Not Uploaded', count: submissions.filter(s => s.status === 'pending').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-6 py-3 font-medium transition-colors flex-shrink-0 ${
                  selectedStatus === tab.key
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedStatus === tab.key
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {selectedStatus} submissions
            </h3>
            <p className="text-gray-500">
              {selectedStatus === 'submitted' && 'All submissions have been reviewed'}
              {selectedStatus === 'approved' && 'No approved submissions yet'}
              {selectedStatus === 'rejected' && 'No rejected submissions yet'}
              {selectedStatus === 'pending' && 'All submissions are uploaded'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedSubmissions).map(([examName, examSubmissions]) => (
              <div key={examName} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Exam Header */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">{examName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {examSubmissions.length} submission{examSubmissions.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Submissions */}
                <div className="divide-y divide-gray-200">
                  {examSubmissions.map((submission) => {
                    const StatusIcon = getStatusIcon(submission.status);
                    const isExpanded = expandedSubmission === submission.id;

                    return (
                      <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Main Info */}
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium text-gray-900">
                                    {submission.teacher_name || 'Unknown Teacher'}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-sm text-gray-600">
                                    {submission.class_level} - {submission.subject}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    {submission.submission_type === 'questions' ? (
                                      <>
                                        <FileText className="w-4 h-4" />
                                        Question Paper
                                      </>
                                    ) : (
                                      <>
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Grade Sheet
                                      </>
                                    )}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span>
                                    {new Date(submission.created_at).toLocaleDateString()}
                                  </span>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-3">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                  </span>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-500">Teacher ID:</span>
                                        <span className="ml-2 font-medium">{submission.teacher_id}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Uploaded:</span>
                                        <span className="ml-2 font-medium">
                                          {new Date(submission.created_at).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>

                                    {submission.reviewed_at && (
                                      <div className="text-sm">
                                        <span className="text-gray-500">Reviewed:</span>
                                        <span className="ml-2 font-medium">
                                          {new Date(submission.reviewed_at).toLocaleString()} by {submission.reviewed_by_name}
                                        </span>
                                      </div>
                                    )}

                                    {submission.remarks && (
                                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                        <div className="flex items-start gap-2">
                                          <MessageSquare className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <p className="text-sm font-medium text-red-900">Rejection Remarks:</p>
                                            <p className="text-sm text-red-700 mt-1">{submission.remarks}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => toggleExpand(submission.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                              title={isExpanded ? 'Show less' : 'Show more'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>

                            <button
                              onClick={() => handleViewFile(submission)}
                              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>

                            {submission.status === 'submitted' && (
                              <>
                                <button
                                  onClick={() => handleApprove(submission.id)}
                                  disabled={approveMutation.isLoading}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>

                                <button
                                  onClick={() => handleRejectClick(submission)}
                                  disabled={rejectMutation.isLoading}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reject Submission</h3>
                  <p className="text-sm text-gray-600">
                    {showRejectModal.teacher_name} - {showRejectModal.subject}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection *
                </label>
                <textarea
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  placeholder="Explain why this submission needs revision..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectRemarks('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={rejectMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={rejectMutation.isLoading || !rejectRemarks.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExamSubmissions;
