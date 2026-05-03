import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Trophy, Award, Clock, Star, Zap, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '@/store/resumeStore';
import { mockChallenges } from '@/data/mockData';

const tabs = ['My Plan', 'Courses', 'Challenges'];

export default function LearningHub() {
  const [activeTab, setActiveTab] = useState('My Plan');
  const navigate = useNavigate();
  const { isAnalyzed, getLearningPlan, getRecommendedCourses } = useResumeStore();

  if (!isAnalyzed) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <BookOpen size={24} className="text-green-400" />
            <h1 className="text-2xl font-bold text-white">AI Skill Learning Hub</h1>
          </div>
          <p className="text-sm text-gray-400">Personalized learning paths to boost your internship match scores</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-green-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Resume Analysis Required</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Your personalized learning hub requires resume analysis. Upload your resume to get AI-tailored course recommendations.
          </p>
          <button onClick={() => navigate('/student/resume')} className="glow-btn text-sm flex items-center gap-2 mx-auto">
            <Upload size={14} /> Go to Resume Upload
          </button>
        </motion.div>
      </div>
    );
  }

  const learningPlan = getLearningPlan();
  const recommendedCourses = getRecommendedCourses();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen size={24} className="text-green-400" />
          <h1 className="text-2xl font-bold text-white">AI Skill Learning Hub</h1>
        </div>
        <p className="text-sm text-gray-400">Personalized learning paths to boost your internship match scores</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                : 'bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white'
            }`}
          >{tab}</button>
        ))}
      </div>

      {/* My Plan Tab */}
      {activeTab === 'My Plan' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-4">AI-Generated Learning Plan</h3>
            <p className="text-sm text-gray-400 mb-6">Personalized path to close your skill gaps</p>
            {learningPlan.length === 0 ? (
              <p className="text-sm text-gray-500">No learning plan required based on your current skills.</p>
            ) : (
              <div className="space-y-4">
                {learningPlan.map((item, i) => {
                  const colors = [
                    'from-blue-500 to-cyan-500',
                    'from-purple-500 to-pink-500',
                    'from-green-500 to-emerald-500',
                    'from-amber-500 to-orange-500'
                  ];
                  const color = colors[i % colors.length];
                  return (
                    <div key={item.week_range} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 text-white text-xs font-bold`}>
                        W{i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{item.topic}</p>
                        <p className="text-[10px] text-gray-400">{item.week_range} • {item.skills_covered.join(', ')}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.goal}</p>
                        <div className="w-full h-1.5 rounded-full bg-white/5 mt-2">
                          <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${item.progress || 0}%` }} />
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>{item.status}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Courses Tab */}
      {activeTab === 'Courses' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCourses.length === 0 ? (
              <div className="col-span-full p-8 text-center text-gray-500">No courses recommended at this time.</div>
            ) : (
              recommendedCourses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card glass-card-hover p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{
                      course.provider.toLowerCase().includes('youtube') ? '📺' :
                      course.provider.toLowerCase().includes('coursera') ? '🎓' :
                      course.provider.toLowerCase().includes('udemy') ? '💻' : '📘'
                    }</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      course.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      course.priority === 'Moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>{course.priority} Priority</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-2" title={course.title}>{course.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{course.provider} • {course.skill_name}</p>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400"><Clock size={12} /><span>{course.duration_hours}h</span></div>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-medium"><Star size={12} /><span>+{Math.round(course.duration_hours * 10)} pts</span></div>
                  </div>
                  <button onClick={() => window.open(course.url, '_blank')} className="w-full mt-4 glow-btn !py-2 text-xs flex items-center justify-center gap-2">
                    <Play size={12} /> Start Learning
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Challenges Tab (Keeping Mock for now since AI doesn't generate challenges yet) */}
      {activeTab === 'Challenges' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="space-y-4">
            {mockChallenges.map((challenge, i) => (
              <motion.div key={challenge.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card glass-card-hover p-5 flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  challenge.difficulty === 'Easy' ? 'bg-green-500/10 border border-green-500/20' :
                  challenge.difficulty === 'Medium' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <Zap size={18} className={challenge.difficulty === 'Easy' ? 'text-green-400' : challenge.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white mb-1">{challenge.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      challenge.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                      challenge.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                    }`}>{challenge.difficulty}</span>
                    <span>{challenge.category}</span>
                    <span>{challenge.participants} joined</span>
                    <span>Deadline: {challenge.deadline}</span>
                  </div>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm mb-2"><Trophy size={14} />+{challenge.rewardPoints}</div>
                  <button className="glow-btn !py-2 !px-4 text-xs">Join Challenge</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
