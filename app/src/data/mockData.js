// Initial mock data & local storage models for NexusBMS (Malaysian Enterprise System Edition)

export const INITIAL_ORGS = [
  {
    id: "org_default",
    name: "Nexus Enterprise Solutions Sdn. Bhd.",
    companyReg: "202401038291 (1543820-K)",
    code: "NXG-MY",
    currency: "RM",
    currencyCode: "MYR",
    currencySymbol: "RM",
    timezone: "Asia/Kuala_Lumpur",
    taxName: "SST (Sales & Service Tax)",
    taxRate: 8.0,
    sstNumber: "W10-2401-32000088",
    tinNumber: "C25893010020",
    msicCode: "62021",
    address: "Level 28, Menara Shell, No. 210, Jalan Tun Sambanthan, KL Sentral, 50470 Kuala Lumpur, Malaysia",
    phone: "+60 3-2188 4000",
    email: "corporate@nexusbms.my",
    website: "https://nexus-bms.vercel.app",
    branches: [
      { id: "br_kl", name: "Kuala Lumpur HQ (KL Sentral)", code: "KL-01", isHeadquarters: true, state: "W.P. Kuala Lumpur", city: "KL Sentral", phone: "+60 3-2188 4001" },
      { id: "br_pg", name: "Penang Regional Hub (George Town)", code: "PG-01", isHeadquarters: false, state: "Penang", city: "George Town", phone: "+60 4-643 8820" },
      { id: "br_jb", name: "Johor Bahru Hub (Mount Austin)", code: "JB-01", isHeadquarters: false, state: "Johor", city: "Johor Bahru", phone: "+60 7-354 1100" },
      { id: "br_sel", name: "Selangor Distribution Hub (Shah Alam)", code: "SA-01", isHeadquarters: false, state: "Selangor", city: "Shah Alam", phone: "+60 3-5191 7720" }
    ],
    fiscalYearStart: "January"
  }
];

export const INITIAL_USERS = [
  {
    id: "usr_admin",
    name: "Alex Sterling",
    email: "alex@nexusbms.my",
    role: "Admin",
    title: "Chief Executive Officer & MD",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    branchId: "br_kl",
    status: "Active"
  },
  {
    id: "usr_finance",
    name: "Nurul Elena",
    email: "elena@nexusbms.my",
    role: "Manager",
    title: "Head of Finance & Compliance (CA Malaysia)",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    branchId: "br_kl",
    status: "Active"
  },
  {
    id: "usr_sales",
    name: "Marcus Tan",
    email: "marcus@nexusbms.my",
    role: "Staff",
    title: "Enterprise Account Lead (Northern & Central)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    branchId: "br_pg",
    status: "Active"
  },
  {
    id: "usr_auditor",
    name: "Clara Chen",
    email: "clara.audit@kpmg.com.my",
    role: "Auditor",
    title: "External Financial Auditor (KPMG Malaysia)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    branchId: "br_kl",
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
    description: "Operations & Finance Lead: CRM deals, ERP warehouse stock, AR/AP billing, and transaction approvals."
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
  { module: "Executive Cockpit & BI", capability: "View revenue, margin & cashflow telemetry (RM)", admin: "Full Access", manager: "Full Access", staff: "Standard KPIs", auditor: "Read-Only" },
  { module: "CRM & Sales Deals", capability: "Manage pipeline stages, quotations & client profiles", admin: "Read / Write", manager: "Read / Write", staff: "Read / Write", auditor: "Read-Only" },
  { module: "ERP Inventory & SCM (Phase 3)", capability: "Stock adjustments, warehouse transfers, PO approvals, GRN intake", admin: "Full Control", manager: "Full Control", staff: "Read / Requisition", auditor: "Read-Only" },
  { module: "Finance & General Ledger (Phase 4)", capability: "AR Invoicing, AP Bill Payment, Journal Entries, P&L / Balance Sheet (SST & LHDN)", admin: "Full Control", manager: "Full Control", staff: "Restricted", auditor: "Forensic Audit & Export" },
  { module: "POS Retail Terminal", capability: "Open shift float, ring sales, barcode scan, DuitNow / Touch 'n Go tender, 5¢ rounding", admin: "Allowed", manager: "Allowed", staff: "Allowed", auditor: "Restricted" },
  { module: "POS Item Catalog Admin", capability: "Create products, modify RM prices, delete SKUs", admin: "Full Control", manager: "Full Control", staff: "Restricted", auditor: "Restricted" },
  { module: "Executive Action Inbox", capability: "Approve/Reject Purchase Orders & Expense Claims", admin: "Authorized", manager: "Authorized", staff: "Submit Only", auditor: "Restricted" },
  { module: "Forensic Audit Trail", capability: "View tamper-evident mutation logs & export JSON", admin: "Inspect & Export", manager: "Inspect Only", staff: "Restricted", auditor: "Full Forensic" },
  { module: "Organization & Multi-Branch", capability: "Configure Malaysian branches, SST rate, base RM currency", admin: "Full Governance", manager: "Restricted", staff: "Restricted", auditor: "Restricted" }
];

export const INITIAL_KPIS = {
  revenue: {
    value: 384500,
    change: "+14.8%",
    trend: "up",
    period: "vs last month",
    target: 400000
  },
  expenses: {
    value: 182100,
    change: "-2.4%",
    trend: "down",
    period: "vs last month",
    budget: 200000
  },
  netProfit: {
    value: 202400,
    margin: "52.64%",
    change: "+31.2%",
    trend: "up"
  },
  cashflow: {
    cashOnHand: 685400,
    receivables: 92600,
    payables: 41800,
    runwayMonths: 18
  },
  activeDeals: {
    count: 24,
    totalValue: 689000,
    weightedPipeline: 445000
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
    title: "Server Cluster Expansion (AWS Malaysia Region ap-southeast-5)",
    requester: "DevOps & Cloud Team",
    amount: "RM 18,500.00",
    department: "Engineering",
    status: "Pending",
    date: "Today, 10:45 AM",
    priority: "High"
  },
  {
    id: "appr_102",
    type: "Expense Claim",
    title: "Petronas B2B Enterprise Client Dinner (Grand Hyatt KLCC)",
    requester: "Marcus Tan",
    amount: "RM 1,240.50",
    department: "Sales",
    status: "Pending",
    date: "Yesterday",
    priority: "Medium"
  },
  {
    id: "appr_103",
    type: "Leave Request",
    title: "Annual Leave (5 working days - Year-End School Holidays)",
    requester: "Nurul Elena",
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
    details: "Adjusted fiscal year closing forecast target to RM 4.5M for Malaysian operations",
    timestamp: "2026-11-08 13:20:14",
    ipAddress: "175.143.20.104"
  },
  {
    id: "log_990",
    actor: "Nurul Elena (Manager)",
    action: "TRANSACTION_BATCH_APPROVED",
    details: "Approved Batch #NX-MY-4402 (12 Vendor Payouts via Maybank BizChannel, total RM 58,400.00)",
    timestamp: "2026-11-08 11:45:00",
    ipAddress: "175.143.20.112"
  },
  {
    id: "log_989",
    actor: "Clara Chen (Auditor)",
    action: "EXPORT_BALANCE_SHEET",
    details: "Generated Q3 Consolidated Financial Statement & SST-02 Return for JKDM",
    timestamp: "2026-11-07 16:30:22",
    ipAddress: "10.0.4.15"
  },
  {
    id: "log_988",
    actor: "System Auth Service",
    action: "USER_LOGIN_SUCCESS",
    details: "Authenticated Alex Sterling via Role-Based Access Control (KL Sentral HQ)",
    timestamp: "2026-11-07 09:00:01",
    ipAddress: "175.143.20.104"
  }
];

export const REVENUE_CHART_DATA = [
  { month: "May", revenue: 268000, expenses: 148000, profit: 120000 },
  { month: "Jun", revenue: 292000, expenses: 159000, profit: 133000 },
  { month: "Jul", revenue: 310000, expenses: 168000, profit: 142000 },
  { month: "Aug", revenue: 332000, expenses: 175000, profit: 157000 },
  { month: "Sep", revenue: 358000, expenses: 180000, profit: 178000 },
  { month: "Oct", revenue: 384500, expenses: 182100, profit: 202400 }
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
    name: "Sime Apex Technologies Sdn. Bhd.",
    contactPerson: "Encik Faris Rahim",
    email: "procurement@simeapex.com.my",
    phone: "+60 3-8312 8890",
    address: "Persiaran Multimedia, Cyberjaya, 63000 Selangor",
    industry: "Enterprise SaaS & Telematics",
    ssmNumber: "201801049921 (1298401-M)",
    tinNumber: "C1029384750",
    sstNumber: "B10-2201-11000045",
    creditLimit: 150000,
    outstandingBalance: 18500,
    status: "Active",
    tags: ["MNC Corporate", "Multi-Branch", "SST Registered"]
  },
  {
    id: "cust_102",
    name: "Trans-Malaya Express Logistics Sdn. Bhd.",
    contactPerson: "Jessica Tan",
    email: "jtan@transmalaya.com.my",
    phone: "+60 3-3168 9920",
    address: "Northport Logistics Park, 42000 Port Klang, Selangor",
    industry: "Transportation & Freight Logistics",
    ssmNumber: "201501024881 (1148202-T)",
    tinNumber: "C1948201944",
    sstNumber: "B10-1901-33000092",
    creditLimit: 250000,
    outstandingBalance: 34560,
    status: "Active",
    tags: ["Fleet Operator", "Priority SLA"]
  },
  {
    id: "cust_103",
    name: "Bintang Runcit Hypermarkets Bhd.",
    contactPerson: "Tan Sri Desmond Lee",
    email: "bg@bintanghyper.com.my",
    phone: "+60 3-2282 4100",
    address: "Mid Valley Megamall, Lingkaran Syed Putra, 59200 Kuala Lumpur",
    industry: "Omnichannel Supermarkets & Retail",
    ssmNumber: "199801004521 (462100-W)",
    tinNumber: "C0847291044",
    sstNumber: "W10-1808-21000055",
    creditLimit: 400000,
    outstandingBalance: 19440,
    status: "Active",
    tags: ["Retail Chain", "POS Kiosk Expansion"]
  },
  {
    id: "cust_104",
    name: "Pantai Horizon Medical Centres Sdn. Bhd.",
    contactPerson: "Dr. Nur Shazwani",
    email: "procurement@pantaihorizon.com.my",
    phone: "+60 3-2296 0888",
    address: "Jalan Bukit Pantai, Bangsar, 59100 Kuala Lumpur",
    industry: "Private Healthcare & Hospitals",
    ssmNumber: "200401018992 (657482-D)",
    tinNumber: "C1209384722",
    sstNumber: "W10-1808-31000019",
    creditLimit: 300000,
    outstandingBalance: 15120,
    status: "Active",
    tags: ["Healthcare", "MOH Compliant"]
  }
];

export const INITIAL_DEALS = [
  {
    id: "deal_1",
    title: "Enterprise Fleet Telematics Rollout (Selangor & Penang)",
    customerId: "cust_102",
    customerName: "Trans-Malaya Express Logistics Sdn. Bhd.",
    value: 164000,
    stage: "proposal",
    owner: "Marcus Tan",
    expectedClose: "2026-11-25",
    priority: "High",
    notes: "Requires integration with existing Port Klang dispatch API."
  },
  {
    id: "deal_2",
    title: "15-Hypermarket POS Hardware & Touch Terminal Upgrade",
    customerId: "cust_103",
    customerName: "Bintang Runcit Hypermarkets Bhd.",
    value: 138500,
    stage: "negotiation",
    owner: "Marcus Tan",
    expectedClose: "2026-11-18",
    priority: "High",
    notes: "Hardware bundle with dual-screen terminal, thermal printers & DuitNow QR."
  },
  {
    id: "deal_3",
    title: "Cyberjaya Cloud Infrastructure Expansion",
    customerId: "cust_101",
    customerName: "Sime Apex Technologies Sdn. Bhd.",
    value: 182000,
    stage: "qualified",
    owner: "Alex Sterling",
    expectedClose: "2026-12-10",
    priority: "Medium",
    notes: "Multi-tenant database scaling in AWS Malaysia Region datacenter."
  },
  {
    id: "deal_4",
    title: "Private Hospital Clinic ERP Management Suite",
    customerId: "cust_104",
    customerName: "Pantai Horizon Medical Centres Sdn. Bhd.",
    value: 95000,
    stage: "lead",
    owner: "Marcus Tan",
    expectedClose: "2026-12-20",
    priority: "Medium",
    notes: "Lead received via web inquiry; discovery demo scheduled at Bangsar."
  },
  {
    id: "deal_5",
    title: "Malaysian Supply Chain Audit & SST Compliance Module",
    customerId: "cust_101",
    customerName: "Sime Apex Technologies Sdn. Bhd.",
    value: 89500,
    stage: "won",
    owner: "Nurul Elena",
    expectedClose: "2026-11-02",
    priority: "High",
    notes: "Contract signed, 50% deposit received via Maybank transfer."
  }
];

export const INITIAL_QUOTATIONS = [
  {
    id: "QT-2026-MY-081",
    dealId: "deal_2",
    customerId: "cust_103",
    customerName: "Bintang Runcit Hypermarkets Bhd.",
    date: "2026-11-05",
    validUntil: "2026-11-30",
    status: "Sent",
    items: [
      { description: "Industrial 2D Barcode Scanner Pro", qty: 15, unitPrice: 240.00, total: 3600.00 },
      { description: "Enterprise POS Terminal Station 15.6-inch", qty: 15, unitPrice: 1899.00, total: 28485.00 },
      { description: "Thermal POS Receipt Printer 80mm", qty: 15, unitPrice: 295.00, total: 4425.00 },
      { description: "On-site Configuration & Staff Training (KL & Penang)", qty: 1, unitPrice: 4500.00, total: 4500.00 }
    ],
    subtotal: 41010.00,
    discount: 1500.00,
    tax: 3160.80, // 8% SST
    total: 42670.80
  }
];

// ============================================================================
// PHASE 2: POINT OF SALE (POS) & RETAIL CATALOG (MOD-08)
// ============================================================================

export const POS_CATALOG = [
  {
    id: "pos_prod_1",
    sku: "SKU-8801",
    name: "Industrial 2D Barcode Scanner Pro",
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
    name: "Thermal POS Receipt Printer 80mm ESC/POS",
    category: "Hardware",
    price: 295.00,
    cost: 135.00,
    stock: 12,
    barcode: "882400192831",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_3",
    sku: "SKU-4105",
    name: "Nexus Smart Touch POS Terminal 15.6-inch",
    category: "Hardware",
    price: 1899.00,
    cost: 950.00,
    stock: 28,
    barcode: "410582910283",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_4",
    sku: "SKU-3301",
    name: "High-Grade Thermal Paper Rolls 80x80mm (Box of 50)",
    category: "Consumables",
    price: 75.00,
    cost: 32.00,
    stock: 85,
    barcode: "330198421092",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_5",
    sku: "SKU-9012",
    name: "RFID Heavy-Duty Smart Inventory Tags (500pk)",
    category: "Consumables",
    price: 120.00,
    cost: 55.00,
    stock: 34,
    barcode: "901284920194",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_6",
    sku: "SKU-7719",
    name: "NexusBMS Cloud Multi-Branch License (1 Year)",
    category: "Software",
    price: 2400.00,
    cost: 0.00,
    stock: 999,
    barcode: "771900192834",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "pos_prod_7",
    sku: "SKU-6601",
    name: "Heavy-Duty Steel Cash Drawer (RM 5 Notes / 8 Coins)",
    category: "Hardware",
    price: 180.00,
    cost: 78.00,
    stock: 40,
    barcode: "661820192839",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=150&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_POS_ORDERS = [
  {
    id: "ORD-9901",
    orderNumber: "POS-2026-9901",
    cashier: "Alex Sterling",
    date: "Today, 14:15",
    branch: "Kuala Lumpur HQ (KL Sentral)",
    items: [
      { name: "Industrial 2D Barcode Scanner Pro", qty: 2, price: 240.00 },
      { name: "High-Grade Thermal Paper Rolls 80x80mm", qty: 1, price: 75.00 }
    ],
    subtotal: 555.00,
    tax: 44.40, // 8% SST
    total: 599.40,
    paymentMethod: "DuitNow QR",
    status: "Completed"
  },
  {
    id: "ORD-9900",
    orderNumber: "POS-2026-9900",
    cashier: "Marcus Tan",
    date: "Today, 11:30",
    branch: "Penang Regional Hub (George Town)",
    items: [
      { name: "Thermal POS Receipt Printer 80mm ESC/POS", qty: 1, price: 295.00 }
    ],
    subtotal: 295.00,
    tax: 23.60,
    total: 318.60,
    paymentMethod: "Touch 'n Go eWallet",
    status: "Completed"
  },
  {
    id: "ORD-9899",
    orderNumber: "POS-2026-9899",
    cashier: "Alex Sterling",
    date: "Today, 09:45",
    branch: "Kuala Lumpur HQ (KL Sentral)",
    items: [
      { name: "High-Grade Thermal Paper Rolls 80x80mm", qty: 2, price: 75.00 }
    ],
    subtotal: 150.00,
    tax: 12.00,
    roundingAdjustment: 0.00,
    total: 162.00,
    paymentMethod: "Cash (RM - 5¢ Rounding)",
    status: "Completed"
  }
];

// ============================================================================
// PHASE 2: POS SHIFT FLOAT & DRAWER RECONCILIATION (FR-802)
// ============================================================================

export const INITIAL_ACTIVE_SHIFT = {
  id: "SHIFT-2026-1109",
  registerId: "REG-01-KL-SENTRAL",
  cashier: "Alex Sterling",
  openedAt: "Today, 08:30 AM",
  openedAtTimestamp: Date.now() - 5 * 3600 * 1000,
  openingFloat: 250.00,
  status: "Open",
  isOpen: true,
  notes: "Morning shift opening float verified (RM200 in RM50/RM20/RM10/RM5/RM1 notes, RM50 in coins).",
  cashDrops: [
    {
      id: "drop_101",
      amount: 150.00,
      reason: "Midday Cash Drop to Vault Safe (Excess float protection)",
      time: "Today, 13:00",
      authorizer: "Nurul Elena (Finance)"
    }
  ]
};

export const INITIAL_SHIFT_HISTORY = [
  {
    id: "SHIFT-2026-1108",
    registerId: "REG-01-KL-SENTRAL",
    cashier: "Marcus Tan",
    openedAt: "Yesterday, 08:30 AM",
    closedAt: "Yesterday, 17:30 PM",
    openingFloat: 250.00,
    cashSales: 1240.50,
    cashDropsTotal: 500.00,
    expectedCash: 990.50,
    closingCountedCash: 990.50,
    variance: 0.00,
    status: "Balanced",
    notes: "Evening shift closed with zero drawer variance. All DuitNow and Cash slips matched."
  },
  {
    id: "SHIFT-2026-1107",
    registerId: "REG-02-PENANG",
    cashier: "Clara Chen",
    openedAt: "Nov 07, 08:30 AM",
    closedAt: "Nov 07, 17:30 PM",
    openingFloat: 200.00,
    cashSales: 820.00,
    cashDropsTotal: 300.00,
    expectedCash: 720.00,
    closingCountedCash: 715.00,
    variance: -5.00,
    status: "Shortage",
    notes: "RM 5.00 coin change shortage reported and verified by Store Manager."
  }
];

// ============================================================================
// PHASE 3: ERP INVENTORY, WAREHOUSE & PROCUREMENT (FR-401, FR-402, FR-403)
// ============================================================================

export const INITIAL_WAREHOUSES = [
  {
    id: "wh_kl",
    name: "Kuala Lumpur Central Logistics Hub",
    code: "WH-SA-01",
    location: "Section 15 Industrial Zone, 40200 Shah Alam, Selangor",
    capacitySqFt: 65000,
    manager: "Marcus Tan",
    branchId: "br_kl",
    status: "Active",
    isPrimary: true
  },
  {
    id: "wh_pg",
    name: "Penang Northern Logistics Depot",
    code: "WH-PG-01",
    location: "Bayan Lepas Free Industrial Zone, 11900 Penang",
    capacitySqFt: 35000,
    manager: "Faizal Ahmad",
    branchId: "br_pg",
    status: "Active",
    isPrimary: false
  },
  {
    id: "wh_jb",
    name: "Johor Southern Gateway Hub",
    code: "WH-JB-01",
    location: "Port of Tanjung Pelepas, 81560 Gelang Patah, Johor",
    capacitySqFt: 30000,
    manager: "Mei-Ling Wong",
    branchId: "br_jb",
    status: "Active",
    isPrimary: false
  }
];

export const INITIAL_INVENTORY_ITEMS = [
  {
    id: "inv_1",
    sku: "SKU-HW-101",
    name: "Nexus Smart POS Touch Terminal Kiosk 15.6-inch",
    category: "Hardware",
    unitOfMeasure: "unit",
    costPrice: 950.00,
    retailPrice: 1899.00,
    reorderPoint: 30,
    reorderQty: 50,
    barcode: "847291002341",
    supplierId: "ven_1",
    warehouseStock: {
      wh_kl: 45,
      wh_pg: 25,
      wh_jb: 15
    },
    committedStock: 12,
    leadTimeDays: 7,
    status: "Optimal"
  },
  {
    id: "inv_2",
    sku: "SKU-HW-102",
    name: "Industrial 2D Barcode Scanner USB-C / Bluetooth",
    category: "Hardware",
    unitOfMeasure: "unit",
    costPrice: 110.00,
    retailPrice: 240.00,
    reorderPoint: 40,
    reorderQty: 80,
    barcode: "771900192834",
    supplierId: "ven_1",
    warehouseStock: {
      wh_kl: 75,
      wh_pg: 40,
      wh_jb: 25
    },
    committedStock: 8,
    leadTimeDays: 5,
    status: "Optimal"
  },
  {
    id: "inv_3",
    sku: "SKU-HW-103",
    name: "Thermal Receipt Printer 80mm ESC/POS Auto-Cutter",
    category: "Hardware",
    unitOfMeasure: "unit",
    costPrice: 135.00,
    retailPrice: 295.00,
    reorderPoint: 35,
    reorderQty: 40,
    barcode: "928301192831",
    supplierId: "ven_3",
    warehouseStock: {
      wh_kl: 32,
      wh_pg: 18,
      wh_jb: 12
    },
    committedStock: 6,
    leadTimeDays: 7,
    status: "Optimal"
  },
  {
    id: "inv_4",
    sku: "SKU-CS-201",
    name: "High-Grade Thermal Paper Rolls 80x80mm (Box of 50)",
    category: "Consumables",
    unitOfMeasure: "box",
    costPrice: 32.00,
    retailPrice: 75.00,
    reorderPoint: 50,
    reorderQty: 100,
    barcode: "192830192831",
    supplierId: "ven_2",
    warehouseStock: {
      wh_kl: 14,
      wh_pg: 6,
      wh_jb: 4
    },
    committedStock: 10,
    leadTimeDays: 3,
    status: "Low Stock"
  },
  {
    id: "inv_5",
    sku: "SKU-HW-104",
    name: "Heavy-Duty Steel Cash Drawer (RM 5 Note / 8 Coin RJ11)",
    category: "Hardware",
    unitOfMeasure: "unit",
    costPrice: 78.00,
    retailPrice: 180.00,
    reorderPoint: 25,
    reorderQty: 30,
    barcode: "661820192839",
    supplierId: "ven_1",
    warehouseStock: {
      wh_kl: 28,
      wh_pg: 12,
      wh_jb: 8
    },
    committedStock: 4,
    leadTimeDays: 7,
    status: "Optimal"
  },
  {
    id: "inv_6",
    sku: "SKU-RM-301",
    name: "ARM Cortex Quad-Core System-on-Module (Silterra Silicon)",
    category: "Raw Materials",
    unitOfMeasure: "unit",
    costPrice: 65.00,
    retailPrice: 145.00,
    reorderPoint: 40,
    reorderQty: 100,
    barcode: "441920192812",
    supplierId: "ven_4",
    warehouseStock: {
      wh_kl: 6,
      wh_pg: 2,
      wh_jb: 1
    },
    committedStock: 5,
    leadTimeDays: 14,
    status: "Critical"
  },
  {
    id: "inv_7",
    sku: "SKU-CS-202",
    name: "Encrypted RFID Keycard Staff Badges (Pack of 100)",
    category: "Consumables",
    unitOfMeasure: "pack",
    costPrice: 22.00,
    retailPrice: 55.00,
    reorderPoint: 30,
    reorderQty: 50,
    barcode: "551920192855",
    supplierId: "ven_2",
    warehouseStock: {
      wh_kl: 48,
      wh_pg: 30,
      wh_jb: 17
    },
    committedStock: 2,
    leadTimeDays: 4,
    status: "Optimal"
  },
  {
    id: "inv_8",
    sku: "SKU-HW-105",
    name: "Mobile Barcode Scanner Handheld Android Terminal (4G/WiFi)",
    category: "Hardware",
    unitOfMeasure: "unit",
    costPrice: 380.00,
    retailPrice: 750.00,
    reorderPoint: 20,
    reorderQty: 25,
    barcode: "881920192844",
    supplierId: "ven_1",
    warehouseStock: {
      wh_kl: 18,
      wh_pg: 9,
      wh_jb: 5
    },
    committedStock: 3,
    leadTimeDays: 10,
    status: "Optimal"
  }
];

export const INITIAL_VENDORS = [
  {
    id: "ven_1",
    name: "Flex & Microtronics Assembly (M) Sdn. Bhd.",
    code: "VEND-MY-01",
    category: "POS Hardware & Assembly",
    country: "Malaysia",
    contactPerson: "Kelvin Lim",
    email: "procurement@flexmicro.com.my",
    phone: "+60 4-643 8820",
    address: "Phase 4, Bayan Lepas Free Industrial Zone, 11900 Penang",
    sstNumber: "P10-2001-44000012",
    ssmNumber: "200101032194 (548921-A)",
    paymentTerms: "Net 30",
    rating: 4.9,
    activeOrdersCount: 1,
    status: "Approved"
  },
  {
    id: "ven_2",
    name: "Nippon Paper & Packaging Malaysia Sdn. Bhd.",
    code: "VEND-MY-02",
    category: "Consumables & Thermal Rolls",
    country: "Malaysia",
    contactPerson: "Encik Ahmad Zulkifli",
    email: "orders@nipponpaper.com.my",
    phone: "+60 3-5191 7720",
    address: "Kawasan Perindustrian Shah Alam, 40200 Shah Alam, Selangor",
    sstNumber: "B10-1809-22000067",
    ssmNumber: "199401018821 (304502-P)",
    paymentTerms: "Net 15",
    rating: 4.7,
    activeOrdersCount: 1,
    status: "Approved"
  },
  {
    id: "ven_3",
    name: "Epson Precision Malaysia Sdn. Bhd.",
    code: "VEND-MY-03",
    category: "ESC/POS Thermal Printhead Mechanisms",
    country: "Malaysia",
    contactPerson: "Gary Chong",
    email: "industrial@epson-precision.com.my",
    phone: "+60 7-354 1100",
    address: "Tebrau Industrial Estate, 81100 Johor Bahru, Johor",
    sstNumber: "J10-1901-32000041",
    ssmNumber: "198901004812 (182104-M)",
    paymentTerms: "Net 45",
    rating: 4.9,
    activeOrdersCount: 0,
    status: "Approved"
  },
  {
    id: "ven_4",
    name: "Silterra Malaysia Sdn. Bhd.",
    code: "VEND-MY-04",
    category: "Semiconductors & ARM Chips",
    country: "Malaysia",
    contactPerson: "Dr. Azman Harun",
    email: "supply@silterra.com",
    phone: "+60 4-401 4000",
    address: "Kulim Hi-Tech Park, 09000 Kulim, Kedah",
    sstNumber: "K10-1808-11000099",
    ssmNumber: "199501039841 (369044-T)",
    paymentTerms: "Net 30",
    rating: 4.8,
    activeOrdersCount: 0,
    status: "Approved"
  }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: "po_1001",
    poNumber: "PO-2026-MY-1001",
    vendorId: "ven_1",
    vendorName: "Flex & Microtronics Assembly (M) Sdn. Bhd.",
    destinationWarehouseId: "wh_kl",
    destinationWarehouseName: "Kuala Lumpur Central Logistics Hub",
    createdAt: "2026-11-05",
    expectedDate: "2026-11-16",
    status: "Issued",
    items: [
      {
        sku: "SKU-HW-101",
        name: "Nexus Smart POS Touch Terminal Kiosk 15.6-inch",
        qty: 50,
        unitCost: 950.00,
        totalCost: 47500.00
      }
    ],
    subtotal: 47500.00,
    tax: 3800.00, // 8% SST
    total: 51300.00,
    paymentTerms: "Net 30",
    notes: "Production batch for Malaysian nationwide retail expansion."
  },
  {
    id: "po_1002",
    poNumber: "PO-2026-MY-1002",
    vendorId: "ven_2",
    vendorName: "Nippon Paper & Packaging Malaysia Sdn. Bhd.",
    destinationWarehouseId: "wh_kl",
    destinationWarehouseName: "Kuala Lumpur Central Logistics Hub",
    createdAt: "2026-11-07",
    expectedDate: "2026-11-12",
    status: "Pending Approval",
    items: [
      {
        sku: "SKU-CS-201",
        name: "High-Grade Thermal Paper Rolls 80x80mm (Box of 50)",
        qty: 100,
        unitCost: 32.00,
        totalCost: 3200.00
      }
    ],
    subtotal: 3200.00,
    tax: 256.00,
    total: 3456.00,
    paymentTerms: "Net 15",
    notes: "Replenishment for Shah Alam central warehouse."
  },
  {
    id: "po_1003",
    poNumber: "PO-2026-MY-0994",
    vendorId: "ven_3",
    vendorName: "Epson Precision Malaysia Sdn. Bhd.",
    destinationWarehouseId: "wh_kl",
    destinationWarehouseName: "Kuala Lumpur Central Logistics Hub",
    createdAt: "2026-10-24",
    expectedDate: "2026-11-02",
    status: "Received",
    grnNumber: "GRN-2026-0881",
    receivedAt: "2026-11-08 11:20",
    items: [
      {
        sku: "SKU-HW-103",
        name: "Thermal Receipt Printer 80mm ESC/POS Auto-Cutter",
        qty: 40,
        unitCost: 135.00,
        totalCost: 5400.00
      }
    ],
    subtotal: 5400.00,
    tax: 432.00,
    total: 5832.00,
    paymentTerms: "Net 45",
    notes: "Inspected and absorbed into Shah Alam central inventory."
  }
];

export const INITIAL_STOCK_MOVEMENTS = [
  {
    id: "mov_1",
    timestamp: "2026-11-08 11:20",
    type: "Goods Received (GRN)",
    sku: "SKU-HW-103",
    productName: "Thermal Receipt Printer 80mm ESC/POS Auto-Cutter",
    qty: "+40",
    warehouseName: "Kuala Lumpur Central Logistics Hub",
    reference: "GRN-2026-0881",
    actor: "Alex Sterling (Admin)",
    notes: "Absorbed from PO-2026-MY-0994"
  },
  {
    id: "mov_2",
    timestamp: "2026-11-08 14:15",
    type: "POS Countertop Sale",
    sku: "SKU-HW-102",
    productName: "Industrial 2D Barcode Scanner USB-C",
    qty: "-1",
    warehouseName: "Kuala Lumpur Central Logistics Hub",
    reference: "POS-2026-9901",
    actor: "Alex Sterling (Admin)",
    notes: "Dispensed via Terminal REG-01 (KL Sentral)"
  },
  {
    id: "mov_3",
    timestamp: "2026-11-07 09:40",
    type: "Inter-Warehouse Transfer",
    sku: "SKU-HW-101",
    productName: "Nexus Smart POS Touch Terminal Kiosk",
    qty: "-15 / +15",
    warehouseName: "KL Central → Penang Depot",
    reference: "TRF-2026-012",
    actor: "Marcus Tan (Staff)",
    notes: "Rebalance stock for Northern region rollout"
  },
  {
    id: "mov_4",
    timestamp: "2026-11-06 16:30",
    type: "Manual Stock Adjustment",
    sku: "SKU-CS-201",
    productName: "High-Grade Thermal Paper Rolls 80x80mm",
    qty: "-2",
    warehouseName: "Kuala Lumpur Central Logistics Hub",
    reference: "ADJ-2026-044",
    actor: "Nurul Elena (Manager)",
    notes: "Damaged box written off during quarterly audit"
  }
];

// ============================================================================
// PHASE 4: FINANCE, ACCOUNTING & INVOICING (FR-501, FR-502, FR-503)
// ============================================================================

export const INITIAL_ACCOUNTS = [
  // 1000 - Assets
  { code: "1010", name: "Maybank Corporate Current Account (5140 1122 3344)", category: "Asset", subType: "Current Asset", balance: 548500.00, normal: "Debit" },
  { code: "1015", name: "CIMB Islamic BizChannel Account (8601 2233 4455)", category: "Asset", subType: "Current Asset", balance: 136900.00, normal: "Debit" },
  { code: "1020", name: "POS Terminal Cash Floats & Drawers (Ringgit Malaysia)", category: "Asset", subType: "Current Asset", balance: 4500.00, normal: "Debit" },
  { code: "1025", name: "DuitNow QR & Touch 'n Go Merchant Clearing", category: "Asset", subType: "Current Asset", balance: 18200.00, normal: "Debit" },
  { code: "1100", name: "Accounts Receivable (Trade Debtors)", category: "Asset", subType: "Current Asset", balance: 92600.00, normal: "Debit" },
  { code: "1200", name: "Merchandise & ERP Inventory Valuation", category: "Asset", subType: "Current Asset", balance: 148500.00, normal: "Debit" },
  { code: "1500", name: "Property, Plant & Commercial Equipment", category: "Asset", subType: "Non-Current Asset", balance: 185000.00, normal: "Debit" },

  // 2000 - Liabilities
  { code: "2010", name: "Accounts Payable (Trade Creditors)", category: "Liability", subType: "Current Liability", balance: 41800.00, normal: "Credit" },
  { code: "2020", name: "SST Payable (Sales & Service Tax to JKDM / Customs)", category: "Liability", subType: "Current Liability", balance: 22410.00, normal: "Credit" },
  { code: "2100", name: "Accrued Statutory Payroll (EPF/KWSP, SOCSO, EIS & PCB)", category: "Liability", subType: "Current Liability", balance: 34500.00, normal: "Credit" },

  // 3000 - Equity
  { code: "3010", name: "Ordinary Paid-in Share Capital (SSM Registered)", category: "Equity", subType: "Equity", balance: 500000.00, normal: "Credit" },
  { code: "3020", name: "Retained Earnings (Prior Years)", category: "Equity", subType: "Equity", balance: 235490.00, normal: "Credit" },

  // 4000 - Revenue
  { code: "4010", name: "Commercial B2B Enterprise Solutions Revenue", category: "Revenue", subType: "Operating Revenue", balance: 315000.00, normal: "Credit" },
  { code: "4020", name: "Countertop POS Retail Revenue (DuitNow & Card)", category: "Revenue", subType: "Operating Revenue", balance: 48500.00, normal: "Credit" },
  { code: "4030", name: "Professional Implementation & Consulting Fees", category: "Revenue", subType: "Operating Revenue", balance: 21000.00, normal: "Credit" },

  // 5000 - Cost of Goods Sold (COGS)
  { code: "5010", name: "Cost of Goods Sold (Hardware Assemblies)", category: "Expense", subType: "Direct Cost", balance: 94200.00, normal: "Debit" },
  { code: "5020", name: "Domestic Freight & Forwarding Charges", category: "Expense", subType: "Direct Cost", balance: 8800.00, normal: "Debit" },

  // 6000 - Operating Expenses (OPEX)
  { code: "6010", name: "Employee Salaries, EPF (KWSP) & SOCSO (PERKESO)", category: "Expense", subType: "Operating Expense", balance: 52000.00, normal: "Debit" },
  { code: "6020", name: "Cloud Infrastructure & MSC / Tech Subscriptions", category: "Expense", subType: "Operating Expense", balance: 9400.00, normal: "Debit" },
  { code: "6030", name: "Premises Rental & Depot Leases (KL Sentral / Shah Alam)", category: "Expense", subType: "Operating Expense", balance: 18500.00, normal: "Debit" },
  { code: "6040", name: "Corporate Marketing & Client Acquisition", category: "Expense", subType: "Operating Expense", balance: 7100.00, normal: "Debit" },
  { code: "6050", name: "Bank Negara Malaysia 5-Sen Cash Rounding Adjustment", category: "Expense", subType: "Operating Expense", balance: -4.20, normal: "Debit" }
];

export const INITIAL_INVOICES = [
  {
    id: "inv_rec_1",
    invoiceNumber: "INV-2026-MY-0881",
    customerId: "cust_101",
    customerName: "Sime Apex Technologies Sdn. Bhd.",
    customerEmail: "procurement@simeapex.com.my",
    customerSst: "B10-2201-11000045",
    customerTin: "C1029384750",
    eInvoiceStatus: "LHDN Validated",
    lhdnUuid: "20261109-77A1-49F2-B382-99B7E3104C18",
    issueDate: "2026-10-15",
    dueDate: "2026-11-14",
    subtotal: 54000.00,
    tax: 4320.00, // 8% SST
    total: 58320.00,
    paidAmount: 58320.00,
    balanceDue: 0.00,
    status: "Paid",
    agingBucket: "Current",
    items: [
      { description: "Enterprise POS Fleet License & Integration", qty: 25, unitPrice: 1800.00, total: 45000.00 },
      { description: "Hardware Peripherals Deployment Pack", qty: 25, unitPrice: 360.00, total: 9000.00 }
    ],
    notes: "Payment settled in full via Maybank Corporate Transfer on Nov 02, 2026."
  },
  {
    id: "inv_rec_2",
    invoiceNumber: "INV-2026-MY-0895",
    customerId: "cust_102",
    customerName: "Trans-Malaya Express Logistics Sdn. Bhd.",
    customerEmail: "jtan@transmalaya.com.my",
    customerSst: "B10-1901-33000092",
    customerTin: "C1948201944",
    eInvoiceStatus: "LHDN Validated",
    lhdnUuid: "20261109-88B2-55C1-A491-00F8D2910381",
    issueDate: "2026-10-25",
    dueDate: "2026-11-24",
    subtotal: 32000.00,
    tax: 2560.00,
    total: 34560.00,
    paidAmount: 15000.00,
    balanceDue: 19560.00,
    status: "Partially Paid",
    agingBucket: "Current",
    items: [
      { description: "Warehouse Dispatch Scanner Terminals", qty: 50, unitPrice: 480.00, total: 24000.00 },
      { description: "Custom Port Klang API Integration Service", qty: 1, unitPrice: 8000.00, total: 8000.00 }
    ],
    notes: "Initial deposit received. Remaining balance due within Net 30 terms."
  },
  {
    id: "inv_rec_3",
    invoiceNumber: "INV-2026-MY-0812",
    customerId: "cust_103",
    customerName: "Bintang Runcit Hypermarkets Bhd.",
    customerEmail: "bg@bintanghyper.com.my",
    customerSst: "W10-1808-21000055",
    customerTin: "C0847291044",
    eInvoiceStatus: "LHDN Validated",
    lhdnUuid: "20261109-11C3-99E4-7711-22A8F9102831",
    issueDate: "2026-09-10",
    dueDate: "2026-10-10",
    subtotal: 18000.00,
    tax: 1440.00,
    total: 19440.00,
    paidAmount: 0.00,
    balanceDue: 19440.00,
    status: "Overdue",
    agingBucket: "31-60 Days",
    items: [
      { description: "Retail Point-of-Sale Hardware Bundle (Mid Valley Store)", qty: 10, unitPrice: 1800.00, total: 18000.00 }
    ],
    notes: "LHDN compliant invoice issued. First overdue reminder delivered to accounts department."
  },
  {
    id: "inv_rec_4",
    invoiceNumber: "INV-2026-MY-0902",
    customerId: "cust_104",
    customerName: "Pantai Horizon Medical Centres Sdn. Bhd.",
    customerEmail: "procurement@pantaihorizon.com.my",
    customerSst: "W10-1808-31000019",
    customerTin: "C1209384722",
    eInvoiceStatus: "LHDN Validated",
    lhdnUuid: "20261109-44F9-33D2-8812-77C1B4910294",
    issueDate: "2026-11-02",
    dueDate: "2026-12-02",
    subtotal: 14000.00,
    tax: 1120.00,
    total: 15120.00,
    paidAmount: 0.00,
    balanceDue: 15120.00,
    status: "Unpaid",
    agingBucket: "Current",
    items: [
      { description: "Annual NexusBMS Cloud Multi-Branch License", qty: 1, unitPrice: 14000.00, total: 14000.00 }
    ],
    notes: "Net 30 commercial terms granted. Payment via CIMB Islamic or Maybank."
  }
];

export const INITIAL_VENDOR_BILLS = [
  {
    id: "bill_1",
    billNumber: "BILL-2026-MY-441",
    vendorId: "ven_1",
    vendorName: "Flex & Microtronics Assembly (M) Sdn. Bhd.",
    poNumber: "PO-2026-MY-1001",
    billDate: "2026-11-05",
    dueDate: "2026-12-05",
    amount: 51300.00,
    paidAmount: 0.00,
    status: "Awaiting Payment",
    category: "Hardware Inventory Procurement",
    items: [
      { description: "Nexus Smart Touch POS Terminal 15.6-inch", qty: 50, unitCost: 950.00, total: 47500.00 }
    ],
    tax: 3800.00,
    paymentTerms: "Net 30"
  },
  {
    id: "bill_2",
    billNumber: "BILL-2026-MY-442",
    vendorId: "ven_2",
    vendorName: "Nippon Paper & Packaging Malaysia Sdn. Bhd.",
    poNumber: "PO-2026-MY-1002",
    billDate: "2026-11-07",
    dueDate: "2026-11-22",
    amount: 3456.00,
    paidAmount: 3456.00,
    status: "Paid",
    category: "Consumables Inventory",
    items: [
      { description: "High-Grade Thermal Paper Rolls 80x80mm (Box of 50)", qty: 100, unitCost: 32.00, total: 3200.00 }
    ],
    tax: 256.00,
    paymentTerms: "Net 15"
  },
  {
    id: "bill_3",
    billNumber: "BILL-2026-MY-439",
    vendorId: "ven_tm",
    vendorName: "Telekom Malaysia Bhd (TM One / AWS Malaysia)",
    poNumber: "DIRECT-SUB",
    billDate: "2026-10-31",
    dueDate: "2026-11-15",
    amount: 5400.00,
    paidAmount: 0.00,
    status: "Awaiting Payment",
    category: "Cloud Infrastructure & High-Speed Fibre",
    items: [
      { description: "Cloud Hosting, AWS Malaysia Region & Metro-E Direct Connection", qty: 1, unitCost: 5000.00, total: 5000.00 }
    ],
    tax: 400.00,
    paymentTerms: "Net 15"
  }
];

export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: "jrn_1",
    entryNumber: "JRN-2026-MY-091",
    date: "2026-11-08 14:15",
    description: "Countertop POS Terminal Daily Shift Sales & SST Recognition (REG-01 KL Sentral)",
    reference: "POS-2026-9901",
    totalAmount: 599.40,
    status: "Posted",
    createdBy: "Alex Sterling (Admin)",
    lines: [
      { accountCode: "1025", accountName: "DuitNow QR & Touch 'n Go Merchant Clearing", debit: 599.40, credit: 0.00 },
      { accountCode: "4020", accountName: "Countertop POS Retail Revenue (DuitNow & Card)", debit: 0.00, credit: 555.00 },
      { accountCode: "2020", accountName: "SST Payable (Sales & Service Tax to JKDM / Customs)", debit: 0.00, credit: 44.40 }
    ]
  },
  {
    id: "jrn_2",
    entryNumber: "JRN-2026-MY-088",
    date: "2026-11-07 10:00",
    description: "Inter-Bank Treasury Transfer (Maybank Current to CIMB Islamic Operating Account)",
    reference: "TRF-BNK-004",
    totalAmount: 50000.00,
    status: "Posted",
    createdBy: "Nurul Elena (Finance)",
    lines: [
      { accountCode: "1015", accountName: "CIMB Islamic BizChannel Account", debit: 50000.00, credit: 0.00 },
      { accountCode: "1010", accountName: "Maybank Corporate Current Account", debit: 0.00, credit: 50000.00 }
    ]
  }
];
