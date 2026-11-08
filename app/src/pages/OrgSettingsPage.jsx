import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Plus,
  Globe2,
  ShieldCheck,
  DollarSign,
  Users,
  Shield,
  Key,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';
import { ROLE_PERMISSIONS, RBAC_MODULE_MATRIX } from '../data/mockData';

export const OrgSettingsPage = () => {
  const {
    currentOrg,
    setCurrentOrg,
    selectedBranch,
    setSelectedBranch,
    addAuditLog,
    userPermissions,
    currentUser,
    switchUser,
    allUsers
  } = useApp();

  const [activeTab, setActiveTab] = useState('rbac'); // 'rbac' | 'branches'
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddBranch = (e) => {
    e.preventDefault();
    if (!newBranchName || !newBranchCode) return;

    const newBranch = {
      id: `br_${Date.now()}`,
      name: newBranchName,
      code: newBranchCode.toUpperCase(),
      isHeadquarters: false
    };

    const updated = {
      ...currentOrg,
      branches: [...currentOrg.branches, newBranch]
    };

    setCurrentOrg(updated);
    addAuditLog('ORGANIZATION_BRANCH_ADDED', `Created new operational branch: ${newBranch.name} (${newBranch.code})`);
    setNewBranchName('');
    setNewBranchCode('');
    setShowAddModal(false);
  };

  const rolesList = [
    { key: 'Admin', label: 'Super Admin', color: 'purple' },
    { key: 'Manager', label: 'Operations Manager', color: 'indigo' },
    { key: 'Staff', label: 'Sales & Stock Staff', color: 'emerald' },
    { key: 'Auditor', label: 'Compliance Auditor', color: 'amber' }
  ];

  const getBadgeStyle = (val) => {
    if (val.includes('Full') || val.includes('Allowed') || val.includes('Authorized') || val.includes('Inspect & Export')) {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
    if (val.includes('Read / Write') || val.includes('Inspect Only')) {
      return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    }
    if (val.includes('Standard') || val.includes('Submit Only') || val.includes('Read-Only') || val.includes('Forensic')) {
      return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    }
    return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Module: AUTH-CORE • Security & Governance
            </span>
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              FR-101 Refined
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Governance, RBAC Matrix & Multi-Branch
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Enforce role-based access control policies, inspect system permission matrix, and oversee subsidiary branches.
          </p>
        </div>

        {activeTab === 'branches' && userPermissions.canManageOrg && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Operational Branch</span>
          </button>
        )}
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'rbac'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>RBAC Permission Matrix (FR-101)</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'branches'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Corporate & Branches (FR-102)</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: RBAC PERMISSION MATRIX (FR-101)
          ========================================================================= */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          {/* Active Session Simulation Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Active Session Actor:</span>
                  <span className="text-sm font-bold text-white">{currentUser.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${ROLE_PERMISSIONS[currentUser.role]?.badgeColor}`}>
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {ROLE_PERMISSIONS[currentUser.role]?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                <span>Simulate Role:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      currentUser.id === u.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                    title={`Switch to ${u.name} (${u.role})`}
                  >
                    {u.role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Tier Role Cards Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rolesList.map((r) => {
              const perm = ROLE_PERMISSIONS[r.key];
              const isCurrent = currentUser.role === r.key;
              const assignedMembers = allUsers.filter((u) => u.role === r.key);

              return (
                <div
                  key={r.key}
                  className={`p-4 rounded-2xl border transition ${
                    isCurrent
                      ? 'bg-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${perm?.badgeColor}`}>
                      {r.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        ACTIVE NOW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed min-h-[48px] mt-2">
                    {perm?.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] space-y-1.5 font-medium">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Assigned Personnel:</span>
                      <span className="font-mono text-white font-bold">{assignedMembers.length} user{assignedMembers.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-slate-400 truncate">
                      {assignedMembers.map(m => m.name).join(', ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Functional RBAC Module Matrix Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">
                  Cross-Module Capability Governance Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                FR-101 Standard Baseline
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono">
                    <th className="py-3 px-4 font-semibold">Functional Area</th>
                    <th className="py-3 px-4 font-semibold">Operational Capability</th>
                    <th className="py-3 px-3 font-semibold text-center text-purple-300">Super Admin</th>
                    <th className="py-3 px-3 font-semibold text-center text-indigo-300">Operations Manager</th>
                    <th className="py-3 px-3 font-semibold text-center text-emerald-300">Sales & Stock Staff</th>
                    <th className="py-3 px-3 font-semibold text-center text-amber-300">Compliance Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {RBAC_MODULE_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        {row.module}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {row.capability}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${getBadgeStyle(row.admin)}`}>
                          {row.admin}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${getBadgeStyle(row.manager)}`}>
                          {row.manager}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${getBadgeStyle(row.staff)}`}>
                          {row.staff}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${getBadgeStyle(row.auditor)}`}>
                          {row.auditor}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assigned Personnel Directory */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Personnel Role Assignments ({allUsers.length})</h3>
              </div>
              <span className="text-xs text-slate-400">Single-Sign-On & Session Identity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allUsers.map((u) => {
                const isCurrent = currentUser.id === u.id;
                return (
                  <div
                    key={u.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                      isCurrent ? 'bg-indigo-950/30 border-indigo-500/50' : 'bg-slate-950/40 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{u.name}</h4>
                        <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                        <span className={`inline-block text-[10px] font-mono font-bold mt-1 px-1.5 py-0.2 rounded border ${ROLE_PERMISSIONS[u.role]?.badgeColor}`}>
                          {u.role}
                        </span>
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        onClick={() => switchUser(u.id)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 shrink-0 transition"
                      >
                        Assume
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CORPORATE MASTER & OPERATIONAL BRANCHES (FR-102)
          ========================================================================= */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Org Master Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{currentOrg.name}</h2>
                <span className="text-xs font-mono text-slate-400">{currentOrg.code}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Base Reporting Currency</span>
                <span className="font-mono font-bold text-emerald-400">{currentOrg.currency}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Default Timezone</span>
                <span className="text-slate-200">{currentOrg.timezone}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Fiscal Year Start</span>
                <span className="text-slate-200">{currentOrg.fiscalYearStart}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Corporate Tax Rate</span>
                <span className="text-slate-200">{currentOrg.taxRate}%</span>
              </div>
            </div>
          </div>

          {/* Branches Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-300">Registered Subsidiary Branches ({currentOrg.branches.length})</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {currentOrg.branches.map(branch => (
                <div
                  key={branch.id}
                  className={`bg-slate-900/80 border rounded-2xl p-5 space-y-3 transition ${
                    selectedBranch.id === branch.id
                      ? 'border-indigo-500/80 bg-indigo-950/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {branch.code}
                    </span>
                    {branch.isHeadquarters && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        Headquarters
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{branch.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Operational Branch Unit</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-mono">Status: Active</span>
                    {selectedBranch.id === branch.id ? (
                      <span className="text-indigo-400 font-bold">● Active View</span>
                    ) : (
                      <button
                        onClick={() => setSelectedBranch(branch)}
                        className="text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Select Branch →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleAddBranch} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Add New Operational Branch</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Branch Name</label>
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="e.g., Tokyo Regional Center"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Branch Code</label>
              <input
                type="text"
                value={newBranchCode}
                onChange={(e) => setNewBranchCode(e.target.value)}
                placeholder="e.g., TYO-01"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Create Branch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
