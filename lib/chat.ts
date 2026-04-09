// Using client for now but this should be used server-side
import { createClient } from './supabase.client';
import type { ChatMessage, EmergencyKeywordMatch } from '@/types';

/**
 * Get available consultants
 */
export const getAvailableConsultants = async () => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('consultants')
      .select('id, display_name, specializations, is_available')
      .eq('is_active', true)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching available consultants:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Exception fetching available consultants:', error);
    return [];
  }
};

/**
 * Check if there are active consultants
 */
export const hasAvailableConsultants = async (): Promise<boolean> => {
  const consultants = await getAvailableConsultants();
  return consultants.length > 0;
};

/**
 * Get emergency keywords from database
 */
export const getEmergencyKeywords = async (): Promise<Map<string, string>> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('emergency_keywords')
      .select('keyword, severity');

    if (error) {
      console.error('Error fetching emergency keywords:', error);
      return new Map();
    }

    return new Map(data.map((row) => [row.keyword.toLowerCase(), row.severity]));
  } catch (error) {
    console.error('Exception fetching emergency keywords:', error);
    return new Map();
  }
};

/**
 * Check message for emergency keywords
 */
export const checkForEmergencyKeywords = (
  message: string,
  keywords: Map<string, string>
): EmergencyKeywordMatch => {
  const lowerMessage = message.toLowerCase();

  for (const [keyword, severity] of keywords) {
    if (lowerMessage.includes(keyword)) {
      return {
        detected: true,
        keyword,
        severity: severity as 'critical' | 'high' | 'moderate',
      };
    }
  }

  return {
    detected: false,
    keyword: '',
    severity: 'moderate',
  };
};

/**
 * Save chat message to database
 */
export const saveChatMessage = async (
  userID: string,
  message: string,
  sender: 'user' | 'ai' | 'consultant',
  consultantID?: string,
  isEmergency: boolean = false
): Promise<ChatMessage | null> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userID,
        consultant_id: consultantID || null,
        message,
        sender,
        is_emergency: isEmergency,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving chat message:', error);
      return null;
    }

    return data as ChatMessage;
  } catch (error) {
    console.error('Exception saving chat message:', error);
    return null;
  }
};

/**
 * Log analytics event (completely anonymized)
 */
export const logAnalyticsEvent = async (
  eventType: string,
  ageRange?: string,
  state?: string,
  topic?: string
) => {
  const supabase = createClient();

  try {
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      topic: topic || null,
      age_range: ageRange || null,
      state: state || null,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Exception logging analytics:', error);
  }
};
