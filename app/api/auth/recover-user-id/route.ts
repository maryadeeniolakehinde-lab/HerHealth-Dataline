import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase.server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { state, age_range, recovery_question, recovery_answer } = await request.json();

    if (!state || !age_range || !recovery_question || !recovery_answer) {
      return NextResponse.json(
        { error: 'Missing required recovery information' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const recoveryAnswerHash = crypto
      .createHash('sha256')
      .update(recovery_answer.toLowerCase().trim())
      .digest('hex');

    // Query for users with matching state, age range and recovery question
    const { data, error } = await supabase
      .from('users')
      .select('user_id, recovery_answer_hash')
      .eq('state', state)
      .eq('age_range', age_range)
      .eq('recovery_question', recovery_question);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to search for user IDs' },
        { status: 500 }
      );
    }

    // Filter by matching recovery answer hash
    const matchingUsers = data?.filter(user => user.recovery_answer_hash === recoveryAnswerHash) || [];
    const userIds = matchingUsers.map(user => user.user_id);

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
