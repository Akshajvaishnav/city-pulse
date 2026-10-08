import React from 'react';
import { Shield, Heart, Server, Cpu, Database, MapPin } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: System info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-extrabold text-white text-sm">SmartCity Flaw Detection</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time computer vision and geospatial lifecycle management system for automated urban infrastructure maintenance.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Central Core Online (v1.0.0)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Navigation</p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('landing')} className="hover:text-cyan-400 transition cursor-pointer">
                  Platform Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-400 transition cursor-pointer">
                  Operations Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('detect')} className="hover:text-cyan-400 transition cursor-pointer">
                  AI Computer Vision Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-cyan-400 transition cursor-pointer">
                  Geospatial Flaw Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture Stack */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Technology Architecture</p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> YOLO / CV Detection Pipeline
              </p>
              <p className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" /> FastAPI Python Backend
              </p>
              <p className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" /> SQLAlchemy & SQLite / Postgres
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Leaflet Dynamic GIS Engine
              </p>
            </div>
          </div>

          {/* Col 4: Flaw Types */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Monitored Flaws</p>
            <div className="flex flex-wrap gap-1.5">
              {['Potholes', 'Road Cracks', 'Street Lights', 'Garbage Overflow', 'Water Leakage', 'Damaged Signs'].map((flaw) => (
                <span
                  key={flaw}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                >
                  {flaw}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 SmartCity Infrastructure Flaw Detection System. Municipal Civic Operations.</p>
          <p className="flex items-center gap-1">
            <span>Built for Modern Urban Governance & Public Safety</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
