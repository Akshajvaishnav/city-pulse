import React, { useState, useEffect } from 'react';
import {
  CloudLightning,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  Radio,
  CheckCircle2,
  RefreshCw,
  Bell,
  MapPin,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useIssues } from '../context/IssueContext';

export default function SensorAlertsBanner() {
  const { selectedCity } = useIssues();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const cityParam = selectedCity && selectedCity !== 'All' ? `?city=${selectedCity}` : '';
      const res = await fetch(`http://localhost:8000/api/alerts${cityParam}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (e) {
      console.warn('Sensor alerts fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 25000); // 25s live telemetry poll
    return () => clearInterval(interval);
  }, [selectedCity]);

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="absolute w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <span>Real-Time Environmental & Sensor Telemetry Feed</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded font-mono">
                LIVE IoT
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Stationary acoustic, thermal, and stormwater telemetry active across {selectedCity || 'All Metros'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
            title="Refresh IoT Sensors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition cursor-pointer"
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {alerts.slice(0, 3).map((alert) => {
            const isCritical = alert.level === 'Critical';
            const isWarning = alert.level === 'Warning';
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    {alert.category.includes('Road') || alert.category.includes('Surface') ? (
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    ) : alert.category.includes('Drain') || alert.category.includes('Storm') ? (
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Wind className="w-3.5 h-3.5 text-purple-400" />
                    )}
                    <span>{alert.title}</span>
                  </div>
                  {alert.metric_value && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-200 font-bold border border-white/10 shrink-0">
                      {alert.metric_value}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-2">
                  {alert.detail}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {alert.affected_zone}
                  </span>
                  <span
                    className={`font-semibold uppercase tracking-wider ${
                      isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-cyan-400'
                    }`}
                  >
                    {alert.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
