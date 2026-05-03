import type { Internship } from '@/lib/supabase';
import type { AnalysisResult } from '@/store/resumeStore';

/**
 * Calculate AI match score between a user's resume and an internship.
 * Factors in: skill overlap, role alignment with selectedRole, and a deterministic base.
 */
export const calculateMatchScore = (
  intern: Internship,
  result: AnalysisResult | null,
  selectedRole?: string | null
) => {
  const sum = intern.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const baseScore = 60 + (sum % 20); // 60 to 79

  if (!result?.skills || result.skills.length === 0 || !intern.required_skills || intern.required_skills.length === 0) {
    return baseScore;
  }
  
  const userSkills = result.skills.map(s => s.name.toLowerCase());
  let matchCount = 0;
  
  intern.required_skills.forEach(req => {
    const isMatch = userSkills.some(us => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us));
    if (isMatch) matchCount++;
  });
  
  const percentage = Math.round((matchCount / intern.required_skills.length) * 100);

  // Role alignment bonus: if the internship title relates to the user's selected career goal
  let roleBonus = 0;
  if (selectedRole) {
    const roleLower = selectedRole.toLowerCase();
    const titleLower = intern.title.toLowerCase();
    const roleWords = roleLower.split(/\s+/);
    const titleWords = titleLower.split(/\s+/);
    
    // Check for word-level overlap between role and title
    const overlap = roleWords.filter(w => w.length > 2 && titleWords.some(tw => tw.includes(w) || w.includes(tw)));
    if (overlap.length > 0) {
      roleBonus = Math.min(10, overlap.length * 5); // up to +10
    }
  }

  if (percentage > 0 || roleBonus > 0) {
    return Math.min(99, Math.round(baseScore * 0.35 + percentage * 0.55 + roleBonus));
  }
  return baseScore;
};
