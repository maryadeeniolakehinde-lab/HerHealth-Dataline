# Supabase Deployment Guide

## Your Project Details
- **Project URL**: https://potccczvznoyrlbknlaq.supabase.co
- **Project Reference**: potccczvznoyrlbknlaq

---

## Step 1: Deploy Database Schema

### Via Supabase Dashboard

1. Go to your Supabase project: https://app.supabase.com/projects
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire SQL migration from `supabase/migrations/01_initial_schema.sql` and paste it into the editor
6. Click **Run**

The schema includes:
- 8 tables (users, chat_messages, consultants, appointments, knowledge_articles, emergency_keywords, analytics_events, admin_users)
- Row Level Security (RLS) policies
- Performance indexes
- Pre-populated emergency keywords

✅ **Expected result**: No errors, all tables created successfully

---

## Step 2: Deploy Edge Function (Chat Router)

### Option A: Via Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Click **Edge Functions** in the left sidebar
3. Click **Create a new function**
4. Name it: `chat`
5. **Choose template**: `Hello World`
6. Click **Create function**
7. Replace the entire code with the content from `supabase/functions/chat/index.ts`
8. Click **Deploy**

### Option B: Via Supabase CLI (Advanced)

```bash
# Install Supabase CLI (alternative methods):
# Windows: Download from https://github.com/supabase/cli/releases
# Or use Docker: docker run -it -v ~/.supabase supabase/cli

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref potccczvznoyrlbknlaq

# Deploy the function
supabase functions deploy chat --no-verify-jwt
```

---

## Step 3: Configure Function Secrets

After deploying the function, you need to set environment variables:

1. Go to **Edge Functions** in your Supabase dashboard
2. Click **chat** function
3. Click **Configuration** tab
4. Add secrets:

| Secret Name | Value |
|-------------|-------|
| `SUPABASE_URL` | `https://potccczvznoyrlbknlaq.supabase.co` |
| `SUPABASE_ANON_KEY` | Your anon key from API settings |
| `OLLAMA_API_URL` | `https://api.ollama.ai` |
| `OLLAMA_API_KEY` | Your Ollama Cloud API key |
| `OLLAMA_MODEL` | `meditron:7b` |

**Getting your credentials:**
- Go to **Settings** → **API** in your Supabase dashboard
- Copy `Service Role Key` and `Anon Key`

---

## Step 4: Test the Deployment

### Call the function from your application:

```typescript
const response = await fetch('https://potccczvznoyrlbknlaq.functions.supabase.co/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify({
    user_id: 'HHD-TEST123',
    message: 'What should I eat to stay healthy?',
    age_range: '16-18',
    state: 'California',
  }),
});

const result = await response.json();
console.log(result);
```

### Expected response:
```json
{
  "is_emergency": false,
  "routed_to": "ai",
  "message": "Here's some general guidance about healthy eating..."
}
```

---

## Step 5: Test Emergency Detection

Send a message with an emergency keyword:

```typescript
const response = await fetch('https://potccczvznoyrlbknlaq.functions.supabase.co/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify({
    user_id: 'HHD-TEST123',
    message: 'I am having thoughts of suicide',
    age_range: '16-18',
    state: 'California',
  }),
});

const result = await response.json();
console.log(result);
```

### Expected response:
```json
{
  "is_emergency": true,
  "routed_to": "emergency",
  "requires_human": true,
  "emergency_message": "🚨 URGENT: This sounds like a severe medical emergency...",
}
```

---

## Step 6: Verify Everything Works

### Checklist:

- [ ] Database tables created (check in **Table Editor**)
- [ ] Edge Function deployed successfully
- [ ] Function secrets configured
- [ ] Test API call returns AI response
- [ ] Emergency detection works
- [ ] Messages saved to database

### Check logs for errors:

1. Go to **Edge Functions** → **chat**
2. Click **Logs** tab
3. Look for any errors in function execution

---

## Troubleshooting

### Issue: "Edge Function not found" error

**Solution**: Make sure the function is deployed and the URL is correct:
```
https://potccczvznoyrlbknlaq.functions.supabase.co/chat
```

### Issue: "OLLAMA_API_KEY is not configured"

**Solution**: Add the `OLLAMA_API_KEY` secret to the function configuration

### Issue: "Missing required fields" error

**Solution**: Ensure your request includes all required fields:
- `user_id` (string)
- `message` (string)
- `age_range` (string: '13-15', '16-18', '19-25', '26-30', '30+')
- `state` (string)

### Issue: CORS errors

**Solution**: The function already has CORS headers configured. If you still get errors:
1. Go to function configuration
2. Check that CORS headers are present in the function code (they are by default)

---

## Next Steps

1. ✅ Deploy schema + function (you are here)
2. 📱 Test the application locally: `npm run dev`
3. 🚀 Deploy frontend to Vercel
4. 📊 Monitor analytics in Supabase dashboard
5. 👥 Set up consultant accounts manually or via admin panel

---

## Support

For questions:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project Dashboard: https://app.supabase.com/projects
