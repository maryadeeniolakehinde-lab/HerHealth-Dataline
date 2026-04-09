import crypto from 'crypto';
import { createClient } from './supabase.client';
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
  const supabase = createClient();
  
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
      return null;
    }

    // Store in localStorage for client-side persistence
    if (typeof window !== 'undefined') {
      const userSession = {
        user_id: userID,
        session_hash: sessionHash,
        timestamp: Date.now(),
      };
      localStorage.setItem('herhealth_session', JSON.stringify(userSession));
    }

    return data as AnonymousUser;
  } catch (error) {
    console.error('Exception creating anonymous user:', error);
    return null;
  }
};

/**
 * Verify returning user via user ID
 */
export const verifyReturningUser = async (
  userID: string
): Promise<AnonymousUser | null> => {
  const supabase = createClient();

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

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', userID);

    // Store session in localStorage
    if (typeof window !== 'undefined') {
      const userSession = {
        user_id: userID,
        session_hash: data.session_hash,
        timestamp: Date.now(),
      };
      localStorage.setItem('herhealth_session', JSON.stringify(userSession));
    }

    return data as AnonymousUser;
  } catch (error) {
    console.error('Exception verifying user:', error);
    return null;
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): AnonymousUser | null => {
  if (typeof window === 'undefined') return null;

  const sessionStr = localStorage.getItem('herhealth_session');
  if (!sessionStr) return null;

  try {
    const session = JSON.parse(sessionStr);
    // Session valid for 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    if (session.timestamp < thirtyDaysAgo) {
      localStorage.removeItem('herhealth_session');
      return null;
    }

    return {
      user_id: session.user_id,
      age_range: 'unknown',
      state: 'unknown',
      created_at: '',
      last_login: '',
      session_hash: session.session_hash,
    };
  } catch (error) {
    console.error('Error parsing session:', error);
    localStorage.removeItem('herhealth_session');
    return null;
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('herhealth_session');
  }
};

/**
 * Get user's chat history for context
 */
export const getUserChatHistory = async (
  userID: string,
  limit: number = 10
) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userID)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }

    return data.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Exception fetching chat history:', error);
    return [];
  }
};

/**
 * Get user profile data
 */
export const getUserProfile = async (userID: string) => {
  const supabase = createClient();

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
