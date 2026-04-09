import { NextRequest, NextResponse } from 'next/server';
import { createAnonymousUser, verifyReturningUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { ageRange, state, userId } = await request.json();

    // If userId provided, it's a returning user
    if (userId) {
      const user = await verifyReturningUser(userId);
      return NextResponse.json({ user_id: user?.user_id || null });
    }

    // New user
    if (!ageRange || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await createAnonymousUser(ageRange, state);
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ user_id: user.user_id });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
