import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Sparkles, Brain, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useResumeStore } from '@/store/resumeStore';
import { Link } from 'react-router-dom';

/* ── 10 scenario-based questions ── */
const QUESTIONS = [
  { text: "Your team's critical feature has a subtle logic bug found 2 hours before demo. You:", opts: ["Systematically trace inputs/outputs with debugger","Rewrite the module from scratch quickly","Ask each teammate what they changed recently","Propose a creative workaround to demo safely"], dims: ['analyticalThinking','problemSolving','communication','creativity'] },
  { text: "A client wants a feature that contradicts your app's architecture. You:", opts: ["Propose a compromise that fits the architecture","Redesign the architecture to accommodate it","Explain trade-offs and let the client decide","Find an innovative plugin-based solution"], dims: ['problemSolving','adaptability','communication','innovationIndex'] },
  { text: "You join a new team using a tech stack you've never seen. You:", opts: ["Read docs and build a small prototype in a weekend","Ask teammates for a guided walkthrough","Watch tutorials while following along in code","Reverse-engineer the existing codebase"], dims: ['adaptability','collaboration','creativity','analyticalThinking'] },
  { text: "During a hackathon, your teammate's code keeps breaking the build. You:", opts: ["Pair-program with them to fix it together","Take over their part to save time","Set up CI checks to catch issues early","Redistribute tasks based on strengths"], dims: ['collaboration','leadership','innovationIndex','adaptability'] },
  { text: "You need to present a complex algorithm to non-technical stakeholders. You:", opts: ["Create visual analogies and diagrams","Show a live demo with simple inputs","Write a clear one-page summary first","Let them ask questions and answer interactively"], dims: ['communication','creativity','analyticalThinking','adaptability'] },
  { text: "Your manager asks you to lead a project you feel underqualified for. You:", opts: ["Accept and create a structured learning plan","Decline and suggest a better-suited colleague","Accept but immediately recruit domain experts","Propose co-leading with someone experienced"], dims: ['leadership','communication','adaptability','collaboration'] },
  { text: "You discover a way to automate 80% of a tedious weekly process. You:", opts: ["Build the tool and present ROI to management","Automate it quietly for yourself first","Share the idea and build it as a team project","Research if existing tools already solve this"], dims: ['innovationIndex','problemSolving','collaboration','analyticalThinking'] },
  { text: "A production outage happens at 2 AM and you're the on-call engineer. You:", opts: ["Follow the runbook step by step","Check monitoring dashboards and logs first","Immediately escalate to the senior engineer","Try a quick rollback while investigating root cause"], dims: ['problemSolving','analyticalThinking','communication','adaptability'] },
  { text: "You're reviewing a PR with clever but hard-to-read code. You:", opts: ["Request refactoring with specific suggestions","Approve it but add clarifying comments yourself","Discuss the approach in a team meeting","Appreciate the cleverness and approve as-is"], dims: ['communication','collaboration','leadership','creativity'] },
  { text: "You have a week with no assigned tasks. You:", opts: ["Tackle tech debt and write missing tests","Build a prototype for an idea you've been thinking about","Help teammates with their backlogs","Learn a new technology relevant to the product"], dims: ['leadership','innovationIndex','collaboration','adaptability'] },
];

/* ── Scoring weights per option index ── */
const WEIGHTS = [
  [90, 60, 70, 80], [85, 55, 75, 90], [80, 70, 60, 85],
  [80, 65, 90, 75], [85, 80, 70, 65], [90, 60, 75, 80],
  [90, 70, 80, 65], [75, 85, 65, 80], [85, 75, 70, 60],
  [80, 90, 75, 85],
];

function computeDNA(answers: number[]) {
  const sums: Record<string,number> = { analyticalThinking:0, communication:0, creativity:0, leadership:0, adaptability:0, collaboration:0, problemSolving:0, innovationIndex:0 };
  const counts: Record<string,number> = { ...sums };
  answers.forEach((ans, qi) => {
    const dim = QUESTIONS[qi].dims[ans];
    const weight = WEIGHTS[qi][ans];
    sums[dim] = (sums[dim] || 0) + weight;
    counts[dim] = (counts[dim] || 0) + 1;
    // Give partial credit to other dimensions touched by this question
    QUESTIONS[qi].dims.forEach((d, i) => {
      if (i !== ans) { sums[d] = (sums[d] || 0) + weight * 0.25; counts[d] = (counts[d] || 0) + 0.5; }
    });
  });
  const dna: Record<string,number> = {};
  for (const k of Object.keys(sums)) {
    dna[k] = counts[k] > 0 ? Math.min(100, Math.round(sums[k] / counts[k])) : 45;
  }
  return dna as any;
}

export default function TalentDNA() {
  const { isAnalyzed, result, setTalentDNA } = useResumeStore();
  const [step, setStep] = useState(0); // 0..9 = questions, 10 = done
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const hasTaken = result?.talent_dna && Object.values(result.talent_dna).some(v => v > 0);

  if (!isAnalyzed || !result) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <Brain size={48} className="text-purple-400 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Resume Analysis Required</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">Please analyze your resume first to unlock the Talent DNA assessment.</p>
        <Link to="/student/resume" className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors shadow-lg shadow-purple-500/20">Analyze Resume Now</Link>
      </div>
    );
  }

  const handleAnswer = (optIdx: number) => {
    setSelected(optIdx);
    setTimeout(() => {
      const newAnswers = [...answers, optIdx];
      setAnswers(newAnswers);
      setSelected(null);
      if (newAnswers.length === 10) {
        const dna = computeDNA(newAnswers);
        setTalentDNA(dna);
        setStep(10);
      } else {
        setStep(s => s + 1);
      }
    }, 400);
  };

  const retakeTest = () => { setStep(0); setAnswers([]); setSelected(null); };

  // ── Show results ──
  if (hasTaken || step === 10) {
    const td = result.talent_dna;
    const dnaData = [
      { dimension: 'Analytical', value: td.analyticalThinking },
      { dimension: 'Creativity', value: td.creativity },
      { dimension: 'Leadership', value: td.leadership },
      { dimension: 'Adaptability', value: td.adaptability },
      { dimension: 'Communication', value: td.communication },
      { dimension: 'Collaboration', value: td.collaboration },
      { dimension: 'Problem Solving', value: td.problemSolving },
      { dimension: 'Innovation', value: td.innovationIndex },
    ];
    const dims = [
      { name: 'Analytical Thinking', score: td.analyticalThinking, color: 'from-blue-500 to-cyan-500' },
      { name: 'Problem Solving', score: td.problemSolving, color: 'from-green-500 to-emerald-500' },
      { name: 'Adaptability', score: td.adaptability, color: 'from-purple-500 to-pink-500' },
      { name: 'Collaboration', score: td.collaboration, color: 'from-amber-500 to-orange-500' },
      { name: 'Innovation Index', score: td.innovationIndex, color: 'from-red-500 to-rose-500' },
      { name: 'Creativity', score: td.creativity, color: 'from-indigo-500 to-violet-500' },
      { name: 'Communication', score: td.communication, color: 'from-teal-500 to-cyan-500' },
      { name: 'Leadership', score: td.leadership, color: 'from-pink-500 to-fuchsia-500' },
    ];
    const topTrait = dims.reduce((a, b) => a.score > b.score ? a : b);
    const avgScore = Math.round(dnaData.reduce((s, d) => s + d.value, 0) / 8);

    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1"><Dna size={24} className="text-purple-400" /><h1 className="text-2xl font-bold text-white">Talent DNA Profile</h1></div>
              <p className="text-sm text-gray-400">Your cognitive strengths based on scenario assessment</p>
            </div>
            <button onClick={retakeTest} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors"><RotateCcw size={14} /> Retake Test</button>
          </div>
        </motion.div>

        {/* Summary card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center"><span className="text-2xl font-black text-purple-300">{avgScore}</span></div>
            <div><p className="text-white font-bold text-lg">Overall DNA Score</p><p className="text-sm text-gray-400">Top trait: <span className="text-purple-300 font-semibold">{topTrait.name}</span> at {topTrait.score}%</p></div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Radar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="text-base font-bold text-white mb-2">DNA Radar</h3>
            <p className="text-xs text-gray-400 mb-4">8 cognitive dimensions mapped</p>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={dnaData}>
                <PolarGrid stroke="rgba(139,92,246,0.15)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 9 }} />
                <Radar name="Talent" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-4">Dimension Breakdown</h3>
            <div className="space-y-3">
              {dims.map((dim, i) => (
                <motion.div key={dim.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{dim.name}</p>
                    <span className={`text-sm font-bold ${dim.score >= 80 ? 'text-green-400' : dim.score >= 60 ? 'text-blue-400' : 'text-amber-400'}`}>{dim.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${dim.score}%` }} transition={{ duration: 0.8, delay: 0.1 * i }} className={`h-full rounded-full bg-gradient-to-r ${dim.color}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Quiz UI ──
  const q = QUESTIONS[step];
  const progress = ((step) / 10) * 100;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1"><Dna size={24} className="text-purple-400" /><h1 className="text-2xl font-bold text-white">Talent DNA Assessment</h1></div>
        <p className="text-sm text-gray-400">10 scenario-based questions to map your cognitive profile</p>
      </motion.div>

      {/* Progress */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Question {step + 1} of 10</span>
          <span className="text-xs font-bold text-purple-300">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/5">
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="glass-card p-8">
          <div className="flex items-start gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-black text-purple-300">{step + 1}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-relaxed">{q.text}</h2>
          </div>
          <div className="space-y-3">
            {q.opts.map((opt, i) => (
              <motion.button key={i} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => handleAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                  selected === i
                    ? 'bg-purple-500/20 border-purple-500/40 text-white'
                    : 'bg-white/[0.02] border-white/5 text-gray-300 hover:bg-white/[0.05] hover:border-white/10'
                }`}>
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  selected === i ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400'
                }`}>{String.fromCharCode(65 + i)}</span>
                <span className="text-sm">{opt}</span>
                {selected === i && <CheckCircle2 size={16} className="text-purple-400 ml-auto" />}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
