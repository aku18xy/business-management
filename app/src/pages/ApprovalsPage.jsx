import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, Clock, Filter, AlertCircle } from 'lucide-react';

export const ApprovalsPage = () => {
  const { approvals, handleApprovalAction, userPermissions } = useApp();
  const [filter, setFilter] = useState('All');

  const filtered = approvals.filter(item => {
    if (filter === 'All') return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Centralized Approvals Workflow
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Review, authorize, or decline Purchase Orders, Expense Claims, and Team Requests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {!userPermissions.canApproveTransactions && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            You are currently viewing in read-only mode. Switch your active role in the bottom-left sidebar to <strong>Manager</strong> or <strong>Admin</strong> to take approval decisions.
          </span>
        </div>
      )}

      {/* Approvals Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-mono">
                <th className="py-3 px-4">Item Type</th>
                <th className="py-3 px-4">Description / Subject</th>
                <th className="py-3 px-4">Department / Requester</th>
                <th className="py-3 px-4">Amount / Unit</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{item.requester}</div>
                    <span className="text-[11px] text-slate-500">{item.department}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {item.amount}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      item.status === 'Approved'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : item.status === 'Rejected'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={!userPermissions.canApproveTransactions}
                          onClick={() => handleApprovalAction(item.id, 'Approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          Approve
                        </button>
                        <button
                          disabled={!userPermissions.canApproveTransactions}
                          onClick={() => handleApprovalAction(item.id, 'Rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-mono">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
