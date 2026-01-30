// src/hooks/useApi.js
'use client';

import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useMemo } from 'react';

export function useApi() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const apiClient = useMemo(() => {
    const client = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to every request
    client.interceptors.request.use(
      async (config) => {
        if (isLoaded && isSignedIn) {
          try {
            const token = await getToken();
            
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              console.log('✅ Token added to request:', token.substring(0, 20) + '...');
            } else {
              console.warn('⚠️ No token available');
            }
          } catch (error) {
            console.error('❌ Error getting token:', error);
          }
        } else {
          console.warn('⚠️ User not loaded or not signed in');
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle errors
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.error('🔒 Auth error:', error.response?.data);
        }
        return Promise.reject(error);
      }
    );

    return client;
  }, [getToken, isLoaded, isSignedIn]);

  return apiClient;
}