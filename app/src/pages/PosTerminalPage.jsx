import React, { useState, useRef, useEffect } from 'react';
import { roundTo5Sen } from '../utils/format';
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
    posCategories,
    currentOrg,
    currentUser,
    selectedBranch,
    navigateToPath,
    // FR-802: Register Shift & Cash Drawer Reconciliation
    posShift,
    isShiftOpen,
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

  // Evaluate whether cash drawer shift is currently open
  const isShiftActive = isShiftOpen !== undefined ? isShiftOpen : Boolean(posShift && (posShift.status === 'Open' || posShift.isOpen));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lastReceipt, setLastReceipt] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Cashier Lock Screen State
  const [isLocked, setIsLocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const DEFAULT_PIN = '1234';

  // Checkout modal
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Cash (RM - 5¢ Rounding)');
  const [cashTendered, setCashTendered] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Retail Guest');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Held carts state
  const [heldCarts, setHeldCarts] = useState([]);

  // FR-802 Modal states
  const [cashDropModal, setCashDropModal] = useState(false);
  const [dropAmount, setDropAmount] = useState('');
  const [dropReason, setDropReason] = useState('Midday Cash Drop to Vault Safe');
  const [dropAuthorizer, setDropAuthorizer] = useState('Nurul Elena (Finance)');

  const [reconcileModal, setReconcileModal] = useState(false);
  const [countedCashInput, setCountedCashInput] = useState('');
  const [reconcileNotes, setReconcileNotes] = useState('');

  const [openShiftModal, setOpenShiftModal] = useState(false);
  const [openFloatInput, setOpenFloatInput] = useState('250.00');
  const [openRegisterId, setOpenRegisterId] = useState('REG-01-KL-SENTRAL');
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
      if (e.key === 'F1') {
        e.preventDefault();
        if (!isShiftActive) {
          setOpenShiftModal(true);
        } else if (posCart.length > 0) {
          setSelectedPayment('Cash (RM - 5¢ Rounding)');
          setCheckoutModal(true);
        }
      } else if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F3') {
        e.preventDefault();
        if (!isShiftActive) {
          setOpenShiftModal(true);
        } else if (posCart.length > 0) {
          setSelectedPayment('DuitNow QR');
          setCheckoutModal(true);
        }
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (!isShiftActive) {
          setOpenShiftModal(true);
        } else if (posCart.length > 0) {
          setSelectedPayment('MyDebit / Visa Card');
          setCheckoutModal(true);
        }
      } else if (e.key === 'F8') {
        e.preventDefault();
        setReconcileModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posCart, isLocked, isShiftActive]);

  // Handle adding items to cart with shift open validation
  const handleAddItemToCart = (product) => {
    if (!isShiftActive) {
      setOpenShiftModal(true);
      return;
    }
    addToCart(product);
  };

  // Categories (FR-804 Category Governance)
  const allCats = Array.from(new Set([...(posCategories || []), ...posCatalog.map(p => p.category)]));
  const categories = ['All', '★ Quick-Keys', ...allCats];

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

  // Currency helper (Malaysian Ringgit)
  const formatMoney = (amount) => {
    return `RM ${Number(amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Tender checkout (Enforcing FR-802: Orders blocked if shift is closed & BNM 5-sen cash rounding)
  const handleCompleteSale = () => {
    if (!isShiftActive) {
      alert('Cannot place order: Register shift is closed. Please open shift and record starting cash float first.');
      setCheckoutModal(false);
      setOpenShiftModal(true);
      return;
    }
    if (posCart.length === 0) return;
    const isCash = selectedPayment?.includes('Cash');
    const { roundedTotal, roundingAdjustment } = isCash ? roundTo5Sen(cartTotal) : { roundedTotal: cartTotal, roundingAdjustment: 0 };
    const payableAmount = isCash ? roundedTotal : cartTotal;
    const tenderedVal = Number(cashTendered) || payableAmount;
    const changeDue = Math.max(0, tenderedVal - payableAmount);

    const receipt = completeCheckout({
      paymentMethod: selectedPayment,
      customerName,
      discountPercent,
      cashTendered: isCash ? tenderedVal : null,
      changeDue: isCash ? changeDue : 0,
      roundingAdjustment: isCash ? roundingAdjustment : 0,
      subtotal: cartSubtotal,
      tax: cartTax,
      total: payableAmount,
      branchId: selectedBranch?.id || 'br_kl'
    });

    if (!receipt) {
      alert('Order could not be processed. Please verify register shift is open.');
      return;
    }

    setLastReceipt(receipt);
    setCheckoutModal(false);
    setMobileCartOpen(false);
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
          1. KIOSK TERMINAL TOP NAVIGATION BAR (RESPONSIVE)
          ========================================================================= */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-2.5 sm:px-4 flex items-center justify-between gap-2 shrink-0 z-20">
        {/* Left: Terminal Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => navigateToPath('/')}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shrink-0"
            title="Return to Business Management Platform"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit to BMS</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow shadow-indigo-600/30 shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide truncate">
                  NexusPOS
                </span>
                {isShiftActive ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {posShift?.registerId || 'REG-01'} • ONLINE
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    REG-01 • SHIFT CLOSED
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 hidden md:inline truncate">
                {selectedBranch?.name || 'Kuala Lumpur HQ (KL Sentral)'} • RM (MYR)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Shift & Drawer Quick Pill */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isShiftActive ? (
            <button
              onClick={() => setReconcileModal(true)}
              className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/30 flex items-center gap-1.5 text-xs transition shadow-sm"
              title="Shift is OPEN — Click to view drawer balance & cash drops"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-400 hidden md:inline">Drawer:</span>
              <span className="font-mono font-bold text-emerald-400 text-xs">
                {formatMoney(shiftExpectedCash)}
              </span>
              <span className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                Open
              </span>
            </button>
          ) : (
            <button
              onClick={() => setOpenShiftModal(true)}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 flex items-center gap-1.5 text-[11px] sm:text-xs font-bold transition shadow-sm animate-pulse"
              title="Shift is CLOSED — Click to open register and set float"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-none">Shift Closed — Open Register</span>
            </button>
          )}

          {heldCarts.length > 0 && (
            <div className="hidden sm:flex px-2 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold items-center gap-1">
              <span>{heldCarts.length} Held</span>
            </div>
          )}
        </div>

        {/* Right: Actions, Cashier Badge & Cart Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Shift Button (Desktop only) */}
          <button
            onClick={() => {
              if (isShiftActive) setCashDropModal(true);
              else setOpenShiftModal(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 hidden xl:flex items-center gap-1.5 transition"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-amber-400" />
            <span>Vault Drop</span>
          </button>

          {/* Returns & Void (Desktop only) */}
          <button
            onClick={() => setReturnModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 hidden xl:flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Returns</span>
          </button>

          {/* Cashier Lock / Switch */}
          <button
            onClick={() => setIsLocked(true)}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
            title="Lock Countertop Terminal with Cashier PIN"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{currentUser?.name || 'Cashier'}</span>
          </button>

          {/* Mobile Cart Toggle Button (Mobile only) */}
          <button
            onClick={() => setMobileCartOpen(!mobileCartOpen)}
            className="relative p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white lg:hidden transition flex items-center justify-center shadow"
            title="Toggle Order Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalCartUnits > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 text-slate-950 font-bold font-mono text-[10px] flex items-center justify-center shadow">
                {totalCartUnits}
              </span>
            )}
          </button>

          {/* Fullscreen Button (hidden on mobile) */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hidden sm:flex transition"
            title="Toggle Countertop Kiosk Fullscreen (F11)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN TERMINAL WORKSPACE (CATALOG LEFT + CART RIGHT)
          ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT COLUMN: PRODUCT TOUCH CATALOG */}
        <section className="flex-1 flex flex-col min-w-0 bg-slate-950/60 p-2.5 sm:p-3.5 overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3 shrink-0">
            {/* Instant Search / Barcode auto-focus */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products or scan... [F2]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredCatalog.length === 1) {
                    handleAddItemToCart(filteredCatalog[0]);
                    setSearchQuery('');
                  }
                }}
                className="w-full pl-9 pr-3 sm:pr-24 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition shadow-inner font-mono"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                <Barcode className="w-3 h-3 text-indigo-400" />
                <span>SCAN READY</span>
              </div>
            </div>

            {/* Quick Shift Reconciliation trigger button */}
            <button
              onClick={() => setReconcileModal(true)}
              className="px-2.5 py-2 sm:px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0"
              title="Open Shift Z-Report [F8]"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Z-Report [F8]</span>
            </button>
          </div>

          {/* Shift Closed Alert Banner (FR-802 Trading Suspended Guard) */}
          {!isShiftActive && (
            <div className="mb-2 sm:mb-3 p-3 rounded-2xl bg-gradient-to-r from-rose-950/90 via-amber-950/60 to-rose-950/90 border border-rose-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 border border-rose-500/30">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white tracking-wide flex items-center gap-2">
                    <span>REGISTER SHIFT IS CLOSED</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 font-mono font-bold">TRADING SUSPENDED</span>
                  </h4>
                  <p className="text-[11px] text-rose-200/90 mt-0.5">
                    Orders cannot be placed. Cashier must open shift and set the starting cash float before ringing sales.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpenShiftModal(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Open Shift & Set Float</span>
              </button>
            </div>
          )}

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 shrink-0 scrollbar-none">
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
          <div className="flex-1 overflow-y-auto pr-1 mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2.5 content-start">
            {filteredCatalog.map((product) => {
              const inCartQty = posCart.find(c => c.id === product.id)?.qty || 0;
              const isLowStock = product.stock < 10;
              const isOutOfStock = product.stock <= 0;

              return (
                <button
                  key={product.id}
                  disabled={isOutOfStock}
                  onClick={() => handleAddItemToCart(product)}
                  className={`group relative rounded-2xl p-2.5 sm:p-3 text-left border flex flex-col justify-between transition-all active:scale-[0.98] ${
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
                    <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                      {formatMoney(product.price)}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] font-mono truncate ${
                      isOutOfStock
                        ? 'text-rose-400'
                        : isLowStock
                        ? 'text-amber-400 font-bold'
                        : 'text-slate-500'
                    }`}>
                      {isOutOfStock ? 'OUT' : `${product.stock} in stock`}
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

          {/* MOBILE STICKY BOTTOM CART BAR */}
          <div className="pt-2 bg-slate-950/80 border-t border-slate-800/80 lg:hidden shrink-0">
            {!isShiftActive ? (
              <button
                onClick={() => setOpenShiftModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white font-bold shadow-xl shadow-rose-600/30 transition active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-200 animate-pulse" />
                  <span className="text-xs">Shift Closed — Open Register</span>
                </div>
                <span className="text-xs font-mono font-extrabold bg-black/30 px-2.5 py-1 rounded-lg">Set Float →</span>
              </button>
            ) : (
              <button
                onClick={() => setMobileCartOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold shadow-xl shadow-indigo-600/30 transition active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {totalCartUnits > 0 && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.2 bg-emerald-400 text-slate-950 rounded-full text-[10px] font-black font-mono shadow">
                        {totalCartUnits}
                      </span>
                    )}
                  </div>
                  <span className="text-xs">
                    {totalCartUnits > 0 ? `${totalCartUnits} Item${totalCartUnits > 1 ? 's' : ''} in Cart` : 'Tap to View Cart'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-sm font-extrabold text-white">
                  <span>{formatMoney(cartTotal)}</span>
                  <span className="text-indigo-200 text-base font-sans">→</span>
                </div>
              </button>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: REAL-TIME CART & TENDER (DESKTOP SIDEBAR + MOBILE SLIDE-OVER MODAL) */}
        <aside
          className={`
            fixed inset-0 z-40 bg-slate-900 flex flex-col justify-between shadow-2xl transition-transform duration-300
            lg:static lg:z-auto lg:translate-x-0 lg:w-96 xl:w-[420px] lg:border-l lg:border-slate-800 lg:shrink-0
            ${mobileCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Cart Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileCartOpen(false)}
                className="lg:hidden p-1.5 -ml-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Back to Catalog"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
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

            {/* Shift Closed Tender Blocker (FR-802 Order Block) */}
            {!isShiftActive && (
              <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-center space-y-1.5 mb-2 shadow-lg">
                <div className="flex items-center justify-center gap-1.5 text-rose-300 text-xs font-extrabold tracking-wide">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>SHIFT CLOSED • CHECKOUT BLOCKED</span>
                </div>
                <p className="text-[10px] text-rose-200/80">
                  Open cash drawer shift and set starting float to enable order tender.
                </p>
                <button
                  onClick={() => setOpenShiftModal(true)}
                  className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Open Shift & Set Float</span>
                </button>
              </div>
            )}

            {/* Main Tender Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                disabled={!isShiftActive || posCart.length === 0}
                onClick={() => {
                  if (!isShiftActive) {
                    setOpenShiftModal(true);
                    return;
                  }
                  setSelectedPayment('Cash (RM - 5¢ Rounding)');
                  setCheckoutModal(true);
                }}
                className={`py-2.5 px-2 rounded-xl text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg transition active:scale-[0.98] ${
                  !isShiftActive || posCart.length === 0
                    ? 'bg-slate-800 text-slate-500 border border-slate-700/50 opacity-40 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                }`}
                title={!isShiftActive ? 'Shift closed: Open shift to checkout' : 'Complete cash sale [F1]'}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash [F1]</span>
              </button>

              <button
                disabled={!isShiftActive || posCart.length === 0}
                onClick={() => {
                  if (!isShiftActive) {
                    setOpenShiftModal(true);
                    return;
                  }
                  setSelectedPayment('MyDebit / Visa Card');
                  setCheckoutModal(true);
                }}
                className={`py-2.5 px-2 rounded-xl text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg transition active:scale-[0.98] ${
                  !isShiftActive || posCart.length === 0
                    ? 'bg-slate-800 text-slate-500 border border-slate-700/50 opacity-40 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                }`}
                title={!isShiftActive ? 'Shift closed: Open shift to checkout' : 'Process card payment [F2]'}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card [F2]</span>
              </button>

              <button
                disabled={!isShiftActive || posCart.length === 0}
                onClick={() => {
                  if (!isShiftActive) {
                    setOpenShiftModal(true);
                    return;
                  }
                  setSelectedPayment('DuitNow QR');
                  setCheckoutModal(true);
                }}
                className={`py-2.5 px-2 rounded-xl text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg transition active:scale-[0.98] ${
                  !isShiftActive || posCart.length === 0
                    ? 'bg-slate-800 text-slate-500 border border-slate-700/50 opacity-40 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                }`}
                title={!isShiftActive ? 'Shift closed: Open shift to checkout' : 'Scan customer QR code [F3]'}
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Complete Sale Checkout</h3>
                <span className="text-xs text-slate-400">Total: {formatMoney(cartTotal)}</span>
              </div>
              <button onClick={() => setCheckoutModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Cash (RM - 5¢ Rounding)', 'DuitNow QR', 'Touch \'n Go eWallet', 'MyDebit / Visa Card'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedPayment(method)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 ${
                    selectedPayment === method
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {method.includes('Cash') && <Banknote className="w-4 h-4 text-emerald-400" />}
                  {method.includes('DuitNow') && <QrCode className="w-4 h-4 text-rose-400" />}
                  {method.includes('Touch') && <QrCode className="w-4 h-4 text-sky-400" />}
                  {method.includes('Debit') && <CreditCard className="w-4 h-4 text-indigo-300" />}
                  <span className="text-center text-[11px] leading-tight">{method}</span>
                </button>
              ))}
            </div>

            {(selectedPayment === 'Cash (RM - 5¢ Rounding)' || selectedPayment?.includes('Cash')) && (() => {
              const { roundedTotal, roundingAdjustment } = roundTo5Sen(cartTotal);
              const cashPayable = roundedTotal;
              const tenderNum = Number(cashTendered) || cashPayable;
              const changeDue = Math.max(0, tenderNum - cashPayable);

              return (
                <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Bank Negara 5¢ Rounding:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {roundingAdjustment !== 0
                        ? (roundingAdjustment > 0 ? `+RM ${roundingAdjustment.toFixed(2)}` : `-RM ${Math.abs(roundingAdjustment).toFixed(2)}`)
                        : 'RM 0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                    <span className="text-slate-300 font-bold">Net Cash Payable:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">{formatMoney(cashPayable)}</span>
                  </div>

                  <label className="text-xs text-slate-400 block font-medium">Cash Tendered by Customer</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-400 font-mono font-bold">RM</span>
                    <input
                      type="number"
                      step="0.05"
                      placeholder={cashPayable.toFixed(2)}
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-base font-bold"
                    />
                  </div>

                  {/* Quick Bills (Bank Negara Malaysia Ringgit Banknotes) */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[10, 20, 50, 100, 200].map((bill) => (
                      <button
                        key={bill}
                        type="button"
                        onClick={() => setCashTendered(String(bill))}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition"
                      >
                        RM {bill}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCashTendered(cashPayable.toFixed(2))}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-xs font-bold transition"
                    >
                      Exact (RM {cashPayable.toFixed(2)})
                    </button>
                  </div>

                  {Number(cashTendered) > cashPayable && (
                    <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                      <span className="text-slate-400">Change Due to Customer:</span>
                      <span className="font-mono font-extrabold text-emerald-400 text-sm">
                        {formatMoney(changeDue)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}

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
              <h2 className="text-base font-bold font-sans tracking-wide">NEXUS ENTERPRISE SOLUTIONS SDN. BHD.</h2>
              <p className="text-[10px] text-slate-600 font-bold">{selectedBranch?.name || 'Kuala Lumpur HQ (KL Sentral)'}</p>
              <p className="text-[10px] text-slate-500">SSM: 202401038291 (1543820-K) • SST: W10-2401-32000088</p>
              <p className="text-[10px] text-slate-500">LHDN TIN: C25893010020 • MSIC: 62021</p>
              <p className="text-[10px] text-slate-500">{lastReceipt.date} • Cashier: {lastReceipt.cashier} • #{lastReceipt.orderNumber}</p>
            </div>

            {/* Line items */}
            <div className="space-y-1.5 py-1 border-b border-dashed border-slate-300">
              {lastReceipt.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.qty}x {it.name}</span>
                  <span className="font-bold">{formatMoney(it.price * it.qty)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-1 border-b border-dashed border-slate-300 pb-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(lastReceipt.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatMoney(lastReceipt.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1">
                <span>TOTAL PAID</span>
                <span>{formatMoney(lastReceipt.total)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Payment Tender</span>
                <span>{lastReceipt.paymentMethod}</span>
              </div>
              {lastReceipt.changeDue > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Change Given</span>
                  <span>{formatMoney(lastReceipt.changeDue)}</span>
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Register Shift Drawer & Z-Report (FR-802)</h3>
                <span className="text-xs text-slate-400">
                  {isShiftActive
                    ? `${posShift?.registerId || 'REG-01-KL-SENTRAL'} • Cashier: ${posShift?.cashier || currentUser.name}`
                    : 'REG-01-KL-SENTRAL • Status: Shift Closed'}
                </span>
              </div>
              <button onClick={() => setReconcileModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {!isShiftActive ? (
              <div className="space-y-4 py-1">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Register Shift Currently Open</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Trading is currently paused. Cashier must open a new shift and set the starting cash float before taking payments.
                  </p>
                  <button
                    onClick={() => {
                      setReconcileModal(false);
                      setOpenShiftModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition inline-flex items-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Open Register Shift Now</span>
                  </button>
                </div>

                {posShiftHistory && posShiftHistory.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">Previous Closed Shifts ({posShiftHistory.length})</span>
                      <span className="text-[10px] text-slate-500">Official Z-Reports</span>
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                      {posShiftHistory.map(shift => (
                        <div
                          key={shift.id}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{shift.id}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                shift.status === 'Balanced'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}>
                                {shift.status}
                              </span>
                            </div>
                            <span className="text-slate-400 text-[11px] block mt-0.5">
                              {shift.openedAt} - {shift.closedAt} • Cashier: {shift.cashier}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedShiftReport(shift);
                              setReconcileModal(false);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1 shrink-0"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Z-Report</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setReconcileModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
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

                {/* Quick action to record mid-shift vault drop */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Excess cash in drawer?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setReconcileModal(false);
                      setCashDropModal(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 flex items-center gap-1.5 transition"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>Record Vault Cash Drop</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400 font-medium">Actual Counted Physical Cash in Drawer</label>
                    <button
                      type="button"
                      onClick={() => setCountedCashInput(shiftExpectedCash.toFixed(2))}
                      className="text-[10px] text-emerald-400 hover:underline font-mono"
                    >
                      Count Exact Expected
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={shiftExpectedCash.toFixed(2)}
                    value={countedCashInput}
                    onChange={(e) => setCountedCashInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold focus:outline-none focus:border-indigo-500"
                  />

                  {countedCashInput && (
                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="text-slate-400">Reconciliation Variance:</span>
                      <span className={`font-mono font-bold ${
                        Number(countedCashInput) === shiftExpectedCash
                          ? 'text-emerald-400'
                          : Number(countedCashInput) > shiftExpectedCash
                          ? 'text-indigo-400'
                          : 'text-rose-400'
                      }`}>
                        {Number(countedCashInput) - shiftExpectedCash >= 0 ? '+' : ''}
                        {formatMoney(Number(countedCashInput) - shiftExpectedCash)} (
                        {Number(countedCashInput) === shiftExpectedCash ? 'Balanced' : Number(countedCashInput) > shiftExpectedCash ? 'Overage' : 'Shortage'})
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Closing Notes / Discrepancy Explanation</label>
                  <input
                    type="text"
                    placeholder="All coin rolls counted. Verified bills against tape..."
                    value={reconcileNotes}
                    onChange={(e) => setReconcileNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setReconcileModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const actual = countedCashInput !== '' ? Number(countedCashInput) : shiftExpectedCash;
                      const summary = closeRegisterShift({ countedCash: actual, notes: reconcileNotes });
                      setReconcileModal(false);
                      setCountedCashInput('');
                      setReconcileNotes('');
                      if (summary) setSelectedShiftReport(summary);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
                  >
                    Reconcile & Print Z-Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          OPEN REGISTER SHIFT MODAL (FR-802)
          ========================================================================= */}
      {openShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              openRegisterShift({
                openingFloat: openFloatInput,
                notes: openNotes,
                registerId: openRegisterId
              });
              setOpenShiftModal(false);
            }}
            className="max-w-md w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Open Register Shift (Set Float)</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpenShiftModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Verify starting coins and cash bills in the register drawer before opening shift for trade.
            </p>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Register Station</label>
              <select
                value={openRegisterId}
                onChange={(e) => setOpenRegisterId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="REG-01-KL-SENTRAL">REG-01-KL-SENTRAL (Main Counter)</option>
                <option value="REG-02-PENANG">REG-02-PENANG (Express Lane)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1 font-bold">Opening Cash Float (RM) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-emerald-400 font-bold text-xs">RM</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={openFloatInput}
                  onChange={(e) => setOpenFloatInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-white font-mono font-bold text-sm"
                />
              </div>

              {/* Quick Float Presets */}
              <div className="flex gap-1.5 pt-1.5">
                {['150.00', '250.00', '300.00', '500.00'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setOpenFloatInput(val)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition"
                  >
                    RM {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Cashier On Duty</label>
              <input
                type="text"
                disabled
                value={currentUser?.name || 'Cashier'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Opening Shift Notes</label>
              <input
                type="text"
                value={openNotes}
                onChange={(e) => setOpenNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="Counted cash drawer and verified rolled coin tubes..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setOpenShiftModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Open Register & Trade</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          OFFICIAL Z-REPORT MODAL (FR-802)
          ========================================================================= */}
      {selectedShiftReport && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white text-slate-900 rounded-2xl p-6 shadow-2xl font-mono text-xs space-y-4">
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <span className="text-[10px] tracking-widest text-slate-500 block">*** DAILY REGISTER CLOSEOUT ***</span>
              <h2 className="text-base font-bold font-sans tracking-wide mt-0.5">OFFICIAL Z-REPORT</h2>
              <p className="text-[10px] text-slate-600">{selectedBranch?.name || 'Kuala Lumpur HQ (KL Sentral)'}</p>
              <p className="text-[10px] text-slate-600">Register: {selectedShiftReport.registerId} • Shift #{selectedShiftReport.id}</p>
              <p className="text-[10px] text-slate-600">Opened: {selectedShiftReport.openedAt} • Closed: {selectedShiftReport.closedAt}</p>
              <p className="text-[10px] text-slate-600">Cashier: {selectedShiftReport.cashier}</p>
            </div>

            <div className="space-y-1.5 py-1 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>Opening Cash Float:</span>
                <span className="font-bold">{formatMoney(selectedShiftReport.openingFloat)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Cash Sales Collected (+):</span>
                <span className="font-bold">+{formatMoney(selectedShiftReport.cashSales)}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Vault Safe Drops (-):</span>
                <span className="font-bold">-{formatMoney(selectedShiftReport.cashDropsTotal)}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold border-t border-slate-200">
                <span>EXPECTED DRAWER CASH:</span>
                <span>{formatMoney(selectedShiftReport.expectedCash)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>ACTUAL COUNTED CASH:</span>
                <span>{formatMoney(selectedShiftReport.closingCountedCash)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span>RECONCILIATION VARIANCE:</span>
                <span className={`font-bold ${
                  selectedShiftReport.variance === 0
                    ? 'text-emerald-700'
                    : selectedShiftReport.variance > 0
                    ? 'text-indigo-700'
                    : 'text-rose-700'
                }`}>
                  {selectedShiftReport.variance >= 0 ? '+' : ''}{formatMoney(selectedShiftReport.variance)} ({selectedShiftReport.status})
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 space-y-2 pt-1 border-b border-dashed border-slate-300 pb-3">
              <p>Notes: {selectedShiftReport.notes}</p>
              <div className="pt-2 flex justify-between">
                <span>Cashier Sign: _____________</span>
                <span>Audit: VERIFIED</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Z-Report</span>
              </button>
              <button
                onClick={() => setSelectedShiftReport(null)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. VAULT CASH DROP MODAL (FR-802)
          ========================================================================= */}
      {cashDropModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Vault Safe Cash Drop</h3>
              <button onClick={() => setCashDropModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              Transfer excess cash bills from register drawer to back-office vault safe to mitigate cash-in-drawer risk.
            </p>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Drop Amount (RM)</label>
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
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
