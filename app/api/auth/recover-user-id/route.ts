import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase.server';

export async function POST(request: NextRequest) {
  try {
    const { state, created_date } = await request.json();

    if (!state || !created_date) {
      return NextResponse.json(
        { error: 'Missing state or created_date' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Parse the date and create a date range (within 7 days)
    const searchDate = new Date(created_date);
    const startDate = new Date(searchDate);
    startDate.setDate(startDate.getDate() - 3); // 3 days before
    const endDate = new Date(searchDate);
    endDate.setDate(endDate.getDate() + 3); // 3 days after

    // Query for users created in that date range with matching state
    const { data, error } = await supabase
      .from('users')
      .select('user_id, created_at')
      .eq('state', state)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(5); // Limit to prevent too many results

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to search for user IDs' },
        { status: 500 }
      );
    }

    // Return user IDs (without revealing creation dates for privacy)
    const userIds = data?.map(user => user.user_id) || [];

    return NextResponse.json({
      user_ids: userIds,
      count: userIds.length,
    });
  } catch (error) {
    console.error('User ID recovery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
