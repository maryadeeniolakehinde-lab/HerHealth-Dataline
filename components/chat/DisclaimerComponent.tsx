'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2, Heart, ArrowRight, Info } from 'lucide-react';

interface DisclaimerComponentProps {
  onAccept: () => void;
}

export const DisclaimerComponent: React.FC<DisclaimerComponentProps> = ({
  onAccept,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full card shadow-2xl p-0 overflow-hidden animate-slide-up">
        <div className="gradient-primary p-10 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldAlert className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight">Your Health & Safety First</h1>
            <p className="text-brand-50 text-lg leading-relaxed">Please read our guidance disclaimer before you start chatting with HerHealth Assistant.</p>
          </div>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-6">
            <div className="flex gap-4 group">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                <Info className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">General Information Only</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  HerHealth AI provides general health guidance and is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                <ShieldAlert className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Not for Emergencies</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  If you are experiencing a medical emergency, please call <strong>112</strong> immediately or visit the nearest healthcare facility.
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Privacy & Data</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your chat is anonymous. We use anonymized data to improve healthcare advocacy for young women in Nigeria.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={onAccept}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 group"
            >
              I Understand and Accept
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 font-medium uppercase tracking-widest">
              By clicking, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
