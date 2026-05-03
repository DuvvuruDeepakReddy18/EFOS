import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, TrendingDown, BarChart3, Scale, Loader2, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/* ── Types ── */
interface CollegeAllocation { name: string; total: number; allocations: number; avgRisk: number }
interface RegionAllocation { name: string; total: number; allocations: number; avgRisk: number; color: string }
interface RiskCategory { category: string; risk: string; percent: number; explanation: string }
interface FairnessData {
  model_info: { algorithm: string; n_estimators: number; training_samples: number; features: string[]; feature_importances: Record<string, number> };
  summary: { total_students: number; avg_dropout_probability: number; risk_distribution: { High: number; Medium: number; Low: number } };
  fairness: { overall_gini: number; college_gini: number; region_gini: number; fairness_score: number };
  college_allocations: CollegeAllocation[];
  region_allocations: RegionAllocation[];
  dropout_risk_categories: RiskCategory[];
}

const riskColors = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };

export default function FairnessMonitor() {
  const [data, setData] = useState<FairnessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFairnessData();
  }, []);

  async function fetchFairnessData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/predict-risk');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Fairness data fetch failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-purple-400 animate-spin" />
        <p className="text-gray-400 text-sm">Loading AI Fairness Analysis…</p>
        <p className="text-gray-500 text-xs">Running Random Forest on 2,000 student records</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle size={40} className="text-red-400" />
        <p className="text-red-400 text-sm">Failed to load fairness data</p>
        <p className="text-gray-500 text-xs">{error}</p>
        <button onClick={fetchFairnessData} className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm hover:bg-purple-500/30 transition-all">
          Retry
        </button>
      </div>
    );
  }

  const { fairness, college_allocations, region_allocations, dropout_risk_categories, summary, model_info } = data;

  // Dominance check
  const maxCollege = Math.max(...college_allocations.map(c => c.allocations));
  const totalAllocations = college_allocations.reduce((a, b) => a + b.allocations, 0);
  const isDominated = maxCollege / totalAllocations > 0.4;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Shield size={24} className="text-amber-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Algorithmic Fairness Monitor</h1>
            <p className="text-sm text-gray-400">Gini-coefficient equity tracking • PM Internship Scheme</p>
          </div>
        </div>
      </motion.div>

      {/* ── Model Badge ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="glass-card p-3 flex items-center gap-3 border border-purple-500/10">
        <Brain size={16} className="text-purple-400 flex-shrink-0" />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-400">
          <span>Model: <span className="text-purple-300 font-bold">{model_info.algorithm}</span></span>
          <span>Estimators: <span className="text-white font-bold">{model_info.n_estimators}</span></span>
          <span>Training Set: <span className="text-white font-bold">{model_info.training_samples.toLocaleString()} students</span></span>
          <span>Avg Dropout Prob: <span className="text-amber-400 font-bold">{(summary.avg_dropout_probability * 100).toFixed(1)}%</span></span>
        </div>
      </motion.div>

      {/* ── Fairness Score Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Fairness Score',
            value: `${fairness.fairness_score}%`,
            subtitle: 'F = (1 - G) × 100',
            color: fairness.fairness_score >= 70 ? 'text-green-400' : fairness.fairness_score >= 50 ? 'text-amber-400' : 'text-red-400',
            bg: fairness.fairness_score >= 70 ? 'from-green-500/20 to-green-500/5' : 'from-amber-500/20 to-amber-500/5',
            icon: Scale,
          },
          {
            label: 'Gini Coefficient',
            value: fairness.overall_gini.toFixed(3),
            subtitle: '0 = perfect equality',
            color: fairness.overall_gini < 0.3 ? 'text-green-400' : fairness.overall_gini < 0.5 ? 'text-amber-400' : 'text-red-400',
            bg: fairness.overall_gini < 0.3 ? 'from-green-500/20 to-green-500/5' : 'from-amber-500/20 to-amber-500/5',
            icon: BarChart3,
          },
          {
            label: 'College Equity',
            value: ((1 - fairness.college_gini) * 100).toFixed(0) + '%',
            subtitle: `G = ${fairness.college_gini.toFixed(3)}`,
            color: fairness.college_gini < 0.3 ? 'text-green-400' : 'text-amber-400',
            bg: 'from-blue-500/20 to-blue-500/5',
            icon: CheckCircle2,
          },
          {
            label: 'Region Equity',
            value: ((1 - fairness.region_gini) * 100).toFixed(0) + '%',
            subtitle: `G = ${fairness.region_gini.toFixed(3)}`,
            color: fairness.region_gini < 0.3 ? 'text-green-400' : 'text-amber-400',
            bg: 'from-purple-500/20 to-purple-500/5',
            icon: CheckCircle2,
          },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={18} className={card.color} />
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
            <p className="text-[9px] text-gray-500">{card.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Risk Distribution Summary ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-5">
        <h3 className="text-sm font-bold text-white mb-3">Risk Distribution Across {summary.total_students.toLocaleString()} Students</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['High', 'Medium', 'Low'] as const).map((level) => {
            const count = summary.risk_distribution[level];
            const pct = Math.round(count / summary.total_students * 100);
            return (
              <div key={level} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-2xl font-bold" style={{ color: riskColors[level] }}>{count}</p>
                <div className="w-full h-1.5 rounded-full bg-white/5 mt-2 mb-1 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: riskColors[level] }} />
                </div>
                <p className="text-[10px] text-gray-400">{level} Risk ({pct}%)</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Dominance Warning */}
      {isDominated && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass-card p-4 border border-red-500/20 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-400">Dominance Alert</p>
            <p className="text-xs text-gray-400">A single institution holds &gt;40% of allocations. Fairness constraints recommend redistribution.</p>
          </div>
        </motion.div>
      )}

      {/* ── Charts Row ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* College Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4">Institutional Allocation Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={college_allocations} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#9CA3AF', fontSize: 9 }} width={100} />
              <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="allocations" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Low-Risk Allocations" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Regional Distribution Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4">Regional Allocation Equity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={region_allocations} dataKey="allocations" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                stroke="rgba(255,255,255,0.05)" strokeWidth={2}>
                {region_allocations.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {region_allocations.map(r => (
              <div key={r.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-[10px] text-gray-400">{r.name} ({r.allocations})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── DROPOUT RISK ENGINE (powered by Random Forest) ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="glass-card p-6 border border-red-500/10">
        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <TrendingDown size={16} className="text-red-400" />
          AI Dropout Risk Engine
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-normal">Random Forest</span>
        </h3>
        <p className="text-[10px] text-gray-500 mb-4">Risk categories derived from model predictions on {summary.total_students.toLocaleString()} student records</p>
        <div className="space-y-3">
          {dropout_risk_categories.map((d, i) => (
            <motion.div key={d.category} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}
                style={{ backgroundColor: riskColors[d.risk as keyof typeof riskColors] + '1A', border: `1px solid ${riskColors[d.risk as keyof typeof riskColors]}33` }}>
                <span className="text-xs font-bold" style={{ color: riskColors[d.risk as keyof typeof riskColors] }}>{d.percent}%</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{d.category}</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                    style={{
                      color: riskColors[d.risk as keyof typeof riskColors],
                      backgroundColor: riskColors[d.risk as keyof typeof riskColors] + '1A',
                      border: `1px solid ${riskColors[d.risk as keyof typeof riskColors]}33`,
                    }}>
                    {d.risk}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{d.explanation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Feature Importance ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="glass-card p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Brain size={14} className="text-purple-400" />
          Model Feature Importances
        </h3>
        <div className="space-y-2.5">
          {Object.entries(model_info.feature_importances)
            .sort(([, a], [, b]) => b - a)
            .map(([feature, importance], i) => (
              <motion.div key={feature} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400 capitalize">{feature.replace(/_/g, ' ')}</span>
                  <span className="text-xs font-bold text-purple-400">{(importance * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${importance * 100 / 0.28 * 100}%` }}
                    transition={{ delay: 0.7 + i * 0.05, duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
