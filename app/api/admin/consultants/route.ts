import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase.server';
import crypto from 'crypto';

/**
 * Handle GET request for fetching all consultants
 */
export async function GET() {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('consultants')
    .select('id, email, display_name, specializations, is_active, is_available, verified, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * Handle POST request for creating a new consultant
 */
export async function POST(req: Request) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    const { email, display_name, specializations, password } = body;

    if (!email || !display_name || !password) {
      return NextResponse.json(
        { error: 'Email, display name, and password are required' },
        { status: 400 }
      );
    }

    // Hash the password using the same logic as admin
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
    const password_hash = `${salt}:${hash}`;

    const { data, error } = await supabase
      .from('consultants')
      .insert({
        email,
        display_name,
        specializations: specializations || [],
        password_hash,
        is_active: true,
        verified: true, // Admin created consultants are verified by default
      })
      .select('id, email, display_name, specializations, is_active, verified')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A consultant with this email already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create consultant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
