'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Heart, MessageCircle, Loader, User, ShieldCheck, ChevronLeft, MoreVertical, Info } from 'lucide-react';
import type { ChatMessage as IChatMessage } from '@/types';
import { saveChatMessage, getAvailableConsultants } from '@/lib/chat';
import { getUserChatHistory } from '@/lib/auth';
import Link from 'next/link';

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

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Call Edge Function for chat routing
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          message: currentInput,
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

      if (data.is_emergency && data.emergency_message) {
        assistantMessage.content = data.emergency_message;
      }

      if (data.routed_to !== 'ai') {
        await saveChatMessage(
          userId,
          assistantMessage.content,
          data.routed_to === 'consultant' ? 'consultant' : 'ai',
          data.consultant_id,
          data.is_emergency
        );
      }

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.routed_to === 'consultant') {
        setCurrentConsultant(data.consultant_id);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Sorry, I encountered an error. Please try again or check back later.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-50 rounded-xl transition-colors md:hidden">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-brand-600" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-slate-900 leading-tight">HerHealth Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure & Anonymous</span>
                <ShieldCheck className="w-3 h-3 text-brand-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Your ID</span>
            <span className="text-xs font-mono font-bold text-brand-600">{userId}</span>
          </div>
          <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
            <Info className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-fade-in">
              <div className="w-24 h-24 bg-brand-50 rounded-3xl flex items-center justify-center mb-8 rotate-3">
                <MessageCircle className="w-12 h-12 text-brand-600 -rotate-3" />
              </div>
              <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-4">Hello! How can we help today?</h2>
              <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                Ask any questions about your health or wellbeing. We're here to provide safe, anonymous guidance.
              </p>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl text-left">
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:border-brand-200 transition-all cursor-pointer group">
                  <h4 className="font-bold text-slate-900 mb-1 group-hover:text-brand-600">Personal Health</h4>
                  <p className="text-sm text-slate-500">Ask about nutrition, fitness, and overall wellness.</p>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:border-brand-200 transition-all cursor-pointer group">
                  <h4 className="font-bold text-slate-900 mb-1 group-hover:text-brand-600">Reproductive Health</h4>
                  <p className="text-sm text-slate-500">Safe guidance on periods, puberty, and rights.</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                } animate-slide-up`}
              >
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {message.sender === 'user' ? 'You' : message.sender === 'ai' ? 'HerHealth AI' : 'Live Consultant'}
                  </span>
                  <span className="text-[10px] text-slate-300">•</span>
                  <span className="text-[10px] text-slate-300">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] md:max-w-[70%] ${
                    message.sender === 'user'
                      ? 'chat-bubble-user'
                      : message.isEmergency
                      ? 'bg-red-50 border border-red-100 text-red-900 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm'
                      : 'chat-bubble-bot'
                  }`}
                >
                  {message.isEmergency && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-100">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="font-bold text-xs uppercase tracking-tight text-red-600">Urgent Support</span>
                    </div>
                  )}
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">HerHealth AI is thinking</span>
              </div>
              <div className="chat-bubble-bot flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-brand-200 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-brand-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="bg-white border-t border-slate-200 p-4 md:p-6 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              disabled={isLoading}
              className="w-full pl-6 pr-16 py-4 md:py-5 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 text-slate-900 text-lg placeholder:text-slate-400 transition-all rounded-[2rem]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white rounded-full transition-all flex items-center justify-center shadow-lg shadow-brand-100 disabled:shadow-none"
            >
              <Send className={`w-5 h-5 ${isLoading ? 'opacity-0' : 'opacity-100'}`} />
              {isLoading && <Loader className="w-5 h-5 animate-spin absolute" />}
            </button>
          </form>
          <div className="flex items-center justify-center gap-4 mt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
              End-to-end encrypted
            </p>
            <span className="text-slate-200 text-xs">|</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-300" />
              Fully Anonymous
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
