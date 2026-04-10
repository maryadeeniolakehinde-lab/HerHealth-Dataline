'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Heart, ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
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
        body: JSON.stringify({
          email,
          password,
          token: adminToken,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to set password');
        return;
      }

      setAdminSession(email, data.token);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Password setup failed. Please try again.');
      console.error('Admin password setup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl rotate-3 group hover:rotate-0 transition-transform">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 font-medium">Secure access for HerHealth administrators.</p>
        </div>

        <div className="card shadow-2xl p-10 animate-slide-up">
          {step === 'email' ? (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
                    placeholder="admin@herhealth.org"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 items-start animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-xs font-semibold text-red-800 leading-tight">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 group"
              >
                {isLoading ? 'Verifying...' : 'Continue'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : step === 'password' ? (
            <form className="space-y-6" onSubmit={handlePasswordLogin}>
              <div className="flex items-center gap-2 mb-2">
                <button 
                  type="button" 
                  onClick={() => setStep('email')}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-500" />
                </button>
                <span className="text-sm font-bold text-slate-500">{email}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
                    placeholder="Enter your password"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 items-start animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-xs font-semibold text-red-800 leading-tight">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full btn-primary py-4 text-lg"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handlePasswordSetup}>
              <div className="text-center space-y-2 mb-4">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Setup Password</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Please create a secure password for your administrator account.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
                    placeholder="Min. 8 characters"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 items-start animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-xs font-semibold text-red-800 leading-tight">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full btn-primary py-4 text-lg"
              >
                {isLoading ? 'Setting up...' : 'Create Admin Account'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-600 font-bold text-sm transition-colors">
            <Heart className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
