'use client';

import { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { setAdminSession } from '@/lib/adminAuth';

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@herhealth.org');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Invalid email or password');
        return;
      }

      setAdminSession(email, data.token);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Unable to sign in. Please try again.');
      console.error('Admin login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-pink-100 text-pink-700 rounded-full p-4 shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">Admin Sign In</h1>
        <p className="text-center text-gray-500 mb-6">
          Secure access for NGO admins to review anonymized health insights.
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              Email address
            </label>
            <div className="relative rounded-xl border border-gray-200 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-none bg-transparent py-3 pl-11 pr-4 text-gray-900 outline-none"
                placeholder="admin@herhealth.org"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative rounded-xl border border-gray-200 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-none bg-transparent py-3 pl-11 pr-4 text-gray-900 outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-white font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-500 text-center">
          If you need help, contact <strong>admin@herhealth.org</strong>
        </p>
      </div>
    </div>
  );
};
