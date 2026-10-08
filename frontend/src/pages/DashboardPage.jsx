import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import DefectIcon from '../components/DefectIcon';
import InfrastructureMap from '../components/InfrastructureMap';
import {
  Activity,
  Clock,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Eye,
  Filter,
  MapPin,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function DashboardPage({ setActiveTab }) {
  const { issues, statistics, loading, refreshAll, setSelectedIssueId, selectedCity, setSelectedCity, readinessData } = useIssues();
  const [filterType, setFilterType] = useState('All');

  const filteredIssues = filterType === 'All'
    ? issues
    : issues.filter((i) => i.defect_type === filterType);

  const activeCityReadiness = readinessData?.cities?.[selectedCity !== 'All' ? selectedCity : 'Gurugram'] ||
    readinessData?.cities?.['Gurugram'];

  // Chart Data: Defect Distribution
  const defectLabels = statistics?.defect_distribution
    ? Object.keys(statistics.defect_distribution)
    : ['Pothole', 'Road Damage', 'Street Light', 'Garbage Overflow', 'Water Leakage', 'Damaged Sign'];

  const defectCounts = statistics?.defect_distribution
    ? Object.values(statistics.defect_distribution)
    : [35, 24, 18, 15, 12, 8];

  const defectChartData = {
    labels: defectLabels,
    datasets: [
      {
        data: defectCounts,
        backgroundColor: [
          '#ef4444',
          '#f59e0b',
          '#3b82f6',
          '#10b981',
          '#06b6d4',
          '#8b5cf6',
        ],
        borderColor: '#0f172a',
        borderWidth: 2,
      },
    ],
  };

  // Chart Data: Severity Breakdown
  const severityChartData = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        data: [
          statistics?.high_priority || 18,
          statistics?.medium_priority || 42,
          statistics?.low_priority || 25,
        ],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderRadius: 8,
      },
    ],
  };

  // Chart Data: Resolution Trends
  const trendLabels = statistics?.timeline_trends?.map((t) => t.date) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const detectedTrends = statistics?.timeline_trends?.map((t) => t.detected) || [12, 15, 18, 14, 22, 19, 16];
  const resolvedTrends = statistics?.timeline_trends?.map((t) => t.resolved) || [8, 11, 14, 12, 18, 16, 15];

  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Detected',
        data: detectedTrends,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Resolved',
        data: resolvedTrends,
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { size: 11 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { color: '#1e293b' },
      },
      y: {
        ticks: { color: '#64748b' },
        grid: { color: '#1e293b' },
      },
    },
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              City Operations Command
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
              Active: {selectedCity || 'Gurugram'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Infrastructure & Future City Command
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshAll}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setActiveTab('readiness')}
            className="px-3.5 py-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>2070 Projections</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg glow-cyan flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Flaw Report</span>
          </button>
        </div>
      </div>

      {/* Future City Readiness 2070 Teaser Card */}
      {activeCityReadiness && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                2070 SCENARIO READINESS
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {activeCityReadiness.city_name} Trajectory
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Projected Future Readiness Score:{' '}
              <span className="text-cyan-400 font-mono font-black text-xl">
                {activeCityReadiness.projections?.[2070] || activeCityReadiness.current_readiness_score}/100
              </span>
              <span className="text-xs font-normal text-slate-400 ml-2">
                (Baseline 2026: {activeCityReadiness.current_readiness_score}/100)
              </span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Modelled using 6 normalized infrastructure and sustainability pillars with active flaw penalty.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('compare')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Compare 5 Cities
            </button>
            <button
              onClick={() => setActiveTab('readiness')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-md glow-cyan"
            >
              Open 2070 Simulator
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Issues"
          value={statistics?.total_issues || issues.length}
          subtext="City-wide logged"
          icon={Activity}
          color="cyan"
          badge="100%"
        />
        <StatsCard
          title="Pending Action"
          value={statistics?.pending || 42}
          subtext="Needs triage"
          icon={Clock}
          color="amber"
          badge="Awaiting"
        />
        <StatsCard
          title="In Progress"
          value={statistics?.in_progress || 31}
          subtext="Workforce active"
          icon={Wrench}
          color="cyan"
          badge="Active"
        />
        <StatsCard
          title="Resolved"
          value={statistics?.resolved || 55}
          subtext="Successfully closed"
          icon={CheckCircle}
          color="emerald"
          badge={`${statistics?.resolution_rate || 78}% Rate`}
        />
        <StatsCard
          title="High Priority"
          value={statistics?.high_priority || 18}
          subtext="Immediate hazard"
          icon={AlertTriangle}
          color="rose"
          badge="Critical"
        />
        <StatsCard
          title="Detected Today"
          value={statistics?.detected_today || 12}
          subtext="24h telemetry"
          icon={Flame}
          color="purple"
          badge="AI + Citizen"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Defect Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Defect Distribution</h3>
            <span className="text-xs text-slate-400 font-mono">By Flaw Category</span>
          </div>
          <div className="h-60 relative flex items-center justify-center">
            <Doughnut
              data={defectChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 12 },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Severity Breakdown</h3>
            <span className="text-xs text-slate-400 font-mono">Urgency Priority</span>
          </div>
          <div className="h-60">
            <Bar
              data={severityChartData}
              options={{
                ...chartOptions,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">7-Day Incident Velocity</h3>
            <span className="text-xs text-slate-400 font-mono">Detected vs Resolved</span>
          </div>
          <div className="h-60">
            <Line data={trendChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Live Map & Recent Reports Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Map */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Geospatial Defect Telemetry Map
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Fullscreen Map View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <InfrastructureMap issues={filteredIssues} height="420px" showFilters={false} showLegend={true} />
        </div>

        {/* Right 5 cols: Recent Reports */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Reports</h3>
            </div>
            <button
              onClick={() => setActiveTab('issues')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All ({issues.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredIssues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 shrink-0 overflow-hidden relative">
                    <img
                      src={issue.image_url}
                      alt={issue.defect_type}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {issue.report_id}
                      </span>
                      <SeverityBadge severity={issue.severity} size="sm" />
                    </div>
                    <p className="text-xs font-bold text-white truncate">{issue.defect_type}</p>
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{issue.location_name}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <StatusBadge status={issue.status} size="sm" />
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
