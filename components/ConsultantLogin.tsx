'use client';

import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Heart, UserCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ConsultantLoginProps {
  onLoginSuccess?: () => void;
}

export const ConsultantLogin: React.FC<ConsultantLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/consultant/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      // Save token to localStorage
      localStorage.setItem('herhealth_consultant_token', data.token);
      localStorage.setItem('herhealth_consultant_email', email);

      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.location.href = '/consultant/dashboard';
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Consultant login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="bg-brand-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl rotate-3 group hover:rotate-0 transition-transform">
            <UserCircle className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Consultant Portal</h1>
          <p className="text-slate-500 font-medium">Providing expert guidance for young women.</p>
        </div>

        <div className="card shadow-2xl p-10 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="consultant@herhealth.org"
                  required
                />
              </div>
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
              disabled={isLoading || !email || !password}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Signing In...' : 'Access Portal'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
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
