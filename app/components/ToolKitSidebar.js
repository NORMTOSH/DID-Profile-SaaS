import React, { useState } from 'react';
import clsx from 'clsx';
import { Home, Settings, List, PlusCircle, Tool, Menu, X } from 'lucide-react';


export const ToolKitSidebar = ({ items = [], initialCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const toggleCollapsed = () => setCollapsed(prev => !prev);

  return (
    <div
      className={clsx(
        'flex flex-col bg-gray-800 text-white transition-width duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
      aria-label="Tool Kit Sidebar"
    >
      {/* Header / Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <span className="text-lg font-semibold">Toolkit</span>}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Items List */}
      <nav className="flex-1 overflow-y-auto mt-2">
        <ul className="flex flex-col">
          {items.map(({ label, icon: Icon, onClick, badge }, idx) => (
            <li key={idx}>
              <button
                onClick={onClick}
                className={clsx(
                  'flex items-center w-full px-4 py-2 hover:bg-gray-700 transition-colors',
                  collapsed ? 'justify-center' : 'justify-start'
                )}
              >
                {Icon && <Icon size={20} aria-hidden="true" />}
                {!collapsed && (
                  <span className="ml-3 flex-1 text-left truncate">{label}</span>
                )}
                {badge && !collapsed && (
                  <span className="ml-auto">{badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer or additional controls */}
      <div className="p-4 border-t border-gray-700">
        {!collapsed ? (
          <button
            onClick={() => window?.open && window.open('/settings', '_self')}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-700 rounded transition-colors"
          >
            <Settings size={20} aria-hidden="true" />
            <span className="ml-3 truncate">Settings</span>
          </button>
        ) : (
          <button
            onClick={() => window?.open && window.open('/settings', '_self')}
            aria-label="Settings"
            className="flex items-center justify-center w-full p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <Settings size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};