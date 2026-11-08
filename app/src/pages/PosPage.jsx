import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Barcode,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Receipt,
  RotateCcw,
  Package,
  Layers,
  Coins,
  Lock,
  Unlock,
  ArrowDownToLine,
  AlertTriangle,
  FileSpreadsheet,
  DollarSign,
  Clock,
  User,
  History,
  FileText,
  Ban,
  Undo2
} from 'lucide-react';

export const PosPage = () => {
  const {
    posCatalog,
    posCart,
    addToCart,
    updateCartQty,
    clearCart,
    completeCheckout,
    posOrders,
    currentOrg,
    currentUser,
    // FR-802: Register Shift & Cash Drawer Reconciliation
    posShift,
    posShiftHistory,
    shiftCashSales,
    shiftCashDropsTotal,
    shiftExpectedCash,
    openRegisterShift,
    addCashDrop,
    closeRegisterShift,
    // POS Returns & Void
    voidPosOrder,
    refundPosOrder
  } = useApp();

  const cartRef = React.useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'orders' | 'shifts'
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  // FR-802 Modal states
  const [cashDropModal, setCashDropModal] = useState(false);
  const [dropAmount, setDropAmount] = useState('');
  const [dropReason, setDropReason] = useState('Midday Cash Drop to Vault Safe');
  const [dropAuthorizer, setDropAuthorizer] = useState('Elena Rostova (Finance)');

  const [reconcileModal, setReconcileModal] = useState(false);
  const [countedCashInput, setCountedCashInput] = useState('');
  const [reconcileNotes, setReconcileNotes] = useState('');

  const [openShiftModal, setOpenShiftModal] = useState(false);
  const [openFloatInput, setOpenFloatInput] = useState('250.00');
  const [openRegisterId, setOpenRegisterId] = useState('REG-01-FLAGSHIP');
  const [openNotes, setOpenNotes] = useState('Opening float verified in bills and rolled coin tubes.');

  const [selectedShiftReport, setSelectedShiftReport] = useState(null);

  // Returns & Void Order Modal States
  const [voidModal, setVoidModal] = useState(false);
  const [selectedOrderForVoid, setSelectedOrderForVoid] = useState(null);
  const [voidReason, setVoidReason] = useState('Cashier Scanning Error');

  const [returnModal, setReturnModal] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnItemsState, setReturnItemsState] = useState({}); // { [itemIndex]: returnQty }
  const [returnReason, setReturnReason] = useState('Customer Changed Mind');
  const [returnTender, setReturnTender] = useState('Original Payment Method');

  const [activeCreditNote, setActiveCreditNote] = useState(null);

  // Filter Catalog
  const categories = ['All', ...Array.from(new Set(posCatalog.map(p => p.category)))];

  const filteredCatalog = posCatalog.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    return matchCat && matchQuery;
  });

  // Calculate totals
  const subtotal = posCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * (currentOrg.taxRate / 100);
  const total = subtotal + tax;

  const handlePay = (method) => {
    const order = completeCheckout(method);
    if (order) {
      setLastReceipt(order);
      setCheckoutModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Module: POS-RETAIL • Phase 2
            </span>
            <span className="text-xs font-mono text-indigo-400">Barcode Hardware Ready</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Web Point of Sale (POS) Terminal
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Fast walk-in checkout, instantaneous stock deduction, split payments, and receipt printing.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'terminal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Terminal
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Receipts ({posOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === 'shifts' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Drawer & Shifts (FR-802)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              posShift ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {posShift ? 'Open' : 'Closed'}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shift Live Indicator Pill */}
          <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${posShift ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className="font-semibold text-slate-200">
                {posShift ? (
                  <>Shift <span className="font-mono text-indigo-400">{posShift.id}</span> on <span className="font-mono text-slate-300">{posShift.registerId}</span> • Cashier: <strong className="text-white">{posShift.cashier}</strong></>
                ) : (
                  'Cash Register is Closed. Open shift to initialize float & drawer tracking.'
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {posShift ? (
                <>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Drawer Expected: <strong className="text-emerald-400 text-xs font-bold">${shiftExpectedCash.toFixed(2)}</strong>
                  </span>
                  <button
                    onClick={() => setActiveTab('shifts')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs flex items-center gap-1"
                  >
                    Manage Drawer →
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setOpenShiftModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                >
                  + Open Register Float
                </button>
              )}
            </div>
          </div>
          {/* Left: Product Catalog & Barcode Search */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Category Filter */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Scan barcode or search SKU/product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
                  autoFocus
                />
                <Barcode className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {filteredCatalog.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => addToCart(prod)}
                  disabled={prod.stock === 0}
                  className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-3.5 text-left transition group flex flex-col justify-between space-y-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-indigo-400 font-bold">{prod.sku}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        prod.stock < 10 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {prod.stock} in stock
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      ${prod.price.toFixed(2)}
                    </span>
                    <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-xs font-bold transition">
                      +
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Active Order Cart & Fast Checkout */}
          <div ref={cartRef} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-2xl h-fit min-h-[520px]">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-white text-sm">Active POS Register</h3>
                </div>
                {posCart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              {posCart.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <ShoppingCart className="w-8 h-8 mx-auto opacity-30 text-indigo-400" />
                  <p className="text-xs">Register cart is empty.</p>
                  <p className="text-[11px] text-slate-600">Scan items or click catalog to add.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-800/60">
                  {posCart.map((item) => (
                    <div key={item.id} className="pt-2 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                        <p className="text-[11px] font-mono text-emerald-400">
                          ${item.price.toFixed(2)} x {item.qty} = ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-mono font-bold text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout Pricing Ledger */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sales Tax ({currentOrg.taxRate}%):</span>
                  <span className="font-mono font-semibold text-slate-200">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total Due:</span>
                  <span className="font-mono text-emerald-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                disabled={posCart.length === 0}
                onClick={() => setCheckoutModal(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Charge ${total.toFixed(2)} →
              </button>
            </div>
          </div>

          {/* Mobile Sticky Floating Cart Bar */}
          {posCart.length > 0 && (
            <div className="lg:hidden fixed bottom-16 left-3 right-3 z-30 animate-in slide-in-from-bottom duration-200">
              <button
                onClick={() => cartRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-2xl shadow-2xl flex items-center justify-between border border-emerald-400/30"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-black/30 rounded-lg">
                    <ShoppingCart className="w-4 h-4 text-emerald-300" />
                  </span>
                  <span className="text-xs">{posCart.reduce((s, i) => s + i.qty, 0)} Items In Cart</span>
                </div>
                <span className="text-xs font-mono font-bold bg-black/40 px-3 py-1 rounded-xl">
                  ${total.toFixed(2)} • Checkout →
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          VIEW 2: ORDERS & TRANSACTION RECEIPTS
         ===================================================================== */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-mono">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Cashier</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Total Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {posOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {ord.cashier}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {ord.date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{ord.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</div>
                      {ord.voidReason && (
                        <div className="text-[10px] text-rose-400/80 italic mt-0.5">Void: "{ord.voidReason}"</div>
                      )}
                      {ord.refundReceipts && ord.refundReceipts.length > 0 && (
                        <div className="text-[10px] text-purple-400 italic mt-0.5">
                          Refunded: ${ord.refundedAmount?.toFixed(2)} ({ord.refundReceipts[0].id})
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sm">
                      <span className={ord.status === 'Voided' ? 'line-through text-slate-500' : 'text-emerald-400'}>
                        ${ord.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'Completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : ord.status === 'Voided'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.status === 'Completed' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedOrderForReturn(ord);
                                const initialReturn = {};
                                ord.items.forEach((it, idx) => { initialReturn[idx] = it.qty; });
                                setReturnItemsState(initialReturn);
                                setReturnModal(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-semibold transition flex items-center gap-1"
                              title="Process Customer Return & Restock"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Return</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrderForVoid(ord);
                                setVoidModal(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition flex items-center gap-1"
                              title="Void Transaction & Restore Stock"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Void</span>
                            </button>
                          </>
                        )}
                        {ord.status === 'Partially Refunded' && (
                          <button
                            onClick={() => {
                              setSelectedOrderForReturn(ord);
                              const initialReturn = {};
                              ord.items.forEach((it, idx) => { initialReturn[idx] = it.qty; });
                              setReturnItemsState(initialReturn);
                              setReturnModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition"
                          >
                            Refund More
                          </button>
                        )}
                        {ord.refundReceipts && ord.refundReceipts.length > 0 && (
                          <button
                            onClick={() => setActiveCreditNote(ord.refundReceipts[0])}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[10px] transition"
                            title="View Credit Note / Refund Receipt"
                          >
                            Credit Note
                          </button>
                        )}
                        {ord.status === 'Voided' && (
                          <span className="text-[11px] text-slate-500 font-mono italic">Stock Restored</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: FR-802 REGISTER SHIFT FLOAT & CASH DRAWER RECONCILIATION
         ===================================================================== */}
      {activeTab === 'shifts' && (
        <div className="space-y-6">
          {/* Active Shift Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                  posShift
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}>
                  {posShift ? '🟢 Register Shift Active' : '🔴 Register Closed'}
                </span>
                <span className="text-xs font-mono text-slate-400">Station: {posShift?.registerId || 'REG-01-FLAGSHIP'}</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                {posShift ? `${posShift.id} • Cashier: ${posShift.cashier}` : 'Cash Register is Currently Closed'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                {posShift ? posShift.notes : 'Open a new register shift and verify initial opening float to enable cash drawer receipts and automated reconciliation.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              {posShift ? (
                <>
                  <button
                    onClick={() => setCashDropModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition shadow-sm"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>+ Safe Cash Drop</span>
                  </button>
                  <button
                    onClick={() => setReconcileModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Close Shift & Reconcile →</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setOpenShiftModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Open Shift & Set Float →</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Financial Telemetry KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Opening Float */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Opening Float</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                ${posShift ? posShift.openingFloat.toFixed(2) : '0.00'}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Base verified cash in till at shift start
              </p>
            </div>

            {/* KPI 2: Cash Sales Collected */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Cash Sales Inflow</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Banknote className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400 tracking-tight">
                +${shiftCashSales.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                From register cash checkout receipts
              </p>
            </div>

            {/* KPI 3: Safe Cash Drops */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Vault Cash Drops</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ArrowDownToLine className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-400 tracking-tight">
                -${shiftCashDropsTotal.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Transferred to safe vault ({posShift?.cashDrops?.length || 0} drops)
              </p>
            </div>

            {/* KPI 4: Net Expected Cash */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Expected in Drawer</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                ${shiftExpectedCash.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Float + Cash Sales - Vault Drops
              </p>
            </div>
          </div>

          {/* Active Shift Cash Drops Feed */}
          {posShift && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ArrowDownToLine className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-white text-sm">Active Shift Cash Drops (Vault Deposits)</h3>
                </div>
                <button
                  onClick={() => setCashDropModal(true)}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  + Add Drop
                </button>
              </div>

              {(!posShift.cashDrops || posShift.cashDrops.length === 0) ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No cash drops recorded for this active shift. Use "+ Safe Cash Drop" when cash in till exceeds safety thresholds.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60 text-xs">
                  {posShift.cashDrops.map((drop) => (
                    <div key={drop.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-semibold text-white">{drop.reason}</span>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Time: {drop.time}</span>
                          <span>•</span>
                          <span>Authorized by: <strong className="text-slate-300">{drop.authorizer}</strong></span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        -${drop.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Historical Register Settlement Z-Reports */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">Shift Settlement & Z-Report History (FR-802)</h3>
                <p className="text-xs text-slate-400">Archived reconciliation logs showing closing physical counts, variances, and manager approvals.</p>
              </div>
              <span className="text-xs font-mono text-slate-400">{posShiftHistory.length} Settlements</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-mono">
                    <th className="py-3 px-4">Shift ID</th>
                    <th className="py-3 px-4">Register & Cashier</th>
                    <th className="py-3 px-4">Window</th>
                    <th className="py-3 px-4">Opening Float</th>
                    <th className="py-3 px-4">Cash Sales</th>
                    <th className="py-3 px-4">Vault Drops</th>
                    <th className="py-3 px-4">Expected</th>
                    <th className="py-3 px-4">Counted Physical</th>
                    <th className="py-3 px-4">Variance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Z-Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {posShiftHistory.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                        {s.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{s.cashier}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{s.registerId}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        <div>{s.openedAt}</div>
                        <div className="text-slate-500">to {s.closedAt}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        ${s.openingFloat.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400">
                        +${s.cashSales.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-400">
                        -${s.cashDropsTotal.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-white">
                        ${s.expectedCash.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ${s.closingCountedCash.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded ${
                          s.variance === 0
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : s.variance > 0
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-rose-500/15 text-rose-300'
                        }`}>
                          {s.variance >= 0 ? `+${s.variance.toFixed(2)}` : s.variance.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'Balanced'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : s.status === 'Overage'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedShiftReport(s)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] transition"
                        >
                          View Z-Report
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

      {/* Modal: Payment Method Selector */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Select Payment Method</h3>
                <p className="text-xs text-slate-400">Total charge: ${total.toFixed(2)}</p>
              </div>
              <button onClick={() => setCheckoutModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePay('Credit Card (Visa/MC)')}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-left transition flex flex-col justify-between h-24 group"
              >
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300">Card Terminal</div>
                  <div className="text-[10px] text-slate-500">Contactless / Chip</div>
                </div>
              </button>

              <button
                onClick={() => handlePay('Cash Drawer')}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition flex flex-col justify-between h-24 group"
              >
                <Banknote className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300">Cash Register</div>
                  <div className="text-[10px] text-slate-500">Auto Drawer Kick</div>
                </div>
              </button>

              <button
                onClick={() => handlePay('QR Pay / Instant Transfer')}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-left transition flex flex-col justify-between h-24 group"
              >
                <QrCode className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-purple-300">QR / Transfer</div>
                  <div className="text-[10px] text-slate-500">Dynamic QR Code</div>
                </div>
              </button>

              <button
                onClick={() => handlePay('Customer Credit Account')}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-left transition flex flex-col justify-between h-24 group"
              >
                <Layers className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300">Store Credit</div>
                  <div className="text-[10px] text-slate-500">Net 30 Terms</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Receipt Popover */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-white text-base">Payment Successful</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{lastReceipt.orderNumber}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl text-left text-xs font-mono space-y-2 border border-slate-800">
              <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-800">
                <span>Cashier: {lastReceipt.cashier}</span>
                <span>{lastReceipt.date}</span>
              </div>
              {lastReceipt.items.map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-slate-300">{it.qty}x {it.name}</span>
                  <span className="text-white">${(it.qty * it.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                <span className="text-slate-300">Total:</span>
                <span className="text-emerald-400">${lastReceipt.total.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-slate-500 text-center pt-2">
                Paid via {lastReceipt.paymentMethod}
              </div>
            </div>

            <button
              onClick={() => setLastReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Done / New Sale
            </button>
          </div>
        </div>
      )}

      {/* Modal: Cash Drop (FR-802) */}
      {cashDropModal && posShift && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Perform Safe Cash Drop</h3>
              </div>
              <button onClick={() => setCashDropModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Current Till Balance:</span>
                <span className="font-mono font-bold text-emerald-400">${shiftExpectedCash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Station / Register:</span>
                <span className="font-mono text-slate-300">{posShift.registerId}</span>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!dropAmount || parseFloat(dropAmount) <= 0) return;
              addCashDrop({ amount: dropAmount, reason: dropReason, authorizer: dropAuthorizer });
              setDropAmount('');
              setCashDropModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Drop Amount ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={shiftExpectedCash}
                    required
                    placeholder="e.g. 200.00"
                    value={dropAmount}
                    onChange={(e) => setDropAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-white font-mono font-bold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Purpose / Reason</label>
                <select
                  value={dropReason}
                  onChange={(e) => setDropReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                >
                  <option value="Midday Cash Drop to Vault Safe">Midday Cash Drop to Vault Safe</option>
                  <option value="Excess Cash Skim (Drawer limit reached)">Excess Cash Skim (Drawer limit reached)</option>
                  <option value="End-of-Rush Safe Transfer">End-of-Rush Safe Transfer</option>
                  <option value="Direct Armored Courier Pickup">Direct Armored Courier Pickup</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Authorizing Manager</label>
                <input
                  type="text"
                  required
                  value={dropAuthorizer}
                  onChange={(e) => setDropAuthorizer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCashDropModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/20"
                >
                  Confirm Drop →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reconcile & Close Shift (FR-802) */}
      {reconcileModal && posShift && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-white text-base">End Shift & Reconcile Cash Drawer</h3>
                  <p className="text-[11px] text-slate-400">Shift {posShift.id} • Cashier: {posShift.cashier}</p>
                </div>
              </div>
              <button onClick={() => setReconcileModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Step 1: Ledger Expected Breakdown */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">1. System Expected Cash Breakdown</span>
              <div className="divide-y divide-slate-800/60 font-mono text-[11px]">
                <div className="py-1 flex justify-between text-slate-300">
                  <span>Opening Float:</span>
                  <span>${posShift.openingFloat.toFixed(2)}</span>
                </div>
                <div className="py-1 flex justify-between text-emerald-400">
                  <span>+ Cash Sales Collected:</span>
                  <span>+${shiftCashSales.toFixed(2)}</span>
                </div>
                <div className="py-1 flex justify-between text-amber-400">
                  <span>- Vault Cash Drops:</span>
                  <span>-${shiftCashDropsTotal.toFixed(2)}</span>
                </div>
                <div className="pt-2 flex justify-between font-bold text-sm text-white border-t border-slate-800">
                  <span>Total System Expected in Till:</span>
                  <span className="text-indigo-400 font-mono">${shiftExpectedCash.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Step 2: Physical Count Entry & Real-time Variance */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (countedCashInput === '') return;
              closeRegisterShift({ countedCash: countedCashInput, notes: reconcileNotes });
              setCountedCashInput('');
              setReconcileNotes('');
              setReconcileModal(false);
              setActiveTab('shifts');
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">
                  2. Enter Actual Physical Cash Counted in Till ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="e.g. 790.50"
                    value={countedCashInput}
                    onChange={(e) => setCountedCashInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-white font-mono font-black text-sm outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>
              </div>

              {/* Real-time Variance Feedback Card */}
              {countedCashInput !== '' && (() => {
                const counted = parseFloat(countedCashInput) || 0;
                const diff = Number((counted - shiftExpectedCash).toFixed(2));
                const isBalanced = Math.abs(diff) < 0.01;
                const isShort = diff < 0;

                return (
                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    isBalanced
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isShort
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Calculated Drawer Variance:</span>
                      <span className="font-mono text-sm">
                        {isBalanced ? '$0.00 (Balanced)' : `${diff >= 0 ? '+' : ''}$${diff.toFixed(2)} (${isShort ? 'Shortage' : 'Overage'})`}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80">
                      {isBalanced
                        ? 'Physical cash perfectly balances against the shift register journal.'
                        : isShort
                        ? 'Warning: Register is short. Note explanation below for store manager review.'
                        : 'Register has an overage. Will be recorded into cashier discrepancy journal.'}
                    </p>
                  </div>
                );
              })()}

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Reconciliation Notes / Explanation</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Verified bills and coin trays. All credit card terminal batches settled."
                  value={reconcileNotes}
                  onChange={(e) => setReconcileNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReconcileModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={countedCashInput === ''}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/25 disabled:opacity-40"
                >
                  Finalize & Close Shift →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Open Register Shift (FR-802) */}
      {openShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Open Register Shift (Set Float)</h3>
              </div>
              <button onClick={() => setOpenShiftModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              openRegisterShift({ openingFloat: openFloatInput, notes: openNotes, registerId: openRegisterId });
              setOpenShiftModal(false);
              setActiveTab('shifts');
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Register Station</label>
                <select
                  value={openRegisterId}
                  onChange={(e) => setOpenRegisterId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                >
                  <option value="REG-01-FLAGSHIP">REG-01-FLAGSHIP (Main Checkout)</option>
                  <option value="REG-02-EXPRESS">REG-02-EXPRESS (Grab & Go Counter)</option>
                  <option value="REG-03-WAREHOUSE">REG-03-WAREHOUSE (Dispatch Desk)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Opening Cash Float ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={openFloatInput}
                    onChange={(e) => setOpenFloatInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-white font-mono font-bold outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Starting cash float in coins & change placed in the drawer.</p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Cashier On Duty</label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.name} (${currentUser.role})`}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Verification Notes</label>
                <input
                  type="text"
                  value={openNotes}
                  onChange={(e) => setOpenNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenShiftModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25"
                >
                  Open Drawer & Begin →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Z-Report Settlement Viewer (FR-802) */}
      {selectedShiftReport && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Z-Report Settlement</h3>
              </div>
              <button onClick={() => setSelectedShiftReport(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl text-left text-xs font-mono space-y-2 border border-slate-800">
              <div className="text-center font-bold text-white text-sm border-b border-slate-800 pb-2">
                {currentOrg.name} — REGISTER TILL
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">Shift Settlement Journal #{selectedShiftReport.id}</div>
              </div>

              <div className="space-y-1 text-slate-400 text-[11px] pt-1">
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span className="text-white">{selectedShiftReport.cashier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Register:</span>
                  <span className="text-white">{selectedShiftReport.registerId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shift Window:</span>
                  <span className="text-white">{selectedShiftReport.openedAt} - {selectedShiftReport.closedAt}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Opening Float:</span>
                  <span>${selectedShiftReport.openingFloat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>+ Cash Drawer Sales:</span>
                  <span>+${selectedShiftReport.cashSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>- Vault Cash Drops:</span>
                  <span>-${selectedShiftReport.cashDropsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                  <span>Expected Cash:</span>
                  <span>${selectedShiftReport.expectedCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-indigo-400">
                  <span>Actual Counted Cash:</span>
                  <span>${selectedShiftReport.closingCountedCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-800">
                  <span>Discrepancy / Variance:</span>
                  <span className={selectedShiftReport.variance === 0 ? 'text-emerald-400' : selectedShiftReport.variance < 0 ? 'text-rose-400' : 'text-amber-400'}>
                    {selectedShiftReport.variance >= 0 ? `+${selectedShiftReport.variance.toFixed(2)}` : selectedShiftReport.variance.toFixed(2)} ({selectedShiftReport.status})
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 text-[10px] text-slate-400 italic">
                "{selectedShiftReport.notes}"
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
              >
                Print Z-Report
              </button>
              <button
                onClick={() => setSelectedShiftReport(null)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Void Order Confirmation */}
      {voidModal && selectedOrderForVoid && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <Ban className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Void Transaction #{selectedOrderForVoid.orderNumber}</h3>
              </div>
              <button onClick={() => setVoidModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-300 space-y-1">
              <p className="font-bold">⚠️ Warning: Irreversible Action</p>
              <p className="text-[11px] opacity-90">
                Voiding this transaction will cancel the sale of <strong>${selectedOrderForVoid.total.toFixed(2)}</strong>, reverse gross revenue, and restock all {selectedOrderForVoid.items.length} items back to inventory catalog.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Original Cashier:</span>
                <span className="text-white">{selectedOrderForVoid.cashier}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Tender:</span>
                <span className="text-white">{selectedOrderForVoid.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Reversal:</span>
                <span className="text-rose-400 font-bold">${selectedOrderForVoid.total.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              voidPosOrder(selectedOrderForVoid.id, voidReason);
              setVoidModal(false);
              setSelectedOrderForVoid(null);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Reason for Void</label>
                <select
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-rose-500"
                >
                  <option value="Cashier Scanning Error">Cashier Scanning Error</option>
                  <option value="Customer Cancelled / Walked Out">Customer Cancelled / Walked Out</option>
                  <option value="Duplicate Charge / Terminal Glitch">Duplicate Charge / Terminal Glitch</option>
                  <option value="Incorrect Payment Tender Selected">Incorrect Payment Tender Selected</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVoidModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/25"
                >
                  Confirm Void & Restock →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Return & Refund Selector */}
      {returnModal && selectedOrderForReturn && (() => {
        // Compute return totals from returnItemsState
        const returnLineItems = selectedOrderForReturn.items.map((it, idx) => {
          const qty = Number(returnItemsState[idx]) || 0;
          return { ...it, qty };
        }).filter(it => it.qty > 0);

        const refundSub = returnLineItems.reduce((sum, it) => sum + (it.price * it.qty), 0);
        const refundTx = refundSub * (currentOrg.taxRate / 100);
        const refundTot = Number((refundSub + refundTx).toFixed(2));

        return (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-purple-400">
                  <RotateCcw className="w-5 h-5" />
                  <div>
                    <h3 className="font-bold text-white text-base">Process Return & Refund</h3>
                    <p className="text-[11px] text-slate-400">Receipt #{selectedOrderForReturn.orderNumber} • Paid: ${selectedOrderForReturn.total.toFixed(2)}</p>
                  </div>
                </div>
                <button onClick={() => setReturnModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {/* Items Return Selector */}
              <div className="space-y-2">
                <label className="block text-slate-300 text-xs font-bold">Select Items & Quantities to Return</label>
                <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/60 max-h-52 overflow-y-auto p-2">
                  {selectedOrderForReturn.items.map((it, idx) => {
                    const currentQty = returnItemsState[idx] !== undefined ? returnItemsState[idx] : it.qty;
                    return (
                      <div key={idx} className="py-2 px-1 flex items-center justify-between gap-3 text-xs">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{it.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">${it.price.toFixed(2)} each (Orig: {it.qty})</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Return:</span>
                          <select
                            value={currentQty}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setReturnItemsState(prev => ({ ...prev, [idx]: val }));
                            }}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono font-bold outline-none"
                          >
                            {Array.from({ length: it.qty + 1 }, (_, i) => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Refund Ledger Preview */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Items Subtotal Refund:</span>
                  <span className="text-white">${refundSub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sales Tax ({currentOrg.taxRate}%) Refund:</span>
                  <span className="text-white">${refundTx.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-white pt-1.5 border-t border-slate-800">
                  <span>Total Due to Customer:</span>
                  <span className="text-emerald-400">${refundTot.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (returnLineItems.length === 0 || refundTot <= 0) return;
                const creditNote = refundPosOrder({
                  orderId: selectedOrderForReturn.id,
                  itemsToRefund: returnLineItems,
                  refundMethod: returnTender === 'Original Payment Method' ? selectedOrderForReturn.paymentMethod : returnTender,
                  reason: returnReason
                });
                setReturnModal(false);
                setSelectedOrderForReturn(null);
                if (creditNote) setActiveCreditNote(creditNote);
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Reason for Return</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  >
                    <option value="Customer Changed Mind">Customer Changed Mind</option>
                    <option value="Defective / Damaged Item">Defective / Damaged Item</option>
                    <option value="Wrong Model / Specifications">Wrong Model / Specifications</option>
                    <option value="Exchange for Alternate Item">Exchange for Alternate Item</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Refund Tender Method</label>
                  <select
                    value={returnTender}
                    onChange={(e) => setReturnTender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  >
                    <option value="Original Payment Method">Original Payment Method ({selectedOrderForReturn.paymentMethod})</option>
                    <option value="Cash Drawer">Cash Drawer</option>
                    <option value="Credit Card Refund (Terminal)">Credit Card Refund (Terminal)</option>
                    <option value="Store Credit Voucher">Store Credit Voucher</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReturnModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={refundTot <= 0}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/25 disabled:opacity-40"
                  >
                    Issue Refund (${refundTot.toFixed(2)}) →
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Modal: Credit Note / Refund Receipt Viewer */}
      {activeCreditNote && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-white text-base">Credit Note / Return Receipt</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{activeCreditNote.id}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl text-left text-xs font-mono space-y-2 border border-slate-800">
              <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-800">
                <span>Original Order: {activeCreditNote.orderNumber}</span>
                <span>{activeCreditNote.date}</span>
              </div>
              <div className="py-1 text-[11px] text-slate-400">
                Reason: <strong className="text-slate-200">{activeCreditNote.reason}</strong>
              </div>
              <div className="space-y-1">
                {activeCreditNote.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span>{it.qty}x {it.name} (Restocked)</span>
                    <span className="text-white">${(it.qty * it.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                <span className="text-purple-300">Total Refunded:</span>
                <span className="text-emerald-400">${activeCreditNote.refundTotal.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-slate-500 text-center pt-2">
                Refunded via {activeCreditNote.refundMethod} • Inventory Automatically Restocked
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
              >
                Print Credit Note
              </button>
              <button
                onClick={() => setActiveCreditNote(null)}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
