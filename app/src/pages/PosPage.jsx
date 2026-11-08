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
  Layers
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
    currentUser
  } = useApp();

  const cartRef = React.useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'orders'
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

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
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'terminal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Terminal
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Order Receipts ({posOrders.length})
          </button>
        </div>
      </div>

      {activeTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      {ord.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      ${ord.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
};
