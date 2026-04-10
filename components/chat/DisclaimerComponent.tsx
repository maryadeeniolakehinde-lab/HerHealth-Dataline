'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Heart } from 'lucide-react';

interface DisclaimerProps {
  onAccept: () => void;
}

export const DisclaimerComponent: React.FC<DisclaimerProps> = ({
  onAccept,
}) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    localStorage.setItem('herhealth_disclaimer_accepted', 'true');
    onAccept();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8" />
            <h1 className="text-3xl font-bold">HerHealth Dataline</h1>
          </div>
          <p className="text-pink-100">
            Your safe, anonymous space for health & wellness
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Important Disclaimer
            </h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 space-y-3">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">
                    Medical Guidance Only
                  </h3>
                  <p className="text-sm text-blue-800">
                    HerHealth provides educational information and general
                    guidance. Our responses are NOT medical diagnoses or
                    professional medical advice.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 space-y-3">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 mb-1">
                    When to Seek Professional Help
                  </h3>
                  <p className="text-sm text-red-800 mb-2">
                    Please consult a qualified healthcare professional if you:
                  </p>
                  <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                    <li>Have medical concerns or symptoms</li>
                    <li>Are experiencing pain or discomfort</li>
                    <li>Have thoughts of self-harm or suicide</li>
                    <li>Are in an emergency situation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 space-y-3">
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-green-900 mb-1">
                    Your Privacy is Protected
                  </h3>
                  <p className="text-sm text-green-800 mb-2">
                    HerHealth is completely anonymous:
                  </p>
                  <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                    <li>No names, emails, or phone numbers collected</li>
                    <li>You&apos;re identified only by a unique ID</li>
                    <li>All data is encrypted and secure</li>
                    <li>Anonymized data helps NGOs advocate for women&apos;s health</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 space-y-3">
              <div className="flex gap-3">
                <Heart className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-purple-900 mb-1">
                    In Crisis? We&apos;re Here to Help
                  </h3>
                  <p className="text-sm text-purple-800 mb-2">
                    If you&apos;re in immediate danger or having a mental health
                    emergency:
                  </p>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>🚨 Call emergency services (112 in Nigeria)</li>
                    <li>💬 Local mental health support: +2348167068027</li>
                    <li>💬 If you are in immediate danger, go to the nearest hospital or emergency clinic</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Acceptance */}
          <div className="border-t pt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 mt-1 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">
                I acknowledge this disclaimer and understand that HerHealth
                provides educational guidance, not medical diagnoses. I will
                consult healthcare professionals for medical concerns and will
                seek emergency help if needed.
              </span>
            </label>

            <button
              onClick={handleAccept}
              disabled={!accepted}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              I Understand & Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
