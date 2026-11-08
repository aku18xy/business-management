import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  Star,
  Barcode,
  Coins,
  Package,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Receipt,
  DollarSign,
  TrendingUp,
  Tag,
  Layers,
  Sparkles,
  Printer,
  History,
  Lock,
  ArrowDownToLine,
  UserCheck
} from 'lucide-react';

export const PosAdminPage = () => {
  const {
    posCatalog,
    updatePosItem,
    addPosItem,
    deletePosItem,
    posOrders,
    posSalesTotal,
    posShift,
    posShiftHistory,
    shiftCashSales,
    shiftCashDropsTotal,
    shiftExpectedCash,
    selectedBranch,
    navigateToPath
  } = useApp();

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'registers' | 'transactions'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Edit Item Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    price: '',
    cost: '',
    stock: '',
    barcode: '',
    isQuickKey: false
  });

  // Add Item Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    sku: '',
    name: '',
    category: 'Hardware',
    price: '49.99',
    cost: '22.00',
    stock: '50',
    barcode: '',
    isQuickKey: true
  });

  // Selected Order for Receipt modal
  const [viewReceiptOrder, setViewReceiptOrder] = useState(null);

  // Categories
  const categories = ['All', ...Array.from(new Set(posCatalog.map(p => p.category)))];

  const filteredItems = posCatalog.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      (item.barcode && item.barcode.includes(q));
    return matchCat && matchQuery;
  });

  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Open Edit Item Modal
  const handleStartEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      cost: String(item.cost || (item.price * 0.45).toFixed(2)),
      stock: String(item.stock),
      barcode: item.barcode || '',
      isQuickKey: Boolean(item.isQuickKey)
    });
  };

  // Submit Item Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    updatePosItem(editingItem.id, {
      name: editForm.name,
      category: editForm.category,
      price: Number(editForm.price) || 0,
      cost: Number(editForm.cost) || 0,
      stock: Number(editForm.stock) || 0,
      barcode: editForm.barcode,
      isQuickKey: editForm.isQuickKey
    });

    setEditingItem(null);
  };

  // Submit New Item
  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!newForm.name) return;

    addPosItem({
      sku: newForm.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newForm.name,
      category: newForm.category,
      price: Number(newForm.price) || 0,
      cost: Number(newForm.cost) || 0,
      stock: Number(newForm.stock) || 0,
      barcode: newForm.barcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      isQuickKey: newForm.isQuickKey
    });

    setAddModalOpen(false);
    setNewForm({
      sku: '',
      name: '',
      category: 'Hardware',
      price: '49.99',
      cost: '22.00',
      stock: '50',
      barcode: '',
      isQuickKey: true
    });
  };

  const lowStockCount = posCatalog.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER BAR & LAUNCH TERMINAL CTA
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Module: POS-RETAIL • FR-804 & FR-801
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Two-Tier Architecture Active
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2.5">
            <Store className="w-6 h-6 text-indigo-400" />
            <span>POS Catalog & Register Administration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Centralized back-office management for store retail items, POS pricing, quick-sale touch tiles, and multi-register drawer fleet auditing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>New POS Item</span>
          </button>

          <button
            onClick={() => navigateToPath('/pos')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Launch POS Terminal (/pos)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          FLEET STATUS KPI CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total SKUs */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Retail Catalog SKUs</span>
            <Package className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{posCatalog.length}</span>
            {lowStockCount > 0 ? (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold border border-amber-500/20">
                {lowStockCount} Low Stock
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                Healthy Stock
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Live inventory synchronized across terminal</p>
        </div>

        {/* Active Register */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Primary Store Register</span>
            <Store className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-white font-mono">REG-01 Flagship</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Cashier: Elena Rostova • Shift Open</p>
        </div>

        {/* Today's POS Sales */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's POS Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {formatMoney(posSalesTotal)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {posOrders.length} receipts
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Auto-feeding Executive Cockpit revenue</p>
        </div>

        {/* Drawer Cash Balance */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cash in Register Drawer</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">
              {formatMoney(shiftExpectedCash)}
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold border border-amber-500/20">
              Float: {formatMoney(posShift?.openingFloat || 250)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Vault drops today: {formatMoney(shiftCashDropsTotal)}</p>
        </div>
      </div>

      {/* =========================================================================
          ADMIN NAVIGATION TABS
          ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>POS Item Catalog & Quick-Keys ({posCatalog.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('registers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'registers'
              ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Register Fleet & Shift Audit (FR-802)</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'transactions'
              ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Transactions & Returns Ledger ({posOrders.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: POS ITEM CATALOG & QUICK-KEYS
          ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by product name, SKU, or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-400">
              Showing <span className="font-bold text-white">{filteredItems.length}</span> retail SKUs
            </div>
          </div>

          {/* Catalog Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">SKU / Barcode</th>
                    <th className="py-3 px-4">Product Name & Category</th>
                    <th className="py-3 px-4">POS Price</th>
                    <th className="py-3 px-4">Cost Price</th>
                    <th className="py-3 px-4">Gross Margin</th>
                    <th className="py-3 px-4">Stock on Hand</th>
                    <th className="py-3 px-4">Quick-Key</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredItems.map((item) => {
                    const cost = item.cost || (item.price * 0.45);
                    const marginPct = Math.round(((item.price - cost) / item.price) * 100);
                    const isLowStock = item.stock < 10;
                    const isOutOfStock = item.stock <= 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-900/50 transition">
                        {/* SKU & Barcode */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">{item.sku}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Barcode className="w-3 h-3 text-slate-600" />
                            {item.barcode || '—'}
                          </span>
                        </td>

                        {/* Product Name */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 inline-block mt-0.5">
                            {item.category}
                          </span>
                        </td>

                        {/* Retail Price */}
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                          {formatMoney(item.price)}
                        </td>

                        {/* Cost Price */}
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {formatMoney(cost)}
                        </td>

                        {/* Margin */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            marginPct >= 50
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'bg-amber-500/10 text-amber-300'
                          }`}>
                            {marginPct}%
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isOutOfStock
                              ? 'bg-rose-500/20 text-rose-300'
                              : isLowStock
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.stock} units
                          </span>
                        </td>

                        {/* Quick-Key */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => updatePosItem(item.id, { isQuickKey: !item.isQuickKey })}
                            className={`p-1.5 rounded-lg border transition ${
                              item.isQuickKey
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-slate-900 text-slate-600 border-slate-800 hover:text-slate-400'
                            }`}
                            title="Toggle Quick-Key tile on POS countertop terminal"
                          >
                            <Star className={`w-3.5 h-3.5 ${item.isQuickKey ? 'fill-amber-400' : ''}`} />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1"
                            >
                              <Pencil className="w-3 h-3 text-indigo-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${item.sku} - "${item.name}" from retail catalog?`)) {
                                  deletePosItem(item.id);
                                }
                              }}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
          TAB 2: REGISTER FLEET & SHIFT AUDIT (FR-802)
          ========================================================================= */}
      {activeTab === 'registers' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Register #1 - Main Counter */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Register #1 — Main Counter</h3>
                    <span className="text-[11px] text-slate-400">{selectedBranch?.name || 'Flagship Store'}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  SHIFT OPEN
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Opening Cash Float</span>
                  <span className="font-mono text-base font-bold text-white">
                    {formatMoney(posShift?.openingFloat || 250)}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Cash Sales Collected</span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    +{formatMoney(shiftCashSales)}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Vault Safe Drops</span>
                  <span className="font-mono text-base font-bold text-amber-400">
                    -{formatMoney(shiftCashDropsTotal)}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Current Drawer Cash</span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    {formatMoney(shiftExpectedCash)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Assigned Cashier:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Elena Rostova
                </span>
              </div>
            </div>

            {/* Register #2 - Express Lane */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 opacity-75">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Register #2 — Express Lane</h3>
                    <span className="text-[11px] text-slate-400">Lane 2 Countertop</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                  STANDBY / CLOSED
                </span>
              </div>

              <div className="p-6 text-center text-slate-500 text-xs space-y-2">
                <Lock className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
                <p>Register #2 is currently closed for the morning period.</p>
                <p className="text-[11px] text-slate-600">Can be activated from the `/pos` terminal launcher when store traffic increases.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: TRANSACTIONS & RETURNS (FR-803)
          ========================================================================= */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Time & Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Tender Method</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">View Slip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {posOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {order.date}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {order.customerName || 'Walk-in Retail Guest'}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {order.items?.length || 0} line items
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {order.paymentMethod}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                        {formatMoney(order.total)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : order.status === 'Voided'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setViewReceiptOrder(order)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                        >
                          Receipt
                        </button>
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
          MODAL: EDIT POS ITEM (FR-804)
          ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="max-w-md w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Edit POS Retail Item</h3>
                <span className="text-xs text-slate-400 font-mono">{editingItem.sku}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Barcode / UPC</label>
                <input
                  type="text"
                  value={editForm.barcode}
                  onChange={(e) => setEditForm({ ...editForm, barcode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">POS Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Unit Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.cost}
                  onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Stock on Hand</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="checkbox"
                id="isQuickKeyEdit"
                checked={editForm.isQuickKey}
                onChange={(e) => setEditForm({ ...editForm, isQuickKey: e.target.checked })}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isQuickKeyEdit" className="text-xs text-slate-300">
                Pin to Countertop POS Terminal Favorites (★ Quick-Key)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW ITEM (FR-804)
          ========================================================================= */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNew}
            className="max-w-md w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">+ Add New POS Retail SKU</h3>
                <span className="text-xs text-slate-400">Instantly creates and deploys product to terminal</span>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Wireless Barcode Cradle"
                value={newForm.name}
                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  placeholder="Hardware / Accessories"
                  value={newForm.category}
                  onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Barcode / SKU</label>
                <input
                  type="text"
                  placeholder="882910029102"
                  value={newForm.barcode}
                  onChange={(e) => setNewForm({ ...newForm, barcode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Retail Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newForm.price}
                  onChange={(e) => setNewForm({ ...newForm, price: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Unit Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newForm.cost}
                  onChange={(e) => setNewForm({ ...newForm, cost: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Initial Stock</label>
                <input
                  type="number"
                  value={newForm.stock}
                  onChange={(e) => setNewForm({ ...newForm, stock: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="checkbox"
                id="isQuickKeyNew"
                checked={newForm.isQuickKey}
                onChange={(e) => setNewForm({ ...newForm, isQuickKey: e.target.checked })}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isQuickKeyNew" className="text-xs text-slate-300">
                Pin to Countertop POS Terminal Favorites (★ Quick-Key)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          MODAL: VIEW THERMAL RECEIPT
          ========================================================================= */}
      {viewReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white text-slate-900 rounded-2xl p-6 shadow-2xl font-mono text-xs space-y-4">
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <h2 className="text-base font-bold font-sans tracking-wide">NEXUS RETAIL STORE</h2>
              <p className="text-[10px] text-slate-500">{selectedBranch?.name || 'Flagship Store'}</p>
              <p className="text-[10px] text-slate-500">Tax ID: 88-1920-BMS • Receipt #{viewReceiptOrder.orderNumber}</p>
              <p className="text-[10px] text-slate-500">{viewReceiptOrder.date} • Tender: {viewReceiptOrder.paymentMethod}</p>
            </div>

            <div className="space-y-1.5 py-1 border-b border-dashed border-slate-300">
              {viewReceiptOrder.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.qty}x {it.name}</span>
                  <span className="font-bold">${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1 border-b border-dashed border-slate-300 pb-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${viewReceiptOrder.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${viewReceiptOrder.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1">
                <span>TOTAL PAID</span>
                <span>${viewReceiptOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewReceiptOrder(null)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PosAdminPage;
