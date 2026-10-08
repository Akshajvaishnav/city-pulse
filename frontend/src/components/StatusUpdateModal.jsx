import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, CheckCircle2, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function StatusUpdateModal() {
  const { statusUpdateIssue, setStatusUpdateIssue, refreshAll, addToast } = useIssues();
  const { user } = useAuth();
  
  const [selectedStatus, setSelectedStatus] = useState('In Progress');
  const [technicianName, setTechnicianName] = useState(user?.full_name || 'Chief Municipal Inspector');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!statusUpdateIssue) return null;

  const statuses = ['Pending', 'Verified', 'In Progress', 'Resolved', 'Rejected'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.updateStatus(statusUpdateIssue.id, {
        status: selectedStatus,
        changed_by: technicianName,
        notes: notes || `Workflow status updated to ${selectedStatus}.`,
      });
      addToast(`Status updated to ${selectedStatus} for ${statusUpdateIssue.report_id}`, 'success');
      refreshAll();
      setStatusUpdateIssue(null);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to update status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              Authority Workflow Action
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Update Issue Lifecycle Status</span>
            </h3>
          </div>
          <button
            onClick={() => setStatusUpdateIssue(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Info */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Report Reference</p>
            <p className="text-sm font-mono font-bold text-white">{statusUpdateIssue.report_id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Current State</p>
            <StatusBadge status={statusUpdateIssue.status} />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select New Target Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statuses.map((stat) => (
                <button
                  key={stat}
                  type="button"
                  onClick={() => setSelectedStatus(stat)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                    selectedStatus === stat
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md glow-cyan'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{stat}</span>
                  {selectedStatus === stat && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Authorized Inspector / Officer Name
            </label>
            <input
              type="text"
              required
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition"
              placeholder="e.g. Ward Supervisor A. Kumar"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Action / Resolution Audit Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition"
              placeholder="Details of repair crew dispatch, asphalt patching, parts replaced, or justification..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setStatusUpdateIssue(null)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg glow-cyan flex items-center gap-2 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Commit Status Change</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
