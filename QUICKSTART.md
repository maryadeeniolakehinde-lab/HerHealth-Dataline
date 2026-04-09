# HerHealth Dataline - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Clone & Install
```bash
cd "HerHealth Dataline"
npm install
```

### Step 2: Supabase Setup
1. Go to https://supabase.com and create a free project
2. Get your credentials from Project Settings → API
3. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Run SQL Migrations
1. Open Supabase SQL Editor
2. Copy-paste contents of `supabase/migrations/01_initial_schema.sql`
3. Execute

### Step 4: Ollama Cloud Setup
1. Sign up for Ollama Cloud at https://ollama.ai/cloud
2. Get your API key from your account settings
3. Add to `.env.local`:

```env
OLLAMA_API_URL=https://api.ollama.ai
OLLAMA_API_KEY=your_ollama_cloud_api_key
OLLAMA_MODEL=meditron:7b
```

### Step 5: Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 🎉

---

## 🔗 Key URLs

| Feature | URL | Notes |
|---------|-----|-------|
| Public Home | `/` | Landing page |
| New User | `/dashboard` | Chat & auth flow |
| Knowledge Hub | `/knowledge-hub` | Educational articles |
| Consultant Login | `/consultant/login` | For human consultants |
| Consultant Dashboard | `/consultant/dashboard` | Chat queue |
| Admin Dashboard | `/admin` | Statistics & analytics |

---

## 👤 Example User ID

After creating an account, you'll get something like:
```
HHD-A7F9K2
```

Save it! You'll use it to return.

---

## 🧪 Testing the System

### Test Emergency Detection
In chat, type:
```
I'm having thoughts of suicide
```

Should immediately show emergency alert with hotline numbers.

### Test AI Response
In chat, type:
```
What should I eat to stay healthy?
```

Should route to Ollama and return personalized guidance.

### Test Consultant Portal
1. Navigate to `/consultant/login`
2. Use any email/password (mock auth)
3. See the chat queue and pending requests

### Test Admin Dashboard
1. Navigate to `/admin`
2. View anonymized statistics and charts

---

## 📦 What's Included

✅ **Full-stack application**
✅ **Anonymous auth system**
✅ **AI chat integration**
✅ **Emergency detection**
✅ **Consultant portal**
✅ **Knowledge base**
✅ **Admin analytics**
✅ **Beautiful UI with Tailwind**
✅ **Type-safe with TypeScript**
✅ **Responsive design**

---

## 🚸 Privacy Features

- ✅ No names collected
- ✅ No emails stored
- ✅ No phone numbers
- ✅ Unique IDs only
- ✅ All data anonymized
- ✅ GDPR-friendly
- ✅ Right to delete

---

## 🐛 Troubleshooting

### "Ollama connection refused"
- Make sure Ollama is running: `ollama serve`
- Check URL in `.env.local`

### "Supabase authentication failed"
- Verify API keys in `.env.local`
- Check Supabase project is active

### "Port 3000 already in use"
- Run on different port: `npm run dev -- -p 3001`

---

# Next Steps

1. ✅ Set up Supabase
2. ✅ Configure Ollama
3. ✅ Deploy to Vercel
4. ✅ Invite consultants
5. ✅ Launch publicly

See [README.md](./README.md) for full documentation.
