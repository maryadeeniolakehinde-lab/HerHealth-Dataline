const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://ollama.com/api';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gpt-oss:120b-cloud';

/**
 * Build medical context-aware prompt
 */
export const buildMedicalPrompt = (
  userMessage: string,
  ageRange: string,
  state: string,
  chatHistory: Array<{ role: string; content: string }> = [],
  userDetails: { name?: string; medicalHistory?: string } = {}
): string => {
  // Build context from chat history
  const chatContext = chatHistory.map(chat => `${chat.role}: ${chat.content}`).join('\n');
  
  // User profile context
  const userContext = `
User Profile:
- Name: ${userDetails.name || 'Not specified'}
- Age Range: ${ageRange}
- Location: ${state}
- Medical History: ${userDetails.medicalHistory || 'Not specified'}
`;

  // Medical expert context with skills and knowledge base
  const medicalExpertContext = `
You are an experienced medical professional (doctor/nurse) with access to comprehensive medical knowledge including:
- Medical textbooks and clinical guidelines
- Diagnostic procedures and treatment protocols
- Patient communication best practices
- Empathetic and calming communication skills

Your role is to:
1. Provide accurate medical information based on established medical knowledge
2. Communicate with empathy, patience, and reassurance
3. Listen carefully to patient concerns and respond thoughtfully
4. Encourage appropriate medical consultation when necessary
5. Avoid making definitive diagnoses - always recommend seeing a qualified healthcare provider

Important guidelines:
- Never provide emergency medical advice - direct users to call emergency services for urgent situations
- Acknowledge limitations of AI in medical diagnosis
- Be supportive and understanding of patient concerns
- Use clear, accessible language while maintaining medical accuracy
- Consider the user's age, location, and medical history in your responses
`;

  // Combine all contexts
  const fullPrompt = `
${medicalExpertContext}

${userContext}

Conversation History:
${chatContext}

Current Question: ${userMessage}

Please provide a thoughtful, empathetic medical response:
`;

  return fullPrompt;
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
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1000,
    };

    console.log('Making request to Ollama API:', {
      url: `${OLLAMA_API_URL}/generate`,
      model: request.model,
      promptLength: prompt.length
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${OLLAMA_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('Ollama API response status:', response.status);
    console.log('Ollama API response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ollama Cloud API error: ${response.status} ${response.statusText}`, errorText);
      return null;
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('No response body reader available');
      return null;
    }

    let fullResponse = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            fullResponse += data.response;
          }
          // If we get a done signal, we can stop reading
          if (data.done) {
            reader.releaseLock();
            return fullResponse;
          }
        } catch (parseError) {
          // Ignore parsing errors for individual lines, as they might be incomplete
          console.warn('Could not parse line:', line);
        }
      }
    }

    return fullResponse || null;
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
