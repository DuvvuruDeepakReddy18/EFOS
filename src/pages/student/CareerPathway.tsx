import { motion } from 'framer-motion';
import { Map, ArrowRight, TrendingUp, AlertTriangle, Sparkles, CheckCircle2, Target } from 'lucide-react';
import { mockCareerPath } from '@/data/mockData';
import { useResumeStore } from '@/store/resumeStore';

export default function CareerPathway() {
  const result = useResumeStore((state) => state.result);
  const targetRole = result?.target_roles?.[0] || 'Software Engineer';
  const predictedScore = result?.potential_match_score || 92;

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
          <div>
            <p className="text-xs text-gray-400 mb-1">Career Goal</p>
            <h2 className="text-2xl font-bold gradient-text">{targetRole}</h2>
            <p className="text-sm text-gray-400 mt-1">4-semester roadmap to reach your dream role</p>
          </div>
          <div className="ml-auto text-center">
            <Target size={20} className="text-purple-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Predicted Score</p>
            <p className="text-2xl font-bold text-green-400">{predictedScore}<span className="text-sm text-gray-400">/100</span></p>
            <p className="text-[10px] text-gray-500">After completing pathway</p>
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
            {mockCareerPath.map((step, i) => (
              <motion.div
                key={step.semester}
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
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500" style={{ width: `${step.predictedScore}%` }} />
                    </div>
                    <span className="text-xs font-bold text-white">{step.predictedScore}%</span>
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
            <span className="text-green-400 font-bold"> {predictedScore}/100</span> — placing you in the <span className="text-amber-400 font-medium">top 5%</span> nationally.
          </p>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="text-xs text-gray-300">On track for {targetRole} roles at top companies</span>
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
              <p className="text-xs text-gray-300">Data Science roles may saturate by 2028. Consider <span className="text-blue-400 font-medium">MLOps specialization</span> as a differentiator.</p>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/[0.05] border border-green-500/10">
              <Sparkles size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300">Your ECE + Python combo opens unique <span className="text-green-400 font-medium">Embedded AI</span> roles — a growing niche.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
