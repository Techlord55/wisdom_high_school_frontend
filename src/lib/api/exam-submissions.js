import { apiClient, handleApiResponse } from './client';

export const examSubmissionsApi = {
  // Get all submissions
  getAll: (params) =>
    handleApiResponse(apiClient.get('/exam-submissions/', { params })),
  
  // Get teacher's assigned classes and subjects
  getTeacherAssignments: () =>
    handleApiResponse(apiClient.get('/exam-submissions/teacher_assignments/')),
  
  // Upload question paper
  uploadQuestions: async (examId, classLevel, subject, file) => {
    const formData = new FormData();
    formData.append('exam_id', examId);
    formData.append('class_level', classLevel);
    formData.append('subject', subject);
    formData.append('file', file);
    
    return handleApiResponse(
      apiClient.post('/exam-submissions/upload_questions/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );
  },
  
  // Download grade template
  downloadTemplate: async (examId, classLevel, subject) => {
    const response = await apiClient.get(
      '/exam-submissions/download_template/',
      {
        params: { exam_id: examId, class_level: classLevel, subject: subject },
        responseType: 'blob'
      }
    );
    return response.data;
  },
  
  // Upload filled grades
  uploadGrades: async (examId, classLevel, subject, file) => {
    const formData = new FormData();
    formData.append('exam_id', examId);
    formData.append('class_level', classLevel);
    formData.append('subject', subject);
    formData.append('file', file);
    
    return handleApiResponse(
      apiClient.post('/exam-submissions/upload_grades/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );
  },
  
  // Download submission file - Returns blob data
  downloadFile: async (submissionId) => {
    const response = await apiClient.get(
      `/exam-submissions/${submissionId}/download/`,
      { 
        responseType: 'blob',
        // Ensure we get the raw blob, not parsed JSON
        transformResponse: [(data) => data]
      }
    );
    return response.data;
  },

  // Get download URL for direct link
  getDownloadUrl: (submissionId) => {
    // Get the base URL from the axios instance
    const baseURL = apiClient.defaults.baseURL || '';
    return `${baseURL}/exam-submissions/${submissionId}/download/`;
  },

  // Approve submission (admin only)
  approve: (submissionId) =>
    handleApiResponse(
      apiClient.post(`/exam-submissions/${submissionId}/approve/`)
    ),

  // Reject submission (admin only)
  reject: (submissionId, remarks) =>
    handleApiResponse(
      apiClient.post(`/exam-submissions/${submissionId}/reject/`, { remarks })
    )
};
