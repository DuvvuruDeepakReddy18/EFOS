// src/lib/mlEngine.ts
// Frontend client for Supabase Edge Function ML Engine

const SUPABASE_URL = 'https://irqtxxeymkamuwketglk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycXR4eGV5bWthbXV3a2V0Z2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Mzg4MTQsImV4cCI6MjA4OTMxNDgxNH0.UXBpl8kTALL294gOdWUjp40I4gyvbc71dUp2ZvOlMWQ';

const EDGE = `${SUPABASE_URL}/functions/v1/ml-engine`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

export interface MLCandidate {
  student_id: string;
  student_name?: string;
  college?: string;
  cgpa: number;
  skills_count: number;
  projects_count: number;
  gender: number;        // 0 or 1
  state_tier: number;    // 1, 2, or 3
  skill_match_pct: number;
}

export interface MLRankedResult {
  student_id: string;
  student_name: string;
  college: string;
  allocation_score: number;
  dropout_risk: 'Low' | 'Medium' | 'High';
  role_fit: 'Perfect Fit' | 'Overqualified' | 'Underqualified';
  skill_match_pct: number;
  cgpa: number;
}

export interface FairnessResult {
  overall_fairness: number;
  gender_score: number;
  regional_score: number;
  institution_score: number;
  is_balanced: boolean;
  female_ratio: number;
  tier2_3_pct: number;
  college_distribution: { name: string; value: number }[];
  region_distribution: { name: string; value: number }[];
}

const JOIN_PREDICTOR = `${SUPABASE_URL}/functions/v1/join-predictor`;

// ─── Join Predictor types ───────────────────────────────────
export interface JoinStudentInput {
  id: string;
  location: string;
  skill_match_pct: number;
  cgpa: number;
  other_applications: number;
  student_year: number;
  preferred_domain: boolean;
}

export interface JoinInternshipInput {
  location: string;
  mode: 'Remote' | 'Hybrid' | 'On-site' | 'Onsite';
  stipend: number;
  duration_weeks: number;
  company_tier: number;       // 1 = top, 2 = mid, 3 = small
}

export interface JoinPrediction {
  join_probability: number;   // 0-100
  risk_tier: 'Low' | 'Medium' | 'High';
  will_likely_join: boolean;
  deadline_hours: number;
  reasons: string[];
  breakdown?: {
    location_risk: number;
    stipend_ratio: number;
    mode: string;
    skill_match: string;
  };
}

export interface BatchJoinResult {
  results: (JoinPrediction & { student_id: string })[];
  seat_buffer_recommendation: number;
  seats_requested: number;
  high_risk_count: number;
  low_risk_count: number;
  summary: string;
}

// ─── Join Predictor API ─────────────────────────────────────
export const joinPredictor = {
  /** Get join probability for a single student × internship pair */
  predict: async (student: JoinStudentInput, internship: JoinInternshipInput): Promise<JoinPrediction> => {
    const res = await fetch(JOIN_PREDICTOR, {
      method: 'POST',
      headers,
      body: JSON.stringify({ student, internship }),
    });
    return res.json();
  },

  /** Batch-predict join probabilities for multiple candidates */
  batchPredict: async (
    candidates: { student: JoinStudentInput }[],
    internship: JoinInternshipInput,
    seats: number
  ): Promise<BatchJoinResult> => {
    const res = await fetch(JOIN_PREDICTOR, {
      method: 'POST',
      headers,
      body: JSON.stringify({ candidates, internship, seats }),
    });
    return res.json();
  },
};

export const mlEngine = {
  /** Rank candidates using the ML allocation model */
  rankCandidates: async (candidates: MLCandidate[]): Promise<{ ranked_candidates: MLRankedResult[] }> => {
    const res = await fetch(`${EDGE}/ml-match`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ candidates }),
    });
    return res.json();
  },

  /** Compute fairness analytics from current allocations */
  getFairnessScore: async (allocations: any[]): Promise<FairnessResult> => {
    const res = await fetch(`${EDGE}/fairness`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ allocations }),
    });
    return res.json();
  },

  /** Reallocate a seat after a student rejection/dropout */
  reallocateSeat: async (
    candidates: MLCandidate[],
    rejected_student_id: string
  ): Promise<{ reallocated_to: string; allocation_score: number; message: string }> => {
    const res = await fetch(`${EDGE}/reallocate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ candidates, rejected_student_id }),
    });
    return res.json();
  },
};
