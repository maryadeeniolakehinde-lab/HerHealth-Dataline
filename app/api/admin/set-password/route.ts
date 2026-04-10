import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase.server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Hash password using Node.js crypto
    const crypto = require('crypto');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
    const password_hash = `${salt}:${hash}`;

    // Create or update admin user in database
    const { data, error } = await supabase
      .from('admin_users')
      .upsert(
        {
          email,
          password_hash,
          role: 'admin',
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to set password. Please try again.' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.error('Admin user not found or upsert failed');
      return NextResponse.json(
        { error: 'Failed to set password. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password set successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Password setup error:', error);
    return NextResponse.json(
      { error: 'Unable to set password' },
      { status: 500 }
    );
  }
}
