'use client';

import React, { useState } from 'react';
import { Heart, ArrowRight, Lock, Eye, Shield, UserCircle, CheckCircle2, ChevronLeft, Search } from 'lucide-react';

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
  const [recoveryAgeRange, setRecoveryAgeRange] = useState('');
  const [recoveryQuestion, setRecoveryQuestion] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [userId, setUserId] = useState('');
  const [signinId, setSigninId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signinError, setSigninError] = useState('');
  const [foundUserIds, setFoundUserIds] = useState<string[]>([]);
  const [newRecoveryQuestion, setNewRecoveryQuestion] = useState('');
  const [newRecoveryAnswer, setNewRecoveryAnswer] = useState('');

  const recoveryQuestions = [
    'What is your secret health nickname?',
    'What was the topic of your first health query?',
    'What is your favorite health-related word?',
    'What is a secret code only you would know?',
  ];

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
    if (!ageRange || !state || !newRecoveryQuestion || !newRecoveryAnswer) {
      alert('Please fill in all fields, including the recovery question');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageRange,
          state,
          recoveryQuestion: newRecoveryQuestion,
          recoveryAnswer: newRecoveryAnswer,
        }),
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
    if (!recoveryState || !recoveryAgeRange || !recoveryQuestion || !recoveryAnswer) {
      alert('Please fill in all recovery fields');
      return;
    }

    setIsLoading(true);
    setFoundUserIds([]);

    try {
      const response = await fetch('/api/auth/recover-user-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: recoveryState,
          age_range: recoveryAgeRange,
          recovery_question: recoveryQuestion,
          recovery_answer: recoveryAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to recover user ID');
      }

      if (data.user_ids && data.user_ids.length > 0) {
        setFoundUserIds(data.user_ids);
      } else {
        alert('No user IDs found matching those details. Please check your recovery information.');
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
      <div className="min-h-screen bg-white flex flex-col md:flex-row">
        {/* Left Side: Image & Content */}
        <div className="md:w-1/2 relative overflow-hidden hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200" 
            alt="Supportive community" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-display font-bold mb-4 leading-tight">Your voice matters, and your privacy is sacred.</h2>
            <p className="text-lg text-slate-200">Join thousands of young women in Nigeria who are taking control of their health journey in a safe, judgment-free space.</p>
          </div>
        </div>

        {/* Right Side: Auth Actions */}
        <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50">
          <div className="max-w-md w-full space-y-10 animate-fade-in">
            <div className="space-y-4">
              <div className="bg-brand-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Welcome to HerHealth</h1>
              <p className="text-slate-600 leading-relaxed">Choose how you'd like to proceed. No personal information is ever required.</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setStep('input')}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleReturningUser}
                className="w-full btn-secondary py-4 text-lg"
              >
                Returning User Sign In
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Shield className="w-4 h-4 text-brand-600" />
                  <span className="text-sm">100% Anonymous</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">No names, emails, or tracking. Your identity is safe.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Lock className="w-4 h-4 text-brand-600" />
                  <span className="text-sm">Secure Access</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Your data is encrypted and protected by a unique ID.</p>
              </div>
            </div>

            <button
              onClick={() => setShowForgotId(true)}
              className="w-full text-slate-500 hover:text-brand-600 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Forgot your User ID?
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Forgot User ID Modal
  if (showForgotId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full card shadow-2xl p-10 animate-slide-up">
          <div className="text-center mb-8">
            <div className="bg-brand-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-3">Recover Your ID</h2>
            <p className="text-slate-600 text-sm">Fill in your security details to find your anonymous account.</p>
          </div>

          <div className="space-y-6">
            {foundUserIds.length > 0 ? (
              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-brand-900 text-xs uppercase tracking-widest">Possible Matches Found</h3>
                <div className="grid gap-3">
                  {foundUserIds.map((id) => (
                    <button
                      key={id}
                      onClick={() => {
                        setSigninId(id);
                        setShowForgotId(false);
                        setStep('signin');
                      }}
                      className="w-full bg-white border border-slate-200 hover:border-brand-500 text-slate-900 font-mono font-bold py-3 px-4 rounded-xl transition-all text-left flex justify-between items-center group"
                    >
                      {id}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-brand-600" />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-brand-600 italic">Select an ID to sign in.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 ml-1">Your State</label>
                  <select
                    value={recoveryState}
                    onChange={(e) => setRecoveryState(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select your state</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 ml-1">Age Range</label>
                  <select
                    value={recoveryAgeRange}
                    onChange={(e) => setRecoveryAgeRange(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select your age range</option>
                    {ageRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 ml-1">Security Question</label>
                  <select
                    value={recoveryQuestion}
                    onChange={(e) => setRecoveryQuestion(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select your question</option>
                    {recoveryQuestions.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 ml-1">Security Answer</label>
                  <input
                    type="text"
                    value={recoveryAnswer}
                    onChange={(e) => setRecoveryAnswer(e.target.value)}
                    placeholder="Your secret answer"
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 mt-8">
            {!foundUserIds.length && (
              <button
                onClick={handleForgotUserId}
                disabled={isLoading || !recoveryState || !recoveryAgeRange || !recoveryQuestion || !recoveryAnswer}
                className="w-full btn-primary py-3.5 disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Find My User ID'}
              </button>
            )}

            <button
              onClick={() => {
                setShowForgotId(false);
                setFoundUserIds([]);
              }}
              className="w-full btn-secondary py-3.5"
            >
              {foundUserIds.length > 0 ? 'Done' : 'Back to Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'signin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full card shadow-2xl p-10 animate-slide-up">
          <div className="text-center mb-8">
            <div className="bg-brand-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserCircle className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-3">Welcome Back</h2>
            <p className="text-slate-600 text-sm">Enter your HerHealth ID to access your chat history.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1">User ID</label>
              <input
                type="text"
                value={signinId}
                onChange={(e) => {
                  setSigninId(e.target.value.toUpperCase());
                  setSigninError('');
                }}
                placeholder="HHD-ABC123"
                className={`w-full font-mono font-bold tracking-wider text-lg uppercase ${
                  signinError ? 'border-red-500 ring-2 ring-red-50' : 'border-slate-200'
                }`}
              />
              {signinError && (
                <p className="text-red-500 text-xs font-semibold ml-1">{signinError}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 mt-8">
            <button
              onClick={handleVerifyId}
              disabled={isLoading || !signinId}
              className="w-full btn-primary py-3.5 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Sign In'}
            </button>

            <button
              onClick={() => setStep('welcome')}
              className="w-full btn-secondary py-3.5"
            >
              Back
            </button>
          </div>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <button
              onClick={() => setShowForgotId(true)}
              className="text-brand-600 hover:text-brand-700 text-sm font-bold"
            >
              Forgot your User ID?
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'input') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full card shadow-2xl p-10 animate-slide-up">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setStep('welcome')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h2 className="text-2xl font-display font-bold text-slate-900">Create Your Profile</h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-900 block ml-1 uppercase tracking-wider">How old are you?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ageRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setAgeRange(range)}
                    className={`py-3 px-4 rounded-xl font-bold transition-all border-2 ${
                      ageRange === range
                        ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-100 scale-105'
                        : 'bg-white border-slate-100 text-slate-600 hover:border-brand-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-900 block ml-1 uppercase tracking-wider">Where are you located?</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-lg"
              >
                <option value="">Select your state...</option>
                {nigerianStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-brand-600" />
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recovery Security</label>
              </div>
              <div className="space-y-4">
                <select
                  value={newRecoveryQuestion}
                  onChange={(e) => setNewRecoveryQuestion(e.target.value)}
                  className="w-full text-sm"
                >
                  <option value="">Choose a security question...</option>
                  {recoveryQuestions.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newRecoveryAnswer}
                  onChange={(e) => setNewRecoveryAnswer(e.target.value)}
                  placeholder="Your secret answer"
                  className="w-full"
                />
                <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                  This question helps you recover your ID if you lose it. Make sure it's something only you know.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              onClick={handleCreateNew}
              disabled={!ageRange || !state || !newRecoveryQuestion || !newRecoveryAnswer || isLoading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50"
            >
              {isLoading ? 'Creating Your Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full card shadow-2xl p-10 text-center space-y-8 animate-slide-up">
        <div className="bg-brand-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-brand-600" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-display font-bold text-slate-900">Account Created!</h2>
          <p className="text-slate-600">Your unique HerHealth ID is ready. Please save this in a safe place.</p>
        </div>

        <div className="bg-slate-50 border-2 border-brand-100 rounded-2xl p-6 relative group overflow-hidden">
          <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-4xl font-display font-extrabold text-brand-600 font-mono tracking-widest">{userId}</p>
          <button
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(userId);
                alert('ID copied to clipboard!');
              }
            }}
            className="mt-4 text-xs font-bold text-brand-700 uppercase tracking-widest hover:text-brand-900 transition-colors underline underline-offset-4"
          >
            Copy ID
          </button>
        </div>

        <div className="space-y-4 pt-4">
          <button
            onClick={handleProceed}
            className="w-full btn-primary py-4 text-lg"
          >
            Continue to Chat
          </button>
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            You will need this ID every time you return to HerHealth Dataline. Keep it safe.
          </p>
        </div>
      </div>
    </div>
  );
};
