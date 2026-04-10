import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const ollamaUrl = Deno.env.get("OLLAMA_API_URL") || "https://ollama.com/api";
const ollamaApiKey = Deno.env.get("OLLAMA_API_KEY") || "f2d567f05263413381b56a3b015fb7a1.Arila1QihDtpScMGbh1y79cn";
const ollamaModel = Deno.env.get("OLLAMA_MODEL") || "gpt-oss:120b-cloud";

interface ChatRequest {
  user_id: string;
  message: string;
  age_range: string;
  state: string;
  chat_history?: Array<{ role: string; content: string }>;
}

interface ChatResponse {
  is_emergency: boolean;
  emergency_message?: string;
  routed_to: "ai" | "consultant" | "emergency";
  message?: string;
  consultant_id?: string;
  requires_human?: boolean;
}

// Emergency keywords with severity levels
const EMERGENCY_KEYWORDS: Record<string, "critical" | "high" | "moderate"> = {
  suicide: "critical",
  "self-harm": "critical",
  overdose: "critical",
  hospital: "critical",
  "emergency room": "critical",
  "severe chest pain": "critical",
  "cant breathe": "critical",
  "bleeding heavily": "critical",
  rape: "critical",
  assault: "critical",
  abuse: "high",
  pregnant: "high",
  miscarriage: "high",
  ectopic: "high",
  "severe pain": "high",
  "high fever": "moderate",
};

/**
 * Check message for emergency keywords
 */
function checkEmergency(message: string): {
  is_emergency: boolean;
  keyword?: string;
  severity?: string;
} {
  const lowerMessage = message.toLowerCase();

  for (const [keyword, severity] of Object.entries(EMERGENCY_KEYWORDS)) {
    if (lowerMessage.includes(keyword)) {
      return {
        is_emergency: true,
        keyword,
        severity,
      };
    }
  }

  return { is_emergency: false };
}

/**
 * Get available consultants from Supabase
 */
async function getAvailableConsultants(supabase: any) {
  const { data, error } = await supabase
    .from("consultants")
    .select("id, display_name, specializations")
    .eq("is_active", true)
    .eq("is_available", true)
    .limit(1);

  if (error) {
    console.error("Error fetching consultants:", error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
}

/**
 * Build medical-aware prompt for Ollama
 */
interface UserDetails {
  name?: string;
  medicalHistory?: string;
}

function buildMedicalPrompt(
  userMessage: string,
  ageRange: string,
  state: string,
  chatHistory: Array<{ role: string; content: string }> = [],
  userDetails: UserDetails = {}
): string {
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
}

/**
 * Call Ollama Cloud API for AI response
 */
async function callOllama(prompt: string): Promise<string | null> {
  try {
    if (!ollamaApiKey) {
      console.error("OLLAMA_API_KEY is not configured");
      return null;
    }

    const response = await fetch(`${ollamaUrl}/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ollamaApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error(`Ollama Cloud API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Ollama error details: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.response || null;
  } catch (error) {
    console.error("Ollama Cloud API error:", error);
    return null;
  }
}

/**
 * Save message to database
 */
async function saveMessage(
  supabase: any,
  userId: string,
  message: string,
  sender: "user" | "ai" | "consultant",
  consultantId?: string,
  isEmergency: boolean = false
) {
  const { error } = await supabase.from("chat_messages").insert({
    user_id: userId,
    consultant_id: consultantId || null,
    message,
    sender,
    is_emergency: isEmergency,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error saving message:", error);
  }
}

/**
 * Main handler
 */
serve(async (req: Request) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = (await req.json()) as ChatRequest;
    const { user_id, message, age_range, state, chat_history } = body;

    // Validate required fields
    if (!user_id || !message || !age_range || !state) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

    // Check for emergency keywords
    const emergencyCheck = checkEmergency(message);

    if (emergencyCheck.is_emergency) {
      // Save user message
      await saveMessage(supabase, user_id, message, "user", undefined, true);

      // Return emergency response
      const emergencyResponse: ChatResponse = {
        is_emergency: true,
        routed_to: "emergency",
        emergency_message: `🚨 URGENT: This sounds like a severe medical emergency involving ${emergencyCheck.keyword}. 
        
Please take immediate action:
- Call your local emergency number (112 in Nigeria)
- Visit the nearest hospital or emergency clinic
- If safe, tell a trusted adult immediately

HerHealth AI cannot provide emergency medical care. Professional medical attention is critical.

If you're having thoughts of self-harm or suicide, please reach out:
- Local mental health support: +2348167068027
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

Your safety is our priority. ❤️`,
        requires_human: true,
      };

      return new Response(JSON.stringify(emergencyResponse), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Save user message
    await saveMessage(supabase, user_id, message, "user");

    // Check for available consultants
    const consultant = await getAvailableConsultants(supabase);

    if (consultant) {
      // Route to consultant
      const consultantResponse: ChatResponse = {
        is_emergency: false,
        routed_to: "consultant",
        consultant_id: consultant.id,
        message: `Connected to ${consultant.display_name}. They'll respond shortly with personalized guidance.`,
      };

      return new Response(JSON.stringify(consultantResponse), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Route to AI
    const userDetails = {};
    const prompt = buildMedicalPrompt(message, age_range, state, chat_history, userDetails);
    
    console.log(`Calling Ollama with prompt length: ${prompt.length}`);
    const aiResponse = await callOllama(prompt);

    if (!aiResponse) {
      console.error("AI Response generation failed (Ollama returned null)");
      // Fallback response if Ollama unavailable
      const fallbackResponse: ChatResponse = {
        is_emergency: false,
        routed_to: "ai",
        message:
          "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a few moments, or check if a live consultant is available.",
      };

      return new Response(JSON.stringify(fallbackResponse), {
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`AI Response generated successfully: ${aiResponse.substring(0, 50)}...`);

    // Save AI response
    await saveMessage(supabase, user_id, aiResponse, "ai");

    // Add disclaimer to AI response
    const aiResponseWithDisclaimer = `${aiResponse}\n\n---\n*This is general health information, not a medical diagnosis. Please consult a healthcare professional for personalized medical advice.*`;

    const response: ChatResponse = {
      is_emergency: false,
      routed_to: "ai",
      message: aiResponseWithDisclaimer,
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Handler error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        is_emergency: false,
        routed_to: "ai" as const,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
