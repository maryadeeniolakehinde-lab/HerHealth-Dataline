'use client';

import { notFound, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Tag, ChevronRight, Heart, Share2, Printer, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const categories: Record<string, { label: string; color: string; bg: string }> = {
  'personal-health': { label: 'Personal Health', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'reproductive-health': { label: 'Reproductive Health', color: 'text-rose-600', bg: 'bg-rose-50' },
  'mental-wellbeing': { label: 'Mental Wellbeing', color: 'text-violet-600', bg: 'bg-violet-50' },
  'social-challenges': { label: 'Social Challenges', color: 'text-amber-600', bg: 'bg-amber-50' },
};

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  summary: string;
  image_url: string;
  age_appropriate: string[];
  created_at: string;
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/knowledge-hub?slug=${slug}`);
        const data = await res.json();
        
        // Find the specific article by slug
        const found = data.find((a: Article) => a.slug === slug);
        if (found) {
          setArticle(found);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-brand-600 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return notFound();
  }

  const categoryInfo = categories[article.category] || { label: article.category, color: 'text-slate-600', bg: 'bg-slate-50' };
  const readTime = Math.ceil(article.content.split(/\s+/).length / 200) + ' min read';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/knowledge-hub" className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {article.image_url ? (
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <BookOpen className="w-20 h-20 text-slate-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg ${categoryInfo.bg} ${categoryInfo.color} text-[10px] font-bold uppercase tracking-widest backdrop-blur-md`}>
                {categoryInfo.label}
              </span>
              <div className="flex items-center gap-1.5 text-slate-300 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-tight">
              {article.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="card shadow-2xl p-8 md:p-16 -mt-32 relative z-10 bg-white">
          <article className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-extrabold prose-p:leading-relaxed prose-p:text-slate-600 prose-li:text-slate-600 markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </article>

          {/* Expert Note */}
          <div className="mt-16 p-8 rounded-[2rem] bg-brand-50 border border-brand-100 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <Heart className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">Medical Disclaimer</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                This information is for educational purposes only and does not constitute medical advice. 
                Always consult with a qualified healthcare provider for personal health concerns.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 pt-12 border-t border-slate-100 text-center space-y-6">
            <h3 className="text-2xl font-display font-bold text-slate-900">Have more questions?</h3>
            <p className="text-slate-500">Our AI and consultants are available 24/7 to provide anonymous guidance.</p>
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg"
            >
              <BookOpen className="w-5 h-5" />
              Start Anonymous Chat
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <p className="text-slate-400 text-sm font-medium">
          © 2026 HerHealth Dataline • Empowering young women in Nigeria
        </p>
      </footer>
    </div>
  );
}
