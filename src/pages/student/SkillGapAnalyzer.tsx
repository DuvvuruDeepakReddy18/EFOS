import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Clock, Zap, Upload, Target } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

export default function SkillGapAnalyzer() {
  const { isAnalyzed, result, getSkillGaps, getYourSkills } = useResumeStore();
  const navigate = useNavigate();

  if (!isAnalyzed || !result) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <Search size={24} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-white">AI Skill Gap Analyzer</h1>
          </div>
          <p className="text-sm text-gray-400">Identify missing skills and get personalized upskilling recommendations</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Resume Analysis Required</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">Analyze your resume first to compute skill gaps.</p>
          <button onClick={() => navigate('/student/resume')} className="glow-btn text-sm flex items-center gap-2 mx-auto">
            <Upload size={14} /> Go to Resume Upload
          </button>
        </motion.div>
      </div>
    );
  }

  const gaps = getSkillGaps();
  const yourSkills = getYourSkills();
  const allRequired = [...new Set([...yourSkills, ...gaps.map(g => g.skill)])];
  const currentScore = result.current_match_score;
  const potentialScore = result.potential_match_score;
  const targetRoles = result.target_roles || [];

  const gapColor = (p: string) =>
    p === 'Critical' ? 'text-red-400 bg-red-500/10 border-red-500/20'
    : p === 'Moderate' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-blue-400 bg-blue-500/10 border-blue-500/20';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Search size={24} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white">AI Skill Gap Analyzer</h1>
        </div>
        <p className="text-sm text-gray-400">Identify missing skills and get personalized upskilling recommendations</p>
      </motion.div>

      {/* Match Score Predictor */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-8 flex-wrap">
          <div>
            <p className="text-sm text-gray-400 mb-1">Current Match ({targetRoles.slice(0,2).join(', ') || 'Target Roles'})</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-amber-400">{currentScore}%</span>
              <ArrowRight size={20} className="text-gray-500" />
              <span className="text-4xl font-bold text-green-400">{potentialScore}%</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              <TrendingUp size={12} className="text-green-400 inline mr-1" />
              Close {gaps.filter(g => g.priority === 'Critical').length} critical gaps to reach <span className="text-green-400 font-medium">{potentialScore}%</span>
            </p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-500 to-green-500 transition-all" style={{ width: `${currentScore}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">Now</span>
              <span className="text-[10px] text-green-400">After Closing Gaps</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Target Roles */}
      {targetRoles.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2"><Target size={14} className="text-blue-400" /><span className="text-xs text-gray-400">Target Roles</span></div>
          <div className="flex flex-wrap gap-2">{targetRoles.map(r => <span key={r} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium">{r}</span>)}</div>
        </motion.div>
      )}

      {/* Skills Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Your Skills ({yourSkills.length})</h3>
          <div className="flex flex-wrap gap-2">{yourSkills.map(s => <span key={s} className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400">✓ {s}</span>)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-400" /> Required Skills ({allRequired.length})</h3>
          <div className="flex flex-wrap gap-2">{allRequired.map(s => {
            const has = yourSkills.includes(s);
            return <span key={s} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${has ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>{has ? '✓' : '✗'} {s}</span>;
          })}</div>
        </motion.div>
      </div>

      {/* Gap Details */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-4">Gap Priority Ranking</h3>
        <div className="space-y-3">
          {gaps.map((gap, i) => (
            <motion.div key={gap.skill} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0"><Zap size={16} className="text-blue-400" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{gap.skill}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${gapColor(gap.priority)}`}>{gap.priority}</span>
                </div>
                {gap.reason && <p className="text-[10px] text-gray-400 mb-1">{gap.reason}</p>}
                <div className="w-full h-1.5 rounded-full bg-white/5 mb-1"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${gap.progress}%` }} /></div>
                <p className="text-[10px] text-gray-400">{gap.progress}% complete</p>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} /><span>{gap.hoursToClose}h</span></div>
                <p className="text-xs font-bold text-green-400 mt-1">+{gap.matchBoost}%</p>
              </div>
              <Link to="/student/learning-hub" className="glow-btn !py-2 !px-4 text-xs block text-center">Start Learning</Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
