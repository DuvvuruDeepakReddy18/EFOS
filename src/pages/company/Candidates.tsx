import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Brain, Download, CheckCircle2, XCircle, Eye, Loader2, AlertTriangle, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { mockCandidates } from '@/data/mockData';
import { joinPredictor, type JoinPrediction } from '@/lib/mlEngine';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

// Map mock candidates to the shape expected by the join predictor
const CITY_MAP: Record<string, string> = {
  'NIT Trichy': 'Chennai',
  'IIT Bombay': 'Mumbai',
  'IIT Delhi': 'Delhi',
  'BITS Pilani': 'Jaipur',
  'IIT Madras': 'Chennai',
  'NIT Warangal': 'Hyderabad',
};

const CURRENT_INTERNSHIP = {
  location: 'Bangalore',
  mode: 'Hybrid' as const,
  stipend: 25000,
  duration_weeks: 12,
  company_tier: 1,
};

export default function Candidates() {
  const [predictions, setPredictions] = useState<Record<string, JoinPrediction>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [candidateStatuses, setCandidateStatuses] = useState<Record<string, 'Applied' | 'Shortlisted' | 'Rejected'>>({});

  const updateStatus = (id: string, status: 'Shortlisted' | 'Rejected') => {
    setCandidateStatuses(prev => ({ ...prev, [id]: status }));
    const name = mockCandidates.find(c => c.id === id)?.name || 'Candidate';
    if (status === 'Shortlisted') {
      toast.success(`${name} shortlisted!`);
    } else {
      toast(`${name} rejected`, { icon: '❌' });
    }
  };

  const undoStatus = (id: string) => {
    setCandidateStatuses(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    toast('Decision reverted', { icon: '↩️' });
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const candidates = mockCandidates.map((c) => ({
          student: {
            id: c.id,
            location: CITY_MAP[c.college] || 'Tier3',
            skill_match_pct: c.matchScore,
            cgpa: c.cgpa,
            other_applications: Math.floor(Math.random() * 12) + 1,
            student_year: 3,
            preferred_domain: c.skills.some(s => ['ML', 'TensorFlow', 'NLP', 'PyTorch', 'Data Science'].includes(s)),
          },
        }));

        const result = await joinPredictor.batchPredict(candidates, CURRENT_INTERNSHIP, 20);

        const map: Record<string, JoinPrediction> = {};
        result.results.forEach((r) => {
          map[r.student_id] = r;
        });
        setPredictions(map);
      } catch (err) {
        console.error('Join predictor error:', err);
        toast.error('ML engine unreachable');
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  const exportCSV = () => {
    const headers = ['Name', 'College', 'Branch', 'CGPA', 'Skills', 'Match Score (%)', 'Join Probability (%)', 'Risk Tier', 'Status'];
    const rows = mockCandidates.map(c => {
      const pred = predictions[c.id];
      const status = candidateStatuses[c.id] || c.status;
      return [
        c.name,
        c.college,
        c.branch,
        c.cgpa,
        `"${c.skills.join(', ')}"`,
        c.matchScore,
        pred?.join_probability ?? 'N/A',
        pred?.risk_tier ?? 'N/A',
        status,
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidates_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck size={24} className="text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">AI-Ranked Candidates</h1>
              <p className="text-sm text-gray-400">For: AI/ML Research Intern — ranked by compatibility + join probability</p>
            </div>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </motion.div>

      {/* Candidates */}
      <div className="space-y-3">
        {mockCandidates.map((candidate, i) => {
          const pred = predictions[candidate.id];
          const riskColor = pred?.risk_tier === 'Low' ? 'green' : pred?.risk_tier === 'Medium' ? 'amber' : 'red';
          const currentStatus = candidateStatuses[candidate.id] || candidate.status;

          return (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card glass-card-hover p-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">{candidate.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      currentStatus === 'Shortlisted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      currentStatus === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>{currentStatus}</span>
                  </div>
                  <p className="text-xs text-gray-400">{candidate.college} • {candidate.branch} • CGPA: {candidate.cgpa}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {candidate.skills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-300 border border-white/5">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* AI Match Score */}
                <div className="text-center flex-shrink-0 mr-2">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${
                    candidate.matchScore >= 90 ? 'bg-green-500/10 border border-green-500/20' :
                    candidate.matchScore >= 80 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                  }`}>
                    <span className={`text-lg font-bold ${
                      candidate.matchScore >= 90 ? 'text-green-400' :
                      candidate.matchScore >= 80 ? 'text-blue-400' : 'text-amber-400'
                    }`}>{candidate.matchScore}%</span>
                    <span className="text-[8px] text-gray-400">Match</span>
                  </div>
                </div>

                {/* Join Probability Badge */}
                <div className="text-center flex-shrink-0 mr-2">
                  {loading ? (
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Loader2 size={16} className="text-gray-400 animate-spin" />
                    </div>
                  ) : pred ? (
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center bg-${riskColor}-500/10 border border-${riskColor}-500/20`}
                      style={{
                        background: riskColor === 'green' ? 'rgba(34,197,94,0.1)' : riskColor === 'amber' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        borderColor: riskColor === 'green' ? 'rgba(34,197,94,0.2)' : riskColor === 'amber' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                      }}
                    >
                      <span className="text-lg font-bold" style={{
                        color: riskColor === 'green' ? '#4ade80' : riskColor === 'amber' ? '#fbbf24' : '#f87171',
                      }}>{pred.join_probability}%</span>
                      <span className="text-[8px] text-gray-400">Join</span>
                    </div>
                  ) : null}
                </div>

                {/* Risk Tier + Deadline */}
                <div className="text-center flex-shrink-0 mr-2">
                  {pred && (
                    <div className="flex flex-col items-center gap-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${
                        pred.risk_tier === 'Low' ? 'bg-green-500/10 text-green-400' :
                        pred.risk_tier === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {pred.risk_tier === 'Low' ? <ShieldCheck size={10} /> : pred.risk_tier === 'Medium' ? <AlertTriangle size={10} /> : <ShieldAlert size={10} />}
                        {pred.risk_tier} Risk
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] text-gray-500">
                        <Clock size={8} /> {pred.deadline_hours}h deadline
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white transition-all"
                  >
                    <Eye size={12} /> AI Reasons
                  </button>

                  {currentStatus === 'Shortlisted' ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/15 border border-green-500/30 text-xs text-green-400 font-semibold">
                        <CheckCircle2 size={12} /> Shortlisted
                      </span>
                      <button onClick={() => undoStatus(candidate.id)}
                        className="px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-500 hover:text-white transition-all"
                        title="Undo">
                        ↩️
                      </button>
                    </div>
                  ) : currentStatus === 'Rejected' ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-400 font-semibold">
                        <XCircle size={12} /> Rejected
                      </span>
                      <button onClick={() => undoStatus(candidate.id)}
                        className="px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-500 hover:text-white transition-all"
                        title="Undo">
                        ↩️
                      </button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => updateStatus(candidate.id, 'Shortlisted')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-400 hover:bg-green-500/20 transition-all">
                        <CheckCircle2 size={12} /> Shortlist
                      </button>
                      <button onClick={() => updateStatus(candidate.id, 'Rejected')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-all">
                        <XCircle size={12} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* AI Explanation (always shown) */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                <Brain size={12} className="text-blue-400" />
                <p className="text-[10px] text-gray-400">
                  <span className="text-blue-400 font-medium">AI:</span> Strong {candidate.skills[0]} skills with {candidate.cgpa >= 8.5 ? 'excellent' : 'good'} academic record.
                  {candidate.matchScore >= 90 ? ' Highly recommended for this role.' : ' Consider for interview.'}
                  {pred && ` · Join probability: ${pred.join_probability}% (${pred.risk_tier} risk)`}
                </p>
              </div>

              {/* Expandable AI Reasons from Join Predictor */}
              <AnimatePresence>
                {expandedId === candidate.id && pred && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 pt-2 border-t border-white/5 space-y-1.5">
                      <p className="text-[10px] font-semibold text-purple-400 mb-1">🧠 ML Join Prediction Reasons:</p>
                      {pred.reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-gray-300">
                          <span className="mt-0.5 text-purple-400">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                      {pred.breakdown && (
                        <div className="flex gap-3 mt-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] text-gray-500">📍 Location Risk: <strong className="text-gray-300">{pred.breakdown.location_risk}</strong></span>
                          <span className="text-[10px] text-gray-500">💰 Stipend Ratio: <strong className="text-gray-300">{pred.breakdown.stipend_ratio}</strong></span>
                          <span className="text-[10px] text-gray-500">🏢 Mode: <strong className="text-gray-300">{pred.breakdown.mode}</strong></span>
                          <span className="text-[10px] text-gray-500">🧩 Skill Match: <strong className="text-gray-300">{pred.breakdown.skill_match}</strong></span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
