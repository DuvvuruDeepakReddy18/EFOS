from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from collections import defaultdict
import math
import threading
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="InternMatch AI Engine — PM Internship Scheme")

# Restrict CORS to known frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://intern-match-ai.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# --- MODELS ---

class Student(BaseModel):
    id: str
    skills: List[str]
    college: str
    region: str
    expected_stipend: float
    cost_of_living: float

class Internship(BaseModel):
    id: str
    required_skills: List[str]
    stipend: float
    duration: int  # months
    role: str
    max_slots: int = 1

class MatchRequest(BaseModel):
    student: Student
    internship: Internship

class BatchMatchRequest(BaseModel):
    students: List[Student]
    internships: List[Internship]

class AllocationData(BaseModel):
    internships: List[Internship]

# Thread-safe in-memory DB for MVP
_db_lock = threading.Lock()
DB = {
    "students": {},
    "internships": {},
    "allocations": []  # list of dicts {"student_id":, "internship_id":, "score":}
}

# --- SKILL SYNONYM MAP for fuzzy matching ---
SKILL_SYNONYMS = {
    "react": ["react", "react.js", "reactjs", "react js"],
    "node": ["node", "node.js", "nodejs", "node js"],
    "python": ["python", "python3", "py"],
    "javascript": ["javascript", "js", "ecmascript"],
    "typescript": ["typescript", "ts"],
    "machine learning": ["machine learning", "ml", "machine-learning"],
    "deep learning": ["deep learning", "dl", "deep-learning"],
    "artificial intelligence": ["artificial intelligence", "ai"],
    "natural language processing": ["natural language processing", "nlp"],
    "computer vision": ["computer vision", "cv", "opencv"],
    "sql": ["sql", "mysql", "postgresql", "postgres", "sqlite"],
    "mongodb": ["mongodb", "mongo"],
    "docker": ["docker", "containerization", "containers"],
    "kubernetes": ["kubernetes", "k8s"],
    "aws": ["aws", "amazon web services", "cloud"],
    "c++": ["c++", "cpp", "c plus plus"],
    "data science": ["data science", "data-science", "ds"],
    "html": ["html", "html5"],
    "css": ["css", "css3", "scss", "sass"],
    "java": ["java", "j2ee"],
    "spring": ["spring", "spring boot", "springboot"],
    "fastapi": ["fastapi", "fast api", "fast-api"],
    "flask": ["flask"],
    "django": ["django"],
    "tensorflow": ["tensorflow", "tf"],
    "pytorch": ["pytorch", "torch"],
    "pandas": ["pandas", "pd"],
    "git": ["git", "github", "version control", "gitlab", "bitbucket"],
    "go": ["go", "golang"],
    "c#": ["c#", "c sharp", "csharp", ".net", "dotnet"],
    "ruby": ["ruby", "ruby on rails", "rails"],
    "php": ["php", "laravel", "codeigniter"],
    "vue": ["vue", "vuejs", "vue.js"],
    "angular": ["angular", "angularjs", "angular.js"],
    "kotlin": ["kotlin", "android"],
    "swift": ["swift", "ios", "objective-c"],
    "r": ["r", "r programming"],
    "rust": ["rust", "rustlang"],
    "scala": ["scala"],
    "hadoop": ["hadoop", "big data", "spark", "apache spark"],
    "figma": ["figma", "ui/ux", "ui design", "ux design", "adobe xd"],
    "excel": ["excel", "ms excel", "microsoft excel"],
    "power bi": ["power bi", "powerbi"],
    "tableau": ["tableau"],
    "cybersecurity": ["cybersecurity", "cyber security", "ethical hacking", "penetration testing", "infosec"],
    "blockchain": ["blockchain", "web3", "smart contracts", "solidity"],
}

def _normalize_skill(skill: str) -> str:
    """Normalize a skill name to its canonical form."""
    s = skill.lower().strip()
    for canonical, variants in SKILL_SYNONYMS.items():
        if s in variants:
            return canonical
    return s

def compute_cosine_similarity(list_a: List[str], list_b: List[str]) -> float:
    """Fuzzy-aware cosine similarity using normalized skill names."""
    set_a = set(_normalize_skill(s) for s in list_a)
    set_b = set(_normalize_skill(s) for s in list_b)
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a.intersection(set_b))
    return (intersection / math.sqrt(len(set_a) * len(set_b))) * 100

def compute_role_relevance(student_skills: List[str], role: str) -> float:
    """Dynamically compute role relevance instead of hardcoding 80.0."""
    role_keywords = {
        "ai": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "data science"],
        "ml": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "data science"],
        "data": ["python", "sql", "pandas", "data science", "machine learning", "tableau", "power bi", "hadoop", "r", "scala", "excel"],
        "web": ["react", "javascript", "html", "css", "node", "typescript", "angular", "vue", "php", "ruby", "c#", "go"],
        "frontend": ["react", "javascript", "html", "css", "typescript", "angular", "vue", "figma"],
        "backend": ["python", "java", "node", "fastapi", "django", "flask", "spring", "sql", "go", "ruby", "php", "c#", "rust"],
        "fullstack": ["react", "javascript", "node", "python", "sql", "docker", "html", "css", "typescript", "java", "c#"],
        "devops": ["docker", "kubernetes", "aws", "linux", "git", "ci/cd", "terraform", "bash"],
        "cloud": ["aws", "docker", "kubernetes", "linux", "terraform"],
        "embedded": ["c++", "arduino", "python", "iot", "embedded c", "rtos", "rust"],
        "cybersecurity": ["linux", "python", "networking", "security", "cybersecurity"],
        "mobile": ["flutter", "react", "kotlin", "swift", "java", "android", "ios"],
    }

    role_lower = role.lower()
    matched_keywords = []
    for key, keywords in role_keywords.items():
        if key in role_lower:
            matched_keywords.extend(keywords)

    if not matched_keywords:
        return 60.0  # Neutral fallback for unknown roles

    norm_student = set(_normalize_skill(s) for s in student_skills)
    norm_role = set(_normalize_skill(s) for s in matched_keywords)
    overlap = len(norm_student.intersection(norm_role))
    if not norm_role:
        return 60.0
    return min(100.0, (overlap / len(norm_role)) * 100)


def compute_opportunity_score(student: Student, internship: Internship) -> dict:
    match_score = compute_cosine_similarity(student.skills, internship.required_skills)

    # Affordability — PM Internship Scheme metro-adjusted logic
    if internship.stipend >= student.cost_of_living:
        affordability_normalized = 100.0
    else:
        if student.cost_of_living == 0:
            affordability_normalized = 100.0
        else:
            affordability_normalized = (internship.stipend / student.cost_of_living) * 100

    # Dynamic role relevance (replaces hardcoded 80.0)
    role_relevance = compute_role_relevance(student.skills, internship.role)

    raw_score = (0.5 * match_score) + (0.3 * affordability_normalized) + (0.2 * role_relevance)
    final_score = max(0, min(100, raw_score))

    return {
        "opportunity_score": round(final_score, 2),
        "match_score": round(match_score, 2),
        "affordability_normalized": round(affordability_normalized, 2),
        "role_relevance": round(role_relevance, 2)
    }


def compute_dropout_risk(duration: int, stipend: float, cost: float, match_score: float) -> str:
    """PM Internship Scheme dropout risk engine — based on real research:
    - Duration > 6mo = high dropout (12-month PM scheme had 41% dropout)
    - Stipend < cost of living = financial pressure
    - Low match score = interest mismatch (root cause #3)
    """
    risk_score = 0
    if duration > 6:
        risk_score += 2  # PM scheme data shows 12-month duration is #2 root cause
    elif duration > 3:
        risk_score += 1
    if stipend < cost * 0.8:
        risk_score += 2  # ₹5,000 flat stipend vs metro living cost
    elif stipend < cost:
        risk_score += 1
    if match_score < 30:
        risk_score += 2  # Interest mismatch = root cause #3
    elif match_score < 50:
        risk_score += 1

    if risk_score >= 4:
        return "High"
    elif risk_score >= 2:
        return "Medium"
    else:
        return "Low"


def compute_role_mismatch(student_skills: List[str], required_skills: List[str], match_score: float) -> str:
    student_count = len(student_skills)
    req_count = len(required_skills)

    if match_score > 70 and student_count > req_count + 2:
        return "Overqualified"
    elif match_score < 40:
        return "Underqualified"
    else:
        return "Perfect Fit"


def compute_gini_coefficient(values: List[int]) -> float:
    """Compute Gini coefficient for allocation equity measurement.
    Formula: G = (Σ|xi - xj|) / (2 * n² * mean)
    Fairness Score = 1 - G (higher = more equitable)
    """
    if not values or sum(values) == 0:
        return 0.0
    n = len(values)
    mean = sum(values) / n
    if mean == 0:
        return 0.0
    diff_sum = sum(abs(values[i] - values[j]) for i in range(n) for j in range(n))
    gini = diff_sum / (2 * n * n * mean)
    return round(min(1.0, gini), 4)


# --- ENDPOINTS ---

@app.post("/match")
def match_engine(req: BatchMatchRequest):
    results = []

    with _db_lock:
        for s in req.students:
            DB["students"][s.id] = s
        for i in req.internships:
            DB["internships"][i.id] = i

    for student in req.students:
        for internship in req.internships:
            score_data = compute_opportunity_score(student, internship)
            risk = compute_dropout_risk(internship.duration, internship.stipend, student.cost_of_living, score_data["match_score"])
            mismatch = compute_role_mismatch(student.skills, internship.required_skills, score_data["match_score"])

            results.append({
                "student_id": student.id,
                "internship_id": internship.id,
                "opportunity_score": score_data["opportunity_score"],
                "match_score": score_data["match_score"],
                "risk_level": risk,
                "role_mismatch": mismatch,
                "role_relevance": score_data["role_relevance"],
            })

    results.sort(key=lambda x: x["opportunity_score"], reverse=True)
    return {"matches": results}


@app.post("/allocate")
def allocate(student_id: str, internship_id: str):
    with _db_lock:
        existing = [a for a in DB["allocations"] if a["student_id"] == student_id and a["internship_id"] == internship_id]
        if existing:
            return {"status": "Already allocated"}

        internship = DB["internships"].get(internship_id)
        if not internship:
            raise HTTPException(status_code=404, detail="Internship not found")

        current_slots = len([a for a in DB["allocations"] if a["internship_id"] == internship_id])
        if current_slots >= internship.max_slots:
            raise HTTPException(status_code=400, detail="Internship slots full")

        DB["allocations"].append({"student_id": student_id, "internship_id": internship_id})
    return {"status": "success", "message": f"Allocated student {student_id} to internship {internship_id}"}


@app.post("/reallocate")
def reallocate(student_id: str, internship_id: str):
    with _db_lock:
        original_len = len(DB["allocations"])
        DB["allocations"] = [a for a in DB["allocations"] if not (a["student_id"] == student_id and a["internship_id"] == internship_id)]

        if len(DB["allocations"]) == original_len:
            raise HTTPException(status_code=404, detail="Allocation not found")

        internship = DB["internships"].get(internship_id)
        assigned_students = [a["student_id"] for a in DB["allocations"]]

        best_student = None
        best_score = -1

        for s_id, student in DB["students"].items():
            if s_id not in assigned_students:
                score_data = compute_opportunity_score(student, internship)
                if score_data["opportunity_score"] > best_score:
                    best_score = score_data["opportunity_score"]
                    best_student = s_id

        if best_student:
            DB["allocations"].append({"student_id": best_student, "internship_id": internship_id})
            return {
                "status": "success",
                "message": f"Freed slot from {student_id}. Reallocated {internship_id} to {best_student} with score {best_score:.2f}."
            }
        else:
            return {
                "status": "partial",
                "message": f"Slot freed, but no available candidates found."
            }


@app.get("/fairness")
def fairness_monitor():
    college_dist = defaultdict(int)
    region_dist = defaultdict(int)

    with _db_lock:
        for allocation in DB["allocations"]:
            s_id = allocation["student_id"]
            student = DB["students"].get(s_id)
            if student:
                college_dist[student.college] += 1
                region_dist[student.region] += 1

    # Format for Recharts
    college_data = [{"name": c, "value": v} for c, v in college_dist.items()]
    region_data = [{"name": r, "value": v} for r, v in region_dist.items()]

    # Gini Coefficient for allocation equity
    college_values = list(college_dist.values()) if college_dist else []
    region_values = list(region_dist.values()) if region_dist else []

    college_gini = compute_gini_coefficient(college_values)
    region_gini = compute_gini_coefficient(region_values)
    overall_gini = round((college_gini + region_gini) / 2, 4) if college_values else 0.0
    fairness_score = round(1 - overall_gini, 4)

    # Dominance check — no single college should have > 40% of allocations
    is_balanced = True
    if college_dist:
        max_college = max(college_dist.values())
        total = sum(college_dist.values())
        if max_college / total > 0.4 and total > 5:
            is_balanced = False

    return {
        "college_distribution": college_data,
        "region_distribution": region_data,
        "is_balanced": is_balanced,
        "gini_coefficient": overall_gini,
        "fairness_score": fairness_score,
        "college_gini": college_gini,
        "region_gini": region_gini,
    }
