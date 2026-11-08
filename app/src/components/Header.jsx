import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Command,
  ShieldCheck,
  Building2,
  Menu
} from 'lucide-react';

export const Header = () => {
  const {
    isDark,
    setIsDark,
    setCommandOpen,
    currentUser,
    userPermissions,
    selectedBranch,
    setMobileMenuOpen
  } = useApp();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition shrink-0"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-indigo-400" />
        </button>

        <button
          onClick={() => setCommandOpen(true)}
          className="flex items-center gap-2 sm:gap-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium transition w-full shadow-inner"
        >
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="flex-1 text-left truncate">Search or jump to...</span>
          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
        {/* Branch Context Pill (Visible on md+) */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate max-w-[120px]">{selectedBranch.name}</span>
        </div>

        {/* Permission status pill (Visible on sm+) */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-bold text-white">{currentUser.role}</span>
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
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="hidden xs:inline">Online</span>
        </div>
      </div>
    </header>
  );
};
