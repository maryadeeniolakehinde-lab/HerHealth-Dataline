'use client';

import { useEffect, useState } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminLogin } from '@/components/AdminLogin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export const AdminPageClient: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
  }, []);

  return authenticated ? (
    <AdminDashboard />
  ) : (
    <AdminLogin onLoginSuccess={() => setAuthenticated(true)} />
  );
};
