import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CommandPalette } from './components/CommandPalette';
import { Dashboard } from './pages/Dashboard';
import { CrmPage } from './pages/CrmPage';
import { InventoryPage } from './pages/InventoryPage';
import { PosTerminalPage } from './pages/PosTerminalPage';
import { PosAdminPage } from './pages/PosAdminPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { AuditPage } from './pages/AuditPage';
import { OrgSettingsPage } from './pages/OrgSettingsPage';

export function App() {
  const { activeTab, isDark, currentPath } = useApp();

  // FR-801: Dedicated Standalone POS Kiosk Terminal served at /pos
  if (currentPath === '/pos') {
    return (
      <div className={`min-h-screen ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <PosTerminalPage />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} overflow-x-hidden`}>
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Main Sidebar Shell (Responsive Desktop + Drawer on Mobile) */}
      <Sidebar />

      {/* Main Stage */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />

        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'crm' && <CrmPage />}
            {activeTab === 'inventory' && <InventoryPage />}
            {activeTab === 'pos' && <PosAdminPage />}
            {activeTab === 'approvals' && <ApprovalsPage />}
            {activeTab === 'audit' && <AuditPage />}
            {activeTab === 'org' && <OrgSettingsPage />}
          </div>
        </main>

        {/* Mobile Persistent Bottom App Bar */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
export default App;
