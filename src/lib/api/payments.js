// File: src/lib/api/payments.js

// ==================== src/lib/api/payments.js ====================
import { apiClient, handleApiResponse } from './client';

export const paymentsApi = {
  getAll: () =>
    handleApiResponse(apiClient.get('/payments/')),
  
  getMy: () =>
    handleApiResponse(apiClient.get('/payments/my_payments/')),
  
  create: (data) =>
    handleApiResponse(apiClient.post('/payments/', data)),
  
  getById: (id) =>
    handleApiResponse(apiClient.get(`/payments/${id}/`)),
};
