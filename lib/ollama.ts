const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://ollama.com/api';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'meditron:7b';

/**
 * Build medical context-aware prompt
 */
export const buildMedicalPrompt = (
  userMessage: string,
  ageRange: string,
  state: string,
  chatHistory?: Array<{ role: string; content: string }>
): string => {
  const systemPrompt = `You are HerHealth AI, a compassionate and supportive health assistant for young women. 
You provide general health information and guidance, NOT medical diagnoses.

Important Guidelines:
- ALWAYS remind users to consult healthcare professionals for medical concerns
- Tailor responses to age group: ${ageRange}
- Be aware of geographic context: ${state}
- Use simple, non-judgmental language
- Focus on education, self-care, and wellness
- If discussing reproductive health, use medically accurate terminology
- For any sign of emergency or self-harm, immediately recommend professional help

Chat History:
${chatHistory?.map((msg) => `${msg.role}: ${msg.content}`).join('\n') || 'No previous messages'}

User (Age: ${ageRange}, Region: ${state}): ${userMessage}

Respond as HerHealth AI, keeping the response under 300 words and compassionate:`;

  return systemPrompt;
};

/**
 * Call Ollama Cloud API
 */
export const callOllamaAPI = async (prompt: string): Promise<string | null> => {
  try {
    if (!OLLAMA_API_KEY) {
      console.error('OLLAMA_API_KEY is not configured');
      return null;
    }

    const request = {
      model: OLLAMA_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${OLLAMA_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Ollama Cloud API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Error calling Ollama Cloud API:', error);
    return null;
  }
};

/**
 * Generate AI response for user message
 */
export const generateAIResponse = async (
  userMessage: string,
  ageRange: string,
  state: string,
  chatHistory?: Array<{ role: string; content: string }>
): Promise<string | null> => {
  const prompt = buildMedicalPrompt(userMessage, ageRange, state, chatHistory);
  const response = await callOllamaAPI(prompt);
  return response;
};

/**
 * Check Ollama Cloud API health
 */
export const checkOllamaHealth = async (): Promise<boolean> => {
  try {
    if (!OLLAMA_API_KEY) {
      return false;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${OLLAMA_API_URL}/v1/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Ollama Cloud health check failed:', error);
    return false;
  }
};
