import React from 'react';
import {
  Shield,
  ArrowRight,
  Camera,
  Activity,
  MapPin,
  CheckCircle2,
  Cpu,
  Zap,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  Smartphone,
  Radio,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import DefectIcon from '../components/DefectIcon';
import { useIssues } from '../context/IssueContext';

export default function LandingPage({ setActiveTab }) {
  const { statistics } = useIssues();

  const flawTypes = [
    {
      title: 'Potholes',
      desc: 'Critical asphalt depressions causing vehicle axle damage and fatal accident risks on city arterials.',
      severity: 'High Priority',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: 'Pothole'
    },
    {
      title: 'Road Damage & Cracks',
      desc: 'Longitudinal, transverse, and alligator cracking leading to structural roadbed degradation.',
      severity: 'Medium Priority',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: 'Road Damage'
    },
    {
      title: 'Broken Street Lights',
      desc: 'Non-functional luminaires and damaged electrical poles creating pedestrian and traffic hazards at night.',
      severity: 'High Priority',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: 'Broken Street Light'
    },
    {
      title: 'Garbage Overflow',
      desc: 'Overflowing municipal dumpsters and uncollected public waste posing severe sanitary risks.',
      severity: 'Medium Priority',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: 'Garbage Overflow'
    },
    {
      title: 'Water Leakage',
      desc: 'Subsurface water pipe ruptures causing erosion, sinkholes, and civic water wastage.',
      severity: 'High Priority',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: 'Water Leakage'
    },
    {
      title: 'Damaged Traffic Signs',
      desc: 'Obstructed, bent, or missing regulatory traffic signage compromising transit safety.',
      severity: 'Low Priority',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: 'Damaged Sign'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Capture & Upload',
      desc: 'Citizens or automated municipal patrol vehicles capture high-resolution imagery of defects.'
    },
    {
      step: '02',
      title: 'AI Computer Vision',
      desc: 'Neural networks detect defects, calculate confidence scores, and generate bounding box localization.'
    },
    {
      step: '03',
      title: 'Geotagging & Severity',
      desc: 'Automated GPS mapping attaches coordinates, sector boundaries, and algorithmic priority scores.'
    },
    {
      step: '04',
      title: 'Central Dispatch',
      desc: 'Maintenance work orders are automatically routed to the responsible municipal department.'
    },
    {
      step: '05',
      title: 'Resolution & Audit',
      desc: 'Repairs are completed, verified on-site, and logged into the permanent immutable lifecycle timeline.'
    }
  ];

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-lg glow-cyan animate-in fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300 tracking-wide uppercase">
              Next-Gen Urban AI Platform • Smart City 2026
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Automated Infrastructure Flaw Detection & Incident Lifecycle
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Empowering municipal authorities and smart cities with computer-vision intelligence to detect, classify, prioritize, and resolve urban road damage, broken streetlights, and sanitation hazards in real-time.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('report')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl glow-cyan flex items-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Report an Infrastructure Issue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 shadow-lg flex items-center gap-2 transition cursor-pointer"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Launch Live Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('detect')}
              className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-cyan-300 font-bold text-sm border border-cyan-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Test AI Detection Scanner</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-14 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-center">
            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Total Reported</p>
            <p className="text-3xl font-black text-white font-mono">{statistics?.total_issues || 128}</p>
            <p className="text-[11px] text-cyan-400 mt-1 font-medium">City-wide Incidents</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-center">
            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Active Work Orders</p>
            <p className="text-3xl font-black text-amber-400 font-mono">{statistics?.in_progress || 31}</p>
            <p className="text-[11px] text-slate-400 mt-1">Crews Deployed</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-center">
            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Resolved Rate</p>
            <p className="text-3xl font-black text-emerald-400 font-mono">{statistics?.resolution_rate || 78.4}%</p>
            <p className="text-[11px] text-emerald-400/80 mt-1">Verified Fixed</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-center">
            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Avg Resolution Time</p>
            <p className="text-3xl font-black text-cyan-400 font-mono">{statistics?.avg_resolution_time_days || 2.4}d</p>
            <p className="text-[11px] text-slate-400 mt-1">SLA Turnaround</p>
          </div>
        </div>
      </section>

      {/* How The System Works */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            End-To-End Operational Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Detect → Locate → Classify → Prioritize → Monitor → Resolve
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            From initial citizen photograph or automated CCTV frame to completed municipal civil works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((s, idx) => (
            <div
              key={s.step}
              className="relative p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-3 hover:border-cyan-500/40 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm group-hover:bg-cyan-500/20 transition">
                {s.step}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                {s.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Monitored Flaw Types */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Defect Taxonomy
            </span>
            <h2 className="text-3xl font-extrabold text-white">Monitored Infrastructure Defects</h2>
          </div>
          <button
            onClick={() => setActiveTab('detect')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Test Defect Classification Models</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {flawTypes.map((flaw) => (
            <div
              key={flaw.title}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40 transition">
                  <DefectIcon type={flaw.icon} className="w-6 h-6" />
                </div>
                <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border ${flaw.badgeColor}`}>
                  {flaw.severity}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition mb-1">
                  {flaw.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{flaw.desc}</p>
              </div>

              <button
                onClick={() => setActiveTab('detect')}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Run Scanner Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits & Future Scope */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Benefits */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Strategic Advantages
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1">Smart City Benefits</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">85% Faster Hazard Triage</h4>
                <p className="text-xs text-slate-400 mt-0.5">Automated image analysis removes manual report filtering backlogs.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Precise Geospatial Routing</h4>
                <p className="text-xs text-slate-400 mt-0.5">Dispatches repair vans to exact coordinates, cutting transit fuel and response delay.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Transparent Municipal Audit</h4>
                <p className="text-xs text-slate-400 mt-0.5">Every status transition from Pending to Resolved is timestamped with officer notes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Future Scope */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              Roadmap & Expansion
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1">Future Integration Ready</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">CCTV Real-Time Video Streaming</h4>
                <p className="text-xs text-slate-400 mt-0.5">Automated frame grabbing and continuous traffic camera defect scanning.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Custom Ultralytics YOLOv8 / YOLOv11</h4>
                <p className="text-xs text-slate-400 mt-0.5">Modular AI interface ready for custom trained edge inference models.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Citizen Mobile App & SMS/WhatsApp Alerts</h4>
                <p className="text-xs text-slate-400 mt-0.5">Push notifications when issues reported by citizens are resolved.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
