import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, currentPath }) => {
  const menuItems = [
    { path: '/asaradmin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/asaradmin/users', icon: '👤', label: 'Users' },
    { path: '/asaradmin/tools', icon: '🔧', label: 'AI Tools' },
    { path: '/asaradmin/analytics', icon: '📈', label: 'Analytics' },
    { path: '/asaradmin/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <aside className={`
      fixed left-0 top-16 h-[calc(100vh-64px)] bg-[#0d0d11] border-r border-[#1b1b23] transition-all duration-300 overflow-y-auto
      ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}
    `}>
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${currentPath === item.path 
                    ? 'bg-[#2dd4ff]/10 text-[#2dd4ff] border border-[#2dd4ff]/20' 
                    : 'text-[#9297a6] hover:bg-[#17171e] hover:text-[#eef0f5]'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-4 border-t border-[#1b1b23]">
          <div className="px-4 py-2">
            <p className="text-xs text-[#5c6070] uppercase tracking-wider">System Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4fd18b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4fd18b]"></span>
              </span>
              <span className="text-xs text-[#9297a6]">All systems operational</span>
            </div>
          </div>
          <div className="px-4 py-2 mt-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-xs text-[#5c6070] hover:text-[#2dd4ff] transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;