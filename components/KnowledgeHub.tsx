'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ChevronRight, Heart, ArrowLeft, Filter, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'personal-health' | 'reproductive-health' | 'mental-wellbeing' | 'social-challenges';
  summary: string;
  ageAppropriate: string[];
  image: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding Your Menstrual Cycle',
    slug: 'understanding-menstrual-cycle',
    category: 'reproductive-health',
    summary: 'A complete guide to the phases of your cycle and what to expect each month.',
    ageAppropriate: ['13-15', '16-18', '19-25'],
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    title: 'Nutrition for Growing Bodies',
    slug: 'nutrition-for-teens',
    category: 'personal-health',
    summary: 'Essential nutrients and healthy eating habits for young women in Nigeria.',
    ageAppropriate: ['13-15', '16-18'],
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    title: 'Managing Period Pain Naturally',
    slug: 'managing-period-pain',
    category: 'reproductive-health',
    summary: 'Proven tips and home remedies for dealing with menstrual cramps safely.',
    ageAppropriate: ['16-18', '19-25', '26-30'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '4',
    title: 'Building Emotional Resilience',
    slug: 'mental-health-basics',
    category: 'mental-wellbeing',
    summary: 'How to protect your mental health and stay strong through life\'s challenges.',
    ageAppropriate: ['13-15', '16-18', '19-25', '26-30', '30+'],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '5',
    title: 'Navigating Social Pressure',
    slug: 'dealing-with-peer-pressure',
    category: 'social-challenges',
    summary: 'Strategies for staying true to yourself while navigating complex social circles.',
    ageAppropriate: ['13-15', '16-18'],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '6',
    title: 'Your Guide to Contraception',
    slug: 'contraception-options',
    category: 'reproductive-health',
    summary: 'Professional overview of birth control methods available to young women.',
    ageAppropriate: ['16-18', '19-25', '26-30', '30+'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
  },
];

const categories = [
  { key: 'personal-health', label: 'Personal Health', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'reproductive-health', label: 'Reproductive Health', color: 'text-rose-600', bg: 'bg-rose-50' },
  { key: 'mental-wellbeing', label: 'Mental Wellbeing', color: 'text-violet-600', bg: 'bg-violet-50' },
  { key: 'social-challenges', label: 'Social Challenges', color: 'text-amber-600', bg: 'bg-amber-50' },
];

interface KnowledgeHubProps {
  userAgeRange?: string;
}

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ userAgeRange: initialAgeRange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userAgeRange, setUserAgeRange] = useState<string | undefined>(initialAgeRange);

  // Detect user age range from session if not provided
  useEffect(() => {
    if (!userAgeRange) {
      const sessionStr = localStorage.getItem('herhealth_session');
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session.age_range && session.age_range !== 'unknown') {
            setUserAgeRange(session.age_range);
          }
        } catch (e) {
          console.error('Error parsing session for Knowledge Hub:', e);
        }
      }
    }
  }, [userAgeRange]);

  const filteredArticles = MOCK_ARTICLES.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || article.category === selectedCategory;

    const matchesAge =
      !userAgeRange || article.ageAppropriate.includes(userAgeRange);

    return matchesSearch && matchesCategory && matchesAge;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-brand-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-extrabold tracking-tight text-slate-900">
              HerHealth <span className="text-brand-600">Dataline</span>
            </span>
          </Link>
          <Link href="/dashboard" className="btn-primary py-2 px-5 text-sm">
            Start Chatting
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="bg-white border-b border-slate-100 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Expert Verified Content
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Knowledge <span className="text-brand-600">Hub</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Discover verified health and wellness guidance tailored specifically for young women in Nigeria. 
            Empower yourself with accurate information.
          </p>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="card shadow-xl p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
            <input
              type="text"
              placeholder="Search for topics, symptoms, or guidance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white text-lg"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border-2 ${
                selectedCategory === null
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                  : 'bg-white border-slate-100 text-slate-600 hover:border-brand-200'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border-2 ${
                  selectedCategory === cat.key
                    ? 'bg-brand-600 border-brand-600 text-white shadow-lg'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-brand-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => {
              const category = categories.find((c) => c.key === article.category);
              return (
                <Link
                  key={article.id}
                  href={`/knowledge-hub/${article.slug}`}
                  className="group"
                >
                  <div className="card h-full flex flex-col p-0 overflow-hidden hover:-translate-y-2 border-slate-100">
                    <div className="h-56 relative overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${category?.bg} ${category?.color} backdrop-blur-md bg-opacity-90`}>
                        {category?.label}
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-display font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-brand-600 font-bold text-sm">
                        <span>Read Full Article</span>
                        <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              We couldn't find any articles matching your search. Try different keywords or browse by category.
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory(null);}}
              className="mt-8 text-brand-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="max-w-7xl mx-auto px-6 pb-16 text-center">
        <div className="pt-16 border-t border-slate-200">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">
            © 2026 HerHealth Dataline • Safe • Anonymous • Verified
          </p>
        </div>
      </footer>
    </div>
  );
};
