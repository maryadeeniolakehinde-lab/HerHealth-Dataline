import { Metadata } from 'next';
import { AdminPageClient } from '@/components/AdminPageClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard - HerHealth',
  description: 'NGO Admin dashboard for anonymized health advocacy data',
};

export default function AdminPage() {
  return <AdminPageClient />;
}
