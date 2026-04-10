import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, ArrowRight, Shield, MessageCircle, BookOpen, Lock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HerHealth Dataline | Anonymous Health Guidance for Young Women',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-100 selection:text-brand-900">
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
          <div className="hidden md:flex items-center gap-8">
            <Link href="/knowledge-hub" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Knowledge Hub</Link>
            <Link href="/dashboard" className="btn-primary py-2 px-5 text-sm">
              Start Chatting
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              100% Private & Anonymous
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 leading-[1.1]">
              Your safe space to <span className="gradient-text">ask anything</span> about your health.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              Get immediate, professional health guidance from our AI and expert consultants. No names, no judgment, just support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard" className="btn-primary text-lg px-10 flex items-center justify-center gap-2">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/knowledge-hub" className="btn-secondary text-lg px-10 flex items-center justify-center gap-2">
                Learn More
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-brand-500" />
                No registration
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-brand-500" />
                Expert verified
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in delay-200">
            <div className="absolute -inset-4 bg-brand-500/10 blur-3xl rounded-full"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800" 
                alt="Young Nigerian woman smiling" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-3xl shadow-xl border border-white/50 max-w-[240px] hidden md:block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-brand-600" />
                </div>
                <div className="font-bold text-slate-900">Expert Care</div>
              </div>
              <p className="text-sm text-slate-600">Our consultants are ready to help you with any questions.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="bg-white border-y border-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-display font-extrabold text-slate-900">Designed for your privacy</h2>
            <p className="text-lg text-slate-600">We prioritize your safety and anonymity above everything else.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card space-y-4">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center">
                <Lock className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Truly Anonymous</h3>
              <p className="text-slate-600">No names, emails, or phone numbers. Your identity is protected by a secure, unique ID.</p>
            </div>
            <div className="card space-y-4">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">AI + Expert Support</h3>
              <p className="text-slate-600">Get instant answers from HerHealth AI or connect with professional health consultants.</p>
            </div>
            <div className="card space-y-4">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Knowledge Hub</h3>
              <p className="text-slate-600">Access verified health articles tailored specifically for young women in Nigeria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Impact */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden h-64">
                  <img src="https://images.unsplash.com/photo-1529139513477-3235a1461ec4?auto=format&fit=crop&q=80&w=400" alt="Student" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-3xl overflow-hidden h-48">
                  <img src="https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&q=80&w=400" alt="Health Professional" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="rounded-3xl overflow-hidden h-48">
                  <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400" alt="Friendship" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-3xl overflow-hidden h-64">
                  <img src="https://images.unsplash.com/photo-1523450031318-038072044813?auto=format&fit=crop&q=80&w=400" alt="Learning" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900">Empowering health choices across Nigeria.</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              HerHealth Dataline isn't just a chat platform—it's a movement to provide every young woman with accurate, judgment-free health information.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Safe & Confidential</h4>
                  <p className="text-slate-600">Your health data is used only for anonymized advocacy to improve healthcare services.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Culturally Relevant</h4>
                  <p className="text-slate-600">Guidance that understands the unique context of health in Nigeria.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="gradient-primary rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white">Ready to chat?</h2>
            <p className="text-xl text-brand-50">Join thousands of women who are taking control of their health journey today.</p>
            <Link href="/dashboard" className="btn-secondary text-lg px-12 py-4 inline-flex items-center gap-2">
              Start Anonymous Chat
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-brand-600 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-extrabold tracking-tight text-white">
                HerHealth <span className="text-brand-600">Dataline</span>
              </span>
            </div>
            <p className="max-w-sm text-slate-500">
              Providing anonymous, expert-verified health guidance for the next generation of women in Nigeria.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-6">Resources</h5>
            <ul className="space-y-4 text-sm">
              <li><Link href="/knowledge-hub" className="hover:text-brand-400 transition-colors">Knowledge Hub</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Emergency Services</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-6">Admin</h5>
            <ul className="space-y-4 text-sm">
              <li><Link href="/admin" className="hover:text-brand-400 transition-colors">Admin Login</Link></li>
              <li><Link href="/consultant/login" className="hover:text-brand-400 transition-colors">Consultant Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 text-center text-sm text-slate-600">
          © 2026 HerHealth Dataline. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
