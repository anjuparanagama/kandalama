'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/context/AdminAuthContext';

export function AdminHeader() {
  const router = useRouter();
  const { username, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-600">
            Welcome, <span className="font-semibold">{username}</span>
          </span>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
