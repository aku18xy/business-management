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
  const { kpis, currentOrg, selectedBranch, approvals, handleApprovalAction, userPermissions, setActiveTab, posOrders } = useApp();
  const [dateRange, setDateRange] = useState('MTD');

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  // Dynamically compute chart data including real-time POS sales
  const liveChartData = [
    ...REVENUE_CHART_DATA,
    {
      month: "Nov (Live)",
      revenue: 295000 + (kpis.revenue.posContribution || 0),
      expenses: 146000,
      profit: 149000 + Math.round((kpis.revenue.posContribution || 0) * 0.38)
    }
  ];

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

        <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          {['Today', 'MTD', 'QTD', 'YTD'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
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
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Revenue ({dateRange})</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ${kpis.revenue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          
          {kpis.revenue.posContribution > 0 ? (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>+${kpis.revenue.posContribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} from POS</span>
              <span className="text-emerald-300/70">({kpis.revenue.posOrdersCount} sales)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{kpis.revenue.change}</span>
              <span className="text-slate-500">{kpis.revenue.period}</span>
            </div>
          )}
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
            ${kpis.netProfit.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            ${kpis.cashflow.cashOnHand.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>AR: <strong className="text-amber-400">${kpis.cashflow.receivables.toLocaleString()}</strong></span>
            <span>POS Inflow: <strong className="text-purple-400">+${kpis.cashflow.posCashCollected?.toFixed(0) || 0}</strong></span>
          </div>
        </div>

        {/* Metric 4: Operational Alerts */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">ERP Stock & Approvals</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 tracking-tight flex items-baseline justify-between">
            <span>{kpis.inventoryAlerts.erpLowStockCount || kpis.inventoryAlerts.lowStockCount} Low Stock</span>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 font-sans"
            >
              View ERP →
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>Valuation: <strong className="text-emerald-400">${(kpis.inventoryAlerts.erpValuation || 48500).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></span>
            <span>Pending: <strong className="text-amber-400">{pendingApprovals.length}</strong></span>
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
          <div className="h-64 w-full flex items-end gap-2 sm:gap-3 pt-6 px-1 sm:px-2 overflow-x-auto pb-1">
            {liveChartData.map((item, idx) => {
              const maxVal = 320000;
              const revHeight = Math.min(100, (item.revenue / maxVal) * 100);
              const expHeight = Math.min(100, (item.expenses / maxVal) * 100);
              const isLive = item.month.includes('Live');

              return (
                <div key={idx} className="flex-1 min-w-[34px] flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition mb-1">
                    ${Math.round(item.revenue / 1000)}k
                  </div>
                  <div className={`w-full flex items-end justify-center gap-1.5 h-48 rounded-xl p-1.5 border transition ${
                    isLive ? 'bg-indigo-950/40 border-indigo-500/40 ring-1 ring-indigo-500/30' : 'bg-slate-950/40 border-slate-800/60'
                  }`}>
                    <div
                      className={`w-1/2 rounded-lg transition-all duration-300 group-hover:brightness-110 ${
                        isLive ? 'bg-gradient-to-t from-emerald-600 to-indigo-500' : 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                      }`}
                      style={{ height: `${revHeight}%` }}
                      title={`Revenue: $${item.revenue.toLocaleString()}`}
                    ></div>
                    <div
                      className="w-1/2 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${expHeight}%` }}
                      title={`Expenses: $${item.expenses.toLocaleString()}`}
                    ></div>
                  </div>
                  <span className={`text-[11px] font-semibold mt-2 text-center whitespace-nowrap ${
                    isLive ? 'text-indigo-400 font-bold' : 'text-slate-400'
                  }`}>
                    {item.month}
                  </span>
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

      {/* POS Telemetry Stream: Real-Time Sales Inflow */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Integration: MOD-08 ↔ EXEC-DASH
              </span>
              <span className="text-xs font-mono text-indigo-400">Ledger Stream</span>
            </div>
            <h3 className="text-base font-bold text-white">Point of Sale Live Revenue Stream</h3>
            <p className="text-xs text-slate-400">
              Transactions from retail and branch POS registers automatically roll up into Executive Cockpit revenue and cash-on-hand.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('pos')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition self-start sm:self-auto shadow-sm"
          >
            Launch POS Terminal →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {posOrders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-indigo-400 font-bold">{order.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {order.status}
                  </span>
                </div>
                <div className="text-lg font-black text-white mb-1">
                  ${order.total.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 mt-3 border-t border-slate-800/60">
                <span>{order.cashier}</span>
                <span className="font-mono text-slate-400">{order.paymentMethod}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
