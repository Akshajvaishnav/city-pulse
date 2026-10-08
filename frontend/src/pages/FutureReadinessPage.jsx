import React, { useState, useEffect } from 'react';
import { useIssues } from '../context/IssueContext';
import { api } from '../services/api';
import {
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  Leaf,
  Compass,
  AlertTriangle,
  Info,
  Sliders,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Layers,
  Activity
} from 'lucide-react';

export default function FutureReadinessPage({ setActiveTab }) {
  const { selectedCity, setSelectedCity } = useIssues();
  const [scenario, setScenario] = useState('current_trend');
  const [targetYear, setTargetYear] = useState(2070);
  const [readinessData, setReadinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customizingWeights, setCustomizingWeights] = useState(false);

  // Editable Pillar Weights (Normalized to 100%)
  const [weights, setWeights] = useState({
    infrastructure_health: 25,
    sustainability: 20,
    mobility: 15,
    technology_readiness: 15,
    climate_resilience: 15,
    urban_planning: 10,
  });

  const years = [2026, 2035, 2045, 2055, 2065, 2070];

  const fetchReadiness = async (sc = scenario, w = weights) => {
    setLoading(true);
    try {
      const payload = {
        scenario: sc,
        weights: w
      };
      const res = await api.calculateReadiness(payload);
      setReadinessData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness(scenario, weights);
  }, [scenario]);

  const handleWeightChange = (key, val) => {
    const num = Math.max(0, Math.min(100, parseInt(val) || 0));
    setWeights((prev) => ({ ...prev, [key]: num }));
  };

  const handleApplyWeights = () => {
    fetchReadiness(scenario, weights);
  };

  const handleResetWeights = () => {
    const defaults = {
      infrastructure_health: 25,
      sustainability: 20,
      mobility: 15,
      technology_readiness: 15,
      climate_resilience: 15,
      urban_planning: 10,
    };
    setWeights(defaults);
    fetchReadiness(scenario, defaults);
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  // Helper to get score for a year from projections array
  const getCityYearScore = (cProfile, yr) => {
    if (!cProfile || !cProfile.projections) return 0;
    const yearIdx = years.indexOf(yr);
    const scenarioArr = cProfile.projections[scenario] || cProfile.projections['current_trend'];
    if (Array.isArray(scenarioArr) && yearIdx >= 0 && yearIdx < scenarioArr.length) {
      return scenarioArr[yearIdx];
    }
    return cProfile.readiness_score || 0;
  };

  // Active City Data
  const currentCityProfile = readinessData?.cities?.[selectedCity !== 'All' ? selectedCity : 'Gurugram'] ||
    readinessData?.cities?.['Gurugram'];

  // City colors for charts
  const cityColors = {
    'Gurugram': '#06b6d4', // Cyan
    'Delhi': '#f59e0b',    // Amber
    'Noida': '#8b5cf6',    // Violet
    'Bengaluru': '#10b981',// Emerald
    'Bhubaneswar': '#3b82f6'// Blue
  };

  return (
    <div className="space-y-8 py-4 font-sans">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest">
              Analytical Modeling
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Prototype / Demonstration Data
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Future City Readiness</span>
            <span className="text-cyan-400 font-mono text-2xl font-light">— 2070 Scenario</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate long-term urban trajectories across 5 key metropolitan regions using multi-indicator weighted modeling and transparent predictive scenario assumptions.
          </p>
        </div>

        {/* Global Mandatory Analytical Disclaimer Callout */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 max-w-md text-xs text-slate-400 space-y-1.5 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Analytical Scenario Notice</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-400">
            {readinessData?.disclaimer ||
              'The 2070 projection is an analytical scenario, not a guaranteed prediction. Results depend on indicators, data quality, assumptions and weighting used by the system.'}
          </p>
        </div>
      </div>

      {/* Scenario Selector & Year Selector Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Scenario:</span>
          </span>

          {[
            { id: 'conservative', label: 'Conservative Scenario', desc: 'Slower infrastructure improvements' },
            { id: 'current_trend', label: 'Current-Trend Scenario', desc: 'Steady current progression' },
            { id: 'accelerated', label: 'Accelerated Development', desc: 'Aggressive green & tech capital allocation' }
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                scenario === sc.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25 scale-[1.02]'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{sc.label}</span>
            </button>
          ))}
        </div>

        {/* Target Year Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Year:</span>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            {years.map((yr) => (
              <button
                key={yr}
                onClick={() => setTargetYear(yr)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
                  targetYear === yr
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary City Focus Cards (Default: Gurugram, Bengaluru, Bhubaneswar) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {['Gurugram', 'Delhi', 'Noida', 'Bengaluru', 'Bhubaneswar'].map((cityName) => {
          const cProfile = readinessData?.cities?.[cityName];
          const isSelected = (selectedCity === cityName) || (selectedCity === 'All' && cityName === 'Gurugram');
          const projectedScore = getCityYearScore(cProfile, targetYear);
          const baselineScore = getCityYearScore(cProfile, 2026);
          const delta = Math.round(projectedScore - baselineScore);

          return (
            <div
              key={cityName}
              onClick={() => setSelectedCity(cityName)}
              className={`p-5 rounded-2xl border transition cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500/60 shadow-xl glow-cyan'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  {cityName === 'Gurugram' ? 'Primary Demo' : cityName === 'Bengaluru' ? 'Tech Hub' : cityName === 'Bhubaneswar' ? 'Planned Model' : 'Metro'}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cityColors[cityName] }}
                />
              </div>

              <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition">
                {cityName}
              </h3>

              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                    {projectedScore}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {targetYear} Projected Readiness
                  </p>
                </div>
                {delta !== 0 && (
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    delta > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3 border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${projectedScore}%`,
                    backgroundColor: cityColors[cityName]
                  }}
                />
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Flaws: {cProfile?.infrastructure_flaw_count ?? 0} active</span>
                <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition flex items-center">
                  Profile <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projection Chart & Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2026 → 2070 Projection Multi-Line Graph */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Long-Range Modeling</span>
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Future Readiness Projection: 2026 → 2070
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              Scenario: <strong className="text-cyan-400 capitalize">{scenario.replace('_', ' ')}</strong>
            </span>
          </div>

          <p className="text-xs text-slate-400 italic">
            This projection illustrates potential future readiness under the selected assumptions and normalized baseline data.
          </p>

          {/* Visualization Graph Component (SVG Multi-Line with Tooltips) */}
          <div className="w-full h-72 sm:h-80 relative flex flex-col justify-between py-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240">
              {/* Grid Lines */}
              {[40, 60, 80, 100].map((val, idx) => {
                const y = 220 - ((val - 30) / 70) * 200;
                return (
                  <g key={val}>
                    <line
                      x1="60"
                      y1={y}
                      x2="680"
                      y2={y}
                      stroke="rgba(51, 65, 85, 0.4)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="45"
                      y={y + 4}
                      fill="#64748b"
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Year X-Axis Labels */}
              {years.map((yr, idx) => {
                const x = 70 + (idx / (years.length - 1)) * 600;
                return (
                  <g key={yr}>
                    <line
                      x1={x}
                      y1="220"
                      x2={x}
                      y2="225"
                      stroke="#475569"
                    />
                    <text
                      x={x}
                      y="238"
                      fill={targetYear === yr ? '#38bdf8' : '#94a3b8'}
                      fontWeight={targetYear === yr ? 'bold' : 'normal'}
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {yr}
                    </text>
                  </g>
                );
              })}

              {/* City Trend Lines */}
              {readinessData?.cities &&
                Object.entries(readinessData.cities).map(([cName, cData]) => {
                  const points = years.map((yr, idx) => {
                    const score = getCityYearScore(cData, yr);
                    const x = 70 + (idx / (years.length - 1)) * 600;
                    const y = 220 - ((score - 30) / 70) * 200;
                    return `${x},${y}`;
                  }).join(' ');

                  const isFocused = selectedCity === cName || selectedCity === 'All';

                  return (
                    <g key={cName}>
                      <polyline
                        fill="none"
                        stroke={cityColors[cName] || '#06b6d4'}
                        strokeWidth={isFocused ? (selectedCity === cName ? 3.5 : 2.5) : 1}
                        strokeOpacity={isFocused ? (selectedCity === cName ? 1 : 0.7) : 0.25}
                        points={points}
                      />
                      {/* Circle Knots on Years */}
                      {years.map((yr, idx) => {
                        const score = getCityYearScore(cData, yr);
                        const x = 70 + (idx / (years.length - 1)) * 600;
                        const y = 220 - ((score - 30) / 70) * 200;
                        return (
                          <circle
                            key={yr}
                            cx={x}
                            cy={y}
                            r={targetYear === yr ? (selectedCity === cName ? 6 : 4) : 3}
                            fill={cityColors[cName] || '#06b6d4'}
                            stroke="#030712"
                            strokeWidth="2"
                            opacity={isFocused ? 1 : 0.3}
                          />
                        );
                      })}
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Interactive Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {['Gurugram', 'Delhi', 'Noida', 'Bengaluru', 'Bhubaneswar'].map((cn) => (
                <button
                  key={cn}
                  onClick={() => setSelectedCity(cn)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    selectedCity === cn
                      ? 'bg-slate-800 text-white font-bold ring-1 ring-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cityColors[cn] }}
                  />
                  <span>{cn}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('compare')}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Full Comparison Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Future Readiness Insights Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Analytical Evaluation</span>
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Future Readiness Insights
              </h2>
            </div>

            {/* Synthesized Leading Statement with compliant phrasing */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-2">
              <p className="font-semibold text-cyan-200 leading-relaxed">
                {readinessData?.insights?.summary_statement ||
                  `Under the selected ${scenario.replace('_', ' ')} scenario and available indicators, ${readinessData?.insights?.leading_city || 'Bhubaneswar'} currently shows the highest projected future-readiness score among the cities in this demonstration.`}
              </p>
            </div>

            {/* City-Specific Strengths & Challenges */}
            {currentCityProfile && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {currentCityProfile.city} Assessment Profile
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    Score: {currentCityProfile.readiness_score}/100
                  </span>
                </div>

                {/* Strengths */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Key Projected Strengths</span>
                  </span>
                  <div className="space-y-1.5">
                    {currentCityProfile.strengths?.map((st, i) => (
                      <div
                        key={i}
                        className="text-xs text-slate-300 bg-slate-950/70 p-2 rounded-lg border border-slate-800/70 flex items-start gap-2"
                      >
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Areas Requiring Investment</span>
                  </span>
                  <div className="space-y-1.5">
                    {currentCityProfile.challenges?.map((ch, i) => (
                      <div
                        key={i}
                        className="text-xs text-slate-300 bg-slate-950/70 p-2 rounded-lg border border-slate-800/70 flex items-start gap-2"
                      >
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 italic">
            Evaluations dynamically derived from normalized indicator metrics and active defect reports.
          </div>
        </div>
      </div>

      {/* 6 Pillars Breakdown & Weight Configurator */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>Transparent Pillar Scoring</span>
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Indicator Pillars & Configurable Weighting System
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust weights to stress-test how priorities shift overall projected readiness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomizingWeights(!customizingWeights)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{customizingWeights ? 'Close Customizer' : 'Customize Weights'}</span>
            </button>
            {customizingWeights && (
              <button
                onClick={handleResetWeights}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Reset Default
              </button>
            )}
          </div>
        </div>

        {/* Weights Customizer Sliders (Shown when toggled) */}
        {customizingWeights && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase">Weight Distribution</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                totalWeight === 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                Total: {totalWeight}% {totalWeight !== 100 && '(Normalizes proportionally)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'infrastructure_health', label: 'Infrastructure Health', icon: ShieldCheck },
                { key: 'sustainability', label: 'Sustainability & Green', icon: Leaf },
                { key: 'mobility', label: 'Mobility & Transit', icon: Activity },
                { key: 'technology_readiness', label: 'Technology Readiness', icon: Cpu },
                { key: 'climate_resilience', label: 'Climate Resilience', icon: Zap },
                { key: 'urban_planning', label: 'Urban Planning', icon: Compass }
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.key} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{p.label}</span>
                      </span>
                      <span className="font-mono font-bold text-cyan-400">{weights[p.key]}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={weights[p.key]}
                      onChange={(e) => handleWeightChange(p.key, e.target.value)}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleApplyWeights}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg glow-cyan cursor-pointer"
              >
                Recalculate Projections with New Weights
              </button>
            </div>
          </div>
        )}

        {/* Active City 6 Pillars Grid Display */}
        {currentCityProfile?.pillars && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Infrastructure Health',
                score: currentCityProfile.pillars.infrastructure ?? 70,
                weight: weights.infrastructure_health,
                desc: 'Road quality, defect rate & active flaw penalty',
                color: '#06b6d4'
              },
              {
                title: 'Sustainability',
                score: currentCityProfile.pillars.sustainability ?? 70,
                weight: weights.sustainability,
                desc: 'Green cover, waste circularity & water management',
                color: '#10b981'
              },
              {
                title: 'Mobility & Transit',
                score: currentCityProfile.pillars.mobility ?? 70,
                weight: weights.mobility,
                desc: 'Metro density, congestion index & walkability',
                color: '#f59e0b'
              },
              {
                title: 'Technology Readiness',
                score: currentCityProfile.pillars.technology ?? 70,
                weight: weights.technology_readiness,
                desc: 'IoT telemetry, municipal digital services & AI integration',
                color: '#6366f1'
              },
              {
                title: 'Climate Resilience',
                score: currentCityProfile.pillars.resilience ?? 70,
                weight: weights.climate_resilience,
                desc: 'Flood mitigation, drainage & disaster preparedness',
                color: '#ec4899'
              },
              {
                title: 'Urban Planning',
                score: currentCityProfile.pillars.planning ?? 70,
                weight: weights.urban_planning,
                desc: 'Master planning, growth expansion capacity & grid zoning',
                color: '#3b82f6'
              }
            ].map((col) => (
              <div
                key={col.title}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {col.title}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Weight: {col.weight}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-white font-mono">
                    {col.score}
                    <span className="text-xs text-slate-400 font-normal">/100</span>
                  </div>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: col.color }}
                  >
                    {col.score >= 80 ? 'Optimal' : col.score >= 70 ? 'Moderate' : 'Constrained'}
                  </span>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${col.score}%`, backgroundColor: col.color }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">{col.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-white">Curious about underlying calculation mechanics?</h4>
          <p className="text-xs text-slate-400">
            Review detailed equations, normalization formulas, and demonstration limitations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('compare')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Compare All 5 Cities
          </button>
          <button
            onClick={() => setActiveTab('methodology')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg glow-cyan"
          >
            View Academic Methodology
          </button>
        </div>
      </div>
    </div>
  );
}
