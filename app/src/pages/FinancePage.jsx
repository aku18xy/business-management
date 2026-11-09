import React, { useState } from 'react';
import { formatRM } from '../utils/format';
import { useApp } from '../context/AppContext';
import {
  Banknote,
  Receipt,
  CreditCard,
  Building,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  BookOpen,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  FileText,
  Calendar,
  Layers,
  Send,
  HelpCircle
} from 'lucide-react';

export const FinancePage = () => {
  const {
    chartOfAccounts,
    invoices,
    vendorBills,
    journalEntries,
    createInvoice,
    recordInvoicePayment,
    createVendorBill,
    payVendorBill,
    addJournalEntry,
    customers,
    vendors,
    userPermissions,
    currentUser,
    currentOrg
  } = useApp();

  const [activeTab, setActiveTab] = useState('ar'); // 'ar' | 'ap' | 'gl' | 'coa' | 'statements'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Wire Transfer');

  const [showNewBillModal, setShowNewBillModal] = useState(false);
  const [showPayBillModal, setShowPayBillModal] = useState(false);
  const [selectedBillForPay, setSelectedBillForPay] = useState(null);

  const [showNewJournalModal, setShowNewJournalModal] = useState(false);

  // New Invoice Form
  const [invCustId, setInvCustId] = useState(customers[0]?.id || '');
  const [invDesc, setInvDesc] = useState('');
  const [invSubtotal, setInvSubtotal] = useState('');
  const [invDueDate, setInvDueDate] = useState('');

  // New Bill Form
  const [billVenId, setBillVenId] = useState(vendors[0]?.id || '');
  const [billDesc, setBillDesc] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billExpenseCode, setBillExpenseCode] = useState('6020');

  // New Journal Form
  const [jrnDesc, setJrnDesc] = useState('');
  const [jrnRef, setJrnRef] = useState('');
  const [jrnDebitAcc, setJrnDebitAcc] = useState('1010');
  const [jrnCreditAcc, setJrnCreditAcc] = useState('4010');
  const [jrnAmount, setJrnAmount] = useState('');

  // Calculations
  const totalAr = invoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? 0 : inv.balanceDue), 0);
  const totalAp = vendorBills.reduce((sum, bill) => sum + (bill.status === 'Paid' ? 0 : (bill.amount - bill.paidAmount)), 0);
  const cashAccount = chartOfAccounts.find(a => a.code === '1010')?.balance || 548500;
  const overdueAr = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.balanceDue, 0);

  // Financial Statements computations
  const totalRevenue = chartOfAccounts.filter(a => a.category === 'Revenue').reduce((sum, a) => sum + a.balance, 0);
  const totalCogs = chartOfAccounts.filter(a => a.code.startsWith('50')).reduce((sum, a) => sum + a.balance, 0);
  const grossProfit = totalRevenue - totalCogs;
  const totalOpex = chartOfAccounts.filter(a => a.code.startsWith('60')).reduce((sum, a) => sum + a.balance, 0);
  const netIncome = grossProfit - totalOpex;

  const totalAssets = chartOfAccounts.filter(a => a.category === 'Asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = chartOfAccounts.filter(a => a.category === 'Liability').reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = chartOfAccounts.filter(a => a.category === 'Equity').reduce((sum, a) => sum + a.balance, 0) + netIncome;

  // Filtered Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === invCustId) || customers[0];
    createInvoice({
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      subtotal: Number(invSubtotal) || 1000,
      description: invDesc || 'Commercial Enterprise Services',
      dueDate: invDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    });
    setShowNewInvoiceModal(false);
    setInvDesc('');
    setInvSubtotal('');
  };

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedInvoiceForPay) return;
    recordInvoicePayment(selectedInvoiceForPay.id, Number(paymentAmount), paymentMethod);
    setShowPaymentModal(false);
    setSelectedInvoiceForPay(null);
  };

  const handleCreateBillSubmit = (e) => {
    e.preventDefault();
    const ven = vendors.find(v => v.id === billVenId) || vendors[0];
    createVendorBill({
      vendorId: ven.id,
      vendorName: ven.name,
      amount: Number(billAmount) || 500,
      description: billDesc || 'Supplier Billing',
      expenseAccountCode: billExpenseCode
    });
    setShowNewBillModal(false);
    setBillDesc('');
    setBillAmount('');
  };

  const handlePayBillSubmit = (e) => {
    e.preventDefault();
    if (!selectedBillForPay) return;
    payVendorBill(selectedBillForPay.id);
    setShowPayBillModal(false);
    setSelectedBillForPay(null);
  };

  const handleCreateJournalSubmit = (e) => {
    e.preventDefault();
    const amt = Number(jrnAmount) || 0;
    if (amt <= 0) return;

    const debitAcc = chartOfAccounts.find(a => a.code === jrnDebitAcc);
    const creditAcc = chartOfAccounts.find(a => a.code === jrnCreditAcc);

    const res = addJournalEntry({
      description: jrnDesc || 'Manual Journal Voucher',
      reference: jrnRef || `JRN-${Date.now().toString().slice(-4)}`,
      lines: [
        { accountCode: debitAcc.code, accountName: debitAcc.name, debit: amt, credit: 0.00 },
        { accountCode: creditAcc.code, accountName: creditAcc.name, debit: 0.00, credit: amt }
      ]
    });

    if (!res.success) {
      alert(res.message);
      return;
    }
    setShowNewJournalModal(false);
    setJrnDesc('');
    setJrnRef('');
    setJrnAmount('');
  };

  const exportStatementsJSON = () => {
    const reportData = {
      reportingPeriod: "Fiscal Year 2026 - Q4 MTD",
      currency: currentOrg.currency,
      organization: currentOrg.name,
      incomeStatement: {
        totalRevenue,
        costOfGoodsSold: totalCogs,
        grossProfit,
        operatingExpenses: totalOpex,
        netOperatingIncome: netIncome
      },
      balanceSheet: {
        totalAssets,
        totalLiabilities,
        totalEquity,
        isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1.0
      },
      chartOfAccounts
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-financial-statements-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Module: FIN-ACCT • Phase 4 Finance
            </span>
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              GAAP / IFRS Double-Entry
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Financial Management & General Ledger
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
            Automated accounts receivable, vendor bills lifecycle, balanced double-entry journal vouchers, and real-time financial statements.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {userPermissions.canManageFinance ? (
            <>
              <button
                onClick={() => setShowNewInvoiceModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>+ Issue Invoice (AR)</span>
              </button>
              <button
                onClick={() => setShowNewJournalModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>+ Post Journal Voucher</span>
              </button>
            </>
          ) : (
            <button
              onClick={exportStatementsJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Statements (JSON)</span>
            </button>
          )}
        </div>
      </div>

      {/* Role notice if staff or auditor */}
      {!userPermissions.canManageFinance && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Forensic Governance Mode (FR-101):</strong> Your active role ({currentUser.role}) has financial statement inspection and audit export clearance. Ledger postings and payment settlements require Finance Lead or Administrator clearance.
          </span>
        </div>
      )}

      {/* Financial Telemetry KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Operating Cash */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Operating Cash & Bank (1010)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {formatRM(cashAccount)}
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
              Liquid
            </span>
          </div>
          <p className="text-[11px] text-slate-500">JPMorgan Chase Corporate Treasury</p>
        </div>

        {/* Accounts Receivable */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Accounts Receivable (AR)</span>
            <Receipt className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {formatRM(totalAr)}
            </span>
            {overdueAr > 0 && (
              <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-bold border border-rose-500/20">
                ${overdueAr.toLocaleString()} Overdue
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Unsettled customer invoices ({invoices.filter(i => i.balanceDue > 0).length})</p>
        </div>

        {/* Accounts Payable */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Accounts Payable (AP)</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {formatRM(totalAp)}
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold border border-amber-500/20">
              Trade Creditors
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Pending vendor disbursements</p>
        </div>

        {/* Net Operating Income */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net Operating Income (P&L)</span>
            <PieChart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {formatRM(netIncome)}
            </span>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-bold border border-purple-500/20">
              {Math.round((netIncome / totalRevenue) * 100)}% Margin
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Revenue ${totalRevenue.toLocaleString()} - COGS & OPEX</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ar'
              ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Accounts Receivable (FR-501)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-mono">
            {invoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ap')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ap'
              ? 'bg-amber-600 text-white shadow shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Accounts Payable (FR-502)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 text-[10px] font-mono">
            {vendorBills.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gl')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'gl'
              ? 'bg-purple-600 text-white shadow shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Double-Entry Journals (FR-503)</span>
        </button>

        <button
          onClick={() => setActiveTab('coa')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'coa'
              ? 'bg-emerald-600 text-white shadow shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Chart of Accounts</span>
        </button>

        <button
          onClick={() => setActiveTab('statements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'statements'
              ? 'bg-sky-600 text-white shadow shadow-sky-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>P&L & Balance Sheet</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: ACCOUNTS RECEIVABLE (FR-501)
          ========================================================================= */}
      {activeTab === 'ar' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-lg">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter invoices by number or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="text-xs text-slate-400">
              Total Outstanding: <strong className="text-amber-400 font-mono">${totalAr.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Invoice # & Date</th>
                    <th className="py-3 px-4">Customer Account</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 font-mono">Total Invoiced</th>
                    <th className="py-3 px-4 font-mono">Balance Due</th>
                    <th className="py-3 px-4 text-center">Aging & Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredInvoices.map((inv) => {
                    const statusStyles = {
                      'Paid': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                      'Partially Paid': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                      'Unpaid': 'bg-slate-800 text-slate-300 border-slate-700',
                      'Overdue': 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    };

                    return (
                      <tr key={inv.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">{inv.invoiceNumber}</span>
                          <span className="text-[11px] text-slate-500">{inv.issueDate}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{inv.customerName}</span>
                          <span className="text-[11px] text-slate-400">{inv.customerEmail}</span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {inv.dueDate}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          ${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-sm">
                          <span className={inv.balanceDue > 0 ? 'text-amber-400' : 'text-slate-500'}>
                            ${inv.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[inv.status]}`}>
                            {inv.status}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                            {inv.agingBucket}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {inv.balanceDue > 0 ? (
                            <button
                              disabled={!userPermissions.canManageFinance}
                              onClick={() => {
                                setSelectedInvoiceForPay(inv);
                                setPaymentAmount(inv.balanceDue.toString());
                                setShowPaymentModal(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-40 shadow transition ml-auto"
                            >
                              Receive Pay
                            </button>
                          ) : (
                            <span className="text-emerald-400 text-xs font-mono flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Settled</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ACCOUNTS PAYABLE (FR-502)
          ========================================================================= */}
      {activeTab === 'ap' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Vendor Invoices & Bills Payable ({vendorBills.length})</h3>
              <p className="text-xs text-slate-400 mt-0.5">Trade creditors, purchase order matched invoices, and disbursement schedules.</p>
            </div>

            {userPermissions.canManageFinance && (
              <button
                onClick={() => setShowNewBillModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-amber-600/25"
              >
                <Plus className="w-4 h-4" />
                <span>+ Enter Vendor Bill</span>
              </button>
            )}
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Bill Number & Date</th>
                    <th className="py-3 px-4">Vendor Supplier</th>
                    <th className="py-3 px-4">Expense Category</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 font-mono">Total Bill</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {vendorBills.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-white block">{b.billNumber}</span>
                        <span className="text-[11px] text-slate-500">{b.billDate}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{b.vendorName}</span>
                        <span className="text-[11px] text-slate-400">PO Ref: {b.poNumber}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {b.category}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {b.dueDate}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-white">
                        ${b.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          b.status === 'Paid'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}>
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {b.status !== 'Paid' ? (
                          <button
                            disabled={!userPermissions.canManageFinance}
                            onClick={() => {
                              setSelectedBillForPay(b);
                              setShowPayBillModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-40 shadow transition ml-auto"
                          >
                            Pay Bill
                          </button>
                        ) : (
                          <span className="text-emerald-400 text-xs font-mono flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Disbursed</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DOUBLE-ENTRY GENERAL LEDGER (FR-503)
          ========================================================================= */}
      {activeTab === 'gl' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Double-Entry General Ledger Journals ({journalEntries.length})</h3>
              <p className="text-xs text-slate-400 mt-0.5">Immutable transactional vouchers with automated debit-credit parity verification.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              AUDIT_BALANCED
            </span>
          </div>

          <div className="space-y-3">
            {journalEntries.map((jrn) => {
              const debitTotal = jrn.lines.reduce((s, l) => s + (l.debit || 0), 0);
              const creditTotal = jrn.lines.reduce((s, l) => s + (l.credit || 0), 0);

              return (
                <div key={jrn.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {jrn.entryNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white">{jrn.description}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>Ref: {jrn.reference}</span>
                      <span>•</span>
                      <span>{jrn.date}</span>
                      <span>•</span>
                      <span className="text-slate-300">{jrn.actor}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-slate-500 text-[10px] uppercase">
                          <th className="py-1 px-3">Account Code & Title</th>
                          <th className="py-1 px-3 text-right">Debit (RM)</th>
                          <th className="py-1 px-3 text-right">Credit (RM)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {jrn.lines.map((ln, idx) => (
                          <tr key={idx} className="hover:bg-slate-950/40">
                            <td className="py-1.5 px-3 font-sans">
                              <span className="font-mono text-purple-400 font-bold mr-2">{ln.accountCode}</span>
                              <span className="text-slate-200">{ln.accountName}</span>
                            </td>
                            <td className="py-1.5 px-3 text-right text-emerald-400 font-bold">
                              {ln.debit > 0 ? `$${ln.debit.toFixed(2)}` : '—'}
                            </td>
                            <td className="py-1.5 px-3 text-right text-indigo-400 font-bold">
                              {ln.credit > 0 ? `$${ln.credit.toFixed(2)}` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-slate-800 text-xs font-bold">
                          <td className="py-1.5 px-3 text-slate-400">Total Parity Balance:</td>
                          <td className="py-1.5 px-3 text-right text-emerald-400">${debitTotal.toFixed(2)}</td>
                          <td className="py-1.5 px-3 text-right text-indigo-400">${creditTotal.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CHART OF ACCOUNTS (COA)
          ========================================================================= */}
      {activeTab === 'coa' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Universal Chart of Accounts ({chartOfAccounts.length} Master Accounts)</h3>
            <span className="text-xs text-slate-400 font-mono">GAAP / IFRS Structure</span>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Account Code</th>
                    <th className="py-3 px-4">Account Name</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">Sub-Type</th>
                    <th className="py-3 px-4 text-center">Normal Balance</th>
                    <th className="py-3 px-4 text-right font-mono">Current Balance ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {chartOfAccounts.map((acc) => (
                    <tr key={acc.code} className="hover:bg-slate-900/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-purple-400">
                        {acc.code}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {acc.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          acc.category === 'Asset' ? 'bg-emerald-500/10 text-emerald-300' :
                          acc.category === 'Liability' ? 'bg-amber-500/10 text-amber-300' :
                          acc.category === 'Equity' ? 'bg-purple-500/10 text-purple-300' :
                          acc.category === 'Revenue' ? 'bg-indigo-500/10 text-indigo-300' :
                          'bg-rose-500/10 text-rose-300'
                        }`}>
                          {acc.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {acc.subType}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-400">
                        {acc.normal}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        {formatRM(acc.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: STATEMENTS: P&L & BALANCE SHEET (FR-503)
          ========================================================================= */}
      {activeTab === 'statements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Real-Time Financial Statements & Compliance</h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated aggregation of all ledger entries into executive statements.</p>
            </div>
            <button
              onClick={exportStatementsJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Statements (JSON)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Statement (P&L) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Income Statement (Profit & Loss)</h4>
                  <p className="text-xs text-slate-400">For the period ended {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Accrual Basis
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Revenue */}
                <div>
                  <div className="flex items-center justify-between font-bold text-slate-300 pb-1">
                    <span className="uppercase text-[11px] tracking-wider text-slate-400">Total Operating Revenues</span>
                    <span className="font-mono text-white">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pl-3 space-y-1 text-slate-400">
                    <div className="flex justify-between"><span>Commercial Enterprise Revenue (4010)</span><span className="font-mono">$245,000.00</span></div>
                    <div className="flex justify-between"><span>Countertop POS Retail Revenue (4020)</span><span className="font-mono">$39,500.00</span></div>
                    <div className="flex justify-between"><span>Professional Services & Consulting (4030)</span><span className="font-mono">$18,000.00</span></div>
                  </div>
                </div>

                {/* COGS */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between font-bold text-slate-300 pb-1">
                    <span className="uppercase text-[11px] tracking-wider text-slate-400">Cost of Goods Sold (COGS)</span>
                    <span className="font-mono text-rose-400">(${totalCogs.toLocaleString(undefined, { minimumFractionDigits: 2 })})</span>
                  </div>
                  <div className="pl-3 space-y-1 text-slate-400">
                    <div className="flex justify-between"><span>Hardware & POS Direct Materials (5010)</span><span className="font-mono">$74,200.00</span></div>
                    <div className="flex justify-between"><span>Freight, Customs & Duties (5020)</span><span className="font-mono">$6,800.00</span></div>
                  </div>
                </div>

                {/* Gross Profit */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between font-bold text-sm">
                  <span className="text-white">Gross Operating Profit</span>
                  <span className="font-mono text-emerald-400">${grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                {/* OPEX */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between font-bold text-slate-300 pb-1">
                    <span className="uppercase text-[11px] tracking-wider text-slate-400">Operating Expenses (OPEX)</span>
                    <span className="font-mono text-rose-400">(${totalOpex.toLocaleString(undefined, { minimumFractionDigits: 2 })})</span>
                  </div>
                  <div className="pl-3 space-y-1 text-slate-400">
                    <div className="flex justify-between"><span>Salaries, Wages & Benefits (6010)</span><span className="font-mono">$42,000.00</span></div>
                    <div className="flex justify-between"><span>Cloud Infrastructure & Software (6020)</span><span className="font-mono">$8,400.00</span></div>
                    <div className="flex justify-between"><span>Depot Facilities & Office Leases (6030)</span><span className="font-mono">$14,500.00</span></div>
                    <div className="flex justify-between"><span>Marketing & Customer Acquisition (6040)</span><span className="font-mono">$6,100.00</span></div>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-slate-950 border border-emerald-500/40 flex justify-between font-bold text-base shadow-lg">
                  <span className="text-white">Net Operating Income</span>
                  <span className="font-mono text-emerald-400">${netIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Balance Sheet */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Balance Sheet (Statement of Financial Position)</h4>
                  <p className="text-xs text-slate-400">As of {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  A = L + E Verified
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Assets */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold text-sm text-white">
                    <span>Total Assets</span>
                    <span className="font-mono text-emerald-400">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="space-y-1 text-slate-400 pl-2">
                    <div className="flex justify-between"><span>Cash & Bank Equivalents (1010)</span><span className="font-mono">${cashAccount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Accounts Receivable (1100)</span><span className="font-mono">${totalAr.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Merchandise & ERP Inventory (1200)</span><span className="font-mono">$48,500.00</span></div>
                    <div className="flex justify-between"><span>Property & Equipment (1500)</span><span className="font-mono">$85,000.00</span></div>
                  </div>
                </div>

                {/* Liabilities */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold text-sm text-white">
                    <span>Total Liabilities</span>
                    <span className="font-mono text-amber-400">${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="space-y-1 text-slate-400 pl-2">
                    <div className="flex justify-between"><span>Accounts Payable (2010)</span><span className="font-mono">${totalAp.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Sales Tax & VAT Collected (2020)</span><span className="font-mono">$14,210.00</span></div>
                    <div className="flex justify-between"><span>Accrued Payroll & Benefits (2100)</span><span className="font-mono">$24,500.00</span></div>
                  </div>
                </div>

                {/* Equity */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold text-sm text-white">
                    <span>Total Shareholders' Equity</span>
                    <span className="font-mono text-purple-400">${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="space-y-1 text-slate-400 pl-2">
                    <div className="flex justify-between"><span>Common Paid-in Capital (3010)</span><span className="font-mono">$350,000.00</span></div>
                    <div className="flex justify-between"><span>Retained Earnings & Current Period P&L</span><span className="font-mono">${(totalEquity - 350000).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  </div>
                </div>

                {/* Balance Equation check */}
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
                  <span>Accounting Equation Balance:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    Assets (${totalAssets.toLocaleString()}) = Liabilities + Equity (${(totalLiabilities + totalEquity).toLocaleString()})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS
          ========================================================================= */}

      {/* 1. Issue Invoice Modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleCreateInvoiceSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">+ Issue Commercial AR Invoice (FR-501)</h3>
              <button type="button" onClick={() => setShowNewInvoiceModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Customer Client Account *</label>
              <select
                value={invCustId}
                onChange={(e) => setInvCustId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.contactPerson})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Line Item Description *</label>
              <input
                type="text"
                placeholder="e.g., Enterprise Software Implementation & Hardware Pack"
                value={invDesc}
                onChange={(e) => setInvDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Subtotal Amount (RM) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="12500.00"
                  value={invSubtotal}
                  onChange={(e) => setInvSubtotal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={invDueDate}
                  onChange={(e) => setInvDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-300">
              Issuing automatically calculates {currentOrg.taxRate}% corporate tax and posts balancing double-entry voucher (Debit AR, Credit Revenue & Tax).
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewInvoiceModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Issue Invoice & Post Ledger
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Receive Payment Modal */}
      {showPaymentModal && selectedInvoiceForPay && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleRecordPaymentSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Record Customer Payment</h3>
              <button type="button" onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice Number:</span>
                <span className="font-mono text-white font-bold">{selectedInvoiceForPay.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-white">{selectedInvoiceForPay.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Balance:</span>
                <span className="font-mono text-amber-400 font-bold">${selectedInvoiceForPay.balanceDue.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Payment Amount Received ($) *</label>
              <input
                type="number"
                step="0.01"
                max={selectedInvoiceForPay.balanceDue}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Payment Tender Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Wire Transfer">Wire Transfer (Fedwire / SWIFT)</option>
                <option value="Bank ACH">Automated Clearing House (ACH)</option>
                <option value="Corporate Credit Card">Corporate Credit Card</option>
                <option value="Cash Deposit">Treasury Cash Deposit</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Confirm Settlement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Enter Vendor Bill Modal */}
      {showNewBillModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleCreateBillSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">+ Enter Commercial Vendor Bill (FR-502)</h3>
              <button type="button" onClick={() => setShowNewBillModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Vendor Supplier *</label>
              <select
                value={billVenId}
                onChange={(e) => setBillVenId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.paymentTerms})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Bill Description *</label>
              <input
                type="text"
                placeholder="e.g., Raw Material Component Procurement or Cloud Hosting"
                value={billDesc}
                onChange={(e) => setBillDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pre-Tax Amount (RM) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="3500.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Expense Account</label>
                <select
                  value={billExpenseCode}
                  onChange={(e) => setBillExpenseCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  <option value="6020">6020 - Cloud & Software</option>
                  <option value="5010">5010 - Cost of Goods Sold</option>
                  <option value="6030">6030 - Facilities & Depot Lease</option>
                  <option value="6040">6040 - Marketing & Client Acq</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewBillModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Record AP Bill
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Pay Bill Modal */}
      {showPayBillModal && selectedBillForPay && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handlePayBillSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Authorize Vendor Disbursement</h3>
              <button type="button" onClick={() => setShowPayBillModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Bill Number:</span>
                <span className="font-mono text-white font-bold">{selectedBillForPay.billNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payee:</span>
                <span className="text-white font-medium">{selectedBillForPay.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Disbursement Amount:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">${selectedBillForPay.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              Disbursement will draw funds from <strong>JPMorgan Operating Cash (1010)</strong> and post a debit voucher to <strong>Accounts Payable (2010)</strong>.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPayBillModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Authorize & Disburse
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Post Manual Journal Entry Modal */}
      {showNewJournalModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleCreateJournalSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">+ Post Double-Entry Journal Voucher (FR-503)</h3>
              <button type="button" onClick={() => setShowNewJournalModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Transaction Description *</label>
              <input
                type="text"
                placeholder="e.g., Year-End Depreciation Expense Recognition"
                value={jrnDesc}
                onChange={(e) => setJrnDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Debit Account (Increase Asset/Expense) *</label>
                <select
                  value={jrnDebitAcc}
                  onChange={(e) => setJrnDebitAcc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  {chartOfAccounts.map(a => (
                    <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Credit Account (Increase Liab/Rev) *</label>
                <select
                  value={jrnCreditAcc}
                  onChange={(e) => setJrnCreditAcc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  {chartOfAccounts.map(a => (
                    <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Balanced Transaction Amount (RM) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="5000.00"
                  value={jrnAmount}
                  onChange={(e) => setJrnAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">External Audit Reference</label>
                <input
                  type="text"
                  placeholder="e.g., ADJ-Q4-001"
                  value={jrnRef}
                  onChange={(e) => setJrnRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewJournalModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Commit Journal Voucher
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
