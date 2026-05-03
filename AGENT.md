# AGENT.md — InternMatch AI
## AI-Based Smart Allocation Engine for PM Internship Scheme

> This file is the authoritative context document for any AI coding agent (Claude Code, Cursor, Windsurf, Antigravity, etc.) working on this project. Read this before writing any code.

---

## 🎯 PROJECT IDENTITY

| Field | Value |
|-------|-------|
| **Project Name** | InternMatch AI |
| **Hackathon** | EFOS Hackathon |
| **Problem Statement** | AI-Based Smart Allocation Engine for PM Internship Scheme |
| **Domain** | Open Innovation |
| **Team** | Black Squad |
| **Objective** | National-scale AI platform to match students with PM Scheme internships using NLP, optimization algorithms, and gamification |

---

## 🏗 ARCHITECTURE

```
internmatch-ai/
├── frontend/              # React 18 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── auth/
│   │   │   ├── student/
│   │   │   ├── company/
│   │   │   └── admin/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/          # Zustand state management
│   │   ├── services/       # API calls (axios)
│   │   └── types/
│   ├── package.json
│   └── tailwind.config.ts
│
├── backend/               # Python FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── students.py
│   │   │   │   ├── companies.py
│   │   │   │   ├── internships.py
│   │   │   │   ├── ai_engine.py
│   │   │   │   ├── rewards.py
│   │   │   │   └── admin.py
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/
│   │   │   ├── resume_parser.py      # NLP resume parsing
│   │   │   ├── skill_matcher.py      # BERT + cosine similarity
│   │   │   ├── allocation_engine.py  # OR-Tools optimization
│   │   │   ├── fairness_engine.py    # AI Fairness 360
│   │   │   └── recommendation.py    # Internship recommender
│   │   ├── ml/
│   │   │   ├── models/               # Trained ML models
│   │   │   └── embeddings/           # Cached BERT embeddings
│   │   └── core/
│   │       ├── config.py
│   │       ├── database.py
│   │       └── security.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── AGENT.md               # This file
```

---

## 🛠 TECH STACK

### Frontend
- **React 18** with TypeScript (strict mode)
- **Tailwind CSS** + **shadcn/ui** for components
- **Framer Motion** for animations
- **Zustand** for state management
- **React Router v6** for routing
- **Recharts** + **D3.js** for data visualizations
- **Axios** for API calls
- **React Hook Form** + **Zod** for form validation
- **Lucide React** for icons

### Backend
- **FastAPI** (Python 3.11+)
- **SQLAlchemy** + **Alembic** (ORM + migrations)
- **PostgreSQL** (primary database)
- **Redis** (caching + session store)
- **Celery** (background task queue for ML jobs)
- **JWT** (python-jose) for authentication
- **Pydantic v2** for data validation

### AI/ML Stack
- **spaCy** — Named Entity Recognition for resume parsing
- **HuggingFace Transformers** — BERT for skill embeddings
- **scikit-learn** — Cosine similarity, Random Forest, feature vectorization
- **Google OR-Tools** — Multi-objective optimization (Hungarian Algorithm + LP)
- **IBM AI Fairness 360 (aif360)** — Bias detection and fairness metrics
- **PyMuPDF (fitz)** / **pdfminer.six** — PDF text extraction
- **python-docx** — DOCX parsing

### Infrastructure
- **Docker** + **Docker Compose** for local development
- **AWS** for production (EC2, S3, RDS, ElastiCache, Lambda)
- **Nginx** as reverse proxy

---

## 🗄 DATABASE SCHEMA (Core Tables)

```sql
-- Users (base table)
users: id, email, phone, role (student|company|admin), created_at, is_verified

-- Student profiles
students: user_id, name, college, branch, year, cgpa, location, bio, photo_url

-- Skill passport
skills: id, name, category, description
student_skills: student_id, skill_id, level, verified, source, added_at

-- Resumes
resumes: id, student_id, file_url, parsed_at, raw_text, extracted_json

-- Companies
companies: user_id, name, industry, size, cin_number, logo_url, verified

-- Internships
internships: id, company_id, title, description, required_skills_json, 
             stipend_min, stipend_max, duration_weeks, location, mode, 
             total_seats, filled_seats, deadline, status

-- Applications
applications: id, student_id, internship_id, match_score, status, 
              applied_at, allocation_reason_json

-- Match scores (cached)
match_scores: student_id, internship_id, score, breakdown_json, computed_at

-- Rewards
reward_transactions: id, student_id, action, points, description, created_at
student_rewards: student_id, total_points, level, badges_json

-- Learning
courses: id, provider, title, url, skill_id, duration_mins, reward_points
student_courses: student_id, course_id, status, completed_at

-- Challenges
challenges: id, title, description, difficulty, reward_points, deadline
challenge_submissions: id, challenge_id, student_id, code_url, score, evaluated_at

-- Mentors
mentors: id, user_id, domain, experience_years, availability_json, bio
mentor_sessions: id, mentor_id, student_id, scheduled_at, status, notes
```

---

## 🔑 ENVIRONMENT VARIABLES

```env
# .env (never commit this)

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/internmatch
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# AWS S3 (resume/file storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=internmatch-files
AWS_REGION=ap-south-1

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# AI/ML
OPENAI_API_KEY=           # For AI coaching chatbot
ANTHROPIC_API_KEY=        # Alternative LLM for chatbot

# Frontend
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

---

## 🔌 API ROUTES

### Auth
```
POST   /api/auth/signup           - Register new user
POST   /api/auth/login            - Login, returns JWT
POST   /api/auth/verify-otp       - Verify OTP
POST   /api/auth/refresh          - Refresh JWT token
POST   /api/auth/forgot-password  - Send reset OTP
```

### Student
```
GET    /api/student/profile                  - Get own profile
PUT    /api/student/profile                  - Update profile
POST   /api/student/resume/upload            - Upload resume (multipart)
GET    /api/student/resume/parsed            - Get parsed resume data
GET    /api/student/skill-passport           - Get digital skill passport
GET    /api/student/skill-gap/{internship_id}- Get skill gap for specific role
GET    /api/student/matches                  - Get AI-ranked internship matches
GET    /api/student/matches/{id}/explain     - Get AI explanation for a match
POST   /api/student/apply/{internship_id}    - Apply for internship
GET    /api/student/applications             - Get all applications + status
GET    /api/student/rewards                  - Get points balance + history
GET    /api/student/leaderboard              - Get leaderboard data
GET    /api/student/career-path              - Get AI career pathway
GET    /api/student/talent-dna               - Get Talent DNA profile
```

### Company
```
GET    /api/company/profile                  - Get company profile
PUT    /api/company/profile                  - Update profile
POST   /api/company/internships              - Post new internship
GET    /api/company/internships              - List own internships
GET    /api/company/internships/{id}/candidates - AI-ranked candidates
PUT    /api/company/applications/{id}/status - Shortlist/Reject/Accept
POST   /api/company/team-builder             - Build team from applicant pool
GET    /api/company/analytics                - Internship analytics
```

### Admin
```
GET    /api/admin/dashboard                  - National stats
GET    /api/admin/talent-graph               - Talent intelligence graph data
GET    /api/admin/fairness                   - Fairness metrics
GET    /api/admin/skill-shortage             - Skill shortage radar data
GET    /api/admin/talent-mobility            - Talent mobility predictions
POST   /api/admin/policy-simulate            - Run policy simulation
GET    /api/admin/ecosystem-health           - Ecosystem health score
GET    /api/admin/fraud-detection            - Flagged internships
```

### AI Engines
```
POST   /api/ai/parse-resume                  - Trigger resume parsing job
POST   /api/ai/compute-matches/{student_id}  - Recompute all match scores
POST   /api/ai/run-allocation                - Trigger national allocation
GET    /api/ai/fairness-report               - Get latest fairness audit
POST   /api/ai/reallocate/{internship_id}    - Trigger dynamic reallocation
```

---

## 🤖 AI PIPELINE DETAILS

### Resume Parsing Pipeline
```
Input: PDF/DOCX file
Step 1: Text extraction (PyMuPDF for PDF, python-docx for DOCX)
Step 2: spaCy NER → extract name, college, graduation year, GPA
Step 3: Custom skill extractor → match against skills database
Step 4: BERT sentence embeddings → semantic skill detection
Step 5: Project parser → extract project names, tech used, impact
Step 6: Output: structured JSON with confidence scores
```

### Skill Matching Pipeline
```
Input: student_id, internship_id
Step 1: Get student skill vector (TF-IDF weighted)
Step 2: Get internship requirement vector
Step 3: Compute cosine similarity
Step 4: Boost factors: project relevance, certification bonus, location match
Step 5: Output: match_score (0-100) + breakdown JSON
```

### Allocation Optimization
```
Input: All pending applications + available seats
Algorithm: Multi-Objective Linear Programming (OR-Tools)
Objective: Maximize Σ(match_score × preference_weight × fairness_factor)
Constraints:
  - Each internship: filled_seats ≤ total_seats
  - Each student: assigned to at most 1 internship
  - Fairness: gender parity within ±5%
  - Regional: minimum % from Tier-2/3 cities
Output: Optimal assignment matrix
```

### Dynamic Reallocation
```
Trigger: Student rejects / withdraws from allocated internship
Step 1: Mark seat as available
Step 2: Get next-ranked unallocated candidate for that internship
Step 3: Run fairness check on proposed reallocation
Step 4: Auto-notify next candidate within 2 minutes (Celery task)
```

---

## 🎨 DESIGN SYSTEM

### Color Palette (CSS Variables)
```css
:root {
  --bg-primary: #0A0F1E;      /* Deep navy background */
  --bg-secondary: #111827;    /* Card background */
  --bg-glass: rgba(255,255,255,0.05); /* Glassmorphism */
  --accent-blue: #3B82F6;     /* Primary accent */
  --accent-gold: #F59E0B;     /* Secondary accent */
  --accent-green: #10B981;    /* Success/positive */
  --accent-red: #EF4444;      /* Danger/negative */
  --text-primary: #F9FAFB;    /* White text */
  --text-secondary: #9CA3AF;  /* Muted text */
  --border: rgba(59,130,246,0.2); /* Subtle blue border */
  --glow: 0 0 20px rgba(59,130,246,0.3); /* Blue glow effect */
}
```

### Typography
```
Headings: 'Sora' (Google Fonts) — weights 600, 700, 800
Body: 'DM Sans' (Google Fonts) — weights 400, 500
Code: 'JetBrains Mono' — weight 400
```

### Component Conventions
```tsx
// Glassmorphism card pattern
<div className="bg-white/5 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 shadow-lg">

// Glow button pattern
<button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl 
                   shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-200">

// Score badge pattern
<span className="bg-green-500/20 text-green-400 border border-green-500/30 
                 px-3 py-1 rounded-full text-sm font-semibold">
  94% Match
</span>
```

---

## 📋 CODING STANDARDS & CONVENTIONS

### TypeScript (Frontend)
- Use `interface` for object shapes, `type` for unions/primitives
- All API responses must be typed (create `/types/api.ts`)
- Use React Query (`@tanstack/react-query`) for all API data fetching
- All forms: React Hook Form + Zod validation
- No `any` types — use `unknown` and narrow
- Use path aliases: `@/components`, `@/pages`, `@/services`, `@/store`

### Python (Backend)
- Python 3.11+ features allowed
- Type hints everywhere — use `from __future__ import annotations`
- Pydantic v2 for all request/response schemas
- All database queries through SQLAlchemy ORM (no raw SQL unless necessary)
- Async endpoints where possible (`async def`)
- All ML-heavy operations → Celery background tasks, not in request path
- Exception handling: use custom `HTTPException` with meaningful messages
- Log with `structlog` (JSON format)

### File naming
- React components: PascalCase (`StudentDashboard.tsx`)
- Utilities/hooks: camelCase (`useMatchScore.ts`)
- Python files: snake_case (`resume_parser.py`)
- Constants: UPPER_SNAKE_CASE

---

## 🚦 TASK PRIORITY ORDER

When building this project, implement in this order:

**Phase 1 — Foundation (MVP)**
1. Project scaffolding (Vite + React + FastAPI + Docker)
2. Authentication system (JWT, roles: student/company/admin)
3. Student profile + resume upload (S3)
4. Basic resume parsing (spaCy NER)
5. Internship CRUD (company can post, student can view)
6. Basic skill matching (cosine similarity)
7. Simple dashboard for each role

**Phase 2 — Core AI**
8. BERT embeddings for skill matching
9. Multi-objective allocation engine (OR-Tools)
10. Explainable AI matching (breakdown JSON → UI)
11. Dynamic reallocation engine
12. Skill Gap Analyzer
13. Fairness engine + monitoring

**Phase 3 — Engagement**
14. Rewards + gamification system
15. Leaderboard
16. Skill Learning Hub (course cards + progress)
17. AI Practice Lab (Monaco editor integration)
18. Skill challenges + auto-evaluation
19. AI Learning Coach chatbot

**Phase 4 — Advanced Features**
20. Talent DNA model
21. Career Pathway Planner
22. Mentor Matching
23. Skill Battle Arena
24. National Analytics Dashboard (admin)
25. Talent Intelligence Graph (D3.js)
26. Policy Simulator
27. Global Internship Bridge

---

## ⚠️ AGENT RULES

1. **Never hardcode credentials** — always use environment variables
2. **Always add loading states** — every async operation needs a skeleton/spinner
3. **Always add error states** — every component must handle API failures gracefully
4. **Mobile-first** — every component must be responsive (test at 375px, 768px, 1280px)
5. **Accessibility** — all interactive elements must have proper ARIA labels
6. **No blocking ML in request path** — all heavy ML operations go to Celery
7. **Always paginate** — any list endpoint returning more than 20 items must be paginated
8. **Cache aggressively** — match scores, leaderboard, skill gap analysis → Redis cache (TTL: 1 hour)
9. **Optimistic UI** — reward points, application status should update optimistically
10. **Never delete data** — use soft deletes (`is_deleted` flag) for all user data
11. **Type everything** — no implicit any in TypeScript, no missing type hints in Python
12. **Log everything** — all AI decisions must be logged with input/output for auditability
13. **Test critical paths** — allocation engine, fairness check, and resume parser must have unit tests

---

## 🧪 TEST ACCOUNTS (for demo/development)

```
# Student demo account
Email: student@demo.com
Password: Demo@1234
Profile: 3rd year ECE, CGPA 8.2, Skills: Python, ML, Arduino

# Company demo account
Email: company@demo.com
Password: Demo@1234
Profile: TechCorp India, IT industry, 10 open internships

# Admin demo account
Email: admin@demo.com
Password: Demo@1234
Profile: Ministry of Skill Development, full access
```

---

## 📦 QUICK START

```bash
# Clone and setup
git clone https://github.com/black-squad/internmatch-ai
cd internmatch-ai
cp .env.example .env  # Fill in your values

# Start everything with Docker
docker-compose up --build

# OR run separately:
# Frontend
cd frontend && npm install && npm run dev    # → localhost:3000

# Backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload               # → localhost:8000

# DB migrations
cd backend && alembic upgrade head

# Seed demo data
cd backend && python scripts/seed_demo.py
```

---

## 🎯 HACKATHON DEMO SCRIPT

The following flow must work end-to-end for the demo:

```
1. Landing page loads with animated stats counter ✓
2. Student signs up → role select → profile wizard ✓
3. Upload resume PDF → parsing animation → skill passport appears ✓
4. Dashboard shows: 5 AI-matched internships with scores ✓
5. Click "Why This Match?" → explainer modal with breakdown ✓
6. Skill gap page → shows 3 missing skills → "Start Learning" button ✓
7. Micro-module completed → +15 points toast notification ✓
8. Leaderboard updates in real-time ✓
9. Switch to Company account → see AI-ranked candidates ✓
10. Switch to Admin account → national dashboard + fairness score ✓
```

---

*EFOS Hackathon | Black Squad | InternMatch AI | AI-Based Smart Allocation Engine for PM Internship Scheme*