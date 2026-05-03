// Vercel Serverless Function — Resume Analyzer
// Accepts either raw text or base64-encoded file (PDF/DOCX/TXT)
// Parses files server-side, then calls NVIDIA AI for analysis

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mammoth = require("mammoth");

// Use unpdf instead of pdf-parse — it works in Vercel serverless (no DOMMatrix/canvas needed)
import { extractText } from "unpdf";

/* ── Curated course database with REAL working URLs ── */
const COURSE_DB = {
  "python": [
    { title: "Python for Beginners - Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=kqtD5dpn9C8", duration_hours: 6 },
    { title: "Python for Everybody Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/python", duration_hours: 40 },
    { title: "100 Days of Code - Python", provider: "Udemy", url: "https://www.udemy.com/course/100-days-of-code/", duration_hours: 60 },
  ],
  "javascript": [
    { title: "JavaScript Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", duration_hours: 4 },
    { title: "The Complete JavaScript Course", provider: "Udemy", url: "https://www.udemy.com/course/the-complete-javascript-course/", duration_hours: 69 },
    { title: "JavaScript Algorithms and Data Structures", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", duration_hours: 30 },
  ],
  "react": [
    { title: "React JS Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=RVFAyFWO4go", duration_hours: 9 },
    { title: "React - The Complete Guide", provider: "Udemy", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", duration_hours: 48 },
    { title: "Front End Development Libraries", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/", duration_hours: 30 },
  ],
  "machine learning": [
    { title: "Machine Learning Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", duration_hours: 12 },
    { title: "Machine Learning Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction", duration_hours: 50 },
    { title: "Machine Learning with Python", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/machine-learning-with-python/", duration_hours: 30 },
  ],
  "deep learning": [
    { title: "Deep Learning Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/deep-learning", duration_hours: 60 },
    { title: "Deep Learning Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=VyWAvY2CF9c", duration_hours: 6 },
    { title: "Practical Deep Learning", provider: "YouTube", url: "https://www.youtube.com/watch?v=8SF_h3xF3cE", duration_hours: 7 },
  ],
  "sql": [
    { title: "SQL Full Course In 10 Hours", provider: "YouTube", url: "https://www.youtube.com/watch?v=BPHAr4QGGVE", duration_hours: 10 },
    { title: "SQL for Data Science", provider: "Coursera", url: "https://www.coursera.org/learn/sql-for-data-science", duration_hours: 15 },
    { title: "Relational Database", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/relational-database/", duration_hours: 30 },
  ],
  "docker": [
    { title: "Docker Tutorial for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=fqMOX6JJhGo", duration_hours: 3 },
    { title: "Docker Mastery", provider: "Udemy", url: "https://www.udemy.com/course/docker-mastery/", duration_hours: 20 },
  ],
  "aws": [
    { title: "AWS Certified Cloud Practitioner", provider: "YouTube", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", duration_hours: 14 },
    { title: "AWS Cloud Technical Essentials", provider: "Coursera", url: "https://www.coursera.org/learn/aws-cloud-technical-essentials", duration_hours: 12 },
  ],
  "git": [
    { title: "Git and GitHub for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", duration_hours: 1 },
    { title: "Git Complete", provider: "Udemy", url: "https://www.udemy.com/course/git-complete/", duration_hours: 6 },
  ],
  "node.js": [
    { title: "Node.js Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=f2EqECiTBL8", duration_hours: 7 },
    { title: "Server Side Development with NodeJS", provider: "Coursera", url: "https://www.coursera.org/learn/server-side-nodejs", duration_hours: 20 },
  ],
  "data structures": [
    { title: "Data Structures Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=RBSGKlAvoiM", duration_hours: 8 },
    { title: "Algorithms Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/algorithms", duration_hours: 60 },
  ],
  "java": [
    { title: "Java Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=xk4_1vDrzzo", duration_hours: 12 },
    { title: "Java Programming and Software Engineering", provider: "Coursera", url: "https://www.coursera.org/specializations/java-programming", duration_hours: 40 },
  ],
  "c++": [
    { title: "C++ Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y", duration_hours: 4 },
    { title: "C++ For C Programmers", provider: "Coursera", url: "https://www.coursera.org/learn/c-plus-plus-a", duration_hours: 15 },
  ],
  "typescript": [
    { title: "TypeScript Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=30LWjhZzg50", duration_hours: 8 },
    { title: "Understanding TypeScript", provider: "Udemy", url: "https://www.udemy.com/course/understanding-typescript/", duration_hours: 15 },
  ],
  "mongodb": [
    { title: "MongoDB Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=ofme2o29ngU", duration_hours: 4 },
    { title: "MongoDB University Free Courses", provider: "MongoDB", url: "https://learn.mongodb.com/", duration_hours: 20 },
  ],
  "tensorflow": [
    { title: "TensorFlow 2.0 Complete Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=tPYj3fFJGjk", duration_hours: 7 },
    { title: "DeepLearning.AI TensorFlow Developer", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice", duration_hours: 40 },
  ],
  "natural language processing": [
    { title: "NLP Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=fNxaJsNG3-s", duration_hours: 6 },
    { title: "NLP Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/natural-language-processing", duration_hours: 50 },
  ],
  "computer vision": [
    { title: "OpenCV Course - Full Tutorial", provider: "YouTube", url: "https://www.youtube.com/watch?v=oXlwWbU8l2o", duration_hours: 4 },
    { title: "Convolutional Neural Networks", provider: "Coursera", url: "https://www.coursera.org/learn/convolutional-neural-networks", duration_hours: 20 },
  ],
  "kubernetes": [
    { title: "Kubernetes Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=X48VuDVv0do", duration_hours: 4 },
    { title: "Getting Started with Google Kubernetes Engine", provider: "Coursera", url: "https://www.coursera.org/learn/google-kubernetes-engine", duration_hours: 12 },
  ],
  "html/css": [
    { title: "HTML & CSS Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=mU6anWqZJcc", duration_hours: 7 },
    { title: "Responsive Web Design", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", duration_hours: 30 },
  ],
  "flutter": [
    { title: "Flutter Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=VPvVD8t02U8", duration_hours: 37 },
    { title: "Flutter & Dart - The Complete Guide", provider: "Udemy", url: "https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/", duration_hours: 30 },
  ],
  "data science": [
    { title: "Data Science Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=-ETQ97mXXF0", duration_hours: 12 },
    { title: "IBM Data Science Professional Certificate", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/ibm-data-science", duration_hours: 60 },
  ],
  "power bi": [
    { title: "Power BI Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=3u7MQz1EyPY", duration_hours: 4 },
    { title: "Microsoft Power BI Data Analyst", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/microsoft-power-bi-data-analyst", duration_hours: 30 },
  ],
  "tableau": [
    { title: "Tableau Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=aHaOIvR00So", duration_hours: 8 },
    { title: "Data Visualization with Tableau", provider: "Coursera", url: "https://www.coursera.org/specializations/data-visualization", duration_hours: 25 },
  ],
  "cybersecurity": [
    { title: "Cybersecurity Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=U_P23SqJaDc", duration_hours: 12 },
    { title: "Google Cybersecurity Professional Certificate", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", duration_hours: 40 },
  ],
  "system design": [
    { title: "System Design for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=MbjObHmDbZo", duration_hours: 1 },
    { title: "Grokking Modern System Design", provider: "Educative", url: "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers", duration_hours: 20 },
  ],
  "django": [
    { title: "Django Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=o0XbHvKxw7Y", duration_hours: 4 },
    { title: "Django for Everybody", provider: "Coursera", url: "https://www.coursera.org/specializations/django", duration_hours: 30 },
  ],
  "angular": [
    { title: "Angular Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=3qBXWUpoPHo", duration_hours: 3 },
    { title: "Angular - The Complete Guide", provider: "Udemy", url: "https://www.udemy.com/course/the-complete-guide-to-angular-2/", duration_hours: 37 },
  ],
  "next.js": [
    { title: "Next.js Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", duration_hours: 6 },
    { title: "Next.js & React - The Complete Guide", provider: "Udemy", url: "https://www.udemy.com/course/nextjs-react-the-complete-guide/", duration_hours: 25 },
  ],
  "rust": [
    { title: "Rust Programming Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=BpPEoZW5IiY", duration_hours: 14 },
  ],
  "go": [
    { title: "Go / Golang Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=un6ZyFkqFKo", duration_hours: 7 },
    { title: "Programming with Google Go", provider: "Coursera", url: "https://www.coursera.org/specializations/google-golang", duration_hours: 30 },
  ],
  "r programming": [
    { title: "R Programming Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=_V8eKsto3Ug", duration_hours: 5 },
    { title: "Data Science: R Basics", provider: "edX", url: "https://www.edx.org/learn/r-programming/harvard-university-data-science-r-basics", duration_hours: 8 },
  ],
  "spring boot": [
    { title: "Spring Boot Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=9SGDpanrc8U", duration_hours: 4 },
    { title: "Spring Framework Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/spring-framework", duration_hours: 30 },
  ],
  "pandas": [
    { title: "Pandas Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=PcvsOaixUh8", duration_hours: 2 },
    { title: "Data Analysis with Python", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/", duration_hours: 30 },
  ],
  "firebase": [
    { title: "Firebase Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=fgdpvwEWJ9M", duration_hours: 3 },
  ],
  "linux": [
    { title: "Linux Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", duration_hours: 5 },
    { title: "Linux Fundamentals", provider: "Coursera", url: "https://www.coursera.org/learn/linux-fundamentals", duration_hours: 10 },
  ],
  "blockchain": [
    { title: "Blockchain Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=QCvL-DWcojc", duration_hours: 4 },
    { title: "Blockchain Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/blockchain", duration_hours: 30 },
  ],
  "excel": [
    { title: "Excel Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=Vl0H-qTclOg", duration_hours: 3 },
    { title: "Excel Skills for Business", provider: "Coursera", url: "https://www.coursera.org/specializations/excel", duration_hours: 25 },
  ],
};

/**
 * Find the best matching course from our curated DB for a given skill name.
 * Returns an array of matching course objects.
 */
function findCourses(skillName) {
  const lower = skillName.toLowerCase().trim();
  // Direct match
  if (COURSE_DB[lower]) return COURSE_DB[lower];
  // Partial match
  for (const [key, courses] of Object.entries(COURSE_DB)) {
    if (lower.includes(key) || key.includes(lower)) return courses;
  }
  return null;
}

/* ── NVIDIA API Config ── */
const API_KEY =
  process.env.NVIDIA_API_KEY_1 ||
  process.env.NVIDIA_API_KEY_2 ||
  process.env.NVIDIA_API_KEY ||
  "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";

// Vercel maxDuration is 60s and the client aborts at ~58s.
// Budget: 22s per model × 2 models = 44s, leaves ~14s for file parsing + JSON extraction.
const NVIDIA_KEYS = () => [
  {
    key: API_KEY,
    model: "meta/llama-3.1-8b-instruct",
    maxTokens: 1500,
    timeout: 22000,
  },
  {
    key: API_KEY,
    model: "meta/llama-3.3-70b-instruct",
    maxTokens: 1500,
    timeout: 22000,
  },
];

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are an expert AI Resume Analyzer. Given a resume, return ONLY JSON with this exact structure:
{"resume_score":85,"summary":"2-3 sentence comprehensive summary","name":"Name","email":"Email","phone":"Phone","education":{"institution":"University Name","degree":"Degree","cgpa":8.5,"year":"2024"},"skills":[{"name":"Skill","category":"Domain","level":"Beginner/Intermediate/Expert","confidence":0.9}],"projects":[{"title":"Proj","description":"Detailed short description","tech_stack":["React"],"relevance_score":85}],"experience":[{"role":"Role","company":"Company","duration":"Duration","domain":"Domain"}],"certifications":["Cert 1"],"preferred_domains":["Web"],"improvement_tips":[{"text":"Detailed actionable tip","type":"tip/warning"}],"talent_dna":{"analyticalThinking":80,"communication":85,"creativity":75,"leadership":70,"adaptability":85,"collaboration":90,"problemSolving":85,"innovationIndex":80},"skill_gaps":[{"skill":"Skill","priority":"Moderate","reason":"Why"}],"target_roles":["Role1"]}
Extract ALL relevant information. Provide at least 5-10 skills, 3-5 projects (MUST include a relevance_score 0-100), 3-5 actionable improvement_tips, and all 8 talent_dna metrics scored 0-100. Output ONLY valid JSON.`;

async function callNvidiaAPI(resumeText, config) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeout || 55000);

  console.log(`[resume-api] callNvidiaAPI: model=${config.model}, keyLength=${config.key?.length || 0}, keyPrefix=${config.key?.substring(0, 10)}...`);

  try {
    const response = await fetch(NVIDIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analyze this resume and return the JSON:\n\n---RESUME START---\n${resumeText.slice(0, 3000)}\n---RESUME END---`,
          },
        ],
        temperature: 0.1,
        top_p: 0.8,
        max_tokens: 700,
        stream: false,
      }),
      signal: controller.signal,
    });

    console.log(`[resume-api] NVIDIA response status: ${response.status}`);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[resume-api] NVIDIA API error body: ${errText.substring(0, 300)}`);
      throw new Error(`NVIDIA API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    console.log(`[resume-api] Raw AI response length: ${raw.length} chars`);
    console.log(`[resume-api] Raw AI response preview: ${raw.substring(0, 200)}...`);

    // Strip markdown code fences if present
    let jsonStr = raw.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    // Also handle <think>...</think> tags from some models
    jsonStr = jsonStr.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();

    // Aggressive JSON extraction: find the first '{' and last '}'
    const startIdx = jsonStr.indexOf("{");
    const endIdx = jsonStr.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      jsonStr = jsonStr.substring(startIdx, endIdx + 1);
    }

    try {
      const parsed = JSON.parse(jsonStr);
      console.log(`[resume-api] Successfully parsed JSON. resume_score=${parsed.resume_score}, name=${parsed.name}`);
      return parsed;
    } catch (parseError) {
      console.error(`[resume-api] JSON parse failed for ${config.model}. Raw (first 500):`, raw.substring(0, 500));
      throw new Error(`Invalid JSON format returned by AI: ${parseError.message}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

/* ── File parsing utilities ── */

/**
 * Fallback: Extract readable text directly from PDF binary.
 * PDF files store text in stream objects — this regex-based approach
 * extracts text from common PDF text operators (Tj, TJ, ').
 * Not perfect, but works as a last resort when proper parsers fail.
 */
function extractTextFromPdfBuffer(buffer) {
  const raw = buffer.toString("latin1");
  const textChunks = [];

  // Extract text between BT...ET blocks (PDF text objects)
  const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
  for (const block of btBlocks) {
    // Match Tj operator (simple text strings)
    const tjMatches = block.match(/\(([^)]*)\)\s*Tj/g) || [];
    for (const m of tjMatches) {
      const inner = m.match(/\(([^)]*)\)/);
      if (inner) textChunks.push(inner[1]);
    }

    // Match TJ operator (text arrays)
    const tjArrayMatches = block.match(/\[([^\]]*)\]\s*TJ/gi) || [];
    for (const m of tjArrayMatches) {
      const inner = m.match(/\(([^)]*)\)/g) || [];
      for (const s of inner) {
        const txt = s.match(/\(([^)]*)\)/);
        if (txt) textChunks.push(txt[1]);
      }
    }

    // Match ' operator (move to next line and show text)
    const quoteMatches = block.match(/\(([^)]*)\)\s*'/g) || [];
    for (const m of quoteMatches) {
      const inner = m.match(/\(([^)]*)\)/);
      if (inner) textChunks.push(inner[1]);
    }
  }

  // Unescape common PDF string escapes
  let text = textChunks.join(" ")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");

  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

async function extractTextFromBase64(base64Data, fileType) {
  const buffer = Buffer.from(base64Data, "base64");
  console.log(`[resume-api] Parsing ${fileType} file, buffer size: ${buffer.length} bytes`);

  if (fileType === "pdf") {
    // Strategy 1: Try unpdf (works in Vercel serverless — no DOM/canvas needed)
    try {
      const uint8 = new Uint8Array(buffer);
      const { text } = await extractText(uint8, { mergePages: true });
      console.log(`[resume-api] unpdf extracted ${text?.length || 0} chars`);
      if (text && text.trim().length > 30) return text;
      console.log("[resume-api] unpdf returned too little text, trying fallback...");
    } catch (unpdfErr) {
      console.error("[resume-api] unpdf failed:", unpdfErr.message);
    }

    // Strategy 2: Raw binary text extraction (works on some PDFs)
    try {
      const rawText = extractTextFromPdfBuffer(buffer);
      console.log(`[resume-api] Raw PDF extraction got ${rawText.length} chars`);
      if (rawText && rawText.trim().length > 30) return rawText;
    } catch (rawErr) {
      console.error("[resume-api] Raw PDF extraction failed:", rawErr.message);
    }

    throw new Error("Could not extract text from this PDF. The file may be image-based or encrypted. Please try pasting your resume text instead.");
  }

  if (fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    console.log(`[resume-api] mammoth extracted ${result.value.length} chars from DOCX`);
    return result.value;
  }

  if (fileType === "txt") {
    return buffer.toString("utf-8");
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

/* ── Main handler ── */
export const maxDuration = 60;

// Allow larger request bodies for base64-encoded file uploads (PDF/DOCX)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
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
    let resumeText = "";

    // Log what the server received for debugging
    const bodyKeys = Object.keys(req.body || {});
    console.log(`[resume-api] Received request. Body keys: [${bodyKeys.join(", ")}]`);
    if (req.body.fileData) {
      console.log(`[resume-api] fileData length: ${req.body.fileData.length} chars, fileType: ${req.body.fileType}`);
    }
    if (req.body.resumeText) {
      console.log(`[resume-api] resumeText length: ${req.body.resumeText.length} chars`);
    }

    // Support two modes: direct text OR base64 file
    if (req.body.fileData && req.body.fileType) {
      // Mode 1: File upload (base64-encoded)
      try {
        resumeText = await extractTextFromBase64(req.body.fileData, req.body.fileType);
      } catch (parseErr) {
        console.error("[resume-api] File parsing error:", parseErr.message, parseErr.stack);
        return res.status(400).json({
          error: `Could not parse ${req.body.fileType.toUpperCase()} file. ${parseErr.message || "Please try pasting text manually."}`,
          detail: parseErr.message,
        });
      }
    } else if (req.body.resumeText) {
      // Mode 2: Direct text paste
      resumeText = req.body.resumeText;
    } else {
      console.error("[resume-api] No fileData or resumeText in request body. Body keys:", bodyKeys);
      return res.status(400).json({
        error: "No resume content received. Please upload a file or paste text.",
      });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        error: "Resume text too short or could not be extracted. Please paste or upload a valid resume.",
      });
    }

    // Validate that at least one API key is configured
    console.log(`[resume-api] API_KEY length: ${API_KEY?.length || 0}, prefix: ${API_KEY?.substring(0, 10) || 'EMPTY'}`);
    console.log(`[resume-api] ENV KEY_1: ${(process.env.NVIDIA_API_KEY_1 || '').length} chars, KEY_2: ${(process.env.NVIDIA_API_KEY_2 || '').length} chars, KEY: ${(process.env.NVIDIA_API_KEY || '').length} chars`);
    const hasKey = API_KEY && API_KEY.length > 0;
    if (!hasKey) {
      console.error("[resume-api] No NVIDIA API keys configured. Set NVIDIA_API_KEY_1 or NVIDIA_API_KEY in Vercel env vars.");
      return res.status(503).json({
        error: "AI service not configured. Please contact the administrator.",
        detail: "Missing NVIDIA_API_KEY environment variable",
      });
    }

    // Try each NVIDIA model in order (fastest first)
    let lastError = null;
    const configuredKeys = NVIDIA_KEYS();
    for (const config of configuredKeys) {
      if (!config.key) {
        console.warn(`Skipping model ${config.model} — no API key`);
        continue;
      }
      try {
        console.log(`Trying model: ${config.model}`);
        const result = await callNvidiaAPI(resumeText, config);

        // Attach curated courses based on skill_gaps
        result.recommended_courses = [];
        const usedCourses = new Set();

        if (result.skill_gaps && Array.isArray(result.skill_gaps)) {
          for (const gap of result.skill_gaps) {
            const courses = findCourses(gap.skill);
            if (courses) {
              for (const c of courses) {
                if (!usedCourses.has(c.url)) {
                  usedCourses.add(c.url);
                  result.recommended_courses.push({
                    title: c.title,
                    provider: c.provider,
                    skill_name: gap.skill,
                    url: c.url,
                    duration_hours: c.duration_hours,
                    priority: gap.priority,
                    description: `Learn ${gap.skill} — ${gap.reason || "essential for target roles"}`,
                  });
                }
              }
            }
          }
        }

        // If we got fewer than 4 courses, also look at detected skills for additional courses
        if (result.recommended_courses.length < 4 && result.skills) {
          for (const skill of result.skills) {
            if (result.recommended_courses.length >= 10) break;
            const courses = findCourses(skill.name);
            if (courses) {
              for (const c of courses) {
                if (!usedCourses.has(c.url)) {
                  usedCourses.add(c.url);
                  result.recommended_courses.push({
                    title: c.title,
                    provider: c.provider,
                    skill_name: skill.name,
                    url: c.url,
                    duration_hours: c.duration_hours,
                    priority: "Optional",
                    description: `Advance your ${skill.name} skills further`,
                  });
                  if (result.recommended_courses.length >= 10) break;
                }
              }
            }
          }
        }

        return res.status(200).json(result);
      } catch (err) {
        console.error(`Model ${config.model} failed:`, err.message);
        lastError = err;
      }
    }

    // If we get here, all models failed
    console.error("[resume-api] All NVIDIA models failed or no valid response was parsed.");
    if (lastError) {
      return res.status(500).json({ error: "AI analysis failed after multiple attempts.", detail: lastError.message });
    } else {
      return res.status(500).json({ error: "Unknown error occurred during AI analysis." });
    }
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
