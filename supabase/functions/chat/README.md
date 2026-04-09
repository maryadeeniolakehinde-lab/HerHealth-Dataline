# Supabase Edge Function: Chat Router

This is the core orchestration function handling all chat routing logic.

## Deployment

```bash
supabase functions deploy chat
```

## Environment Variables

Add these to your `.env.supabase`:

```
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
OLLAMA_API_URL=https://api.ollama.ai
OLLAMA_API_KEY=your_ollama_cloud_api_key
OLLAMA_MODEL=meditron:7b
```

## Function Flow

1. **Emergency Detection** → Scans user message for critical keywords
2. **Consultant Availability Check** → Looks for online consultants
3. **Routing Decision** → Routes to consultant or AI
4. **Response Generation** → Ollama creates contextual response
5. **Data Persistence** → Saves all messages to database

## Key Features

- ✅ Medical-aware emergency keyword detection
- ✅ Real-time consultant availability checking
- ✅ Age-appropriate and region-aware AI context
- ✅ Automatic message persistence
- ✅ Fallback handling for Ollama unavailability
