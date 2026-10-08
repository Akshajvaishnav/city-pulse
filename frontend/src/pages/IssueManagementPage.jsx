import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import DefectIcon from '../components/DefectIcon';
import {
  Sliders,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Calendar,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function IssueManagementPage({ setActiveTab }) {
  const {
    issues,
    loading,
    refreshAll,
    setSelectedIssueId,
    setStatusUpdateIssue,
    addToast
  } = useIssues();
  const { isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = issues.filter((issue) => {
    const matchesSearch =
      !searchTerm ||
      issue.report_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.defect_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'All' || issue.defect_type === filterType;
    const matchesSeverity = filterSeverity === 'All' || issue.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const handleDelete = async (issue) => {
    if (window.confirm(`Are you sure you want to delete report ${issue.report_id}?`)) {
      try {
        await api.deleteIssue(issue.id);
        addToast(`Report ${issue.report_id} deleted successfully.`, 'info');
        refreshAll();
      } catch (err) {
        console.error(err);
        addToast('Failed to delete issue report', 'error');
      }
    }
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      addToast('No records available to export', 'info');
      return;
    }

    const headers = [
      'Report ID',
      'Defect Type',
      'Location',
      'Latitude',
      'Longitude',
      'Severity',
      'Confidence',
      'Status',
      'Reported By',
      'Created At',
    ];

    const rows = filtered.map((i) => [
      i.report_id,
      i.defect_type,
      `"${i.location_name.replace(/"/g, '""')}"`,
      i.latitude,
      i.longitude,
      i.severity,
      Math.round(i.confidence * 100) + '%',
      i.status,
      `"${i.reported_by.replace(/"/g, '""')}"`,
      new Date(i.created_at).toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcity_infrastructure_issues_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('CSV export generated successfully', 'success');
  };

  return (
    <div className="space-y-6 py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4" />
            <span>Municipal Maintenance Control</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Infrastructure Issue Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={refreshAll}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg glow-cyan flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, location, flaw description..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              <option value="All">All Defect Categories</option>
              <option value="Pothole">Pothole</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Broken Street Light">Broken Street Light</option>
              <option value="Garbage Overflow">Garbage Overflow</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Damaged Sign">Damaged Sign</option>
            </select>
          </div>

          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              <option value="All">All Workflow Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Report ID</th>
                <th className="py-3.5 px-4">Thumbnail</th>
                <th className="py-3.5 px-4">Defect Classification</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Workflow Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No infrastructure reports match the specified criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((issue) => (
                  <tr
                    key={issue.id}
                    className="hover:bg-slate-850/50 transition duration-150 group"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {issue.report_id}
                    </td>

                    {/* Image */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => setSelectedIssueId(issue.id)}
                        className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden cursor-pointer hover:border-cyan-500/40 transition"
                      >
                        <img
                          src={issue.image_url}
                          alt={issue.defect_type}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    </td>

                    {/* Defect */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <DefectIcon type={issue.defect_type} className="w-4 h-4" />
                        <span>{issue.defect_type}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        AI Conf: {Math.round(issue.confidence * 100)}%
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <p className="font-semibold text-white truncate">{issue.location_name}</p>
                      <p className="text-[10px] font-mono text-slate-500 truncate">
                        {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                      </p>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-4">
                      <SeverityBadge severity={issue.severity} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedIssueId(issue.id)}
                          title="View Full Dossier"
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setStatusUpdateIssue(issue)}
                          title="Update Status Workflow"
                          className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(issue)}
                          title="Delete Report"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="py-3 px-4 bg-slate-950/70 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>
            Total matching records: <strong className="text-white">{filtered.length}</strong>
          </span>
          <span className="font-mono text-[11px]">Lifecycle Engine: Active</span>
        </div>
      </div>
    </div>
  );
}
