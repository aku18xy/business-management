import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  FileCheck2,
  History,
  ExternalLink,
  ChevronDown,
  Users2,
  Store,
  Boxes,
  X
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    navigateToTab,
    navigateToPath,
    currentUser,
    allUsers,
    switchUser,
    currentOrg,
    selectedBranch,
    setSelectedBranch,
    approvals,
    deals,
    inventoryItems,
    userPermissions,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useApp();

  const pendingCount = approvals.filter(a => a.status === 'Pending').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Cockpit',
      icon: LayoutDashboard,
      badge: null,
      visible: userPermissions.canViewDashboard
    },
    {
      id: 'crm',
      label: 'CRM & Sales Deals',
      icon: Users2,
      badge: `${deals.length}`,
      visible: true
    },
    {
      id: 'inventory',
      label: 'ERP Inventory & SCM',
      icon: Boxes,
      badge: `${inventoryItems?.length || 8}`,
      visible: true
    },
    {
      id: 'pos',
      label: 'POS Catalog & Shifts',
      icon: Store,
      badge: 'Admin',
      visible: true
    },
    {
      id: 'approvals',
      label: 'Approval Inbox',
      icon: FileCheck2,
      badge: pendingCount > 0 ? `${pendingCount}` : null,
      visible: true
    },
    {
      id: 'audit',
      label: 'Security & Audit Trail',
      icon: History,
      badge: null,
      visible: userPermissions.canViewAuditLogs
    },
    {
      id: 'org',
      label: 'Organization & Branches',
      icon: Building2,
      badge: null,
      visible: userPermissions.canManageOrg || currentUser.role === 'Admin'
    }
  ];

  const renderContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full min-h-full">
      <div>
        {/* Organization Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
              NB
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight leading-tight">
                NexusBMS
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Suite</p>
            </div>
          </div>
          
          {isMobile ? (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Phase 1-3 Active
            </span>
          )}
        </div>

        {/* Branch Context Selector */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="uppercase font-semibold tracking-wider">Active Branch</span>
            <span className="font-mono text-emerald-400">{currentOrg.currency}</span>
          </div>
          <div className="relative">
            <select
              value={selectedBranch.id}
              onChange={(e) => {
                const b = currentOrg.branches.find(x => x.id === e.target.value);
                if (b) setSelectedBranch(b);
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 appearance-none font-medium cursor-pointer"
            >
              {currentOrg.branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Active Business Modules
          </div>
          {navItems.filter(item => item.visible).map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateToTab(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                  active
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    item.badge === 'Live'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Countertop POS Kiosk Launcher */}
          <div className="pt-2">
            <button
              onClick={() => {
                navigateToPath('/pos');
                if (isMobile) setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between bg-gradient-to-r from-emerald-950/40 to-indigo-950/40 hover:from-emerald-900/50 hover:to-indigo-900/50 text-emerald-300 border border-emerald-500/30 transition group shadow-inner"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                <span className="font-bold">Launch POS Kiosk (/pos)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Next Roadmap Phases
            </span>
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center justify-between py-1">
                <span>Phase 4: Finance & Ledger</span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">Next Up</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Phase 5: HRM & Payroll</span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded">Planned</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Phase 6: Project Delivery</span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded">Planned</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* User Session & Role Simulation Switcher */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 mt-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Active Role (RBAC)
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${userPermissions.badgeColor}`}>
            {currentUser.role}
          </span>
        </div>

        <div className="flex items-center gap-2.5 p-2 bg-slate-900 rounded-xl border border-slate-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.title}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-1 overflow-x-auto py-1">
          {allUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                switchUser(u.id);
                if (isMobile) setMobileMenuOpen(false);
              }}
              className={`flex-1 text-[10px] py-1 px-1.5 rounded text-center font-medium transition ${
                currentUser.id === u.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={`Switch to ${u.name} (${u.role})`}
            >
              {u.role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between select-none shrink-0 h-screen sticky top-0 overflow-y-auto">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer Backdrop & Modal Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 z-10 flex flex-col justify-between h-full overflow-y-auto shadow-2xl">
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
