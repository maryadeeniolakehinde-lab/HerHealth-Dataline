'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  TrendingUp,
  MessageSquare,
  Shield,
  LogOut,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import { clearAdminSession } from '@/lib/adminAuth';

interface AnalyticsData {
  topic: string;
  count: number;
}

interface ConsultantData {
  id: string;
  name: string;
  email: string;
  activeChats: number;
  totalChats: number;
  verified: boolean;
}

interface StateData {
  state: string;
  users: number;
}

export const AdminDashboard: React.FC = () => {
  const [consultants, setConsultants] = useState<ConsultantData[]>([]);
  const [topicsData, setTopicsData] = useState<AnalyticsData[]>([]);
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [ageRangeData, setAgeRangeData] = useState<any[]>([]);
  const [showAddConsultant, setShowAddConsultant] = useState(false);
  const [newConsultantEmail, setNewConsultantEmail] = useState('');

  // Mock data initialization
  useEffect(() => {
    // Mock consultants
    setConsultants([
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah@herhealth.org',
        activeChats: 3,
        totalChats: 145,
        verified: true,
      },
      {
        id: '2',
        name: 'Dr. Maya Patel',
        email: 'maya@herhealth.org',
        activeChats: 2,
        totalChats: 98,
        verified: true,
      },
      {
        id: '3',
        name: 'Dr. Lisa Chen',
        email: 'lisa@herhealth.org',
        activeChats: 0,
        totalChats: 67,
        verified: false,
      },
    ]);

    // Mock topic analytics
    setTopicsData([
      { topic: 'Reproductive Health', count: 342 },
      { topic: 'Mental Wellness', count: 287 },
      { topic: 'Personal Health', count: 201 },
      { topic: 'Social Challenges', count: 156 },
      { topic: 'Other', count: 84 },
    ]);

    // Mock state data
    setStateData([
      { state: 'Lagos', users: 89 },
      { state: 'Rivers', users: 67 },
      { state: 'Abuja', users: 54 },
      { state: 'Kano', users: 48 },
      { state: 'Ogun', users: 42 },
      { state: 'Others', users: 190 },
    ]);

    // Mock age range data
    setAgeRangeData([
      { range: '13-15', users: 156 },
      { range: '16-18', users: 234 },
      { range: '19-25', users: 189 },
      { range: '26-30', users: 67 },
      { range: '30+', users: 44 },
    ]);
  }, []);

  const handleAddConsultant = () => {
    if (newConsultantEmail) {
      // In production, send to API
      alert(
        `Invitation sent to ${newConsultantEmail}\n\nThey will receive an email to set up their account.`
      );
      setNewConsultantEmail('');
      setShowAddConsultant(false);
    }
  };

  const handleRemoveConsultant = (id: string) => {
    setConsultants(consultants.filter((c) => c.id !== id));
  };

  const totalUsers = stateData.reduce((sum, state) => sum + state.users, 0);
  const totalChats = topicsData.reduce((sum, topic) => sum + topic.count, 0);

  const COLORS = ['#ec4899', '#a855f7', '#3b82f6', '#06b6d4', '#10b981'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Aggregated, anonymized health advocacy insights
            </p>
          </div>
          <button
            onClick={() => {
              clearAdminSession();
              window.location.href = '/admin';
            }}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {totalUsers}
                </p>
              </div>
              <Users className="w-12 h-12 text-pink-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Chats</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {totalChats}
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Consultants</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {consultants.filter((c) => c.verified).length}
                </p>
              </div>
              <Shield className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Data Points</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {totalUsers + totalChats}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Top Topics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Most Common Health Topics
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Age Range Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Users by Age Range
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageRangeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, users }) => `${range}: ${users}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="users"
                >
                  {ageRangeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Users by State/Region
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="state" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="users" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Consultants Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Consultant Management</h2>
            <button
              onClick={() => setShowAddConsultant(!showAddConsultant)}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Consultant
            </button>
          </div>

          {showAddConsultant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={newConsultantEmail}
                  onChange={(e) => setNewConsultantEmail(e.target.value)}
                  placeholder="consultant@herhealth.org"
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={handleAddConsultant}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Send Invite
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {consultants.map((consultant) => (
              <div
                key={consultant.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                    {consultant.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {consultant.name}
                    </p>
                    <p className="text-sm text-gray-600">{consultant.email}</p>
                  </div>
                </div>

                <div className="text-right mr-4">
                  <p className="text-sm font-medium text-gray-800">
                    {consultant.totalChats} total chats
                  </p>
                  <p className="text-xs text-gray-600">
                    {consultant.activeChats} active
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {consultant.verified ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                      ⏳ Pending
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveConsultant(consultant.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Data Use */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-bold text-blue-900 mb-2">
            🔒 Data Privacy & Advocacy
          </h3>
          <p className="text-sm text-blue-900 mb-3">
            All data displayed is completely anonymized and aggregated:
          </p>
          <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
            <li>No individual user identifiers are displayed</li>
            <li>Age ranges and states are shown only as aggregate statistics</li>
            <li>All analytics are anonymized for NGO advocacy purposes</li>
            <li>Individual chat details are not accessible in this dashboard</li>
            <li>Data helps inform policy and health initiatives</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
