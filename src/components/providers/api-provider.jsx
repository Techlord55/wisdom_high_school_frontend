// File: src/components/providers/api-provider.jsx

'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { setTokenGetter } from '@/lib/api/client';

export function ApiProvider({ children }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // Always set the token getter, even if not loaded yet
    setTokenGetter(async () => {
      try {
        // Wait for Clerk to be loaded
        if (!isLoaded) {
          console.log('⏳ Clerk not loaded yet, waiting...');
          // Return null and let the request retry
          return null;
        }
        
        // Only try to get token if user is signed in
        if (!isSignedIn) {
          console.log('⚠️ User not signed in');
          return null;
        }
        
        // Get the token
        const token = await getToken();
        
        if (token) {
          console.log('✅ Token retrieved successfully');
        } else {
          console.warn('⚠️ No token available');
        }
        
        return token;
      } catch (error) {
        console.error('❌ Error getting token:', error);
        return null;
      }
    });
    
    console.log('🔧 Token getter initialized', { isLoaded, isSignedIn });
  }, [getToken, isLoaded, isSignedIn]);

  return <>{children}</>;
}
