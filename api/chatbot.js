// Vercel Serverless Function — Chatbot
// Accepts message, history, and student context
// Uses NVIDIA AI for chatbot response

const API_KEY = "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";
const NVIDIA_KEYS = [
  {
    key: API_KEY,
    model: "meta/llama-3.1-8b-instruct",
    maxTokens: 500,
    timeout: 30000,
  }
];

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

async function callNvidiaAPI(messages, config) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeout || 15000);

  try {
    const response = await fetch(NVIDIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: config.maxTokens,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NVIDIA API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "I couldn't process that. Please try again!";
  } finally {
    clearTimeout(timeout);
  }
}

export const maxDuration = 60;

export default async function handler(req, res) {
  // CORS headers — restrict to known origins
  const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"].filter(Boolean);
  const origin = req.headers.origin || "";
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || "*";
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [], studentContext = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Validate that at least one API key is configured
    const hasKey = NVIDIA_KEYS.some((c) => c.key && c.key.length > 0);
    if (!hasKey) {
      console.error("No NVIDIA API keys configured.");
      return res.status(503).json({
        error: "AI service not configured.",
        reply: "I'm currently undergoing maintenance. Please check back later!"
      });
    }

    const systemPrompt = `You are the InternMatch AI Assistant, a helpful, friendly, and expert career coach for students.
Your goal is to help students find internships, improve their skills, and understand their career path.

Student Context:
- Name: ${studentContext.name || 'Student'}
- Skills: ${Array.isArray(studentContext.skills) ? studentContext.skills.join(', ') : 'Not specified'}
- CGPA: ${studentContext.cgpa || 'N/A'}
- Interests: ${Array.isArray(studentContext.interests) ? studentContext.interests.join(', ') : 'Not specified'}

Guidelines:
1. Be encouraging, professional, and concise. Use emojis to make the conversation engaging.
2. Directly answer the user's question.
3. If they ask about resumes, give them practical advice (e.g., action verbs, quantifiable results).
4. Do not output markdown code blocks unless you are specifically sharing code.
5. Address the user by name if possible.`;

    const apiMessages = [
      { role: "system", content: systemPrompt }
    ];

    // Add history
    for (const msg of history) {
      apiMessages.push({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.content
      });
    }

    // Add current message
    apiMessages.push({ role: "user", content: message });

    // Try each NVIDIA model in order (fastest first)
    let lastError = null;
    for (const config of NVIDIA_KEYS) {
      if (!config.key) continue;
      
      try {
        console.log(`[chatbot] Trying model: ${config.model}`);
        const reply = await callNvidiaAPI(apiMessages, config);
        return res.status(200).json({ reply });
      } catch (err) {
        console.error(`[chatbot] Model ${config.model} failed:`, err.message);
        lastError = err;
      }
    }

    // If we get here, all models failed
    console.error("[chatbot] All NVIDIA models failed.");
    if (lastError) {
      return res.status(500).json({ error: "AI analysis failed after multiple attempts.", detail: lastError.message });
    } else {
      return res.status(500).json({ error: "Unknown error occurred during AI analysis." });
    }
  } catch (err) {
    console.error("[chatbot] Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
