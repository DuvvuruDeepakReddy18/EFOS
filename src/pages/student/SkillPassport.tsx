import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle2, Download, QrCode, Clock, Award, Upload, AlertCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useResumeStore } from '@/store/resumeStore';
import { useAuthStore } from '@/store/authStore';

const levelColors: Record<string, string> = {
  Expert: 'from-green-500 to-emerald-500',
  Intermediate: 'from-blue-500 to-cyan-500',
  Beginner: 'from-gray-500 to-gray-400',
};

export default function SkillPassport() {
  const { user } = useAuthStore();
  const { isAnalyzed, result, getPassportSkills, getRadarData } = useResumeStore();
  const navigate = useNavigate();

  const skills = getPassportSkills();
  const radarData = getRadarData();

  if (!isAnalyzed || !result) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <Shield size={24} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Digital Skill Passport</h1>
          </div>
          <p className="text-sm text-gray-400">Your AI-verified skill credentials — trusted by 10,000+ companies</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-blue-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">No Resume Analyzed Yet</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Upload and analyze your resume first to populate your Skill Passport with AI-verified credentials.
          </p>
          <button onClick={() => navigate('/student/resume')} className="glow-btn text-sm flex items-center gap-2 mx-auto">
            <Upload size={14} /> Go to Resume Upload
          </button>
        </motion.div>
      </div>
    );
  }

  const verifiedCount = skills.filter(s => s.verified).length;
  const completeness = Math.min(100, Math.round((skills.length / 15) * 100));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Shield size={24} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Digital Skill Passport</h1>
        </div>
        <p className="text-sm text-gray-400">Your AI-verified skill credentials — trusted by 10,000+ companies</p>
      </motion.div>

      {/* Passport Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 uppercase">
            {(result.name && result.name !== 'Unknown' ? result.name : user?.name || 'U').charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-1">
              {result.name && result.name !== 'Unknown' ? result.name : user?.name || 'Student Name'}
            </h2>
            <p className="text-sm text-gray-400">
              {result.education?.degree || user?.department || 'Computer Science'} • {result.education?.institution || user?.institution || 'University'}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <Award size={14} className="text-amber-400" />
                <span className="text-xs text-gray-300">{verifiedCount} Verified Skills</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-400" />
                <span className="text-xs text-gray-300">Just analyzed</span>
              </div>
              {result.education?.cgpa && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-blue-400">CGPA: {result.education.cgpa}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
              <Download size={14} /> PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
              <QrCode size={14} /> Share
            </button>
          </div>
        </div>

        {/* Completeness bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Passport Completeness</span>
            <span className="text-xs font-bold text-blue-400">{completeness}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" style={{ width: `${completeness}%` }} />
          </div>
        </div>
      </motion.div>

      {/* Preferred Domains & Target Roles */}
      {(result.preferred_domains.length > 0 || result.target_roles?.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-4">
          <div className="flex flex-wrap gap-4">
            {result.target_roles?.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider">Target Roles</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.target_roles.map(r => (
                    <span key={r} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">{r}</span>
                  ))}
                </div>
              </div>
            )}
            {result.preferred_domains.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider">Preferred Domains</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.preferred_domains.map(d => (
                    <span key={d} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400">{d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Skill Radar + Skills Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4">Skill Profile Visualization</h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(59,130,246,0.1)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 9 }} />
                <Radar name="Skills" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">No skill data available</div>
          )}
        </motion.div>

        {/* Skill Stamps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4">Skill Stamps <span className="text-xs text-gray-500 font-normal ml-2">{skills.length} skills</span></h3>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            {skills.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * i }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${levelColors[skill.level] || levelColors.Beginner} flex items-center justify-center flex-shrink-0`}>
                  {skill.verified ? <CheckCircle2 size={16} className="text-white" /> : <span className="text-white text-xs font-bold">?</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{skill.name}</p>
                    {skill.verified && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">VERIFIED</span>}
                  </div>
                  <p className="text-[10px] text-gray-400">{skill.category} • {skill.source}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-white">{Math.round(skill.confidence * 100)}%</span>
                  <p className="text-[10px] text-gray-500">{skill.level}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
