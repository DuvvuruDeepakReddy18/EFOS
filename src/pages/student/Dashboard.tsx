import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Shield, Sparkles, Trophy, Target, ArrowUpRight, TrendingUp, Clock, Brain, Building2, UploadCloud } from 'lucide-react';
import { mockInternships, mockRewards } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { isAnalyzed, result } = useResumeStore();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  if (!isAnalyzed || !result) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome to InternMatch, {firstName} 👋</h1>
              <p className="text-sm text-gray-400 mt-1">Let's get your profile set up to find your perfect career path.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">SETUP REQUIRED</span>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10 shadow-lg shadow-black/20">
          <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
            <UploadCloud size={48} className="text-blue-400 relative z-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Upload Your Resume to Begin</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed text-lg">
            Our AI engine needs your resume to generate your personalized skill passport, discover skill gaps, and match you with the perfect roles.
          </p>
          <Link to="/student/resume" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1">
            <Sparkles size={22} />
            Analyze My Resume Now
          </Link>
        </motion.div>
      </div>
    );
  }

  const quickStats = [
    { label: 'AI Match Score', value: `${result.current_match_score || 0}%`, icon: Target, color: 'from-green-500/20 to-green-500/5', textColor: 'text-green-400', border: 'border-green-500/30' },
    { label: 'Verified Skills', value: result.skills?.length || 0, icon: Shield, color: 'from-blue-500/20 to-blue-500/5', textColor: 'text-blue-400', border: 'border-blue-500/30' },
    { label: 'Skill Gaps', value: result.skill_gaps?.length || 0, icon: FileText, color: 'from-purple-500/20 to-purple-500/5', textColor: 'text-purple-400', border: 'border-purple-500/30' },
    { label: 'Target Roles', value: result.target_roles?.length || 0, icon: Trophy, color: 'from-amber-500/20 to-amber-500/5', textColor: 'text-amber-400', border: 'border-amber-500/30' },
  ];

  const topGap = result.skill_gaps?.[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back, {firstName} 👋</h1>
            <p className="text-sm text-gray-400 mt-1">Here's your real-time career journey overview</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <span className="text-xs font-bold text-green-400 tracking-wider uppercase">AI ENGINE ACTIVE</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 border ${stat.border} hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group shadow-lg shadow-black/20`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-white/10 transition-colors pointer-events-none" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-inner`}>
                <stat.icon size={22} className={stat.textColor} />
              </div>
              <ArrowUpRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <p className={`text-3xl font-extrabold ${stat.textColor} relative z-10 font-mono tracking-tight`}>{stat.value}</p>
            <p className="text-sm font-medium text-gray-400 mt-1 relative z-10">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insight Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-6 md:p-8 relative overflow-hidden flex flex-col h-full shadow-lg shadow-black/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <Brain size={20} className="text-blue-400" />
              <h2 className="text-lg font-bold text-white">AI Career Insight</h2>
              <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 tracking-wider uppercase ml-2">Personalized</span>
            </div>
            <div className="space-y-4 flex-grow">
              {topGap ? (
                <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-crosshair">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Sparkles size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-base text-white font-semibold">Your top skill gap is <span className="text-blue-400">{topGap.skill}</span></p>
                    <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{topGap.reason}</p>
                  </div>
                </div>
              ) : (
                <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-crosshair">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Sparkles size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-base text-white font-semibold">Great profile! No critical skill gaps found.</p>
                    <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">Keep updating your resume as you learn new skills to stay ahead.</p>
                  </div>
                </div>
              )}
              
              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-crosshair">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <TrendingUp size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-base text-white font-semibold">Potential Match Score: <span className="text-green-400">{result.potential_match_score || 0}%</span></p>
                  <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">By closing your skill gaps, you can significantly increase your chances of landing your target role.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 glass-card p-6 md:p-8 flex flex-col h-full shadow-lg shadow-black/20"
        >
          <h2 className="text-lg font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3 flex-grow">
            {[
              { label: 'Update Resume', icon: FileText, color: 'bg-blue-500/10 text-blue-400', to: '/student/resume' },
              { label: 'Browse Matches', icon: Sparkles, color: 'bg-purple-500/10 text-purple-400', to: '/student/matches' },
              { label: 'Skill Passport', icon: Shield, color: 'bg-green-500/10 text-green-400', to: '/student/passport' },
              { label: 'Learning Hub', icon: Target, color: 'bg-amber-500/10 text-amber-400', to: '/student/learning-hub' },
            ].map(action => (
              <Link
                key={action.label}
                to={action.to}
                className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                <ArrowUpRight size={16} className="text-gray-600 ml-auto group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row: Top Matches + Recent Activity */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Top AI Matches */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full lg:w-1/2 glass-card p-6 md:p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Top Role Matches</h2>
            <Link to="/student/matches" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">View All</Link>
          </div>
          <div className="space-y-4 flex-grow">
            {mockInternships.slice(0, 3).map((intern) => (
              <div key={intern.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-blue-500/20 transition-all cursor-pointer group shadow-lg shadow-black/20">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">{intern.companyLogo}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors">{intern.title}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5"><Building2 size={12}/> {intern.companyName} <span className="text-gray-600">•</span> {intern.location}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${
                    (intern.matchScore ?? 0) >= 90 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    (intern.matchScore ?? 0) >= 75 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    <span className="text-sm font-bold">{intern.matchScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="w-full lg:w-1/2 glass-card p-6 md:p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            <Link to="/student/rewards" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">View All</Link>
          </div>
          <div className="space-y-4 flex-grow">
            {mockRewards.slice(0, 4).map(reward => (
              <div key={reward.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-transparent hover:bg-white/[0.04] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{reward.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">{reward.description}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock size={12} className="text-gray-500" />
                    <span className="text-[11px] text-gray-500">{reward.createdAt}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">+{reward.points}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Skills Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-6">
        <h2 className="text-base font-bold text-white mb-4">Your Verified Skills</h2>
        {result.skills && result.skills.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {result.skills.slice(0, 5).map((skill, index) => (
              <div key={index} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-sm font-medium text-white mb-1">{skill.name}</p>
                <div className="w-full h-1.5 rounded-full bg-white/5 mb-1">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${(skill.confidence || 0.5) * 100}%` }} />
                </div>
                <p className="text-[10px] text-gray-400">{Math.round((skill.confidence || 0.5) * 100)}% confidence</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No skills detected yet. Update your resume to see them here.</p>
        )}
      </motion.div>
    </div>
  );
}

