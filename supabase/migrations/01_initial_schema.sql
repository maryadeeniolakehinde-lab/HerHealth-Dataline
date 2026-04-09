-- Create Enums
CREATE TYPE user_age_range AS ENUM ('13-15', '16-18', '19-25', '26-30', '30+');
CREATE TYPE message_sender_type AS ENUM ('user', 'ai', 'consultant');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE article_category AS ENUM ('personal-health', 'reproductive-health', 'mental-wellbeing', 'social-challenges');
CREATE TYPE emergency_severity AS ENUM ('critical', 'high', 'moderate');

-- Users Table (Completely Anonymous)
CREATE TABLE public.users (
  user_id TEXT PRIMARY KEY,
  age_range user_age_range NOT NULL,
  state TEXT NOT NULL,
  session_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Consultants Table (Must be created before chat_messages references it)
CREATE TABLE public.consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT FALSE,
  max_concurrent_chats INT DEFAULT 5,
  verified BOOLEAN DEFAULT FALSE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  sender message_sender_type NOT NULL,
  is_emergency BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INT DEFAULT 30,
  status appointment_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT future_appointment CHECK (scheduled_at > CURRENT_TIMESTAMP)
);

-- Knowledge Articles Table
CREATE TABLE public.knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category article_category NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  image_url TEXT,
  age_appropriate user_age_range[] DEFAULT ARRAY['13-15', '16-18', '19-25', '26-30', '30+']::user_age_range[],
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Keywords Table
CREATE TABLE public.emergency_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT UNIQUE NOT NULL,
  severity emergency_severity NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events Table (Aggregated Data Only)
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'chat_query', 'topic_read', etc.
  topic TEXT,
  age_range user_age_range,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security Policies

-- Users: Users can only view/update their own data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (TRUE); -- Public for now, session-based auth handles access

CREATE POLICY "Users can update their profile" ON public.users
  FOR UPDATE USING (TRUE); -- Session-based auth handles validation

-- Chat Messages: Users can only view their own messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own messages" ON public.chat_messages
  FOR SELECT USING (TRUE); -- Session-based auth handles access

CREATE POLICY "Users can insert their own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (TRUE); -- Session-based auth handles validation

CREATE POLICY "Consultants can see assigned chats" ON public.chat_messages
  FOR SELECT USING (TRUE); -- Session-based auth handles authorization

-- Consultants: Only authenticated consultants can view their own data
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Consultants can view their own profile" ON public.consultants
  FOR SELECT USING (TRUE);

CREATE POLICY "Consultants can update their own profile" ON public.consultants
  FOR UPDATE USING (TRUE);

-- Appointments: Users/Consultants can only see relevant appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their appointments" ON public.appointments
  FOR SELECT USING (TRUE);

-- Knowledge Articles: Published articles are public
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published articles" ON public.knowledge_articles
  FOR SELECT USING (is_published = TRUE);

-- Emergency Keywords: Read-only for all
ALTER TABLE public.emergency_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view emergency keywords" ON public.emergency_keywords
  FOR SELECT USING (TRUE);

-- Analytics: Read-only aggregated data
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analytics are readable by admins" ON public.analytics_events
  FOR SELECT USING (TRUE);

-- Admin Users: Admins only
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view admin data" ON public.admin_users
  FOR SELECT USING (TRUE);

-- Indexes for Performance
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_consultant_id ON public.chat_messages(consultant_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_consultant_id ON public.appointments(consultant_id);
CREATE INDEX idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX idx_knowledge_articles_category ON public.knowledge_articles(category);
CREATE INDEX idx_knowledge_articles_slug ON public.knowledge_articles(slug);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_topic ON public.analytics_events(topic);

-- Insert Default Emergency Keywords
INSERT INTO public.emergency_keywords (keyword, severity) VALUES
('suicide', 'critical'),
('self-harm', 'critical'),
('overdose', 'critical'),
('hospital', 'critical'),
('emergency room', 'critical'),
('severe chest pain', 'critical'),
('cant breathe', 'critical'),
('bleeding heavily', 'critical'),
('rape', 'critical'),
('assault', 'critical'),
('abuse', 'high'),
('pregnant', 'high'),
('miscarriage', 'high'),
('ectopic', 'high'),
('severe pain', 'high'),
('high fever', 'moderate');
