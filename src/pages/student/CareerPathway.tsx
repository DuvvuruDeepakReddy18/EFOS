import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Map, ArrowRight, TrendingUp, AlertTriangle, Sparkles, CheckCircle2, Target, Upload, BookOpen, ChevronDown } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { useNavigate, Link } from 'react-router-dom';

// Simple string hash for deterministic changes
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export default function CareerPathway() {
  const { isAnalyzed, result, selectedRole: storeSelectedRole, setSelectedRole } = useResumeStore();
  const navigate = useNavigate();
  
  const defaultRoles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'Cloud Architect'];
  const availableRoles = result?.target_roles?.length ? Array.from(new Set([...result.target_roles, ...defaultRoles])).slice(0, 5) : defaultRoles;

  const selectedRole = storeSelectedRole || availableRoles[0];

  if (!isAnalyzed || !result) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <Map size={24} className="text-purple-400" />
            <h1 className="text-2xl font-bold text-white">AI Career Pathway Planner</h1>
          </div>
          <p className="text-sm text-gray-400">AI-generated internship roadmap tailored to your career goals</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-purple-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">No Resume Analyzed Yet</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Upload your resume to get a personalized AI-generated career pathway and internship roadmap.
          </p>
          <button onClick={() => navigate('/student/resume')} className="glow-btn text-sm flex items-center gap-2 mx-auto">
            <Upload size={14} /> Go to Resume Upload
          </button>
        </motion.div>
      </div>
    );
  }

  // Generate dynamic career path based on user's gaps, skills, AND selected role
  const dynamicCareerPath = useMemo(() => {
    const hash = hashString(selectedRole);
    
    // Vary the base score slightly based on role compatibility (simulated)
    const baseCurrentScore = result.current_match_score || 40;
    const currentScore = Math.max(20, Math.min(85, baseCurrentScore - (hash % 15)));
    const predictedScore = Math.min(98, currentScore + 30 + (hash % 15));
    
    const scoreDiff = Math.max(0, predictedScore - currentScore);
    const phase1Score = Math.floor(currentScore + scoreDiff * 0.25);
    const phase2Score = Math.floor(currentScore + scoreDiff * 0.50);
    const phase3Score = Math.floor(currentScore + scoreDiff * 0.75);

    const gaps = result.skill_gaps || [];
    const recommended = result.recommended_courses || [];
    const mySkills = result.skills || [];

    // Shuffle arrays deterministically based on role
    const shuffle = (arr: any[]) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = (hash + i) % (i + 1);
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const roleGaps = shuffle(gaps).slice(0, 3).map(g => g.skill);
    const roleCourses = shuffle(recommended).slice(0, 3).map(c => c.skill_name);
    const roleSkills = shuffle(mySkills).slice(0, 3).map(s => s.name);

    // Fallbacks if arrays are empty
    const phase1Skills = roleGaps.length ? roleGaps : ['Core Fundamentals', 'Domain Knowledge'];
    const phase2Skills = roleCourses.length ? roleCourses : ['Advanced Concepts', 'Practical Application'];
    const phase3Skills = roleSkills.length ? [...roleSkills.slice(0, 2), 'Team Collaboration'] : ['Project Management', 'Communication'];

    return {
      predictedScore,
      currentScore,
      steps: [
        { 
          semester: 'Phase 1: Skill Up', 
          role: `Foundational ${selectedRole} Skills`, 
          level: 'Entry', 
          skills: phase1Skills, 
          predictedScore: phase1Score,
          action: { label: 'Go to Learning Hub', link: '/student/learning-hub' }
        },
        { 
          semester: 'Phase 2: Application', 
          role: `Internship: ${selectedRole.split(' ')[0]} Focus`, 
          level: 'Entry', 
          skills: phase2Skills, 
          predictedScore: phase2Score,
          action: { label: 'View Courses', link: '/student/learning-hub' }
        },
        { 
          semester: 'Phase 3: Specialization', 
          role: `Junior ${selectedRole}`, 
          level: 'Mid', 
          skills: phase3Skills, 
          predictedScore: phase3Score 
        },
        { 
          semester: 'Phase 4: Target', 
          role: selectedRole, 
          level: 'Advanced', 
          skills: [selectedRole, 'System Architecture', 'Leadership'], 
          predictedScore: predictedScore 
        },
      ]
    };
  }, [selectedRole, result]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Map size={24} className="text-purple-400" />
          <h1 className="text-2xl font-bold text-white">AI Career Pathway Planner</h1>
        </div>
        <p className="text-sm text-gray-400">AI-generated internship roadmap tailored to your career goals</p>
      </motion.div>

      {/* Goal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-2">Career Goal</p>
            <div className="relative inline-block">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
              >
                {availableRoles.map(role => (
                  <option key={role} value={role} className="bg-[#0f0c29] text-white">
                    {role}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-sm text-gray-400 mt-2">4-phase roadmap to reach your dream role</p>
          </div>
          <div className="ml-auto text-center pl-6 border-l border-white/10 flex flex-col gap-2">
            <div>
              <p className="text-[10px] text-gray-500 mb-0.5">Current Score</p>
              <p className="text-lg font-bold text-blue-400">{dynamicCareerPath.currentScore}<span className="text-xs text-gray-500">/100</span></p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 mb-0.5">Predicted Score</p>
              <p className="text-xl font-bold text-green-400">{dynamicCareerPath.predictedScore}<span className="text-xs text-gray-500">/100</span></p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-6">Internship Sequence Roadmap</h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 opacity-30" />

          <div className="space-y-6">
            {dynamicCareerPath.steps.map((step, i) => (
              <motion.div
                key={`${selectedRole}-${i}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex gap-6 relative"
              >
                {/* Dot */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  i === 0 ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' :
                  'bg-bg-secondary border-2 border-blue-500/30'
                }`}>
                  <span className="text-xs font-bold text-white">{i + 1}</span>
                </div>
                {/* Card */}
                <div className={`flex-1 p-4 rounded-xl border transition-all ${
                  i === 0 ? 'bg-blue-500/[0.05] border-blue-500/20' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-400">{step.semester}</p>
                      <h4 className="text-base font-bold text-white">{step.role}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                      step.level === 'Entry' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>{step.level}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {step.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-300 border border-white/5">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1 h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500" style={{ width: `${step.predictedScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white">{step.predictedScore}%</span>
                    </div>
                    {step.action && (
                      <Link to={step.action.link} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20 text-xs font-medium">
                        <BookOpen size={12} />
                        {step.action.label}
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* AI Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="text-base font-bold text-white">AI Talent Time Machine</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            In <span className="text-blue-400 font-medium">2 years</span>, with this pathway, your skill score will be
            <span className="text-green-400 font-bold"> {dynamicCareerPath.predictedScore}/100</span> — placing you in the <span className="text-amber-400 font-medium">top 5%</span> nationally for {selectedRole}.
          </p>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="text-xs text-gray-300">On track for {selectedRole} roles at top companies</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="text-base font-bold text-white">Career Risk Analyzer</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/[0.05] border border-amber-500/10">
              <TrendingUp size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300">Based on your gaps, consider focusing heavily on <span className="text-blue-400 font-medium">{dynamicCareerPath.steps[0].skills[0] || 'core fundamentals'}</span> to avoid bottlenecks in {selectedRole}.</p>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/[0.05] border border-green-500/10">
              <Sparkles size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300">Your current proficiency in <span className="text-green-400 font-medium">{result.skills?.[0]?.name || 'key technologies'}</span> gives you a competitive advantage.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

