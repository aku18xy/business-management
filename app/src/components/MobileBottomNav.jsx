import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users2,
  Boxes,
  Store,
  FileCheck2,
  Menu
} from 'lucide-react';

export const MobileBottomNav = () => {
  const {
    activeTab,
    navigateToTab,
    deals,
    approvals,
    setMobileMenuOpen,
    userPermissions
  } = useApp();

  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;

  const items = [
    {
      id: 'dashboard',
      label: 'Cockpit',
      icon: LayoutDashboard,
      badge: null,
      visible: userPermissions.canViewDashboard
    },
    {
      id: 'crm',
      label: 'Deals',
      icon: Users2,
      badge: deals.length > 0 ? `${deals.length}` : null,
      visible: true
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: null,
      visible: true
    },
    {
      id: 'pos',
      label: 'POS',
      icon: Store,
      badge: 'Live',
      isHighlight: true,
      visible: true
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: FileCheck2,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : null,
      visible: true
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around select-none safe-area-bottom">
      {items.filter(i => i.visible).map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigateToTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition relative ${
              active
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
              {item.badge && (
                <span className={`absolute -top-1.5 -right-2.5 px-1 min-w-[14px] h-[14px] rounded-full text-[9px] font-mono font-bold flex items-center justify-center ${
                  item.badge === 'Live'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-indigo-600 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}

      {/* Menu / Drawer Toggle */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-slate-400 hover:text-slate-200 transition"
      >
        <Menu className="w-5 h-5 text-slate-400" />
        <span className="text-[10px] mt-1">Menu</span>
      </button>
    </nav>
  );
};
