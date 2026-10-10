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
  Info,
  ThumbsUp,
  MessageSquare,
  Wrench,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';
import DefectIcon from './DefectIcon';
import BoundingBoxCanvas from './BoundingBoxCanvas';

export default function IssueDetailsModal() {
  const { selectedIssueId, setSelectedIssueId, setStatusUpdateIssue, addToast } = useIssues();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('annotated'); // 'annotated' or 'raw'
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier', 'comments', 'workorder'

  // Comments state
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Work order dispatch state
  const [crewAssigned, setCrewAssigned] = useState('Rapid Highway Response Unit A');
  const [estimatedCost, setEstimatedCost] = useState(18500);
  const [isDispatching, setIsDispatching] = useState(false);

  const fetchIssue = () => {
    if (!selectedIssueId) {
      setIssue(null);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8000/api/issues/${selectedIssueId}`)
      .then((res) => res.json())
      .then((data) => {
        setIssue(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIssue();
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

  const handleUpvote = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/issues/${issue.id}/upvote`, {
        method: 'POST'
      });
      if (res.ok) {
        const updated = await res.json();
        setIssue(prev => ({ ...prev, upvotes: updated.upvotes }));
        if (addToast) addToast('Issue upvoted! Priority escalated in municipal queue.', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);
    try {
      const res = await fetch(`http://localhost:8000/api/issues/${issue.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: authorName.trim() || 'Citizen Contributor',
          comment: commentText.trim(),
          is_official: false
        })
      });
      if (res.ok) {
        const newComm = await res.json();
        setIssue(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newComm]
        }));
        setCommentText('');
        if (addToast) addToast('Comment added to civic incident timeline.', 'success');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDispatchWorkOrder = async (e) => {
    e.preventDefault();
    setIsDispatching(true);
    try {
      const res = await fetch(`http://localhost:8000/api/issues/${issue.id}/work-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crew_assigned: crewAssigned,
          priority: issue.severity || 'High',
          estimated_cost: parseFloat(estimatedCost) || 15000,
          estimated_completion_days: 2,
          equipment_required: 'Hot-mix asphalt patcher, road safety barriers',
          notes: 'Auto-dispatched via municipal AI engine.'
        })
      });
      if (res.ok) {
        const wo = await res.json();
        setIssue(prev => ({
          ...prev,
          work_order: wo,
          status: 'In Progress'
        }));
        if (addToast) addToast(`Work Order ${wo.order_id} generated & crew dispatched!`, 'success');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDispatching(false);
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
                {issue?.work_order && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-indigo-400" />
                    {issue.work_order.order_id}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {issue?.defect_type || 'Infrastructure Report Dossier'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUpvote}
              className="px-3 py-1.5 bg-slate-800 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Endorse this civic report"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upvote ({issue?.upvotes || 0})</span>
            </button>
            <button
              onClick={handleOpenStatusModal}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Status</span>
            </button>
            <button
              onClick={() => setSelectedIssueId(null)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dossier'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Defect Dossier & AI</span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Citizen Community ({issue?.comments?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('workorder')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'workorder'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Maintenance Dispatch</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        {loading || !issue ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Retrieving infrastructure dossier...</p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6">
            {activeTab === 'dossier' && (
              <>
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

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group shadow-inner">
                      {viewMode === 'annotated' && issue.annotated_image_url ? (
                        <img
                          src={`http://localhost:8000${issue.annotated_image_url}`}
                          alt="AI Annotated Defect"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `http://localhost:8000${issue.image_url}`;
                          }}
                        />
                      ) : (
                        <BoundingBoxCanvas
                          imageUrl={`http://localhost:8000${issue.image_url}`}
                          boundingBoxes={boundingBoxes}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Column: Key Dossier Data */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-cyan-400" />
                        <span>Flaw Telemetry</span>
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {issue.description || 'Defect logged via automated optical municipal scanner.'}
                      </p>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                        <span className="text-slate-400">AI Confidence:</span>
                        <span className="font-mono font-bold text-cyan-400">
                          {Math.round(issue.confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">City Jurisdiction:</span>
                        <span className="font-semibold text-white">{issue.city}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span>Location & GPS</span>
                      </h4>
                      <p className="text-sm font-semibold text-white">{issue.location_name}</p>
                      <p className="text-xs font-mono text-cyan-400">
                        {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reported by:</span>
                      </span>
                      <span className="font-semibold text-white">{issue.reported_by}</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
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
                                Status: <StatusBadge status={hist.new_status} size="sm" />
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
              </>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Community Discussion & Field Notes</span>
                  </h4>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {issue.comments && issue.comments.length > 0 ? (
                      issue.comments.map((c) => (
                        <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-cyan-300 flex items-center gap-1">
                              <User className="w-3 h-3 text-cyan-400" />
                              {c.author_name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(c.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">{c.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">
                        No community comments yet. Be the first citizen to leave field notes!
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-800 space-y-2.5">
                    <input
                      type="text"
                      placeholder="Your name or affiliation (e.g. Resident RWA Sector 29)"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a field comment or status confirmation..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        disabled={!commentText.trim() || isSubmittingComment}
                        className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Post Note
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Work Order Dispatch Tab */}
            {activeTab === 'workorder' && (
              <div className="space-y-4">
                {issue.work_order ? (
                  <div className="p-5 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-indigo-400" />
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            Work Order: {issue.work_order.order_id}
                          </h4>
                          <span className="text-xs text-slate-400">Assigned Maintenance Operation</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        {issue.work_order.work_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block mb-1">Assigned Crew</span>
                        <span className="font-bold text-white">{issue.work_order.crew_assigned}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block mb-1">Estimated Cost</span>
                        <span className="font-mono font-bold text-emerald-400">
                          ₹{issue.work_order.estimated_cost?.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block mb-1">Target Completion</span>
                        <span className="font-bold text-cyan-400">
                          {issue.work_order.estimated_completion_days} Days
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1 font-semibold">Equipment / Materials Required:</span>
                      <p className="text-slate-200">{issue.work_order.equipment_required}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-cyan-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Generate AI Maintenance Work Order</h4>
                        <p className="text-xs text-slate-400">
                          Schedule municipal road repair crews and assign budget allocations.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleDispatchWorkOrder} className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Select Repair Crew Unit</label>
                          <select
                            value={crewAssigned}
                            onChange={(e) => setCrewAssigned(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                          >
                            <option value="Rapid Highway Response Unit A">Rapid Highway Response Unit A</option>
                            <option value="Municipal Asphalt Patch Crew #4">Municipal Asphalt Patch Crew #4</option>
                            <option value="Street Lighting & Electrical Division">Street Lighting & Electrical Division</option>
                            <option value="Stormwater Drainage & Sump Squad">Stormwater Drainage & Sump Squad</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Estimated Budget (INR ₹)</label>
                          <input
                            type="number"
                            value={estimatedCost}
                            onChange={(e) => setEstimatedCost(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isDispatching}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-600/20"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>{isDispatching ? 'Dispatching Crew...' : 'Confirm & Dispatch Work Order'}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
