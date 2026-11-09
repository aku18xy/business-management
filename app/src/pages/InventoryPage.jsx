import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Boxes,
  Package,
  Truck,
  ArrowRightLeft,
  Building2,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  Barcode,
  Layers,
  ArrowUpRight,
  Warehouse,
  History,
  Pencil,
  Tag,
  ExternalLink,
  ClipboardList
} from 'lucide-react';

export const InventoryPage = () => {
  const {
    inventoryItems,
    warehouses,
    vendors,
    purchaseOrders,
    stockMovements,
    addInventoryItem,
    updateInventoryItem,
    adjustStock,
    transferStock,
    createPurchaseOrder,
    receiveGoods,
    addVendor,
    userPermissions,
    currentUser,
    currentOrg
  } = useApp();

  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'warehouses' | 'procurement' | 'vendors' | 'movements'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [showAddSkuModal, setShowAddSkuModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCreatePoModal, setShowCreatePoModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  // Selected entities for modals
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  const [selectedPoForReceive, setSelectedPoForReceive] = useState(null);

  // Adjust Form
  const [adjustWarehouseId, setAdjustWarehouseId] = useState(warehouses[0]?.id || 'wh_ny');
  const [adjustDelta, setAdjustDelta] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Periodic Physical Stock Count');

  // Transfer Form
  const [transferFromWh, setTransferFromWh] = useState(warehouses[0]?.id || 'wh_ny');
  const [transferToWh, setTransferToWh] = useState(warehouses[1]?.id || 'wh_ldn');
  const [transferQty, setTransferQty] = useState(10);

  // Add SKU Form
  const [newSku, setNewSku] = useState({
    sku: '',
    name: '',
    category: 'Hardware',
    unitOfMeasure: 'pcs',
    costPrice: '',
    retailPrice: '',
    initialStock: '',
    reorderPoint: '20',
    reorderQty: '50',
    supplierId: vendors[0]?.id || 'ven_1'
  });

  // Create PO Form
  const [poVendorId, setPoVendorId] = useState(vendors[0]?.id || 'ven_1');
  const [poWarehouseId, setPoWarehouseId] = useState(warehouses[0]?.id || 'wh_ny');
  const [poSelectedSku, setPoSelectedSku] = useState(inventoryItems[0]?.sku || '');
  const [poQty, setPoQty] = useState(50);
  const [poNotes, setPoNotes] = useState('');

  // Add Vendor Form
  const [newVendor, setNewVendor] = useState({
    name: '',
    code: '',
    category: 'Hardware & Components',
    country: 'United States',
    contactPerson: '',
    email: '',
    phone: '',
    paymentTerms: 'Net 30'
  });

  // Calculations
  const totalValuation = inventoryItems.reduce((acc, item) => {
    const totalQty = Object.values(item.warehouseStock || {}).reduce((s, q) => s + (Number(q) || 0), 0);
    return acc + (item.costPrice * totalQty);
  }, 0);

  const totalUnitsOnHand = inventoryItems.reduce((acc, item) => {
    return acc + Object.values(item.warehouseStock || {}).reduce((s, q) => s + (Number(q) || 0), 0);
  }, 0);

  const lowStockItems = inventoryItems.filter(i => {
    const total = Object.values(i.warehouseStock || {}).reduce((s, q) => s + (Number(q) || 0), 0);
    return total <= i.reorderPoint;
  });

  const categories = ['All', 'Hardware', 'Consumables', 'Raw Materials'];

  // Filtering
  const filteredItems = inventoryItems.filter(item => {
    const totalQty = Object.values(item.warehouseStock || {}).reduce((s, q) => s + (Number(q) || 0), 0);
    const matchesSearch =
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.includes(searchQuery);
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Low Stock' && totalQty <= item.reorderPoint && totalQty > 0) ||
      (statusFilter === 'Critical' && totalQty === 0) ||
      (statusFilter === 'Optimal' && totalQty > item.reorderPoint);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handlers
  const handleCreateSkuSubmit = (e) => {
    e.preventDefault();
    if (!newSku.sku || !newSku.name || !newSku.costPrice) return;
    addInventoryItem(newSku);
    setShowAddSkuModal(false);
    setNewSku({
      sku: '',
      name: '',
      category: 'Hardware',
      unitOfMeasure: 'pcs',
      costPrice: '',
      retailPrice: '',
      initialStock: '',
      reorderPoint: '20',
      reorderQty: '50',
      supplierId: vendors[0]?.id || 'ven_1'
    });
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemForAction) return;
    adjustStock(selectedItemForAction.id, adjustWarehouseId, adjustDelta, adjustReason);
    setShowAdjustModal(false);
    setSelectedItemForAction(null);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemForAction) return;
    if (transferFromWh === transferToWh) {
      alert('Source and destination warehouses must be different.');
      return;
    }
    const res = transferStock(selectedItemForAction.id, transferFromWh, transferToWh, transferQty);
    if (!res.success) {
      alert(res.message);
      return;
    }
    setShowTransferModal(false);
    setSelectedItemForAction(null);
  };

  const handleCreatePoSubmit = (e) => {
    e.preventDefault();
    const item = inventoryItems.find(i => i.sku === poSelectedSku);
    if (!item) return;

    createPurchaseOrder({
      vendorId: poVendorId,
      destinationWarehouseId: poWarehouseId,
      items: [
        {
          sku: item.sku,
          name: item.name,
          qty: Number(poQty),
          unitCost: item.costPrice,
          totalCost: Number(poQty) * item.costPrice
        }
      ],
      notes: poNotes
    });
    setShowCreatePoModal(false);
    setPoNotes('');
  };

  const handleReceiveGoodsSubmit = (e) => {
    e.preventDefault();
    if (!selectedPoForReceive) return;
    receiveGoods(selectedPoForReceive.id);
    setShowReceiveModal(false);
    setSelectedPoForReceive(null);
  };

  const handleAddVendorSubmit = (e) => {
    e.preventDefault();
    if (!newVendor.name) return;
    addVendor(newVendor);
    setShowAddVendorModal(false);
    setNewVendor({
      name: '',
      code: '',
      category: 'Hardware & Components',
      country: 'United States',
      contactPerson: '',
      email: '',
      phone: '',
      paymentTerms: 'Net 30'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Module: INV-SCM • Phase 3 ERP
            </span>
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Multi-Warehouse Active
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            ERP Inventory, Warehouses & Procurement
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
            Real-time stock valuation across distributed regional hubs, multi-vendor purchase orders, and Goods Received Notes (GRN).
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {userPermissions.canManageInventory ? (
            <>
              <button
                onClick={() => setShowAddSkuModal(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>New Master SKU</span>
              </button>

              <button
                onClick={() => setShowCreatePoModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                <Truck className="w-4 h-4" />
                <span>+ Issue Purchase Order</span>
              </button>
            </>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-mono">
              Role Clearance: Read-Only
            </span>
          )}
        </div>
      </div>

      {/* Role Notice for Auditor / Non-Inventory roles */}
      {!userPermissions.canManageInventory && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Governance Mode (FR-101):</strong> Your active session role ({currentUser.role}) has inspection and requisition clearance. Stock balance modifications and procurement issuing require Manager or Administrator authorization.
          </span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Asset Valuation */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inventory Asset Valuation</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
              FIFO Costed
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Total units on hand: {totalUnitsOnHand.toLocaleString()} across depots</p>
        </div>

        {/* Master Catalog SKUs */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Master Catalog SKUs</span>
            <Boxes className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {inventoryItems.length}
            </span>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-bold border border-indigo-500/20">
              3 Categories
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Synced to POS catalog & sales orders</p>
        </div>

        {/* Multi-Warehouse Facilities */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Distribution Depots</span>
            <Warehouse className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {warehouses.length} Hubs
            </span>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-bold border border-purple-500/20">
              115,000 sq ft
            </span>
          </div>
          <p className="text-[11px] text-slate-500">NY (HQ), London & Singapore centers</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Reorder Attention Items</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {lowStockItems.length}
            </span>
            {lowStockItems.length > 0 ? (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold border border-amber-500/20 animate-pulse">
                Action Required
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                All Optimal
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Triggered by automated reorder points</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-emerald-600 text-white shadow shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Master Stock Ledger (FR-401)</span>
        </button>

        <button
          onClick={() => setActiveTab('warehouses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'warehouses'
              ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Warehouse className="w-3.5 h-3.5" />
          <span>Multi-Warehouse Hubs (FR-402)</span>
        </button>

        <button
          onClick={() => setActiveTab('procurement')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'procurement'
              ? 'bg-purple-600 text-white shadow shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Procurement & POs (FR-403)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-mono">
            {purchaseOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'vendors'
              ? 'bg-sky-600 text-white shadow shadow-sky-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Vendor Directory ({vendors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'movements'
              ? 'bg-slate-800 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>Movement Audit Stream</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: MASTER STOCK LEDGER (FR-401 & FR-402)
          ========================================================================= */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by SKU, product name, or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="All">All Stock Levels</option>
                <option value="Optimal">Optimal Stock</option>
                <option value="Low Stock">Low Stock Alert</option>
                <option value="Critical">Critical Stockout</option>
              </select>
            </div>

            <div className="text-xs text-slate-400">
              Showing <span className="font-bold text-white">{filteredItems.length}</span> of {inventoryItems.length} master SKUs
            </div>
          </div>

          {/* Master Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">SKU & Barcode</th>
                    <th className="py-3 px-4">Product Name & Category</th>
                    <th className="py-3 px-4">Warehouse Breakdown</th>
                    <th className="py-3 px-4 text-center">On Hand</th>
                    <th className="py-3 px-4 text-center">Available-to-Promise</th>
                    <th className="py-3 px-4">Cost / Retail</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Stock Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredItems.map((item) => {
                    const totalQty = Object.values(item.warehouseStock || {}).reduce((s, q) => s + (Number(q) || 0), 0);
                    const atp = Math.max(0, totalQty - (item.committedStock || 0));
                    const marginPct = Math.round(((item.retailPrice - item.costPrice) / item.retailPrice) * 100);

                    return (
                      <tr key={item.id} className="hover:bg-slate-900/50 transition">
                        {/* SKU */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">{item.sku}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Barcode className="w-3 h-3 text-slate-600" />
                            {item.barcode}
                          </span>
                        </td>

                        {/* Product Name */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-0.5">
                            {item.category} • {item.unitOfMeasure}
                          </span>
                        </td>

                        {/* Warehouse Breakdown Pills */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {warehouses.map(w => {
                              const qty = item.warehouseStock?.[w.id] || 0;
                              return (
                                <span
                                  key={w.id}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                                  title={`${w.name}: ${qty} units`}
                                >
                                  <strong className="text-slate-400">{w.code.split('-')[1]}:</strong> {qty}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* On Hand */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-sm text-white">
                          {totalQty}
                        </td>

                        {/* ATP */}
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className="font-bold text-emerald-400 text-sm">{atp}</span>
                          <span className="text-[10px] text-slate-500 block">
                            {item.committedStock || 0} reserved
                          </span>
                        </td>

                        {/* Cost & Retail */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-white font-bold">${item.costPrice.toFixed(2)} cost</div>
                          <div className="text-slate-400 text-[11px]">${item.retailPrice.toFixed(2)} retail ({marginPct}%)</div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                            totalQty === 0
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : totalQty <= item.reorderPoint
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {totalQty === 0 ? 'Stockout' : totalQty <= item.reorderPoint ? 'Low Stock' : 'Optimal'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              disabled={!userPermissions.canManageInventory}
                              onClick={() => {
                                setSelectedItemForAction(item);
                                setAdjustDelta(0);
                                setShowAdjustModal(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 disabled:opacity-40 transition"
                              title="Adjust stock balance"
                            >
                              Adjust
                            </button>
                            <button
                              disabled={!userPermissions.canManageInventory}
                              onClick={() => {
                                setSelectedItemForAction(item);
                                setShowTransferModal(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold border border-indigo-500/40 disabled:opacity-40 transition flex items-center gap-1"
                              title="Transfer stock between warehouses"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Transfer</span>
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
          TAB 2: MULTI-WAREHOUSE DEPOTS (FR-402)
          ========================================================================= */}
      {activeTab === 'warehouses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Registered Multi-Location Depots ({warehouses.length})</h3>
            <span className="text-xs text-slate-400 font-mono">Distributed Enterprise Inventory</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {warehouses.map((wh) => {
              // Calculate warehouse specific valuation & SKU count
              let whTotalValuation = 0;
              let whTotalUnits = 0;
              let whSkuCount = 0;

              inventoryItems.forEach(i => {
                const qty = i.warehouseStock?.[wh.id] || 0;
                if (qty > 0) {
                  whSkuCount++;
                  whTotalUnits += qty;
                  whTotalValuation += (qty * i.costPrice);
                }
              });

              return (
                <div
                  key={wh.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {wh.code}
                    </span>
                    {wh.isPrimary && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Primary Facility
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{wh.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <span>{wh.location}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Facility Floor Area:</span>
                      <span className="font-mono text-white font-bold">{wh.capacitySqFt.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Stocked Master SKUs:</span>
                      <span className="font-mono text-emerald-400 font-bold">{whSkuCount} SKUs</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Inventory Asset Value:</span>
                      <span className="font-mono text-white font-bold">${whTotalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Facility Superintendent:</span>
                      <span className="text-slate-300 font-medium">{wh.manager}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] font-mono text-emerald-400">● Operational Active</span>
                    <button
                      onClick={() => {
                        setActiveTab('ledger');
                        setSearchQuery(wh.code.split('-')[1]);
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                    >
                      Filter SKUs →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PROCUREMENT & PURCHASE ORDERS (FR-403)
          ========================================================================= */}
      {activeTab === 'procurement' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Purchase Orders & GRN Supply Chain ({purchaseOrders.length})</h3>
              <p className="text-xs text-slate-400 mt-0.5">Procurement lifecycle: Draft → Pending Approval → Issued → Goods Received (GRN) → Billed.</p>
            </div>

            {userPermissions.canManageInventory && (
              <button
                onClick={() => setShowCreatePoModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Purchase Order</span>
              </button>
            )}
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">PO Number & Date</th>
                    <th className="py-3 px-4">Vendor Supplier</th>
                    <th className="py-3 px-4">Destination Hub</th>
                    <th className="py-3 px-4">Line Items</th>
                    <th className="py-3 px-4 font-mono">Total (USD)</th>
                    <th className="py-3 px-4 text-center">Lifecycle Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {purchaseOrders.map((po) => {
                    const statusColors = {
                      'Draft': 'bg-slate-800 text-slate-300 border-slate-700',
                      'Pending Approval': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                      'Issued': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                      'Received': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                      'Billed': 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    };

                    return (
                      <tr key={po.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">{po.poNumber}</span>
                          <span className="text-[11px] text-slate-500">{po.createdAt}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{po.vendorName}</span>
                          <span className="text-[11px] text-slate-400">{po.paymentTerms}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-slate-200 block font-medium">{po.destinationWarehouseName}</span>
                          <span className="text-[11px] text-slate-500">ETA: {po.expectedDate}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            {po.items.map((it, idx) => (
                              <div key={idx} className="text-slate-300">
                                <span className="font-mono text-emerald-400 font-bold">{it.qty}x</span> {it.name}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-sm text-emerald-400">
                          ${po.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[po.status] || 'bg-slate-800'}`}>
                            {po.status}
                          </span>
                          {po.grnNumber && (
                            <span className="text-[10px] font-mono text-slate-400 block mt-1">
                              {po.grnNumber}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {po.status === 'Issued' ? (
                            <button
                              disabled={!userPermissions.canManageInventory}
                              onClick={() => {
                                setSelectedPoForReceive(po);
                                setShowReceiveModal(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 disabled:opacity-40 transition flex items-center gap-1.5 ml-auto"
                            >
                              <ClipboardList className="w-3.5 h-3.5" />
                              <span>Receive GRN</span>
                            </button>
                          ) : po.status === 'Received' ? (
                            <span className="text-[11px] font-mono text-emerald-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Stock Absorbed</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs font-mono">In Review</span>
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
          TAB 4: VENDOR SUPPLIER DIRECTORY (FR-403)
          ========================================================================= */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Approved Commercial Vendors & Fabricators ({vendors.length})</h3>
              <p className="text-xs text-slate-400 mt-0.5">Commercial suppliers, payment terms, and active procurement contracts.</p>
            </div>

            {userPermissions.canManageInventory && (
              <button
                onClick={() => setShowAddVendorModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register Vendor</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                    {v.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {v.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{v.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{v.category} • {v.country}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Contact Person:</span>
                    <span className="text-slate-200 font-medium">{v.contactPerson}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Terms:</span>
                    <span className="font-mono text-emerald-400 font-bold">{v.paymentTerms}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Rating:</span>
                    <span className="text-amber-400 font-bold">★ {v.rating} / 5.0</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate pt-1 border-t border-slate-800/60">
                    {v.email}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPoVendorId(v.id);
                    setShowCreatePoModal(true);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Create PO Order →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: STOCK MOVEMENT AUDIT LEDGER
          ========================================================================= */}
      {activeTab === 'movements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Immutable Stock Movement Audit Stream</h3>
              <p className="text-xs text-slate-400 mt-0.5">Full forensic transaction ledger of GRN intake, POS sales dispatches, and warehouse transfers.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              HASH_VERIFIED
            </span>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Timestamp (UTC)</th>
                    <th className="py-3 px-4">Movement Type</th>
                    <th className="py-3 px-4">SKU / Product</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4">Warehouse Depot</th>
                    <th className="py-3 px-4">Audit Reference</th>
                    <th className="py-3 px-4">Actor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {stockMovements.map((mov) => {
                    const isPositive = mov.qty.includes('+');
                    return (
                      <tr key={mov.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-3 px-4 font-mono text-slate-400">{mov.timestamp}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white">{mov.type}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold font-mono text-emerald-400">{mov.sku}</span>
                          <span className="text-slate-400 text-[11px] block">{mov.productName}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-sm">
                          <span className={isPositive ? 'text-emerald-400' : 'text-amber-400'}>
                            {mov.qty}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{mov.warehouseName}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{mov.reference}</td>
                        <td className="py-3 px-4 text-slate-300">{mov.actor}</td>
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
          MODALS
          ========================================================================= */}

      {/* 1. Add Master SKU Modal */}
      {showAddSkuModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleCreateSkuSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">+ Register Master Inventory SKU (FR-401)</h3>
              <button type="button" onClick={() => setShowAddSkuModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">SKU Code *</label>
                <input
                  type="text"
                  placeholder="e.g., SKU-HW-201"
                  value={newSku.sku}
                  onChange={(e) => setNewSku({ ...newSku, sku: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category *</label>
                <select
                  value={newSku.category}
                  onChange={(e) => setNewSku({ ...newSku, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Hardware">Hardware</option>
                  <option value="Consumables">Consumables</option>
                  <option value="Raw Materials">Raw Materials</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Product Master Title *</label>
              <input
                type="text"
                placeholder="e.g., Ultra-Slim Customer Facing Display 10-inch"
                value={newSku.name}
                onChange={(e) => setNewSku({ ...newSku, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Cost Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="45.00"
                  value={newSku.costPrice}
                  onChange={(e) => setNewSku({ ...newSku, costPrice: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Retail Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="99.00"
                  value={newSku.retailPrice}
                  onChange={(e) => setNewSku({ ...newSku, retailPrice: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Initial Stock</label>
                <input
                  type="number"
                  placeholder="25"
                  value={newSku.initialStock}
                  onChange={(e) => setNewSku({ ...newSku, initialStock: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Reorder Point (Min Alert)</label>
                <input
                  type="number"
                  value={newSku.reorderPoint}
                  onChange={(e) => setNewSku({ ...newSku, reorderPoint: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Default Vendor</label>
                <select
                  value={newSku.supplierId}
                  onChange={(e) => setNewSku({ ...newSku, supplierId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddSkuModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
              >
                Create Master SKU
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Stock Adjustment Modal */}
      {showAdjustModal && selectedItemForAction && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleAdjustSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Manual Stock Adjustment</h3>
              <button type="button" onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-white font-mono">{selectedItemForAction.sku}</div>
              <div className="text-slate-300">{selectedItemForAction.name}</div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Warehouse Depot</label>
              <select
                value={adjustWarehouseId}
                onChange={(e) => setAdjustWarehouseId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} (Current: {selectedItemForAction.warehouseStock?.[w.id] || 0} units)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Adjustment Quantity (+ to add, - to deduct)</label>
              <input
                type="number"
                value={adjustDelta}
                onChange={(e) => setAdjustDelta(Number(e.target.value))}
                placeholder="e.g., 5 or -2"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Audit Reason Code</label>
              <input
                type="text"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g., Damaged item write-off or cycle count discrepancy"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Confirm Adjustment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Inter-Warehouse Transfer Modal */}
      {showTransferModal && selectedItemForAction && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleTransferSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Inter-Warehouse Stock Transfer (FR-402)</h3>
              <button type="button" onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-white font-mono">{selectedItemForAction.sku}</div>
              <div className="text-slate-300">{selectedItemForAction.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Source Depot</label>
                <select
                  value={transferFromWh}
                  onChange={(e) => setTransferFromWh(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.code} ({selectedItemForAction.warehouseStock?.[w.id] || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Destination Depot</label>
                <select
                  value={transferToWh}
                  onChange={(e) => setTransferToWh(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.code} ({selectedItemForAction.warehouseStock?.[w.id] || 0})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Transfer Quantity (Units)</label>
              <input
                type="number"
                min="1"
                max={selectedItemForAction.warehouseStock?.[transferFromWh] || 999}
                value={transferQty}
                onChange={(e) => setTransferQty(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Dispatch Transfer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Issue Purchase Order Modal */}
      {showCreatePoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleCreatePoSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">+ Issue Procurement Purchase Order (FR-403)</h3>
              <button type="button" onClick={() => setShowCreatePoModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Supplier Vendor *</label>
                <select
                  value={poVendorId}
                  onChange={(e) => setPoVendorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.paymentTerms})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Destination Warehouse *</label>
                <select
                  value={poWarehouseId}
                  onChange={(e) => setPoWarehouseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Product SKU *</label>
                <select
                  value={poSelectedSku}
                  onChange={(e) => setPoSelectedSku(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  {inventoryItems.map(i => (
                    <option key={i.id} value={i.sku}>
                      {i.sku} - {i.name} (${i.costPrice.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Order Qty *</label>
                <input
                  type="number"
                  min="1"
                  value={poQty}
                  onChange={(e) => setPoQty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Procurement Notes / Instructions</label>
              <textarea
                value={poNotes}
                onChange={(e) => setPoNotes(e.target.value)}
                placeholder="e.g., Routine replenishment for upcoming quarter sales demand."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                rows="2"
              />
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-300">
              Note: Orders exceeding $5,000 or submitted by Staff automatically route to the <strong>Executive Action Inbox</strong> for Manager approval before supplier release.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreatePoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Generate Purchase Order
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Receive Goods (GRN) Modal */}
      {showReceiveModal && selectedPoForReceive && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleReceiveGoodsSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Process Goods Received Note (GRN)</h3>
              <button type="button" onClick={() => setShowReceiveModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Purchase Order:</span>
                <span className="font-mono text-white font-bold">{selectedPoForReceive.poNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Vendor:</span>
                <span className="text-white font-medium">{selectedPoForReceive.vendorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Destination Hub:</span>
                <span className="text-emerald-400 font-medium">{selectedPoForReceive.destinationWarehouseName}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Shipment Contents to Absorb into Stock:</label>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-1.5">
                {selectedPoForReceive.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-slate-300">{it.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">+{it.qty} units</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              Confirming receipt will instantly increment warehouse stock levels, append an immutable Goods Received Note (GRN), and close this PO.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowReceiveModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
              >
                Confirm & Stock In (GRN)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form onSubmit={handleAddVendorSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">+ Register Commercial Vendor</h3>
              <button type="button" onClick={() => setShowAddVendorModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Company / Vendor Name *</label>
              <input
                type="text"
                placeholder="e.g., Tokyo Precision Micro-Optics"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Optics & Displays"
                  value={newVendor.category}
                  onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Country</label>
                <input
                  type="text"
                  placeholder="e.g., Japan"
                  value={newVendor.country}
                  onChange={(e) => setNewVendor({ ...newVendor, country: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="Lead Sales Engineer"
                  value={newVendor.contactPerson}
                  onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Payment Terms</label>
                <select
                  value={newVendor.paymentTerms}
                  onChange={(e) => setNewVendor({ ...newVendor, paymentTerms: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Procurement Email *</label>
              <input
                type="email"
                placeholder="orders@vendor.com"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddVendorModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Vendor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
