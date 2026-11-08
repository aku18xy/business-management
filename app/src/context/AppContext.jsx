import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ORGS,
  INITIAL_USERS,
  ROLE_PERMISSIONS,
  INITIAL_KPIS,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS
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

  // Theme mode
  const [isDark, setIsDark] = useState(true);

  // Active page route
  const [activeTab, setActiveTab] = useState('dashboard');

  // Command palette state
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexus_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexus_approvals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('nexus_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Handle switching users (simulating different RBAC roles)
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

  // Handle approving or rejecting an approval request
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
        kpis: INITIAL_KPIS,
        allUsers: INITIAL_USERS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
