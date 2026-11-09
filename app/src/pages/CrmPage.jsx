import React, { useState } from 'react';
import { formatRM } from '../utils/format';
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
  Banknote,
  TrendingUp,
  FileText,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  X,
  Pencil,
  ShieldCheck,
  GripVertical,
  Download,
  Receipt,
  FileCheck
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
    updateQuotationStatus,
    createInvoice,
    navigateToTab,
    currentOrg,
    userPermissions
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('pipeline'); // 'pipeline' | 'customers' | 'quotes'
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [selectedDealForQuote, setSelectedDealForQuote] = useState(null);

  // Drag and Drop state (FR-302-B Kanban)
  const [draggingDealId, setDraggingDealId] = useState(null);
  const [dragOverStageId, setDragOverStageId] = useState(null);

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

  // State for Invoice Generation success feedback
  const [invoicingSuccess, setInvoicingSuccess] = useState(null);

  // FR-304: Official Quotation PDF Export & Document Generation
  const handleDownloadQuotationPDF = (qt) => {
    const cust = customers.find(c => c.id === qt.customerId) || {};
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popup windows in your browser to download/print the Quotation PDF.');
      return;
    }

    const itemsRows = (qt.items || []).map((it, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px; font-family: monospace; color: #64748b;">${idx + 1}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${it.description}</td>
        <td style="padding: 10px 12px; text-align: center; color: #334155;">${it.qty || 1}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #334155;">${formatRM(it.unitPrice || it.total)}</td>
        <td style="padding: 10px 12px; text-align: right; font-family: monospace; font-weight: 700; color: #0f172a;">${formatRM(it.total)}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quotation_${qt.id}_${(qt.customerName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 24px; font-size: 13px; line-height: 1.5; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 2px solid #4f46e5; margin-bottom: 24px; }
          .brand-title { font-size: 20px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.5px; margin: 0 0 4px 0; }
          .company-meta { font-size: 11px; color: #475569; line-height: 1.4; }
          .quote-badge { background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 11px; display: inline-block; margin-bottom: 6px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
          .box-title { font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; border-bottom: 2px solid #cbd5e1; }
          .summary-table { width: 340px; margin-left: auto; margin-bottom: 30px; }
          .summary-table td { padding: 6px 12px; font-size: 12px; }
          .summary-table .total-row td { border-top: 2px solid #0f172a; font-size: 15px; font-weight: 800; color: #047857; padding-top: 8px; }
          .terms { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 11px; color: #475569; margin-bottom: 30px; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
          .sig-line { border-top: 1px solid #94a3b8; padding-top: 8px; font-size: 11px; color: #475569; }
          .print-btn { background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
          @media print { .no-print { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: right; margin-bottom: 15px;">
          <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
        </div>

        <div class="header">
          <div>
            <h1 class="brand-title">NEXUS ENTERPRISE SOLUTIONS SDN. BHD.</h1>
            <div class="company-meta">
              <strong>Registration:</strong> 202401038291 (1543820-K) &bull; <strong>SST No:</strong> W10-2401-32000088 &bull; <strong>TIN:</strong> C25893010020<br>
              Level 28, Menara Shell, 211 Jalan Tun Sambanthan, KL Sentral, 50470 Kuala Lumpur, Malaysia<br>
              Tel: +60 3-2788 8800 &bull; Email: billing@nexusbms.my &bull; Web: https://nexus-bms.vercel.app
            </div>
          </div>
          <div style="text-align: right;">
            <div class="quote-badge">FORMAL COMMERCIAL QUOTATION</div>
            <div style="font-size: 18px; font-weight: 800; font-family: monospace; color: #0f172a;">${qt.id}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Date: ${qt.date}</div>
            <div style="font-size: 11px; color: #e11d48; font-weight: 600;">Valid Until: ${qt.validUntil}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div class="box">
            <div class="box-title">Client / Quotation Recipient</div>
            <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">${qt.customerName}</div>
            <div style="font-size: 12px; color: #475569;">
              ${cust.contactPerson ? `Attn: ${cust.contactPerson}<br>` : ''}
              ${cust.email ? `Email: ${cust.email}<br>` : ''}
              ${cust.phone ? `Phone: ${cust.phone}<br>` : ''}
              ${cust.industry ? `Industry: ${cust.industry}` : ''}
            </div>
          </div>
          <div class="box">
            <div class="box-title">Commercial & Settlement Terms</div>
            <div style="font-size: 12px; color: #334155; line-height: 1.6;">
              <strong>Payment Terms:</strong> Net 30 Days Credit<br>
              <strong>Currency:</strong> Ringgit Malaysia (MYR / RM)<br>
              <strong>Corporate Bank:</strong> Malayan Banking Berhad (Maybank)<br>
              <strong>Account Number:</strong> 5140-1200-8899 (Nexus Solutions Sdn Bhd)
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Item Description & Scope of Work</th>
              <th style="width: 70px; text-align: center;">Qty</th>
              <th style="width: 130px; text-align: right;">Unit Price</th>
              <th style="width: 140px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <table class="summary-table">
          <tr>
            <td style="color: #64748b;">Subtotal:</td>
            <td style="text-align: right; font-family: monospace; font-weight: 600;">${formatRM(qt.subtotal || qt.total * 0.92)}</td>
          </tr>
          ${qt.discount ? `
          <tr>
            <td style="color: #64748b;">Commercial Discount:</td>
            <td style="text-align: right; font-family: monospace; color: #e11d48;">-${formatRM(qt.discount)}</td>
          </tr>` : ''}
          <tr>
            <td style="color: #64748b;">Malaysian SST (8%):</td>
            <td style="text-align: right; font-family: monospace; font-weight: 600;">${formatRM(qt.tax || qt.total * 0.08)}</td>
          </tr>
          <tr class="total-row">
            <td>Total Contract Value:</td>
            <td style="text-align: right; font-family: monospace;">${formatRM(qt.total)}</td>
          </tr>
        </table>

        <div class="terms">
          <strong>Terms & Conditions:</strong><br>
          1. Prices quoted are in Ringgit Malaysia (RM) and subject to statutory 8% Sales and Service Tax (SST).<br>
          2. This quotation is valid until ${qt.validUntil}. Upon client confirmation, an official LHDN e-Invoicing compliant Tax Invoice will be issued.<br>
          3. Deliveries and deployment schedules commence upon receipt of signed quotation or purchase order.
        </div>

        <div class="signatures">
          <div>
            <div style="height: 50px;"></div>
            <div class="sig-line">
              <strong>Authorized Signatory</strong><br>
              Nexus Enterprise Solutions Sdn. Bhd.
            </div>
          </div>
          <div>
            <div style="height: 50px;"></div>
            <div class="sig-line">
              <strong>Client Acceptance & Confirmation</strong><br>
              Name: ______________________ Date: ___________
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // FR-305: 1-Click Direct Accounts Receivable (AR) Invoice Generation
  const handleConvertToInvoice = (qt) => {
    if (!userPermissions?.canManageDeals) {
      alert('Your current role does not have permission to generate commercial invoices.');
      return;
    }

    const subtotal = Number(qt.subtotal) || Number(qt.total) * 0.92;
    const tax = Number(qt.tax) || (subtotal * (currentOrg.taxRate / 100));
    const total = subtotal + tax;

    const newInv = createInvoice({
      customerId: qt.customerId,
      customerName: qt.customerName,
      customerEmail: qt.customerEmail,
      quotationId: qt.id,
      dealId: qt.dealId,
      subtotal,
      tax,
      total,
      items: qt.items || [
        { description: `Enterprise Order based on Quotation ${qt.id}`, qty: 1, unitPrice: subtotal, total: subtotal }
      ],
      notes: `Commercial Tax Invoice converted from Quotation ${qt.id} on ${new Date().toLocaleDateString('en-GB')}.`
    });

    setInvoicingSuccess({
      invoiceNumber: newInv.invoiceNumber,
      customerName: qt.customerName,
      total: newInv.total
    });
  };

  // Direct Invoice generation for won deals on Kanban
  const handleDirectDealInvoice = (deal) => {
    if (!userPermissions?.canManageDeals) {
      alert('Your current role does not have permission to generate commercial invoices.');
      return;
    }

    const subtotal = deal.value * 0.92;
    const tax = subtotal * (currentOrg.taxRate / 100);
    const total = subtotal + tax;

    const newInv = createInvoice({
      customerId: deal.customerId,
      customerName: deal.customerName,
      dealId: deal.id,
      subtotal,
      tax,
      total,
      items: [
        { description: deal.title, qty: 1, unitPrice: subtotal, total: subtotal }
      ],
      notes: `Commercial Tax Invoice issued for Won Opportunity: "${deal.title}".`
    });

    setInvoicingSuccess({
      invoiceNumber: newInv.invoiceNumber,
      customerName: deal.customerName,
      total: newInv.total
    });
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
          {userPermissions?.canManageDeals ? (
            <>
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
            </>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-mono">
              CRM: Read-Only (Auditor)
            </span>
          )}
        </div>
      </div>

      {!userPermissions?.canManageDeals && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Forensic Compliance Mode (FR-101):</strong> Your active role ({userPermissions ? 'Auditor' : 'Guest'}) is restricted to read-only forensic inspection. Opportunity creation, customer modifications, and quotations are disabled.
          </span>
        </div>
      )}

      {/* 1-Click Invoice Generation Success Notification Banner */}
      {invoicingSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Commercial Invoice Generated Successfully!</h4>
              <p className="text-xs text-slate-300">
                Tax Invoice <strong className="font-mono text-emerald-400">{invoicingSuccess.invoiceNumber}</strong> issued to <strong>{invoicingSuccess.customerName}</strong> for <strong>{formatRM(invoicingSuccess.total)}</strong> (including 8% SST). General Ledger double-entry posted.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateToTab('finance')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
            >
              View in Finance & Ledger →
            </button>
            <button
              onClick={() => setInvoicingSuccess(null)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Pipeline Value</span>
          <div className="text-2xl font-black text-white mt-1">
            {formatRM(totalPipelineValue)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
            Across {deals.length} active opportunities
          </span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Weighted Forecast</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">
            {formatRM(Math.round(weightedPipelineValue))}
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
            const isDragOver = dragOverStageId === stage.id;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => {
                  if (!userPermissions?.canManageDeals) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverStageId !== stage.id) {
                    setDragOverStageId(stage.id);
                  }
                }}
                onDragEnter={(e) => {
                  if (!userPermissions?.canManageDeals) return;
                  e.preventDefault();
                  setDragOverStageId(stage.id);
                }}
                onDragLeave={(e) => {
                  if (!userPermissions?.canManageDeals) return;
                  if (e.currentTarget.contains(e.relatedTarget)) return;
                  setDragOverStageId(null);
                }}
                onDrop={(e) => {
                  if (!userPermissions?.canManageDeals) return;
                  e.preventDefault();
                  const dealId = e.dataTransfer.getData('text/plain') || draggingDealId;
                  if (dealId) {
                    updateDealStage(dealId, stage.id);
                  }
                  setDraggingDealId(null);
                  setDragOverStageId(null);
                }}
                className={`min-w-[280px] md:min-w-0 snap-center shrink-0 md:shrink rounded-2xl p-3 flex flex-col justify-between min-h-[460px] transition-all duration-150 ${
                  isDragOver
                    ? 'bg-indigo-950/30 border-2 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-500/10'
                    : 'bg-slate-900/70 border border-slate-800'
                }`}
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
                    Vol: <strong className="text-white">{formatRM(stageTotal)}</strong>
                  </div>

                  {/* Stage Cards */}
                  <div className="space-y-2.5">
                    {stageDeals.map((deal) => {
                      const isBeingDragged = draggingDealId === deal.id;

                      return (
                        <div
                          key={deal.id}
                          draggable={userPermissions?.canManageDeals}
                          onDragStart={(e) => {
                            if (!userPermissions?.canManageDeals) return;
                            e.dataTransfer.setData('text/plain', deal.id);
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggingDealId(deal.id);
                          }}
                          onDragEnd={() => {
                            setDraggingDealId(null);
                            setDragOverStageId(null);
                          }}
                          className={`bg-slate-950/80 rounded-xl p-3 space-y-2 shadow-sm transition-all duration-150 group select-none ${
                            userPermissions?.canManageDeals
                              ? 'cursor-grab active:cursor-grabbing hover:border-indigo-500/70 hover:shadow-md'
                              : ''
                          } ${
                            isBeingDragged
                              ? 'opacity-30 border-2 border-dashed border-indigo-400 scale-[0.98]'
                              : 'border border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {userPermissions?.canManageDeals && (
                                <GripVertical className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                              )}
                              <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                                {deal.title}
                              </h4>
                            </div>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                              deal.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {deal.priority}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 truncate">
                            {deal.customerName}
                          </p>

                          <div className="flex items-center justify-between text-xs font-mono font-extrabold text-emerald-400 pt-1">
                            <span>{formatRM(deal.value)}</span>
                            <span className="text-[10px] text-slate-500 font-sans font-normal">
                              {deal.owner}
                            </span>
                          </div>

                          {/* Quick Stage Mover Selector */}
                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1">
                            <select
                              disabled={!userPermissions?.canManageDeals}
                              value={deal.stage}
                              onChange={(e) => updateDealStage(deal.id, e.target.value)}
                              className={`bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300 outline-none w-24 ${
                                !userPermissions?.canManageDeals ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {pipelineStages.map(s => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                              ))}
                            </select>

                            {deal.stage !== 'won' && deal.stage !== 'proposal' && userPermissions?.canManageDeals && (
                              <button
                                onClick={() => handleQuickQuote(deal)}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold transition"
                                title="Generate quote and move to Proposal Sent"
                              >
                                + Quote
                              </button>
                            )}

                            {deal.stage === 'won' && userPermissions?.canManageDeals && (
                              <button
                                onClick={() => handleDirectDealInvoice(deal)}
                                className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold transition flex items-center gap-1 shadow-sm"
                                title="Convert Won Opportunity directly into Accounts Receivable Invoice (FR-305)"
                              >
                                <Receipt className="w-3 h-3" />
                                <span>+ Invoice</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Drop target placeholder indicator */}
                    {isDragOver && (
                      <div className="h-14 rounded-xl border-2 border-dashed border-indigo-500/60 bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-300 font-semibold animate-pulse">
                        Drop deal into {stage.title}
                      </div>
                    )}
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
                      {formatRM(cust.creditLimit)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {formatRM(cust.outstandingBalance)}
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
                      <span className="font-mono font-semibold text-slate-200">{formatRM(it.total)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex items-center justify-between font-bold text-sm">
                    <span className="text-slate-400">Total Contract Value:</span>
                    <span className="font-mono text-emerald-400">{formatRM(qt.total)}</span>
                  </div>
                </div>

                {/* FR-304 & FR-305: PDF Download & Invoice Generation Action Bar */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleDownloadQuotationPDF(qt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
                    title="Download Official PDF Quotation (FR-304)"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Download PDF</span>
                  </button>

                  {qt.status === 'Invoiced' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Invoiced {qt.invoiceNumber ? `(${qt.invoiceNumber})` : ''}</span>
                      </span>
                      <button
                        onClick={() => navigateToTab('finance')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                      >
                        View in AR →
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={!userPermissions?.canManageDeals}
                      onClick={() => handleConvertToInvoice(qt)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-40"
                      title="Convert Quotation directly into Accounts Receivable Invoice (FR-305)"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>+ Generate Invoice (AR)</span>
                    </button>
                  )}
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
                <label className="text-xs text-slate-400 block mb-1">Estimated Value (RM) *</label>
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
                  <label className="text-slate-300 font-semibold block mb-1">Credit Limit (RM)</label>
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
