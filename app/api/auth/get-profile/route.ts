import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id' },
        { status: 400 }
      );
    }

    const profile = await getUserProfile(user_id);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user_id: profile.user_id,
      age_range: profile.age_range,
      state: profile.state,
      created_at: profile.created_at,
      last_login: profile.last_login,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
