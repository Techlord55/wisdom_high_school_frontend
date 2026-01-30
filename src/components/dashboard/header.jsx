// File: src/components/dashboard/header.jsx
// ==================== src/components/dashboard/header.jsx ====================
'use client';

import { Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserButton, useClerk } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/lib/hooks/use-user';
import { useRouter } from 'next/navigation';

export function Header() {
  const { signOut } = useClerk();
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Notifications</h3>
              <p className="text-sm text-gray-500">No new notifications</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu with Clerk UserButton */}
        <div className="flex items-center gap-3">
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Additional Logout Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSignOut}
          className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
