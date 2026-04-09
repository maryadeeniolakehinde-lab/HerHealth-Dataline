import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

// Mock article details
const ARTICLE_DATA: Record<string, any> = {
  'understanding-menstrual-cycle': {
    title: 'Understanding Your Menstrual Cycle',
    category: 'reproductive-health',
    emoji: '🌸',
    content: `
      # Understanding Your Menstrual Cycle

      Your menstrual cycle is a monthly process that prepares your body for pregnancy. Understanding it helps you know what's normal for you.

      ## The Four Phases

      ### 1. Menstruation (Days 1-5)
      - The uterine lining sheds through the vagina
      - Typically lasts 3-7 days
      - Flow varies from light to heavy
      - Cramps are common due to uterine contractions

      ### 2. Follicular Phase (Days 1-13)
      - Pituitary gland releases FSH hormone
      - Ovaries produce estrogen
      - Uterine lining thickens (proliferates)
      - Energy and mood typically improve

      ### 3. Ovulation (Day 14)
      - Surge in LH hormone triggers egg release
      - Most fertile time of the cycle
      - Some experience spotting or slight pain
      - Body temperature rises slightly

      ### 4. Luteal Phase (Days 15-28)
      - Corpus luteum produces progesterone
      - If unfertilized, hormone levels drop
      - May experience PMS symptoms
      - Cravings, bloating, or mood changes are normal

      ## What's Normal?

      - Cycle length: 21-35 days (28 days average)
      - Period duration: 3-7 days
      - Flow amount: 5-80ml (2-3 tablespoons to 1/3 cup per day)
      - Spotting between periods occasionally
      - Some cramping or discomfort

      ## When to See a Doctor

      - Periods heavier than usual
      - Periods lasting more than 7 days
      - Severe pain that limits daily activities
      - Irregular cycles suddenly becoming regular or vice versa
      - Signs of infection (fever, discharge)

      Remember, every body is different. Your cycle is unique to you!
    `,
  },
  'nutrition-for-teens': {
    title: 'Nutrition for Teens',
    category: 'personal-health',
    emoji: '💚',
    content: `
      # Nutrition for Teens

      Your body is growing and developing. Eating well gives you energy, helps you focus, and builds a strong foundation for life.

      ## Key Nutrients You Need

      ### Protein
      - Builds and repairs muscles
      - Sources: chicken, fish, eggs, beans, nuts, yogurt
      - Aim: 5-6 ounces per day

      ### Calcium & Vitamin D
      - Builds strong bones
      - Sources: milk, cheese, yogurt, fortified foods
      - Aim: 1,300mg calcium daily for teens

      ### Iron
      - Carries oxygen through your blood
      - Sources: lean meat, beans, fortified cereals, leafy greens
      - Aim: 8-15mg daily

      ### Fruits & Vegetables
      - Pack vitamins, minerals, and fiber
      - Aim for variety and color
      - Try to fill half your plate with produce

      ### Whole Grains
      - Steady energy and fiber
      - Choose: whole wheat bread, brown rice, oatmeal
      - Aim: 5-8 ounces daily

      ## Practical Tips

      - **Breakfast**: Fuels your brain for school
      - **Hydration**: Drink water throughout the day
      - **Snacks**: Choose nuts, fruit, yogurt, not just sweets
      - **Limit**: Sugary drinks, too much salt, fried foods

      ## Listen to Your Body

      - Eat when hungry, stop when satisfied
      - All foods can fit in a balanced diet
      - Restriction often backfires
      - If concerned about your eating, talk to someone

      Eating well is about nourishing your body and feeling your best!
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
    title: `${article.title} - HerHealth`,
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/knowledge-hub"
            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Hub
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{article.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-sm max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-gray-200 mt-8 pt-8 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Disclaimer:</strong> This article provides general
              educational information. It&apos;s not a substitute for professional
              medical advice. If you have specific health concerns, please
              consult a healthcare provider.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              <BookOpen className="w-4 h-4" />
              Ask HerHealth AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
