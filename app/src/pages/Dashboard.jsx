import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REVENUE_CHART_DATA } from '../data/mockData';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';

export const Dashboard = () => {
  const { kpis, currentOrg, selectedBranch, approvals, handleApprovalAction, userPermissions, setActiveTab } = useApp();
  const [dateRange, setDateRange] = useState('MTD');

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Module: EXEC-DASH
            </span>
            <span className="text-xs font-mono text-emerald-400">Live Production Feed</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Executive Command Cockpit
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Real-time financial telemetry, liquidity metrics, and actionable pending approvals across {currentOrg.name} ({selectedBranch.name}).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {['Today', 'MTD', 'QTD', 'YTD'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                dateRange === range
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Revenue */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Revenue ({dateRange})</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ${kpis.revenue.value.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{kpis.revenue.change}</span>
            <span className="text-slate-500">{kpis.revenue.period}</span>
          </div>
        </div>

        {/* Metric 2: Net Operating Profit */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Net Profit Margin</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ${kpis.netProfit.value.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-bold">
              {kpis.netProfit.margin}
            </span>
            <span className="text-slate-400">{kpis.netProfit.change} vs budget</span>
          </div>
        </div>

        {/* Metric 3: Cash On Hand & Runway */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Available Liquidity</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ${kpis.cashflow.cashOnHand.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>AR: <strong className="text-amber-400">${kpis.cashflow.receivables.toLocaleString()}</strong></span>
            <span>Runway: <strong className="text-purple-400">{kpis.cashflow.runwayMonths} mos</strong></span>
          </div>
        </div>

        {/* Metric 4: Operational Alerts */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Inventory & Approvals</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 tracking-tight">
            {kpis.inventoryAlerts.lowStockCount} Low Stock
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>Pending Approvals: <strong className="text-amber-400">{pendingApprovals.length}</strong></span>
            <button
              onClick={() => setActiveTab('approvals')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Resolve →
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts & Approval Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Expenses Trend Bar */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Financial Velocity (Revenue vs Expenses)</h3>
              <p className="text-xs text-slate-400">Monthly double-entry cashflow performance ({currentOrg.currency})</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-indigo-500"></span> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-purple-500"></span> Expenses
              </span>
            </div>
          </div>

          {/* Simple custom SVG chart for zero-dependency reliability */}
          <div className="h-64 w-full flex items-end gap-4 pt-6 px-2">
            {REVENUE_CHART_DATA.map((item, idx) => {
              const maxVal = 300000;
              const revHeight = (item.revenue / maxVal) * 100;
              const expHeight = (item.expenses / maxVal) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition mb-1">
                    ${Math.round(item.revenue / 1000)}k
                  </div>
                  <div className="w-full flex items-end justify-center gap-1.5 h-48 bg-slate-950/40 rounded-xl p-1.5 border border-slate-800/60">
                    <div
                      className="w-1/2 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-lg transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${revHeight}%` }}
                      title={`Revenue: $${item.revenue.toLocaleString()}`}
                    ></div>
                    <div
                      className="w-1/2 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${expHeight}%` }}
                      title={`Expenses: $${item.expenses.toLocaleString()}`}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 mt-2">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Approvals Inbox Widget */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Unified Action Inbox</h3>
                <p className="text-xs text-slate-400">{pendingApprovals.length} pending decisions</p>
              </div>
              <button
                onClick={() => setActiveTab('approvals')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {pendingApprovals.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20 font-bold">
                      {item.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">{item.amount}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">{item.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>From: {item.requester}</span>
                    <span>{item.date}</span>
                  </div>

                  {userPermissions.canApproveTransactions ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => handleApprovalAction(item.id, 'Approved')}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprovalAction(item.id, 'Rejected')}
                        className="flex-1 py-1 px-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic pt-1">
                      (Requires Manager or Admin role to approve)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Audit trail logging is active</span>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              Audit Log <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
