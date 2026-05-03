import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Sparkles, Eye, Brain, ChevronRight, Loader2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { mockTalentDNA } from '@/data/mockData';

const dnaData = [
  { dimension: 'Analytical', value: mockTalentDNA.analyticalThinking, fullMark: 100 },
  { dimension: 'Creativity', value: mockTalentDNA.creativity, fullMark: 100 },
  { dimension: 'Leadership', value: mockTalentDNA.leadership, fullMark: 100 },
  { dimension: 'Adaptability', value: mockTalentDNA.adaptability, fullMark: 100 },
  { dimension: 'Communication', value: mockTalentDNA.communication, fullMark: 100 },
  { dimension: 'Collaboration', value: mockTalentDNA.collaboration, fullMark: 100 },
  { dimension: 'Problem Solving', value: mockTalentDNA.problemSolving, fullMark: 100 },
  { dimension: 'Innovation', value: mockTalentDNA.innovationIndex, fullMark: 100 },
];

const dimensionDetails = [
  { name: 'Analytical Thinking', score: mockTalentDNA.analyticalThinking, color: 'from-blue-500 to-cyan-500', desc: 'From project complexity and code quality patterns' },
  { name: 'Problem Solving', score: mockTalentDNA.problemSolving, color: 'from-green-500 to-emerald-500', desc: 'Challenge performance and debugging efficiency' },
  { name: 'Adaptability', score: mockTalentDNA.adaptability, color: 'from-purple-500 to-pink-500', desc: 'Multi-domain projects and learning velocity' },
  { name: 'Collaboration', score: mockTalentDNA.collaboration, color: 'from-amber-500 to-orange-500', desc: 'Team projects and peer review interactions' },
  { name: 'Innovation Index', score: mockTalentDNA.innovationIndex, color: 'from-red-500 to-rose-500', desc: 'Novel approaches in submissions and competitions' },
  { name: 'Creativity', score: mockTalentDNA.creativity, color: 'from-indigo-500 to-violet-500', desc: 'Design thinking and creative problem approaches' },
  { name: 'Communication', score: mockTalentDNA.communication, color: 'from-teal-500 to-cyan-500', desc: 'Documentation quality and presentation skills' },
  { name: 'Leadership', score: mockTalentDNA.leadership, color: 'from-pink-500 to-fuchsia-500', desc: 'Club activities, mentoring, and team leading' },
];

const quizQuestions = [
  { text: "When facing a completely new framework, you typically:", options: ["Read the official docs end-to-end", "Jump in and start building a small prototype", "Look for video tutorials and courses", "Find an existing codebase to reverse-engineer"] },
  { text: "In a team project, if a critical bug appears hours before deadline:", options: ["Take the lead and organize a systematic debugging plan", "Isolate yourself and dive deep into the code until it's fixed", "Communicate the delay to stakeholders immediately", "Brainstorm quick workarounds to meet the deadline"] },
  { text: "How do you approach optimizing slow code?", options: ["Use profiling tools to identify exact bottlenecks", "Refactor based on common algorithmic inefficiencies", "Rewrite the slow section using a faster language/library", "Ask AI or search forums for the specific optimization"] },
  { text: "When given ambiguous project requirements:", options: ["Schedule a meeting to clarify every detail", "Create a flexible architecture to handle changes", "Build a quick MVP to get early feedback", "Wait for more precise specifications"] },
  { text: "Your preferred way to learn a new concept is:", options: ["Understanding the underlying mathematical/theoretical principles", "Seeing practical, real-world examples", "Explaining it to someone else", "Visualizing it through diagrams and charts"] },
  { text: "If a teammate's code is holding back the project, you:", options: ["Gently pair-program with them to fix it", "Rewrite it yourself to save time", "Point out the specific issues in a code review", "Discuss distributing tasks differently"] },
  { text: "When designing a new feature, you prioritize:", options: ["User experience and intuitive flow", "Scalability and performance", "Meeting the deadline with a functional version", "Code maintainability and clean architecture"] },
  { text: "You discover a major flaw in your own code right after deployment:", options: ["Immediately push a hotfix", "Analyze how the flaw made it through testing", "Inform the team and plan a structured rollback", "Quietly patch it in the next scheduled release"] },
  { text: "How do you handle repetitive coding tasks?", options: ["Write a script or tool to automate them", "Power through them quickly", "Delegate them if possible", "Search for existing libraries that do the job"] },
  { text: "What constitutes a 'successful' project for you?", options: ["It solves the user's problem elegantly", "The codebase is perfectly structured and documented", "It was delivered ahead of schedule", "It introduced a novel or innovative approach"] },
];

export default function TalentDNA() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);

    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setStep('analyzing');
    }
  };

  useEffect(() => {
    if (step === 'analyzing') {
      const timer = setTimeout(() => {
        setStep('result');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Dna size={24} className="text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Talent DNA Profile</h1>
        </div>
        <p className="text-sm text-gray-400">Discover your hidden strengths and cognitive traits</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-12 text-center max-w-2xl mx-auto mt-12"
          >
            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <Brain size={40} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Unlock Your Psychological Profile</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Take our 10-question AI-powered assessment to map your cognitive approach across 8 dimensions including Leadership, Problem Solving, and Creativity.
            </p>
            <button
              onClick={() => setStep('quiz')}
              className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors shadow-lg shadow-purple-500/20"
            >
              Start Assessment
            </button>
          </motion.div>
        )}

        {step === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto mt-8"
          >
            <div className="flex justify-between items-center mb-6 text-sm">
              <span className="text-gray-400">Question {currentQ + 1} of 10</span>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full ${i <= currentQ ? 'bg-purple-500' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            
            <div className="glass-card p-8">
              <h3 className="text-xl font-medium text-white mb-8">{quizQuestions[currentQ].text}</h3>
              <div className="space-y-3">
                {quizQuestions[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all text-gray-300 hover:text-white flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <ChevronRight size={16} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="glass-card p-16 text-center max-w-md mx-auto mt-12"
          >
            <Loader2 size={48} className="text-purple-400 animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Responses...</h3>
            <p className="text-gray-400 text-sm">Mapping neural patterns to the 8 dimension model.</p>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Radar chart */}
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                <h3 className="text-base font-bold text-white mb-2 relative z-10">DNA Radar</h3>
                <p className="text-xs text-gray-400 mb-4 relative z-10">8 dimensions isolated perfectly</p>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={dnaData}>
                    <PolarGrid stroke="rgba(139,92,246,0.15)" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 9 }} />
                    <Radar name="Talent" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Dimension list */}
              <div className="glass-card p-6">
                <h3 className="text-base font-bold text-white mb-4">Dimension Breakdown</h3>
                <div className="space-y-3">
                  {dimensionDetails.map((dim, i) => (
                    <motion.div
                      key={dim.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{dim.name}</p>
                        <span className={`text-sm font-bold ${dim.score >= 85 ? 'text-green-400' : dim.score >= 70 ? 'text-blue-400' : 'text-amber-400'}`}>{dim.score}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 mb-1.5">
                        <div className={`h-full rounded-full bg-gradient-to-r ${dim.color}`} style={{ width: `${dim.score}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400">{dim.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hidden Skills */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={16} className="text-amber-400" />
                <h3 className="text-base font-bold text-white">Hidden Skill Discovery</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-300">AI DETECTED</span>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { skill: 'Technical Writing', source: 'Blog posts & documentation', confidence: 82 },
                  { skill: 'Public Speaking', source: 'IEEE paper presentation', confidence: 75 },
                  { skill: 'System Design', source: 'Complex project architecture', confidence: 70 },
                ].map(item => (
                  <div key={item.skill} className="p-4 rounded-xl bg-white/[0.02] border border-amber-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-amber-400" />
                      <p className="text-sm font-medium text-white">{item.skill}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-2">Detected from: {item.source}</p>
                    <div className="w-full h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${item.confidence}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{item.confidence}% confidence</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
