'use client';

import React, { useState } from 'react';
import { BookOpen, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'personal-health' | 'reproductive-health' | 'mental-wellbeing' | 'social-challenges';
  summary: string;
  ageAppropriate: string[];
}

// Mock articles data - in production, fetch from Supabase
const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding Your Menstrual Cycle',
    slug: 'understanding-menstrual-cycle',
    category: 'reproductive-health',
    summary: 'Learn about the phases of your menstrual cycle and what\'s normal.',
    ageAppropriate: ['13-15', '16-18', '19-25'],
  },
  {
    id: '2',
    title: 'Nutrition for Teens',
    slug: 'nutrition-for-teens',
    category: 'personal-health',
    summary: 'Balanced eating habits and nutrients your growing body needs.',
    ageAppropriate: ['13-15', '16-18'],
  },
  {
    id: '3',
    title: 'Managing Period Pain',
    slug: 'managing-period-pain',
    category: 'reproductive-health',
    summary: 'Tips and strategies for dealing with menstrual cramps.',
    ageAppropriate: ['16-18', '19-25', '26-30'],
  },
  {
    id: '4',
    title: 'Mental Health Basics',
    slug: 'mental-health-basics',
    category: 'mental-wellbeing',
    summary: 'Introduction to mental health and ways to support your wellbeing.',
    ageAppropriate: ['13-15', '16-18', '19-25', '26-30', '30+'],
  },
  {
    id: '5',
    title: 'Dealing with Peer Pressure',
    slug: 'dealing-with-peer-pressure',
    category: 'social-challenges',
    summary: 'Strategies for handling social pressure and staying true to yourself.',
    ageAppropriate: ['13-15', '16-18'],
  },
  {
    id: '6',
    title: 'Contraception Options',
    slug: 'contraception-options',
    category: 'reproductive-health',
    summary: 'Overview of different birth control methods and how they work.',
    ageAppropriate: ['16-18', '19-25', '26-30', '30+'],
  },
];

const categories = [
  { key: 'personal-health', label: '💚 Personal Health', color: 'bg-green-50 border-green-200' },
  { key: 'reproductive-health', label: '🌸 Reproductive Health', color: 'bg-pink-50 border-pink-200' },
  { key: 'mental-wellbeing', label: '💭 Mental Wellbeing', color: 'bg-blue-50 border-blue-200' },
  { key: 'social-challenges', label: '🤝 Social Challenges', color: 'bg-purple-50 border-purple-200' },
];

interface KnowledgeHubProps {
  userAgeRange?: string;
}

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ userAgeRange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-800">Knowledge Hub</h1>
          </div>
          <p className="text-gray-600">
            Learn about health, wellness, and life topics important to you
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500'
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500'
              }`}
            >
              {cat.label.split(' ')[0]} {cat.label.split(' ').slice(1).join(' ')}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const category = categories.find((c) => c.key === article.category);
              return (
                <Link
                  key={article.id}
                  href={`/knowledge-hub/${article.slug}`}
                >
                  <div
                    className={`${category?.color} border rounded-lg p-6 h-full hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1`}
                  >
                    <div className="text-3xl mb-3">
                      {article.category === 'personal-health' && '💚'}
                      {article.category === 'reproductive-health' && '🌸'}
                      {article.category === 'mental-wellbeing' && '💭'}
                      {article.category === 'social-challenges' && '🤝'}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-pink-600 font-medium">
                      Read More
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No articles found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
