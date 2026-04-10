import crypto from 'crypto';
import { createServerSideClient } from './supabase.server';
import type { AnonymousUser } from '@/types';

const HERHEALTH_PREFIX = 'HHD';

/**
 * Generate a unique anonymous user ID
 */
export const generateUserID = (): string => {
  const randomBytes = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${HERHEALTH_PREFIX}-${randomBytes}`;
};

/**
 * Create a session hash for device recognition
 */
export const createSessionHash = (userID: string): string => {
  const timestamp = Date.now().toString();
  return crypto
    .createHash('sha256')
    .update(`${userID}-${timestamp}-${Math.random()}`)
    .digest('hex');
};

/**
 * Create a new anonymous user (first login)
 */
export const createAnonymousUser = async (
  ageRange: string,
  state: string
): Promise<AnonymousUser | null> => {
  const supabase = await createServerSideClient();

  try {
    const userID = generateUserID();
    const sessionHash = createSessionHash(userID);

    const { data, error } = await supabase
      .from('users')
      .insert({
        user_id: userID,
        age_range: ageRange,
        state: state,
        session_hash: sessionHash,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating anonymous user:', error);
      throw new Error(error.message || 'Supabase insert failed');
    }

    return data as AnonymousUser;
  } catch (error) {
    console.error('Exception creating anonymous user:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error creating anonymous user');
  }
};

/**
 * Verify returning user via user ID
 */
export const verifyReturningUser = async (
  userID: string
): Promise<AnonymousUser | null> => {
  const supabase = await createServerSideClient();

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userID)
      .single();

    if (error || !data) {
      console.error('User not found:', error);
      return null;
    }

    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', userID);

    return data as AnonymousUser;
  } catch (error) {
    console.error('Exception verifying user:', error);
    return null;
  }
};

/**
 * Get user profile data
 */
export const getUserProfile = async (userID: string) => {
  const supabase = await createServerSideClient();

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userID)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching user profile:', error);
    return null;
  }
};
