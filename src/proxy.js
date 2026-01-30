// src/proxy.js
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',
  '/contact',
  '/programs(.*)',
  '/api/webhooks(.*)'
]);

const isCompleteRegistrationRoute = createRouteMatcher(['/complete-registration(.*)']);
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/dashboard/admin(.*)']);
const isStudentRoute = createRouteMatcher(['/dashboard/student(.*)']);
const isTeacherRoute = createRouteMatcher(['/dashboard/teacher(.*)']);

// Simple in-memory cache for role checks (expires after 30 seconds)
const roleCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

function getCachedRole(userId) {
  const cached = roleCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.role;
  }
  return null;
}

function setCachedRole(userId, role) {
  roleCache.set(userId, { role, timestamp: Date.now() });
  
  // Clean up old cache entries
  if (roleCache.size > 100) {
    const now = Date.now();
    for (const [key, value] of roleCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        roleCache.delete(key);
      }
    }
  }
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, getToken } = await auth();
  
  console.log('🔒 Middleware - Path:', req.nextUrl.pathname);
  
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in
  if (!userId) {
    console.log('❌ No userId, redirecting to sign-in');
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // IMPORTANT: Always allow complete-registration for authenticated users
  if (isCompleteRegistrationRoute(req)) {
    console.log('⏳ Allowing access to complete-registration');
    return NextResponse.next();
  }
  
  // For dashboard routes, check user role
  if (isDashboardRoute(req)) {
    try {
      // Check cache first
      let userRole = getCachedRole(userId);
      
      if (userRole) {
        console.log('💾 Using cached role:', userRole);
      } else {
        // Get the auth token
        const token = await getToken();
        
        if (!token) {
          console.log('⚠️ No token available, redirecting to registration');
          return NextResponse.redirect(new URL('/complete-registration', req.url));
        }

        // Fetch user data from backend to check role
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        console.log('🔍 Fetching user role from backend');
        
        const response = await fetch(`${apiUrl}/api/v1/users/me/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          console.log('⚠️ Could not fetch user data, redirecting to registration');
          return NextResponse.redirect(new URL('/complete-registration', req.url));
        }

        const userData = await response.json();
        userRole = userData.role;
        
        // Cache the role
        if (userRole) {
          setCachedRole(userId, userRole);
        }
        
        console.log('👤 User role from backend:', userRole);
      }

      // If no role, redirect to complete registration
      if (!userRole) {
        console.log('⚠️ No role in backend, redirecting to registration');
        return NextResponse.redirect(new URL('/complete-registration', req.url));
      }

      // If user is on /dashboard (exact), redirect to role-specific dashboard
      if (req.nextUrl.pathname === '/dashboard') {
        console.log('🔀 Redirecting from /dashboard to role-specific dashboard');
        const redirectPath = userRole === 'admin' ? '/dashboard/admin'
                           : userRole === 'teacher' ? '/dashboard/teacher'
                           : userRole === 'student' ? '/dashboard/student'
                           : '/complete-registration';
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }

      // Role-based access control for specific dashboard routes
      
      // Admin route protection
      if (isAdminRoute(req) && userRole !== 'admin') {
        console.log(`⛔ Access denied to admin route for role: ${userRole}`);
        const redirectPath = userRole === 'student' ? '/dashboard/student' 
                           : userRole === 'teacher' ? '/dashboard/teacher'
                           : '/complete-registration';
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
      
      // Student route protection
      if (isStudentRoute(req) && userRole !== 'student') {
        console.log(`⛔ Access denied to student route for role: ${userRole}`);
        const redirectPath = userRole === 'admin' ? '/dashboard/admin' 
                           : userRole === 'teacher' ? '/dashboard/teacher'
                           : '/complete-registration';
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
      
      // Teacher route protection
      if (isTeacherRoute(req) && userRole !== 'teacher') {
        console.log(`⛔ Access denied to teacher route for role: ${userRole}`);
        const redirectPath = userRole === 'admin' ? '/dashboard/admin' 
                           : userRole === 'student' ? '/dashboard/student'
                           : '/complete-registration';
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }

      console.log('✅ Access granted to:', req.nextUrl.pathname);
      return NextResponse.next();

    } catch (error) {
      console.error('❌ Error checking user role:', error);
      // If there's an error fetching from backend, redirect to registration
      return NextResponse.redirect(new URL('/complete-registration', req.url));
    }
  }

  // Default allow
  console.log('✅ Access granted (default):', req.nextUrl.pathname);
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
