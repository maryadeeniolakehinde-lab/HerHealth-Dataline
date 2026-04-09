'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock } from 'lucide-react';

interface ConsultantLoginProps {
  onLoginSuccess?: () => void;
}

export const ConsultantLogin: React.FC<ConsultantLoginProps> = ({ onLoginSuccess }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/consultant/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError('Invalid email or password');
        return;
      }

      const data = await response.json();
      localStorage.setItem('consultant_token', data.token);
      localStorage.setItem('consultant_id', data.consultant_id);
      
      // Call callback if provided, otherwise redirect
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        router.push('/consultant/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-pink-600 to-purple-600 p-4 rounded-full">
            <Heart className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Consultant Portal
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Sign in to access the chat queue and help users
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                placeholder="you@herhealth.org"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            Need help? Contact the admin at
            <br />
            <a href="mailto:admin@herhealth.org" className="text-pink-600 font-medium">
              admin@herhealth.org
            </a>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-900">
            <strong>🔒 Privacy Reminder:</strong> Never ask users for personal
            information. Only use their User ID, age range, and state for
            context.
          </p>
        </div>
      </div>
    </div>
  );
};
