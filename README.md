# HerHealth Dataline
## Anonymous Health & Wellness Platform for Girls

### 🎯 Project Overview

HerHealth Dataline is a comprehensive, anonymous health and wellness platform specifically designed for girls. It combines AI-powered guidance with human expertise, curated educational content, and anonymized data collection for NGO advocacy.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Recharts
- **Backend**: Supabase (PostgreSQL, Row Level Security, Realtime)
- **Serverless**: Supabase Edge Functions (Deno)
- **AI**: Ollama Cloud API (medical/health-aligned LLM)
- **UI Components**: shadcn/ui patterns with Tailwind CSS

---

## 🔐 Core Features

### 1. **Anonymous Authentication**
- Zero PII collection (no names, emails, phone numbers)
- Unique ID generation: `HHD-XXXXX`
- Age range + State/Region required only
- Session persistence via localStorage

### 2. **AI & Human Chat Interface**
- Real-time messaging with Supabase Realtime
- Intelligent routing: Consultant availability → AI fallback
- Emergency keyword detection with severity levels
- Medical-aware prompt engineering for Ollama

### 3. **Emergency Response System**
- Keyword detection for critical health issues
- Immediate emergency alerts with resources
- Crisis hotline information (988, Crisis Text Line)
- Directed users to emergency services

### 4. **Knowledge Hub**
- 4 content categories:
  - 💚 Personal Health
  - 🌸 Reproductive Health
  - 💭 Mental Wellbeing
  - 🤝 Social Challenges
- Age-appropriate filtering
- Searchable articles

### 5. **Consultant Portal**
- Secure login for verified consultants
- Chat queue with pending requests
- Appointment scheduling (30-min sessions)
- Privacy-first UI reminders
- Specialization-based matching

### 6. **Admin & Advocacy Dashboard**
- Completely anonymized statistics:
  - Most common health topics queried
  - User distribution by age range
  - Geographic distribution by state
  - Consultant performance metrics
- Data visualizations (Recharts)
- Consultant management
- NGO data export capabilities

---

## 🗄️ Database Schema

### Key Tables

1. **users** - Anonymous user profiles
   - `user_id` (PRIMARY KEY)
   - `age_range`, `state`
   - `session_hash`, created_at, last_login

2. **chat_messages** - All conversations
   - `id`, `user_id`, `consultant_id`
   - `message`, `sender`, `is_emergency`
   - `created_at`, `updated_at`

3. **consultants** - Human consultants
   - `id`, `email`, `display_name`
   - `specializations`, `is_active`, `is_available`
   - `verified`, `max_concurrent_chats`

4. **appointments** - Scheduled sessions
   - `id`, `user_id`, `consultant_id`
   - `scheduled_at`, `duration_minutes`, `status`

5. **knowledge_articles** - Educational content
   - `id`, `title`, `slug`, `category`
   - `content`, `age_appropriate`
   - `is_published`, created_at

6. **emergency_keywords** - Emergency detection
   - `keyword`, `severity` (critical/high/moderate)

7. **analytics_events** - Anonymized tracking
   - `event_type`, `topic`, `age_range`, `state`
   - Completely anonymized, no user linking

### Row Level Security (RLS)

All tables have strict RLS policies:
- Users can only access their own data
- Consultants see only assigned chats
- Public articles are readable
- Analytics fully anonymized

---

## 🔄 Chat Routing Flow

### Supabase Edge Function: `/functions/chat`

```
User Message
    ↓
[Emergency Keyword Detection]
    ↓
    Yes → Return Emergency Alert + Resources
    ↓
    No → [Check Consultant Availability]
         ↓
         Available → Route to Consultant
         ↓
         Unavailable → Call Ollama API
                      ↓
                      Generate AI Response
                      ↓
                      Save & Return Response
```

### Emergency Keywords

**Critical Severity:**
- suicide, self-harm, overdose, severe chest pain, can't breathe, bleeding heavily, rape, assault

**High Severity:**
- abuse, pregnant, miscarriage, ectopic, severe pain

**Moderate Severity:**
- high fever, anxiety, depression

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (free tier available)
- Ollama instance running locally or on a server
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd "HerHealth Dataline"

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=medical-llm

# App
NODE_ENV=development
```

### Running Locally

```bash
# Set up Ollama (on macOS/Linux)
ollama pull llama2  # or your preferred medical model

# Start Ollama server
ollama serve

# In another terminal, start HerHealth
npm run dev

# Open http://localhost:3000
```

### Database Setup

```bash
# Apply migrations to Supabase
supabase migration up

# Or manually run SQL from supabase/migrations/01_initial_schema.sql
```

### Deploy Supabase Functions

```bash
supabase functions deploy chat
```

---

## 🎨 Design Principles

- **Calming Aesthetic**: Pink/purple/blue gradient, clean typography
- **Mobile-First**: Optimized for all device sizes
- **Trust & Safety**: Clear disclaimers, resource links, emergency features
- **Privacy-Centric**: Minimal data collection, anonymization by design
- **Accessibility**: High contrast, readable fonts, keyboard navigation

---

## 📊 Anonymization Strategy

All user-identifying information is removed:
- **No Storage**: Names, emails, phone numbers never stored
- **Aggregated Analytics**: Only age ranges and states (never linked)
- **Message Content**: Processed for emergency detection only, not stored with identifiers
- **Data Export**: Only anonymized aggregate data for NGOs

---

## 🔗 User Flows

### New User Flow
1. Land on homepage
2. Select age range & state
3. Generate unique ID (HHD-XXXXX)
4. Accept mandatory disclaimer
5. Enter chat interface

### Returning User Flow
1. Click "Returning User"
2. Enter User ID
3. System fetches chat history & profile
4. Enter chat interface

### Consultant Flow
1. Sign in with email/password
2. View chat queue
3. Accept pending chat
4. Join real-time conversation
5. Schedule follow-up if needed

### Admin Flow
1. Sign in with admin credentials
2. View anonymized statistics
3. Manage consultant access
4. Export data for advocacy

---

## 🔄 API Endpoints

- `POST /api/auth/create-user` - Create new user
- `POST /api/auth/get-profile` - Get user profile
- `POST /api/chat` - Send message (routes to Edge Function)
- `POST /api/consultant/login` - Consultant authentication

---

## 🧪 Testing

```bash
# Run tests (unit + integration)
npm run test

# Run e2e tests
npm run test:e2e

# Check types
npm run typecheck
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Connect GitHub repo to Vercel
# Configure environment variables in Vercel dashboard
# Deploy automatically on push to main
```

### Docker

```bash
docker build -t herhealth .
docker run -p 3000:3000 herhealth
```

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚖️ Privacy & Compliance

- **FERPA Compliant**: For users under 18
- **HIPAA-Friendly**: Designed for healthcare context
- **GDPR Ready**: Right to be forgotten (delete user ID)
- **No Data Brokers**: Data never sold or shared
- **Transparent**: Clear privacy policy and terms

---

## 📞 Emergency Resources

If you're in crisis:

🚨 **Call Emergency Services**: 911 (US)

💬 **National Suicide Prevention Lifeline**: 988

💬 **Crisis Text Line**: Text HOME to 741741

📞 **International Suicide Hotlines**: https://www.iasp.info/resources/Crisis_Centres/

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file

---

## 💚 Mission

HerHealth Dataline empowers girls with anonymous access to health guidance, expert support, and trustworthy information. By collecting completely anonymized data, we help NGOs advocate for better women's health access and policies.

**Every girl deserves safe, judgment-free health guidance.**

---

## 📧 Contact

- **Email**: support@herhealth.org
- **GitHub Issues**: Report bugs or request features
- **Feedback Form**: Available in app dashboard

---

Made with ❤️ for girls' health and safety.
