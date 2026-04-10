'use client';

import { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { setAdminSession } from '@/lib/adminAuth';

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'email' | 'password' | 'password-setup'>('email');
  const [email, setEmail] = useState('herhealthdataline@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminToken, setAdminToken] = useState('');

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Unable to verify email');
        return;
      }

      if (data.requiresPasswordSetup) {
        setAdminToken(data.token);
        setStep('password-setup');
      } else {
        setStep('password');
      }
    } catch (err) {
      setError('Unable to verify email. Please try again.');
      console.error('Admin login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (event: React.FormEvent<HTMLFormElement>) => {
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
        setError(data.error || 'Invalid password');
        return;
      }

      setAdminSession(email, data.token);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Admin login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSetup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to set password');
        return;
      }

      setAdminSession(email, adminToken);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Unable to set password. Please try again.');
      console.error('Password setup error:', err);
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

        {step === 'email' ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Admin Access
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Enter your email to access the admin dashboard.
            </p>

            <form className="space-y-5" onSubmit={handleEmailSubmit}>
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
                    placeholder="herhealthdataline@gmail.com"
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
                disabled={isLoading || !email}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-white font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Verifying...' : 'Continue'}
              </button>
            </form>
          </>
        ) : step === 'password' ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Welcome Back
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Enter your password to continue.
            </p>

            <form className="space-y-5" onSubmit={handlePasswordLogin}>
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
                    autoFocus
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              ) : null}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-white font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  Use a different email
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Set Your Password
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Create a secure password for your admin account.
            </p>

            <form className="space-y-5" onSubmit={handlePasswordSetup}>
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
                    placeholder="At least 8 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative rounded-xl border border-gray-200 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border-none bg-transparent py-3 pl-11 pr-4 text-gray-900 outline-none"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/** Password strength indicator **/}
              {password && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Password requirements:</span>
                  </div>
                  <ul className="space-y-1 ml-6">
                    <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                      ✓ At least 8 characters
                    </li>
                    <li className={password === confirmPassword && confirmPassword ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Passwords match
                    </li>
                  </ul>
                </div>
              )}

              {error ? (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-white font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Setting up...' : 'Complete Setup'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
