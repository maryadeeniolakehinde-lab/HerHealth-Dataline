import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase.server';

/**
 * Handle GET request for fetching all knowledge articles (for admin)
 */
export async function GET() {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * Handle POST request for creating a new knowledge article
 */
export async function POST(req: Request) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    const {
      title,
      slug,
      category,
      content,
      summary,
      image_url,
      age_appropriate,
      is_published,
    } = body;

    // Validate required fields
    if (!title || !slug || !category || !content || !summary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_articles')
      .insert({
        title,
        slug,
        category,
        content,
        summary,
        image_url,
        age_appropriate,
        is_published: is_published ?? false,
      })
      .select()
      .single();

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
