import { Metadata } from 'next';
import { AdminDashboard } from '@/components/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - HerHealth',
  description: 'NGO Admin dashboard for anonymized health advocacy data',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
