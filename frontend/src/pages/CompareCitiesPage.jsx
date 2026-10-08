import React, { useState, useEffect } from 'react';
import { useIssues } from '../context/IssueContext';
import { api } from '../services/api';
import {
  GitCompare,
  TrendingUp,
  ShieldCheck,
  Leaf,
  Activity,
  Cpu,
  Zap,
  Compass,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function CompareCitiesPage({ setActiveTab }) {
  const { setSelectedCity } = useIssues();
  const [scenario, setScenario] = useState('current_trend');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Head-to-Head selection
  const [cityA, setCityA] = useState('Gurugram');
  const [cityB, setCityB] = useState('Bhubaneswar');

  const fetchComparison = async (sc) => {
    setLoading(true);
    try {
      const res = await api.getReadiness(sc);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison(scenario);
  }, [scenario]);

  const citiesList = ['Gurugram', 'Delhi', 'Noida', 'Bengaluru', 'Bhubaneswar'];

  const cityAData = data?.cities?.[cityA];
  const cityBData = data?.cities?.[cityB];

  return (
    <div className="space-y-8 py-4 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest flex items-center gap-1">
              <GitCompare className="w-3.5 h-3.5" />
              <span>Comparative Benchmarking</span>
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Prototype / Demonstration Data
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Compare Cities
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Evaluate infrastructure health, sustainability, mobility, and 2070 projected readiness across all five monitored municipalities side-by-side.
          </p>
        </div>

        {/* Scenario Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {[
            { id: 'conservative', label: 'Conservative' },
            { id: 'current_trend', label: 'Current Trend' },
            { id: 'accelerated', label: 'Accelerated' }
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                scenario === sc.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Five-City Comparative Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>5-City Indicator & Readiness Comparison Table</span>
          </h2>
          <span className="text-xs font-mono text-cyan-400 font-bold">
            Scenario: <span className="capitalize">{scenario.replace('_', ' ')}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-3">City</th>
                <th className="py-3 px-3">Role / Profile</th>
                <th className="py-3 px-3 text-right">Infra Health</th>
                <th className="py-3 px-3 text-right">Sustainability</th>
                <th className="py-3 px-3 text-right">Mobility</th>
                <th className="py-3 px-3 text-right">Technology</th>
                <th className="py-3 px-3 text-right">Resilience</th>
                <th className="py-3 px-3 text-right">Urban Planning</th>
                <th className="py-3 px-3 text-right text-cyan-400 font-bold">2026 Score</th>
                <th className="py-3 px-3 text-right text-cyan-400 font-bold">2070 Projected</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {citiesList.map((cName) => {
                const c = data?.cities?.[cName];
                if (!c) return null;
                const isLeading = data?.leading_city === cName;

                return (
                  <tr
                    key={cName}
                    className={`hover:bg-slate-800/40 transition group ${
                      isLeading ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                      <span>{cName}</span>
                      {isLeading && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Highest Projected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                      {cName === 'Gurugram'
                        ? 'Primary Demo City'
                        : cName === 'Bengaluru'
                        ? 'Tech Metropolitan'
                        : cName === 'Bhubaneswar'
                        ? 'Planned Growth Hub'
                        : cName === 'Delhi'
                        ? 'National Capital'
                        : 'Satellite Grid City'}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium">
                      {c.pillars?.infrastructure_health}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium">
                      {c.pillars?.sustainability}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium">
                      {c.pillars?.mobility}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium">
                      {c.pillars?.technology_readiness}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium">
                      {c.pillars?.climate_resilience}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium">
                      {c.pillars?.urban_planning}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-300">
                      {c.current_readiness_score}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-extrabold text-cyan-400 text-sm">
                      {c.projections?.[2070] || c.current_readiness_score}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedCity(cName);
                          setActiveTab('readiness');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-[11px] font-bold transition cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Head-to-Head Comparison Panel */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              <span>Head-to-Head Metric Duel</span>
            </h3>
            <p className="text-xs text-slate-400">
              Compare any two cities across all 6 core future readiness dimensions.
            </p>
          </div>

          {/* Selectors */}
          <div className="flex items-center gap-3">
            <select
              value={cityA}
              onChange={(e) => setCityA(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold focus:outline-none"
            >
              {citiesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <span className="text-xs font-bold text-slate-500">VS</span>

            <select
              value={cityB}
              onChange={(e) => setCityB(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-indigo-500/40 text-indigo-300 text-xs font-bold focus:outline-none"
            >
              {citiesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Head-to-Head Comparison Grid */}
        {cityAData && cityBData && (
          <div className="space-y-4">
            {/* Top Score Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-white">{cityA}</h4>
                  <p className="text-xs text-slate-400">2070 Projected Score</p>
                </div>
                <div className="text-3xl font-black font-mono text-cyan-400">
                  {cityAData.projections?.[2070]}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-white">{cityB}</h4>
                  <p className="text-xs text-slate-400">2070 Projected Score</p>
                </div>
                <div className="text-3xl font-black font-mono text-indigo-400">
                  {cityBData.projections?.[2070]}
                </div>
              </div>
            </div>

            {/* Pillar Breakdown Comparison Bars */}
            <div className="space-y-3 pt-2">
              {[
                { key: 'infrastructure_health', label: 'Infrastructure Health' },
                { key: 'sustainability', label: 'Sustainability & Green' },
                { key: 'mobility', label: 'Mobility & Congestion' },
                { key: 'technology_readiness', label: 'Technology Readiness' },
                { key: 'climate_resilience', label: 'Climate Resilience' },
                { key: 'urban_planning', label: 'Urban Planning' }
              ].map((p) => {
                const valA = cityAData.pillars?.[p.key] || 0;
                const valB = cityBData.pillars?.[p.key] || 0;
                const diff = valA - valB;

                return (
                  <div key={p.key} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-cyan-400">{valA}</span>
                      <span className="font-bold text-slate-300">{p.label}</span>
                      <span className="font-mono font-bold text-indigo-400">{valB}</span>
                    </div>

                    {/* Dual comparison bar centered */}
                    <div className="flex items-center gap-2 h-2.5 bg-slate-900 rounded-full overflow-hidden px-1">
                      <div className="flex-1 flex justify-end">
                        <div
                          className="h-1.5 bg-cyan-400 rounded-full"
                          style={{ width: `${(valA / 100) * 100}%` }}
                        />
                      </div>
                      <div className="w-1 h-3 bg-slate-700" />
                      <div className="flex-1 flex justify-start">
                        <div
                          className="h-1.5 bg-indigo-400 rounded-full"
                          style={{ width: `${(valB / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Analytical Narrative & Disclaimers */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 text-xs text-slate-400">
        <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Understanding Comparative Dynamics</span>
        </h4>
        <p className="leading-relaxed">
          Established technology metropolitan centers such as Bengaluru lead in digital infrastructure and IoT capabilities, but face challenges from legacy congestion and rapid densification. Conversely, planned centers such as Bhubaneswar exhibit stronger planned-development and climate resilience scores.
        </p>
        <p className="italic text-[11px] text-slate-500">
          Note: This comparison models scenario trajectories based on current indicators and simulated flaw penalties; it does not constitute an empirical guarantee of future municipal governance outcomes.
        </p>
      </div>
    </div>
  );
}
