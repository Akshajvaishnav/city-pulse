import React from 'react';

export default function StatsCard({ title, value, subtext, icon: Icon, color = 'cyan', badge }) {
  const colorMap = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      bg: 'from-cyan-500/10 to-transparent',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      text: 'text-cyan-400'
    },
    amber: {
      border: 'hover:border-amber-500/40',
      bg: 'from-amber-500/10 to-transparent',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      text: 'text-amber-400'
    },
    rose: {
      border: 'hover:border-rose-500/40',
      bg: 'from-rose-500/10 to-transparent',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      text: 'text-rose-400'
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      bg: 'from-emerald-500/10 to-transparent',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-400'
    },
    purple: {
      border: 'hover:border-purple-500/40',
      bg: 'from-purple-500/10 to-transparent',
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      text: 'text-purple-400'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border border-slate-800/80 bg-slate-900/60 backdrop-blur-md transition-all duration-300 ${scheme.border} group`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${scheme.bg} rounded-bl-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl border ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-3">
        <span>{subtext}</span>
        {badge && (
          <span className={`font-medium ${scheme.text}`}>{badge}</span>
        )}
      </div>
    </div>
  );
}
