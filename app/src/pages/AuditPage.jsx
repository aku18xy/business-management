import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, History, Download, Database } from 'lucide-react';

export const AuditPage = () => {
  const { auditLogs } = useApp();

  const exportAuditJSON = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Module: AUTH-CORE • Security
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Immutable Audit Trail & Compliance Log
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Full tamper-evident record of all operational approvals, role switches, and system events.
          </p>
        </div>

        <button
          onClick={exportAuditJSON}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Audit Records (JSON)</span>
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-mono">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Audit Payload / Details</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-indigo-400 font-bold">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300 max-w-md">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {log.ipAddress}
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
