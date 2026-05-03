import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ExternalLink, Upload, Calendar, Target, TrendingUp, Play, CheckCircle2, Flame, Star, AlertTriangle } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

const priorityOrder = ['Critical', 'Moderate', 'Optional'] as const;
const priorityConfig: Record<string, { color: string; bg: string; border: string; icon: typeof AlertTriangle; label: string }> = {
  Critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle, label: 'Must Learn' },
  Moderate: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Flame, label: 'Should Learn' },
  Optional: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Star, label: 'Nice to Know' },
};

export default function LearningHub() {
  const { isAnalyzed, result, getRecommendedCourses, selectedRole } = useResumeStore();
  const navigate = useNavigate();
  const courses = getRecommendedCourses();
  const learningPlan = result?.learning_plan || [];

  if (!isAnalyzed || !result) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <BookOpen size={24} className="text-green-400" />
            <h1 className="text-2xl font-bold text-white">Learning Hub</h1>
          </div>
          <p className="text-sm text-gray-400">Curated courses and a personalized learning roadmap</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-green-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">No Resume Analyzed Yet</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Upload your resume to get personalized course recommendations and a structured learning plan.
          </p>
          <button onClick={() => navigate('/student/resume')} className="glow-btn text-sm flex items-center gap-2 mx-auto">
            <Upload size={14} /> Go to Resume Upload
          </button>
        </motion.div>
      </div>
    );
  }

  // Group courses by priority
  const groupedCourses: Record<string, typeof courses> = {};
  for (const p of priorityOrder) groupedCourses[p] = [];
  for (const c of courses) {
    const p = c.priority || 'Optional';
    if (!groupedCourses[p]) groupedCourses[p] = [];
    groupedCourses[p].push(c);
  }

  const totalHours = courses.reduce((s, c) => s + (c.duration_hours || 0), 0);
  const completedWeeks = learningPlan.filter(w => w.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen size={24} className="text-green-400" />
          <h1 className="text-2xl font-bold text-white">Learning Hub</h1>
        </div>
        <p className="text-sm text-gray-400">
          Curated courses and a personalized learning roadmap
          {selectedRole && <> for <span className="text-green-400 font-medium">{selectedRole}</span></>}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Learning Hours', value: `${totalHours}h`, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Plan Weeks', value: learningPlan.length, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Completed', value: `${completedWeeks}/${learningPlan.length}`, icon: CheckCircle2, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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

      {/* Learning Plan Timeline */}
      {learningPlan.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-purple-400" /> Personalized Learning Roadmap
          </h3>
          <div className="space-y-3">
            {learningPlan.map((week, i) => {
              const isGap = week.type === 'gap' || !week.type;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex gap-4 group">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      week.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      week.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-white/5 text-gray-500'
                    }`}>
                      {week.status === 'Completed' ? <CheckCircle2 size={14} /> :
                       week.status === 'In Progress' ? <Play size={14} /> :
                       <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    {i < learningPlan.length - 1 && <div className="w-px h-full bg-white/5 mt-1" />}
                  </div>
                  {/* Content */}
                  <div className={`flex-1 p-4 rounded-xl border transition-all ${
                    week.status === 'In Progress' ? 'bg-blue-500/5 border-blue-500/20' :
                    week.status === 'Completed' ? 'bg-green-500/5 border-green-500/20' :
                    'bg-white/[0.02] border-white/5 group-hover:border-white/10'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400">{week.week_range}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isGap ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {isGap ? 'NEW SKILL' : 'LEVEL UP'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white">{week.topic}</p>
                    <p className="text-xs text-gray-400 mt-1">{week.goal}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {(week.skills_covered || []).map(sk => (
                        <span key={sk} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">{sk}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Courses grouped by priority */}
      {priorityOrder.map((priority) => {
        const group = groupedCourses[priority] || [];
        if (group.length === 0) return null;
        const cfg = priorityConfig[priority];
        const Icon = cfg.icon;

        return (
          <motion.div key={priority} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} className={cfg.color} />
              <h3 className="text-base font-bold text-white">{cfg.label}</h3>
              <span className="text-xs text-gray-500 ml-1">({group.length} courses)</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.map((course, i) => (
                <motion.a
                  key={i}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className={`glass-card p-4 hover:border-white/15 transition-all group/card cursor-pointer block`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                      <BookOpen size={16} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white mb-1 group-hover/card:text-blue-400 transition-colors line-clamp-2">{course.title}</p>
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Target size={10} /> {course.skill_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {course.duration_hours}h
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400">{course.provider}</span>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-gray-600 group-hover/card:text-blue-400 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Quick learning stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-green-400" /> Learning Impact Estimate
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{totalHours}h</p>
            <p className="text-[10px] text-gray-500">Total Learning Time</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              +{courses.reduce((s, c) => {
                const gap = (result?.skill_gaps || []).find(g => g.skill.toLowerCase() === (c.skill_name || '').toLowerCase());
                return s + (gap?.matchBoost || 2);
              }, 0)}%
            </p>
            <p className="text-[10px] text-gray-500">Potential Match Boost</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{new Set(courses.map(c => c.skill_name)).size}</p>
            <p className="text-[10px] text-gray-500">Skills Covered</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
