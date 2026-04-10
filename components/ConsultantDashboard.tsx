'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Users, LogOut, Bell, Settings } from 'lucide-react';

interface PendingChat {
  id: string;
  user_id: string;
  initial_message: string;
  age_range: string;
  state: string;
  timestamp: string;
}

interface Appointment {
  id: string;
  user_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed';
}

export const ConsultantDashboard: React.FC = () => {
  const [consultant, setConsultant] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [pendingChats, setPendingChats] = useState<PendingChat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalChats: 0,
    activeChats: 0,
    upcomingAppointments: 0,
  });

  // Mock data
  useEffect(() => {
    setConsultant({
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@herhealth.org',
      specializations: ['Reproductive Health', 'Mental Wellness'],
    });

    setPendingChats([
      {
        id: 'chat-1',
        user_id: 'HHD-ABC123',
        initial_message: 'I have questions about my period being irregular',
        age_range: '16-18',
        state: 'Lagos',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'chat-2',
        user_id: 'HHD-DEF456',
        initial_message: 'Dealing with anxiety and stress',
        age_range: '19-25',
        state: 'Rivers',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      },
    ]);

    const initialPendingChats = [
      {
        id: 'chat-1',
        user_id: 'HHD-ABC123',
        age_range: '13-15',
        state: 'Lagos',
        initial_message: 'I need help understanding my period changes.',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'chat-2',
        user_id: 'HHD-DEF456',
        age_range: '16-18',
        state: 'Abuja',
        initial_message: 'How can I manage stress during exams?',
        timestamp: new Date().toISOString(),
      },
    ];

    setPendingChats(initialPendingChats);
    setAppointments([
      {
        id: 'apt-1',
        user_id: 'HHD-GHI789',
        scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        duration_minutes: 30,
        status: 'confirmed',
      },
      {
        id: 'apt-2',
        user_id: 'HHD-JKL012',
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        duration_minutes: 30,
        status: 'pending',
      },
    ]);

    setStats({
      totalChats: 24,
      activeChats: initialPendingChats.length,
      upcomingAppointments: 2,
    });
  }, []);

  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  const handleAcceptChat = (chatId: string) => {
    setActiveChat(chatId);
    setPendingChats(pendingChats.filter((c) => c.id !== chatId));
  };

  const handleLogout = () => {
    // Clear session and redirect
    window.location.href = '/consultant/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
              {consultant?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {consultant?.name}
              </p>
              <p className="text-xs text-gray-600">Consultant</p>
            </div>
          </div>

          {/* Availability Toggle */}
          <button
            onClick={handleToggleAvailability}
            className={`w-full py-2 px-3 rounded-lg font-medium transition-colors ${
              isAvailable
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {isAvailable ? '🟢 Available' : '⚪ Offline'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 bg-pink-50 text-pink-600 font-medium">
            <MessageSquare className="w-5 h-5" />
            Chat Queue
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-gray-700 hover:bg-gray-100">
            <Calendar className="w-5 h-5" />
            Appointments
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-gray-700 hover:bg-gray-100">
            <Users className="w-5 h-5" />
            Chat History
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-gray-700 hover:bg-gray-100">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chat Queue</h1>
            <p className="text-gray-600">Manage incoming user conversations</p>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-6 h-6 text-gray-600" />
            {pendingChats.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingChats.length}
              </span>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm font-medium">Today&apos;s Chats</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalChats}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm font-medium">Active Now</p>
            <p className="text-3xl font-bold text-pink-600 mt-2">
              {stats.activeChats}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm font-medium">Upcoming Appointments</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.upcomingAppointments}
            </p>
          </div>
        </div>

        {/* Chats Grid */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Pending Chats ({pendingChats.length})
          </h2>

          {pendingChats.length > 0 ? (
            <div className="space-y-4">
              {pendingChats.map((chat) => (
                <div
                  key={chat.id}
                  className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow border-l-4 border-pink-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {chat.user_id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {chat.age_range} • {chat.state}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(chat.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  <p className="text-gray-700 mb-4">{chat.initial_message}</p>

                  <button
                    onClick={() => handleAcceptChat(chat.id)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Accept Chat
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                No pending chats right now
              </p>
              <p className="text-sm text-gray-500 mt-1">
                You&apos;ll receive a notification when a user needs help
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
