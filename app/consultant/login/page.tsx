import { Metadata } from 'next';
import { ConsultantLogin } from '@/components/ConsultantLogin';

export const metadata: Metadata = {
  title: 'Consultant Login - HerHealth',
};

export default function ConsultantLoginPage() {
  return (
    <ConsultantLogin
      onLoginSuccess={() => {
        // Redirect handled client-side
        window.location.href = '/consultant/dashboard';
      }}
    />
  );
}
