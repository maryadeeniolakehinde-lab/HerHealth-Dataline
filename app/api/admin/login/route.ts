import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase.server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'herhealthdataline@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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

    const supabase = createServiceRoleClient();
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Check if password setup is required
    const requiresPasswordSetup = !admin.password_hash;

    if (requiresPasswordSetup) {
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      return NextResponse.json({
        token,
        email,
        requiresPasswordSetup: true,
      });
    }

    // If password setup is NOT required, we MUST verify the password
    if (!password) {
      return NextResponse.json({
        requiresPasswordSetup: false,
        message: 'Password required',
      });
    }

    // Verify password
    const crypto = require('crypto');
    const [salt, storedHash] = admin.password_hash.split(':');
    
    if (!salt || !storedHash) {
      // Something is wrong with the stored hash, allow reset
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      return NextResponse.json({
        token,
        email,
        requiresPasswordSetup: true,
      });
    }

    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');

    if (hash !== storedHash) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      token,
      email,
      requiresPasswordSetup: false,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Unable to process login request' },
      { status: 500 }
    );
  }
}
