import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { skillShortageData } from '@/data/mockData';

export default function SkillRadar() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <AlertTriangle size={24} className="text-red-400" />
          <h1 className="text-2xl font-bold text-white">National Skill Shortage Radar</h1>
        </div>
        <p className="text-sm text-gray-400">Real-time skill gap monitoring across India — actionable insights for policy</p>
      </motion.div>

      {/* Alert */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-4 flex items-center gap-4 border border-red-500/20">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
          <TrendingUp size={18} className="text-red-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">🚨 Cybersecurity demand up <span className="text-red-400">340% YoY</span> — supply critically insufficient</p>
          <p className="text-xs text-gray-400">Recommend launching national Cybersecurity accelerator program</p>
        </div>
        <button className="glow-btn !py-2 !px-4 text-xs flex-shrink-0 flex items-center gap-1">
          <Zap size={12} /> Launch Accelerator
        </button>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-4">Skill Demand vs Supply Gap</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={skillShortageData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis dataKey="skill" type="category" tick={{ fill: '#9CA3AF', fontSize: 11 }} width={120} />
            <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="demand" fill="#EF4444" radius={[0, 4, 4, 0]} name="Demand" />
            <Bar dataKey="supply" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Supply" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gap ranking */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-4">Gap Severity Ranking</h3>
        <div className="space-y-3">
          {skillShortageData.map((item, i) => (
            <div key={item.skill} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                i < 3 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
              }`}>#{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.skill}</p>
                <div className="w-full h-1.5 rounded-full bg-white/5 mt-1">
                  <div className={`h-full rounded-full ${item.gap >= 60 ? 'bg-red-500' : item.gap >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${item.gap}%` }} />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-bold ${item.gap >= 60 ? 'text-red-400' : 'text-amber-400'}`}>{item.gap}% gap</p>
                <p className="text-[10px] text-gray-400">{item.demand.toLocaleString()} demand / {item.supply.toLocaleString()} supply</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
