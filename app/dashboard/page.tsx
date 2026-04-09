'use client';

import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { DisclaimerComponent } from '@/components/chat/DisclaimerComponent';
import { AnonymousAuth } from '@/components/chat/AnonymousAuth';
import { getCurrentUser } from '@/lib/auth';

interface UserSession {
  user_id: string;
  age_range: string;
  state: string;
}

export default function DashboardPage() {
  const [stage, setStage] = useState<'auth' | 'disclaimer' | 'chat'>('auth');
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.user_id) {
        // Load full user profile
        const response = await fetch(`/api/auth/get-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.user_id }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          
          // Check if disclaimer is accepted
          const disclaimerAccepted = localStorage.getItem(
            'herhealth_disclaimer_accepted'
          );
          if (disclaimerAccepted) {
            setStage('chat');
          } else {
            setStage('disclaimer');
          }
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HerHealth...</p>
        </div>
      </div>
    );
  }

  if (stage === 'auth') {
    return (
      <AnonymousAuth
        onUserCreated={(userId) => {
          // Fetch full user data
          fetch(`/api/auth/get-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
          })
            .then((res) => res.json())
            .then((data) => {
              setUser(data);
              setStage('disclaimer');
            });
        }}
      />
    );
  }

  if (stage === 'disclaimer' && user) {
    return (
      <DisclaimerComponent
        onAccept={() => setStage('chat')}
      />
    );
  }

  if (stage === 'chat' && user) {
    return (
      <ChatInterface
        userId={user.user_id}
        ageRange={user.age_range}
        state={user.state}
      />
    );
  }

  return null;
}
