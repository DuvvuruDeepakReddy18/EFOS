import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// CORS headers
function getCorsHeaders(req: Request) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}

// Math helpers
function compute_gini_coefficient(values: number[]): number {
  if (!values || values.length === 0) return 0.0;
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum === 0) return 0.0;
  
  const n = values.length;
  const mean = sum / n;
  if (mean === 0) return 0.0;
  
  let diff_sum = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      diff_sum += Math.abs(values[i] - values[j]);
    }
  }
  
  const gini = diff_sum / (2 * n * n * mean);
  return Math.min(1.0, gini);
}

Deno.serve(async (req) => {
  const CORS = getCorsHeaders(req);

  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    const body = await req.json().catch(() => ({}));

    // /ml-match endpoint
    if (path === "ml-match") {
      const { candidates } = body;
      
      const results = (candidates || []).map((c: any) => {
        const match = c.skill_match_pct || 0;
        
        // Opportunity Score formula from main.py: (0.5 * skill) + (0.3 * afford) + (0.2 * role)
        // using defaults for afford (80) and role (80) since they aren't provided by frontend
        const allocation_score = Math.min(100, Math.round(0.5 * match + 0.3 * 80 + 0.2 * 80));
        
        // Dropout Risk from main.py
        let risk = "Low";
        if (match < 30) risk = "High";
        else if (match < 50) risk = "Medium";
        
        // Role mismatch from main.py
        let role_fit = "Perfect Fit";
        if (match > 70 && c.skills_count > 5) role_fit = "Overqualified";
        else if (match < 40) role_fit = "Underqualified";

        return {
          student_id: c.student_id,
          student_name: c.student_name,
          college: c.college,
          allocation_score,
          dropout_risk: risk,
          role_fit,
          skill_match_pct: match,
          cgpa: c.cgpa
        };
      });

      results.sort((a: any, b: any) => b.allocation_score - a.allocation_score);

      return new Response(JSON.stringify({ ranked_candidates: results }), { headers: CORS });
    }

    // /fairness endpoint
    if (path === "fairness") {
      const { allocations } = body;
      
      const college_dist: Record<string, number> = {};
      const region_dist: Record<string, number> = {};
      let males = 0;
      let females = 0;
      let tier2_3 = 0;
      
      for (const a of (allocations || [])) {
        if (a.college) {
          college_dist[a.college] = (college_dist[a.college] || 0) + 1;
        }
        const region = `Tier ${a.state_tier || 1}`;
        region_dist[region] = (region_dist[region] || 0) + 1;
        
        if (a.gender === 1) females++;
        else males++;
        
        if (a.state_tier > 1) tier2_3++;
      }

      const college_values = Object.values(college_dist);
      const region_values = Object.values(region_dist);
      
      const college_gini = compute_gini_coefficient(college_values);
      const region_gini = compute_gini_coefficient(region_values);
      
      const overall_gini = college_values.length ? (college_gini + region_gini) / 2 : 0;
      let fairness_score = Math.round((1 - overall_gini) * 100);

      const total = allocations.length || 1;
      const female_ratio = Math.round((females / total) * 100);
      const tier2_3_pct = Math.round((tier2_3 / total) * 100);
      
      const is_balanced = fairness_score >= 70 && female_ratio >= 30;

      return new Response(JSON.stringify({
        overall_fairness: fairness_score,
        gender_score: female_ratio > 40 ? 100 : female_ratio * 2,
        regional_score: tier2_3_pct > 50 ? 100 : tier2_3_pct * 1.5,
        institution_score: Math.round((1 - college_gini) * 100),
        is_balanced,
        female_ratio,
        tier2_3_pct,
        college_distribution: Object.entries(college_dist).map(([name, value]) => ({ name, value })),
        region_distribution: Object.entries(region_dist).map(([name, value]) => ({ name, value }))
      }), { headers: CORS });
    }

    // /reallocate endpoint
    if (path === "reallocate") {
      const { candidates, rejected_student_id } = body;
      
      // Find the next best candidate
      let bestCandidate = null;
      let bestScore = -1;
      
      for (const c of (candidates || [])) {
        if (c.student_id !== rejected_student_id) {
          const match = c.skill_match_pct || 0;
          const score = Math.round(0.5 * match + 0.3 * 80 + 0.2 * 80);
          if (score > bestScore) {
            bestScore = score;
            bestCandidate = c;
          }
        }
      }
      
      if (bestCandidate) {
        return new Response(JSON.stringify({
          reallocated_to: bestCandidate.student_id,
          allocation_score: bestScore,
          message: `Slot freed. Reallocated to ${bestCandidate.student_name} with score ${bestScore}.`
        }), { headers: CORS });
      } else {
        return new Response(JSON.stringify({
          reallocated_to: null,
          allocation_score: 0,
          message: `Slot freed, but no available candidates found.`
        }), { headers: CORS });
      }
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), { status: 404, headers: CORS });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: CORS }
    );
  }
});
