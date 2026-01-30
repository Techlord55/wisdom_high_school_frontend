// src/lib/api/client.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This will be set by the API provider
let getTokenFunction = null;

export function setTokenGetter(fn) {
  getTokenFunction = fn;
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    if (getTokenFunction) {
      try {
        // Add a timeout to prevent infinite waiting
        const token = await Promise.race([
          getTokenFunction(),
          new Promise((resolve) => setTimeout(() => resolve(null), 5000))
        ]);
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Token added to request:', config.url);
        } else {
          console.warn('⚠️ No token available for request:', config.url);
        }
      } catch (error) {
        console.error('❌ Error getting token:', error);
      }
    } else {
      console.warn('⚠️ Token getter not initialized for request:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// Improved Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log if it's a genuine 401/403 response from the server
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401 || status === 403) {
        const msg = data?.detail || data?.message || data;
        // Ignore the generic "no credentials" message as it's usually just a race condition
        if (msg !== "Authentication credentials were not provided.") {
          console.error('🔒 Auth error:', msg);
        }
      }
    } 
    // Handle cases where the request failed to reach the server (Network Error)
    else if (error.request) {
      console.warn('📡 Network error: No response received');
    }

    return Promise.reject(error);
  }
);

export async function handleApiResponse(promise) {
  try {
    const response = await promise;
    const data = response?.data;
    
    // Handle different response formats:
    // 1. Wrapped in 'data' property: { data: {...} }
    // 2. DRF paginated: { count, next, previous, results }
    // 3. Plain array or object
    
    // Check if it's wrapped in a 'data' property
    if (data?.data !== undefined) {
      return data.data;
    }
    
    // Check if it's a DRF paginated response
    if (data?.results !== undefined && Array.isArray(data.results)) {
      // For list endpoints, return just the results array for simpler consumption
      // If you need pagination metadata, access it from the hook directly
      return data.results;
    }
    
    // Return as-is (could be array, object, or null)
    return data ?? null;
  } catch (error) {
    // Extract the actual message
    const serverMessage = error.response?.data?.detail || error.response?.data?.message;
    const errorMessage = serverMessage || error.message || 'An unexpected error occurred';
    
    // Don't log authentication credential errors as they're handled by the interceptor
    if (errorMessage !== "Authentication credentials were not provided.") {
      console.error(`❌ API Error [${error.response?.status || 'Network'}]: ${errorMessage}`);
      
      // Only log the object if there's actually a response to show
      if (error.response && process.env.NODE_ENV === 'development') {
        console.dir({
          status: error.response.status,
          data: error.response.data,
          path: error.config?.url
        });
      }
    }

    throw new Error(errorMessage);
  }
}
