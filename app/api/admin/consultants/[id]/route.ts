import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase.server';
import crypto from 'crypto';

/**
 * Handle PATCH request for updating a consultant
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();
    const { id } = params;

    // Handle password update separately if provided
    if (body.password) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto
        .pbkdf2Sync(body.password, salt, 1000, 64, 'sha512')
        .toString('hex');
      body.password_hash = `${salt}:${hash}`;
      delete body.password;
    }

    const { data, error } = await supabase
      .from('consultants')
      .update(body)
      .eq('id', id)
      .select('id, email, display_name, specializations, is_active, is_available, verified')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle DELETE request for removing a consultant
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceRoleClient();
    const { id } = params;

    const { error } = await supabase
      .from('consultants')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
