import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Building,
  Mail,
  Phone,
  Tag,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  FileText,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  X,
  Pencil
} from 'lucide-react';

export const CrmPage = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deals,
    addDeal,
    updateDealStage,
    pipelineStages,
    quotations,
    createQuotation,
    currentOrg
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('pipeline'); // 'pipeline' | 'customers' | 'quotes'
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [selectedDealForQuote, setSelectedDealForQuote] = useState(null);

  // Edit Customer Modal State (FR-302)
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editCustName, setEditCustName] = useState('');
  const [editCustContact, setEditCustContact] = useState('');
  const [editCustEmail, setEditCustEmail] = useState('');
  const [editCustPhone, setEditCustPhone] = useState('');
  const [editCustIndustry, setEditCustIndustry] = useState('');
  const [editCustLimit, setEditCustLimit] = useState('');
  const [editCustStatus, setEditCustStatus] = useState('Active');

  // New Deal Form State
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealCustomer, setNewDealCustomer] = useState(customers[0]?.id || '');
  const [newDealValue, setNewDealValue] = useState('');
  const [newDealPriority, setNewDealPriority] = useState('High');

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustContact, setNewCustContact] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustIndustry, setNewCustIndustry] = useState('Enterprise SaaS');
  const [newCustLimit, setNewCustLimit] = useState(50000);

  // Total Pipeline Metrics
  const totalPipelineValue = deals.reduce((acc, d) => acc + (d.stage !== 'lost' ? d.value : 0), 0);
  const weightedPipelineValue = deals.reduce((acc, d) => {
    const stageObj = pipelineStages.find(s => s.id === d.stage);
    return acc + d.value * (stageObj ? stageObj.probability : 0.5);
  }, 0);
  const wonCount = deals.filter(d => d.stage === 'won').length;

  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!newDealTitle || !newDealValue) return;

    const custObj = customers.find(c => c.id === newDealCustomer);
    addDeal({
      title: newDealTitle,
      customerId: newDealCustomer,
      customerName: custObj ? custObj.name : 'Unknown Customer',
      value: parseFloat(newDealValue),
      stage: 'lead',
      owner: 'Alex Sterling',
      expectedClose: '2026-12-15',
      priority: newDealPriority,
      notes: 'Created via CRM Quick Action.'
    });

    setNewDealTitle('');
    setNewDealValue('');
    setShowNewDealModal(false);
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustName || !newCustContact) return;

    addCustomer({
      name: newCustName,
      contactPerson: newCustContact,
      email: newCustEmail,
      phone: newCustPhone,
      industry: newCustIndustry,
      creditLimit: parseFloat(newCustLimit),
      tags: ['New Client', 'Direct']
    });

    setNewCustName('');
    setNewCustContact('');
    setNewCustEmail('');
    setNewCustPhone('');
    setShowNewCustomerModal(false);
  };

  const handleQuickQuote = (deal) => {
    const subtotal = deal.value * 0.9;
    const tax = subtotal * (currentOrg.taxRate / 100);
    const total = subtotal + tax;

    createQuotation({
      dealId: deal.id,
      customerId: deal.customerId,
      customerName: deal.customerName,
      validUntil: '2026-12-31',
      items: [
        { description: deal.title, qty: 1, unitPrice: deal.value, total: deal.value }
      ],
      subtotal,
      discount: deal.value * 0.1,
      tax,
      total
    });

    updateDealStage(deal.id, 'proposal');
    alert(`Quotation successfully generated for "${deal.customerName}"! Deal advanced to Proposal Sent.`);
  };

  return (
    <div className="space-y-6">
      {/* CRM Header & Metric Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Module: CRM-SALES • Phase 2
            </span>
            <span className="text-xs font-mono text-emerald-400">Pipeline Velocity</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Customer Relationship & Deal Pipeline
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Manage customer directories, drag-and-drop opportunity forecasting, and 1-click quotation generation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowNewCustomerModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Users className="w-3.5 h-3.5" />
            <span>+ Customer</span>
          </button>
          <button
            onClick={() => setShowNewDealModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Opportunity</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Pipeline Value</span>
          <div className="text-2xl font-black text-white mt-1">
            ${totalPipelineValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
            Across {deals.length} active opportunities
          </span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Weighted Forecast</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">
            ${Math.round(weightedPipelineValue).toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">
            Probability adjusted revenue
          </span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Closed Won Ratio</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {wonCount} Deals Won
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
            {Math.round((wonCount / (deals.length || 1)) * 100)}% Win conversion rate
          </span>
        </div>
      </div>

      {/* CRM Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'pipeline', label: `Kanban Pipeline (${deals.length})` },
          { id: 'customers', label: `Customer Accounts (${customers.length})` },
          { id: 'quotes', label: `Generated Quotations (${quotations.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =====================================================================
          VIEW 1: KANBAN PIPELINE
         ===================================================================== */}
      {activeSubTab === 'pipeline' && (
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {pipelineStages.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={stage.id}
                className="min-w-[280px] md:min-w-0 snap-center shrink-0 md:shrink bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between min-h-[460px]"
              >
                <div>
                  {/* Stage Header */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${stage.color}`}>
                      {stage.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {stageDeals.length}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 mb-3">
                    Vol: <strong className="text-white">${stageTotal.toLocaleString()}</strong>
                  </div>

                  {/* Stage Cards */}
                  <div className="space-y-2.5">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 space-y-2 shadow-sm transition group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                            {deal.title}
                          </h4>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            deal.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {deal.priority}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 truncate">
                          {deal.customerName}
                        </p>

                        <div className="flex items-center justify-between text-xs font-mono font-extrabold text-emerald-400 pt-1">
                          <span>${deal.value.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500 font-sans font-normal">
                            {deal.owner}
                          </span>
                        </div>

                        {/* Quick Stage Mover Selector */}
                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1">
                          <select
                            value={deal.stage}
                            onChange={(e) => updateDealStage(deal.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300 outline-none w-24"
                          >
                            {pipelineStages.map(s => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                          </select>

                          {deal.stage !== 'won' && deal.stage !== 'proposal' && (
                            <button
                              onClick={() => handleQuickQuote(deal)}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold transition"
                              title="Generate quote and move to Proposal Sent"
                            >
                              + Quote
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 text-center">
                  <span className="text-[10px] text-slate-600 font-mono">
                    Prob: {Math.round(stage.probability * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          VIEW 2: CUSTOMERS DIRECTORY
         ===================================================================== */}
      {activeSubTab === 'customers' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-mono">
                  <th className="py-3 px-4">Account Name</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Email & Phone</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Credit Limit</th>
                  <th className="py-3 px-4">Open Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{cust.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">
                      {cust.contactPerson}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      <div>{cust.email}</div>
                      <div className="text-slate-500">{cust.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {cust.industry}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      ${cust.creditLimit.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      ${cust.outstandingBalance.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cust.status === 'Active'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : cust.status === 'Credit Hold'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingCustomer(cust);
                          setEditCustName(cust.name);
                          setEditCustContact(cust.contactPerson);
                          setEditCustEmail(cust.email);
                          setEditCustPhone(cust.phone);
                          setEditCustIndustry(cust.industry);
                          setEditCustLimit(cust.creditLimit.toString());
                          setEditCustStatus(cust.status || 'Active');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition flex items-center gap-1.5 ml-auto"
                        title="Edit Client Profile (FR-302)"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: GENERATED QUOTATIONS
         ===================================================================== */}
      {activeSubTab === 'quotes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotations.map((qt) => (
              <div
                key={qt.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{qt.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-bold">
                      {qt.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Valid: {qt.validUntil}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{qt.customerName}</h4>
                  <p className="text-xs text-slate-400">Enterprise Commercial Quotation</p>
                </div>

                <div className="bg-slate-950/60 rounded-xl p-3 divide-y divide-slate-800/60 text-xs">
                  {qt.items.map((it, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <span className="text-slate-300">{it.qty}x {it.description}</span>
                      <span className="font-mono font-semibold text-slate-200">${it.total.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex items-center justify-between font-bold text-sm">
                    <span className="text-slate-400">Total Contract Value:</span>
                    <span className="font-mono text-emerald-400">${qt.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Deal */}
      {showNewDealModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleCreateDeal} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Create Sales Opportunity</h3>
              <button type="button" onClick={() => setShowNewDealModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Deal Title *</label>
              <input
                type="text"
                value={newDealTitle}
                onChange={(e) => setNewDealTitle(e.target.value)}
                placeholder="e.g., Regional Logistics Fleet GPS Rollout"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Customer Account</label>
              <select
                value={newDealCustomer}
                onChange={(e) => setNewDealCustomer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Estimated Value ($) *</label>
                <input
                  type="number"
                  value={newDealValue}
                  onChange={(e) => setNewDealValue(e.target.value)}
                  placeholder="50000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Priority</label>
                <select
                  value={newDealPriority}
                  onChange={(e) => setNewDealPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewDealModal(false)}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Add Opportunity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: New Customer */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleCreateCustomer} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Add Customer Account</h3>
              <button type="button" onClick={() => setShowNewCustomerModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Company / Account Name *</label>
              <input
                type="text"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="e.g., Summit Global Distribution"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Contact Person *</label>
                <input
                  type="text"
                  value={newCustContact}
                  onChange={(e) => setNewCustContact(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Industry</label>
                <input
                  type="text"
                  value={newCustIndustry}
                  onChange={(e) => setNewCustIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Phone</label>
                <input
                  type="text"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewCustomerModal(false)}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Save Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Edit Client Profile (FR-302) */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-white text-base">Edit Client Profile (FR-302)</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Account ID: {editingCustomer.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editCustName || !editCustContact) return;
              updateCustomer(editingCustomer.id, {
                name: editCustName,
                contactPerson: editCustContact,
                email: editCustEmail,
                phone: editCustPhone,
                industry: editCustIndustry,
                creditLimit: parseFloat(editCustLimit) || 0,
                status: editCustStatus
              });
              setEditingCustomer(null);
            }} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Company / Account Name</label>
                  <input
                    type="text"
                    required
                    value={editCustName}
                    onChange={(e) => setEditCustName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Primary Contact Person</label>
                  <input
                    type="text"
                    required
                    value={editCustContact}
                    onChange={(e) => setEditCustContact(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editCustEmail}
                    onChange={(e) => setEditCustEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Direct Phone</label>
                  <input
                    type="text"
                    required
                    value={editCustPhone}
                    onChange={(e) => setEditCustPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Industry Vertical</label>
                  <input
                    type="text"
                    required
                    value={editCustIndustry}
                    onChange={(e) => setEditCustIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Credit Limit ($ USD)</label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    required
                    value={editCustLimit}
                    onChange={(e) => setEditCustLimit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Account Status</label>
                  <select
                    value={editCustStatus}
                    onChange={(e) => setEditCustStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Credit Hold">Credit Hold</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
                >
                  Save Profile Changes →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
