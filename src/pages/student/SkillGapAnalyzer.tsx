import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, AlertTriangle, Clock, Zap, Upload, ArrowUpRight, ShieldCheck, Flame, Star, ChevronDown, BookOpen, X, CheckCircle2 } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

const priorityConfig: Record<string, { color: string; bg: string; border: string; icon: typeof AlertTriangle }> = {
  Critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle },
  Moderate: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Flame },
  Optional: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Star },
};

export default function SkillGapAnalyzer() {
  const { isAnalyzed, result, getSkillGaps, getSkillStrengtheningGaps, selectedRole: storeRole, setSelectedRole: setStoreRole } = useResumeStore();
  const navigate = useNavigate();

  const selectedRole = storeRole || result?.target_roles?.[0] || 'Software Engineer';
  const setSelectedRole = (role: string) => setStoreRole(role);

  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const gaps = getSkillGaps();
  const strengthening = getSkillStrengtheningGaps();

  if (!isAnalyzed || !result) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <Target size={24} className="text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Skill Gap Analyzer</h1>
          </div>
          <p className="text-sm text-gray-400">Identify gaps in your profile and close them with targeted learning</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-purple-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">No Resume Analyzed Yet</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Upload your resume to get personalized skill gap analysis based on your target roles.
          </p>
          <button onClick={() => navigate('/student/resume')} className="glow-btn text-sm flex items-center gap-2 mx-auto">
            <Upload size={14} /> Go to Resume Upload
          </button>
        </motion.div>
      </div>
    );
  }

  const availableRoles = result.target_roles?.length ? result.target_roles : ['Software Engineer', 'Data Scientist', 'Product Manager'];
  const criticalCount = gaps.filter(g => g.priority === 'Critical').length;
  const totalHours = gaps.reduce((s, g) => s + (g.hoursToClose || 0), 0);
  const avgBoost = gaps.length > 0 ? Math.round(gaps.reduce((s, g) => s + (g.matchBoost || 0), 0) / gaps.length) : 0;

  // Dynamic challenges from top 4 gaps
  const challenges = gaps.slice(0, 4).map((g, i) => ({
    title: `${g.skill} Quick-Start Challenge`,
    description: `Complete a ${g.priority === 'Critical' ? 'hands-on project' : 'mini exercise'} with ${g.skill} in under ${g.hoursToClose || 10} hours`,
    difficulty: g.priority === 'Critical' ? 'Hard' : g.priority === 'Moderate' ? 'Medium' : 'Easy',
    xp: g.priority === 'Critical' ? 500 : g.priority === 'Moderate' ? 300 : 150,
    timeLimit: `${Math.min(g.hoursToClose || 10, 48)}h`,
    skill: g.skill,
    idx: i,
    instructions: `1. Review the core concepts of ${g.skill}.\n2. Create a small project or write a script demonstrating your understanding.\n3. Publish your code to a public repository (e.g., GitHub, CodeSandbox).\n4. Submit the URL below for AI verification.`
  }));

  const recommendedCourses = result.recommended_courses || [];

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl) return;
    
    try {
      new URL(submissionUrl);
      setUrlError('');
    } catch {
      setUrlError('Please enter a valid URL (e.g., https://github.com/...)');
      return;
    }
    
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedChallenge(null);
        setSubmissionUrl('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Target size={24} className="text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Skill Gap Analyzer</h1>
          </div>
          <p className="text-sm text-gray-400">Identify gaps in your profile for your target role</p>
        </div>

        {/* Role Selector */}
        <div className="relative inline-block z-10">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="appearance-none bg-[#0f0c29] border border-white/20 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer shadow-lg"
          >
            {availableRoles.map(role => (
              <option key={role} value={role} className="bg-[#0f0c29] text-white">
                {role}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Gaps', value: gaps.length, icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Critical', value: criticalCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Hours to Close', value: `${totalHours}h`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Avg Match Boost', value: `+${avgBoost}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Gap Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" /> Missing Skills for {selectedRole}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {gaps.map((gap, i) => {
                const cfg = priorityConfig[gap.priority] || priorityConfig.Optional;
                const Icon = cfg.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="glass-card p-4 hover:border-white/10 transition-all group">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={cfg.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-white">{gap.skill}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${cfg.bg} border ${cfg.border} ${cfg.color}`}>
                            {gap.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{gap.reason}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={10} /> {gap.hoursToClose}h</span>
                          <span className="flex items-center gap-1"><TrendingUp size={10} /> +{gap.matchBoost}% match</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-white/5 mt-2">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${gap.progress || 0}%` }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                            className={`h-full rounded-full bg-gradient-to-r ${cfg.color === 'text-red-400' ? 'from-red-500 to-orange-500' : cfg.color === 'text-amber-400' ? 'from-amber-500 to-yellow-500' : 'from-blue-500 to-cyan-500'}`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Skill Strengthening Section */}
          {strengthening.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400" /> Level Up Existing Skills
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {strengthening.map((sg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="glass-card p-4 border-l-2 border-green-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowUpRight size={14} className="text-green-400" />
                      <p className="text-sm font-medium text-white">{sg.skill}</p>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{sg.reason}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={10} /> {sg.hoursToClose}h</span>
                      <span className="flex items-center gap-1"><TrendingUp size={10} /> +{sg.matchBoost}% match</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dynamic Challenges */}
          {challenges.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Zap size={16} className="text-amber-400" /> Skill Challenges
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {challenges.map((ch) => (
                  <div key={ch.idx} onClick={() => setSelectedChallenge(ch)} className="glass-card p-4 hover:border-amber-500/20 transition-all group cursor-pointer hover:-translate-y-1 duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-shadow">
                        <Zap size={16} className="text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{ch.title}</p>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{ch.description}</p>
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className={`px-1.5 py-0.5 rounded-full ${ch.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' : ch.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>
                            {ch.difficulty}
                          </span>
                          <span className="text-amber-400 font-bold">+{ch.xp} XP</span>
                          <span className="text-gray-500 flex items-center gap-1"><Clock size={10} /> {ch.timeLimit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Match Score Meter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <h3 className="text-sm font-bold text-white">Role Match Progress</h3>
              <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg">
                {result.current_match_score || 0}% → {result.potential_match_score || 0}% potential
              </span>
            </div>
            <div className="relative w-full h-4 rounded-full bg-white/5 overflow-hidden shadow-inner mt-4 mb-2">
              <motion.div initial={{ width: 0 }} animate={{ width: `${result.current_match_score || 0}%` }}
                transition={{ duration: 1 }}
                className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
              <motion.div initial={{ width: 0 }} animate={{ width: `${result.potential_match_score || 0}%` }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="absolute h-full rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-r-2 border-dashed border-cyan-400/50" />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-blue-400 font-medium">Current: {result.current_match_score || 0}%</span>
              <span className="text-[10px] text-cyan-400 font-medium">Potential: {result.potential_match_score || 0}%</span>
            </div>
          </motion.div>

          {/* Recommended Courses (Directing to Learning Hub) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none" />
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 relative z-10">
              <BookOpen size={16} className="text-purple-400" /> Recommended Courses
            </h3>
            <div className="space-y-3 mb-4 relative z-10">
              {recommendedCourses.slice(0, 3).map((course, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-pointer group" onClick={() => navigate('/student/learning-hub')}>
                  <p className="text-xs font-bold text-white line-clamp-1 mb-1 group-hover:text-purple-400 transition-colors">{(course as any).course_name || course.title}</p>
                  <p className="text-[10px] text-purple-300">Provider: {course.provider}</p>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/student/learning-hub')} className="relative z-10 w-full py-2.5 rounded-xl bg-purple-600/20 text-purple-400 text-xs font-bold border border-purple-500/30 hover:bg-purple-600/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all flex items-center justify-center gap-2">
              Explore Learning Hub <ArrowUpRight size={14} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Challenge Modal Overlay */}
      <AnimatePresence>
        {selectedChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isSubmitting && setSelectedChallenge(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg overflow-hidden relative z-10 border border-white/10 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-400">
                      {selectedChallenge.skill}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${selectedChallenge.difficulty === 'Hard' ? 'bg-red-500/10 border-red-500/20 text-red-400' : selectedChallenge.difficulty === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                      {selectedChallenge.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedChallenge.title}</h2>
                </div>
                <button 
                  onClick={() => {
                    if (!isSubmitting) {
                      setSelectedChallenge(null);
                      setUrlError('');
                    }
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {submitSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} className="text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Challenge Submitted!</h3>
                    <p className="text-sm text-gray-400">Your submission is being reviewed. XP will be awarded upon verification.</p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-sm text-gray-300 mb-6">{selectedChallenge.description}</p>
                    
                    <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-6">
                      <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Instructions</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        {selectedChallenge.instructions.split('\n').map((step: string, i: number) => (
                          <p key={i} className="flex gap-2">
                            <span className="text-amber-400 opacity-70">•</span> {step}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="glass-card p-3 flex flex-col items-center justify-center">
                        <Clock size={16} className="text-gray-400 mb-1" />
                        <span className="text-xs text-gray-400">Time Limit</span>
                        <span className="text-sm font-bold text-white">{selectedChallenge.timeLimit}</span>
                      </div>
                      <div className="glass-card p-3 flex flex-col items-center justify-center">
                        <Star size={16} className="text-amber-400 mb-1" />
                        <span className="text-xs text-gray-400">Reward</span>
                        <span className="text-sm font-bold text-amber-400">+{selectedChallenge.xp} XP</span>
                      </div>
                    </div>

                    <form onSubmit={handleChallengeSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Submission Link (GitHub, CodeSandbox, etc.)</label>
                        <input
                          type="url"
                          required
                          placeholder="https://"
                          value={submissionUrl}
                          onChange={(e) => {
                            setSubmissionUrl(e.target.value);
                            if (urlError) setUrlError('');
                          }}
                          className={`w-full bg-black/40 border ${urlError ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/50'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all`}
                        />
                        {urlError && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-400 text-xs mt-2 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            {urlError}
                          </motion.p>
                        )}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedChallenge(null);
                            setUrlError('');
                          }}
                          className="flex-1 py-3 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || !submissionUrl}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                <Upload size={16} />
                              </motion.div>
                              Submitting...
                            </>
                          ) : (
                            'Submit Challenge'
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


