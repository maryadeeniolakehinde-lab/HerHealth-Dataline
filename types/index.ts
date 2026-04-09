// User Types
export interface AnonymousUser {
  user_id: string; // HHD-XXXXX
  age_range: string; // '13-15', '16-18', '19-25', '26-30', '30+'
  state: string;
  created_at: string;
  last_login: string;
  session_hash: string; // For returning user verification
}

export interface ChatMessage {
  id: string;
  user_id: string;
  consultant_id?: string | null;
  message: string;
  sender: 'user' | 'ai' | 'consultant';
  is_emergency: boolean;
  created_at: string;
  updated_at: string;
}

export interface Consultant {
  id: string;
  email: string;
  name: string;
  specialization: string[];
  is_active: boolean;
  is_available: boolean;
  created_at: string;
  verified: boolean;
  max_concurrent_chats: number;
}

export interface Appointment {
  id: string;
  user_id: string;
  consultant_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: 'personal-health' | 'reproductive-health' | 'mental-wellbeing' | 'social-challenges';
  content: string;
  summary: string;
  image_url?: string;
  age_appropriate: string[];
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

export interface AnalyticsData {
  date: string;
  topic: string;
  count: number;
  age_range?: string;
  state?: string;
}

export interface EmergencyKeywordMatch {
  detected: boolean;
  keyword: string;
  severity: 'critical' | 'high' | 'moderate';
}

// Request/Response Types
export interface ChatRequest {
  user_id: string;
  message: string;
  age_range: string;
  state: string;
  chat_history?: ChatMessage[];
}

export interface ChatResponse {
  is_emergency: boolean;
  emergency_message?: string;
  routed_to: 'ai' | 'consultant' | 'emergency';
  message?: string;
  consultant_id?: string;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}
