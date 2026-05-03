import { motion } from 'framer-motion';
import { Globe, Users, Building2, Target, TrendingUp, Activity, Shield, BarChart3, AlertTriangle, IndianRupee, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, FunnelChart, Funnel, LabelList, Cell } from 'recharts';
import { nationalStats } from '@/data/mockData';

const demandSupply = [
  { industry: 'IT/Software', demand: 45000, supply: 38000 },
  { industry: 'Finance', demand: 18000, supply: 12000 },
  { industry: 'Healthcare', demand: 12000, supply: 5000 },
  { industry: 'Manufacturing', demand: 8000, supply: 6500 },
  { industry: 'EdTech', demand: 15000, supply: 11000 },
  { industry: 'E-commerce', demand: 22000, supply: 16000 },
];

const monthlyTrend = [
  { month: 'Oct', students: 180000, internships: 6200 },
  { month: 'Nov', students: 210000, internships: 7100 },
  { month: 'Dec', students: 245000, internships: 8000 },
  { month: 'Jan', students: 268000, internships: 8800 },
  { month: 'Feb', students: 290000, internships: 9500 },
  { month: 'Mar', students: 312000, internships: 10284 },
];

/* ── PM Internship Scheme Research Data ── */

// "Vanishing Pipeline" — the dropout funnel from research
const pipelineFunnel = [
  { stage: 'Applied', value: 165000, fill: '#3B82F6' },
  { stage: 'Shortlisted', value: 52600, fill: '#8B5CF6' },
  { stage: 'Matched', value: 16000, fill: '#F59E0B' },
  { stage: 'Completed', value: 9400, fill: '#10B981' },
  { stage: 'Dropped Out', value: 6600, fill: '#EF4444' },
];

// State-level completion rates (research-backed)
const stateCompletion = [
  { state: 'Karnataka', completion: 78, interns: 4200 },
  { state: 'Maharashtra', completion: 72, interns: 3800 },
  { state: 'Delhi NCR', completion: 68, interns: 3200 },
  { state: 'Tamil Nadu', completion: 75, interns: 2900 },
  { state: 'Telangana', completion: 71, interns: 2100 },
  { state: 'UP', completion: 55, interns: 1800 },
  { state: 'Gujarat', completion: 65, interns: 1500 },
  { state: 'Rajasthan', completion: 52, interns: 1200 },
];

function formatNum(n: number) {
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return n.toString();
}

export default function AdminDashboard() {
  // Budget Gap calculation from research
  const budgetRequired = 10831; // ₹10,831 Cr (at ₹9K/mo for 12 months × 1.65L interns)
  const budgetAllocated = 73.72; // ₹73.72 Cr (FY25 allocation)
  const budgetGapPercent = ((1 - budgetAllocated / budgetRequired) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Globe size={24} className="text-amber-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">National Talent Intelligence</h1>
            <p className="text-sm text-gray-400">PM Internship Scheme — Government Dashboard</p>
          </div>
        </div>
      </motion.div>

      {/* National Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: formatNum(nationalStats.totalStudents), icon: Users, color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20' },
          { label: 'Active Internships', value: formatNum(nationalStats.activeInternships), icon: Building2, color: 'text-green-400', bg: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20' },
          { label: 'Match Accuracy', value: nationalStats.matchAccuracy + '%', icon: Target, color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20' },
          { label: 'Fairness Index', value: nationalStats.fairnessScore + '%', icon: Shield, color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-card p-5 border ${stat.border}`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Additional stats row */}
      <div className="grid lg:grid-cols-4 gap-4">
        {[
          { label: 'Seats Filled', value: formatNum(nationalStats.seatsFilled), color: 'text-cyan-400' },
          { label: 'Companies', value: formatNum(nationalStats.companiesRegistered), color: 'text-pink-400' },
          { label: 'Industries', value: nationalStats.industries + '+', color: 'text-orange-400' },
          { label: 'Ecosystem Health', value: nationalStats.ecosystemHealth + '/100', color: 'text-green-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3">
            <Activity size={14} className={s.color} />
            <div>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══ PM INTERNSHIP SCHEME: VANISHING PIPELINE + BUDGET GAP ═══ */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vanishing Pipeline Funnel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6 border border-red-500/10">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <ArrowDownRight size={16} className="text-red-400" />
            Vanishing Pipeline — Dropout Funnel
          </h3>
          <p className="text-[10px] text-gray-500 mb-4">Research: 1.65L applicants → only 9.4K complete (41% dropout rate)</p>
          <div className="space-y-2">
            {pipelineFunnel.map((item, i) => {
              const maxWidth = pipelineFunnel[0].value;
              const widthPct = Math.max(15, (item.value / maxWidth) * 100);
              return (
                <motion.div key={item.stage} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">{item.stage}</span>
                    <span className="text-xs font-bold" style={{ color: item.fill }}>{formatNum(item.value)}</span>
                  </div>
                  <div className="w-full h-6 rounded-lg bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-lg flex items-center pl-2"
                      style={{ backgroundColor: item.fill + '33', borderLeft: `3px solid ${item.fill}`, width: `${widthPct}%` }}
                      initial={{ width: 0 }} animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    >
                      <span className="text-[9px] font-bold" style={{ color: item.fill }}>
                        {((item.value / pipelineFunnel[0].value) * 100).toFixed(1)}%
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Budget Gap Visualizer */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 border border-amber-500/10">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <IndianRupee size={16} className="text-amber-400" />
            Budget Gap Analysis
          </h3>
          <p className="text-[10px] text-gray-500 mb-4">Estimated vs Actual — PM Internship Scheme FY25</p>

          <div className="flex items-end gap-6 mb-6">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Required (₹9K/mo × 12mo × 1.65L)</p>
              <p className="text-3xl font-bold text-red-400">₹{budgetRequired.toLocaleString()} Cr</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 mb-1">GAP</p>
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <span className="text-xs font-bold text-red-400">{budgetGapPercent}%</span>
              </div>
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Allocated FY25</p>
              <p className="text-3xl font-bold text-green-400">₹{budgetAllocated} Cr</p>
            </div>
          </div>

          {/* Visual bar */}
          <div className="w-full h-4 rounded-full bg-white/5 relative overflow-hidden mb-3">
            <div className="absolute inset-0 h-full bg-gradient-to-r from-red-500/30 to-red-500/5 rounded-full" />
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
              style={{ width: '0.68%' }}
              initial={{ width: 0 }} animate={{ width: '3%' }}
              transition={{ duration: 1.5 }}
            />
          </div>
          <p className="text-[10px] text-gray-500 text-center">Only 0.68% of the required budget is allocated — driving ₹5,000 flat stipend</p>

          {/* Impact stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-sm font-bold text-amber-400">₹5,000</p>
              <p className="text-[9px] text-gray-500">Flat Stipend/mo</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-red-400">41%</p>
              <p className="text-[9px] text-gray-500">Dropout Rate</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-blue-400">₹9-12K</p>
              <p className="text-[9px] text-gray-500">Proposed Metro-Adj</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ STATE COMPLETION + EXISTING CHARTS ═══ */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* State-Level Completion Rates */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            State Completion Rates
          </h3>
          <div className="space-y-2.5">
            {stateCompletion.map((s, i) => (
              <div key={s.state} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-20 flex-shrink-0">{s.state}</span>
                <div className="flex-1 h-5 rounded-full bg-white/5 overflow-hidden relative">
                  <motion.div
                    className={`h-full rounded-full ${s.completion >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : s.completion >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}
                    initial={{ width: 0 }} animate={{ width: `${s.completion}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                  />
                </div>
                <span className={`text-xs font-bold w-10 text-right ${s.completion >= 70 ? 'text-green-400' : s.completion >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{s.completion}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Growth Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            Platform Growth
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="stuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="students" stroke="#3B82F6" fill="url(#stuGrad)" strokeWidth={2} name="Students" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Industry Demand vs Supply */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-purple-400" />
          Industry Demand vs Supply
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={demandSupply}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="industry" tick={{ fill: '#9CA3AF', fontSize: 9 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="demand" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Demand" />
            <Bar dataKey="supply" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Supply" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
