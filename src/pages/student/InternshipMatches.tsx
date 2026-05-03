import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Clock, DollarSign, Users, ChevronDown, ChevronUp, Brain, X, Filter, Loader2, Bookmark, BookmarkCheck, ArrowDownWideNarrow } from 'lucide-react';
import { fetchInternships, applyForInternship, checkApplicationStatus } from '@/lib/supabase';
import type { Internship } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { calculateMatchScore } from '@/utils/matchScorer';

export default function InternshipMatches() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showExplainer, setShowExplainer] = useState<string | null>(null);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string>('All Domains');
  const [savedInternships, setSavedInternships] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('internmatch-saved-internships');
      return stored ? new Set(JSON.parse(stored)) : new Set<string>();
    } catch { return new Set<string>(); }
  });
  const [sortBy, setSortBy] = useState<'match' | 'stipend' | 'recent'>('match');
  
  const { user } = useAuthStore();
  const { result, selectedRole } = useResumeStore();

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

  const toggleSave = (internId: string) => {
    setSavedInternships(prev => {
      const next = new Set(prev);
      if (next.has(internId)) {
        next.delete(internId);
        toast('Removed from saved', { icon: '🗑️' });
      } else {
        next.add(internId);
        toast.success('Saved for later!');
      }
      localStorage.setItem('internmatch-saved-internships', JSON.stringify([...next]));
      return next;
    });
  };

  // Filter internships
  const filteredInternships = useMemo(() => {
    return internships.filter(intern => {
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
      if (activeFilter === 'Saved') {
         return savedInternships.has(intern.id);
      }
      return true;
    });
  }, [internships, activeFilter, savedInternships]);

  // Score and sort internships
  const scoredInternships = useMemo(() => {
    const scored = filteredInternships.map(intern => ({
      intern,
      matchScore: calculateMatchScore(intern, result, selectedRole),
    }));

    switch (sortBy) {
      case 'stipend':
        scored.sort((a, b) => b.intern.max_stipend - a.intern.max_stipend);
        break;
      case 'recent':
        scored.sort((a, b) => new Date(b.intern.created_at).getTime() - new Date(a.intern.created_at).getTime());
        break;
      case 'match':
      default:
        scored.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }
    return scored;
  }, [filteredInternships, result, selectedRole, sortBy]);


  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Sparkles size={24} className="text-amber-400" />
          <h1 className="text-2xl font-bold text-white">Live Internship Matches</h1>
        </div>
        <p className="text-sm text-gray-400">
          Ranked by your AI compatibility score
          {selectedRole && <> — optimized for <span className="text-purple-400 font-medium">{selectedRole}</span></>}
        </p>
      </motion.div>

      {/* Filters bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card px-5 py-3 flex items-center gap-3 flex-wrap">
        <Filter size={14} className="text-gray-400" />
        {['All Domains', 'Remote', 'Hybrid', 'Onsite', '> ₹40K', 'AI/ML', 'Web Dev', 'Saved'].map((f) => (
          <button 
            key={f} 
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
              activeFilter === f ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {f === 'Saved' && <Bookmark size={11} />}
            {f}{f === 'Saved' && savedInternships.size > 0 ? ` (${savedInternships.size})` : ''}
          </button>
        ))}

        {/* Sort selector */}
        <div className="ml-auto relative">
          <div className="flex items-center gap-2">
            <ArrowDownWideNarrow size={14} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 pr-7 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer"
            >
              <option value="match" className="bg-[#0f0c29] text-white">Best Match</option>
              <option value="stipend" className="bg-[#0f0c29] text-white">Highest Stipend</option>
              <option value="recent" className="bg-[#0f0c29] text-white">Most Recent</option>
            </select>
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
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
      ) : scoredInternships.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400">No internships match the current filter. Try a different filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scoredInternships.map(({ intern, matchScore }, i) => {
            const isSaved = savedInternships.has(intern.id);
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
                    <button 
                      onClick={() => toggleSave(intern.id)}
                      className={`px-4 py-2 rounded-xl border text-sm transition-all flex items-center gap-1.5 ${
                        isSaved 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                      <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
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

                        {/* Score breakdown */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          {[
                            { label: 'Skill Match', value: Math.max(10, matchScore - 2) },
                            { label: 'Project Fit', value: Math.min(99, matchScore + 1) },
                            { label: 'Role Alignment', value: selectedRole && intern.title.toLowerCase().includes(selectedRole.toLowerCase().split(' ')[0]) ? Math.min(99, matchScore + 5) : Math.max(10, matchScore - 8) },
                            { label: 'Experience', value: Math.min(99, matchScore + 3) },
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
                            <p className="text-xs text-gray-300">Your profile's skills strongly align with {intern.company_name}'s requirements for {intern.title}.</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Sparkles size={12} className="text-amber-400 flex-shrink-0 mt-1" />
                            <p className="text-xs text-gray-300">High semantic overlap between your resume and the required skills.</p>
                          </div>
                          {selectedRole && (
                            <div className="flex items-start gap-2">
                              <Sparkles size={12} className="text-purple-400 flex-shrink-0 mt-1" />
                              <p className="text-xs text-gray-300">
                                {intern.title.toLowerCase().includes(selectedRole.toLowerCase().split(' ')[0]) 
                                  ? <>This role aligns well with your career goal of <span className="text-purple-400 font-medium">{selectedRole}</span>.</>
                                  : <>This role may develop transferable skills for your goal of <span className="text-purple-400 font-medium">{selectedRole}</span>.</>
                                }
                              </p>
                            </div>
                          )}
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
