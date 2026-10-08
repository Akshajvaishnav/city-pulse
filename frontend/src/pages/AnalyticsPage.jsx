import React from 'react';
import { useIssues } from '../context/IssueContext';
import StatsCard from '../components/StatsCard';
import DefectIcon from '../components/DefectIcon';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Flame,
  Award,
  Download,
  Printer
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
  RadialLinearScale,
  Title
} from 'chart.js';
import { Doughnut, Bar, Line, PolarArea } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title
);

export default function AnalyticsPage() {
  const { statistics, issues } = useIssues();

  // Defect Distribution Data
  const defectLabels = statistics?.defect_distribution
    ? Object.keys(statistics.defect_distribution)
    : ['Pothole', 'Road Damage', 'Street Light', 'Garbage Overflow', 'Water Leakage', 'Damaged Sign'];

  const defectCounts = statistics?.defect_distribution
    ? Object.values(statistics.defect_distribution)
    : [35, 24, 18, 15, 12, 8];

  const totalDefects = defectCounts.reduce((a, b) => a + b, 0) || 1;

  // Defect Chart Data
  const defectDoughnut = {
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

  // Severity Distribution
  const severityBar = {
    labels: ['High Urgency', 'Medium Urgency', 'Low Urgency'],
    datasets: [
      {
        label: 'Issues Count',
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

  // Area Distribution (Hotspots)
  const areaLabels = statistics?.area_distribution
    ? Object.keys(statistics.area_distribution)
    : ['Sector 62', 'Sector 18', 'Sector 15', 'Sector 21', 'Connaught Pl', 'Cyber Hub'];

  const areaCounts = statistics?.area_distribution
    ? Object.values(statistics.area_distribution)
    : [18, 14, 12, 10, 8, 6];

  const areaBar = {
    labels: areaLabels,
    datasets: [
      {
        label: 'Reported Flaws',
        data: areaCounts,
        backgroundColor: '#06b6d4',
        borderRadius: 6,
      },
    ],
  };

  // Timeline Trends
  const trendLabels = statistics?.timeline_trends?.map((t) => t.date) || ['Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8'];
  const detectedTrends = statistics?.timeline_trends?.map((t) => t.detected) || [14, 18, 22, 16, 20, 25, 21];
  const resolvedTrends = statistics?.timeline_trends?.map((t) => t.resolved) || [10, 15, 18, 14, 17, 22, 19];

  const trendLine = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Incoming Defect Reports',
        data: detectedTrends,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Closed Maintenance Tickets',
        data: resolvedTrends,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            <span>Civic Intelligence & Operational KPI</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            City Infrastructure Analytics
          </h1>
        </div>

        <button
          onClick={handlePrint}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Print / Export Report</span>
        </button>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Overall Resolution Rate"
          value={`${statistics?.resolution_rate || 78.4}%`}
          subtext="Closed tickets vs total"
          icon={Award}
          color="emerald"
          badge="High Efficiency"
        />
        <StatsCard
          title="Avg Turnaround Time"
          value={`${statistics?.avg_resolution_time_days || 2.4} Days`}
          subtext="From report to resolution"
          icon={Clock}
          color="cyan"
          badge="Target < 3.0d"
        />
        <StatsCard
          title="Critical Hazard Ratio"
          value={`${Math.round(((statistics?.high_priority || 18) / (statistics?.total_issues || 100)) * 100)}%`}
          subtext="High urgency proportion"
          icon={AlertTriangle}
          color="rose"
          badge="Priority Triage"
        />
        <StatsCard
          title="Top Infrastructure Defect"
          value={defectLabels[0] || 'Potholes'}
          subtext={`${Math.round(((defectCounts[0] || 35) / totalDefects) * 100)}% of all flaws`}
          icon={Flame}
          color="amber"
          badge="Most Prevalent"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Defect Distribution List & Doughnut (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Most Common Infrastructure Flaws
            </h3>
            <span className="text-xs text-slate-400 font-mono">Taxonomy Breakdown</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-56 relative flex items-center justify-center">
              <Doughnut
                data={defectDoughnut}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>

            {/* Percentages List */}
            <div className="space-y-2.5">
              {defectLabels.map((label, idx) => {
                const count = defectCounts[idx] || 0;
                const pct = Math.round((count / totalDefects) * 100);
                const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#06b6d4', '#8b5cf6'];
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: colors[idx % colors.length] }}
                        />
                        <span>{label}</span>
                      </span>
                      <span className="font-mono text-slate-400 font-bold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: colors[idx % colors.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Severity Distribution (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Flaws by Severity & Urgency
            </h3>
            <span className="text-xs text-slate-400 font-mono">Priority Distribution</span>
          </div>
          <div className="h-56">
            <Bar
              data={severityBar}
              options={{
                ...chartOptions,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        {/* Weekly Trend Line (12 cols) */}
        <div className="lg:col-span-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Defect Inflow vs Resolution Performance
              </h3>
              <p className="text-xs text-slate-400">Weekly volume comparison of new vs resolved defects</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              Resolution Delta: +14% This Week
            </span>
          </div>
          <div className="h-64">
            <Line data={trendLine} options={chartOptions} />
          </div>
        </div>

        {/* Sector Hotspots Bar (12 cols) */}
        <div className="lg:col-span-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Infrastructure Defect Hotspots by Sector / Area</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Top Reported Zones</span>
          </div>
          <div className="h-60">
            <Bar
              data={areaBar}
              options={{
                ...chartOptions,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
