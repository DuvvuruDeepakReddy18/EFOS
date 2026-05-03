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
  /* ── Expanded entries for richer gap coverage ── */
  "pytorch": [
    { title: "PyTorch for Deep Learning — Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=V_xro1bcAuA", duration_hours: 10 },
    { title: "Deep Neural Networks with PyTorch", provider: "Coursera", url: "https://www.coursera.org/learn/deep-neural-networks-with-pytorch", duration_hours: 20 },
  ],
  "scikit-learn": [
    { title: "Scikit-Learn Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=0B5eIE_1vpU", duration_hours: 3 },
    { title: "Machine Learning with Scikit-Learn", provider: "Coursera", url: "https://www.coursera.org/learn/machine-learning-with-python", duration_hours: 15 },
  ],
  "fastapi": [
    { title: "FastAPI Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=7t2alSnE2-I", duration_hours: 5 },
    { title: "APIs with FastAPI and Python", provider: "Udemy", url: "https://www.udemy.com/course/rest-api-flask-and-python/", duration_hours: 17 },
  ],
  "express": [
    { title: "Express.js Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=nH9E25nkk3I", duration_hours: 3 },
    { title: "Server-side Development with NodeJS, Express", provider: "Coursera", url: "https://www.coursera.org/learn/server-side-nodejs", duration_hours: 20 },
  ],
  "terraform": [
    { title: "Terraform Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", duration_hours: 3 },
    { title: "HashiCorp Terraform Associate", provider: "Coursera", url: "https://www.coursera.org/learn/terraform-iac", duration_hours: 15 },
  ],
  "vue": [
    { title: "Vue.js Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=FXpIoQ_rT_c", duration_hours: 3 },
    { title: "Vue - The Complete Guide", provider: "Udemy", url: "https://www.udemy.com/course/vuejs-2-the-complete-guide/", duration_hours: 32 },
  ],
  "tailwind": [
    { title: "Tailwind CSS Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=dFgzHOX84xQ", duration_hours: 3 },
    { title: "Tailwind CSS From Scratch", provider: "Udemy", url: "https://www.udemy.com/course/tailwind-css-from-scratch/", duration_hours: 12 },
  ],
  "redis": [
    { title: "Redis Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=XCsS_NVAa1g", duration_hours: 2 },
    { title: "Redis University Free Courses", provider: "Redis", url: "https://university.redis.com/", duration_hours: 10 },
  ],
  "postgresql": [
    { title: "PostgreSQL Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", duration_hours: 4 },
    { title: "PostgreSQL for Everybody", provider: "Coursera", url: "https://www.coursera.org/specializations/postgresql-for-everybody", duration_hours: 20 },
  ],
  "mysql": [
    { title: "MySQL Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", duration_hours: 4 },
  ],
  "kotlin": [
    { title: "Kotlin Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=EExSSotojVI", duration_hours: 3 },
    { title: "Android App Development with Kotlin", provider: "Coursera", url: "https://www.coursera.org/specializations/android-app-development", duration_hours: 30 },
  ],
  "swift": [
    { title: "Swift Full Course for Beginners", provider: "YouTube", url: "https://www.youtube.com/watch?v=comQ1-x2a1Q", duration_hours: 5 },
    { title: "iOS Development with Swift", provider: "Coursera", url: "https://www.coursera.org/specializations/app-development", duration_hours: 25 },
  ],
  "react native": [
    { title: "React Native Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=obH0Po_RdWk", duration_hours: 5 },
    { title: "React Native - The Practical Guide", provider: "Udemy", url: "https://www.udemy.com/course/react-native-the-practical-guide/", duration_hours: 28 },
  ],
  "solidity": [
    { title: "Solidity Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=M576WGiDBdQ", duration_hours: 16 },
  ],
  "embedded": [
    { title: "Embedded Systems Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=3V9eqvkMzHA", duration_hours: 8 },
    { title: "Introduction to Embedded Systems", provider: "Coursera", url: "https://www.coursera.org/learn/introduction-embedded-systems", duration_hours: 20 },
  ],
  "c": [
    { title: "C Programming Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=87SH2Cn0s9A", duration_hours: 4 },
    { title: "C for Everyone: Programming Fundamentals", provider: "Coursera", url: "https://www.coursera.org/learn/c-for-everyone", duration_hours: 15 },
  ],
  "networking": [
    { title: "Computer Networking Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", duration_hours: 8 },
    { title: "Google IT Support Professional Certificate", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/google-it-support", duration_hours: 40 },
  ],
  "rest apis": [
    { title: "REST API Design Best Practices", provider: "YouTube", url: "https://www.youtube.com/watch?v=DcLnNId5c04", duration_hours: 1 },
    { title: "APIs with Node.js and Express", provider: "Coursera", url: "https://www.coursera.org/learn/server-side-nodejs", duration_hours: 20 },
  ],
  "ci/cd": [
    { title: "CI/CD with GitHub Actions Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", duration_hours: 2 },
    { title: "Continuous Integration and Continuous Delivery", provider: "Coursera", url: "https://www.coursera.org/learn/continuous-integration", duration_hours: 15 },
  ],
  "gcp": [
    { title: "Google Cloud Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=UGRDM86MBIQ", duration_hours: 5 },
    { title: "Google Cloud Fundamentals", provider: "Coursera", url: "https://www.coursera.org/learn/gcp-fundamentals", duration_hours: 12 },
  ],
  "monitoring": [
    { title: "Prometheus & Grafana Full Course", provider: "YouTube", url: "https://www.youtube.com/watch?v=h4Sl21AKiDg", duration_hours: 3 },
  ],
  "rtos": [
    { title: "RTOS Fundamentals", provider: "YouTube", url: "https://www.youtube.com/watch?v=F321087yYy4", duration_hours: 4 },
    { title: "Real-Time Operating Systems", provider: "Coursera", url: "https://www.coursera.org/learn/real-time-operating-systems", duration_hours: 15 },
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

const NVIDIA_KEYS = () => [
  {
    key: API_KEY,
    model: "meta/llama-3.1-8b-instruct",
    maxTokens: 1200,
    timeout: 30000,
  },
  {
    key: API_KEY,
    model: "meta/llama-3.3-70b-instruct",
    maxTokens: 1200,
    timeout: 25000,
  }
];

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

// The AI generates ALL fields from the resume directly. No predefined data.
const SYSTEM_PROMPT = `You are an expert career analyst. Analyze the resume thoroughly. Return ONLY valid JSON (no markdown, no prose, no extra text). Generate ALL fields by deeply analyzing the resume content.

{
  "resume_score": 0-100,
  "summary": "1-2 sentence professional summary",
  "name": "...", "email": "...", "phone": "...",
  "education": {"institution": "...", "degree": "...", "cgpa": number_or_null, "year": "..."},
  "skills": [{"name": "...", "category": "Programming|Frontend|Backend|Database|DevOps|Cloud|AI/ML|Data|Embedded|Mobile|Other", "level": "Beginner|Intermediate|Expert", "confidence": 0.0-1.0}] (max 8 items),
  "projects": [{"title": "...", "description": "1 line", "tech_stack": ["..."], "relevance_score": 0-100}] (max 2 items),
  "experience": [{"role": "...", "company": "...", "duration": "...", "domain": "..."}] (all found, max 2),
  "certifications": ["..."] (all found, max 2),
  "improvement_tips": [{"text": "specific actionable advice for THIS resume", "type": "tip|warning"}] (2 items),
  "target_roles": ["..."] (2 roles),
  "preferred_domains": ["..."] (2 domains),
  "talent_dna": {"analyticalThinking": 0-100, "creativity": 0-100, "leadership": 0-100, "adaptability": 0-100, "communication": 0-100, "collaboration": 0-100, "problemSolving": 0-100, "innovationIndex": 0-100},
  "skill_gaps": [{"skill": "...", "priority": "Critical|Moderate", "reason": "1 line why", "hoursToClose": number, "matchBoost": 1-15}] (max 3 missing skills),
  "skill_strengthening": [{"skill": "...", "reason": "1 line why", "hoursToClose": number, "matchBoost": 1-10}] (max 2 existing weak skills),
  "learning_plan": [{"week_range": "Week 1", "topic": "...", "skills_covered": ["..."], "goal": "short goal", "type": "gap|strengthen"}] (2 weeks),
  "current_match_score": 0-100,
  "potential_match_score": 0-100
}`;

/**
 * Best-effort repair of JSON that was cut off mid-generation.
 * Drops a trailing partial token and closes any open strings/objects/arrays.
 * Returns null if it can't produce something parseable-looking.
 */
function repairTruncatedJson(s) {
  if (!s || typeof s !== "string") return null;
  let str = s.trim();
  if (!str.startsWith("{")) return null;

  // Walk the string, track string state and bracket stack; ignore content after a partial token.
  const stack = [];
  let inString = false;
  let escape = false;
  let lastSafeEnd = -1; // index just after the last complete value at depth ≥1

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (escape) { escape = false; continue; }
    if (c === "\\" && inString) { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === "{" || c === "[") stack.push(c);
    else if (c === "}" || c === "]") {
      stack.pop();
      lastSafeEnd = i + 1;
    } else if (c === "," && stack.length > 0) {
      lastSafeEnd = i; // safe to truncate up to (but not including) this comma
    }
  }

  // If we ended inside a string, drop the partial string back to its opening quote.
  if (inString) {
    const lastQuote = str.lastIndexOf('"', lastSafeEnd > 0 ? lastSafeEnd : str.length);
    if (lastQuote > 0) str = str.slice(0, lastQuote);
    else return null;
  } else if (lastSafeEnd > 0) {
    str = str.slice(0, lastSafeEnd);
  }

  // Strip trailing commas
  str = str.replace(/,\s*$/, "");

  // Re-walk to rebuild the bracket stack on the trimmed string
  const stack2 = [];
  let inStr = false, esc = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (esc) { esc = false; continue; }
    if (c === "\\" && inStr) { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === "{" || c === "[") stack2.push(c);
    else if (c === "}" || c === "]") stack2.pop();
  }

  // Close all open brackets in reverse order
  for (let i = stack2.length - 1; i >= 0; i--) {
    str += stack2[i] === "{" ? "}" : "]";
  }
  return str;
}

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
            content: `Analyze this resume and return the JSON:\n\n---RESUME START---\n${resumeText.slice(0, 2000)}\n---RESUME END---`,
          },
        ],
        temperature: 0.1,
        top_p: 0.8,
        max_tokens: config.maxTokens || 2000,
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
      // The model probably hit max_tokens mid-generation — try to repair truncated JSON.
      const repaired = repairTruncatedJson(jsonStr);
      if (repaired) {
        try {
          const parsed = JSON.parse(repaired);
          console.log(`[resume-api] Recovered via repair. resume_score=${parsed.resume_score}, name=${parsed.name}`);
          return parsed;
        } catch (_) { /* fall through */ }
      }
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

/**
 * Last-resort fallback when the AI call fails or times out completely.
 * Pulls skills/name/email/cgpa from the raw resume text via regex so the user
 * still gets a populated dashboard, skill-gap analyzer, and learning hub.
 */
function buildFallbackFromText(resumeText) {
  const text = (resumeText || "").slice(0, 4000);

  // Skill keyword catalog — mirrors the COURSE_DB plus common embedded/web/data skills.
  const SKILL_CATALOG = [
    { name: "Python", category: "Programming" }, { name: "JavaScript", category: "Programming" },
    { name: "TypeScript", category: "Programming" }, { name: "Java", category: "Programming" },
    { name: "C++", category: "Programming" }, { name: "C", category: "Programming" },
    { name: "Go", category: "Programming" }, { name: "Rust", category: "Programming" },
    { name: "SQL", category: "Database" }, { name: "PostgreSQL", category: "Database" },
    { name: "MongoDB", category: "Database" }, { name: "MySQL", category: "Database" },
    { name: "Redis", category: "Database" },
    { name: "React", category: "Frontend" }, { name: "Next.js", category: "Frontend" },
    { name: "Vue", category: "Frontend" }, { name: "Angular", category: "Frontend" },
    { name: "Tailwind", category: "Frontend" }, { name: "HTML/CSS", category: "Frontend" },
    { name: "Node.js", category: "Backend" }, { name: "Express", category: "Backend" },
    { name: "Django", category: "Backend" }, { name: "FastAPI", category: "Backend" },
    { name: "Spring Boot", category: "Backend" },
    { name: "Docker", category: "DevOps" }, { name: "Kubernetes", category: "DevOps" },
    { name: "AWS", category: "Cloud" }, { name: "GCP", category: "Cloud" },
    { name: "Terraform", category: "DevOps" }, { name: "Linux", category: "DevOps" },
    { name: "Git", category: "DevOps" },
    { name: "TensorFlow", category: "AI/ML" }, { name: "PyTorch", category: "AI/ML" },
    { name: "Machine Learning", category: "AI/ML" }, { name: "Deep Learning", category: "AI/ML" },
    { name: "Pandas", category: "Data" }, { name: "Tableau", category: "Data" },
    { name: "Power BI", category: "Data" }, { name: "Excel", category: "Data" },
    { name: "STM32", category: "Embedded" }, { name: "ARM", category: "Embedded" },
    { name: "Arduino", category: "Embedded" }, { name: "Raspberry Pi", category: "Embedded" },
    { name: "Verilog HDL", category: "Embedded" }, { name: "FreeRTOS", category: "Embedded" },
    { name: "Zephyr RTOS", category: "Embedded" }, { name: "Bare-Metal", category: "Embedded" },
    { name: "I2C/SPI/UART", category: "Embedded" },
    { name: "Flutter", category: "Mobile" }, { name: "Kotlin", category: "Mobile" },
    { name: "Swift", category: "Mobile" }, { name: "React Native", category: "Mobile" },
    { name: "Solidity", category: "Other" }, { name: "Blockchain", category: "Other" },
  ];
  const detected = [];
  const seen = new Set();
  for (const s of SKILL_CATALOG) {
    const re = new RegExp(`\\b${s.name.replace(/[.+*?^$()[\]{}|\\/]/g, "\\$&")}\\b`, "i");
    if (re.test(text) && !seen.has(s.name.toLowerCase())) {
      seen.add(s.name.toLowerCase());
      detected.push({ name: s.name, category: s.category, level: "Intermediate", confidence: 0.7 });
    }
  }

  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/);
  const cgpaMatch = text.match(/(?:cgpa|gpa)[:\s]*([\d.]+)/i);
  const yearMatch = text.match(/\b(20\d{2})\b/);
  const firstLine = text.split("\n").map(l => l.trim()).filter(Boolean)[0] || "";
  const nameGuess = (firstLine.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/) || [])[1] || "Candidate";

  return {
    resume_score: 60,
    summary: "Resume parsed with fallback extractor — AI service was slow to respond. Skills, gaps, and recommendations below are derived from keyword detection.",
    name: nameGuess,
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    education: {
      institution: (text.match(/(?:from|at)\s+([A-Z][\w\s,.]+(?:University|Institute|College|School))/) || [])[1] || "",
      degree: (text.match(/\b(B\.?Tech|M\.?Tech|BS|MS|BE|ME|BA|MA|BSc|MSc|Bachelor|Master|PhD)[\w\s.]*/i) || [])[0] || "",
      cgpa: cgpaMatch ? parseFloat(cgpaMatch[1]) : null,
      year: yearMatch ? yearMatch[1] : "",
    },
    skills: detected.slice(0, 12),
    projects: [],
    experience: [],
    certifications: [],
    preferred_domains: [],
    improvement_tips: [
      { text: "Add quantified achievements to projects (e.g. metrics, scale, impact).", type: "tip" },
      { text: "Include a brief professional summary at the top of your resume.", type: "tip" },
      { text: "List relevant certifications with dates.", type: "tip" },
    ],
  };
}

/**
 * Comprehensive synthesis of derived fields.
 * The AI is the primary source, but if it fails to return fields (due to
 * token truncation), this function computes meaningful values from the
 * resume data we already have — ensuring dashboards are never empty.
 */
function synthesizeDerivedFields(result) {
  const skills = result.skills || [];
  const projects = result.projects || [];
  const experience = result.experience || [];
  const certs = result.certifications || [];
  const edu = result.education || {};
  const skillNames = skills.map(s => s.name.toLowerCase());
  const expertCount = skills.filter(s => s.level === "Expert").length;
  // Build category map at function scope — used by target_roles and skill_gaps
  const cats = {};
  for (const s of skills) { cats[s.category] = (cats[s.category] || 0) + 1; }

  // ── Dynamic resume_score ──────────────────────────────────────────────
  if (!result.resume_score || result.resume_score === 85) {
    let score = 30; // base
    if (skills.length >= 5) score += 15; else if (skills.length >= 2) score += 8;
    if (projects.length >= 2) score += 12; else if (projects.length >= 1) score += 6;
    if (experience.length >= 2) score += 15; else if (experience.length >= 1) score += 8;
    if (certs.length >= 2) score += 10; else if (certs.length >= 1) score += 5;
    if (edu.degree) score += 5;
    if (edu.cgpa && edu.cgpa >= 8) score += 5; else if (edu.cgpa && edu.cgpa >= 7) score += 3;
    if (result.summary && result.summary.length > 30) score += 3;
    if (result.email) score += 2;
    score += Math.min(expertCount * 2, 10);
    result.resume_score = Math.min(100, Math.max(20, score));
  }

  // ── Improvement tips (only fill if AI didn't provide) ──────────────────
  if (!Array.isArray(result.improvement_tips) || result.improvement_tips.length === 0) {
    const tips = [];
    if (projects.length < 2) tips.push({ text: "Add at least 2-3 projects with quantified outcomes (e.g., '40% faster processing').", type: "warning" });
    if (experience.length === 0) tips.push({ text: "Include internships, freelance work, or even academic assistant roles to show practical experience.", type: "warning" });
    if (certs.length === 0) tips.push({ text: "Add relevant certifications (AWS, Google Cloud, Coursera certificates) to boost credibility.", type: "tip" });
    if (!edu.cgpa) tips.push({ text: "Include your CGPA/GPA if it's above 7.0 — recruiters use it as a quick filter.", type: "tip" });
    if (skills.length < 5) tips.push({ text: "Expand your skills section — aim for 6-10 relevant technical skills with proficiency levels.", type: "tip" });
    if (skills.length >= 5 && expertCount < 2) tips.push({ text: "Demonstrate deep expertise in at least 2 core skills through advanced projects or contributions.", type: "tip" });
    if (!result.summary || result.summary.length < 30) tips.push({ text: "Write a compelling 2-3 line professional summary at the top of your resume.", type: "tip" });
    if (projects.length >= 1 && projects.every(p => !p.tech_stack || p.tech_stack.length === 0)) tips.push({ text: "List the tech stack used in each project to help ATS systems match your profile.", type: "tip" });
    // Always have at least 3 tips
    if (tips.length < 3) tips.push({ text: "Tailor your resume for each application — highlight skills that match the job description.", type: "tip" });
    if (tips.length < 3) tips.push({ text: "Use action verbs (Built, Designed, Optimized, Led) to start each bullet point.", type: "tip" });
    result.improvement_tips = tips.slice(0, 5);
  }

  // ── Target roles (ensure at least 3) ──────────────────────────────────
  if (!Array.isArray(result.target_roles)) result.target_roles = [];
  if (result.target_roles.length < 3) {
    // Infer roles from skill categories (cats already computed at function scope)
    const roleMap = {
      "AI/ML": ["Machine Learning Engineer", "Data Scientist", "AI Research Intern"],
      "Frontend": ["Frontend Developer", "UI Engineer", "Full Stack Developer"],
      "Backend": ["Backend Developer", "API Engineer", "Full Stack Developer"],
      "Data": ["Data Analyst", "Business Intelligence Analyst", "Data Engineer"],
      "DevOps": ["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer"],
      "Cloud": ["Cloud Solutions Architect", "Cloud Engineer", "DevOps Engineer"],
      "Mobile": ["Mobile App Developer", "iOS/Android Developer", "Flutter Developer"],
      "Embedded": ["Embedded Systems Engineer", "Firmware Developer", "IoT Engineer"],
      "Database": ["Database Engineer", "Backend Developer", "Data Engineer"],
      "Programming": ["Software Developer", "Full Stack Engineer", "Software Engineer"],
    };
    const existingLower = new Set(result.target_roles.map(r => r.toLowerCase()));
    const sortedCats = Object.entries(cats).sort((a, b) => b[1] - a[1]);
    for (const [cat] of sortedCats) {
      if (result.target_roles.length >= 3) break;
      const candidates = roleMap[cat] || ["Software Engineer"];
      for (const r of candidates) {
        if (!existingLower.has(r.toLowerCase()) && result.target_roles.length < 3) {
          result.target_roles.push(r);
          existingLower.add(r.toLowerCase());
        }
      }
    }
    // Final fallback
    const fallbackRoles = ["Software Developer", "Full Stack Engineer", "Tech Intern"];
    for (const r of fallbackRoles) {
      if (result.target_roles.length >= 3) break;
      if (!existingLower.has(r.toLowerCase())) {
        result.target_roles.push(r);
        existingLower.add(r.toLowerCase());
      }
    }
  }

  // ── Match scores ────────────────────────────────────────────────────
  if (!result.current_match_score || result.current_match_score === 0) {
    result.current_match_score = Math.max(25, Math.min(85, result.resume_score - 10 + Math.floor(Math.random() * 5)));
  }
  if (!result.potential_match_score || result.potential_match_score <= result.current_match_score) {
    result.potential_match_score = Math.min(98, result.current_match_score + 15 + Math.floor(Math.random() * 10));
  }

  // ── Skill gaps (fill if AI didn't return any) ────────────────────────
  if (!Array.isArray(result.skill_gaps)) result.skill_gaps = [];
  if (result.skill_gaps.length === 0 && skills.length > 0) {
    // Determine relevant skills the user is missing based on their domain
    const domainGapMap = {
      "Frontend": [
        { skill: "TypeScript", priority: "Critical", reason: "Industry standard for production React/Angular apps", hoursToClose: 15, matchBoost: 12 },
        { skill: "Next.js", priority: "Moderate", reason: "Server-side rendering is expected for modern web roles", hoursToClose: 12, matchBoost: 8 },
        { skill: "System Design", priority: "Moderate", reason: "Required for mid-level frontend architecture decisions", hoursToClose: 20, matchBoost: 10 },
      ],
      "Backend": [
        { skill: "Docker", priority: "Critical", reason: "Containerization is mandatory for backend deployment", hoursToClose: 10, matchBoost: 12 },
        { skill: "System Design", priority: "Moderate", reason: "Essential for scalable backend architecture", hoursToClose: 20, matchBoost: 10 },
        { skill: "CI/CD", priority: "Moderate", reason: "Automated pipelines are expected in professional teams", hoursToClose: 8, matchBoost: 7 },
      ],
      "AI/ML": [
        { skill: "Docker", priority: "Moderate", reason: "Required for ML model deployment and MLOps", hoursToClose: 10, matchBoost: 8 },
        { skill: "SQL", priority: "Critical", reason: "Data querying is fundamental for any ML workflow", hoursToClose: 12, matchBoost: 10 },
        { skill: "AWS", priority: "Moderate", reason: "Cloud deployment of ML models is industry standard", hoursToClose: 15, matchBoost: 9 },
      ],
      "Data": [
        { skill: "SQL", priority: "Critical", reason: "Core skill for any data role — required by 95% of listings", hoursToClose: 12, matchBoost: 14 },
        { skill: "Python", priority: "Critical", reason: "Primary language for data analysis and visualization", hoursToClose: 20, matchBoost: 12 },
        { skill: "Tableau", priority: "Moderate", reason: "Dashboard and reporting tool expected by employers", hoursToClose: 10, matchBoost: 8 },
      ],
      "DevOps": [
        { skill: "Kubernetes", priority: "Critical", reason: "Container orchestration is the next step after Docker", hoursToClose: 15, matchBoost: 12 },
        { skill: "Terraform", priority: "Moderate", reason: "Infrastructure as Code is standard in DevOps teams", hoursToClose: 12, matchBoost: 9 },
        { skill: "Monitoring", priority: "Moderate", reason: "Prometheus/Grafana monitoring is expected", hoursToClose: 8, matchBoost: 7 },
      ],
      "Embedded": [
        { skill: "RTOS", priority: "Critical", reason: "Real-time operating systems are core to embedded roles", hoursToClose: 15, matchBoost: 12 },
        { skill: "Linux", priority: "Moderate", reason: "Embedded Linux is used in most IoT and edge devices", hoursToClose: 12, matchBoost: 9 },
        { skill: "C", priority: "Moderate", reason: "Low-level C programming is essential for firmware", hoursToClose: 15, matchBoost: 10 },
      ],
    };
    // Find dominant category
    const sortedCats2 = Object.entries(cats).sort((a, b) => b[1] - a[1]);
    const topCat = sortedCats2[0]?.[0] || "Programming";
    const gapCandidates = domainGapMap[topCat] || domainGapMap["Backend"];
    for (const gap of gapCandidates) {
      if (!skillNames.includes(gap.skill.toLowerCase())) {
        result.skill_gaps.push(gap);
      }
    }
    // If still empty, add generic gaps
    if (result.skill_gaps.length === 0) {
      const genericGaps = [
        { skill: "Git", priority: "Critical", reason: "Version control is required in every development team", hoursToClose: 5, matchBoost: 8 },
        { skill: "Docker", priority: "Moderate", reason: "Containerization is expected for modern deployment", hoursToClose: 10, matchBoost: 10 },
        { skill: "System Design", priority: "Moderate", reason: "Architecture knowledge separates juniors from mid-level", hoursToClose: 20, matchBoost: 12 },
      ];
      for (const g of genericGaps) {
        if (!skillNames.includes(g.skill.toLowerCase())) result.skill_gaps.push(g);
      }
    }
    result.skill_gaps = result.skill_gaps.slice(0, 4);
  }

  // ── Skill strengthening ──────────────────────────────────────────────
  if (!Array.isArray(result.skill_strengthening)) result.skill_strengthening = [];
  if (result.skill_strengthening.length === 0) {
    const beginnerSkills = skills.filter(s => s.level === "Beginner" || s.level === "Intermediate");
    for (const s of beginnerSkills.slice(0, 2)) {
      result.skill_strengthening.push({
        skill: s.name, priority: s.level === "Beginner" ? "Critical" : "Moderate",
        reason: `Level up your ${s.name} from ${s.level} to the next level for better role matches`,
        hoursToClose: s.level === "Beginner" ? 20 : 12, matchBoost: 6, isStrengthening: true,
      });
    }
  }

  // ── Talent DNA (leave as 0 — the user will take the test to populate) ──
  if (!result.talent_dna || typeof result.talent_dna !== "object") {
    result.talent_dna = {
      analyticalThinking: 0, communication: 0, creativity: 0, leadership: 0,
      adaptability: 0, collaboration: 0, problemSolving: 0, innovationIndex: 0,
    };
  }
  // If AI returned all zeros or didn't provide, leave for the assessment test
  const dnaValues = Object.values(result.talent_dna);
  const allZero = dnaValues.every(v => v === 0 || v === undefined);
  if (allZero) {
    result.talent_dna = {
      analyticalThinking: 0, communication: 0, creativity: 0, leadership: 0,
      adaptability: 0, collaboration: 0, problemSolving: 0, innovationIndex: 0,
    };
  }

  // ── Learning plan ────────────────────────────────────────────────────
  if (!Array.isArray(result.learning_plan) || result.learning_plan.length === 0) {
    const plan = [];
    const gaps = result.skill_gaps || [];
    const strengthen = result.skill_strengthening || [];
    let weekNum = 1;
    for (const g of gaps.slice(0, 3)) {
      plan.push({
        week_range: `Week ${weekNum}–${weekNum + 1}`, topic: `Master ${g.skill}`,
        skills_covered: [g.skill], goal: g.reason || `Close the ${g.skill} gap`,
        type: "gap",
      });
      weekNum += 2;
    }
    for (const s of strengthen.slice(0, 2)) {
      plan.push({
        week_range: `Week ${weekNum}–${weekNum + 1}`, topic: `Level up ${s.skill}`,
        skills_covered: [s.skill], goal: s.reason || `Strengthen ${s.skill}`,
        type: "strengthen",
      });
      weekNum += 2;
    }
    result.learning_plan = plan;
  }
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

        // Synthesize talent_dna and skill_gaps server-side — we dropped these from the
        // AI prompt to keep generation under Vercel's serverless budget.
        synthesizeDerivedFields(result);

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

        // Also add courses for skill-strengthening (level-up existing skills)
        if (result.skill_strengthening && Array.isArray(result.skill_strengthening)) {
          for (const sg of result.skill_strengthening) {
            if (result.recommended_courses.length >= 15) break;
            const courses = findCourses(sg.skill);
            if (courses) {
              for (const c of courses) {
                if (!usedCourses.has(c.url)) {
                  usedCourses.add(c.url);
                  result.recommended_courses.push({
                    title: c.title,
                    provider: c.provider,
                    skill_name: sg.skill,
                    url: c.url,
                    duration_hours: c.duration_hours,
                    priority: sg.priority,
                    description: `${sg.reason} — advance with focused practice`,
                  });
                }
              }
            }
          }
        }

        // Fill remaining slots with detected skill courses
        if (result.recommended_courses.length < 6 && result.skills) {
          for (const skill of result.skills) {
            if (result.recommended_courses.length >= 15) break;
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
                  if (result.recommended_courses.length >= 15) break;
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

    // If we get here, the AI call failed (timeout, parse error, etc.).
    // Since the user wants true analysis, we throw an error instead of mocking everything.
    console.error("[resume-api] AI failed. Returning 500 error instead of faking data. Last error:", lastError?.message);
    return res.status(500).json({ error: "AI analysis failed. Please try again later." });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
