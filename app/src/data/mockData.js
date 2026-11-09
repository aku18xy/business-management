// Initial mock data & local storage models for NexusBMS

export const INITIAL_ORGS = [
  {
    id: "org_default",
    name: "Nexus Global Holdings",
    code: "NXG-HQ",
    currency: "USD",
    timezone: "America/New_York",
    branches: [
      { id: "br_ny", name: "New York HQ", code: "NY-01", isHeadquarters: true },
      { id: "br_ldn", name: "London Regional Hub", code: "LDN-01", isHeadquarters: false },
      { id: "br_sg", name: "Singapore APAC Office", code: "SG-01", isHeadquarters: false }
    ],
    fiscalYearStart: "January",
    taxRate: 8.5
  }
];

export const INITIAL_USERS = [
  {
    id: "usr_admin",
    name: "Alex Sterling",
    email: "alex@nexusbms.io",
    role: "Admin",
    title: "Chief Executive Officer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    branchId: "br_ny",
    status: "Active"
  },
  {
    id: "usr_finance",
    name: "Elena Rostova",
    email: "elena@nexusbms.io",
    role: "Manager",
    title: "Finance & Accounts Lead",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    branchId: "br_ny",
    status: "Active"
  },
  {
    id: "usr_sales",
    name: "Marcus Vance",
    email: "marcus@nexusbms.io",
    role: "Staff",
    title: "Enterprise Account Exec",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    branchId: "br_ldn",
    status: "Active"
  },
  {
    id: "usr_auditor",
    name: "Clara Chen",
    email: "clara.audit@kpmg-partner.io",
    role: "Auditor",
    title: "External Financial Auditor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    branchId: "br_sg",
    status: "Active"
  }
];

export const ROLE_PERMISSIONS = {
  Admin: {
    canViewDashboard: true,
    canManageDeals: true,
    canManageCatalog: true,
    canOperatePos: true,
    canManageInventory: true,
    canManageFinance: true,
    canApproveTransactions: true,
    canExportReports: true,
    canViewAuditLogs: true,
    canManageOrg: true,
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    description: "Enterprise Chief Administrator: full governance, financial approvals, settings & audit inspection."
  },
  Manager: {
    canViewDashboard: true,
    canManageDeals: true,
    canManageCatalog: true,
    canOperatePos: true,
    canManageInventory: true,
    canManageFinance: true,
    canApproveTransactions: true,
    canExportReports: true,
    canViewAuditLogs: true,
    canManageOrg: false,
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    description: "Operations Lead & Finance Lead: CRM deals, ERP warehouse stock, AR/AP billing, and transaction approvals."
  },
  Staff: {
    canViewDashboard: true,
    canManageDeals: true,
    canManageCatalog: false,
    canOperatePos: true,
    canManageInventory: false,
    canManageFinance: false,
    canApproveTransactions: false,
    canExportReports: false,
    canViewAuditLogs: false,
    canManageOrg: false,
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    description: "Field Associate: CRM sales activity, countertop POS kiosk trade & stock count requisition."
  },
  Auditor: {
    canViewDashboard: true,
    canManageDeals: false,
    canManageCatalog: false,
    canOperatePos: false,
    canManageInventory: false,
    canManageFinance: false,
    canApproveTransactions: false,
    canExportReports: true,
    canViewAuditLogs: true,
    canManageOrg: false,
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    description: "External Compliance Auditor: read-only forensic inspection, audit log verification & compliance exports."
  }
};

export const RBAC_MODULE_MATRIX = [
  { module: "Executive Cockpit & BI", capability: "View revenue, margin & cashflow telemetry", admin: "Full Access", manager: "Full Access", staff: "Standard KPIs", auditor: "Read-Only" },
  { module: "CRM & Sales Deals", capability: "Manage pipeline stages, quotations & client profiles", admin: "Read / Write", manager: "Read / Write", staff: "Read / Write", auditor: "Read-Only" },
  { module: "ERP Inventory & SCM (Phase 3)", capability: "Stock adjustments, warehouse transfers, PO approvals, GRN intake", admin: "Full Control", manager: "Full Control", staff: "Read / Requisition", auditor: "Read-Only" },
  { module: "Finance & General Ledger (Phase 4)", capability: "AR Invoicing, AP Bill Payment, Journal Entries, P&L / Balance Sheet", admin: "Full Control", manager: "Full Control", staff: "Restricted", auditor: "Forensic Audit & Export" },
  { module: "POS Retail Terminal", capability: "Open shift float, ring sales, barcode scan, tender", admin: "Allowed", manager: "Allowed", staff: "Allowed", auditor: "Restricted" },
  { module: "POS Item Catalog Admin", capability: "Create products, modify prices, delete SKUs", admin: "Full Control", manager: "Full Control", staff: "Restricted", auditor: "Restricted" },
  { module: "Executive Action Inbox", capability: "Approve/Reject Purchase Orders & Expense Claims", admin: "Authorized", manager: "Authorized", staff: "Submit Only", auditor: "Restricted" },
  { module: "Forensic Audit Trail", capability: "View tamper-evident mutation logs & export JSON", admin: "Inspect & Export", manager: "Inspect Only", staff: "Restricted", auditor: "Full Forensic" },
  { module: "Organization & Multi-Branch", capability: "Configure branches, corporate tax, base currency", admin: "Full Governance", manager: "Restricted", staff: "Restricted", auditor: "Restricted" }
];

export const INITIAL_KPIS = {
  revenue: {
    value: 284500,
    change: "+14.8%",
    trend: "up",
    period: "vs last month",
    target: 300000
  },
  expenses: {
    value: 142100,
    change: "-2.4%",
    trend: "down",
    period: "vs last month",
    budget: 160000
  },
  netProfit: {
    value: 142400,
    margin: "50.05%",
    change: "+31.2%",
    trend: "up"
  },
  cashflow: {
    cashOnHand: 540200,
    receivables: 68400,
    payables: 31200,
    runwayMonths: 18
  },
  activeDeals: {
    count: 24,
    totalValue: 489000,
    weightedPipeline: 315000
  },
  inventoryAlerts: {
    lowStockCount: 5,
    criticalCount: 2,
    totalSKUs: 348
  }
};

export const INITIAL_APPROVALS = [
  {
    id: "appr_101",
    type: "Purchase Order",
    title: "Server Cluster Expansion (AWS Reserved Instances)",
    requester: "DevOps Team",
    amount: "$18,500.00",
    department: "Engineering",
    status: "Pending",
    date: "Today, 10:45 AM",
    priority: "High"
  },
  {
    id: "appr_102",
    type: "Expense Claim",
    title: "Client Summit Dinner & Accommodation",
    requester: "Marcus Vance",
    amount: "$1,240.50",
    department: "Sales",
    status: "Pending",
    date: "Yesterday",
    priority: "Medium"
  },
  {
    id: "appr_103",
    type: "Leave Request",
    title: "Annual Leave (5 working days)",
    requester: "Elena Rostova",
    amount: "5 Days",
    department: "Finance",
    status: "Pending",
    date: "Nov 06, 2026",
    priority: "Low"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "log_991",
    actor: "Alex Sterling (Admin)",
    action: "ORGANIZATION_SETTINGS_UPDATED",
    details: "Adjusted fiscal year closing forecast target to $3.5M",
    timestamp: "2026-11-08 13:20:14",
    ipAddress: "192.168.1.104"
  },
  {
    id: "log_990",
    actor: "Elena Rostova (Manager)",
    action: "TRANSACTION_BATCH_APPROVED",
    details: "Approved Batch #NX-4402 (12 Vendor Payouts, total $42,100)",
    timestamp: "2026-11-08 11:45:00",
    ipAddress: "192.168.1.112"
  },
  {
    id: "log_989",
    actor: "Clara Chen (Auditor)",
    action: "EXPORT_BALANCE_SHEET",
    details: "Generated Q3 Consolidated Financial Statement (PDF/CSV)",
    timestamp: "2026-11-07 16:30:22",
    ipAddress: "10.0.4.15"
  },
  {
    id: "log_988",
    actor: "System Auth Service",
    action: "USER_LOGIN_SUCCESS",
    details: "Authenticated Alex Sterling via Role-Based Access Control",
    timestamp: "2026-11-07 09:00:01",
    ipAddress: "192.168.1.104"
  }
];

export const REVENUE_CHART_DATA = [
  { month: "May", revenue: 198000, expenses: 110000, profit: 88000 },
  { month: "Jun", revenue: 215000, expenses: 118000, profit: 97000 },
  { month: "Jul", revenue: 228000, expenses: 124000, profit: 104000 },
  { month: "Aug", revenue: 245000, expenses: 131000, profit: 114000 },
  { month: "Sep", revenue: 262000, expenses: 138000, profit: 124000 },
  { month: "Oct", revenue: 284500, expenses: 142100, profit: 142400 }
];

// ============================================================================
// PHASE 2: CRM & SALES PIPELINE (MOD-03)
// ============================================================================

export const PIPELINE_STAGES = [
  { id: "lead", title: "New Leads", color: "border-sky-500/40 text-sky-400 bg-sky-500/10", probability: 0.2 },
  { id: "qualified", title: "Qualified & Discovery", color: "border-indigo-500/40 text-indigo-400 bg-indigo-500/10", probability: 0.4 },
  { id: "proposal", title: "Proposal / Quotation Sent", color: "border-purple-500/40 text-purple-400 bg-purple-500/10", probability: 0.7 },
  { id: "negotiation", title: "Contract Negotiation", color: "border-amber-500/40 text-amber-400 bg-amber-500/10", probability: 0.85 },
  { id: "won", title: "Closed Won", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10", probability: 1.0 },
  { id: "lost", title: "Closed Lost", color: "border-rose-500/40 text-rose-400 bg-rose-500/10", probability: 0.0 }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "cust_101",
    name: "Apex Global Technologies",
    contactPerson: "David Miller",
    email: "dmiller@apextech.com",
    phone: "+1 (555) 349-1029",
    industry: "Enterprise SaaS",
    creditLimit: 50000,
    outstandingBalance: 4200,
    status: "Active",
    tags: ["High Value", "Multi-Branch"]
  },
  {
    id: "cust_102",
    name: "Metro Logistics Express",
    contactPerson: "Jessica Tan",
    email: "jtan@metrologistics.com",
    phone: "+1 (555) 781-9920",
    industry: "Transportation & Freight",
    creditLimit: 75000,
    outstandingBalance: 12500,
    status: "Active",
    tags: ["Fleet", "Priority SLA"]
  },
  {
    id: "cust_103",
    name: "Horizon Retail Systems",
    contactPerson: "Brian Gallagher",
    email: "bg@horizonstores.io",
    phone: "+1 (555) 412-8801",
    industry: "Omnichannel Retail",
    creditLimit: 30000,
    outstandingBalance: 0,
    status: "Active",
    tags: ["Retail Chain", "POS Expansion"]
  },
  {
    id: "cust_104",
    name: "Vertex Medical Solutions",
    contactPerson: "Dr. Alistair Ross",
    email: "aross@vertexmed.org",
    phone: "+1 (555) 902-1144",
    industry: "Healthcare",
    creditLimit: 100000,
    outstandingBalance: 0,
    status: "Lead",
    tags: ["Healthcare", "HIPAA Compliant"]
  }
];

export const INITIAL_DEALS = [
  {
    id: "deal_1",
    title: "Enterprise Fleet Telematics Rollout",
    customerId: "cust_102",
    customerName: "Metro Logistics Express",
    value: 64000,
    stage: "proposal",
    owner: "Marcus Vance",
    expectedClose: "2026-11-25",
    priority: "High",
    notes: "Requires integration with existing ERP dispatch API."
  },
  {
    id: "deal_2",
    title: "15-Store POS Hardware Upgrade",
    customerId: "cust_103",
    customerName: "Horizon Retail Systems",
    value: 38500,
    stage: "negotiation",
    owner: "Marcus Vance",
    expectedClose: "2026-11-18",
    priority: "High",
    notes: "Hardware bundle with dual-screen terminal and thermal printers."
  },
  {
    id: "deal_3",
    title: "APAC Cloud Infrastructure Expansion",
    customerId: "cust_101",
    customerName: "Apex Global Technologies",
    value: 82000,
    stage: "qualified",
    owner: "Alex Sterling",
    expectedClose: "2026-12-10",
    priority: "Medium",
    notes: "Multi-tenant database scaling in Singapore datacenter."
  },
  {
    id: "deal_4",
    title: "Clinic ERP Management Suite",
    customerId: "cust_104",
    customerName: "Vertex Medical Solutions",
    value: 45000,
    stage: "lead",
    owner: "Marcus Vance",
    expectedClose: "2026-12-20",
    priority: "Medium",
    notes: "Lead received via web inquiry; discovery call scheduled."
  },
  {
    id: "deal_5",
    title: "Global Supply Chain Audit Module",
    customerId: "cust_101",
    customerName: "Apex Global Technologies",
    value: 29500,
    stage: "won",
    owner: "Elena Rostova",
    expectedClose: "2026-11-02",
    priority: "High",
    notes: "Contract signed, 50% deposit received."
  }
];

export const INITIAL_QUOTATIONS = [
  {
    id: "QT-2026-081",
    dealId: "deal_2",
    customerId: "cust_103",
    customerName: "Horizon Retail Systems",
    date: "2026-11-05",
    validUntil: "2026-11-30",
    status: "Sent",
    items: [
      { description: "Industrial Barcode Scanner Pro", qty: 15, unitPrice: 240, total: 3600 },
      { description: "Enterprise POS Terminal Station 15.6-inch", qty: 15, unitPrice: 899, total: 13485 },
      { description: "Thermal POS Receipt Printer", qty: 15, unitPrice: 195, total: 2925 },
      { description: "On-site Configuration & Staff Training", qty: 1, unitPrice: 4500, total: 4500 }
    ],
    subtotal: 24510,
    discount: 1000,
    tax: 1998.35,
    total: 25508.35
  }
];

// ============================================================================
// PHASE 2: POINT OF SALE (POS) & RETAIL CATALOG (MOD-08)
// ============================================================================

export const POS_CATALOG = [
  {
    id: "pos_prod_1",
    sku: "SKU-8801",
    name: "Industrial Barcode Scanner Pro",
    category: "Hardware",
    price: 240.00,
    cost: 110.00,
    stock: 142,
    barcode: "880199201928",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_2",
    sku: "SKU-8824",
    name: "Thermal POS Receipt Printer",
    category: "Hardware",
    price: 195.00,
    cost: 85.00,
    stock: 6,
    barcode: "882400192831",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_3",
    sku: "SKU-4105",
    name: "Enterprise POS Terminal Station 15.6-inch",
    category: "Hardware",
    price: 899.00,
    cost: 450.00,
    stock: 18,
    barcode: "410582910283",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_4",
    sku: "SKU-3301",
    name: "Thermal Paper Roll 80mm (Box of 50)",
    category: "Consumables",
    price: 55.00,
    cost: 22.00,
    stock: 85,
    barcode: "330198421092",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_5",
    sku: "SKU-9012",
    name: "RFID Heavy-Duty Smart Tags (500pk)",
    category: "Consumables",
    price: 89.00,
    cost: 40.00,
    stock: 34,
    barcode: "901284920194",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_6",
    sku: "SKU-7719",
    name: "NexusBMS Cloud Multi-Branch License",
    category: "Software",
    price: 1200.00,
    cost: 0.00,
    stock: 999,
    barcode: "771900192834",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_POS_ORDERS = [
  {
    id: "ORD-9901",
    orderNumber: "POS-2026-9901",
    cashier: "Alex Sterling",
    date: "Today, 14:15",
    items: [
      { name: "Industrial Barcode Scanner Pro", qty: 2, price: 240.00 },
      { name: "Thermal Paper Roll 80mm", qty: 1, price: 55.00 }
    ],
    subtotal: 535.00,
    tax: 45.48,
    total: 580.48,
    paymentMethod: "Credit Card (Visa)",
    status: "Completed"
  },
  {
    id: "ORD-9900",
    orderNumber: "POS-2026-9900",
    cashier: "Marcus Vance",
    date: "Today, 11:30",
    items: [
      { name: "Thermal POS Receipt Printer", qty: 1, price: 195.00 }
    ],
    subtotal: 195.00,
    tax: 16.58,
    total: 211.58,
    paymentMethod: "Cash Drawer",
    status: "Completed"
  }
];

// ============================================================================
// PHASE 2: POS SHIFT FLOAT & DRAWER RECONCILIATION (FR-802)
// ============================================================================

export const INITIAL_ACTIVE_SHIFT = {
  id: "SHIFT-2026-1108",
  registerId: "REG-01-FLAGSHIP",
  cashier: "Alex Sterling",
  openedAt: "Today, 08:30 AM",
  openedAtTimestamp: Date.now() - 5 * 3600 * 1000,
  openingFloat: 250.00,
  status: "Open",
  isOpen: true,
  notes: "Morning shift opening float verified ($200 in bills, $50 in rolled coins).",
  cashDrops: [
    {
      id: "drop_101",
      amount: 150.00,
      reason: "Midday Cash Drop to Vault Safe (Excess float protection)",
      time: "Today, 13:00",
      authorizer: "Elena Rostova (Finance)"
    }
  ]
};

export const INITIAL_SHIFT_HISTORY = [
  {
    id: "SHIFT-2026-1107",
    registerId: "REG-01-FLAGSHIP",
    cashier: "Marcus Vance",
    openedAt: "Yesterday, 08:30 AM",
    closedAt: "Yesterday, 17:30 PM",
    openingFloat: 250.00,
    cashSales: 840.50,
    cashDropsTotal: 400.00,
    expectedCash: 690.50,
    closingCountedCash: 690.50,
    variance: 0.00,
    status: "Balanced",
    notes: "Evening shift closed with zero drawer variance. All cash slips accounted for."
  },
  {
    id: "SHIFT-2026-1106",
    registerId: "REG-01-FLAGSHIP",
    cashier: "Clara Chen",
    openedAt: "Nov 06, 08:30 AM",
    closedAt: "Nov 06, 17:30 PM",
    openingFloat: 200.00,
    cashSales: 620.00,
    cashDropsTotal: 200.00,
    expectedCash: 620.00,
    closingCountedCash: 615.00,
    variance: -5.00,
    status: "Shortage",
    notes: "$5.00 coin change shortage reported and approved by Store Manager."
  }
];

// ============================================================================
// PHASE 3: ERP INVENTORY, WAREHOUSE & PROCUREMENT (FR-401, FR-402, FR-403)
// ============================================================================

export const INITIAL_WAREHOUSES = [
  {
    id: "wh_ny",
    name: "New York Global Logistics Hub",
    code: "WH-NY-01",
    location: "Long Island City, NY",
    capacitySqFt: 55000,
    manager: "Marcus Vance",
    branchId: "br_ny",
    status: "Active",
    isPrimary: true
  },
  {
    id: "wh_ldn",
    name: "London Distribution Center",
    code: "WH-LDN-01",
    location: "Heathrow Cargo Terminal, London",
    capacitySqFt: 35000,
    manager: "Sophie Taylor",
    branchId: "br_ldn",
    status: "Active",
    isPrimary: false
  },
  {
    id: "wh_sg",
    name: "Singapore Asia-Pacific Depo",
    code: "WH-SG-01",
    location: "Jurong Logistics Park, Singapore",
    capacitySqFt: 25000,
    manager: "Kenji Sato",
    branchId: "br_sg",
    status: "Active",
    isPrimary: false
  }
];

export const INITIAL_INVENTORY_ITEMS = [
  {
    id: "inv_1",
    sku: "SKU-HW-101",
    name: "Nexus Smart POS Touch Terminal Kiosk",
    category: "Hardware",
    unitOfMeasure: "pcs",
    costPrice: 480.00,
    retailPrice: 899.99,
    reorderPoint: 30,
    reorderQty: 50,
    barcode: "847291002341",
    supplierId: "ven_1",
    warehouseStock: {
      wh_ny: 45,
      wh_ldn: 25,
      wh_sg: 15
    },
    committedStock: 12,
    leadTimeDays: 14,
    status: "Optimal"
  },
  {
    id: "inv_2",
    sku: "SKU-HW-102",
    name: "Industrial 2D Barcode Scanner USB-C",
    category: "Hardware",
    unitOfMeasure: "pcs",
    costPrice: 45.00,
    retailPrice: 119.50,
    reorderPoint: 40,
    reorderQty: 80,
    barcode: "771900192834",
    supplierId: "ven_1",
    warehouseStock: {
      wh_ny: 75,
      wh_ldn: 40,
      wh_sg: 25
    },
    committedStock: 8,
    leadTimeDays: 10,
    status: "Optimal"
  },
  {
    id: "inv_3",
    sku: "SKU-HW-103",
    name: "Thermal Receipt Printer 80mm ESC/POS",
    category: "Hardware",
    unitOfMeasure: "pcs",
    costPrice: 95.00,
    retailPrice: 240.00,
    reorderPoint: 35,
    reorderQty: 40,
    barcode: "928301192831",
    supplierId: "ven_3",
    warehouseStock: {
      wh_ny: 32,
      wh_ldn: 18,
      wh_sg: 12
    },
    committedStock: 6,
    leadTimeDays: 12,
    status: "Optimal"
  },
  {
    id: "inv_4",
    sku: "SKU-CS-201",
    name: "High-Grade Thermal Paper Rolls 80x80mm (Box of 50)",
    category: "Consumables",
    unitOfMeasure: "box",
    costPrice: 18.50,
    retailPrice: 49.99,
    reorderPoint: 50,
    reorderQty: 100,
    barcode: "192830192831",
    supplierId: "ven_2",
    warehouseStock: {
      wh_ny: 14,
      wh_ldn: 6,
      wh_sg: 4
    },
    committedStock: 10,
    leadTimeDays: 4,
    status: "Low Stock"
  },
  {
    id: "inv_5",
    sku: "SKU-HW-104",
    name: "Heavy-Duty Steel Cash Drawer (RJ11 Kickout)",
    category: "Hardware",
    unitOfMeasure: "pcs",
    costPrice: 42.00,
    retailPrice: 99.00,
    reorderPoint: 25,
    reorderQty: 30,
    barcode: "661820192839",
    supplierId: "ven_1",
    warehouseStock: {
      wh_ny: 28,
      wh_ldn: 12,
      wh_sg: 8
    },
    committedStock: 4,
    leadTimeDays: 14,
    status: "Optimal"
  },
  {
    id: "inv_6",
    sku: "SKU-RM-301",
    name: "ARM Cortex Quad-Core System-on-Module (OEM Component)",
    category: "Raw Materials",
    unitOfMeasure: "pcs",
    costPrice: 38.00,
    retailPrice: 85.00,
    reorderPoint: 40,
    reorderQty: 100,
    barcode: "441920192812",
    supplierId: "ven_4",
    warehouseStock: {
      wh_ny: 6,
      wh_ldn: 2,
      wh_sg: 1
    },
    committedStock: 5,
    leadTimeDays: 18,
    status: "Critical"
  },
  {
    id: "inv_7",
    sku: "SKU-CS-202",
    name: "Encrypted RFID Keycard Staff Badges (Pack of 100)",
    category: "Consumables",
    unitOfMeasure: "pack",
    costPrice: 12.00,
    retailPrice: 35.00,
    reorderPoint: 30,
    reorderQty: 50,
    barcode: "551920192855",
    supplierId: "ven_2",
    warehouseStock: {
      wh_ny: 48,
      wh_ldn: 30,
      wh_sg: 17
    },
    committedStock: 2,
    leadTimeDays: 5,
    status: "Optimal"
  },
  {
    id: "inv_8",
    sku: "SKU-HW-105",
    name: "Mobile Barcode Scanner Handheld Android Terminal",
    category: "Hardware",
    unitOfMeasure: "pcs",
    costPrice: 165.00,
    retailPrice: 349.00,
    reorderPoint: 20,
    reorderQty: 25,
    barcode: "881920192844",
    supplierId: "ven_1",
    warehouseStock: {
      wh_ny: 18,
      wh_ldn: 9,
      wh_sg: 5
    },
    committedStock: 3,
    leadTimeDays: 14,
    status: "Optimal"
  }
];

export const INITIAL_VENDORS = [
  {
    id: "ven_1",
    name: "Shenzhen Microtronics Corp",
    code: "VEND-SZ-01",
    category: "Hardware & Assembly",
    country: "China",
    contactPerson: "Zhang Wei",
    email: "procurement@microtronics.cn",
    phone: "+86 755 8329 1100",
    paymentTerms: "Net 30",
    rating: 4.8,
    activeOrdersCount: 1,
    status: "Approved"
  },
  {
    id: "ven_2",
    name: "Continental Paper & Packaging Co",
    code: "VEND-USA-02",
    category: "Consumables & POS Rolls",
    country: "United States",
    contactPerson: "Brian Campbell",
    email: "orders@continentalpaper.com",
    phone: "+1 (312) 555-8821",
    paymentTerms: "Net 15",
    rating: 4.6,
    activeOrdersCount: 1,
    status: "Approved"
  },
  {
    id: "ven_3",
    name: "Seiko Epson Components Corp",
    code: "VEND-JPN-03",
    category: "Printhead Mechanisms",
    country: "Japan",
    contactPerson: "Takashi Tanaka",
    email: "industrial@seiko-epson.jp",
    phone: "+81 3 5321 4400",
    paymentTerms: "Net 45",
    rating: 4.9,
    activeOrdersCount: 0,
    status: "Approved"
  },
  {
    id: "ven_4",
    name: "Apex Embedded Systems & Silicon",
    code: "VEND-TWN-04",
    category: "Semiconductors & SoM",
    country: "Taiwan",
    contactPerson: "Mei-Ling Hsu",
    email: "supply@apex-silicon.tw",
    phone: "+886 2 2788 9911",
    paymentTerms: "Net 30",
    rating: 4.7,
    activeOrdersCount: 0,
    status: "Approved"
  }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: "po_1001",
    poNumber: "PO-2026-1001",
    vendorId: "ven_1",
    vendorName: "Shenzhen Microtronics Corp",
    destinationWarehouseId: "wh_ny",
    destinationWarehouseName: "New York Global Logistics Hub",
    createdAt: "2026-11-05",
    expectedDate: "2026-11-16",
    status: "Issued", // Draft | Pending Approval | Issued | Received | Billed
    items: [
      {
        sku: "SKU-HW-101",
        name: "Nexus Smart POS Touch Terminal Kiosk",
        qty: 50,
        unitCost: 480.00,
        totalCost: 24000.00
      }
    ],
    subtotal: 24000.00,
    tax: 2040.00,
    total: 26040.00,
    paymentTerms: "Net 30",
    notes: "Production batch for Q4 retail expansion."
  },
  {
    id: "po_1002",
    poNumber: "PO-2026-1002",
    vendorId: "ven_2",
    vendorName: "Continental Paper & Packaging Co",
    destinationWarehouseId: "wh_ny",
    destinationWarehouseName: "New York Global Logistics Hub",
    createdAt: "2026-11-07",
    expectedDate: "2026-11-12",
    status: "Pending Approval",
    items: [
      {
        sku: "SKU-CS-201",
        name: "High-Grade Thermal Paper Rolls 80x80mm (Box of 50)",
        qty: 100,
        unitCost: 18.50,
        totalCost: 1850.00
      }
    ],
    subtotal: 1850.00,
    tax: 157.25,
    total: 2007.25,
    paymentTerms: "Net 15",
    notes: "Urgent replenishment for low stock alert at NY warehouse."
  },
  {
    id: "po_1003",
    poNumber: "PO-2026-0994",
    vendorId: "ven_3",
    vendorName: "Seiko Epson Components Corp",
    destinationWarehouseId: "wh_ny",
    destinationWarehouseName: "New York Global Logistics Hub",
    createdAt: "2026-10-24",
    expectedDate: "2026-11-02",
    status: "Received",
    grnNumber: "GRN-2026-0881",
    receivedAt: "2026-11-08 11:20",
    items: [
      {
        sku: "SKU-HW-103",
        name: "Thermal Receipt Printer 80mm ESC/POS",
        qty: 40,
        unitCost: 95.00,
        totalCost: 3800.00
      }
    ],
    subtotal: 3800.00,
    tax: 323.00,
    total: 4123.00,
    paymentTerms: "Net 45",
    notes: "Verified by Quality Inspection. Stock absorbed into NY warehouse."
  }
];

export const INITIAL_STOCK_MOVEMENTS = [
  {
    id: "mov_1",
    timestamp: "2026-11-08 11:20",
    type: "Goods Received (GRN)",
    sku: "SKU-HW-103",
    productName: "Thermal Receipt Printer 80mm ESC/POS",
    qty: "+40",
    warehouseName: "New York Global Logistics Hub",
    reference: "GRN-2026-0881",
    actor: "Alex Sterling (Admin)",
    notes: "Absorbed from PO-2026-0994"
  },
  {
    id: "mov_2",
    timestamp: "2026-11-08 14:15",
    type: "POS Countertop Sale",
    sku: "SKU-HW-102",
    productName: "Industrial 2D Barcode Scanner USB-C",
    qty: "-1",
    warehouseName: "New York Global Logistics Hub",
    reference: "POS-2026-9901",
    actor: "Alex Sterling (Admin)",
    notes: "Dispensed via Terminal REG-01"
  },
  {
    id: "mov_3",
    timestamp: "2026-11-07 09:40",
    type: "Inter-Warehouse Transfer",
    sku: "SKU-HW-101",
    productName: "Nexus Smart POS Touch Terminal Kiosk",
    qty: "-20 / +20",
    warehouseName: "NY Hub → London Center",
    reference: "TRF-2026-012",
    actor: "Marcus Vance (Staff)",
    notes: "Rebalance stock for EU rollout"
  },
  {
    id: "mov_4",
    timestamp: "2026-11-06 16:30",
    type: "Manual Stock Adjustment",
    sku: "SKU-CS-201",
    productName: "Thermal Paper Rolls 80x80mm",
    qty: "-2",
    warehouseName: "New York Global Logistics Hub",
    reference: "ADJ-2026-044",
    actor: "Elena Rostova (Manager)",
    notes: "Damaged box discarded during audit"
  }
];

// ============================================================================
// PHASE 4: FINANCE, ACCOUNTING & INVOICING (FR-501, FR-502, FR-503)
// ============================================================================

export const INITIAL_ACCOUNTS = [
  // 1000 - Assets
  { code: "1010", name: "Operating Cash & Bank (JPMorgan Chase)", category: "Asset", subType: "Current Asset", balance: 428500.00, normal: "Debit" },
  { code: "1020", name: "POS Terminal Cash Floats & Drawers", category: "Asset", subType: "Current Asset", balance: 2500.00, normal: "Debit" },
  { code: "1100", name: "Accounts Receivable (Trade Debtors)", category: "Asset", subType: "Current Asset", balance: 112550.00, normal: "Debit" },
  { code: "1200", name: "Merchandise & ERP Inventory Valuation", category: "Asset", subType: "Current Asset", balance: 48500.00, normal: "Debit" },
  { code: "1500", name: "Property, Plant & Logistics Equipment", category: "Asset", subType: "Non-Current Asset", balance: 85000.00, normal: "Debit" },

  // 2000 - Liabilities
  { code: "2010", name: "Accounts Payable (Trade Creditors)", category: "Liability", subType: "Current Liability", balance: 32897.25, normal: "Credit" },
  { code: "2020", name: "Sales Tax & VAT Collected Payable", category: "Liability", subType: "Current Liability", balance: 14210.00, normal: "Credit" },
  { code: "2100", name: "Accrued Corporate Payroll & Benefits", category: "Liability", subType: "Current Liability", balance: 24500.00, normal: "Credit" },

  // 3000 - Equity
  { code: "3010", name: "Common Paid-in Capital & Equity", category: "Equity", subType: "Equity", balance: 350000.00, normal: "Credit" },
  { code: "3020", name: "Retained Earnings (Prior Years)", category: "Equity", subType: "Equity", balance: 154442.75, normal: "Credit" },

  // 4000 - Revenue
  { code: "4010", name: "Commercial B2B Enterprise Revenue", category: "Revenue", subType: "Operating Revenue", balance: 245000.00, normal: "Credit" },
  { code: "4020", name: "Countertop POS Retail Revenue", category: "Revenue", subType: "Operating Revenue", balance: 39500.00, normal: "Credit" },
  { code: "4030", name: "Professional Consulting & Integration Services", category: "Revenue", subType: "Operating Revenue", balance: 18000.00, normal: "Credit" },

  // 5000 - Cost of Goods Sold (COGS)
  { code: "5010", name: "Cost of Goods Sold (Hardware & Assemblies)", category: "Expense", subType: "Direct Cost", balance: 74200.00, normal: "Debit" },
  { code: "5020", name: "Shipping, Freight & Customs Duties", category: "Expense", subType: "Direct Cost", balance: 6800.00, normal: "Debit" },

  // 6000 - Operating Expenses (OPEX)
  { code: "6010", name: "Employee Salaries, Wages & Commissions", category: "Expense", subType: "Operating Expense", balance: 42000.00, normal: "Debit" },
  { code: "6020", name: "Cloud Infrastructure & Software Subscriptions", category: "Expense", subType: "Operating Expense", balance: 8400.00, normal: "Debit" },
  { code: "6030", name: "Depot Facilities & Office Leases", category: "Expense", subType: "Operating Expense", balance: 14500.00, normal: "Debit" },
  { code: "6040", name: "Corporate Marketing & Client Acquisition", category: "Expense", subType: "Operating Expense", balance: 6100.00, normal: "Debit" }
];

export const INITIAL_INVOICES = [
  {
    id: "inv_rec_1",
    invoiceNumber: "INV-2026-0881",
    customerId: "cust_101",
    customerName: "Apex Global Technologies",
    customerEmail: "dmiller@apextech.com",
    issueDate: "2026-10-15",
    dueDate: "2026-11-14",
    subtotal: 44700.46,
    tax: 3799.54,
    total: 48500.00,
    paidAmount: 48500.00,
    balanceDue: 0.00,
    status: "Paid", // Paid | Partially Paid | Unpaid | Overdue
    agingBucket: "Current", // Current | 1-30 Days | 31-60 Days | 61-90 Days | 90+ Days
    items: [
      { description: "Enterprise POS Fleet License & Integration", qty: 25, unitPrice: 1500.00, total: 37500.00 },
      { description: "Hardware Peripherals Deployment Pack", qty: 25, unitPrice: 288.00, total: 7200.46 }
    ],
    notes: "Payment settled via Wire Transfer on Nov 02, 2026."
  },
  {
    id: "inv_rec_2",
    invoiceNumber: "INV-2026-0895",
    customerId: "cust_102",
    customerName: "Metro Logistics Express",
    customerEmail: "sarah.jenkins@metrologistics.com",
    issueDate: "2026-10-25",
    dueDate: "2026-11-24",
    subtotal: 29861.75,
    tax: 2538.25,
    total: 32400.00,
    paidAmount: 15000.00,
    balanceDue: 17400.00,
    status: "Partially Paid",
    agingBucket: "Current",
    items: [
      { description: "Warehouse Dispatch Scanner Terminals", qty: 60, unitPrice: 380.00, total: 22800.00 },
      { description: "Barcode System Custom Setup & API Hook", qty: 1, unitPrice: 7061.75, total: 7061.75 }
    ],
    notes: "50% deposit received. Remaining balance net 30."
  },
  {
    id: "inv_rec_3",
    invoiceNumber: "INV-2026-0812",
    customerId: "cust_103",
    customerName: "Horizon Retail Systems",
    customerEmail: "r.sterling@horizonretail.com",
    issueDate: "2026-09-10",
    dueDate: "2026-10-10",
    subtotal: 17419.35,
    tax: 1480.65,
    total: 18900.00,
    paidAmount: 0.00,
    balanceDue: 18900.00,
    status: "Overdue",
    agingBucket: "31-60 Days",
    items: [
      { description: "Retail Point-of-Sale Hardware Bundle", qty: 15, unitPrice: 1161.29, total: 17419.35 }
    ],
    notes: "First automated reminder sent on Oct 15; follow-up call pending."
  },
  {
    id: "inv_rec_4",
    invoiceNumber: "INV-2026-0902",
    customerId: "cust_104",
    customerName: "Pacific Rim Import Corp",
    customerEmail: "kenji.s@pacificrim.sg",
    issueDate: "2026-11-02",
    dueDate: "2026-12-02",
    subtotal: 11751.15,
    tax: 998.85,
    total: 12750.00,
    paidAmount: 0.00,
    balanceDue: 12750.00,
    status: "Unpaid",
    agingBucket: "Current",
    items: [
      { description: "Annual BMS Multi-Branch Cloud Subscription", qty: 1, unitPrice: 11751.15, total: 11751.15 }
    ],
    notes: "Net 30 commercial terms granted."
  }
];

export const INITIAL_VENDOR_BILLS = [
  {
    id: "bill_1",
    billNumber: "BILL-2026-441",
    vendorId: "ven_1",
    vendorName: "Shenzhen Microtronics Corp",
    poNumber: "PO-2026-1001",
    billDate: "2026-11-05",
    dueDate: "2026-12-05",
    amount: 26040.00,
    paidAmount: 0.00,
    status: "Awaiting Payment", // Draft | Pending Approval | Awaiting Payment | Paid
    category: "Hardware Inventory Procurement",
    items: [
      { description: "Nexus Smart POS Touch Terminal Kiosks", qty: 50, unitCost: 480.00, total: 24000.00 }
    ],
    tax: 2040.00,
    paymentTerms: "Net 30"
  },
  {
    id: "bill_2",
    billNumber: "BILL-2026-442",
    vendorId: "ven_2",
    vendorName: "Continental Paper & Packaging Co",
    poNumber: "PO-2026-1002",
    billDate: "2026-11-07",
    dueDate: "2026-11-22",
    amount: 2007.25,
    paidAmount: 2007.25,
    status: "Paid",
    category: "Consumables Inventory",
    items: [
      { description: "Thermal Paper Rolls 80x80mm (Box of 50)", qty: 100, unitCost: 18.50, total: 1850.00 }
    ],
    tax: 157.25,
    paymentTerms: "Net 15"
  },
  {
    id: "bill_3",
    billNumber: "BILL-2026-439",
    vendorId: "ven_aws",
    vendorName: "Amazon Web Services Inc",
    poNumber: "DIRECT-SUB",
    billDate: "2026-10-31",
    dueDate: "2026-11-15",
    amount: 4850.00,
    paidAmount: 0.00,
    status: "Awaiting Payment",
    category: "Cloud Infrastructure & Hosting",
    items: [
      { description: "Production EC2, RDS Aurora & Edge CDN Bandwidth", qty: 1, unitCost: 4850.00, total: 4850.00 }
    ],
    tax: 0.00,
    paymentTerms: "Net 15"
  }
];

export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: "jrn_1",
    entryNumber: "JRN-2026-091",
    date: "2026-11-08 14:15",
    description: "Countertop POS Terminal Daily Shift Reconciliation (REG-01)",
    reference: "POS-2026-9901",
    actor: "Alex Sterling (Admin)",
    lines: [
      { accountCode: "1020", accountName: "POS Terminal Cash Floats & Drawers", debit: 840.50, credit: 0.00 },
      { accountCode: "4020", accountName: "Countertop POS Retail Revenue", debit: 0.00, credit: 774.65 },
      { accountCode: "2020", accountName: "Sales Tax Collected Payable", debit: 0.00, credit: 65.85 }
    ],
    totalAmount: 840.50
  },
  {
    id: "jrn_2",
    entryNumber: "JRN-2026-092",
    date: "2026-11-08 11:20",
    description: "Goods Received Note Inventory Intake (GRN-2026-0881)",
    reference: "PO-2026-0994",
    actor: "Elena Rostova (Manager)",
    lines: [
      { accountCode: "1200", accountName: "Merchandise & ERP Inventory Valuation", debit: 3800.00, credit: 0.00 },
      { accountCode: "2020", accountName: "Sales Tax Input Credit", debit: 323.00, credit: 0.00 },
      { accountCode: "2010", accountName: "Accounts Payable (Trade Creditors)", debit: 0.00, credit: 4123.00 }
    ],
    totalAmount: 4123.00
  },
  {
    id: "jrn_3",
    entryNumber: "JRN-2026-093",
    date: "2026-11-02 10:00",
    description: "B2B Customer Invoice Settlement (Apex Global Technologies)",
    reference: "INV-2026-0881",
    actor: "Elena Rostova (Manager)",
    lines: [
      { accountCode: "1010", accountName: "Operating Cash & Bank (JPMorgan Chase)", debit: 48500.00, credit: 0.00 },
      { accountCode: "1100", accountName: "Accounts Receivable (Trade Debtors)", debit: 0.00, credit: 48500.00 }
    ],
    totalAmount: 48500.00
  },
  {
    id: "jrn_4",
    entryNumber: "JRN-2026-094",
    date: "2026-10-31 18:00",
    description: "Monthly Cost of Goods Sold (COGS) Recognition",
    reference: "MTH-CLOSE-OCT",
    actor: "Elena Rostova (Manager)",
    lines: [
      { accountCode: "5010", accountName: "Cost of Goods Sold (Hardware & Assemblies)", debit: 28400.00, credit: 0.00 },
      { accountCode: "1200", accountName: "Merchandise & ERP Inventory Valuation", debit: 0.00, credit: 28400.00 }
    ],
    totalAmount: 28400.00
  }
];


