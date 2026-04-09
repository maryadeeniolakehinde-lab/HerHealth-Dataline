'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Heart, MessageCircle, Loader } from 'lucide-react';
import type { ChatMessage as IChatMessage } from '@/types';
import { saveChatMessage, getAvailableConsultants } from '@/lib/chat';
import { getUserChatHistory } from '@/lib/auth';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'consultant';
  isEmergency?: boolean;
  timestamp: string;
  consultantName?: string;
}

interface ChatInterfaceProps {
  userId: string;
  ageRange: string;
  state: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  userId,
  ageRange,
  state,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasConsultant, setHasConsultant] = useState(false);
  const [currentConsultant, setCurrentConsultant] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      const history = await getUserChatHistory(userId, 20);
      if (history && history.length > 0) {
        const formattedMessages: ChatMessage[] = history.map((msg) => ({
          id: msg.id,
          content: msg.message,
          sender: msg.sender,
          isEmergency: msg.is_emergency,
          timestamp: msg.created_at,
          consultantName: msg.consultant_id ? 'Live Consultant' : undefined,
        }));
        setMessages(formattedMessages);
      }
    };

    loadChatHistory();
    checkConsultantStatus();
  }, [userId]);

  // Check for available consultants
  const checkConsultantStatus = async () => {
    const consultants = await getAvailableConsultants();
    setHasConsultant(consultants.length > 0);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Save user message to DB
    await saveChatMessage(userId, input, 'user');

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Edge Function for chat routing
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          message: input,
          age_range: ageRange,
          state: state,
          chat_history: messages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      let assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: data.message || 'Unable to generate response',
        sender: data.routed_to === 'consultant' ? 'consultant' : 'ai',
        isEmergency: data.is_emergency,
        timestamp: new Date().toISOString(),
        consultantName: data.routed_to === 'consultant' ? 'Live Consultant' : undefined,
      };

      // If emergency, show emergency message
      if (data.is_emergency && data.emergency_message) {
        assistantMessage.content = data.emergency_message;
      }

      // Save assistant response to DB
      await saveChatMessage(
        userId,
        assistantMessage.content,
        data.routed_to === 'consultant' ? 'consultant' : 'ai',
        data.consultant_id,
        data.is_emergency
      );

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.routed_to === 'consultant') {
        setCurrentConsultant(data.consultant_id);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content:
          'Sorry, I encountered an error. Please try again or check back later.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-800">HerHealth AI</h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {currentConsultant ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> Live Consultant
              </span>
            ) : (
              <span className="text-gray-600 flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> Connected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Heart className="w-16 h-16 text-pink-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to HerHealth
              </h2>
              <p className="text-gray-600 mb-4">
                Ask me anything about your health and wellness. Your questions
                are completely anonymous.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md">
                <p className="text-sm text-blue-800">
                  <strong>Privacy Note:</strong> We don&apos;t collect any personal
                  information. Your unique ID is your only identifier.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-pink-500 text-white rounded-br-none'
                      : message.isEmergency
                      ? 'bg-red-100 border border-red-300 text-gray-800 rounded-bl-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.isEmergency && (
                    <div className="flex items-center gap-2 mb-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-bold text-sm">Emergency Alert</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  {message.consultantName && (
                    <p className="text-xs mt-2 opacity-75 font-medium">
                      {message.consultantName}
                    </p>
                  )}
                  <p className="text-xs mt-2 opacity-50">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-3">
                <div className="flex gap-2">
                  <Loader className="w-4 h-4 animate-spin text-pink-500" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 disabled:bg-gray-100 text-gray-800"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Remember, AI responses are general guidance only. Always
            consult a doctor for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
};
