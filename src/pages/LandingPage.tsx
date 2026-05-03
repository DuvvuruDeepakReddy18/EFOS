import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Brain, Sparkles, Target, Shield, Zap, Users, Building2, ArrowRight, CheckCircle2, ChevronRight, GraduationCap, BarChart3, Globe } from 'lucide-react';

function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const features = [
  { icon: Brain, title: 'AI-Powered Matching', desc: 'BERT + NLP engine matches students to internships with 95% accuracy using deep skill analysis.', color: 'from-blue-500 to-cyan-500' },
  { icon: Target, title: 'Smart Allocation', desc: 'Google OR-Tools optimization ensures fair, constraint-aware national-scale internship allocation.', color: 'from-purple-500 to-pink-500' },
  { icon: Shield, title: 'Fairness Engine', desc: 'IBM AI Fairness 360 ensures zero bias across gender, region, and institution type.', color: 'from-green-500 to-emerald-500' },
  { icon: Sparkles, title: 'Skill Passport', desc: 'Digital verified skill credentials with AI-powered resume parsing and skill gap analysis.', color: 'from-amber-500 to-orange-500' },
  { icon: Zap, title: 'Dynamic Reallocation', desc: 'Real-time re-matching when candidates drop out — next-best candidate notified in 2 minutes.', color: 'from-red-500 to-rose-500' },
  { icon: BarChart3, title: 'Gamified Learning', desc: 'Earn points, badges, and climb leaderboards while closing skill gaps with AI-curated courses.', color: 'from-indigo-500 to-violet-500' },
];

const steps = [
  { num: '01', title: 'Upload Resume', desc: 'AI parses your resume using NLP to extract skills, projects, and experience.', icon: '📄' },
  { num: '02', title: 'AI Analysis', desc: 'BERT embeddings compute your skill vector and match it against 10,000+ internships.', icon: '🧠' },
  { num: '03', title: 'Smart Match', desc: 'Multi-objective optimization selects your best-fit internships with explainable scores.', icon: '🎯' },
  { num: '04', title: 'Get Internship', desc: 'Apply, get allocated, and start your career journey with PM Scheme internships.', icon: '🚀' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-blue-500/10" style={{ background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain size={22} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">InternMatch</span>
              <span className="text-xl font-bold text-blue-400 ml-1">AI</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
            <a href="#stats" className="text-sm text-gray-400 hover:text-white transition-colors">Impact</a>
            <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">Login</Link>
            <Link to="/login" className="glow-btn text-sm !py-2.5 !px-5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 grid-bg">
        {/* Glowing orbs background */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-blue-300 tracking-wider uppercase">PM Internship Scheme • Powered by AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-white">India's Smartest</span>
              <br />
              <span className="gradient-text">Internship Platform</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              AI-powered matching engine that connects <span className="text-white font-medium">3 lakh+ students</span> with
              <span className="text-white font-medium"> 10,000+ companies</span> using NLP, machine learning, and multi-objective
              optimization — ensuring fair, transparent, and intelligent internship allocation at national scale.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link to="/login" className="glow-btn inline-flex items-center gap-2 text-base !py-3.5 !px-8">
                <GraduationCap size={18} />
                Get Started as Student
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="glow-btn glow-btn-gold inline-flex items-center gap-2 text-base !py-3.5 !px-8">
                <Building2 size={18} />
                Post Internship
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white border border-blue-500/30 hover:bg-blue-500/10 transition-all text-base font-semibold">
                <Globe size={18} />
                Admin Portal
              </Link>
            </div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="glass-card p-1 glow-border">
              <div className="bg-bg-secondary rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
                  {[
                    { label: 'AI Match Score', value: '94%', color: 'text-green-400', bg: 'from-green-500/20 to-green-500/5' },
                    { label: 'Skills Verified', value: '12/15', color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-500/5' },
                    { label: 'Talent Points', value: '2,150', color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-500/5' },
                  ].map((card) => (
                    <div key={card.label} className={`rounded-xl p-4 bg-gradient-to-br ${card.bg} border border-white/5`}>
                      <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-blue-500/10 blur-2xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 border-y border-blue-500/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 300000, suffix: '+', label: 'Students Registered', icon: Users },
            { value: 10000, suffix: '+', label: 'Partner Companies', icon: Building2 },
            { value: 95, suffix: '%', label: 'Match Accuracy', icon: Target },
            { value: 52, suffix: '+', label: 'Industry Domains', icon: Globe },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <stat.icon size={24} className="text-blue-400 mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-3">Powered by AI</p>
              <h2 className="text-4xl font-bold text-white mb-4">Intelligent Features That Set Us Apart</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Six core AI engines working together to create the most fair, efficient, and personalized internship allocation system in India.</p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card glass-card-hover p-8 cursor-default group h-full flex flex-col"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shrink-0`}>
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed grow">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-blue-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-bold text-amber-400 tracking-wider uppercase mb-4">
                Simple Process
              </span>
              <h2 className="text-4xl font-bold text-white mb-4">How InternMatch AI Works</h2>
            </motion.div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative h-full"
              >
                <div className="glass-card p-6 md:p-8 text-center h-full flex flex-col items-center justify-start z-10 relative">
                  <div className="text-5xl mb-5">{step.icon}</div>
                  <div className="text-xs font-bold text-blue-400 mb-2 tracking-widest uppercase">{step.num}</div>
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-[40%] -right-5 transform -translate-y-1/2 z-0">
                    <ChevronRight size={24} className="text-blue-500/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Partnership Banner */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <span className="text-xs font-semibold text-amber-300 tracking-wider uppercase">🇮🇳 Government of India Initiative</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">PM Internship Scheme</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                InternMatch AI is the official smart allocation engine for India's PM Internship Scheme,
                ensuring every student gets the right opportunity through transparent, AI-driven matching.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {['Fair Allocation', 'Transparent AI', 'National Scale', 'Real-time Matching'].map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300">
                    <CheckCircle2 size={12} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">InternMatch AI</span>
          </div>
          <p className="text-xs text-gray-500">
            SMARTATHON 2.0 | Black Squad | AI-Based Smart Allocation Engine for PM Internship Scheme
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">Privacy</span>
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">Terms</span>
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
