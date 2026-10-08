import React, { useEffect, useState } from 'react';
import { useIssues } from '../context/IssueContext';
import { api } from '../services/api';
import {
  X,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Cpu,
  Clock,
  ExternalLink,
  Edit3,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';
import DefectIcon from './DefectIcon';
import BoundingBoxCanvas from './BoundingBoxCanvas';

export default function IssueDetailsModal() {
  const { selectedIssueId, setSelectedIssueId, setStatusUpdateIssue } = useIssues();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('annotated'); // 'annotated' or 'raw'

  useEffect(() => {
    if (!selectedIssueId) {
      setIssue(null);
      return;
    }
    setLoading(true);
    api
      .getIssue(selectedIssueId)
      .then((data) => {
        setIssue(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedIssueId]);

  if (!selectedIssueId) return null;

  const boundingBoxes = issue?.bounding_boxes_json
    ? JSON.parse(issue.bounding_boxes_json)
    : [];

  const handleOpenStatusModal = () => {
    if (issue) {
      setStatusUpdateIssue(issue);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
              <DefectIcon type={issue?.defect_type} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-cyan-400">
                  {issue?.report_id || 'Loading...'}
                </span>
                {issue && <StatusBadge status={issue.status} size="sm" />}
                {issue && <SeverityBadge severity={issue.severity} size="sm" />}
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {issue?.defect_type || 'Infrastructure Report Dossier'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenStatusModal}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Status</span>
            </button>
            <button
              onClick={() => setSelectedIssueId(null)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        {loading || !issue ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Retrieving infrastructure dossier...</p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Visual AI Analysis Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Image Viewer */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Computer Vision Inspection</span>
                  </span>
                  <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
                    <button
                      onClick={() => setViewMode('annotated')}
                      className={`px-3 py-1 rounded-md transition font-medium ${
                        viewMode === 'annotated'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      AI Annotated
                    </button>
                    <button
                      onClick={() => setViewMode('raw')}
                      className={`px-3 py-1 rounded-md transition font-medium ${
                        viewMode === 'raw'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Raw Photo
                    </button>
                  </div>
                </div>

                <div className="h-72 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner flex items-center justify-center">
                  {viewMode === 'annotated' && issue.annotated_image_url ? (
                    <img
                      src={issue.annotated_image_url}
                      alt="AI Annotated Defect"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={issue.image_url}
                      alt="Raw Defect"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* AI Detection Stats Strip */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">AI Confidence</p>
                    <p className="text-base font-extrabold text-cyan-400 font-mono">
                      {Math.round(issue.confidence * 100)}%
                    </p>
                  </div>
                  <div className="border-x border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Localized Flaws</p>
                    <p className="text-base font-extrabold text-amber-400 font-mono">
                      {boundingBoxes.length || 1}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Engine</p>
                    <p className="text-xs font-semibold text-emerald-400 mt-1">SmartCity-CV</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Metadata & Geolocation */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Incident Description</span>
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {issue.description || 'No detailed incident description provided.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>Geographic Location</span>
                  </h4>
                  <div>
                    <p className="text-sm font-semibold text-white">{issue.location_name}</p>
                    <p className="text-xs font-mono text-cyan-400 mt-0.5">
                      {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                    <p className="text-slate-400 flex items-center gap-1 mb-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reporter</span>
                    </p>
                    <p className="font-semibold text-white truncate">{issue.reported_by}</p>
                    {issue.reporter_contact && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{issue.reporter_contact}</p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                    <p className="text-slate-400 flex items-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reported Date</span>
                    </p>
                    <p className="font-semibold text-white">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status History & Audit Timeline */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Lifecycle Workflow & Audit Timeline</span>
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {issue.history && issue.history.length > 0 ? (
                  issue.history.map((hist, idx) => (
                    <div key={hist.id || idx} className="relative group">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-slate-900" />
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            Status updated to <StatusBadge status={hist.new_status} size="sm" />
                          </span>
                          <span className="text-xs text-slate-400">by {hist.changed_by}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(hist.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {hist.notes && (
                        <p className="mt-1 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                          {hist.notes}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No status changes recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
