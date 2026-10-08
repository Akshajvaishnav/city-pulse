import React from 'react';
import { useIssues } from '../context/IssueContext';
import InfrastructureMap from '../components/InfrastructureMap';
import DefectIcon from '../components/DefectIcon';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';
import { MapPin, Layers, Sparkles } from 'lucide-react';

export default function InfrastructureMapPage() {
  const { issues, setSelectedIssueId } = useIssues();

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

        <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Live Leaflet + OpenStreetMap Engine</span>
        </div>
      </div>

      {/* Main Reusable Infrastructure Map Component with Filter Panel and Dynamic Pins */}
      <InfrastructureMap
        height="640px"
        showFilters={true}
        showLegend={true}
      />

      {/* Plotted Incident Feed Below Map */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Active Infrastructure Flaw Registry ({issues.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => setSelectedIssueId(issue.id)}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer space-y-3 group shadow-lg"
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
