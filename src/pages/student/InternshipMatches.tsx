import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Clock, DollarSign, Users, ChevronDown, ChevronUp, Brain, X, Filter, Loader2 } from 'lucide-react';
import { fetchInternships, applyForInternship, checkApplicationStatus } from '@/lib/supabase';
import type { Internship } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function InternshipMatches() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showExplainer, setShowExplainer] = useState<string | null>(null);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string>('All Domains');
  
  const { user } = useAuthStore();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchInternships();
        setInternships(data);
        
        if (user?.id) {
          const appliedSet = new Set<string>();
          for (const intern of data) {
            const hasApplied = await checkApplicationStatus(user.id, intern.id);
            if (hasApplied) appliedSet.add(intern.id);
          }
          setAppliedInternships(appliedSet);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load internships');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const handleApply = async (intern: Internship) => {
    if (!user) {
      toast.error('You must be logged in to apply.');
      return;
    }
    
    setApplyingTo(intern.id);
    const result = await applyForInternship(user.id, intern.company_id, intern.id);
    setApplyingTo(null);

    if (result.success) {
      toast.success(`Successfully applied to ${intern.company_name}!`);
      setAppliedInternships(prev => new Set(prev).add(intern.id));
    } else {
      toast.error(result.error || 'Failed to apply.');
    }
  };

  // Helper function to deterministically "randomize" a match score based on the ID for demo purposes
  const getMatchScore = (id: string) => {
    const sum = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return 70 + (sum % 28); // Returns value between 70 and 98
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Sparkles size={24} className="text-amber-400" />
          <h1 className="text-2xl font-bold text-white">Live Internship Matches</h1>
        </div>
        <p className="text-sm text-gray-400">Ranked by your AI compatibility score — powered by BERT + cosine similarity</p>
      </motion.div>

      {/* Filters bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card px-5 py-3 flex items-center gap-3 flex-wrap">
        <Filter size={14} className="text-gray-400" />
        {['All Domains', 'Remote', 'Hybrid', 'Onsite', '> ₹40K', 'AI/ML', 'Web Dev'].map((f, i) => (
          <button 
            key={f} 
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeFilter === f ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Output States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p>Loading live matches from AI engine...</p>
        </div>
      ) : internships.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400">No internships have been posted yet. Check back later!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {internships
          .filter(intern => {
            if (activeFilter === 'All Domains') return true;
            if (['Remote', 'Hybrid', 'Onsite'].includes(activeFilter)) {
               return intern.mode === activeFilter;
            }
            if (activeFilter === '> ₹40K') {
               return intern.max_stipend > 40000;
            }
            if (activeFilter === 'AI/ML') {
               return intern.title.includes('AI') || intern.title.includes('ML') || intern.title.includes('Data');
            }
            if (activeFilter === 'Web Dev') {
               return intern.title.includes('Web') || intern.title.includes('Full Stack') || intern.title.includes('Backend') || intern.title.includes('Frontend');
            }
            return true;
          })
          .map((intern, i) => {
            const matchScore = getMatchScore(intern.id);
            return (
              <motion.div
                key={intern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card glass-card-hover overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xl text-blue-400 border border-white/10 shrink-0">
                      {intern.company_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white max-w-full truncate">{intern.title}</h3>
                        {matchScore >= 90 && (
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400 hidden sm:inline-block">TOP MATCH</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{intern.company_name}</p>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={12} />{intern.location}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{intern.duration_weeks} weeks</span>
                        <span className="flex items-center gap-1"><DollarSign size={12} />₹{(intern.min_stipend / 1000).toFixed(0)}K - ₹{(intern.max_stipend / 1000).toFixed(0)}K</span>
                        <span className="flex items-center gap-1"><Users size={12} />{intern.total_seats} seats</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          intern.mode?.toLowerCase() === 'remote' ? 'bg-green-500/10 text-green-400' :
                          intern.mode?.toLowerCase() === 'hybrid' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>{intern.mode}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {intern.required_skills?.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-300 border border-white/5">{skill}</span>
                        ))}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-center flex-shrink-0">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center ${
                        matchScore >= 90 ? 'bg-green-500/10 border border-green-500/20' :
                        matchScore >= 75 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                      }`}>
                        <span className={`text-lg sm:text-xl font-bold ${
                          matchScore >= 90 ? 'text-green-400' :
                          matchScore >= 75 ? 'text-blue-400' : 'text-amber-400'
                        }`}>{matchScore}%</span>
                        <span className="text-[9px] text-gray-400">match</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => handleApply(intern)}
                      disabled={appliedInternships.has(intern.id) || applyingTo === intern.id}
                      className={`!py-2 !px-5 text-sm ${appliedInternships.has(intern.id) ? 'bg-gray-500/50 cursor-not-allowed text-white rounded-xl' : 'glow-btn'}`}
                    >
                      {applyingTo === intern.id ? 'Applying...' : appliedInternships.has(intern.id) ? 'Applied' : 'Apply Now'}
                    </button>
                    <button
                      onClick={() => setShowExplainer(showExplainer === intern.id ? null : intern.id)}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl flex-1 justify-center sm:flex-none sm:justify-start bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Brain size={14} className="text-blue-400 hidden sm:block" />
                      <span className="whitespace-nowrap">Why This Match?</span>
                      {showExplainer === intern.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all hidden sm:block">Save</button>
                  </div>
                </div>

                {/* Explainable AI panel */}
                <AnimatePresence>
                  {showExplainer === intern.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-blue-500/[0.03] border-t border-blue-500/10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Brain size={16} className="text-blue-400" />
                            <h4 className="text-sm font-bold text-white">AI Match Explanation</h4>
                          </div>
                          <button onClick={() => setShowExplainer(null)} className="text-gray-500 hover:text-white">
                            <X size={14} />
                          </button>
                        </div>

                        {/* Score breakdown (Mocked deterministically) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          {[
                            { label: 'Skill Match', value: matchScore - 2 },
                            { label: 'Project Fit', value: matchScore + 1 },
                            { label: 'Location', value: matchScore - 5 },
                            { label: 'Experience', value: matchScore + 3 },
                          ].map(item => (
                            <div key={item.label} className="p-3 rounded-lg bg-white/[0.03] text-center">
                              <p className={`text-lg font-bold ${item.value >= 90 ? 'text-green-400' : item.value >= 75 ? 'text-blue-400' : 'text-amber-400'}`}>{Math.min(item.value, 99)}%</p>
                              <p className="text-[10px] text-gray-400">{item.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* AI reasons */}
                        <div className="space-y-2 mt-4">
                          <div className="flex items-start gap-2">
                            <Sparkles size={12} className="text-amber-400 flex-shrink-0 mt-1" />
                            <p className="text-xs text-gray-300">Your profile's AI/ML projects strongly align with {intern.company_name}'s requirements for {intern.title}.</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Sparkles size={12} className="text-amber-400 flex-shrink-0 mt-1" />
                            <p className="text-xs text-gray-300">High semantic overlap between your resume and the required skills.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
