import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, AlertTriangle, Clock, Zap, Upload, ArrowUpRight, ShieldCheck, Flame, Star } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

const priorityConfig: Record<string, { color: string; bg: string; border: string; icon: typeof AlertTriangle }> = {
  Critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle },
  Moderate: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Flame },
  Optional: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Star },
};

export default function SkillGapAnalyzer() {
  const { isAnalyzed, result, getSkillGaps, getSkillStrengtheningGaps } = useResumeStore();
  const navigate = useNavigate();

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
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Target size={24} className="text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Skill Gap Analyzer</h1>
        </div>
        <p className="text-sm text-gray-400">Identify gaps in your profile and close them with targeted learning</p>
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

      {/* Match Score Meter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">Role Match Progress</h3>
          <span className="text-xs text-gray-400">
            {result.current_match_score || 0}% → {result.potential_match_score || 0}% potential
          </span>
        </div>
        <div className="relative w-full h-4 rounded-full bg-white/5 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${result.current_match_score || 0}%` }}
            transition={{ duration: 1 }}
            className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          <motion.div initial={{ width: 0 }} animate={{ width: `${result.potential_match_score || 0}%` }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute h-full rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-r-2 border-dashed border-cyan-400/50" />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-blue-400">Current: {result.current_match_score || 0}%</span>
          <span className="text-[10px] text-cyan-400">Potential: {result.potential_match_score || 0}%</span>
        </div>
      </motion.div>

      {/* Gap Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" /> Missing Skills ({gaps.length})
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
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
                      <span className="flex items-center gap-1"><Clock size={10} /> {gap.hoursToClose}h to close</span>
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
            <ShieldCheck size={16} className="text-green-400" /> Level Up Existing Skills ({strengthening.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
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
          <div className="grid md:grid-cols-2 gap-3">
            {challenges.map((ch) => (
              <div key={ch.idx} className="glass-card p-4 hover:border-amber-500/20 transition-all group cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap size={16} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1">{ch.title}</p>
                    <p className="text-xs text-gray-400 mb-2">{ch.description}</p>
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
  );
}
