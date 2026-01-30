// src/app/debug-auth/page.jsx
'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';

export default function DebugAuth() {
  const { userId, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [backendUser, setBackendUser] = useState(null);
  const [backendProfile, setBackendProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!authLoaded || !userLoaded) return;
      
      try {
        // Get backend user
        const userRes = await apiClient.get('/users/me/');
        setBackendUser(userRes.data);

        // Try to get profile based on role
        if (userRes.data.role === 'student') {
          try {
            const profileRes = await apiClient.get('/students/me/');
            setBackendProfile(profileRes.data);
          } catch (e) {
            console.log('No student profile');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoaded, userLoaded]);

  const syncMetadata = async () => {
    setSyncing(true);
    try {
      await apiClient.post('/users/sync_clerk_metadata/');
      await user.reload();
      alert('Metadata synced! Please refresh the page.');
    } catch (error) {
      alert('Error syncing: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  if (!authLoaded || !userLoaded || loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth Debug Information</h1>

        {/* Clerk Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Clerk Information</h2>
          <div className="space-y-2">
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
            <p><strong>Name:</strong> {user?.fullName}</p>
            <p><strong>Role in publicMetadata:</strong> {user?.publicMetadata?.role || 'NOT SET'}</p>
            <p><strong>Role in unsafeMetadata:</strong> {user?.unsafeMetadata?.role || 'NOT SET'}</p>
          </div>
        </div>

        {/* Backend User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Backend User Information</h2>
          {backendUser ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {backendUser.email}</p>
              <p><strong>Name:</strong> {backendUser.first_name} {backendUser.last_name}</p>
              <p><strong>Role:</strong> {backendUser.role || 'NOT SET'}</p>
              <p><strong>Clerk ID:</strong> {backendUser.clerk_id}</p>
            </div>
          ) : (
            <p className="text-red-600">No backend user found</p>
          )}
        </div>

        {/* Backend Profile Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Backend Profile Information</h2>
          {backendProfile ? (
            <div className="space-y-2">
              <p><strong>Student ID:</strong> {backendProfile.student_id}</p>
              <p><strong>Class Level:</strong> {backendProfile.class_level}</p>
              <p><strong>Stream:</strong> {backendProfile.education_stream}</p>
              <p><strong>Specialization:</strong> {backendProfile.specialization || 'N/A'}</p>
            </div>
          ) : (
            <p className="text-red-600">No profile found</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Actions</h2>
          <button
            onClick={syncMetadata}
            disabled={syncing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync Clerk Metadata'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            This will sync your backend role to Clerk's publicMetadata
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 space-x-4">
          <a href="/" className="text-blue-600 hover:underline">Go to Home</a>
          <a href="/complete-registration" className="text-blue-600 hover:underline">Go to Complete Registration</a>
          <a href="/dashboard/student" className="text-blue-600 hover:underline">Go to Student Dashboard</a>
        </div>
      </div>
    </div>
  );
}
