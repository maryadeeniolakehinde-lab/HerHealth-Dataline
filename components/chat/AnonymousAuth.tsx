'use client';

import React, { useState } from 'react';
import { Heart, ArrowRight, Lock, Eye, Shield } from 'lucide-react';

interface AnonymousAuthProps {
  onUserCreated: (userId: string) => void;
}

export const AnonymousAuth: React.FC<AnonymousAuthProps> = ({
  onUserCreated,
}) => {
  const [step, setStep] = useState<'welcome' | 'input' | 'created'>('welcome');
  const [ageRange, setAgeRange] = useState('');
  const [state, setState] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ageRanges = ['13-15', '16-18', '19-25', '26-30', '30+'];

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti',
    'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
    'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun',
    'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara', 'FCT',
  ];

  const handleCreateNew = async () => {
    if (!ageRange || !state) {
      alert('Please select both age range and state');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageRange, state }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setUserId(data.user_id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'herhealth_session',
          JSON.stringify({ user_id: data.user_id, session_hash: '', timestamp: Date.now() })
        );
      }
      setStep('created');
    } catch (error) {
      console.error('Error:', error);
      const message = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturningUser = () => {
    const userIdInput = prompt('Enter your HerHealth ID (e.g., HHD-ABC123):');
    if (userIdInput) {
      onUserCreated(userIdInput);
    }
  };

  const handleProceed = () => {
    onUserCreated(userId);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-4 rounded-full">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              HerHealth Dataline
            </h1>
            <p className="text-xl text-gray-600">
              Your safe, anonymous space for health & wellness guidance
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-pink-500">
              <Lock className="w-8 h-8 text-pink-500 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">100% Anonymous</h3>
              <p className="text-sm text-gray-600">
                No names, emails, or personal info required
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
              <Eye className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Judgment-Free</h3>
              <p className="text-sm text-gray-600">
                Ask anything without fear or shame
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
              <Shield className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">AI + Experts</h3>
              <p className="text-sm text-gray-600">
                Get guidance from AI and human consultants
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => setStep('input')}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg"
            >
              New Here? Get Started
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleReturningUser}
              className="w-full bg-white border-2 border-gray-300 hover:border-pink-500 text-gray-800 font-bold py-4 px-6 rounded-lg transition-all duration-200"
            >
              Returning User? Sign In
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-900">
              <strong>Your Privacy is Sacred:</strong> We collect only your age
              group and state. This helps us provide better health guidance and
              contributes to anonymous health advocacy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Tell Us About You
          </h2>

          <div className="space-y-4">
            {/* Age Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ageRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setAgeRange(range)}
                    className={`py-2 px-3 rounded-lg font-medium transition-all ${
                      ageRange === range
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State/Region
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              >
                <option value="">Select your state...</option>
                {nigerianStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500 mt-4">
              We only use this to tailor health information to your location and
              age group. Your privacy is completely protected.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep('welcome')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCreateNew}
              disabled={!ageRange || !state || isLoading}
              className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to HerHealth!
          </h2>
          <p className="text-gray-600">Your unique ID is:</p>
        </div>

        <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4">
          <p className="text-2xl font-bold text-pink-600 font-mono">{userId}</p>
          <p className="text-xs text-gray-600 mt-2">
            Save this ID to access your account anytime
          </p>
        </div>

        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(userId);
              alert('ID copied to clipboard!');
            }
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Copy ID
        </button>

        <button
          onClick={handleProceed}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
        >
          Continue to Chat
        </button>

        <p className="text-xs text-gray-500">
          You&apos;ll need this ID to access your account and chat history
        </p>
      </div>
    </div>
  );
};
