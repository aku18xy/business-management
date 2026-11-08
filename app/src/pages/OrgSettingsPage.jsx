import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Plus, Globe2, ShieldCheck, DollarSign } from 'lucide-react';

export const OrgSettingsPage = () => {
  const { currentOrg, setCurrentOrg, selectedBranch, setSelectedBranch, addAuditLog, userPermissions } = useApp();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Organization & Multi-Branch Management
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Global corporate entities, base operating currencies, and distributed subsidiary locations.
          </p>
        </div>

        {userPermissions.canManageOrg && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Operational Branch</span>
          </button>
        )}
      </div>

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
