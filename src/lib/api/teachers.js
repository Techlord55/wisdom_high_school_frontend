// File: src/lib/api/teachers.js
// ==================== src/lib/api/teachers.js ====================
import { apiClient, handleApiResponse } from './client';

export const teachersApi = {
  // Get all teachers
  getAll: (params) =>
    handleApiResponse(apiClient.get('/teachers/', { params })),
  
  // Get teacher by ID
  getById: (id) =>
    handleApiResponse(apiClient.get(`/teachers/${id}/`)),
  
  // Get current teacher profile
  getMe: () =>
    handleApiResponse(apiClient.get('/teachers/me/')),
  
  // Create new teacher (admin only)
  create: (data) =>
    handleApiResponse(apiClient.post('/teachers/', data)),
  
  // Update teacher
  update: (id, data) =>
    handleApiResponse(apiClient.patch(`/teachers/${id}/`, data)),
  
  // Delete teacher
  delete: (id) =>
    handleApiResponse(apiClient.delete(`/teachers/${id}/`)),
  
  // Assign classes to teacher
  assignClasses: (id, classes) =>
    handleApiResponse(apiClient.post(`/teachers/${id}/assign_classes/`, { classes })),
  
  // Assign subjects to teacher
  assignSubjects: (id, subjects) =>
    handleApiResponse(apiClient.post(`/teachers/${id}/assign_subjects/`, { subjects })),
  
  // Set teaching hours
  setHours: (id, hours_per_week) =>
    handleApiResponse(apiClient.post(`/teachers/${id}/set_hours/`, { hours_per_week })),
  
  // Set password for teacher (admin only)
  setPassword: (id, password) =>
    handleApiResponse(apiClient.post(`/teachers/${id}/set_password/`, { password })),
};
