import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export default function SeverityBadge({ severity, size = 'md' }) {
  const getStyles = () => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40 glow-rose';
      case 'medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'low':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/40';
    }
  };

  const getIcon = () => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'medium':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'low':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      default:
        return null;
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-mono uppercase tracking-wider ${sizeClasses} ${getStyles()}`}>
      {getIcon()}
      {severity}
    </span>
  );
}
