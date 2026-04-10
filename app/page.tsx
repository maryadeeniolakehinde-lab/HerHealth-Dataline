import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, ArrowRight, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HerHealth Dataline - Health Guidance for Girls',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-600" />
            <h1 className="text-2xl font-bold text-gray-800">HerHealth</h1>
          </div>
          <Link
            href="/dashboard"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Your Safe Space for Health Questions
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Ask anything about your health, wellness, and body. Completely
          anonymous. No judgment. Just helpful guidance from AI and expert
          consultants.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
        >
          Start Chatting Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-lg card-hover">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              100% Anonymous
            </h3>
            <p className="text-gray-600">
              No names, emails, or personal information. Just you and your
              unique ID. Your privacy is sacred.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg card-hover">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              AI + Experts
            </h3>
            <p className="text-gray-600">
              Get immediate guidance from HerHealth AI or connect with a human
              consultant. Always someone there to help.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg card-hover">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Learn & Grow
            </h3>
            <p className="text-gray-600">
              Access curated articles on reproductive health, mental wellness,
              and social challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
            We Help With All Your Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-pink-50 border-l-4 border-pink-600 p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                💚 Personal Health
              </h4>
              <p className="text-gray-600">
                Nutrition, fitness, sleep, stress management, and overall
                wellness
              </p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                🌸 Reproductive Health
              </h4>
              <p className="text-gray-600">
                Periods, contraception, fertility, STI prevention, and sexual
                health
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                💭 Mental Wellbeing
              </h4>
              <p className="text-gray-600">
                Anxiety, depression, self-esteem, relationships, and emotional
                health
              </p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-600 p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                🤝 Social Challenges
              </h4>
              <p className="text-gray-600">
                Peer pressure, bullying, family issues, and social situations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Your Privacy is Our Priority
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            We never collect names, emails, or phone numbers. Your unique ID is
            your only identifier. All your data is encrypted and secure.
          </p>
          <p className="text-gray-600">
            Anonymized health insights help NGOs advocate for women&apos;s health
            rights and access to better healthcare.
          </p>
        </div>
      </div>

      {/* Emergency Support Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-red-800 mb-4">Emergency Support in Nigeria</h3>
              <p className="text-red-700 mb-6">
                If you&apos;re experiencing a medical emergency or crisis situation, please contact emergency services immediately:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2">Medical Emergency</h4>
                  <p className="text-gray-600 mb-2">Call emergency services:</p>
                  <p className="text-2xl font-bold text-red-600">112</p>
                  <p className="text-sm text-gray-500 mt-2">Available nationwide for medical emergencies</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2">Crisis Support</h4>
                  <p className="text-gray-600 mb-2">Women&apos;s health crisis hotline:</p>
                  <p className="text-2xl font-bold text-red-600">+234 816 706 8027</p>
                  <p className="text-sm text-gray-500 mt-2">24/7 support for women&apos;s health concerns</p>
                </div>
              </div>
              <p className="text-red-700 mt-6 text-sm">
                <strong>Remember:</strong> HerHealth AI provides general health information and is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Get Started?</h2>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all"
        >
          Talk to HerHealth Now
          <Heart className="w-5 h-5" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="mb-2">© 2024 HerHealth Dataline. All rights reserved.</p>
          <p className="text-gray-400 text-sm">
            For medical emergencies, call 112 in Nigeria. Crisis support: +2348167068027
          </p>
        </div>
      </footer>
    </div>
  );
}
