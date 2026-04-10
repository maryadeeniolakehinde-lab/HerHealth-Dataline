import { createClient } from './supabase.client';
import type { AnonymousUser } from '@/types';

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
      age_range: session.age_range || 'unknown',
      state: session.state || 'unknown',
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

