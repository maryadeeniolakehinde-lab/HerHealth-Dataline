import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase.server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Fetch consultant by email
    const { data: consultant, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !consultant) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password hash
    const [salt, hash] = consultant.password_hash.split(':');
    const verifyHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');

    if (hash !== verifyHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate a simple token (in production use JWT)
    const token = crypto.randomBytes(32).toString('hex');

    return NextResponse.json({
      token,
      consultant_id: consultant.id,
      email: consultant.email,
      display_name: consultant.display_name,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
