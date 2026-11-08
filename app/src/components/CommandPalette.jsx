import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  LayoutDashboard,
  ShieldAlert,
  Building2,
  Users,
  Moon,
  Sun,
  FileCheck2,
  Users2,
  Store,
  X
} from 'lucide-react';

export const CommandPalette = () => {
  const { commandOpen, setCommandOpen, setActiveTab, allUsers, switchUser, isDark, setIsDark } = useApp();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape' && commandOpen) {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandOpen, setCommandOpen]);

  if (!commandOpen) return null;

  const actions = [
    {
      id: 'nav_dash',
      label: 'Go to Executive Dashboard',
      icon: LayoutDashboard,
      group: 'Navigation',
      run: () => setActiveTab('dashboard')
    },
    {
      id: 'nav_crm',
      label: 'Open CRM & Sales Deals Pipeline',
      icon: Users2,
      group: 'Sales & Revenue',
      run: () => setActiveTab('crm')
    },
    {
      id: 'nav_pos',
      label: 'Launch Point of Sale (POS) Terminal',
      icon: Store,
      group: 'Sales & Revenue',
      run: () => setActiveTab('pos')
    },
    {
      id: 'nav_approvals',
      label: 'Go to Approval Inbox',
      icon: FileCheck2,
      group: 'Operations',
      run: () => setActiveTab('approvals')
    },
    {
      id: 'nav_audit',
      label: 'Inspect Security Audit Logs',
      icon: ShieldAlert,
      group: 'Compliance',
      run: () => setActiveTab('audit')
    },
    {
      id: 'nav_org',
      label: 'Organization & Branch Settings',
      icon: Building2,
      group: 'Settings',
      run: () => setActiveTab('org')
    },
    {
      id: 'toggle_theme',
      label: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      icon: isDark ? Sun : Moon,
      group: 'Preferences',
      run: () => setIsDark(!isDark)
    },
    ...allUsers.map(u => ({
      id: `switch_${u.id}`,
      label: `Switch Role: ${u.name} (${u.role})`,
      icon: Users,
      group: 'Simulate RBAC',
      run: () => switchUser(u.id)
    }))
  ];

  const filtered = actions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.group.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search action (e.g., 'crm', 'pos', 'dashboard')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            autoFocus
          />
          <button
            onClick={() => setCommandOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.run();
                    setCommandOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">
                    {item.group}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with mouse or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
