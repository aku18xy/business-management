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
