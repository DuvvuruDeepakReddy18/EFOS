import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Sparkles, Brain, AlertCircle, Star, Loader2, RefreshCw, GraduationCap, Briefcase, Award, Dna, ClipboardPaste, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore, type AnalysisResult } from '@/store/resumeStore';
import toast from 'react-hot-toast';

// We use server-side parsing to avoid client-side worker/CORS issues.
// Base64 conversion uses FileReader to prevent browser freezing.


import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore — Vite's ?url suffix bundles the file and returns its URL at build time
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

// @ts-ignore — Use the browser-specific build to avoid Node.js fs/path imports
import mammoth from 'mammoth/mammoth.browser.min.js';

export default function ResumeUpload() {
  const { isAnalyzed, result: storedResult } = useResumeStore();
  const [stage, setStage] = useState<'upload' | 'analyzing' | 'complete'>(isAnalyzed && storedResult ? 'complete' : 'upload');
  const [result, setResult] = useState<AnalysisResult | null>(storedResult);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const { user } = useAuthStore();
  const { setAnalysis, clearAnalysis } = useResumeStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAnalyzed && storedResult && stage === 'upload') {
      setResult(storedResult);
      setStage('complete');
    }
  }, [isAnalyzed, storedResult]);

  const callApi = useCallback(async (body: Record<string, string>) => {
    if (!user) { toast.error('Please log in first.'); return; }
    setStage('analyzing');
    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        if (res.status === 413) throw new Error("File too large for the AI server. Please use the 'paste text' option.");
        if (res.status === 504) throw new Error("AI Server timeout. Please try again or paste a shorter text.");
        throw new Error(`Server returned error ${res.status}. Try pasting text instead.`);
      }

      if (data.error) {
        toast.error(data.error);
        setStage('upload');
        return;
      }
      setResult(data);
      setAnalysis(data);
      setStage('complete');
      toast.success('Resume analyzed! Skill Passport & Learning Hub are now personalized.');
    } catch (err: any) {
      console.error('Analysis error:', err);
      toast.error(err.message || 'Failed to analyze. Please try again.');
      setStage('upload');
    }
  }, [user, setAnalysis]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max size is 10MB.');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = { pdf: 'pdf', docx: 'docx', txt: 'txt' };
    const fileType = typeMap[ext];

    if (!fileType) {
      toast.error('Unsupported format. Please use PDF, DOCX, or TXT.');
      return;
    }

    if (ext === 'doc') {
      toast.error('Old .doc format is not supported. Please save as .docx or .pdf.');
      return;
    }

    const loadingToast = toast.loading(`Reading ${ext.toUpperCase()} file...`);

    try {
      if (fileType === 'txt') {
        const text = await file.text();
        toast.dismiss(loadingToast);
        callApi({ resumeText: text });
      } else if (fileType === 'pdf') {
        // Safe Client-side PDF Parsing using pdfjs-dist
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            text += strings.join(' ') + '\n';
          }
          
          if (text.trim().length > 50) {
            toast.dismiss(loadingToast);
            callApi({ resumeText: text });
          } else {
            throw new Error("Extracted text is too short. PDF may be image-based.");
          }
        } catch (pdfErr: any) {
          console.error("Client-side PDF parsing failed:", pdfErr);
          toast.dismiss(loadingToast);
          toast.error("Could not read this PDF. It may be image-based or encrypted. Please use 'paste text' instead.", { duration: 6000 });
        }
      } else if (fileType === 'docx') {
        // Safe Client-side DOCX Parsing using mammoth
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value;
          
          if (text.trim().length > 50) {
            toast.dismiss(loadingToast);
            callApi({ resumeText: text });
          } else {
            throw new Error("Extracted text is too short. DOCX may be image-based.");
          }
        } catch (docxErr: any) {
          console.error("Client-side DOCX parsing failed:", docxErr);
          toast.dismiss(loadingToast);
          toast.error("Could not read this DOCX file. Please try pasting text instead.", { duration: 6000 });
        }
      } else {
        // Fallback catch-all
        const reader = new FileReader();
        reader.onload = () => {
          toast.dismiss(loadingToast);
          const base64Data = (reader.result as string).split(',')[1];
          callApi({ fileData: base64Data, fileType });
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('File read error:', err);
      toast.dismiss(loadingToast);
      toast.error('Could not read file. Try pasting text instead.');
    }
  };

  const handlePasteSubmit = () => {
    if (pasteText.trim().length < 50) {
      toast.error('Please paste at least 50 characters of resume text.');
      return;
    }
    callApi({ resumeText: pasteText });
  };

  const handleAnalyzeAnother = () => {
    clearAnalysis();
    setStage('upload');
    setResult(null);
    setPasteText('');
    setPasteMode(false);
  };

  const scoreColor = (score: number) =>
    score >= 80 ? 'text-green-400' : score >= 60 ? 'text-blue-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';

  const scoreGrad = (score: number) =>
    score >= 80 ? 'from-green-500 to-emerald-500' : score >= 60 ? 'from-blue-500 to-cyan-500' : score >= 40 ? 'from-amber-500 to-yellow-500' : 'from-red-500 to-orange-500';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">AI Resume Intelligence</h1>
        <p className="text-sm text-gray-400 mt-1">Upload your resume for real-time AI-powered analysis — powers your Skill Passport, Gap Analyzer & Learning Hub</p>
      </motion.div>

      {/* ─── UPLOAD STAGE ─── */}
      {stage === 'upload' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {!pasteMode ? (
            <>
              <label className="glass-card p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/40 transition-all group min-h-[260px] border-dashed border-2">
                <input type="file" className="hidden" accept=".pdf,.txt,.docx" onChange={handleFileUpload} />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload size={32} className="text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Drop your resume here or click to upload</h2>
                <p className="text-sm text-gray-400 mb-6">Supports PDF, DOCX, and TXT • Max 10MB</p>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 font-medium">📄 PDF</span>
                  <span className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 font-medium">📝 DOCX</span>
                  <span className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-400 font-medium">📃 TXT</span>
                </div>
              </label>
              <div className="text-center">
                <button onClick={() => setPasteMode(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white transition-all">
                  <ClipboardPaste size={14} /> Or paste resume text manually
                </button>
              </div>
            </>
          ) : (
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ClipboardPaste size={16} className="text-purple-400" /> Paste Resume Text
                </h2>
                <button onClick={() => setPasteMode(false)} className="text-xs text-gray-400 hover:text-white transition-all">
                  ← Back to file upload
                </button>
              </div>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste your full resume text here..."
                className="w-full h-64 p-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/40 resize-none"
              />
              <button onClick={handlePasteSubmit} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                <Brain size={16} /> Analyze with AI
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── ANALYZING STAGE ─── */}
      {stage === 'analyzing' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Brain size={28} className="text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">AI is analyzing your resume...</h2>
            <p className="text-sm text-gray-400">Typically takes 10-20 seconds</p>
          </div>
          <div className="max-w-md mx-auto space-y-3">
            {['Extracting text content', 'Identifying skills & proficiency levels', 'Analyzing projects & experience', 'Computing skill gaps & target roles', 'Building personalized learning plan'].map((step, i) => (
              <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}
                className="flex items-center gap-3 p-2.5 rounded-lg">
                <Loader2 size={16} className="text-blue-400 animate-spin" />
                <span className="text-sm text-gray-300">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── RESULTS STAGE ─── */}
      {stage === 'complete' && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Navigation to other pages */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <p className="text-xs text-gray-400 mb-3">✨ Your resume data is now powering these pages:</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => navigate('/student/skill-passport')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 hover:bg-blue-500/20 transition-all">
                <FileText size={14} /> Skill Passport <ArrowRight size={12} />
              </button>
              <button onClick={() => navigate('/student/skill-gap')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 hover:bg-amber-500/20 transition-all">
                <AlertCircle size={14} /> Skill Gap Analyzer <ArrowRight size={12} />
              </button>
              <button onClick={() => navigate('/student/learning-hub')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 hover:bg-green-500/20 transition-all">
                <GraduationCap size={14} /> Learning Hub <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>

          {/* Top: Score + Summary + Actions */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray="314" strokeDashoffset={314 - (314 * result.resume_score / 100)} transform="rotate(-90 60 60)" />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={result.resume_score >= 70 ? '#10B981' : '#F59E0B'} />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${scoreColor(result.resume_score)}`}>{result.resume_score}</span>
                  <span className="text-xs text-gray-400">/ 100</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Resume Score</h3>
              <p className="text-xs text-gray-400">{
                result.resume_score >= 85 ? 'Excellent — top-tier resume' :
                result.resume_score >= 70 ? 'Strong — well structured' :
                result.resume_score >= 55 ? 'Good — room for improvement' : 'Needs work — follow the tips below'
              }</p>
              <button onClick={handleAnalyzeAnother}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white transition-all">
                <RefreshCw size={12} /> Analyze another
              </button>
            </div>

            <div className="lg:col-span-2 glass-card p-6">
              <div className="mb-4 pb-4 border-b border-white/5">
                <p className="text-sm text-gray-300 leading-relaxed">{result.summary}</p>
                {result.name !== 'Unknown' && <p className="text-xs text-gray-500 mt-2">Candidate: {result.name} {result.email ? `• ${result.email}` : ''}</p>}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-amber-400" />
                <h3 className="text-base font-bold text-white">AI Improvement Tips</h3>
              </div>
              <div className="space-y-2">
                {result.improvement_tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02]">
                    {tip.type === 'tip' ? <Star size={14} className="text-amber-400 flex-shrink-0 mt-0.5" /> : <AlertCircle size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />}
                    <span className="text-sm text-gray-300">{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          {result.education && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={16} className="text-blue-400" />
                <h3 className="text-base font-bold text-white">Education</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-sm font-medium text-white">{result.education.institution}</p>
                  <p className="text-xs text-gray-400">{result.education.degree} • {result.education.year}</p>
                  {result.education.cgpa && <p className="text-xs text-blue-400 mt-1">CGPA: {result.education.cgpa}</p>}
                </div>
                {result.preferred_domains.length > 0 && (
                  <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Preferred Domains</p>
                    <div className="flex flex-wrap gap-1">{result.preferred_domains.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] text-purple-400 border border-purple-500/20">{d}</span>
                    ))}</div>
                  </div>
                )}
                {result.certifications.length > 0 && (
                  <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Certifications</p>
                    <div className="flex flex-wrap gap-1">{result.certifications.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-[10px] text-amber-400 border border-amber-500/20">{c}</span>
                    ))}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Extracted Skills */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-blue-400" />
              <h3 className="text-base font-bold text-white">Extracted Skills</h3>
              <span className="text-xs text-gray-400 ml-auto">{result.skills.length} skills detected</span>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {result.skills.map((skill, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    skill.confidence >= 0.8 ? 'bg-green-500/20 text-green-400' : skill.confidence >= 0.5 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>{skill.confidence >= 0.8 ? '✓' : skill.confidence >= 0.5 ? '~' : '?'}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{skill.name}</p>
                    <p className="text-[10px] text-gray-400">{skill.category}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      skill.level === 'Expert' ? 'bg-green-500/10 text-green-400' :
                      skill.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'
                    }`}>{skill.level}</span>
                    <p className="text-[10px] text-gray-500 mt-1">{Math.round(skill.confidence * 100)}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Projects */}
          {result.projects.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award size={16} className="text-purple-400" />
                <h3 className="text-base font-bold text-white">Projects Detected</h3>
              </div>
              <div className="space-y-3">
                {result.projects.map((proj, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scoreGrad(proj.relevance_score)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {proj.relevance_score}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{proj.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">{proj.tech_stack.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-300 border border-white/5">{t}</span>
                      ))}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {result.experience.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase size={16} className="text-green-400" />
                <h3 className="text-base font-bold text-white">Experience</h3>
              </div>
              <div className="space-y-3">
                {result.experience.map((exp, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Briefcase size={16} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{exp.role}</p>
                      <p className="text-xs text-gray-400">{exp.company} • {exp.duration} • {exp.domain}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Talent DNA */}
          {result.talent_dna && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Dna size={16} className="text-pink-400" />
                <h3 className="text-base font-bold text-white">AI-Inferred Talent DNA</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(result.talent_dna).map(([key, value]) => (
                  <div key={key} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className={`text-2xl font-bold ${scoreColor(value)}`}>{value}</div>
                    <p className="text-[10px] text-gray-400 mt-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
