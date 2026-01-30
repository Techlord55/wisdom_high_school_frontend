// File: src/components/dashboard/sidebar.jsx

// ==================== src/components/dashboard/sidebar.jsx ====================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { useCurrentUser } from '@/lib/hooks/use-user';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Settings,
  BookOpen,
  ClipboardCheck,
  FileText,
  BarChart3,
  Award,
  Calendar,
  DollarSign,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const navigation = {
  student: [
    { name: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'My Subjects', href: '/dashboard/student/subjects', icon: BookOpen },
    { name: 'My Results', href: '/dashboard/student/results', icon: Award },
    { name: 'My Grades', href: '/dashboard/student/grades', icon: BarChart3 },
    { name: 'Attendance', href: '/dashboard/student/attendance', icon: ClipboardCheck },
    { name: 'Assignments', href: '/dashboard/student/assignments', icon: GraduationCap },
    { name: 'Transcript', href: '/dashboard/student/transcript', icon: FileText },
    { name: 'Payments', href: '/dashboard/student/payments', icon: CreditCard },
    { name: 'Profile', href: '/dashboard/student/profile', icon: Users },
  ],
  teacher: [
    { name: 'Dashboard', href: '/dashboard/teacher', icon: LayoutDashboard },
    { name: 'Exam Management', href: '/dashboard/teacher/exam-management', icon: Inbox },
    { name: 'Exams', href: '/dashboard/teacher/exams', icon: Calendar },
    { name: 'Grade Entry', href: '/dashboard/teacher/grades', icon: BookOpen },
    { name: 'Students', href: '/dashboard/teacher/students', icon: GraduationCap },
    { name: 'Attendance', href: '/dashboard/teacher/attendance', icon: ClipboardCheck },
    { name: 'Assignments', href: '/dashboard/teacher/assignments', icon: FileText },
    { name: 'Salary', href: '/dashboard/teacher/salary', icon: DollarSign },
    { name: 'Profile', href: '/dashboard/teacher/profile', icon: Users },
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Exam Management', href: '/dashboard/admin/exams', icon: Calendar },
    { name: 'Teacher Submissions', href: '/dashboard/admin/submissions', icon: Inbox },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'Students', href: '/dashboard/admin/students', icon: GraduationCap },
    { name: 'Teachers', href: '/dashboard/admin/teachers', icon: Users },
    { name: 'Payments', href: '/dashboard/admin/payments', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <Skeleton className="h-8 w-full mb-6" />
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full mb-2" />
        ))}
      </div>
    );
  }

  const nav = navigation[user?.role || 'student'];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Wisdom High School</h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
