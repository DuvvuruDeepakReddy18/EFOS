import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Security: Read API key from environment variable
const NVIDIA_API_KEY = Deno.env.get("NVIDIA_API_KEY") || "";
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

// CORS: Restrict to known origins
const ALLOWED_ORIGINS = [
  Deno.env.get("FRONTEND_URL") || "",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] || "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}

// Full system prompt — aligned with frontend AnalysisResult interface
const SYSTEM_PROMPT = `You are an expert AI Resume Analyzer for InternMatch — India's smartest AI-powered internship allocation platform for the PM Internship Scheme.

When given resume text, you MUST return ONLY a valid JSON object (no markdown, no backticks, no explanation) with this exact structure:

{
  "resume_score": <number 0-100>,
  "summary": "<2-3 sentence professional summary of the candidate>",
  "name": "<candidate full name or 'Unknown'>",
  "email": "<email or null>",
  "phone": "<phone or null>",
  "education": {
    "institution": "<college/university name>",
    "degree": "<degree and branch>",
    "cgpa": <number or null>,
    "year": "<graduation year or current year>"
  },
  "skills": [
    {
      "name": "<skill name>",
      "category": "<Programming|AI/ML|Web Dev|Database|DevOps|Cloud|Data Science|Electronics|Design|Other>",
      "level": "<Expert|Intermediate|Beginner>",
      "confidence": <0.0-1.0>
    }
  ],
  "projects": [
    {
      "title": "<project name>",
      "description": "<1-line description>",
      "tech_stack": ["<tech1>", "<tech2>"],
      "relevance_score": <0-100>
    }
  ],
  "experience": [
    {
      "role": "<job title>",
      "company": "<company name>",
      "duration": "<duration>",
      "domain": "<domain>"
    }
  ],
  "certifications": ["<cert1>", "<cert2>"],
  "preferred_domains": ["<domain1>", "<domain2>"],
  "improvement_tips": [
    {"text": "<actionable tip>", "type": "tip"},
    {"text": "<actionable tip>", "type": "warning"}
  ],
  "talent_dna": {
    "analyticalThinking": <0-100>,
    "creativity": <0-100>,
    "leadership": <0-100>,
    "adaptability": <0-100>,
    "communication": <0-100>,
    "collaboration": <0-100>,
    "problemSolving": <0-100>,
    "innovationIndex": <0-100>
  },
  "skill_gaps": [
    {
      "skill": "<missing skill name>",
      "priority": "<Critical|Moderate|Optional>",
      "hoursToClose": <number>,
      "matchBoost": <number 1-30>,
      "reason": "<why this skill is needed>"
    }
  ],
  "target_roles": ["<role1>", "<role2>", "<role3>"],
  "current_match_score": <0-100>,
  "potential_match_score": <0-100>,
  "learning_plan": [
    {
      "week_range": "<Week 1-2>",
      "topic": "<topic to learn>",
      "skills_covered": ["<skill1>", "<skill2>"],
      "goal": "<what to achieve>"
    }
  ]
}

Rules:
- Extract ALL skills you can identify, even implicit ones (e.g. if they built a web app, they know HTML/CSS)
- Confidence should reflect how strongly the resume evidences that skill
- Resume score considers: completeness, formatting quality, skill depth, project impact, quantified achievements
- Be generous but honest with scores
- improvement_tips should be specific and actionable (4-6 tips)
- talent_dna scores should be inferred from projects, roles, and described experiences
- skill_gaps: Identify 4-8 skills the candidate DOES NOT have but would need for their target roles
- target_roles: Suggest 3 target internship roles that best fit the candidate
- learning_plan: Create a 4-6 week personalized learning plan based on skill gaps, ordered by priority
- DO NOT include recommended_courses in the JSON (courses are handled separately)
- Return ONLY the JSON, nothing else`;

Deno.serve(async (req) => {
  const CORS = getCorsHeaders(req);

  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const { resumeText } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Resume text too short. Please paste or upload a valid resume." }),
        { status: 400, headers: CORS }
      );
    }

    // Prompt injection defense: wrap user input in clear delimiters
    const sanitizedText = resumeText.slice(0, 8000).replace(/```/g, "");

    // Call NVIDIA NIM API
    const response = await fetch(NVIDIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this resume and return the JSON:\n\n---RESUME START---\n${sanitizedText}\n---RESUME END---` },
        ],
        temperature: 0.15,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("NVIDIA API error:", errText);
      return new Response(
        JSON.stringify({ error: "AI engine temporarily unavailable. Please try again." }),
        { status: 502, headers: CORS }
      );
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    // Extract JSON from response (handle possible markdown wrapping and think tags)
    let jsonStr = raw.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    jsonStr = jsonStr.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();

    // Fallback: try to find JSON object in the response
    if (!jsonStr.startsWith("{")) {
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) jsonStr = match[0];
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return new Response(JSON.stringify(parsed), { headers: CORS });
    } catch {
      console.error("Failed to parse LLM response:", raw);
      return new Response(
        JSON.stringify({ error: "AI returned malformed data. Retrying may help.", raw: raw.slice(0, 500) }),
        { status: 500, headers: CORS }
      );
    }
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: CORS }
    );
  }
});
