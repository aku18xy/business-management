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
  PIPELINE_STAGES
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

  // Theme mode & active navigation tab
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [commandOpen, setCommandOpen] = useState(false);

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

  const completeCheckout = (paymentMethod) => {
    if (posCart.length === 0) return null;

    const subtotal = posCart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = subtotal * (currentOrg.taxRate / 100);
    const total = subtotal + tax;

    const orderNumber = `POS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      cashier: currentUser.name,
      date: "Just now",
      items: posCart.map(item => ({ name: item.name, qty: item.qty, price: item.price })),
      subtotal,
      tax,
      total,
      paymentMethod,
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
      `Processed checkout ${orderNumber} for $${total.toFixed(2)} via ${paymentMethod}`
    );

    return newOrder;
  };

  // ==========================================
  // REAL-TIME EXECUTIVE TELEMETRY SYNTHESIS
  // POS orders and inventory reflect live in Cockpit KPIs
  // ==========================================
  const posSalesTotal = posOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const posSalesSubtotal = posOrders.reduce((sum, order) => sum + (Number(order.subtotal) || 0), 0);
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
      totalSKUs: posCatalog.length
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
        commandOpen,
        setCommandOpen,
        kpis: dynamicKpis,
        allUsers: INITIAL_USERS,
        // Phase 2 exports
        customers,
        addCustomer,
        deals,
        addDeal,
        updateDealStage,
        quotations,
        createQuotation,
        pipelineStages: PIPELINE_STAGES,
        posCatalog,
        posCart,
        addToCart,
        updateCartQty,
        clearCart,
        completeCheckout,
        posOrders,
        posSalesTotal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
