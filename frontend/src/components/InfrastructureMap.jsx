import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';
import DefectIcon from './DefectIcon';
import { useIssues } from '../context/IssueContext';
import {
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Cpu
} from 'lucide-react';

// Fix Leaflet's default asset paths in React environment
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Severity Marker Generator with pulsating animation for High severity
function createSeverityPin(severity, status) {
  let color = '#10B981'; // 🟢 Low Severity (Green)
  let glow = 'rgba(16, 185, 129, 0.4)';
  let borderColor = '#34d399';

  if (severity === 'High') {
    color = '#EF4444'; // 🔴 High Severity (Red)
    glow = 'rgba(239, 68, 68, 0.6)';
    borderColor = '#f87171';
  } else if (severity === 'Medium') {
    color = '#F59E0B'; // 🟠 Medium Severity (Orange / Amber)
    glow = 'rgba(245, 158, 11, 0.5)';
    borderColor = '#fbbf24';
  }

  const isHigh = severity === 'High' && status !== 'Resolved';

  const html = `
    <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
      ${isHigh ? `<div class="pulse-marker" style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: ${glow};"></div>` : ''}
      <div style="
        width: 26px; 
        height: 26px; 
        background: ${color}; 
        border: 2.5px solid #ffffff; 
        border-radius: 50%; 
        box-shadow: 0 0 14px ${color}, inset 0 0 4px rgba(0,0,0,0.3); 
        display: flex; 
        align-items: center; 
        justify-content: center;
        z-index: 2;
        transition: transform 0.2s;
      ">
        <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-severity-pin',
    html: html,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
}

// Controller to auto-center and fit bounds dynamically when issues update
function MapBoundsController({ markers, center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.0 });
    } else if (markers && markers.length > 0) {
      const validCoords = markers
        .filter((m) => typeof m.latitude === 'number' && typeof m.longitude === 'number')
        .map((m) => [m.latitude, m.longitude]);
      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [markers, center, map]);
  return null;
}

export default function InfrastructureMap({
  issues: propIssues = null,
  height = '620px',
  showFilters = true,
  showLegend = true,
  defaultCenter = [28.6139, 77.2090] // Central Delhi Smart City Coordinate
}) {
  const { issues: contextIssues, setSelectedIssueId } = useIssues();
  const rawIssues = propIssues || contextIssues || [];

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const flawTypes = [
    'All',
    'Pothole',
    'Road Damage',
    'Broken Street Light',
    'Garbage Overflow',
    'Water Leakage',
    'Damaged Sign'
  ];

  const severities = ['All', 'High', 'Medium', 'Low'];
  const statuses = ['All', 'Pending', 'Verified', 'In Progress', 'Resolved', 'Rejected'];
  const dateOptions = [
    { label: 'All Time', value: 'All' },
    { label: 'Past 24 Hours', value: '1' },
    { label: 'Past 7 Days', value: '7' },
    { label: 'Past 30 Days', value: '30' }
  ];

  // Dynamic Multi-Criteria Filtering
  const filteredMarkers = useMemo(() => {
    return rawIssues.filter((issue) => {
      const matchesSearch =
        !searchTerm ||
        issue.report_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.defect_type?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'All' || issue.defect_type === selectedType;
      const matchesSeverity = selectedSeverity === 'All' || issue.severity === selectedSeverity;
      const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;

      let matchesDate = true;
      if (dateFilter !== 'All') {
        const days = parseInt(dateFilter, 10);
        const issueDate = new Date(issue.created_at).getTime();
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        matchesDate = issueDate >= cutoff;
      }

      return matchesSearch && matchesType && matchesSeverity && matchesStatus && matchesDate;
    });
  }, [rawIssues, searchTerm, selectedType, selectedSeverity, selectedStatus, dateFilter]);

  return (
    <div className="w-full space-y-4 font-sans">
      {/* Search & Filter Panel */}
      {showFilters && (
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-3 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sector, ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition font-medium"
              />
            </div>

            {/* Defect Type Filter */}
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

            {/* Severity Filter */}
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

            {/* Status Filter */}
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

            {/* Date Range Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                {dateOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Date: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Status Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 gap-2">
            <span>
              Active GIS Pins: <strong className="text-cyan-400 font-mono">{filteredMarkers.length}</strong> of{' '}
              <strong className="text-white font-mono">{rawIssues.length}</strong> total infrastructure incidents
            </span>

            {(selectedType !== 'All' || selectedSeverity !== 'All' || selectedStatus !== 'All' || dateFilter !== 'All' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedSeverity('All');
                  setSelectedStatus('All');
                  setDateFilter('All');
                  setSearchTerm('');
                }}
                className="text-cyan-400 hover:text-white transition font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Map Container */}
      <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl" style={{ height }}>
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* OpenStreetMap Base Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Dynamic Boundary & Center Auto-fit Controller */}
          <MapBoundsController markers={filteredMarkers} />

          {/* Render Dynamic Infrastructure Markers */}
          {filteredMarkers.map((issue) => (
            <Marker
              key={issue.id || issue.report_id}
              position={[issue.latitude, issue.longitude]}
              icon={createSeverityPin(issue.severity, issue.status)}
            >
              <Popup className="smartcity-leaflet-popup">
                <div className="w-72 p-3.5 bg-slate-900 text-slate-100 rounded-xl overflow-hidden font-sans border border-slate-800 shadow-2xl">
                  {/* Thumbnail Image */}
                  {issue.image_url && (
                    <div className="h-32 w-full bg-slate-950 rounded-lg overflow-hidden mb-2.5 relative border border-slate-800">
                      <img
                        src={issue.image_url}
                        alt={issue.defect_type}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5">
                        <SeverityBadge severity={issue.severity} size="sm" />
                      </div>
                    </div>
                  )}

                  {/* Header: Report ID & Status */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-xs font-bold text-cyan-400 tracking-wide">
                      {issue.report_id}
                    </span>
                    <StatusBadge status={issue.status} size="sm" />
                  </div>

                  {/* Problem Type & AI Confidence */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                      <DefectIcon type={issue.defect_type} className="w-4 h-4" />
                      <span>{issue.defect_type}</span>
                    </div>
                    {typeof issue.confidence === 'number' && (
                      <span className="text-[11px] font-mono font-bold text-emerald-400">
                        {Math.round(issue.confidence * 100)}% Conf
                      </span>
                    )}
                  </div>

                  {/* Location Landmark */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-300 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{issue.location_name}</span>
                  </div>

                  {/* Date Reported */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{new Date(issue.created_at).toLocaleDateString()} • {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* View Details Action Button */}
                  <button
                    onClick={() => setSelectedIssueId(issue.id)}
                    className="w-full py-2 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <span>View Full Details & Dossier</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Dynamic Map Legend Overlay */}
        {showLegend && (
          <div className="absolute bottom-4 right-4 z-[400] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl space-y-2 pointer-events-auto">
            <p className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Severity Legend</span>
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-500/40 shrink-0 animate-pulse"></span>
                <span className="text-slate-200 font-medium">🔴 High (Immediate Hazard)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-slate-200 font-medium">🟠 Medium (Scheduled Maintenance)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-slate-200 font-medium">🟢 Low / Verified Resolved</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
