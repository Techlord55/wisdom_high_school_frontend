// ==================== src/app/(dashboard)/dashboard/page.jsx ====================
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

async function getUserRole() {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    
    if (!token) {
      return null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const response = await fetch(`${apiUrl}/api/v1/users/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch user role:', response.status);
      return null;
    }

    const userData = await response.json();
    return userData.role;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const role = await getUserRole();

  // Redirect based on role
  if (!role) {
    redirect('/complete-registration');
  }

  // Redirect to role-specific dashboard
  switch (role) {
    case 'admin':
      redirect('/dashboard/admin');
    case 'teacher':
      redirect('/dashboard/teacher');
    case 'student':
      redirect('/dashboard/student');
    default:
      redirect('/complete-registration');
  }
}
