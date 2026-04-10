import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Tag, ChevronRight, Heart, Share2, Printer } from 'lucide-react';

const ARTICLE_DATA: Record<string, any> = {
  'understanding-menstrual-cycle': {
    title: 'Understanding Your Menstrual Cycle',
    category: 'reproductive-health',
    categoryLabel: 'Reproductive Health',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200',
    content: `
Your menstrual cycle is a natural monthly process that prepares your body for potential pregnancy. Understanding its phases is essential for monitoring your health and knowing what is normal for you.

## The Four Main Phases

### 1. Menstruation (The Period)
This is when the uterine lining sheds. It typically lasts between 3 to 7 days. While some discomfort is normal, severe pain that prevents you from going to school or work should be discussed with a professional.

### 2. The Follicular Phase
Starting on the first day of your period and ending with ovulation, this phase involves the development of follicles in your ovaries. Your energy levels often begin to rise during this time.

### 3. Ovulation
Usually occurring around the middle of your cycle, this is when an egg is released. You might notice a slight increase in body temperature or changes in cervical mucus (becoming clearer and more slippery).

### 4. The Luteal Phase
After ovulation, your body produces progesterone to support a potential pregnancy. If no pregnancy occurs, hormone levels drop, leading back to menstruation. This is often when people experience PMS (Premenstrual Syndrome).

## Tracking Your Cycle
We recommend keeping a small diary or using an anonymous app to track your start dates. This helps identify patterns and makes it easier to notice if something changes.

---
*Note: Every woman's cycle is unique. Cycles ranging from 21 to 35 days are generally considered normal.*
    `,
  },
  'nutrition-for-teens': {
    title: 'Nutrition for Growing Bodies',
    category: 'personal-health',
    categoryLabel: 'Personal Health',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200',
    content: `
Good nutrition is the foundation of your future health. For young women in Nigeria, eating a balanced diet is especially important for growth, brain function, and energy.

## Essential Nutrients for You

### Iron
Iron is crucial, especially once you begin menstruating. It helps carry oxygen in your blood. 
**Sources:** Beans, leafy green vegetables (like ugu or shoko), eggs, and lean meats.

### Calcium
To build strong bones that will last a lifetime, you need calcium.
**Sources:** Milk, yogurt, small fish with bones (like sardines), and fortified cereals.

### Protein
Your body uses protein to build and repair tissues.
**Sources:** Soybeans, groundnuts, fish, poultry, and beans.

## Healthy Eating Habits
- **Don't skip breakfast:** It fuels your brain for a day of learning.
- **Stay hydrated:** Drink plenty of water throughout the day, especially in our warm climate.
- **Variety is key:** Try to include different colors of fruits and vegetables in your meals.

Eating well isn't about restriction; it's about giving your body the fuel it needs to thrive.
    `,
  },
  'managing-period-pain': {
    title: 'Managing Period Pain Naturally',
    category: 'reproductive-health',
    categoryLabel: 'Reproductive Health',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
    content: `
Many young women experience some level of discomfort during their periods. While common, there are several ways to manage this pain safely at home.

## Relief Strategies

### 1. Gentle Heat
Applying a warm water bottle to your lower abdomen can help relax the muscles of the uterus, which are the source of cramping.

### 2. Stay Active
While you might feel like staying in bed, gentle exercise like walking or stretching can actually improve blood flow and reduce pain.

### 3. Hydration & Diet
Reducing salt and caffeine intake a few days before your period can help reduce bloating and discomfort. Drinking warm herbal teas (like ginger) can also be soothing.

### 4. Rest
Ensure you are getting enough sleep. Your body is doing hard work, and extra rest can help you cope better with pain.

## When to Seek Professional Guidance
If your period pain is so severe that it:
- Stops you from doing normal activities
- Is not relieved by standard over-the-counter pain relief
- Is accompanied by heavy bleeding

Please use our chat to speak with a consultant for further guidance.
    `,
  },
  'mental-health-basics': {
    title: 'Building Emotional Resilience',
    category: 'mental-wellbeing',
    categoryLabel: 'Mental Wellbeing',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    content: `
Your mental health is just as important as your physical health. Resilience is the ability to bounce back from challenges, and it's a skill you can develop.

## Caring for Your Mind

### Express Yourself
Don't bottle up your feelings. Find a safe way to express them, whether through journaling, art, or talking to someone you trust.

### Set Boundaries
It's okay to say 'no' to things that drain your energy or make you feel uncomfortable. Protecting your peace is a form of self-care.

### Practice Mindfulness
Taking just five minutes a day to sit quietly and focus on your breathing can significantly reduce stress and anxiety levels.

### Limit Social Media
While great for connecting, too much time online can lead to unhealthy comparisons. Take regular breaks to stay grounded in the real world.

Remember, it's okay not to be okay. Seeking help is a sign of strength, not weakness.
    `,
  },
  'dealing-with-peer-pressure': {
    title: 'Navigating Social Pressure',
    category: 'social-challenges',
    categoryLabel: 'Social Challenges',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    content: `
As you grow, you'll face many voices telling you what to do, how to act, and what to believe. Learning to navigate these pressures is key to your independence.

## Understanding Pressure
Pressure can be direct (someone asking you to do something) or indirect (feeling like you have to fit in). Both are normal but can be challenging.

## Tips for Staying True to Yourself
- **Know your values:** What is important to you? When you know your values, making decisions becomes easier.
- **The "Broken Record" technique:** If someone is pressuring you, simply repeat your "no" firmly without feeling the need to give endless excuses.
- **Choose your circle wisely:** Surround yourself with friends who respect your boundaries and support your choices.

You have the right to make choices that feel right for you, regardless of what others are doing.
    `,
  },
  'contraception-options': {
    title: 'Your Guide to Contraception',
    category: 'reproductive-health',
    categoryLabel: 'Reproductive Health',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200',
    content: `
Contraception is about taking charge of your reproductive health and your future. There are many options available, and the best choice depends on your individual needs.

## Common Options

### Long-Acting Reversible Contraception (LARC)
These include implants and IUDs. They are highly effective and can last for several years but can be removed at any time if you decide you want to become pregnant.

### Hormonal Methods
These include the pill, the patch, and the injection. They work by preventing ovulation and must be used consistently to be effective.

### Barrier Methods
Condoms are the only method that also provides protection against sexually transmitted infections (STIs). They should be used in addition to other methods for the best protection.

## Making a Choice
Choosing contraception is a personal decision. We recommend speaking with a healthcare professional who can provide a full medical assessment and help you find the method that suits your lifestyle and health history.

Your privacy and rights are protected when seeking reproductive healthcare.
    `,
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = ARTICLE_DATA[params.slug];
  if (!article) {
    return { title: 'Article Not Found' };
  }
  return {
    title: `${article.title} | HerHealth Knowledge Hub`,
    description: article.title,
  };
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = ARTICLE_DATA[params.slug];

  if (!article) {
    notFound();
  }

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
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest">
                {article.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-slate-300 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
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
          <article className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-extrabold prose-p:leading-relaxed prose-p:text-slate-600 prose-li:text-slate-600">
            <div className="whitespace-pre-wrap">
              {article.content}
            </div>
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
