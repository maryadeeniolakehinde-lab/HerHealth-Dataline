import { NextRequest, NextResponse } from 'next/server';
import { createAnonymousUser, verifyReturningUser } from '@/lib/auth.server';

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
      throw new Error('Failed to create user');
    }

    return NextResponse.json({ user_id: user.user_id });
  } catch (error) {
    console.error('Auth error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
