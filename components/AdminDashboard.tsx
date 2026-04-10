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
  BookOpen,
  Edit,
  Save,
  X,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { clearAdminSession } from '@/lib/adminAuth';

interface AnalyticsData {
  topic: string;
  count: number;
}

interface ConsultantData {
  id: string;
  display_name: string;
  email: string;
  is_active: boolean;
  is_available: boolean;
  verified: boolean;
  specializations: string[];
}

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  summary: string;
  image_url: string;
  age_appropriate: string[];
  is_published: boolean;
}

interface StateData {
  state: string;
  users: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'consultants' | 'kb'>('analytics');
  const [consultants, setConsultants] = useState<ConsultantData[]>([]);
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [topicsData, setTopicsData] = useState<AnalyticsData[]>([]);
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [ageRangeData, setAgeRangeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showConsultantModal, setShowConsultantModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState<ConsultantData | null>(null);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);

  // Form states
  const [consultantForm, setConsultantForm] = useState({
    display_name: '',
    email: '',
    password: '',
    specializations: '',
  });

  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    category: 'reproductive-health',
    summary: '',
    content: '',
    image_url: '',
    age_appropriate: ['13-15', '16-18', '19-25'],
    is_published: false,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch consultants
      const consRes = await fetch('/api/admin/consultants');
      if (consRes.ok) setConsultants(await consRes.json());

      // Fetch articles
      const artRes = await fetch('/api/admin/knowledge-base');
      if (artRes.ok) setArticles(await artRes.json());

      // For analytics, we use mock data for now or fetch from analytics_events if implemented
      setTopicsData([
        { topic: 'Reproductive Health', count: 342 },
        { topic: 'Mental Wellness', count: 287 },
        { topic: 'Personal Health', count: 201 },
        { topic: 'Social Challenges', count: 156 },
        { topic: 'Other', count: 84 },
      ]);

      setStateData([
        { state: 'Lagos', users: 89 },
        { state: 'Rivers', users: 67 },
        { state: 'Abuja', users: 54 },
        { state: 'Kano', users: 48 },
        { state: 'Ogun', users: 42 },
        { state: 'Others', users: 190 },
      ]);

      setAgeRangeData([
        { range: '13-15', users: 156 },
        { range: '16-18', users: 234 },
        { range: '19-25', users: 189 },
        { range: '26-30', users: 67 },
        { range: '30+', users: 44 },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConsultant = async () => {
    const method = editingConsultant ? 'PATCH' : 'POST';
    const url = editingConsultant 
      ? `/api/admin/consultants/${editingConsultant.id}` 
      : '/api/admin/consultants';

    const payload = {
      ...consultantForm,
      specializations: consultantForm.specializations.split(',').map(s => s.trim()).filter(s => s),
    };

    if (editingConsultant && !consultantForm.password) {
      delete (payload as any).password;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchDashboardData();
        setShowConsultantModal(false);
        setEditingConsultant(null);
        setConsultantForm({ display_name: '', email: '', password: '', specializations: '' });
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save consultant');
      }
    } catch (error) {
      alert('An error occurred while saving');
    }
  };

  const handleSaveArticle = async () => {
    const method = editingArticle ? 'PATCH' : 'POST';
    const url = editingArticle 
      ? `/api/admin/knowledge-base/${editingArticle.id}` 
      : '/api/admin/knowledge-base';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleForm),
      });

      if (res.ok) {
        fetchDashboardData();
        setShowArticleModal(false);
        setEditingArticle(null);
        setArticleForm({
          title: '',
          slug: '',
          category: 'reproductive-health',
          summary: '',
          content: '',
          image_url: '',
          age_appropriate: ['13-15', '16-18', '19-25'],
          is_published: false,
        });
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save article');
      }
    } catch (error) {
      alert('An error occurred while saving');
    }
  };

  const handleDeleteConsultant = async (id: string) => {
    if (!confirm('Are you sure you want to remove this consultant?')) return;
    try {
      const res = await fetch(`/api/admin/consultants/${id}`, { method: 'DELETE' });
      if (res.ok) fetchDashboardData();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/knowledge-base/${id}`, { method: 'DELETE' });
      if (res.ok) fetchDashboardData();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const openConsultantModal = (consultant: ConsultantData | null = null) => {
    if (consultant) {
      setEditingConsultant(consultant);
      setConsultantForm({
        display_name: consultant.display_name,
        email: consultant.email,
        password: '',
        specializations: consultant.specializations.join(', '),
      });
    } else {
      setEditingConsultant(null);
      setConsultantForm({ display_name: '', email: '', password: '', specializations: '' });
    }
    setShowConsultantModal(true);
  };

  const openArticleModal = (article: ArticleData | null = null) => {
    if (article) {
      setEditingArticle(article);
      setArticleForm({
        title: article.title,
        slug: article.slug,
        category: article.category,
        summary: article.summary,
        content: article.content,
        image_url: article.image_url,
        age_appropriate: article.age_appropriate,
        is_published: article.is_published,
      });
    } else {
      setEditingArticle(null);
      const tempSlug = `article-${Date.now()}`;
      setArticleForm({
        title: '',
        slug: tempSlug,
        category: 'reproductive-health',
        summary: '',
        content: '',
        image_url: '',
        age_appropriate: ['13-15', '16-18', '19-25'],
        is_published: false,
      });
    }
    setShowArticleModal(true);
  };

  const totalUsers = stateData.reduce((sum, state) => sum + state.users, 0);
  const totalChats = topicsData.reduce((sum, topic) => sum + topic.count, 0);

  const COLORS = ['#ec4899', '#a855f7', '#3b82f6', '#06b6d4', '#10b981'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-pink-600 p-2 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Portal
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                HerHealth Dataline Management
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              clearAdminSession();
              window.location.href = '/admin';
            }}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('consultants')}
            className={`py-4 px-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'consultants' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Consultants
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('kb')}
            className={`py-4 px-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'kb' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Knowledge Base
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="space-y-8 animate-fade-in">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Users</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{totalUsers}</p>
                <div className="mt-4 flex items-center text-green-600 text-xs font-bold">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Chats</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{totalChats}</p>
                <div className="mt-4 flex items-center text-green-600 text-xs font-bold">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last month
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Consultants</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{consultants.length}</p>
                <div className="mt-4 flex items-center text-blue-600 text-xs font-bold">
                  {consultants.filter(c => c.is_available).length} Currently Available
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Articles</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{articles.length}</p>
                <div className="mt-4 flex items-center text-purple-600 text-xs font-bold">
                  {articles.filter(a => a.is_published).length} Published
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-tight">Popular Health Topics</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                        cursor={{fill: '#fdf2f8'}}
                      />
                      <Bar dataKey="count" fill="#db2777" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-tight">Age Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageRangeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="users"
                      >
                        {ageRangeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Geographic Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-tight">Geographic Reach (Users by State)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stateData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="state" type="category" axisLine={false} tickLine={false} width={100} />
                    <Tooltip cursor={{fill: '#fdf2f8'}} />
                    <Bar dataKey="users" fill="#9333ea" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : activeTab === 'consultants' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Manage Consultants</h2>
              <button
                onClick={() => openConsultantModal()}
                className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Consultant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultants.map((consultant) => (
                <div key={consultant.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-pink-100 text-pink-700 rounded-2xl flex items-center justify-center font-bold text-xl">
                      {consultant.display_name.charAt(0)}
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => openConsultantModal(consultant)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteConsultant(consultant.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">{consultant.display_name}</h4>
                  <p className="text-sm text-gray-500 mb-4">{consultant.email}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {consultant.specializations.map((spec, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${consultant.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                        {consultant.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {consultant.is_available && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                        Available Now
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Knowledge Base CMS</h2>
              <button
                onClick={() => openArticleModal()}
                className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Article
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Article</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            {article.image_url ? (
                              <img src={article.image_url} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{article.title}</p>
                            <p className="text-xs text-gray-500 font-mono tracking-tight">/{article.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {article.is_published ? (
                          <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                        {(article as any).created_at ? new Date((article as any).created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/knowledge-hub/${article.slug}`} 
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => openArticleModal(article)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {articles.length === 0 && (
                <div className="py-20 text-center">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No articles found. Start by creating one!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Consultant Modal */}
      {showConsultantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConsultantModal(false)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingConsultant ? 'Edit Consultant' : 'Add New Consultant'}
              </h3>
              <button onClick={() => setShowConsultantModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Display Name</label>
                <input 
                  type="text" 
                  value={consultantForm.display_name}
                  onChange={(e) => setConsultantForm({...consultantForm, display_name: e.target.value})}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={consultantForm.email}
                  onChange={(e) => setConsultantForm({...consultantForm, email: e.target.value})}
                  placeholder="consultant@herhealth.org"
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                  {editingConsultant ? 'New Password (leave blank to keep)' : 'Password'}
                </label>
                <input 
                  type="password" 
                  value={consultantForm.password}
                  onChange={(e) => setConsultantForm({...consultantForm, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Specializations (comma separated)</label>
                <input 
                  type="text" 
                  value={consultantForm.specializations}
                  onChange={(e) => setConsultantForm({...consultantForm, specializations: e.target.value})}
                  placeholder="Nutrition, Reproductive Health, Mental Wellbeing"
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                />
              </div>
            </div>
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setShowConsultantModal(false)}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveConsultant}
                className="flex-1 btn-primary py-3"
              >
                {editingConsultant ? 'Update Consultant' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Modal (CMS) */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowArticleModal(false)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-up flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingArticle ? 'Edit Article' : 'Create New Article'}
              </h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={articleForm.is_published}
                    onChange={(e) => setArticleForm({...articleForm, is_published: e.target.checked})}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Published</span>
                </label>
                <button onClick={() => setShowArticleModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors ml-2">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 grid md:grid-cols-2 gap-8">
              {/* Left Column: Metadata */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Article Title</label>
                  <input 
                    type="text" 
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                    placeholder="e.g. Understanding Your Menstrual Cycle"
                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">URL Slug</label>
                    <input 
                      type="text" 
                      value={articleForm.slug}
                      onChange={(e) => setArticleForm({...articleForm, slug: e.target.value})}
                      placeholder="understanding-cycle"
                      className="w-full px-4 py-3 bg-gray-50 border-gray-200 font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={articleForm.category}
                      onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border-gray-200"
                    >
                      <option value="reproductive-health">Reproductive Health</option>
                      <option value="personal-health">Personal Health</option>
                      <option value="mental-wellbeing">Mental Wellbeing</option>
                      <option value="social-challenges">Social Challenges</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={articleForm.image_url}
                      onChange={(e) => setArticleForm({...articleForm, image_url: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-4 py-3 bg-gray-50 border-gray-200"
                    />
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                      {articleForm.image_url ? (
                        <img src={articleForm.image_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Short Summary (for cards)</label>
                  <textarea 
                    value={articleForm.summary}
                    onChange={(e) => setArticleForm({...articleForm, summary: e.target.value})}
                    rows={3}
                    placeholder="A brief overview of what this article covers..."
                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Age Appropriateness</label>
                  <div className="flex flex-wrap gap-2">
                    {['13-15', '16-18', '19-25', '26-30', '30+'].map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          const current = articleForm.age_appropriate;
                          const next = current.includes(range) 
                            ? current.filter(r => r !== range)
                            : [...current, range];
                          setArticleForm({...articleForm, age_appropriate: next});
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          articleForm.age_appropriate.includes(range)
                            ? 'bg-pink-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Content Editor */}
              <div className="flex flex-col h-full space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                  Article Content (Markdown supported)
                  <span className="text-[10px] text-gray-400 font-normal">Supports # Header, **Bold**, *Italic*, etc.</span>
                </label>
                <textarea 
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                  className="flex-1 w-full px-6 py-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-500 font-mono text-sm leading-relaxed"
                  placeholder="# Understanding Your Cycle\n\nYour menstrual cycle is..."
                />
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
              <div className="flex-1"></div>
              <button 
                onClick={() => setShowArticleModal(false)}
                className="btn-secondary py-3 px-10"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveArticle}
                className="btn-primary py-3 px-10 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {editingArticle ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
