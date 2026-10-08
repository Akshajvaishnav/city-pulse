import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import LeafletMap from '../components/LeafletMap';
import DefectIcon from '../components/DefectIcon';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';
import {
  MapPin,
  Filter,
  Search,
  Layers,
  Sparkles,
  AlertCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export default function InfrastructureMapPage() {
  const { issues, setSelectedIssueId } = useIssues();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const flawTypes = [
    'All',
    'Pothole',
    'Road Damage',
    'Broken Street Light',
    'Garbage Overflow',
    'Water Leakage',
    'Damaged Sign',
  ];

  const severities = ['All', 'High', 'Medium', 'Low'];
  const statuses = ['All', 'Pending', 'Verified', 'In Progress', 'Resolved'];

  const filtered = issues.filter((issue) => {
    const matchesSearch =
      !searchTerm ||
      issue.report_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.defect_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'All' || issue.defect_type === selectedType;
    const matchesSeverity = selectedSeverity === 'All' || issue.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>Smart City Geospatial GIS</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Infrastructure Issue Map
          </h1>
        </div>

        {/* Quick Map Legend */}
        <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-medium text-slate-300">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Severity Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm glow-rose"></span>
            <span>High (Immediate Hazard)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Medium</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Low / Resolved</span>
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sector, ID, defect..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              {flawTypes.map((t) => (
                <option key={t} value={t}>
                  Defect: {t}
                </option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              {severities.map((s) => (
                <option key={s} value={s}>
                  Severity: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter count indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span>
            Displaying <strong className="text-cyan-400">{filtered.length}</strong> of{' '}
            <strong>{issues.length}</strong> plotted infrastructure incidents
          </span>
          {(selectedType !== 'All' || selectedSeverity !== 'All' || selectedStatus !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedType('All');
                setSelectedSeverity('All');
                setSelectedStatus('All');
                setSearchTerm('');
              }}
              className="text-cyan-400 hover:text-white transition font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Leaflet Map */}
      <div className="relative">
        <LeafletMap issues={filtered} height="600px" />
      </div>

      {/* Cards List under map */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Active Map Pin Incidents ({filtered.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((issue) => (
            <div
              key={issue.id}
              onClick={() => setSelectedIssueId(issue.id)}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer space-y-3 group"
            >
              <div className="h-32 rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800">
                <img
                  src={issue.image_url}
                  alt={issue.defect_type}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 right-2">
                  <SeverityBadge severity={issue.severity} size="sm" />
                </div>
                <div className="absolute bottom-2 left-2">
                  <StatusBadge status={issue.status} size="sm" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {issue.report_id}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <DefectIcon type={issue.defect_type} className="w-4 h-4" />
                  <span>{issue.defect_type}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1 truncate flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{issue.location_name}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
