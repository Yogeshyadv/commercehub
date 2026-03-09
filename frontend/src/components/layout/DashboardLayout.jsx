import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const COLLAPSE_KEY = 'sidebar_collapsed';

export default function DashboardLayout() {
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [collapsed,      setCollapsed ]     = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === 'true'
  );

  const handleToggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, String(next));
      return next;
    });
  };

  // Close mobile sidebar on resize to lg
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const sidebarW = collapsed ? 'lg:pl-16' : 'lg:pl-64';

  return (
    <div className="min-h-screen bg-[#f6f6f7] dark:bg-[#0f0f15] transition-colors duration-200">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className={`min-h-screen flex flex-col transition-all duration-300 ${sidebarW}`}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-5 lg:p-7 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}