import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, IndianRupee, MapPin, Factory, TrendingUp, AlertTriangle, CheckCircle2, Zap, Brain, Loader2 } from 'lucide-react';

/* ── PM Internship Scheme Policy Scenarios ── */

type CityTier = 'metro' | 'tier2' | 'tier3';

const cityTiers: Record<CityTier, { label: string; col: number; stipend: number; relocation: number; examples: string }> = {
  metro: { label: 'Metro', col: 12000, stipend: 12000, relocation: 6000, examples: 'Mumbai, Delhi, Bangalore, Hyderabad' },
  tier2: { label: 'Tier-2', col: 8000, stipend: 9000, relocation: 3000, examples: 'Pune, Jaipur, Lucknow, Coimbatore' },
  tier3: { label: 'Tier-3', col: 5000, stipend: 7000, relocation: 0, examples: 'Vizag, Raipur, Bhopal, Mysore' },
};

const supplyChainScenarios = [
  {
    company: 'Tata Motors',
    type: 'Tier-1 Supplier' as const,
    sponsored: 120,
    conversion: 68,
    avgStipend: 15000,
    skills: ['Manufacturing', 'Supply Chain', 'Quality Control', 'ERP'],
  },
  {
    company: 'Infosys',
    type: 'IT Services' as const,
    sponsored: 280,
    conversion: 72,
    avgStipend: 18000,
    skills: ['Java', 'Cloud', 'DevOps', 'Agile'],
  },
  {
    company: 'Reliance Retail',
    type: 'Retail/FMCG' as const,
    sponsored: 95,
    conversion: 45,
    avgStipend: 12000,
    skills: ['Marketing', 'Analytics', 'Inventory', 'POS Systems'],
  },
  {
    company: 'L&T Engineering',
    type: 'Infrastructure' as const,
    sponsored: 65,
    conversion: 58,
    avgStipend: 14000,
    skills: ['Civil Eng', 'AutoCAD', 'Project Mgmt', 'Safety'],
  },
];

interface PredictionResult {
  dropout_probability: number;
  risk_level: string;
  risk_percent: number;
  feature_contributions: Record<string, number>;
  model_info: { algorithm: string; n_estimators: number; training_samples: number };
}

export default function PolicySimulator() {
  const [selectedTier, setSelectedTier] = useState<CityTier>('metro');
  const [duration, setDuration] = useState(6);
  const [matchThreshold, setMatchThreshold] = useState(60);
  const [showSupplyChain, setShowSupplyChain] = useState(false);

  // AI Prediction state
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const tier = cityTiers[selectedTier];

  // Metro-adjusted stipend calculations
  const currentFlatStipend = 5000;
  const proposedStipend = tier.stipend;
  const relocationGrant = tier.col > 8000 ? tier.relocation : 0;
  const totalMonthlySupport = proposedStipend + (relocationGrant > 0 ? relocationGrant / duration : 0);
  const stipendSurvivalRatio = ((proposedStipend / tier.col) * 100).toFixed(0);
  const currentSurvivalRatio = ((currentFlatStipend / tier.col) * 100).toFixed(0);

  // Projected dropout reduction
  const dropoutCurrent = 41; // 41% from research
  const dropoutProjected = Math.max(5, Math.round(dropoutCurrent * (1 - (Number(stipendSurvivalRatio) - Number(currentSurvivalRatio)) / 100)));

  // Budget impact
  const internsPerYear = 165000;
  const annualBudgetCurrent = (currentFlatStipend * 12 * internsPerYear) / 10000000; // in Cr
  const annualBudgetProposed = (proposedStipend * duration * internsPerYear) / 10000000;

  // ── AI Prediction ──
  async function runPrediction() {
    setPredicting(true);
    setPrediction(null);
    try {
      const res = await fetch('/api/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ai_match_score: matchThreshold,
          stipend_amount: proposedStipend,
          living_cost_index: tier.col / 100,
          commute_time_mins: selectedTier === 'metro' ? 75 : selectedTier === 'tier2' ? 45 : 25,
          mentorship_hours: duration <= 6 ? 6 : 3,
          financial_need_score: selectedTier === 'metro' ? 7 : selectedTier === 'tier2' ? 5 : 3,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      setPrediction(json);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setPredicting(false);
    }
  }

  const riskColor = prediction?.risk_level === 'High' ? '#EF4444' : prediction?.risk_level === 'Medium' ? '#F59E0B' : '#10B981';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Sliders size={24} className="text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Policy Simulator</h1>
            <p className="text-sm text-gray-400">Metro-Adjusted Stipend Model • Supply Chain Integration • PM Internship Scheme</p>
          </div>
        </div>
      </motion.div>

      {/* Scenario Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSupplyChain(false)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!showSupplyChain ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
        >
          <IndianRupee size={14} className="inline mr-1.5" />Stipend Model
        </button>
        <button
          onClick={() => setShowSupplyChain(true)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showSupplyChain ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
        >
          <Factory size={14} className="inline mr-1.5" />Supply Chain Integration
        </button>
      </div>

      {!showSupplyChain ? (
        <>
          {/* ═══ METRO-ADJUSTED STIPEND CALCULATOR ═══ */}

          {/* Controls */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6">
            <h3 className="text-sm font-bold text-white mb-4">Configure Policy Parameters</h3>

            {/* City Tier Selector */}
            <div className="mb-5">
              <p className="text-xs text-gray-400 mb-2">City Tier</p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(cityTiers) as CityTier[]).map((key) => (
                  <button key={key} onClick={() => { setSelectedTier(key); setPrediction(null); }}
                    className={`p-3 rounded-xl text-center transition-all ${selectedTier === key
                      ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'}`}
                  >
                    <p className="text-sm font-bold">{cityTiers[key].label}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">{cityTiers[key].examples}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Slider */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Internship Duration</p>
                <span className="text-xs font-bold text-purple-400">{duration} months</span>
              </div>
              <input type="range" min={3} max={12} value={duration} onChange={(e) => { setDuration(Number(e.target.value)); setPrediction(null); }}
                className="w-full accent-purple-500" />
              <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                <span>3 months</span><span>6 months (optimal)</span><span>12 months (current)</span>
              </div>
            </div>

            {/* Match Threshold */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Minimum Match Score Threshold</p>
                <span className="text-xs font-bold text-blue-400">{matchThreshold}%</span>
              </div>
              <input type="range" min={30} max={90} value={matchThreshold} onChange={(e) => { setMatchThreshold(Number(e.target.value)); setPrediction(null); }}
                className="w-full accent-blue-500" />
            </div>

            {/* ── AI Predict Button ── */}
            <button
              onClick={runPrediction}
              disabled={predicting}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50"
            >
              {predicting ? (
                <><Loader2 size={16} className="animate-spin" /> Running AI Model…</>
              ) : (
                <><Brain size={16} /> Predict Dropout Risk with AI</>
              )}
            </button>
          </motion.div>

          {/* ── AI Prediction Result ── */}
          {prediction && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              className="glass-card p-6 border" style={{ borderColor: riskColor + '33' }}>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Brain size={14} className="text-purple-400" />
                AI Prediction Result
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-normal">
                  {prediction.model_info.algorithm} • {prediction.model_info.training_samples} samples
                </span>
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: riskColor + '0D', border: `1px solid ${riskColor}33` }}>
                  <p className="text-3xl font-bold" style={{ color: riskColor }}>{prediction.risk_percent}%</p>
                  <p className="text-[10px] text-gray-400 mt-1">Dropout Probability</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xl font-bold uppercase tracking-wider" style={{ color: riskColor }}>{prediction.risk_level}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Risk Level</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xl font-bold text-purple-400">{prediction.dropout_probability.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Raw Probability</p>
                </div>
              </div>

              {/* Feature Contributions */}
              <p className="text-xs text-gray-400 mb-2">Feature Contributions to Risk</p>
              <div className="space-y-2">
                {Object.entries(prediction.feature_contributions)
                  .sort(([, a], [, b]) => b - a)
                  .map(([feature, contribution]) => (
                    <div key={feature}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-gray-400 capitalize">{feature.replace(/_/g, ' ')}</span>
                        <span className="text-[10px] font-bold text-amber-400">{contribution}pts</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500" style={{ width: `${Math.min(100, contribution * 3)}%` }} />
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Results Dashboard */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Stipend Comparison */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <IndianRupee size={14} className="text-amber-400" />
                Stipend Comparison: Current vs Proposed
              </h3>
              <div className="space-y-4">
                {/* Current */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Current (Flat)</span>
                    <span className="text-lg font-bold text-red-400">₹{currentFlatStipend.toLocaleString()}/mo</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-red-500/40" style={{ width: `${currentSurvivalRatio}%` }} />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1">Survival Ratio: {currentSurvivalRatio}% of {tier.label} CoL</p>
                </div>

                {/* Proposed */}
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Proposed (Metro-Adjusted)</span>
                    <span className="text-lg font-bold text-green-400">₹{proposedStipend.toLocaleString()}/mo</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-green-500/40" style={{ width: `${stipendSurvivalRatio}%` }} />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1">Survival Ratio: {stipendSurvivalRatio}% of {tier.label} CoL</p>
                </div>

                {/* Relocation */}
                {relocationGrant > 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <MapPin size={14} className="text-blue-400" />
                    <div>
                      <p className="text-xs text-blue-400 font-bold">+₹{relocationGrant.toLocaleString()} Relocation Grant</p>
                      <p className="text-[9px] text-gray-500">One-time for CoL &gt; ₹8,000/mo</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Impact Projections */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-card p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-green-400" />
                Projected Impact
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Dropout Rate Reduction', current: `${dropoutCurrent}%`, projected: `${dropoutProjected}%`, color: dropoutProjected < 20 ? 'text-green-400' : 'text-amber-400', icon: AlertTriangle },
                  { label: 'Annual Budget Impact', current: `₹${annualBudgetCurrent.toFixed(0)} Cr`, projected: `₹${annualBudgetProposed.toFixed(0)} Cr`, color: 'text-amber-400', icon: IndianRupee },
                  { label: 'Total Monthly Support', current: `₹${currentFlatStipend}`, projected: `₹${Math.round(totalMonthlySupport).toLocaleString()}`, color: 'text-blue-400', icon: Zap },
                  { label: 'Match Quality Threshold', current: 'None', projected: `≥${matchThreshold}%`, color: 'text-purple-400', icon: CheckCircle2 },
                ].map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <item.icon size={16} className={item.color} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">{item.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-gray-500 line-through">{item.current}</p>
                      <p className={`text-sm font-bold ${item.color}`}>{item.projected}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Duration Warning */}
              {duration > 6 && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-300">Research shows durations &gt;6 months increase dropout by 15-20%. Consider splitting into 2×3-month rotational internships.</p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      ) : (
        <>
          {/* ═══ SUPPLY CHAIN INTEGRATION ═══ */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6 border border-purple-500/10">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Factory size={14} className="text-purple-400" />
              Industrial Supply Chain Sponsorship Program
            </h3>
            <p className="text-[10px] text-gray-500 mb-4">
              CSR-driven model: Top-500 companies sponsor interns at ₹15K+/mo, absorbing budget gap for the government.
              Companies gain pre-trained talent pipeline; interns get industry-relevant experience.
            </p>

            <div className="space-y-3">
              {supplyChainScenarios.map((company, i) => (
                <motion.div key={company.company} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-white">{company.company}</p>
                      <p className="text-[10px] text-gray-500">{company.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">₹{company.avgStipend.toLocaleString()}/mo</p>
                      <p className="text-[9px] text-gray-500">avg stipend</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/5">
                      <p className="text-lg font-bold text-blue-400">{company.sponsored}</p>
                      <p className="text-[9px] text-gray-500">Sponsored Slots</p>
                    </div>
                    <div className="p-2 rounded-lg bg-green-500/5">
                      <p className="text-lg font-bold text-green-400">{company.conversion}%</p>
                      <p className="text-[9px] text-gray-500">FTE Conversion</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {company.skills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-400">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/5">
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400">{supplyChainScenarios.reduce((s, c) => s + c.sponsored, 0)}</p>
                <p className="text-[9px] text-gray-500">Total Sponsored Slots</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">
                  {(supplyChainScenarios.reduce((s, c) => s + c.conversion, 0) / supplyChainScenarios.length).toFixed(0)}%
                </p>
                <p className="text-[9px] text-gray-500">Avg FTE Conversion</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-400">
                  ₹{(supplyChainScenarios.reduce((s, c) => s + c.avgStipend * c.sponsored, 0) / 10000000).toFixed(1)} Cr
                </p>
                <p className="text-[9px] text-gray-500">Annual Value</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
