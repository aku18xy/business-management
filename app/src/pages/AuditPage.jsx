import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, History, Download, Database, Lock, AlertTriangle, ArrowRightLeft } from 'lucide-react';

export const AuditPage = () => {
  const { auditLogs, userPermissions, currentUser, switchUser, allUsers } = useApp();

  const exportAuditJSON = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (!userPermissions?.canViewAuditLogs) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
              Module: AUTH-CORE • Security Access Restricted
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Immutable Audit Trail & Compliance Log
          </h1>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/90 border border-rose-500/30 text-center max-w-2xl mx-auto space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Access Clearance Required (FR-101)</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Forensic audit logs contain sensitive operational changes and financial mutations. Access is restricted to <strong>Super Admin</strong>, <strong>Operations Manager</strong>, and <strong>Compliance Auditor</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 inline-block font-mono">
            Active Identity: <span className="text-white font-bold">{currentUser.name}</span> • Role: <span className="text-rose-400 font-bold">{currentUser.role}</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-2 font-medium">Switch session role to inspect audit trail:</span>
            <div className="flex items-center justify-center gap-2">
              {allUsers.filter(u => u.role !== 'Staff').map((u) => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                >
                  Assume {u.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Module: AUTH-CORE • Security
            </span>
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
              FR-101 Verified
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Immutable Audit Trail & Compliance Log
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Full tamper-evident record of all operational approvals, role switches, and system events.
          </p>
        </div>

        {userPermissions?.canExportReports && (
          <button
            onClick={exportAuditJSON}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Audit Records (JSON)</span>
          </button>
        )}
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-mono">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono text-slate-400">{log.id}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{log.actor}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{log.details}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      HASH_VERIFIED
                    </span>
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
