import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import {
  Activity,
  Shield,
  Layers,
  MapPin,
  Camera,
  PlusCircle,
  BarChart3,
  Sliders,
  LogIn,
  LogOut,
  Menu,
  X,
  TrendingUp,
  GitCompare,
  BookOpen
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, isAdmin, logout } = useAuth();
  const { selectedCity, setSelectedCity } = useIssues();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'map', label: 'Leaflet Map', icon: MapPin },
    { id: 'detect', label: 'AI Scanner', icon: Camera },
    { id: 'readiness', label: 'Readiness 2070', icon: TrendingUp },
    { id: 'compare', label: 'Compare Cities', icon: GitCompare },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
    { id: 'issues', label: 'Issues', icon: Sliders },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('landing')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg glow-cyan group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white tracking-tight">SmartCity</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded">
                  2070 PLATFORM
                </span>
              </div>
              <p className="text-[9px] text-slate-400 tracking-wider uppercase font-medium">
                Infrastructure & Future Readiness
              </p>
            </div>
          </div>

          {/* City Quick-Selector Pill */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedCity || 'Gurugram'}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-950 text-slate-200">🌐 All Cities</option>
              <option value="Gurugram" className="bg-slate-950 text-slate-200">📍 Gurugram (Primary)</option>
              <option value="Delhi" className="bg-slate-950 text-slate-200">📍 Delhi</option>
              <option value="Noida" className="bg-slate-950 text-slate-200">📍 Noida</option>
              <option value="Bengaluru" className="bg-slate-950 text-slate-200">📍 Bengaluru (Tech)</option>
              <option value="Bhubaneswar" className="bg-slate-950 text-slate-200">📍 Bhubaneswar (Planned)</option>
            </select>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Report Button & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNav('report')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg transition cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-cyan-400 text-slate-950 glow-cyan'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-white leading-none truncate max-w-[100px]">
                    {user?.full_name?.split(' ')[0] || 'Admin'}
                  </p>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase">Authorized</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNav('report')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold"
            >
              + Report
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white bg-slate-900/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {isAdmin ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-emerald-400">Logged in as {user?.full_name}</span>
                <button
                  onClick={logout}
                  className="text-xs text-rose-400 flex items-center gap-1 font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="w-full py-2 bg-slate-900 text-center rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
