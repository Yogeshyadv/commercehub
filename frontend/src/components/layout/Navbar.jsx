import { Menu, Search, Settings, LogOut, Sun, Moon, ChevronDown, HelpCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { generateInitials } from '../../utils/formatters';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Notifications from '../common/Notifications';

const PAGE_TITLES = {
  '/dashboard':          'Home',
  '/dashboard/orders':   'Orders',
  '/dashboard/products': 'Products',
  '/dashboard/products/new': 'Add product',
  '/dashboard/inventory': 'Inventory',
  '/dashboard/catalogs':  'Catalogs',
  '/dashboard/customers': 'Customers',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/account':   'Settings',
  '/my-orders':           'My Orders',
  '/store':               'Store',
};

/* ── Command-K searchbar ────────────────────────────────────── */
function SearchBar() {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={`relative flex items-center transition-all duration-200
      ${focused ? 'w-80' : 'w-60 md:w-72'}`}>
      <Search className={`absolute left-3 w-4 h-4 pointer-events-none transition-colors
        ${focused ? 'text-[#DC2626]' : 'text-gray-400 dark:text-[#7070a0]'}`} />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-9 pr-16 py-2
          bg-[#f6f6f7] dark:bg-white/[0.05]
          border border-[#e1e3e5] dark:border-white/[0.08]
          rounded-lg text-sm text-gray-700 dark:text-gray-200
          placeholder-gray-400 dark:placeholder-[#7070a0]
          focus:outline-none focus:border-[#DC2626]/40 focus:ring-2 focus:ring-[#DC2626]/10
          focus:bg-white dark:focus:bg-white/[0.08]
          transition-all"
      />
      <kbd className={`absolute right-3 flex items-center gap-0.5 text-[10px] font-semibold pointer-events-none transition-opacity
        ${focused ? 'opacity-0' : 'opacity-100'}
        border border-gray-200 dark:border-white/[0.1] text-gray-400 dark:text-[#6060a0] rounded px-1.5 py-0.5`}>
        ⌘K
      </kbd>
    </div>
  );
}

/* ── Profile dropdown ────────────────────────────────────────── */
function ProfileMenu({ user, logout, navigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const initials = generateInitials(user?.firstName, user?.lastName);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all group"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[#DC2626] to-[#991b1b] rounded-lg flex items-center justify-center text-white text-xs font-black shadow-[0_2px_8px_rgba(220,38,38,0.3)] ring-2 ring-transparent group-hover:ring-[#DC2626]/20 transition-all">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-gray-800 dark:text-white leading-tight">{user?.firstName}</p>
          <p className="text-[10px] text-gray-400 dark:text-[#8080a8] capitalize leading-tight">{user?.role?.replace(/_/g, ' ')}</p>
        </div>
        <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56
          bg-white dark:bg-[#1e1e2c]
          border border-[#e1e3e5] dark:border-white/[0.08]
          rounded-xl shadow-xl shadow-black/10 dark:shadow-black/50
          py-1.5 z-50 origin-top-right
          animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-4 py-3 border-b border-[#f0f0f0] dark:border-white/[0.06]">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
          </div>
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => { navigate('/dashboard/account'); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" strokeWidth={2} />
              Account settings
            </button>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/[0.08] transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate   = useNavigate();
  const location   = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-[60px] min-h-[60px] px-4 lg:px-6
      bg-white dark:bg-[#13131f]
      border-b border-[#e1e3e5] dark:border-white/[0.07]
      flex items-center justify-between gap-4
      shadow-[0_1px_0_rgba(26,26,26,0.06)] dark:shadow-[0_1px_0_rgba(0,0,0,0.3)]
      transition-colors duration-200"
    >
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search (hidden on small screens, shown md+) */}
        <div className="hidden md:block">
          <SearchBar />
        </div>

        {/* Mobile: page title */}
        <p className="md:hidden text-sm font-bold text-gray-900 dark:text-white truncate">{pageTitle}</p>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">

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

        {/* Help */}
        <button
          title="Help & documentation"
          onClick={() => window.open('https://help.shopify.com', '_blank')}
          className="p-2 rounded-lg text-gray-500 dark:text-[#9898b8] hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <Notifications />

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-white/[0.07] mx-1.5" />

        {/* Profile menu */}
        <ProfileMenu user={user} logout={logout} navigate={navigate} />
      </div>
    </header>
  );
}