import type { Internship } from '@/lib/supabase';
import type { AnalysisResult } from '@/store/resumeStore';

export const calculateMatchScore = (intern: Internship, result: AnalysisResult | null) => {
  const sum = intern.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const baseScore = 60 + (sum % 20); // 60 to 79

  if (!result?.skills || result.skills.length === 0 || !intern.required_skills || intern.required_skills.length === 0) {
    return baseScore; // base score if no skills
  }
  
  const userSkills = result.skills.map(s => s.name.toLowerCase());
  let matchCount = 0;
  
  intern.required_skills.forEach(req => {
    const isMatch = userSkills.some(us => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us));
    if (isMatch) matchCount++;
  });
  
  const percentage = Math.round((matchCount / intern.required_skills.length) * 100);
  
  if (percentage > 0) {
      return Math.min(99, Math.round(baseScore * 0.4 + percentage * 0.6));
  }
  return baseScore;
};
