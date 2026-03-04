import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  ShoppingBag, 
  Box, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut, 
  X,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateInitials } from '../../utils/formatters';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const vendorNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/dashboard/products', icon: Package },
    { name: 'Catalogs', path: '/dashboard/catalogs', icon: BookOpen },
    { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Inventory', path: '/dashboard/inventory', icon: Box },
    { name: 'Customers', path: '/dashboard/customers', icon: Users },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 },
    { name: 'My Account', path: '/dashboard/account', icon: Users },
  ];

  const customerNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'Browse Store', path: '/store', icon: BookOpen },
    { name: 'My Orders', path: '/my-orders', icon: ShoppingBag },
    { name: 'My Account', path: '/dashboard/account', icon: Users },
  ];

  const superAdminNav = [
    ...vendorNav,
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'super_admin': return superAdminNav;
      case 'vendor':
      case 'vendor_staff': return vendorNav;
      case 'customer': return customerNav;
      default: return customerNav;
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-[#111b21] border-r border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-black/50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-2.5 rounded-xl shadow-lg shadow-[#25D366]/20">
              <MessageSquare className="h-6 w-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight leading-none">CommerceHub</h1>
              <p className="text-[10px] text-[#128C7E] dark:text-[#25D366] font-bold uppercase tracking-wider mt-1">WhatsApp Commerce</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100%-5rem)]">
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="px-4 mb-4 text-xs font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest">
              Menu
            </div>
            
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366]'
                      : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon 
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isActive ? 'text-[#25D366] scale-110' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300 group-hover:scale-105'
                      }`} 
                      strokeWidth={isActive ? 2.5 : 2} 
                    />
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/30">
            <div className="bg-white dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm group hover:border-[#25D366]/30 hover:shadow-md hover:shadow-[#25D366]/5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-600 rounded-xl flex items-center justify-center text-[#128C7E] dark:text-[#25D366] font-bold text-lg shadow-inner">
                  {generateInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                    <p className="text-xs font-medium text-gray-500 dark:text-zinc-500 capitalize truncate">
                      {user?.role?.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-all duration-300 group-hover:translate-y-0.5"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}