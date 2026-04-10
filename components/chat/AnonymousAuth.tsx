'use client';

import React, { useState } from 'react';
import { Heart, ArrowRight, Lock, Eye, Shield } from 'lucide-react';

interface AnonymousAuthProps {
  onUserCreated: (userId: string) => void;
}

export const AnonymousAuth: React.FC<AnonymousAuthProps> = ({
  onUserCreated,
}) => {
  const [step, setStep] = useState<'welcome' | 'input' | 'created' | 'signin'>('welcome');
  const [ageRange, setAgeRange] = useState('');
  const [state, setState] = useState('');
  const [showForgotId, setShowForgotId] = useState(false);
  const [recoveryState, setRecoveryState] = useState('');
  const [recoveryDate, setRecoveryDate] = useState('');
  const [userId, setUserId] = useState('');
  const [signinId, setSigninId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signinError, setSigninError] = useState('');
  const [foundUserIds, setFoundUserIds] = useState<string[]>([]);

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
    setStep('signin');
  };

  const handleVerifyId = async () => {
    if (!signinId.trim()) {
      setSigninError('Please enter your User ID');
      return;
    }

    // Basic format validation: HHD- followed by hex characters
    const idRegex = /^HHD-[0-9A-F]{6}$/i;
    if (!idRegex.test(signinId.trim())) {
      setSigninError('Invalid ID format. Example: HHD-ABC123');
      return;
    }

    setIsLoading(true);
    setSigninError('');

    try {
      const response = await fetch('/api/auth/get-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: signinId.trim().toUpperCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setSigninError('User ID not found. Please check your ID or create a new account.');
          return;
        }
        throw new Error(data.error || 'Failed to verify user');
      }

      // User found, save to local storage and proceed
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'herhealth_session',
          JSON.stringify({ user_id: signinId.trim().toUpperCase(), session_hash: '', timestamp: Date.now() })
        );
      }
      onUserCreated(signinId.trim().toUpperCase());
    } catch (error) {
      console.error('Error:', error);
      const message = error instanceof Error ? error.message : 'Failed to verify user. Please try again.';
      setSigninError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotUserId = async () => {
    if (!recoveryState || !recoveryDate) {
      alert('Please provide both your state and approximate creation date');
      return;
    }

    setIsLoading(true);
    setFoundUserIds([]);

    try {
      const response = await fetch('/api/auth/recover-user-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: recoveryState, created_date: recoveryDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to recover user ID');
      }

      if (data.user_ids && data.user_ids.length > 0) {
        setFoundUserIds(data.user_ids);
      } else {
        alert('No user IDs found matching those details. You may need to create a new account.');
      }
    } catch (error) {
      console.error('Error:', error);
      const message = error instanceof Error ? error.message : 'Failed to recover user ID. Please try again.';
      alert(message);
    } finally {
      setIsLoading(false);
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

            <button
              onClick={() => setShowForgotId(true)}
              className="w-full text-pink-600 hover:text-pink-800 font-medium py-2 px-6 text-sm"
            >
              Forgot your User ID?
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

  // Forgot User ID Modal
  if (showForgotId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-4 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Recover Your User ID
            </h2>
            <p className="text-gray-600 text-sm">
              Since we're anonymous, we'll help you find your ID based on when and where you created your account.
            </p>
          </div>

          <div className="space-y-4">
            {foundUserIds.length > 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-green-800 text-sm uppercase tracking-wider">
                  Found Possible IDs
                </h3>
                <div className="grid gap-2">
                  {foundUserIds.map((id) => (
                    <button
                      key={id}
                      onClick={() => {
                        setSigninId(id);
                        setShowForgotId(false);
                        setStep('signin');
                      }}
                      className="w-full bg-white border border-green-300 hover:border-green-500 text-green-700 font-mono font-bold py-3 px-4 rounded-lg transition-all text-left flex justify-between items-center group"
                    >
                      {id}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-green-600 italic">
                  Click an ID to use it for sign in
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your State
                  </label>
                  <select
                    value={recoveryState}
                    onChange={(e) => setRecoveryState(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="">Select your state</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approximate Creation Date
                  </label>
                  <input
                    type="date"
                    value={recoveryDate}
                    onChange={(e) => setRecoveryDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll search within 3 days of this date
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 mt-6">
            {!foundUserIds.length && (
              <button
                onClick={handleForgotUserId}
                disabled={isLoading || !recoveryState || !recoveryDate}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Find My User ID'}
              </button>
            )}

            <button
              onClick={() => {
                setShowForgotId(false);
                setFoundUserIds([]);
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              {foundUserIds.length > 0 ? 'Done' : 'Back to Sign In'}
            </button>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Privacy Note:</strong> This search is anonymous and doesn't reveal any personal information. If no IDs are found, you may need to create a new account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'signin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-4 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your HerHealth ID to access your account.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={signinId}
                onChange={(e) => {
                  setSigninId(e.target.value.toUpperCase());
                  setSigninError('');
                }}
                placeholder="HHD-ABC123"
                className={`w-full rounded-xl border ${
                  signinError ? 'border-red-500' : 'border-gray-200'
                } px-4 py-3 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 uppercase font-mono`}
              />
              {signinError && (
                <p className="text-red-500 text-xs mt-1">{signinError}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <button
              onClick={handleVerifyId}
              disabled={isLoading || !signinId}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Sign In'}
            </button>

            <button
              onClick={() => setStep('welcome')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Back
            </button>
          </div>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setShowForgotId(true)}
              className="text-pink-600 hover:text-pink-800 text-sm font-medium"
            >
              Forgot your User ID?
            </button>
            <div className="pt-2">
              <p className="text-xs text-gray-500">
                Don't have an ID?{' '}
                <button
                  onClick={() => setStep('input')}
                  className="text-purple-600 hover:text-purple-800 font-bold"
                >
                  Get Started
                </button>
              </p>
            </div>
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
