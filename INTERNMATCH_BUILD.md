# 🚀 InternMatch AI — Full Website Build Prompt
## AI-Based Smart Allocation Engine for PM Internship Scheme

---

## 🎯 PROJECT OVERVIEW

Build **InternMatch AI** — a national-scale, AI-powered internship allocation platform for India's PM Internship Scheme. The platform intelligently matches students to internships using NLP, machine learning, optimization algorithms, and gamification. It serves three user types: Students, Companies, and Government/Admin.

**Hackathon Context:** EFOS Hackathon | Domain: Open Innovation | Team: Black Squad

---

## 🛠 TECH STACK

### Frontend
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Charts/Viz:** Recharts + D3.js
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Routing:** React Router v6
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python)
- **ML/NLP:** scikit-learn, HuggingFace Transformers (BERT), spaCy
- **Optimization:** Google OR-Tools (Hungarian Algorithm + Linear Programming)
- **Vector DB:** Pinecone / Qdrant for skill embeddings
- **Database:** PostgreSQL + Redis (caching)
- **Auth:** JWT + OAuth2

### AI/ML Services
- Resume parsing: TF-IDF + BERT embeddings
- Skill matching: Cosine Similarity
- Allocation: Multi-Objective Linear Programming
- Fairness: IBM AI Fairness 360
- Predictions: scikit-learn Random Forest / XGBoost

### Infrastructure
- **Cloud:** AWS (EC2, S3, Lambda, RDS)
- **Containerization:** Docker + Docker Compose
- **API Gateway:** AWS API Gateway
- **File Storage:** AWS S3 (resumes, certificates)

---

## 🎨 UI/UX DESIGN DIRECTION

### Visual Identity
- **Theme:** Dark-first with electric blue + gold accents (inspired by India's digital push + AI futurism)
- **Primary Color:** `#0A0F1E` (deep navy)
- **Accent 1:** `#3B82F6` (electric blue)
- **Accent 2:** `#F59E0B` (gold/amber)
- **Success:** `#10B981`
- **Font:** `Sora` (headings) + `DM Sans` (body)
- **Design Language:** Glassmorphism panels + subtle grid backgrounds + glowing borders on active elements
- **Logo:** Circuit-brain hybrid icon representing AI + human talent

### Layout
- Sidebar navigation (collapsible)
- Dashboard-first approach
- Responsive: Mobile, Tablet, Desktop
- Smooth page transitions (Framer Motion)
- Toast notifications (react-hot-toast)

---

## 📁 FOLDER STRUCTURE

```
internmatch-ai/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Signup.tsx
│   │   │   │   └── RoleSelect.tsx
│   │   │   ├── Student/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   ├── ResumeUpload.tsx
│   │   │   │   ├── SkillPassport.tsx
│   │   │   │   ├── SkillGapAnalyzer.tsx
│   │   │   │   ├── InternshipMatches.tsx
│   │   │   │   ├── SkillLearningHub.tsx
│   │   │   │   ├── PracticeLab.tsx
│   │   │   │   ├── CareerPathway.tsx
│   │   │   │   ├── Rewards.tsx
│   │   │   │   ├── Leaderboard.tsx
│   │   │   │   ├── MentorMatch.tsx
│   │   │   │   ├── SkillBattleArena.tsx
│   │   │   │   ├── SimulationLab.tsx
│   │   │   │   └── TalentDNA.tsx
│   │   │   ├── Company/
│   │   │   │   ├── CompanyDashboard.tsx
│   │   │   │   ├── PostInternship.tsx
│   │   │   │   ├── CandidatePool.tsx
│   │   │   │   ├── AIRankedCandidates.tsx
│   │   │   │   ├── TeamBuilder.tsx
│   │   │   │   └── InternshipAnalytics.tsx
│   │   │   └── Admin/
│   │   │       ├── GovDashboard.tsx
│   │   │       ├── NationalTalentGraph.tsx
│   │   │       ├── FairnessMonitor.tsx
│   │   │       ├── SkillShortageRadar.tsx
│   │   │       ├── PolicySimulator.tsx
│   │   │       └── EcosystemHealth.tsx
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── charts/
│   │   │   ├── ai/
│   │   │   └── gamification/
│   │   └── store/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── resume_parser.py
│   │   │   ├── skill_matcher.py
│   │   │   ├── allocation_engine.py
│   │   │   ├── fairness_engine.py
│   │   │   └── recommendation_engine.py
│   │   └── ml/
└── docker-compose.yml
```

---

## 📄 PAGE-BY-PAGE FEATURE BREAKDOWN

---

### 1. 🌐 LANDING PAGE (`/`)

**Sections:**
- Hero: Animated tagline "India's Smartest Internship Platform" with particle/neural network background
- Stats counter: 300K+ Students | 10K+ Companies | 95% Match Accuracy | 50+ Industries
- Feature highlights with glassmorphism cards
- How It Works: 4-step animated process (Upload Resume → AI Analysis → Smart Match → Get Internship)
- Testimonials carousel
- Government partnership banner (PM Internship Scheme branding)
- CTA: "Get Started as Student" / "Post Internship as Company" / "Admin Portal"
- Footer with links

**Technical:**
- Animated counter (Intersection Observer)
- Interactive neural network canvas background
- Smooth scroll navigation

---

### 2. 🔐 AUTHENTICATION SYSTEM (`/auth`)

**Features:**
- Multi-role signup: Student | Company | Government/Admin
- Student signup: Name, Email/Phone, College, Branch, Year, CGPA
- Company signup: Organization name, GST/CIN verification, Industry, Size
- Admin signup: Government ID, Department, Role verification
- OTP verification (Email + Phone)
- OAuth login (Google)
- JWT token-based sessions
- Password strength meter
- Forgot password with OTP reset
- Profile completion wizard (multi-step form with progress indicator)
  - Step 1: Basic Info
  - Step 2: Education details
  - Step 3: Skills & Technologies
  - Step 4: Projects & Experience
  - Step 5: Preferences & Career Goals
  - Step 6: Upload Resume / Photo

---

### 3. 🎓 STUDENT DASHBOARD (`/student/dashboard`)

**Main Dashboard Cards:**
- Match Score: AI compatibility score with top internships
- Skill Passport completeness: percentage bar
- Active Applications status
- Talent Points balance + recent activity
- Upcoming skill challenges
- Mentor sessions scheduled
- Quick actions: Upload Resume, Browse Internships, Take Challenge

**Activity Feed:** Real-time updates on matches, rewards, skill completions

**AI Insight Panel:** "Your top skill gap this week is React.js — complete this micro-course to boost matches by 23%"

---

### 4. 📄 AI RESUME INTELLIGENCE ENGINE (`/student/resume`)

**Features:**
- Drag-and-drop PDF/DOCX upload
- Real-time NLP parsing progress bar
- Extracted data display:
  - Skills detected (with confidence %)
  - Technologies identified
  - Projects parsed
  - Certifications found
  - Experience timeline
- AI-generated skill profile visualization (radar chart)
- Edit/confirm extracted data
- Skill gap comparison vs top internships in your field
- Resume Score: 0-100 with improvement tips
- One-click Resume Builder: AI fills template from parsed data
- AI Cover Letter Generator: Auto-generate from internship JD + resume

**Backend:**
- spaCy NER + BERT for entity extraction
- TF-IDF vectorization for skill similarity
- PDF parsing: pdfminer / PyMuPDF

---

### 5. 🛂 DIGITAL SKILL PASSPORT (`/student/skill-passport`)

**Features:**
- Visual passport-style UI (like a real passport but digital)
- Skill stamps: Each verified skill = a stamp with level (Beginner/Intermediate/Expert)
- Skill verification methods:
  - Resume mention
  - Platform test passed
  - GitHub project analysis
  - Certification upload
  - Challenge result
- Skill authenticity score per skill
- Downloadable PDF version of Skill Passport
- QR code to share publicly
- Skill timeline: When each skill was added/verified
- Endorsements from mentors

---

### 6. 🔍 AI SKILL GAP ANALYZER (`/student/skill-gap`)

**Features:**
- Select target internship domain / company
- AI shows: "You need 4 more skills for AI Engineer roles"
- Side-by-side comparison: Your Skills vs Required Skills
- Priority gap ranking (Critical / Moderate / Optional)
- Time to close each gap (estimated hours)
- Direct learning path with "Start Learning" buttons
- Gap closure progress tracker
- Match score improvement predictor: "Close these 3 gaps → match score goes from 62% to 89%"

---

### 7. 🤖 INTELLIGENT INTERNSHIP RECOMMENDATION ENGINE (`/student/matches`)

**Features:**
- AI-ranked internship cards sorted by compatibility score
- Each card shows:
  - Company name, logo, location
  - Role title
  - Compatibility Score (e.g., 94%)
  - Skill match breakdown (pie chart)
  - Stipend range
  - Duration
  - Application deadline
- Filter panel: Domain | Location | Duration | Stipend | Remote/Onsite
- Explainable AI: Click "Why This Match?" → detailed AI reasoning
  - "Your Python skills match 95% of requirements"
  - "Your ML project aligns with company's core domain"
  - "Location preference matches Chennai office"
- Save / Apply / Pass actions
- Internship Success Probability: "83% chance of success based on your profile"
- Fit Risk Alert: "Warning: Missing Docker skill may affect performance"
- Internship Impact Score: Shows learning value rating

---

### 8. 🧠 AI SKILL LEARNING HUB (`/student/learning-hub`)

**Navigation tabs:**
- My Learning Plan
- Courses
- Practice Lab
- Micro-Modules
- Challenges
- Certifications

#### 8a. Personalized AI Learning Recommendations
- AI-generated learning plan based on skill gaps
- Career goal selector: AI Engineer | Data Scientist | Web Developer | DevOps | Cybersecurity | etc.
- Suggested learning path with timeline:
  ```
  Week 1-2: Python Fundamentals
  Week 3-4: Statistics & Linear Algebra
  Week 5-8: Machine Learning Basics
  Week 9-12: Deep Learning Projects
  ```
- Progress percentage per topic

#### 8b. Integrated Course Providers
- Course cards from: Coursera | edX | Udemy | NPTEL | Kaggle | YouTube
- Each card shows: Provider logo, Duration, Reward Points, Skill unlocked
- Filter by: Free/Paid, Duration, Provider, Skill level
- Track completion status (via webhook/manual mark)

#### 8c. AI Practice Lab
- In-browser coding environment (Monaco Editor / CodeSandbox embed)
- Labs available:
  - Python Coding Lab
  - Machine Learning Model Lab
  - Data Analysis Lab
  - Web Development Lab
  - SQL Query Lab
  - Data Structures Lab
- AI auto-evaluates: code quality, accuracy, efficiency, time complexity
- Points awarded on completion

#### 8d. Micro-Skill Modules
- 15-60 minute focused skill bites
- Example: "SQL for Data Analysis — 45 min → +15 points"
- Progress bar + quiz at end
- Certificate on completion

#### 8e. Skill Challenges (Gamified)
- Weekly/Monthly challenges
- Examples:
  - "Build a Movie Recommendation System" — Medium — +100 pts
  - "Optimize this SQL query" — Easy — +30 pts
  - "Deploy a Flask API on Heroku" — Hard — +200 pts
- Timer + submission portal
- Auto-evaluation by AI
- Leaderboard per challenge

#### 8f. AI Learning Coach (Chatbot)
- Floating chat widget
- Answers questions: "How do I learn ML?", "What's next after Python?"
- Step-by-step guidance
- Suggests resources contextually
- Powered by Claude/GPT API

#### 8g. Project-Based Learning
- Guided projects with starter code
- Reviewed by AI + mentor
- Increases internship match score on completion

#### 8h. Skill Progress Tracker
- Visual dashboard: Spider/radar chart of all skills
- Progress bars per skill
- Weekly improvement %
- Compare with peers (anonymized)

#### 8i. Internship Preparation Track
- Dedicated section:
  - Resume Optimization module
  - Mock Interview (AI interviewer)
  - Technical Assessment prep
  - Communication Skills module
  - Group Discussion simulator

#### 8j. AI Skill Certification
- On completing course + passing assessment → verified badge issued
- Badge appears on Skill Passport
- Shareable link for LinkedIn/resume
- QR-verified certificates

#### 8k. AI Skill Accelerator (National Program)
- When platform detects national skill shortage (e.g., Cybersecurity)
- Platform launches bootcamp-style accelerator
- Students get notified
- Fast-tracked to relevant internships on completion

---

### 9. 🧬 TALENT DNA MODEL (`/student/talent-dna`)

**Features:**
- Beyond skills: evaluates deeper attributes
- 8 DNA dimensions visualized as hexagonal radar:
  - Analytical Thinking
  - Creativity
  - Leadership Potential
  - Adaptability
  - Communication
  - Collaboration
  - Problem Solving
  - Innovation Index
- How it's calculated: from projects, challenges, peer reviews, mentor ratings, activity patterns
- Companies can filter candidates by DNA attributes
- Hidden Skill Discovery: AI detects abilities from clubs, competitions, research (scraped from profile)

---

### 10. 🗺 CAREER PATHWAY PLANNER (`/student/career-path`)

**Features:**
- Goal setter: "I want to become a ___"
- AI generates internship sequence roadmap:
  ```
  Year 2 Sem 1 → Data Analysis Internship (Entry)
  Year 2 Sem 2 → ML Research Internship
  Year 3 Sem 1 → AI Product Internship (Mid)
  Year 3 Sem 2 → Full-Stack AI Engineer Internship
  ```
- Timeline visualization (Gantt-style)
- AI Talent Time Machine: "In 2 years, with this path, your skill score = 92/100"
- Career Risk Analyzer: "Note: Data Science roles may saturate by 2027. Consider MLOps specialization"
- Industry Trend Intelligence: Live job demand charts
- Cross-Skill Discovery: "Your ECE + Python combo opens Embedded AI roles"
- Talent Opportunity Forecast: 5-year career opportunity graph

---

### 11. 🏆 REWARDS & GAMIFICATION (`/student/rewards`)

**Points System:**
| Action | Points |
|--------|--------|
| New User Registration | +10 |
| Complete Profile | +20 |
| Upload Resume | +20 |
| Add New Skill | +10 |
| Complete Course | +50 |
| Upload Certification | +50 |
| Apply for Internship | +10 |
| Selected for Internship | +100 |
| Complete Internship | +200 |
| Win Skill Challenge | +200 |
| Complete Micro-Module | +15 |
| Mentor Session Attended | +25 |
| AI Lab Completed | +30 |

**Reward Store:**
- Merchandise (T-shirts, bags, mugs)
- Amazon/Flipkart vouchers
- Premium course coupons
- LinkedIn Premium trial
- Internship Priority Badge (jump queue)
- Physical certificate printing

**Achievement Badges:**
- "First Internship" | "Skill Warrior" | "Top 10 National" | "Mentor's Pick" | "Innovation Star"

**Leaderboard:**
- All-India | State | College | Branch filters
- Weekly / Monthly / All-time tabs
- Top 3 highlighted with gold/silver/bronze UI

---

### 12. 🧑‍🏫 AI MENTOR MATCHING (`/student/mentors`)

**Features:**
- Browse mentor profiles: Industry | Domain | Experience
- AI auto-suggests best mentor matches based on:
  - Career goal alignment
  - Skill domain match
  - Availability
- Book 1:1 sessions (Google Calendar integration)
- Chat with mentor (in-app messaging)
- Mentor rates student: feeds into Talent DNA
- Session notes auto-saved

---

### 13. ⚔️ SKILL BATTLE ARENA (`/student/arena`)

**Features:**
- Live coding battles (1v1 or team)
- Problem categories: DSA | ML | Web | SQL | System Design
- Companies observe top performers (recruitment funnel)
- Weekly arena tournament
- Skill rating (ELO-based, like chess)
- Past battle history
- Prize pool for top monthly winners

---

### 14. 🏗 INTERNSHIP SIMULATION LAB (`/student/simulation`)

**Features:**
- Simulated industry projects from partner companies
- Complete real-world tasks: "Build a churn prediction model for Flipkart dataset"
- Time-boxed (1-3 days per simulation)
- AI evaluation + mentor review
- Feeds directly into Skill Passport and match score
- Companies can view simulation results as hiring signal

---

### 15. 🌍 GLOBAL INTERNSHIP BRIDGE (`/student/global`)

**Features:**
- Remote international internship listings
- Filters: Country | Remote | Research | Startup | MNC
- Language requirement filter
- Timezone compatibility checker
- Application support: AI-tailored cover letter generator for international roles
- Visa information links

---

## 🏢 COMPANY PORTAL

### 16. Company Dashboard (`/company/dashboard`)
- Posted internships overview
- Applications received count
- AI match score histogram
- Seat utilization rate
- Candidate pipeline funnel chart

### 17. Post Internship (`/company/post`)
- Rich form: Role, Skills required, Stipend, Duration, Location, Mode
- AI auto-tags required skills from JD text
- Preview candidate volume estimate before posting
- Save as draft / publish

### 18. AI-Ranked Candidates (`/company/candidates`)
- Ranked list with compatibility scores
- Filter by: Score | Skills | College | CGPA | Location | DNA attributes
- One-click shortlist / reject
- View Skill Passport
- AI explains why each candidate is ranked
- Bulk download shortlist as CSV/PDF
- Interview scheduler integration

### 19. Team Builder (`/company/team-builder`)
- Input project requirements
- AI forms a balanced team from applicant pool
- Shows complementary skill matrix
- One-click invite team for group internship

### 20. Internship Analytics (`/company/analytics`)
- Past internship performance data
- Skill match accuracy post-intern
- Satisfaction scores from both sides
- Benchmark vs industry averages
- Internship Impact Score for your company

### 21. AI Opportunity Creator
- AI suggests: "Based on 2,300 students with React + Node.js skills in Chennai, consider adding a Full-Stack role"
- One-click create from suggestion

---

## 🏛 GOVERNMENT / ADMIN PORTAL

### 22. National Talent Intelligence Dashboard (`/admin/dashboard`)
- Live stats: Total students | Active internships | Seats filled | Fairness index
- Geographic heatmap: Internship density across India
- Skill shortage radar: Which skills are lacking nationally?
- Industry demand vs student supply chart

### 23. National Talent Intelligence Graph (`/admin/talent-graph`)
- Interactive D3.js force-directed network graph
- Nodes: Students | Skills | Companies | Internships | Industries
- Click any node to explore connections
- Filter by region, industry, skill domain

### 24. Fairness & Bias Monitoring (`/admin/fairness`)
- Real-time fairness scores:
  - Gender bias index
  - Regional equity index
  - Institution type equity (IIT vs state college)
- Bias alert: Red flag if allocation diverges beyond threshold
- Monthly fairness audit report
- IBM AI Fairness 360 integration

### 25. Skill Shortage Radar (`/admin/skill-radar`)
- National map + bar chart of skill gaps
- Trending: "Cybersecurity demand up 340% YoY, supply insufficient"
- Direct action: Launch national skill accelerator program from this dashboard
- Export data for NASSCOM / ministry reports

### 26. National Talent Mobility Predictor (`/admin/talent-mobility`)
- Predicts where skilled talent will migrate (city/industry)
- Brain drain risk alerts for Tier-2 cities
- Opportunity gap detector: Regions with talent but no internships

### 27. AI Workforce Policy Simulator (`/admin/policy-simulator`)
- Simulate scenarios: "What if we add 10,000 more IT internship seats in Tamil Nadu?"
- Impact visualization on employment, skill spread, regional equity
- Policy recommendation engine

### 28. Internship Ecosystem Health Score (`/admin/ecosystem`)
- Composite score (0-100) from:
  - Seat utilization rate
  - Fairness index
  - Skill match accuracy
  - Student satisfaction
  - Company satisfaction
  - Dynamic reallocation efficiency

### 29. Internship Fraud Detection (`/admin/fraud`)
- AI flags suspicious internships: fake companies, zero-learning internships
- Risk score per internship posting
- Auto-remove below threshold
- Manual review queue

---

## 🔧 CORE AI ENGINES (Backend Detail)

### AI Engine 1: Resume Parser
```python
# Pipeline:
# PDF/DOCX → Text Extraction → NLP (spaCy NER) → BERT embeddings
# → Skill entity recognition → Structured JSON output
Skills extracted: ["Python", "TensorFlow", "BERT", "FastAPI"]
Confidence scores: {Python: 0.97, TensorFlow: 0.88}
```

### AI Engine 2: Skill Matcher (Cosine Similarity)
```python
# Student skill vector vs Internship requirement vector
# TF-IDF + BERT sentence embeddings
# Cosine similarity score → Match percentage
match_score = cosine_similarity(student_vec, internship_vec)
```

### AI Engine 3: Multi-Objective Optimization
```python
# Google OR-Tools Linear Programming
# Maximize: Σ(match_score × preference_weight)
# Subject to: seat constraints, fairness constraints, location constraints
# Hungarian Algorithm for assignment problem
from ortools.linear_solver import pywraplp
```

### AI Engine 4: Fairness Engine
```python
# IBM AI Fairness 360
# Monitor: disparate impact, equalized odds
# Reweighing + Calibrated Equal Odds post-processing
from aif360.algorithms.preprocessing import Reweighing
```

### AI Engine 5: Dynamic Reallocation
```python
# Event-driven: on rejection/withdrawal
# Trigger: re-run optimization with updated constraints
# Next-best candidate auto-notified within 2 minutes
```

---

## 🔔 CROSS-CUTTING FEATURES

### Real-time Notifications
- WebSocket-based live notifications
- Types: New match found | Application status | Challenge result | Points earned | Mentor message
- Email + SMS + In-app

### AI Chatbot Assistant (Platform-wide)
- Floating chat bubble on all pages
- Knows platform context
- Can navigate user to features
- Answers questions about internships, skills, platform

### Dark / Light Mode Toggle
- System preference detected
- Smooth theme transition

### Mobile App (PWA)
- Progressive Web App
- Offline resume viewing
- Push notifications
- App-like experience on mobile

### Document Verification System
- Certifications uploaded → AI + admin verified
- Green verified tick on Skill Passport
- QR code verification for external parties

### AI-Powered Notifications
- Smart: Only relevant, not spammy
- Examples: "3 new internships matching your profile" | "Your skill gap for 5 companies closed today"

---

## 📊 KEY METRICS & KPIs (shown on dashboards)

- Match Accuracy: % of interns satisfied with role alignment
- Seat Utilization: % of internship slots filled
- Skill Gap Closure Rate: Average time to close a gap
- Fairness Score: Composite equity index
- Platform Engagement: DAU/MAU
- Internship Completion Rate
- Post-Internship Employment Rate

---

## 🧩 ADDITIONAL INNOVATIVE FEATURES

1. **Peer Networking** — Connect with students in same domain / same internship company
2. **Alumni Network** — Past interns' success stories + mentorship offers
3. **Interview Scheduler** — Integrated calendar for company-student interviews with auto-reminders
4. **Video Profile** — 60-second intro video for students (AI auto-transcribes skills mentioned)
5. **Company Culture Fit Analyzer** — AI scores student personality vs company culture (Glassdoor data + survey)
6. **Job Market Trend Heatmap** — Live heatmap of in-demand skills by city/industry
7. **AI Innovation Detector** — Tags highly innovative projects → auto-submitted to government innovation programs
8. **Internship Experience Predictor** — "This internship has a 91% learning value score based on past intern reviews"
9. **AI Talent Clustering Engine** — Groups similar students into talent pools so companies can recruit batches
10. **Global Talent Benchmark** — Compare your skill score vs national average, top 10%, global

---

## 🚀 DEPLOYMENT

```yaml
# docker-compose.yml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
  backend:
    build: ./backend
    ports: ["8000:8000"]
  postgres:
    image: postgres:15
  redis:
    image: redis:7
  nginx:
    image: nginx:alpine
```

- CI/CD: GitHub Actions
- Hosting: AWS EC2 (backend) + Vercel/S3+CloudFront (frontend)
- SSL: Let's Encrypt
- Monitoring: AWS CloudWatch + Sentry

---

## 📝 DEMO FLOW (for hackathon presentation)

1. Student signs up → profile completion wizard
2. Uploads resume → AI parses → Skill Passport generated
3. AI shows top 5 internship matches with scores + explanations
4. Student sees skill gap → starts micro-course → earns points
5. Student completes challenge → appears on leaderboard
6. Company logs in → sees AI-ranked candidates → one-click shortlist
7. Admin logs in → national dashboard → fairness score → skill shortage radar
8. Dynamic reallocation demo: one student rejects → system auto-reallocates in real-time

---

*Built for EFOS Hackathon | Black Squad | Domain: Open Innovation*
