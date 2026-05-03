import numpy as np
import pandas as pd
import m2cgen as m2c
import warnings
warnings.filterwarnings("ignore")

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

np.random.seed(42)

CITY_DATA = {
    "Mumbai":     (0.90, "west"),
    "Pune":       (0.70, "west"),
    "Ahmedabad":  (0.50, "west"),
    "Bangalore":  (0.80, "south"),
    "Chennai":    (0.55, "south"),
    "Hyderabad":  (0.65, "south"),
    "Kochi":      (0.50, "south"),
    "Delhi":      (0.75, "north"),
    "Noida":      (0.70, "north"),
    "Gurgaon":    (0.80, "north"),
    "Jaipur":     (0.45, "north"),
    "Chandigarh": (0.55, "north"),
    "Kolkata":    (0.55, "east"),
    "Indore":     (0.40, "central"),
    "Nagpur":     (0.40, "central"),
    "Tier3":      (0.30, "other"),
}

CITIES    = list(CITY_DATA.keys())
COL_INDEX = {c: CITY_DATA[c][0] for c in CITIES}
REGION    = {c: CITY_DATA[c][1] for c in CITIES}
BASE_COST = 30000

def get_location_risk(student_city: str, intern_city: str, mode: int) -> float:
    if mode == 0: return 0.0
    if student_city == intern_city: return 0.0

    s_region = REGION.get(student_city, "other")
    i_region = REGION.get(intern_city,  "other")

    if s_region == i_region: return 0.3

    NEIGHBORS = {
        "south":   ["south"],
        "north":   ["north", "central"],
        "west":    ["west",  "central"],
        "east":    ["east"],
        "central": ["north", "west", "central"],
    }
    if i_region in NEIGHBORS.get(s_region, []): return 0.6
    return 1.0

def get_stipend_adequacy(stipend: float, intern_city: str) -> float:
    monthly_cost = COL_INDEX.get(intern_city, 0.55) * BASE_COST
    return float(np.clip(stipend / monthly_cost, 0.0, 3.0))

def build_feature_vector(
    student_city: str, intern_city: str, mode: int, stipend: float,
    skill_match_pct: float, cgpa: float, other_apps: int,
    duration_weeks: int, company_tier: int, student_year: int,
    preferred_domain: int
) -> list:
    return [
        get_location_risk(student_city, intern_city, mode),
        get_stipend_adequacy(stipend, intern_city),
        mode / 2.0,
        skill_match_pct / 100.0,
        cgpa / 10.0,
        min(other_apps / 20.0, 1.0),
        duration_weeks / 26.0,
        (company_tier - 1) / 2.0,
        (student_year  - 1) / 3.0,
        float(preferred_domain),
    ]

N = 2000
rows = []
for _ in range(N):
    student_city = np.random.choice(CITIES)
    intern_city  = np.random.choice(CITIES)
    mode         = np.random.choice([0, 1, 2], p=[0.30, 0.35, 0.35])
    stipend      = np.random.choice([
        np.random.uniform(5000, 15000),
        np.random.uniform(15000, 30000),
        np.random.uniform(30000, 50000),
        np.random.uniform(50000, 90000),
    ])
    skill_match_pct = np.random.beta(5, 3) * 100
    cgpa            = np.random.uniform(5.5, 9.8)
    other_apps      = np.random.randint(1, 18)
    duration_weeks  = np.random.choice([4, 6, 8, 10, 12, 16, 20, 24])
    company_tier    = np.random.choice([1, 2, 3], p=[0.20, 0.45, 0.35])
    student_year    = np.random.choice([1, 2, 3, 4], p=[0.10, 0.35, 0.40, 0.15])
    preferred_domain= np.random.choice([0, 1], p=[0.35, 0.65])

    fv = build_feature_vector(
        student_city, intern_city, mode, stipend,
        skill_match_pct, cgpa, other_apps, duration_weeks,
        company_tier, student_year, preferred_domain
    )

    loc_risk   = fv[0]
    stip_ratio = fv[1]

    p = 0.72
    if   loc_risk == 0.0: p += 0.10
    elif loc_risk == 0.3: p += 0.02
    elif loc_risk == 0.6: p -= 0.12
    elif loc_risk == 1.0: p -= 0.28

    if   stip_ratio < 0.4: p -= 0.30
    elif stip_ratio < 0.7: p -= 0.18
    elif stip_ratio < 1.0: p -= 0.05
    elif stip_ratio >= 2.0: p += 0.18
    elif stip_ratio >= 1.5: p += 0.12

    if   mode == 0: p += 0.15
    elif mode == 1: p += 0.05

    if   skill_match_pct > 85: p += 0.10
    elif skill_match_pct > 65: p += 0.04
    elif skill_match_pct < 40: p -= 0.12
    elif skill_match_pct < 55: p -= 0.06

    if   cgpa >= 8.5: p += 0.07
    elif cgpa >= 7.5: p += 0.03
    elif cgpa  < 6.0: p -= 0.08

    if   other_apps > 12: p -= 0.15
    elif other_apps >  8: p -= 0.08
    elif other_apps <= 3: p += 0.06

    if   company_tier == 1: p += 0.20
    elif company_tier == 3: p -= 0.05

    if   student_year == 4: p += 0.08
    elif student_year == 1: p -= 0.06

    if preferred_domain == 1: p += 0.08

    if loc_risk >= 0.6 and stip_ratio < 0.7:
        p -= 0.15

    p_final = float(np.clip(p + np.random.normal(0, 0.07), 0.02, 0.98))
    label   = int(np.random.random() < p_final)

    rows.append({
        "f0_location_risk": fv[0], "f1_stipend_ratio": fv[1],
        "f2_mode": fv[2],          "f3_skill_match": fv[3],
        "f4_cgpa": fv[4],          "f5_other_apps": fv[5],
        "f6_duration": fv[6],      "f7_company_tier": fv[7],
        "f8_student_year": fv[8],  "f9_preferred_domain": fv[9],
        "joined": label
    })

df = pd.DataFrame(rows)

FEATURE_COLS = [
    "f0_location_risk", "f1_stipend_ratio", "f2_mode",
    "f3_skill_match",   "f4_cgpa",          "f5_other_apps",
    "f6_duration",      "f7_company_tier",  "f8_student_year",
    "f9_preferred_domain",
]

X = df[FEATURE_COLS].values
y = df["joined"].values

model = RandomForestClassifier(
    n_estimators=15,
    max_depth=5,
    min_samples_leaf=30,
    random_state=42,
    n_jobs=-1,
)
model.fit(X, y)

js_model = m2c.export_to_javascript(model, function_name="predictJoinScore")

edge_function_code = '''import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ================================================================
// AUTO-GENERATED by m2cgen from Google Colab
// ================================================================
''' + js_model + '''
// ================================================================

const CITY_COL: Record<string, number> = {
  "Mumbai": 0.90, "Pune": 0.70, "Ahmedabad": 0.50,
  "Bangalore": 0.80, "Chennai": 0.55, "Hyderabad": 0.65, "Kochi": 0.50,
  "Delhi": 0.75, "Noida": 0.70, "Gurgaon": 0.80,
  "Jaipur": 0.45, "Chandigarh": 0.55,
  "Kolkata": 0.55, "Indore": 0.40, "Nagpur": 0.40, "Tier3": 0.30,
};

const CITY_REGION: Record<string, string> = {
  "Mumbai":"west",  "Pune":"west",      "Ahmedabad":"west",
  "Bangalore":"south","Chennai":"south","Hyderabad":"south","Kochi":"south",
  "Delhi":"north",  "Noida":"north",    "Gurgaon":"north",
  "Jaipur":"north", "Chandigarh":"north",
  "Kolkata":"east",
  "Indore":"central","Nagpur":"central",
};

const NEIGHBORS: Record<string, string[]> = {
  south:   ["south"],
  north:   ["north","central"],
  west:    ["west","central"],
  east:    ["east"],
  central: ["north","west","central"],
};

function getLocationRisk(sCity: string, iCity: string, mode: number): number {
  if (mode === 0 || sCity === iCity) return 0.0;
  const sr = CITY_REGION[sCity] ?? "other";
  const ir = CITY_REGION[iCity] ?? "other";
  if (sr === ir) return 0.3;
  if ((NEIGHBORS[sr] ?? []).includes(ir)) return 0.6;
  return 1.0;
}

function buildFeatures(s: any, i: any): number[] {
  const mode = i.mode === "Remote" ? 0 : i.mode === "Hybrid" ? 1 : 2;
  const col  = (CITY_COL[i.location] ?? 0.55) * 30000;
  return [
    getLocationRisk(s.location, i.location, mode),       // [0]
    Math.min(3.0, (i.stipend || 0) / col),               // [1]
    mode / 2.0,                                          // [2]
    Math.min(1.0, (s.skill_match_pct ?? 70)  / 100),     // [3]
    Math.min(1.0, (s.cgpa              ?? 7.5) / 10),    // [4]
    Math.min(1.0, (s.other_applications ?? 3)  / 20),    // [5]
    Math.min(1.0, (i.duration_weeks    ?? 12)  / 26),    // [6]
    ((i.company_tier  ?? 2) - 1) / 2.0,                  // [7]
    ((s.student_year  ?? 3) - 1) / 3.0,                  // [8]
    s.preferred_domain ? 1.0 : 0.0,                      // [9]
  ];
}

function getReasons(features: number[], s: any, i: any): string[] {
  const r: string[] = [];
  const risk = features[0];
  const stip = features[1];
  if (risk >= 1.0)   r.push(`Requires relocation from ${s.location} to ${i.location}`);
  if (risk === 0.3)  r.push(`Same region — manageable distance ${s.location} → ${i.location}`);
  if (risk === 0.0 && i.mode !== "Remote") r.push(`Local student — no relocation needed`);
  if (i.mode === "Remote") r.push("Remote internship — zero relocation risk");
  if (stip < 0.5)    r.push(`⚠️ Stipend ₹${i.stipend?.toLocaleString()} may not cover ${i.location} living costs`);
  if (stip < 0.7 && risk >= 0.6) r.push("⚠️ High relocation cost + low stipend — strong dropout signal");
  if (stip >= 1.5)   r.push(`Stipend ₹${i.stipend?.toLocaleString()} is generous for ${i.location}`);
  if (i.company_tier === 1) r.push("Top-tier company — student highly motivated to join");
  if ((s.other_applications ?? 0) > 10) r.push("Student has many competing applications");
  if (s.preferred_domain) r.push("Internship matches student's preferred domain");
  return r;
}

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const body = await req.json();

  // ── BATCH MODE ────────────────────────────────────────────────
  if (body.candidates) {
    const results = body.candidates.map((c: any) => {
      const s        = c.student;
      const intern   = c.internship ?? body.internship;
      const features = buildFeatures(s, intern);
      const raw      = predictJoinScore(features);
      const prob     = Math.round((Array.isArray(raw) ? raw[1] : raw) * 100);
      const risk     = prob >= 70 ? "Low" : prob >= 45 ? "Medium" : "High";
      return {
        student_id:       s.id,
        join_probability: prob,
        risk_tier:        risk,
        will_likely_join: prob >= 60,
        deadline_hours:   prob >= 65 ? 72 : 24,
        reasons:          getReasons(features, s, intern),
      };
    });

    const seats        = body.seats ?? 5;
    const highRiskCount = results.filter((r: any) => r.join_probability < 50).length;
    const bufferCount   = Math.min(seats + highRiskCount, results.length);

    return new Response(JSON.stringify({
      results,
      seat_buffer_recommendation: bufferCount,
      seats_requested:  seats,
      high_risk_count:  highRiskCount,
      low_risk_count:   results.filter((r: any) => r.risk_tier === "Low").length,
      summary: `Select ${bufferCount} students for ${seats} seats (${highRiskCount} high-risk buffer)`,
    }), { headers: CORS });
  }

  // ── SINGLE MODE ───────────────────────────────────────────────
  const { student: s, internship: i } = body;
  const features = buildFeatures(s, i);
  const raw      = predictJoinScore(features);
  const prob     = Math.round((Array.isArray(raw) ? raw[1] : raw) * 100);
  const risk     = prob >= 70 ? "Low" : prob >= 45 ? "Medium" : "High";

  return new Response(JSON.stringify({
    join_probability: prob,
    risk_tier:        risk,
    will_likely_join: prob >= 60,
    deadline_hours:   prob >= 65 ? 72 : 24,
    reasons:          getReasons(features, s, i),
    breakdown: {
      location_risk:  features[0],
      stipend_ratio:  Math.round(features[1] * 100) / 100,
      mode:           i.mode,
      skill_match:    `${Math.round(features[3] * 100)}%`,
    },
  }), { headers: CORS });
});
'''

with open("join_predictor_edge_function.ts", "w", encoding="utf-8") as f:
    f.write(edge_function_code)

print("Export Done")
