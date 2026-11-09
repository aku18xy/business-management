import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ORGS,
  INITIAL_USERS,
  ROLE_PERMISSIONS,
  INITIAL_KPIS,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CUSTOMERS,
  INITIAL_DEALS,
  INITIAL_QUOTATIONS,
  POS_CATALOG,
  INITIAL_POS_ORDERS,
  PIPELINE_STAGES,
  INITIAL_ACTIVE_SHIFT,
  INITIAL_SHIFT_HISTORY,
  INITIAL_WAREHOUSES,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_VENDORS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_STOCK_MOVEMENTS
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current user state (simulating RBAC active session)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  // Current organization & branch
  const [currentOrg, setCurrentOrg] = useState(INITIAL_ORGS[0]);
  const [selectedBranch, setSelectedBranch] = useState(INITIAL_ORGS[0].branches[0]);

  // Approvals workflow state
  const [approvals, setApprovals] = useState(() => {
    const saved = localStorage.getItem('nexus_approvals');
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('nexus_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // ==========================================
  // PHASE 2 STATE: CRM & PIPELINE
  // ==========================================
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('nexus_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('nexus_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [quotations, setQuotations] = useState(() => {
    const saved = localStorage.getItem('nexus_quotations');
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });

  // ==========================================
  // PHASE 2 STATE: POS TERMINAL & INVENTORY
  // ==========================================
  const [posCatalog, setPosCatalog] = useState(() => {
    const saved = localStorage.getItem('nexus_pos_catalog');
    return saved ? JSON.parse(saved) : POS_CATALOG;
  });

  const [posOrders, setPosOrders] = useState(() => {
    const saved = localStorage.getItem('nexus_pos_orders');
    return saved ? JSON.parse(saved) : INITIAL_POS_ORDERS;
  });

  const [posCart, setPosCart] = useState([]);

  // ==========================================
  // FR-802: REGISTER SHIFT & CASH DRAWER RECONCILIATION
  // ==========================================
  const [posShift, setPosShift] = useState(() => {
    const saved = localStorage.getItem('nexus_pos_shift');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_SHIFT;
  });

  const [posShiftHistory, setPosShiftHistory] = useState(() => {
    const saved = localStorage.getItem('nexus_pos_shift_history');
    return saved ? JSON.parse(saved) : INITIAL_SHIFT_HISTORY;
  });

  // True if there is an active open register shift
  const isShiftOpen = Boolean(posShift && (posShift.status === 'Open' || posShift.isOpen));

  // ==========================================
  // PHASE 3 STATE: ERP INVENTORY & SCM (FR-401, FR-402, FR-403)
  // ==========================================
  const [warehouses, setWarehouses] = useState(() => {
    const saved = localStorage.getItem('nexus_warehouses');
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSES;
  });

  const [inventoryItems, setInventoryItems] = useState(() => {
    const saved = localStorage.getItem('nexus_inventory_items');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY_ITEMS;
  });

  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('nexus_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    const saved = localStorage.getItem('nexus_purchase_orders');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [stockMovements, setStockMovements] = useState(() => {
    const saved = localStorage.getItem('nexus_stock_movements');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  // Theme mode & active navigation tab
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Current URL path tracking (supports dedicated /pos terminal route)
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPath = (path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      if (path === '/pos') {
        setMobileMenuOpen(false);
      }
    }
  };

  // Helper to change tab and close mobile drawer
  const navigateToTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    if (currentPath === '/pos') {
      navigateToPath('/');
    }
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('nexus_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexus_approvals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('nexus_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('nexus_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('nexus_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('nexus_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('nexus_pos_catalog', JSON.stringify(posCatalog));
  }, [posCatalog]);

  useEffect(() => {
    localStorage.setItem('nexus_pos_orders', JSON.stringify(posOrders));
  }, [posOrders]);

  useEffect(() => {
    localStorage.setItem('nexus_pos_shift', JSON.stringify(posShift));
  }, [posShift]);

  useEffect(() => {
    localStorage.setItem('nexus_pos_shift_history', JSON.stringify(posShiftHistory));
  }, [posShiftHistory]);

  // Phase 3 ERP Storage Sync
  useEffect(() => {
    localStorage.setItem('nexus_warehouses', JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem('nexus_inventory_items', JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  useEffect(() => {
    localStorage.setItem('nexus_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('nexus_purchase_orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('nexus_stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  // Role switching
  const switchUser = (userId) => {
    const target = INITIAL_USERS.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addAuditLog(`SWITCH_USER_ROLE`, `Switched active session to ${target.name} (${target.role})`);
    }
  };

  // Add audit log
  const addAuditLog = (action, details) => {
    const newLog = {
      id: `log_${Date.now()}`,
      actor: `${currentUser.name} (${currentUser.role})`,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: "127.0.0.1"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Approvals action
  const handleApprovalAction = (id, status) => {
    setApprovals(prev =>
      prev.map(item => item.id === id ? { ...item, status } : item)
    );
    const item = approvals.find(a => a.id === id);
    if (item) {
      addAuditLog(
        `APPROVAL_${status.toUpperCase()}`,
        `${status === 'Approved' ? 'Approved' : 'Rejected'} ${item.type}: "${item.title}" for ${item.amount}`
      );
    }
  };

  // ==========================================
  // CRM METHODS
  // ==========================================
  const addCustomer = (customerData) => {
    const newCust = {
      id: `cust_${Date.now()}`,
      ...customerData,
      outstandingBalance: 0,
      status: "Active"
    };
    setCustomers(prev => [newCust, ...prev]);
    addAuditLog('CRM_CUSTOMER_CREATED', `Added new client account: ${newCust.name} (${newCust.contactPerson})`);
  };

  const updateCustomer = (customerId, updatedData) => {
    setCustomers(prev =>
      prev.map(c => c.id === customerId ? { ...c, ...updatedData } : c)
    );
    const existing = customers.find(c => c.id === customerId);
    addAuditLog(
      'CRM_CUSTOMER_UPDATED',
      `Updated client profile for ${updatedData.name || existing?.name} (${updatedData.contactPerson || existing?.contactPerson})`
    );
  };

  const addDeal = (dealData) => {
    const newDeal = {
      id: `deal_${Date.now()}`,
      ...dealData
    };
    setDeals(prev => [newDeal, ...prev]);
    addAuditLog('CRM_DEAL_CREATED', `Created sales opportunity: "${newDeal.title}" valued at $${newDeal.value.toLocaleString()}`);
  };

  const updateDealStage = (dealId, newStage) => {
    setDeals(prev =>
      prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d)
    );
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      addAuditLog('CRM_DEAL_STAGE_MOVED', `Moved deal "${deal.title}" to stage: ${newStage.toUpperCase()}`);
    }
  };

  const createQuotation = (quoteData) => {
    const newQuote = {
      id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: "Draft",
      ...quoteData
    };
    setQuotations(prev => [newQuote, ...prev]);
    addAuditLog('QUOTATION_GENERATED', `Created quotation ${newQuote.id} for ${newQuote.customerName} ($${newQuote.total.toFixed(2)})`);
    return newQuote;
  };

  // ==========================================
  // POS METHODS
  // ==========================================
  const addToCart = (product) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (productId, delta) => {
    setPosCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const clearCart = () => setPosCart([]);

  const completeCheckout = (paymentPayload) => {
    // ENFORCE FR-802: If shift is closed, orders CANNOT be placed
    if (!isShiftOpen) {
      console.warn('BLOCKED: Cannot complete POS order because register shift is closed.');
      return null;
    }

    if (posCart.length === 0) return null;

    const paymentMethod = typeof paymentPayload === 'object' ? paymentPayload.paymentMethod : paymentPayload;
    const customer = typeof paymentPayload === 'object' ? paymentPayload.customerName : 'Walk-in Retail Guest';
    const subtotal = typeof paymentPayload === 'object' && paymentPayload.subtotal !== undefined
      ? paymentPayload.subtotal
      : posCart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = typeof paymentPayload === 'object' && paymentPayload.tax !== undefined
      ? paymentPayload.tax
      : subtotal * (currentOrg.taxRate / 100);
    const total = typeof paymentPayload === 'object' && paymentPayload.total !== undefined
      ? paymentPayload.total
      : subtotal + tax;
    const discountPercent = typeof paymentPayload === 'object' ? (paymentPayload.discountPercent || 0) : 0;
    const changeDue = typeof paymentPayload === 'object' ? (paymentPayload.changeDue || 0) : 0;
    const cashTendered = typeof paymentPayload === 'object' ? paymentPayload.cashTendered : null;

    const orderNumber = `POS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      shiftId: posShift?.id,
      registerId: posShift?.registerId || 'REG-01-FLAGSHIP',
      cashier: currentUser.name,
      customerName: customer,
      date: "Just now",
      items: posCart.map(item => ({ id: item.id, sku: item.sku, name: item.name, qty: item.qty, price: item.price })),
      subtotal,
      tax,
      total,
      discountPercent,
      paymentMethod,
      cashTendered,
      changeDue,
      status: "Completed"
    };

    // Deduct stock from POS catalog
    setPosCatalog(prev =>
      prev.map(p => {
        const cartItem = posCart.find(c => c.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        }
        return p;
      })
    );

    setPosOrders(prev => [newOrder, ...prev]);
    clearCart();

    addAuditLog(
      'POS_ORDER_COMPLETED',
      `Processed checkout ${orderNumber} for $${total.toFixed(2)} via ${paymentMethod} on shift ${posShift?.id || 'N/A'}`
    );

    return newOrder;
  };

  // ==========================================
  // POS RETURNS & VOID ORDER METHODS
  // ==========================================
  const voidPosOrder = (orderId, reason = 'Cashier Scanning Error / Order Cancelled') => {
    const target = posOrders.find(o => o.id === orderId);
    if (!target || target.status === 'Voided') return null;

    // 1. Restore stock to inventory catalog
    setPosCatalog(prev =>
      prev.map(prod => {
        const matchingItem = target.items.find(i => i.id === prod.id || i.name === prod.name);
        if (matchingItem) {
          return { ...prod, stock: prod.stock + matchingItem.qty };
        }
        return prod;
      })
    );

    // 2. Mark order as Voided
    const updatedOrder = {
      ...target,
      status: 'Voided',
      voidReason: reason,
      voidedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      voidedBy: currentUser.name
    };

    setPosOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));

    addAuditLog(
      'POS_ORDER_VOIDED',
      `Voided order ${target.orderNumber} ($${target.total.toFixed(2)}). Restocked items to inventory. Reason: ${reason}`
    );

    return updatedOrder;
  };

  const refundPosOrder = ({ orderId, itemsToRefund, refundMethod, reason }) => {
    const target = posOrders.find(o => o.id === orderId);
    if (!target || target.status === 'Voided' || target.status === 'Refunded') return null;

    // Calculate refund amounts
    const refundSubtotal = itemsToRefund.reduce((sum, it) => sum + (it.price * it.qty), 0);
    const refundTax = refundSubtotal * (currentOrg.taxRate / 100);
    const refundTotal = Number((refundSubtotal + refundTax).toFixed(2));

    // 1. Restore returned stock to inventory catalog
    setPosCatalog(prev =>
      prev.map(prod => {
        const returnedItem = itemsToRefund.find(i => i.id === prod.id || i.name === prod.name);
        if (returnedItem) {
          return { ...prod, stock: prod.stock + returnedItem.qty };
        }
        return prod;
      })
    );

    // 2. Determine if full or partial refund
    const existingRefunded = Number(target.refundedAmount) || 0;
    const newTotalRefunded = Number((existingRefunded + refundTotal).toFixed(2));
    const isFullRefund = newTotalRefunded >= (target.total - 0.05);

    const creditNoteId = `CN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const refundReceipt = {
      id: creditNoteId,
      orderId: target.id,
      orderNumber: target.orderNumber,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      refundSubtotal,
      refundTax,
      refundTotal,
      refundMethod: refundMethod || target.paymentMethod,
      reason: reason || 'Customer Return',
      cashier: currentUser.name,
      items: itemsToRefund
    };

    const updatedOrder = {
      ...target,
      status: isFullRefund ? 'Refunded' : 'Partially Refunded',
      refundedAmount: newTotalRefunded,
      refundReceipts: [...(target.refundReceipts || []), refundReceipt]
    };

    setPosOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));

    addAuditLog(
      'POS_ORDER_REFUNDED',
      `Issued Credit Note ${creditNoteId} for $${refundTotal.toFixed(2)} on ${target.orderNumber} via ${refundMethod}. Reason: ${reason}`
    );

    return refundReceipt;
  };

  // ==========================================
  // FR-804: POS CATALOG & ITEM MANAGEMENT METHODS
  // ==========================================
  const updatePosItem = (itemId, updatedData) => {
    const existing = posCatalog.find(p => p.id === itemId);
    if (!existing) return;

    setPosCatalog(prev =>
      prev.map(p => (p.id === itemId ? { ...p, ...updatedData } : p))
    );

    addAuditLog(
      'POS_ITEM_UPDATED',
      `Updated retail item ${existing.sku} - "${updatedData.name || existing.name}" (Price: $${Number(updatedData.price ?? existing.price).toFixed(2)}, Stock: ${updatedData.stock ?? existing.stock})`
    );
  };

  const addPosItem = (newItem) => {
    const id = `pos_prod_${Date.now()}`;
    const itemWithId = {
      id,
      sku: newItem.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newItem.name || 'New Retail Product',
      category: newItem.category || 'Retail',
      price: Number(newItem.price) || 0,
      cost: Number(newItem.cost) || 0,
      stock: Number(newItem.stock) || 0,
      barcode: newItem.barcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      image: newItem.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
      tileColor: newItem.tileColor || 'indigo',
      isQuickKey: Boolean(newItem.isQuickKey),
      activeInPos: newItem.activeInPos !== false
    };

    setPosCatalog(prev => [itemWithId, ...prev]);

    addAuditLog(
      'POS_ITEM_CREATED',
      `Added new POS retail item ${itemWithId.sku} - "${itemWithId.name}" ($${itemWithId.price.toFixed(2)})`
    );

    return itemWithId;
  };

  const deletePosItem = (itemId) => {
    const existing = posCatalog.find(p => p.id === itemId);
    if (!existing) return;

    setPosCatalog(prev => prev.filter(p => p.id !== itemId));

    addAuditLog(
      'POS_ITEM_DELETED',
      `Deleted POS retail item ${existing.sku} - "${existing.name}" from catalog`
    );
  };

  // ==========================================
  // FR-802: REGISTER SHIFT & CASH DRAWER RECONCILIATION METHODS
  // ==========================================
  const shiftCashSales = posOrders
    .filter(o => o.paymentMethod === 'Cash Drawer' && o.status !== 'Voided')
    .reduce((sum, o) => {
      if (o.status === 'Refunded') return sum;
      if (o.status === 'Partially Refunded') {
        return sum + Math.max(0, Number(o.total) - (Number(o.refundedAmount) || 0));
      }
      return sum + (Number(o.total) || 0);
    }, 0);

  const shiftCashDropsTotal = posShift && posShift.cashDrops
    ? posShift.cashDrops.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    : 0;

  const shiftExpectedCash = posShift
    ? Number((posShift.openingFloat + shiftCashSales - shiftCashDropsTotal).toFixed(2))
    : 0;

  const openRegisterShift = ({ openingFloat, notes = '', registerId = 'REG-01-FLAGSHIP' }) => {
    const floatNum = parseFloat(openingFloat) || 0;
    const newShift = {
      id: `SHIFT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      registerId,
      cashier: currentUser.name,
      openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      openedAtTimestamp: Date.now(),
      openingFloat: floatNum,
      status: 'Open',
      isOpen: true,
      notes,
      cashDrops: []
    };
    setPosShift(newShift);
    addAuditLog(
      'POS_SHIFT_OPENED',
      `Opened register shift ${newShift.id} on ${registerId} with float $${floatNum.toFixed(2)}`
    );
    return newShift;
  };

  const addCashDrop = ({ amount, reason, authorizer }) => {
    if (!posShift) return null;
    const dropNum = parseFloat(amount) || 0;
    const newDrop = {
      id: `drop_${Date.now()}`,
      amount: dropNum,
      reason: reason || 'Cash Drop to Vault Safe',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      authorizer: authorizer || currentUser.name
    };
    setPosShift(prev => ({
      ...prev,
      cashDrops: [...(prev.cashDrops || []), newDrop]
    }));
    addAuditLog(
      'POS_CASH_DROP',
      `Processed cash drop of $${dropNum.toFixed(2)} to vault. Authorizer: ${newDrop.authorizer}`
    );
    return newDrop;
  };

  const closeRegisterShift = ({ countedCash, actualCounted, notes = '' }) => {
    if (!posShift) return null;
    const countedNum = parseFloat(countedCash !== undefined ? countedCash : actualCounted) || 0;
    const variance = Number((countedNum - shiftExpectedCash).toFixed(2));
    const status = Math.abs(variance) < 0.01 ? 'Balanced' : variance > 0 ? 'Overage' : 'Shortage';

    const closedShiftSummary = {
      id: posShift.id,
      registerId: posShift.registerId,
      cashier: posShift.cashier,
      openedAt: posShift.openedAt,
      closedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      openingFloat: posShift.openingFloat,
      cashSales: shiftCashSales,
      cashDropsTotal: shiftCashDropsTotal,
      expectedCash: shiftExpectedCash,
      closingCountedCash: countedNum,
      variance,
      status,
      notes: notes || `Shift reconciled and closed by ${currentUser.name}.`
    };

    setPosShiftHistory(prev => [closedShiftSummary, ...prev]);
    setPosShift(null);
    addAuditLog(
      'POS_SHIFT_CLOSED',
      `Closed shift ${posShift.id}. Counted $${countedNum.toFixed(2)}, Expected $${shiftExpectedCash.toFixed(2)}, Variance: ${variance >= 0 ? '+' : ''}$${variance.toFixed(2)} (${status})`
    );
    return closedShiftSummary;
  };

  // ==========================================
  // PHASE 3: ERP INVENTORY & SCM ACTIONS (FR-401, FR-402, FR-403)
  // ==========================================
  const addInventoryItem = (itemData) => {
    const defaultWhId = warehouses[0]?.id || 'wh_ny';
    const initStock = Number(itemData.initialStock) || 0;
    const reorderPt = Number(itemData.reorderPoint) || 20;

    const newItem = {
      id: `inv_${Date.now()}`,
      sku: itemData.sku.toUpperCase(),
      name: itemData.name,
      category: itemData.category || 'Hardware',
      unitOfMeasure: itemData.unitOfMeasure || 'pcs',
      costPrice: Number(itemData.costPrice) || 0,
      retailPrice: Number(itemData.retailPrice) || 0,
      reorderPoint: reorderPt,
      reorderQty: Number(itemData.reorderQty) || 50,
      barcode: itemData.barcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      supplierId: itemData.supplierId || vendors[0]?.id || 'ven_1',
      warehouseStock: itemData.warehouseStock || { [defaultWhId]: initStock },
      committedStock: 0,
      leadTimeDays: Number(itemData.leadTimeDays) || 7,
      status: initStock <= reorderPt ? 'Low Stock' : 'Optimal'
    };
    setInventoryItems(prev => [newItem, ...prev]);
    addAuditLog('INVENTORY_SKU_CREATED', `Registered new master SKU ${newItem.sku} ("${newItem.name}")`);
    return newItem;
  };

  const updateInventoryItem = (id, updates) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        const total = Object.values(updated.warehouseStock || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);
        updated.status = total === 0 ? 'Critical' : total <= updated.reorderPoint ? 'Low Stock' : 'Optimal';
        return updated;
      }
      return item;
    }));
    addAuditLog('INVENTORY_SKU_UPDATED', `Updated product master specifications for SKU ID: ${id}`);
  };

  const adjustStock = (itemId, warehouseId, deltaQty, reason) => {
    const item = inventoryItems.find(i => i.id === itemId);
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!item) return;

    const numDelta = Number(deltaQty) || 0;
    const currentWhQty = item.warehouseStock?.[warehouseId] || 0;
    const newWhQty = Math.max(0, currentWhQty + numDelta);

    setInventoryItems(prev => prev.map(i => {
      if (i.id === itemId) {
        const newStockMap = { ...i.warehouseStock, [warehouseId]: newWhQty };
        const total = Object.values(newStockMap).reduce((sum, q) => sum + (Number(q) || 0), 0);
        const status = total === 0 ? 'Critical' : total <= i.reorderPoint ? 'Low Stock' : 'Optimal';
        return { ...i, warehouseStock: newStockMap, status };
      }
      return i;
    }));

    const newMovement = {
      id: `mov_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'Manual Stock Adjustment',
      sku: item.sku,
      productName: item.name,
      qty: numDelta >= 0 ? `+${numDelta}` : `${numDelta}`,
      warehouseName: wh ? wh.name : warehouseId,
      reference: `ADJ-${Date.now().toString().slice(-4)}`,
      actor: `${currentUser.name} (${currentUser.role})`,
      notes: reason || 'Audit / Inventory Count Adjustment'
    };
    setStockMovements(prev => [newMovement, ...prev]);

    addAuditLog(
      'STOCK_ADJUSTMENT',
      `Adjusted ${item.sku} in ${wh?.name || warehouseId} by ${numDelta >= 0 ? '+' : ''}${numDelta} units. Reason: ${reason || 'Manual Correction'}`
    );
  };

  const transferStock = (itemId, fromWarehouseId, toWarehouseId, transferQty) => {
    const item = inventoryItems.find(i => i.id === itemId);
    const fromWh = warehouses.find(w => w.id === fromWarehouseId);
    const toWh = warehouses.find(w => w.id === toWarehouseId);
    const qty = Math.max(1, Number(transferQty) || 1);

    if (!item) return { success: false, message: 'Item not found' };
    const fromQty = item.warehouseStock?.[fromWarehouseId] || 0;
    if (fromQty < qty) {
      return { success: false, message: `Insufficient stock in ${fromWh?.name}. Available: ${fromQty}` };
    }

    setInventoryItems(prev => prev.map(i => {
      if (i.id === itemId) {
        const newStockMap = {
          ...i.warehouseStock,
          [fromWarehouseId]: fromQty - qty,
          [toWarehouseId]: (i.warehouseStock?.[toWarehouseId] || 0) + qty
        };
        const total = Object.values(newStockMap).reduce((sum, q) => sum + (Number(q) || 0), 0);
        const status = total === 0 ? 'Critical' : total <= i.reorderPoint ? 'Low Stock' : 'Optimal';
        return { ...i, warehouseStock: newStockMap, status };
      }
      return i;
    }));

    const newMovement = {
      id: `mov_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'Inter-Warehouse Transfer',
      sku: item.sku,
      productName: item.name,
      qty: `-${qty} / +${qty}`,
      warehouseName: `${fromWh?.code || fromWarehouseId} → ${toWh?.code || toWarehouseId}`,
      reference: `TRF-${Date.now().toString().slice(-4)}`,
      actor: `${currentUser.name} (${currentUser.role})`,
      notes: `Transferred ${qty} units from ${fromWh?.name} to ${toWh?.name}`
    };
    setStockMovements(prev => [newMovement, ...prev]);

    addAuditLog(
      'STOCK_TRANSFER',
      `Transferred ${qty} units of ${item.sku} from ${fromWh?.name} to ${toWh?.name}`
    );
    return { success: true };
  };

  const createPurchaseOrder = (poData) => {
    const vendor = vendors.find(v => v.id === poData.vendorId) || vendors[0];
    const destinationWh = warehouses.find(w => w.id === poData.destinationWarehouseId) || warehouses[0];
    const poNum = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const subtotal = (poData.items || []).reduce((acc, it) => acc + (Number(it.qty) * Number(it.unitCost)), 0);
    const tax = subtotal * (currentOrg.taxRate / 100);
    const total = subtotal + tax;

    const requiresApproval = total >= 5000 || currentUser.role === 'Staff';
    const initialStatus = requiresApproval ? 'Pending Approval' : 'Issued';

    const newPo = {
      id: `po_${Date.now()}`,
      poNumber: poNum,
      vendorId: vendor.id,
      vendorName: vendor.name,
      destinationWarehouseId: destinationWh.id,
      destinationWarehouseName: destinationWh.name,
      createdAt: new Date().toISOString().split('T')[0],
      expectedDate: poData.expectedDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: initialStatus,
      items: poData.items || [],
      subtotal,
      tax,
      total,
      paymentTerms: vendor.paymentTerms || 'Net 30',
      notes: poData.notes || 'Procurement order generated from BMS ERP.'
    };

    setPurchaseOrders(prev => [newPo, ...prev]);

    if (requiresApproval) {
      const approvalCard = {
        id: `appr_po_${Date.now()}`,
        type: 'Purchase Order',
        title: `${poNum}: ${vendor.name} ($${total.toLocaleString(undefined, { minimumFractionDigits: 2 })})`,
        requester: `${currentUser.name} (${currentUser.role})`,
        department: 'Procurement & Supply Chain',
        amount: `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        priority: total > 20000 ? 'High' : 'Medium'
      };
      setApprovals(prev => [approvalCard, ...prev]);
    }

    addAuditLog(
      'PURCHASE_ORDER_CREATED',
      `Generated ${poNum} for ${vendor.name} totaling $${total.toFixed(2)} (${initialStatus})`
    );
    return newPo;
  };

  const receiveGoods = (poId) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po || po.status === 'Received') return false;

    const grnNumber = `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const receivedTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setPurchaseOrders(prev => prev.map(p => {
      if (p.id === poId) {
        return {
          ...p,
          status: 'Received',
          grnNumber,
          receivedAt: receivedTimestamp
        };
      }
      return p;
    }));

    setInventoryItems(prev => prev.map(item => {
      const poItem = po.items.find(pi => pi.sku === item.sku);
      if (poItem) {
        const currentWhStock = item.warehouseStock?.[po.destinationWarehouseId] || 0;
        const newStockMap = {
          ...item.warehouseStock,
          [po.destinationWarehouseId]: currentWhStock + Number(poItem.qty)
        };
        const total = Object.values(newStockMap).reduce((sum, q) => sum + (Number(q) || 0), 0);
        const status = total === 0 ? 'Critical' : total <= item.reorderPoint ? 'Low Stock' : 'Optimal';
        return {
          ...item,
          warehouseStock: newStockMap,
          status
        };
      }
      return item;
    }));

    const newMovements = po.items.map((pi, idx) => ({
      id: `mov_${Date.now()}_${idx}`,
      timestamp: receivedTimestamp,
      type: 'Goods Received (GRN)',
      sku: pi.sku,
      productName: pi.name,
      qty: `+${pi.qty}`,
      warehouseName: po.destinationWarehouseName,
      reference: grnNumber,
      actor: `${currentUser.name} (${currentUser.role})`,
      notes: `Received against ${po.poNumber} from ${po.vendorName}`
    }));

    setStockMovements(prev => [...newMovements, ...prev]);

    addAuditLog(
      'GOODS_RECEIVED_NOTE',
      `Processed ${grnNumber} for ${po.poNumber}. Absorbed ${po.items.length} line item(s) into ${po.destinationWarehouseName}`
    );
    return grnNumber;
  };

  const addVendor = (vendorData) => {
    const newVen = {
      id: `ven_${Date.now()}`,
      name: vendorData.name,
      code: vendorData.code || `VEND-${Date.now().toString().slice(-4)}`,
      category: vendorData.category || 'General Supplier',
      country: vendorData.country || 'United States',
      contactPerson: vendorData.contactPerson || 'Vendor Lead',
      email: vendorData.email || 'orders@vendor.com',
      phone: vendorData.phone || '+1 555-0100',
      paymentTerms: vendorData.paymentTerms || 'Net 30',
      rating: 5.0,
      activeOrdersCount: 0,
      status: 'Approved'
    };
    setVendors(prev => [newVen, ...prev]);
    addAuditLog('VENDOR_REGISTERED', `Added approved vendor supplier: ${newVen.name} (${newVen.code})`);
    return newVen;
  };

  // ==========================================
  // REAL-TIME EXECUTIVE TELEMETRY SYNTHESIS
  // POS orders and inventory reflect live in Cockpit KPIs
  // ==========================================
  const posSalesTotal = posOrders.reduce((sum, order) => {
    if (order.status === 'Voided' || order.status === 'Refunded') return sum;
    if (order.status === 'Partially Refunded') {
      return sum + Math.max(0, Number(order.total) - (Number(order.refundedAmount) || 0));
    }
    return sum + (Number(order.total) || 0);
  }, 0);

  const posSalesSubtotal = posOrders.reduce((sum, order) => {
    if (order.status === 'Voided' || order.status === 'Refunded') return sum;
    if (order.status === 'Partially Refunded') {
      const netRatio = 1 / (1 + (currentOrg.taxRate / 100));
      const net = Math.max(0, Number(order.total) - (Number(order.refundedAmount) || 0));
      return sum + (net * netRatio);
    }
    return sum + (Number(order.subtotal) || 0);
  }, 0);
  const posSalesTax = posOrders.reduce((sum, order) => sum + (Number(order.tax) || 0), 0);

  // Dynamic gross revenue = baseline revenue + real-time POS receipts
  const dynamicRevenueValue = INITIAL_KPIS.revenue.value + posSalesTotal;

  // Dynamic net operating profit = baseline net profit + estimated 38% gross margin on POS sales
  const dynamicNetProfitValue = INITIAL_KPIS.netProfit.value + Math.round(posSalesSubtotal * 0.38);

  // Dynamic liquidity = baseline cash on hand + collected POS receipts
  const dynamicCashOnHand = INITIAL_KPIS.cashflow.cashOnHand + posSalesTotal;

  // Real-time inventory alerts derived from current POS catalog stock
  const dynamicLowStockCount = posCatalog.filter(p => p.stock < 15).length;
  const dynamicCriticalCount = posCatalog.filter(p => p.stock < 5).length;

  // Phase 3 ERP inventory valuation & low-stock telemetry across all warehouses
  const totalInventoryValuation = inventoryItems.reduce((acc, item) => {
    const totalItemQty = Object.values(item.warehouseStock || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);
    return acc + (item.costPrice * totalItemQty);
  }, 0);

  const totalInventoryRetailValue = inventoryItems.reduce((acc, item) => {
    const totalItemQty = Object.values(item.warehouseStock || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);
    return acc + (item.retailPrice * totalItemQty);
  }, 0);

  const erpLowStockCount = inventoryItems.filter(item => {
    const totalItemQty = Object.values(item.warehouseStock || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);
    return totalItemQty <= item.reorderPoint;
  }).length;

  const dynamicKpis = {
    ...INITIAL_KPIS,
    revenue: {
      ...INITIAL_KPIS.revenue,
      value: dynamicRevenueValue,
      posContribution: posSalesTotal,
      posOrdersCount: posOrders.length,
      baseline: INITIAL_KPIS.revenue.value
    },
    netProfit: {
      ...INITIAL_KPIS.netProfit,
      value: dynamicNetProfitValue,
    },
    cashflow: {
      ...INITIAL_KPIS.cashflow,
      cashOnHand: dynamicCashOnHand,
      posCashCollected: posSalesTotal
    },
    inventoryAlerts: {
      ...INITIAL_KPIS.inventoryAlerts,
      lowStockCount: dynamicLowStockCount,
      criticalCount: dynamicCriticalCount,
      totalSKUs: posCatalog.length,
      erpSKUs: inventoryItems.length,
      erpValuation: totalInventoryValuation,
      erpRetailValue: totalInventoryRetailValue,
      erpLowStockCount: erpLowStockCount
    }
  };

  const userPermissions = ROLE_PERMISSIONS[currentUser.role] || ROLE_PERMISSIONS.Staff;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        currentOrg,
        setCurrentOrg,
        selectedBranch,
        setSelectedBranch,
        approvals,
        handleApprovalAction,
        auditLogs,
        addAuditLog,
        userPermissions,
        isDark,
        setIsDark,
        activeTab,
        setActiveTab,
        navigateToTab,
        commandOpen,
        setCommandOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        kpis: dynamicKpis,
        allUsers: INITIAL_USERS,
        // Phase 2 exports
        customers,
        addCustomer,
        updateCustomer,
        deals,
        addDeal,
        updateDealStage,
        quotations,
        createQuotation,
        pipelineStages: PIPELINE_STAGES,
        // Phase 3 exports: ERP Inventory, Warehouse & Procurement (FR-401, FR-402, FR-403)
        warehouses,
        inventoryItems,
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
        // Standalone Terminal & Path Navigation
        currentPath,
        navigateToPath,
        // POS Catalog & Items
        posCatalog,
        updatePosItem,
        addPosItem,
        deletePosItem,
        posCart,
        addToCart,
        updateCartQty,
        clearCart,
        completeCheckout,
        posOrders,
        posSalesTotal,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
