import React, { useState, useRef, useEffect } from 'react';
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
  Undo2,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Star,
  Sparkles,
  Printer,
  X,
  Store,
  KeyRound,
  ShieldAlert
} from 'lucide-react';

export const PosTerminalPage = () => {
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
    selectedBranch,
    navigateToPath,
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lastReceipt, setLastReceipt] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cashier Lock Screen State
  const [isLocked, setIsLocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const DEFAULT_PIN = '1234';

  // Checkout modal
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Cash Drawer');
  const [cashTendered, setCashTendered] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Retail Guest');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Held carts state
  const [heldCarts, setHeldCarts] = useState([]);

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
  const [openNotes, setOpenNotes] = useState('Opening float verified in bills and coin rolls.');

  const [selectedShiftReport, setSelectedShiftReport] = useState(null);

  // Returns & Void Order Modal States
  const [voidModal, setVoidModal] = useState(false);
  const [selectedOrderForVoid, setSelectedOrderForVoid] = useState(null);
  const [voidReason, setVoidReason] = useState('Cashier Scanning Error');

  const [returnModal, setReturnModal] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnItemsState, setReturnItemsState] = useState({});
  const [returnReason, setReturnReason] = useState('Customer Return / Defective');
  const [returnTender, setReturnTender] = useState('Cash Drawer');
  const [activeCreditNote, setActiveCreditNote] = useState(null);

  // Hotkey barcode autofocus
  const searchInputRef = useRef(null);

  // Fullscreen toggle helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLocked) return;
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (posCart.length > 0) setCheckoutModal(true);
      } else if (e.key === 'F8') {
        e.preventDefault();
        setReconcileModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posCart, isLocked]);

  // Categories
  const categories = ['All', '★ Quick-Keys', ...Array.from(new Set(posCatalog.map(p => p.category)))];

  const filteredCatalog = posCatalog.filter(p => {
    if (selectedCategory === '★ Quick-Keys') {
      if (!p.isQuickKey) return false;
    } else if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchBarcode = p.barcode ? p.barcode.includes(q) : false;
      return matchName || matchSku || matchBarcode;
    }
    return true;
  });

  // Cart calculations
  const rawSubtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = rawSubtotal * (discountPercent / 100);
  const cartSubtotal = rawSubtotal - discountAmount;
  const taxRate = currentOrg?.taxRate || 8.5;
  const cartTax = cartSubtotal * (taxRate / 100);
  const cartTotal = cartSubtotal + cartTax;

  const totalCartUnits = posCart.reduce((sum, item) => sum + item.qty, 0);

  // Currency helper
  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Tender checkout
  const handleCompleteSale = () => {
    if (posCart.length === 0) return;
    const tenderedVal = Number(cashTendered) || cartTotal;
    const changeDue = Math.max(0, tenderedVal - cartTotal);

    const receipt = completeCheckout({
      paymentMethod: selectedPayment,
      customerName,
      discountPercent,
      cashTendered: selectedPayment === 'Cash Drawer' ? tenderedVal : null,
      changeDue: selectedPayment === 'Cash Drawer' ? changeDue : 0,
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      branchId: selectedBranch?.id || 'BR-HQ-01'
    });

    setLastReceipt(receipt);
    setCheckoutModal(false);
    setCashTendered('');
    setDiscountPercent(0);
  };

  // Hold / Resume Cart
  const handleHoldCart = () => {
    if (posCart.length === 0) return;
    const held = {
      id: `hold_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName,
      items: [...posCart],
      total: cartTotal
    };
    setHeldCarts(prev => [held, ...prev]);
    clearCart();
  };

  const handleResumeCart = (heldId) => {
    const target = heldCarts.find(h => h.id === heldId);
    if (!target) return;
    clearCart();
    target.items.forEach(item => {
      for (let i = 0; i < item.qty; i++) {
        addToCart(item);
      }
    });
    setCustomerName(target.customerName);
    setHeldCarts(prev => prev.filter(h => h.id !== heldId));
  };

  // Cashier PIN Pad
  const handlePinInput = (num) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + num;
      setEnteredPin(next);
      setPinError('');
      if (next.length === 4) {
        if (next === DEFAULT_PIN || next === '0000') {
          setIsLocked(false);
          setEnteredPin('');
        } else {
          setPinError('Invalid PIN code. Try 1234');
          setTimeout(() => setEnteredPin(''), 800);
        }
      }
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* =========================================================================
          1. KIOSK TERMINAL TOP NAVIGATION BAR
          ========================================================================= */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Terminal Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToPath('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            title="Return to Business Management Platform"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit to BMS</span>
          </button>

          <div className="h-5 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow shadow-indigo-600/30">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  NexusPOS Terminal
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  REG-01 • ONLINE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden md:inline">
                {selectedBranch?.name || 'Flagship Megastore'} • Currency: USD ($)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Shift & Drawer Quick Pill */}
        <div className="flex items-center gap-2">
          {posShift?.isOpen ? (
            <button
              onClick={() => setReconcileModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2 text-xs transition"
              title="Click to view drawer balance & cash drops"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 hidden sm:inline">Drawer Cash:</span>
              <span className="font-mono font-bold text-emerald-400">
                {formatMoney(shiftExpectedCash)}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setOpenShiftModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-2 text-xs font-bold animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Shift Closed — Open Register</span>
            </button>
          )}

          {heldCarts.length > 0 && (
            <div className="px-2.5 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5">
              <span>{heldCarts.length} Held Cart{heldCarts.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Right: Actions, Cashier Badge & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Quick Shift Button */}
          <button
            onClick={() => {
              if (posShift?.isOpen) setCashDropModal(true);
              else setOpenShiftModal(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 hidden lg:flex items-center gap-1.5 transition"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-amber-400" />
            <span>Vault Drop</span>
          </button>

          {/* Returns & Void */}
          <button
            onClick={() => setReturnModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 hidden lg:flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Returns (FR-803)</span>
          </button>

          {/* Cashier Lock / Switch */}
          <button
            onClick={() => setIsLocked(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
            title="Lock Countertop Terminal with Cashier PIN"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{currentUser?.name || 'Cashier'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Toggle Countertop Kiosk Fullscreen (F11)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN TERMINAL WORKSPACE (CATALOG LEFT + CART RIGHT)
          ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: PRODUCT TOUCH CATALOG */}
        <section className="flex-1 flex flex-col min-w-0 bg-slate-950/60 p-3.5 overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 shrink-0">
            {/* Instant Search / Barcode auto-focus */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Scan Barcode or Search SKU / Product Name... [F2]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredCatalog.length === 1) {
                    addToCart(filteredCatalog[0]);
                    setSearchQuery('');
                  }
                }}
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition shadow-inner font-mono"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                <Barcode className="w-3 h-3 text-indigo-400" />
                <span>SCAN READY</span>
              </div>
            </div>

            {/* Quick Shift Reconciliation trigger button */}
            <button
              onClick={() => setReconcileModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Z-Report [F8]</span>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 shrink-0 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30'
                    : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800/80'
                }`}
              >
                {cat === '★ Quick-Keys' && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-1 mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 content-start">
            {filteredCatalog.map((product) => {
              const inCartQty = posCart.find(c => c.id === product.id)?.qty || 0;
              const isLowStock = product.stock < 10;
              const isOutOfStock = product.stock <= 0;

              return (
                <button
                  key={product.id}
                  disabled={isOutOfStock}
                  onClick={() => addToCart(product)}
                  className={`group relative rounded-2xl p-3 text-left border flex flex-col justify-between transition-all active:scale-[0.98] ${
                    isOutOfStock
                      ? 'bg-slate-900/30 border-slate-900 opacity-50 cursor-not-allowed'
                      : inCartQty > 0
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar on Card */}
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-800 truncate">
                      {product.sku}
                    </span>

                    {inCartQty > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                        {inCartQty}
                      </span>
                    )}

                    {product.isQuickKey && inCartQty === 0 && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                    )}
                  </div>

                  {/* Product Title */}
                  <div className="flex-1 mb-2">
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-indigo-300 transition">
                      {product.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {product.category}
                    </span>
                  </div>

                  {/* Bottom: Price & Stock */}
                  <div className="flex items-end justify-between gap-1 pt-1 border-t border-slate-800/60">
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {formatMoney(product.price)}
                    </span>
                    <span className={`text-[10px] font-mono ${
                      isOutOfStock
                        ? 'text-rose-400'
                        : isLowStock
                        ? 'text-amber-400 font-bold'
                        : 'text-slate-500'
                    }`}>
                      {isOutOfStock ? 'OUT OF STOCK' : `${product.stock} in stock`}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredCatalog.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500">
                <Barcode className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-400" />
                <p className="text-sm font-medium">No retail products found</p>
                <p className="text-xs text-slate-600 mt-1">Try clearing filters or search by barcode</p>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: REAL-TIME CART & TENDER */}
        <aside className="w-80 md:w-96 lg:w-[420px] bg-slate-900 border-l border-slate-800 flex flex-col justify-between shrink-0 z-10 shadow-2xl">
          {/* Cart Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">Active Order Cart</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                {totalCartUnits}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {posCart.length > 0 && (
                <>
                  <button
                    onClick={handleHoldCart}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                    title="Park / Hold this order for later"
                  >
                    Hold
                  </button>
                  <button
                    onClick={clearCart}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                    title="Void / Clear active cart"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Customer & Loyalty Banner */}
          <div className="px-3.5 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-transparent border-none text-white font-medium focus:outline-none text-xs w-48 truncate"
                placeholder="Assign Customer..."
              />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              LOYALTY: ACTIVE
            </span>
          </div>

          {/* Held Carts Notification Drawer */}
          {heldCarts.length > 0 && (
            <div className="p-2 bg-indigo-950/40 border-b border-indigo-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{heldCarts.length} cart{heldCarts.length > 1 ? 's' : ''} on hold</span>
              </div>
              <button
                onClick={() => handleResumeCart(heldCarts[0].id)}
                className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition"
              >
                Resume Cart ({formatMoney(heldCarts[0].total)})
              </button>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
            {posCart.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                    <span>{formatMoney(item.price)} each</span>
                    <span>•</span>
                    <span className="text-slate-300 font-bold">{formatMoney(item.price * item.qty)}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800 shrink-0">
                  <button
                    onClick={() => updateCartQty(item.id, item.qty - 1)}
                    className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-xs text-white">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.id, item.qty + 1)}
                    className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {posCart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center py-16 text-slate-500 text-center">
                <ShoppingCart className="w-12 h-12 mb-2 stroke-1 opacity-20 text-indigo-400" />
                <p className="text-xs font-medium text-slate-400">Register cart is empty</p>
                <p className="text-[11px] text-slate-600 mt-1">Tap products or scan barcode to ring sale</p>
              </div>
            )}
          </div>

          {/* Cart Pricing Breakdown & Tender */}
          <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 shrink-0 space-y-2.5">
            {/* Quick Discount Selector */}
            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400">
              <span>Discounts:</span>
              <div className="flex items-center gap-1">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition ${
                      discountPercent === pct
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({totalCartUnits} items)</span>
                <span className="font-mono">{formatMoney(rawSubtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span className="font-mono">-{formatMoney(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Tax ({taxRate}%)</span>
                <span className="font-mono">{formatMoney(cartTax)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-800 text-base font-bold text-white">
                <span>Grand Total</span>
                <span className="font-mono text-xl text-emerald-400 font-extrabold">
                  {formatMoney(cartTotal)}
                </span>
              </div>
            </div>

            {/* Main Tender Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                disabled={posCart.length === 0}
                onClick={() => {
                  setSelectedPayment('Cash Drawer');
                  setCheckoutModal(true);
                }}
                className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-600/20 transition active:scale-[0.98]"
              >
                <Banknote className="w-4 h-4" />
                <span>Cash [F1]</span>
              </button>

              <button
                disabled={posCart.length === 0}
                onClick={() => {
                  setSelectedPayment('Card Terminal');
                  setCheckoutModal(true);
                }}
                className="py-2.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-indigo-600/20 transition active:scale-[0.98]"
              >
                <CreditCard className="w-4 h-4" />
                <span>Card [F2]</span>
              </button>

              <button
                disabled={posCart.length === 0}
                onClick={() => {
                  setSelectedPayment('QR Pay');
                  setCheckoutModal(true);
                }}
                className="py-2.5 px-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-purple-600/20 transition active:scale-[0.98]"
              >
                <QrCode className="w-4 h-4" />
                <span>QR Pay [F3]</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          3. CASHIER PIN LOCK SCREEN OVERLAY
          ========================================================================= */}
      {isLocked && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="max-w-sm w-full glass-panel rounded-3xl p-8 border border-slate-700/80 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white">Register Locked</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter Cashier PIN to unlock (Default PIN: 1234)
              </p>
            </div>

            {/* PIN Indicator Dots */}
            <div className="flex justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    enteredPin.length > idx
                      ? 'bg-indigo-500 border-indigo-400 scale-110 shadow'
                      : 'bg-slate-900 border-slate-700'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-bold animate-pulse">{pinError}</p>
            )}

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinInput(String(num))}
                  className="h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-lg border border-slate-800 active:scale-95 transition"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setEnteredPin('')}
                className="h-14 rounded-2xl bg-slate-900 hover:bg-rose-950/40 text-rose-400 font-bold text-xs border border-slate-800 transition"
              >
                Clear
              </button>
              <button
                onClick={() => handlePinInput('0')}
                className="h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-lg border border-slate-800 active:scale-95 transition"
              >
                0
              </button>
              <button
                onClick={() => {
                  if (enteredPin === DEFAULT_PIN || enteredPin === '0000') {
                    setIsLocked(false);
                    setEnteredPin('');
                  } else {
                    setPinError('Invalid PIN code');
                  }
                }}
                className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs border border-indigo-500 transition shadow"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. CHECKOUT MODAL
          ========================================================================= */}
      {checkoutModal && (
        <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Complete Sale Checkout</h3>
                <span className="text-xs text-slate-400">Total: {formatMoney(cartTotal)}</span>
              </div>
              <button onClick={() => setCheckoutModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              {['Cash Drawer', 'Card Terminal', 'QR Pay'].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    selectedPayment === method
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {method === 'Cash Drawer' && <Banknote className="w-4 h-4" />}
                  {method === 'Card Terminal' && <CreditCard className="w-4 h-4" />}
                  {method === 'QR Pay' && <QrCode className="w-4 h-4" />}
                  <span>{method}</span>
                </button>
              ))}
            </div>

            {selectedPayment === 'Cash Drawer' && (
              <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="text-xs text-slate-400 block font-medium">Cash Tendered by Customer</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={cartTotal.toFixed(2)}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-base font-bold"
                  />
                </div>

                {/* Quick Bills */}
                <div className="flex gap-1.5 pt-1">
                  {[20, 50, 100].map((bill) => (
                    <button
                      key={bill}
                      onClick={() => setCashTendered(String(bill))}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition"
                    >
                      ${bill}
                    </button>
                  ))}
                  <button
                    onClick={() => setCashTendered(cartTotal.toFixed(2))}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-xs font-bold transition"
                  >
                    Exact
                  </button>
                </div>

                {Number(cashTendered) > cartTotal && (
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                    <span className="text-slate-400">Change Due to Customer:</span>
                    <span className="font-mono font-extrabold text-emerald-400 text-sm">
                      {formatMoney(Number(cashTendered) - cartTotal)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCheckoutModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteSale}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
              >
                Confirm & Print Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. THERMAL RECEIPT MODAL
          ========================================================================= */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white text-slate-900 rounded-2xl p-6 shadow-2xl font-mono text-xs space-y-4">
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <h2 className="text-base font-bold font-sans tracking-wide">NEXUS RETAIL STORE</h2>
              <p className="text-[10px] text-slate-500">{selectedBranch?.name || 'Flagship Megastore'}</p>
              <p className="text-[10px] text-slate-500">Tax ID: 88-1920-BMS • Receipt #{lastReceipt.orderNumber}</p>
              <p className="text-[10px] text-slate-500">{lastReceipt.date} • Cashier: {lastReceipt.cashier}</p>
            </div>

            {/* Line items */}
            <div className="space-y-1.5 py-1 border-b border-dashed border-slate-300">
              {lastReceipt.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.qty}x {it.name}</span>
                  <span className="font-bold">${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-1 border-b border-dashed border-slate-300 pb-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${lastReceipt.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${lastReceipt.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1">
                <span>TOTAL PAID</span>
                <span>${lastReceipt.total?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Payment Tender</span>
                <span>{lastReceipt.paymentMethod}</span>
              </div>
              {lastReceipt.changeDue > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Change Given</span>
                  <span>${lastReceipt.changeDue?.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="text-center text-[10px] text-slate-500 pt-1">
              <p>Thank you for shopping with Nexus!</p>
              <p className="mt-1 font-mono tracking-widest">||| | ||||| |||| || |||</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => setLastReceipt(null)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. SHIFT DRAWER & Z-REPORT MODAL (FR-802)
          ========================================================================= */}
      {reconcileModal && (
        <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Register Shift Drawer & Z-Report</h3>
                <span className="text-xs text-slate-400">Register ID: REG-01 • Cashier: Elena Rostova</span>
              </div>
              <button onClick={() => setReconcileModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Opening Cash Float:</span>
                <span className="font-mono text-white font-bold">{formatMoney(posShift?.openingFloat || 250)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shift Cash Sales Collected:</span>
                <span className="font-mono text-emerald-400 font-bold">+{formatMoney(shiftCashSales)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Vault Cash Drops (Safe):</span>
                <span className="font-mono text-amber-400 font-bold">-{formatMoney(shiftCashDropsTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Expected Drawer Cash:</span>
                <span className="font-mono text-emerald-400 text-base">{formatMoney(shiftExpectedCash)}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Actual Counted Physical Cash in Drawer</label>
              <input
                type="number"
                step="0.01"
                placeholder={shiftExpectedCash.toFixed(2)}
                value={countedCashInput}
                onChange={(e) => setCountedCashInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReconcileModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const actual = Number(countedCashInput) || shiftExpectedCash;
                  closeRegisterShift({ actualCounted: actual, notes: reconcileNotes });
                  setReconcileModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
              >
                Reconcile & Close Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. VAULT CASH DROP MODAL (FR-802)
          ========================================================================= */}
      {cashDropModal && (
        <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Vault Safe Cash Drop</h3>
              <button onClick={() => setCashDropModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              Transfer excess cash bills from register drawer to back-office vault safe to mitigate cash-in-drawer risk.
            </p>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Drop Amount ($)</label>
              <input
                type="number"
                step="10"
                placeholder="200.00"
                value={dropAmount}
                onChange={(e) => setDropAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCashDropModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (Number(dropAmount) > 0) {
                    addCashDrop({ amount: Number(dropAmount), reason: dropReason, authorizer: dropAuthorizer });
                    setCashDropModal(false);
                    setDropAmount('');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow"
              >
                Execute Vault Drop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. RETURNS & REFUNDS MODAL (FR-803)
          ========================================================================= */}
      {returnModal && (
        <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-xl w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">POS Returns, Refunds & Voids (FR-803)</h3>
                <span className="text-xs text-slate-400">Lookup recent retail receipts to issue credit note or void</span>
              </div>
              <button onClick={() => setReturnModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Recent Orders List */}
            <div className="space-y-2">
              {posOrders.slice(0, 6).map((order) => (
                <div
                  key={order.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : order.status === 'Voided'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      {order.date} • {order.items?.length || 0} items • {order.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">
                      {formatMoney(order.total)}
                    </span>
                    {order.status === 'Completed' && (
                      <button
                        onClick={() => {
                          if (confirm(`Void order ${order.orderNumber} and restock items to inventory?`)) {
                            voidPosOrder(order.id, 'Cashier Counter Void');
                            setReturnModal(false);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-bold transition"
                      >
                        Void
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setReturnModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PosTerminalPage;
