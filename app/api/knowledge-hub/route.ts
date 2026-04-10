import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase.server';

export const revalidate = 60; // Revalidate every minute

/**
 * Public API for fetching knowledge hub articles
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const ageRange = searchParams.get('age_range');

    const supabase = createServiceRoleClient();

    let query = supabase
      .from('knowledge_articles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (ageRange) {
      query = query.contains('age_appropriate', [ageRange]);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
