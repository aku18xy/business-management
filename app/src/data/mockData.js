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
    canManageUsers: true,
    canManageOrg: true,
    canApproveTransactions: true,
    canExportReports: true,
    canViewAuditLogs: true,
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40"
  },
  Manager: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageOrg: false,
    canApproveTransactions: true,
    canExportReports: true,
    canViewAuditLogs: true,
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
  },
  Staff: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageOrg: false,
    canApproveTransactions: false,
    canExportReports: false,
    canViewAuditLogs: false,
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  },
  Auditor: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageOrg: false,
    canApproveTransactions: false,
    canExportReports: true,
    canViewAuditLogs: true,
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  }
};

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
