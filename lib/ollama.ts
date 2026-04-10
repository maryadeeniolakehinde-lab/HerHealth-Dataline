const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://ollama.com/api';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gpt-oss:120b-cloud';

/**
 * Compress chat history to reduce token usage while preserving context
 * Keeps recent messages intact and summarizes older ones
 * This helps minimize API costs and improves response times by reducing token usage
 */
export const compressChatHistory = (
  chatHistory: Array<{ role: string; content: string }>,
  maxTokens: number = 2000,
  keepRecent: number = 4
): Array<{ role: string; content: string }> => {
  if (!chatHistory || chatHistory.length === 0) {
    return [];
  }

  // If history is small, return as is
  if (chatHistory.length <= keepRecent) {
    return chatHistory;
  }

  // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
  const estimateTokens = (text: string): number => {
    return Math.ceil(text.length / 4);
  };

  // Keep recent messages intact
  const recentMessages = chatHistory.slice(-keepRecent);
  const olderMessages = chatHistory.slice(0, -keepRecent);

  // Calculate tokens for recent messages
  let recentTokens = recentMessages.reduce((sum, msg) => sum + estimateTokens(msg.content), 0);

  // If recent messages alone exceed limit, truncate them
  if (recentTokens >= maxTokens) {
    return recentMessages.slice(-2); // Keep only last 2 messages if over limit
  }

  // Summarize older messages if needed
  let availableTokens = maxTokens - recentTokens;
  if (availableTokens <= 0) {
    return recentMessages;
  }

  // Create summary of older messages
  if (olderMessages.length > 0) {
    const summaryPrompt = olderMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const summary = `[Summary of previous conversation: ${Math.min(olderMessages.length, 10)} earlier exchanges]`;
    
    // Add summary if it fits within token budget
    const summaryTokens = estimateTokens(summary);
    if (summaryTokens < availableTokens) {
      return [
        { role: 'system', content: summary },
        ...recentMessages
      ];
    }
  }

  return recentMessages;
};

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
  // Compress chat history to reduce token usage
  const compressedHistory = compressChatHistory(chatHistory);
  
  // Build context from compressed chat history
  const chatContext = compressedHistory.map(chat => `${chat.role}: ${chat.content}`).join('\n');
  
  // User profile context
  const userContext = `
User Profile:
- Name: ${userDetails.name || 'Not specified'}
- Age Range: ${ageRange}
- Location: ${state}
- Medical History: ${userDetails.medicalHistory || 'Not specified'}
`;

  // HerHealth AI identity with medical expertise
  const herHealthAIIdentity = `
You are HerHealth AI, a compassionate and supportive health assistant for young women.
You provide general health information and guidance, NOT medical diagnoses.

Important Guidelines:
- ALWAYS remind users to consult healthcare professionals for medical concerns
- Tailor responses to age group: ${ageRange}
- Be aware of geographic context: ${state}
- Use simple, non-judgmental language
- Focus on education, self-care, and wellness
- If discussing reproductive health, use medically accurate terminology
- For any sign of emergency or self-harm, immediately recommend professional help
- Communicate with empathy, patience, and reassurance
- Acknowledge limitations of AI in medical diagnosis
- Encourage appropriate medical consultation when necessary
- Never provide emergency medical advice - direct users to call emergency services for urgent situations
`;

  // Medical expert skills context
  const medicalSkillsContext = `
As HerHealth AI, you have access to comprehensive medical knowledge including:
- Medical textbooks and clinical guidelines
- Diagnostic procedures and treatment protocols
- Patient communication best practices

Your role is to:
1. Provide accurate medical information based on established medical knowledge
2. Listen carefully to patient concerns and respond thoughtfully
3. Communicate with empathy, patience, and reassurance
4. Encourage appropriate medical consultation when necessary
5. Avoid making definitive diagnoses - always recommend seeing a qualified healthcare provider
`;

  // Combine all contexts
  const fullPrompt = `
${herHealthAIIdentity}

${medicalSkillsContext}

${userContext}

Chat History:
${chatContext || 'No previous messages'}

User (Age: ${ageRange}, Region: ${state}): ${userMessage}

Respond as HerHealth AI, keeping the response under 300 words and compassionate:
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
