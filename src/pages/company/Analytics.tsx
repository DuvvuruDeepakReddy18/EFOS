import { motion } from 'framer-motion';
import { LineChart as LineChartIcon, TrendingUp, Award, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const performanceData = [
  { month: 'Jan', matchAccuracy: 78, satisfaction: 72 },
  { month: 'Feb', matchAccuracy: 82, satisfaction: 75 },
  { month: 'Mar', matchAccuracy: 85, satisfaction: 80 },
  { month: 'Apr', matchAccuracy: 88, satisfaction: 83 },
  { month: 'May', matchAccuracy: 91, satisfaction: 88 },
  { month: 'Jun', matchAccuracy: 94, satisfaction: 91 },
];

export default function CompanyAnalytics() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <LineChartIcon size={24} className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Internship Analytics</h1>
        </div>
        <p className="text-sm text-gray-400">Performance data, satisfaction scores, and industry benchmarks</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { label: 'Match Accuracy', value: '94%', change: '+6%', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Satisfaction Score', value: '4.7/5', change: '+0.3', icon: Award, color: 'text-amber-400' },
          { label: 'Intern Retention', value: '92%', change: '+4%', icon: Users, color: 'text-blue-400' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-5">
            <stat.icon size={18} className={stat.color + ' mb-2'} />
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
            <p className="text-xs text-green-400 mt-1">{stat.change} vs last quarter</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-4">Performance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} domain={[60, 100]} />
            <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', color: '#fff' }} />
            <Area type="monotone" dataKey="matchAccuracy" stroke="#3B82F6" fill="url(#matchGrad)" strokeWidth={2} name="Match Accuracy" />
            <Area type="monotone" dataKey="satisfaction" stroke="#10B981" fill="url(#satGrad)" strokeWidth={2} name="Satisfaction" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
