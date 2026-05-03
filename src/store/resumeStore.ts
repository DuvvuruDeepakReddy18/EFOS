import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ──────────────────── Types ──────────────────── */

export interface ResumeSkill {
  name: string;
  category: string;
  level: 'Expert' | 'Intermediate' | 'Beginner';
  confidence: number;
}

export interface ResumeProject {
  title: string;
  description: string;
  tech_stack: string[];
  relevance_score: number;
}

export interface ResumeExperience {
  role: string;
  company: string;
  duration: string;
  domain: string;
}

export interface SkillGap {
  skill: string;
  priority: 'Critical' | 'Moderate' | 'Optional';
  hoursToClose: number;
  matchBoost: number;
  reason: string;
  progress: number; // client-side only, default 0
}

export interface RecommendedCourse {
  id: string;
  title: string;
  provider: string;
  skill_name: string;
  url: string;
  duration_hours: number;
  priority: 'Critical' | 'Moderate' | 'Optional';
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface LearningPlanWeek {
  week_range: string;
  topic: string;
  skills_covered: string[];
  goal: string;
  progress: number; // client-side only, default 0
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface TalentDNA {
  analyticalThinking: number;
  creativity: number;
  leadership: number;
  adaptability: number;
  communication: number;
  collaboration: number;
  problemSolving: number;
  innovationIndex: number;
}

export interface AnalysisResult {
  resume_score: number;
  summary: string;
  name: string;
  email: string | null;
  phone: string | null;
  education: { institution: string; degree: string; cgpa: number | null; year: string };
  skills: ResumeSkill[];
  projects: ResumeProject[];
  experience: ResumeExperience[];
  certifications: string[];
  preferred_domains: string[];
  improvement_tips: { text: string; type: string }[];
  talent_dna: TalentDNA;
  skill_gaps: SkillGap[];
  target_roles: string[];
  current_match_score: number;
  potential_match_score: number;
  recommended_courses: RecommendedCourse[];
  learning_plan: LearningPlanWeek[];
}

/* ──────────────────── Store ──────────────────── */

interface ResumeState {
  /** Whether a resume has been analyzed in this session */
  isAnalyzed: boolean;
  /** Full analysis result from the AI */
  result: AnalysisResult | null;

  /** Set analysis result and mark as analyzed */
  setAnalysis: (data: AnalysisResult) => void;
  /** Clear all data */
  clearAnalysis: () => void;

  /* ─── Derived getters ─── */

  /** Skills formatted for Skill Passport display */
  getPassportSkills: () => Array<{
    id: string;
    name: string;
    category: string;
    level: 'Expert' | 'Intermediate' | 'Beginner';
    verified: boolean;
    confidence: number;
    source: string;
  }>;

  /** Radar chart data for Skill Passport (top 8 skills) */
  getRadarData: () => Array<{ skill: string; A: number }>;

  /** Skill gap data for Skill Gap Analyzer */
  getSkillGaps: () => SkillGap[];

  /** Your skills list (for gap comparison) */
  getYourSkills: () => string[];

  /** Required skills for target roles */
  getRequiredSkills: () => string[];

  /** Learning plan for Learning Hub */
  getLearningPlan: () => LearningPlanWeek[];

  /** Recommended courses for Learning Hub */
  getRecommendedCourses: () => RecommendedCourse[];
}



export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
  isAnalyzed: false,
  result: null,

  setAnalysis: (data) => {
    // Hydrate client-side fields with defensive defaults
    const gaps = (data.skill_gaps || []).map((g) => ({
      ...g,
      priority: g.priority || 'Optional',
      hoursToClose: g.hoursToClose || 10,
      matchBoost: g.matchBoost || 5,
      reason: g.reason || '',
      progress: 0,
    }));
    const courses = (data.recommended_courses || []).map((c, i) => ({
      ...c,
      id: `rc-${i}`,
      status: 'Not Started' as const,
    }));
    const plan = (data.learning_plan || []).map((w) => ({
      ...w,
      progress: 0,
      status: 'Not Started' as const,
    }));

    set({
      isAnalyzed: true,
      result: {
        ...data,
        // Defensive defaults for all fields the API might omit
        skills: data.skills || [],
        projects: data.projects || [],
        experience: data.experience || [],
        certifications: data.certifications || [],
        preferred_domains: data.preferred_domains || [],
        improvement_tips: data.improvement_tips || [],
        talent_dna: data.talent_dna || {
          analyticalThinking: 0, creativity: 0, leadership: 0, adaptability: 0,
          communication: 0, collaboration: 0, problemSolving: 0, innovationIndex: 0,
        },
        skill_gaps: gaps,
        target_roles: data.target_roles || [],
        current_match_score: data.current_match_score || 0,
        potential_match_score: data.potential_match_score || 0,
        recommended_courses: courses,
        learning_plan: plan,
      },
    });
  },

  clearAnalysis: () => set({ isAnalyzed: false, result: null }),

  getPassportSkills: () => {
    const r = get().result;
    if (!r) return [];
    return (r.skills || []).map((s, i) => ({
      id: `skill-${i}`,
      name: s.name,
      category: s.category,
      level: s.level,
      verified: s.confidence >= 0.75,
      confidence: s.confidence,
      source: s.confidence >= 0.8 ? 'AI Confidence: High' : 'AI Detected',
    }));
  },

  getRadarData: () => {
    const r = get().result;
    if (!r) return [];
    return r.skills
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8)
      .map((s) => ({
        skill: s.name,
        A: Math.round(s.confidence * 100),
      }));
  },

  getSkillGaps: () => {
    const r = get().result;
    if (!r) return [];
    return r.skill_gaps;
  },

  getYourSkills: () => {
    const r = get().result;
    if (!r) return [];
    return r.skills.map((s) => s.name);
  },

  getRequiredSkills: () => {
    const r = get().result;
    if (!r) return [];
    const yourSkills = new Set(r.skills.map((s) => s.name.toLowerCase()));
    const gapSkills = r.skill_gaps.map((g) => g.skill);
    const combined = [...r.skills.map((s) => s.name), ...gapSkills];
    return [...new Set(combined)];
  },

  getLearningPlan: () => {
    const r = get().result;
    if (!r) return [];
    return r.learning_plan;
  },

  getRecommendedCourses: () => {
    const r = get().result;
    if (!r) return [];
    return r.recommended_courses;
  },
    }),
    {
      name: 'internmatch-resume-analysis',
      version: 1,
    }
  )
);
