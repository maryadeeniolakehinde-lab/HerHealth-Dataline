import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'herhealthdataline@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Missing email' },
        { status: 400 }
      );
    }

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Invalid email. Admin access denied.' },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      token,
      email,
      requiresPasswordSetup: true,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Unable to process login request' },
      { status: 500 }
    );
  }
}
