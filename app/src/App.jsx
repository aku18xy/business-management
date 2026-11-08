import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { Dashboard } from './pages/Dashboard';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { AuditPage } from './pages/AuditPage';
import { OrgSettingsPage } from './pages/OrgSettingsPage';

export function App() {
  const { activeTab, isDark } = useApp();

  return (
    <div className={`min-h-screen flex ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Main Sidebar Shell */}
      <Sidebar />

      {/* Main Stage */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'approvals' && <ApprovalsPage />}
            {activeTab === 'audit' && <AuditPage />}
            {activeTab === 'org' && <OrgSettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
}
export default App;
