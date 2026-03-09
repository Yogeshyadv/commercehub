import { Menu, Search, Settings, LogOut, Sun, Moon, ChevronDown, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { generateInitials } from '../../utils/formatters';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Notifications from '../common/Notifications';

const PAGE_TITLES = {
  '/dashboard': 'Home',
  '/dashboard/orders': 'Orders',
  '/dashboard/products': 'Products',
  '/dashboard/products/new': 'Add Product',
  '/dashboard/inventory': 'Inventory',
  '/dashboard/catalogs': 'Catalogs',
  '/dashboard/customers': 'Customers',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/account': 'Settings',
  '/my-orders': 'My Orders',
  '/store': 'Store',
};

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';
  const initials = generateInitials(user?.firstName, user?.lastName);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-[60px] min-h-[60px] px-5 lg:px-7
      bg-white/90 dark:bg-[#1a1a2e]/95
      backdrop-blur-xl
      border-b border-gray-100 dark:border-white/[0.08]
      flex items-center justify-between gap-4
      transition-colors duration-300"
    >
      {/* Left: mobile menu + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 dark:text-[#8080a8] hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center w-72 relative group">
          <Search className="absolute left-3 w-4 h-4 text-gray-400 dark:text-[#7070a0] pointer-events-none group-focus-within:text-[#DC2626] transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100/70 dark:bg-white/[0.04] border border-transparent dark:border-white/[0.08] rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-[#7070a0] focus:outline-none focus:bg-white dark:focus:bg-white/[0.08] focus:border-[#DC2626]/30 focus:ring-2 focus:ring-[#DC2626]/10 transition-all"
          />
          <span className="absolute right-3 text-[10px] font-semibold text-gray-300 dark:text-[#6060a0] bg-gray-200/50 dark:bg-white/[0.04] rounded px-1.5 py-0.5 pointer-events-none">⌘K</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1.5">
        {/* Store shortcut */}
        <button
          onClick={() => navigate('/store')}
          title="Visit Store"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-[#8a8a9a] hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <Store className="w-4 h-4" />
          <span className="hidden lg:inline">View store</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="p-2 rounded-lg text-gray-500 dark:text-[#9898b8] hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white transition-all"
        >
          {theme === 'dark'
            ? <Sun className="w-[18px] h-[18px]" />
            : <Moon className="w-[18px] h-[18px]" />}
        </button>

        {/* Notifications */}
        <Notifications />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-white/[0.06] mx-1" />

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#DC2626] to-[#991b1b] rounded-lg flex items-center justify-center text-white text-xs font-black shadow-[0_2px_8px_rgba(220,38,38,0.3)] ring-2 ring-transparent group-hover:ring-[#DC2626]/30 transition-all">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-800 dark:text-white leading-tight">{user?.firstName}</p>
              <p className="text-[10px] text-gray-400 dark:text-[#8080a8] capitalize leading-tight">{user?.role?.replace(/_/g, ' ')}</p>
            </div>
            <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-gray-400 dark:text-[#8080a8] transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#23233a] border border-gray-100 dark:border-white/[0.06] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => { navigate('/dashboard/account'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  Account settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/[0.08] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}