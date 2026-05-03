import { motion } from 'framer-motion';
import { LayoutDashboard, Users, BarChart3, TrendingUp, ArrowUpRight, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockCompanyInternships } from '@/data/mockData';

const matchDistribution = [
  { range: '90-100', count: 45 },
  { range: '80-89', count: 82 },
  { range: '70-79', count: 120 },
  { range: '60-69', count: 95 },
  { range: '50-59', count: 68 },
  { range: '<50', count: 34 },
];

const pieData = [
  { name: 'Filled', value: 72 },
  { name: 'Open', value: 28 },
];
const COLORS = ['#3B82F6', 'rgba(255,255,255,0.05)'];

export default function CompanyDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Building2 size={24} className="text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
            <p className="text-sm text-gray-400">TechCorp India — IT Industry</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Internships', value: '4', icon: LayoutDashboard, color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-500/5' },
          { label: 'Total Applications', value: '524', icon: Users, color: 'text-green-400', bg: 'from-green-500/20 to-green-500/5' },
          { label: 'Avg Match Score', value: '81%', icon: BarChart3, color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-500/5' },
          { label: 'Seat Utilization', value: '72%', icon: TrendingUp, color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-500/5' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card glass-card-hover p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <ArrowUpRight size={14} className="text-gray-500" />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Match Distribution Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4">AI Match Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={matchDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="range" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Seat Utilization Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4">Seat Utilization</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-sm text-gray-300">Filled — 72%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-white/10" />
                <span className="text-sm text-gray-300">Open — 28%</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">36 of 50 total seats filled</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Internships Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-4">Posted Internships</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Title', 'Applications', 'Seats', 'Filled', 'Avg Match', 'Status'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockCompanyInternships.map(intern => (
                <tr key={intern.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-white">{intern.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{intern.applications}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{intern.seats}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{intern.filled}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${intern.matchAvg >= 85 ? 'text-green-400' : 'text-blue-400'}`}>{intern.matchAvg}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                      intern.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>{intern.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
