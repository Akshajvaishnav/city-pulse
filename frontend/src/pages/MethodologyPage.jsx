import React from 'react';
import {
  FileText,
  Sliders,
  ShieldCheck,
  Leaf,
  Activity,
  Cpu,
  Zap,
  Compass,
  AlertTriangle,
  Layers,
  Database,
  Calculator,
  Code
} from 'lucide-react';

export default function MethodologyPage() {
  const pillars = [
    {
      name: 'Infrastructure Health',
      defaultWeight: '25%',
      icon: ShieldCheck,
      color: '#06b6d4',
      indicators: [
        { name: 'Road Surface & Pothole Defect Rate', range: '0–100', note: 'Dynamically penalized by active reported flaws' },
        { name: 'Street Lighting Coverage & Uptime', range: '0–100', note: 'Evaluates smart LED density and outage reporting' },
        { name: 'Water Distribution & Drainage Maintenance', range: '0–100', note: 'Pipeline pressure integrity and flood resilience' }
      ]
    },
    {
      name: 'Sustainability & Green Infrastructure',
      defaultWeight: '20%',
      icon: Leaf,
      color: '#10b981',
      indicators: [
        { name: 'Urban Green Canopy & Park Ratio', range: '0–100', note: 'Public green area per capita and tree density' },
        { name: 'Solid Waste Segregation & Circular Processing', range: '0–100', note: 'Composting, landfill diversion and recycling' },
        { name: 'Renewable Clean Energy Integration', range: '0–100', note: 'Rooftop solar, EV grid capability, energy efficiency' }
      ]
    },
    {
      name: 'Mobility & Transit',
      defaultWeight: '15%',
      icon: Activity,
      color: '#f59e0b',
      indicators: [
        { name: 'Public Transit Network Density', range: '0–100', note: 'Metro rail, feeder buses, dedicated transit corridors' },
        { name: 'Road Congestion & Peak Delay Factor', range: '0–100', note: 'Average commute time and peak-hour delay index' },
        { name: 'Walkability & Micro-mobility Infrastructure', range: '0–100', note: 'Protected bike paths, sidewalks, pedestrian plazas' }
      ]
    },
    {
      name: 'Technology & Smart Services',
      defaultWeight: '15%',
      icon: Cpu,
      color: '#6366f1',
      indicators: [
        { name: 'Smart City Sensor / IoT Mesh', range: '0–100', note: 'Automated air quality, traffic monitoring and water telemetry' },
        { name: 'Municipal Citizen Digital Services', range: '0–100', note: 'E-governance portal uptime and ticket resolution speed' },
        { name: 'AI & Automation Automation Readiness', range: '0–100', note: 'Automated defect detection and intelligent signal networks' }
      ]
    },
    {
      name: 'Climate Resilience',
      defaultWeight: '15%',
      icon: Zap,
      color: '#ec4899',
      indicators: [
        { name: 'Urban Flood Management & Storm Drainage', range: '0–100', note: 'Retention capacity during extreme precipitation' },
        { name: 'Heat Island Mitigation Factor', range: '0–100', note: 'Cool roofs, water bodies and reflective surfaces' },
        { name: 'Emergency & Disaster Response Readiness', range: '0–100', note: 'Rapid incident mobilization and emergency backup systems' }
      ]
    },
    {
      name: 'Urban Planning & Future Growth',
      defaultWeight: '10%',
      icon: Compass,
      color: '#3b82f6',
      indicators: [
        { name: 'Master Plan Adherence & Gridded Zoning', range: '0–100', note: 'Planned arterial layout and regulated mixed-use zones' },
        { name: 'Population Influx Capacity & Buffer', range: '0–100', note: 'Housing headroom and utility expansion scalability' },
        { name: 'Long-term Infrastructure Capital Pipeline', range: '0–100', note: 'Committed multi-decade capital improvement plans' }
      ]
    }
  ];

  return (
    <div className="space-y-8 py-4 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-800">
        <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-widest inline-block">
          Academic Research Framework
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          System Methodology & Data Transparency
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Comprehensive documentation of mathematical formulas, indicator scoring criteria, scenario assumptions, and data limitations powering the platform.
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Academic & Analytical Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          The 2070 projection is an <strong>analytical scenario</strong>, not a guaranteed empirical prediction. Projections illustrate potential urban readiness under clearly defined mathematical assumptions, normalized indicator weights, and prototype demonstration data. The system does not assert certainty regarding long-term municipal governance outcomes.
        </p>
      </div>

      {/* Mathematical Formulation Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Mathematical Scoring Model</h2>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            The <strong className="text-white">Future Readiness Score (R₀)</strong> for any city is evaluated as the normalized weighted sum of the six foundational pillars, where each pillar is an arithmetic mean of its underlying indicators:
          </p>

          <div className="p-4 bg-slate-950 rounded-xl font-mono text-cyan-300 text-center border border-slate-800 text-sm">
            R₀ = Σ [ wᵢ × Pᵢ ] - Δ(Active Flaws)
          </div>

          <p>
            Where:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
            <li><strong className="text-slate-200">Pᵢ</strong> represents the normalized performance score (0 to 100) of pillar i.</li>
            <li><strong className="text-slate-200">wᵢ</strong> represents the user-configured weight for pillar i, normalized such that Σ wᵢ = 1.0.</li>
            <li><strong className="text-slate-200">Δ(Active Flaws)</strong> represents a dynamic deduction calculated from active unresolved high/medium severity reports:
              <span className="font-mono text-cyan-400 ml-1">min(10, active_flaws × 0.4)</span>.
            </li>
          </ul>

          <h3 className="text-sm font-bold text-white pt-2">2026 → 2070 Scenario Trajectory Formula</h3>
          <p>
            Long-term trajectories between base year t₀ = 2026 and target year t are projected using asymptotic logarithmic growth models that reflect diminishing returns on urban infrastructure maturity:
          </p>

          <div className="p-4 bg-slate-950 rounded-xl font-mono text-cyan-300 text-center border border-slate-800 text-sm">
            R(t) = min( 98, R₀ + α × (100 - R₀) × ln( 1 + (t - 2026) / 44 ) )
          </div>

          <p>
            Where the scenario growth rate coefficient α varies by policy regime:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200">Conservative</span>
              <p className="text-[11px] text-slate-400 font-mono mt-1">α = 0.35 (Slow capital expenditure, high maintenance backlog)</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-cyan-400">Current-Trend</span>
              <p className="text-[11px] text-slate-400 font-mono mt-1">α = 0.55 (Historical capital deployment pace)</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-emerald-400">Accelerated</span>
              <p className="text-[11px] text-slate-400 font-mono mt-1">α = 0.75 (Aggressive smart-city, clean energy, and transit investment)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Pillars Specification Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">The Six Readiness Pillars & Indicators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.name} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: p.color }} />
                    <h3 className="text-xs font-bold text-white uppercase">{p.name}</h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Default: {p.defaultWeight}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {p.indicators.map((ind, i) => (
                    <div key={i} className="text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{ind.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{ind.range}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ind.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actual Data vs Demonstration Data */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Database className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Data Sourcing & Demonstration Notice</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400">Actual Real-Time Functional Components</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>PyTorch YOLOv8 neural network inference on uploaded citizen imagery.</li>
              <li>Bounding box extraction, flaw confidence calculation, and defect classification.</li>
              <li>Geospatial coordinates and Leaflet interactive OpenStreetMap pins.</li>
              <li>Dynamic SQL database storage and status transitions (Pending → In Progress → Resolved).</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400">Demonstration & Prototype Calibration Data</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Baseline sustainability, mobility, and resilience index values are demonstration values calibrated from open municipal development benchmarks.</li>
              <li>Sample reported flaws in Gurugram, Bengaluru, Bhubaneswar, Delhi, and Noida represent simulated prototype scenarios.</li>
              <li>Projections serve as illustrative stress-testing models for research and academic evaluation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
