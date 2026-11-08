import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Command,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const Header = () => {
  const {
    isDark,
    setIsDark,
    setCommandOpen,
    currentUser,
    userPermissions,
    selectedBranch
  } = useApp();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
      {/* Search & Command Palette trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCommandOpen(true)}
          className="flex items-center gap-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-medium transition w-64 md:w-80 shadow-inner"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="flex-1 text-left">Quick actions & search...</span>
          <div className="flex items-center gap-1 font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Branch: <strong className="text-slate-200">{selectedBranch.name}</strong></span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Permission status pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px]">Role: <strong className="text-white">{currentUser.role}</strong></span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition"
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Live System Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Online</span>
        </div>
      </div>
    </header>
  );
};
