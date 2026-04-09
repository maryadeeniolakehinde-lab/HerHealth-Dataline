import { Metadata } from 'next';
import { ConsultantDashboard } from '@/components/ConsultantDashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Consultant Portal',
};

export default function ConsultantDashboardPage() {
  return <ConsultantDashboard />;
}
