import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // In production, validate against Supabase
    // For now, simple mock authentication
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Mock successful login
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    const consultantId = 'consultant-' + Math.random().toString(36).substr(2, 9);

    return NextResponse.json({
      token,
      consultant_id: consultantId,
      email,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
