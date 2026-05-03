import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, AlertTriangle, CheckCircle, ShieldAlert,
  UserPlus, UserMinus, Database, RefreshCw
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { mlEngine } from '@/lib/mlEngine';
import type { MLCandidate, MLRankedResult, FairnessResult } from '@/lib/mlEngine';

// === MOCK CANDIDATE DATA (simulating 20 students) ===
const MOCK_CANDIDATES: MLCandidate[] = [
  { student_id: 'STU001', student_name: 'Arjun Sharma',   college: 'NIT Trichy',    cgpa: 8.2, skills_count: 6,  projects_count: 4, gender: 0, state_tier: 2, skill_match_pct: 85 },
  { student_id: 'STU002', student_name: 'Priya Patel',    college: 'IIT Bombay',    cgpa: 9.1, skills_count: 8,  projects_count: 5, gender: 1, state_tier: 1, skill_match_pct: 92 },
  { student_id: 'STU003', student_name: 'Rahul Singh',    college: 'IIT Delhi',     cgpa: 8.8, skills_count: 7,  projects_count: 3, gender: 0, state_tier: 1, skill_match_pct: 78 },
  { student_id: 'STU004', student_name: 'Sneha Kumar',    college: 'BITS Pilani',   cgpa: 8.5, skills_count: 5,  projects_count: 3, gender: 1, state_tier: 1, skill_match_pct: 71 },
  { student_id: 'STU005', student_name: 'Vikram Reddy',   college: 'IIT Madras',    cgpa: 7.9, skills_count: 4,  projects_count: 2, gender: 0, state_tier: 1, skill_match_pct: 65 },
  { student_id: 'STU006', student_name: 'Ananya Mishra',  college: 'NIT Warangal',  cgpa: 8.7, skills_count: 9,  projects_count: 4, gender: 1, state_tier: 2, skill_match_pct: 88 },
  { student_id: 'STU007', student_name: 'Karthik Nair',   college: 'VIT Vellore',   cgpa: 7.2, skills_count: 3,  projects_count: 1, gender: 0, state_tier: 2, skill_match_pct: 45 },
  { student_id: 'STU008', student_name: 'Divya Joshi',    college: 'IIIT Hyderabad',cgpa: 8.9, skills_count: 7,  projects_count: 5, gender: 1, state_tier: 1, skill_match_pct: 90 },
  { student_id: 'STU009', student_name: 'Aditya Chopra',  college: 'DTU Delhi',     cgpa: 7.5, skills_count: 5,  projects_count: 2, gender: 0, state_tier: 1, skill_match_pct: 55 },
  { student_id: 'STU010', student_name: 'Meera Iyer',     college: 'Anna University',cgpa: 7.8, skills_count: 6, projects_count: 3, gender: 1, state_tier: 3, skill_match_pct: 62 },
  { student_id: 'STU011', student_name: 'Rohan Gupta',    college: 'NSUT Delhi',    cgpa: 6.3, skills_count: 3,  projects_count: 1, gender: 0, state_tier: 1, skill_match_pct: 35 },
  { student_id: 'STU012', student_name: 'Kavya Menon',    college: 'NIT Calicut',   cgpa: 8.0, skills_count: 5,  projects_count: 3, gender: 1, state_tier: 2, skill_match_pct: 74 },
  { student_id: 'STU013', student_name: 'Siddharth Das',  college: 'Jadavpur Univ', cgpa: 7.6, skills_count: 4,  projects_count: 2, gender: 0, state_tier: 2, skill_match_pct: 58 },
  { student_id: 'STU014', student_name: 'Nisha Verma',    college: 'MANIT Bhopal',  cgpa: 7.1, skills_count: 4,  projects_count: 2, gender: 1, state_tier: 3, skill_match_pct: 50 },
  { student_id: 'STU015', student_name: 'Amit Yadav',     college: 'BHU Varanasi',  cgpa: 6.8, skills_count: 3,  projects_count: 1, gender: 0, state_tier: 3, skill_match_pct: 38 },
  { student_id: 'STU016', student_name: 'Tanvi Sinha',    college: 'IIT Kharagpur', cgpa: 9.3, skills_count:10,  projects_count: 5, gender: 1, state_tier: 1, skill_match_pct: 95 },
  { student_id: 'STU017', student_name: 'Harsh Pandey',   college: 'MNNIT Allahabad', cgpa: 7.4, skills_count: 5, projects_count: 2, gender: 0, state_tier: 2, skill_match_pct: 60 },
  { student_id: 'STU018', student_name: 'Pooja Raj',      college: 'PSG Tech',      cgpa: 8.1, skills_count: 6,  projects_count: 3, gender: 1, state_tier: 3, skill_match_pct: 72 },
  { student_id: 'STU019', student_name: 'Dev Tiwari',     college: 'NIT Rourkela',  cgpa: 7.0, skills_count: 4,  projects_count: 2, gender: 0, state_tier: 2, skill_match_pct: 48 },
  { student_id: 'STU020', student_name: 'Riya Kapoor',    college: 'IIIT Delhi',    cgpa: 8.6, skills_count: 7,  projects_count: 4, gender: 1, state_tier: 1, skill_match_pct: 83 },
];

export default function MatchingEngine() {
  const [activeTab, setActiveTab] = useState<'matches' | 'fairness'>('matches');
  const [results, setResults] = useState<MLRankedResult[]>([]);
  const [fairness, setFairness] = useState<FairnessResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allocatedIds, setAllocatedIds] = useState<Set<string>>(new Set());

  // Fetch ML-ranked matches from Supabase Edge Function
  const fetchMatches = async () => {
    setIsProcessing(true);
    try {
      const data = await mlEngine.rankCandidates(MOCK_CANDIDATES);
      setResults(data.ranked_candidates || []);
    } catch (e) {
      console.error('ML match error:', e);
    }
    setIsProcessing(false);
  };

  // Fetch fairness metrics from Edge Function
  const fetchFairness = async () => {
    try {
      // Build allocation data from currently allocated candidates
      const allocations = MOCK_CANDIDATES
        .filter(c => allocatedIds.has(c.student_id))
        .map(c => ({
          gender: c.gender,
          state_tier: c.state_tier,
          institution_rank: c.state_tier, // using tier as proxy
          college: c.college,
        }));

      // If no allocations yet, use all candidates as preview
      const data = await mlEngine.getFairnessScore(
        allocations.length > 0 ? allocations : MOCK_CANDIDATES.map(c => ({
          gender: c.gender,
          state_tier: c.state_tier,
          institution_rank: c.state_tier,
          college: c.college,
        }))
      );
      setFairness(data);
    } catch (e) {
      console.error('Fairness error:', e);
    }
  };

  useEffect(() => { fetchMatches(); }, []);
  useEffect(() => { if (activeTab === 'fairness') fetchFairness(); }, [activeTab, allocatedIds]);

  const handleAllocate = (studentId: string) => {
    setAllocatedIds(prev => new Set([...prev, studentId]));
  };

  const handleReallocate = async (studentId: string) => {
    try {
      const data = await mlEngine.reallocateSeat(MOCK_CANDIDATES, studentId);
      setAllocatedIds(prev => {
        const next = new Set(prev);
        next.delete(studentId);
        if (data.reallocated_to) next.add(data.reallocated_to);
        return next;
      });
      alert(data.message);
    } catch (e) {
      console.error('Reallocate error:', e);
    }
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1', '#14B8A6', '#F97316'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Database size={24} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-white">AI Allocation Hub</h1>
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400">ML POWERED</span>
          </div>
          <p className="text-sm text-gray-400">RandomForest scoring via Supabase Edge Functions — real-time ML inference</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'matches' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            ML Ranked Matches
          </button>
          <button
            onClick={() => setActiveTab('fairness')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'fairness' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Fairness Monitor
          </button>
        </div>
      </motion.div>

      {/* MATCHES TAB */}
      {activeTab === 'matches' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" /> ML-Ranked Candidates ({results.length})
            </h2>
            <button onClick={fetchMatches} disabled={isProcessing} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-xs font-medium text-white transition-colors flex items-center gap-1.5">
              <RefreshCw size={12} className={isProcessing ? 'animate-spin' : ''} />
              {isProcessing ? 'Computing...' : 'Run ML Engine'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs uppercase text-gray-400 font-medium">
                  <th className="p-4">#</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">College</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Allocation Score</th>
                  <th className="p-4">Skill Match</th>
                  <th className="p-4">Dropout Risk</th>
                  <th className="p-4">Role Fit</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {results.map((m, i) => {
                  const isAllocated = allocatedIds.has(m.student_id);
                  return (
                    <tr key={m.student_id} className={`transition-colors ${isAllocated ? 'bg-green-500/5' : 'hover:bg-white/[0.02]'}`}>
                      <td className="p-4 text-gray-500 font-mono text-xs">{i + 1}</td>
                      <td className="p-4 font-medium text-white">{m.student_name}</td>
                      <td className="p-4 text-gray-400 text-xs">{m.college}</td>
                      <td className="p-4 text-gray-300">{m.cgpa}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${m.allocation_score >= 75 ? 'bg-green-500' : m.allocation_score >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${m.allocation_score}%` }} />
                          </div>
                          <span className="text-xs font-bold text-white">{m.allocation_score}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">{m.skill_match_pct}%</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-max
                          ${m.dropout_risk === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          m.dropout_risk === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                          {m.dropout_risk === 'High' && <ShieldAlert size={12} />}
                          {m.dropout_risk}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-medium
                          ${m.role_fit === 'Perfect Fit' ? 'text-green-300 bg-green-500/10' :
                          m.role_fit === 'Overqualified' ? 'text-purple-300 bg-purple-500/10' :
                          'text-orange-300 bg-orange-500/10'}`}>
                          {m.role_fit}
                        </span>
                      </td>
                      <td className="p-4">
                        {!isAllocated ? (
                          <button
                            onClick={() => handleAllocate(m.student_id)}
                            className="p-1.5 rounded bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 transition-colors"
                            title="Allocate Seat"
                          >
                            <UserPlus size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReallocate(m.student_id)}
                            className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                            title="Drop & Reallocate"
                          >
                            <UserMinus size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {results.length === 0 && !isProcessing && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">No results yet. Click "Run ML Engine" to compute.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Allocation Summary */}
          {allocatedIds.size > 0 && (
            <div className="p-4 border-t border-white/10 bg-green-500/5">
              <p className="text-xs text-green-400 font-medium">
                ✓ {allocatedIds.size} seat(s) allocated. Switch to "Fairness Monitor" to verify distribution balance.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* FAIRNESS TAB */}
      {activeTab === 'fairness' && fairness && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Overall Score */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Overall Fairness Score</h3>
              <span className={`text-3xl font-bold ${fairness.overall_fairness >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {fairness.overall_fairness}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Gender Equity', score: fairness.gender_score, detail: `${fairness.female_ratio}% female` },
                { label: 'Regional Access', score: fairness.regional_score, detail: `${fairness.tier2_3_pct}% Tier 2/3` },
                { label: 'Institution Diversity', score: fairness.institution_score, detail: 'Cross-institutional' },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className={`text-xl font-bold ${item.score >= 70 ? 'text-green-400' : item.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {item.score}%
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className={`mt-4 p-3 rounded-lg border flex items-start gap-2
              ${fairness.is_balanced ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {fairness.is_balanced ? <CheckCircle size={18} className="mt-0.5 shrink-0" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0" />}
              <div>
                <p className="text-sm font-bold">{fairness.is_balanced ? 'System is Balanced' : 'Bias Detected'}</p>
                <p className="text-xs opacity-80 mt-0.5">
                  {fairness.is_balanced
                    ? 'Allocations meet fairness thresholds across gender, region, and institution.'
                    : 'One or more fairness dimensions fall below threshold. Review allocation policy.'}
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-white mb-4">College Distribution</h3>
              {fairness.college_distribution && fairness.college_distribution.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={fairness.college_distribution} innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value">
                        {fairness.college_distribution.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ background: '#1a2332', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No allocation data</div>
              )}
            </div>

            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-white mb-4">Region Tier Distribution</h3>
              {fairness.region_distribution && fairness.region_distribution.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fairness.region_distribution}>
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ background: '#1a2332', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No allocation data</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
