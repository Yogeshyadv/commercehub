import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, BookOpen, ShoppingBag, Box,
  Users, BarChart2, Settings, LogOut, X, ChevronDown,
  Store, Zap, PanelLeftClose, PanelLeftOpen, Shield, Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateInitials } from '../../utils/formatters';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/* -- Tooltip shown on collapsed items -------------------------- */
function Tip({ label, children }) {
  return (
    <div className="group/tip relative flex items-center w-full">
      {children}
      <div className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5
        bg-gray-900 dark:bg-[#111111] text-white text-xs font-semibold rounded-lg whitespace-nowrap
        opacity-0 group-hover/tip:opacity-100 translate-x-1 group-hover/tip:translate-x-0
        transition-all duration-150 z-[200] shadow-xl border border-white/[0.08]">
        {label}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-[#111111]" />
      </div>
    </div>
  );
}

/* -- Single nav item ------------------------------------------- */
function NavItem({ item, collapsed, onClick }) {
  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl text-[13px] font-medium
         transition-all duration-150 select-none cursor-pointer
         ${collapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5'}
         ${isActive
           ? 'bg-[#dc2626]/10 dark:bg-white/[0.09] text-[#dc2626] dark:text-white shadow-[inset_3px_0_0_#dc2626]'
           : 'text-gray-500 dark:text-[#8080a0] hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-[#d4d4e8]'
         }`
      }
    >
      {({ isActive }) => {
        const inner = (
          <>
            <motion.span
              animate={{ scale: isActive ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              className="shrink-0 flex items-center justify-center"
            >
              <item.icon
                className={`transition-colors
                  ${collapsed ? 'w-5 h-5' : 'w-[17px] h-[17px]'}
                  ${isActive ? 'text-[#dc2626] dark:text-white' : 'text-gray-400 dark:text-[#5a5a7a] group-hover:text-gray-700 dark:group-hover:text-[#a8a8c8]'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </motion.span>
            {!collapsed && (
              <span className="truncate leading-none">{item.name}</span>
            )}
            {!collapsed && item.badge && (
              <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-md
                bg-[#dc2626]/20 text-[#dc2626]">{item.badge}</span>
            )}
          </>
        );
        return collapsed ? <Tip label={item.name}>{inner}</Tip> : inner;
      }}
    </NavLink>
  );
}

/* -- Section header -------------------------------------------- */
function SectionHeader({ label, collapsed }) {
  if (collapsed) return <div className="mx-auto my-2 w-5 h-px bg-gray-200 dark:bg-white/[0.08]" />;
  return (
    <p className="px-3 mb-1 mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-[#44445a] select-none">
      {label}
    </p>
  );
}

/* -- Nav section ----------------------------------------------- */
function NavSection({ section, collapsed, onClose }) {
  return (
    <div className="mb-1">
      <SectionHeader label={section.label} collapsed={collapsed} />
      <div className="space-y-0.5">
        {section.items.map(item => (
          <NavItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            onClick={() => window.innerWidth < 1024 && onClose()}
          />
        ))}
      </div>
    </div>
  );
}

/* -- User menu ------------------------------------------------- */
function UserMenu({ user, collapsed }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const ref = useRef(null);
  const initials = generateInitials(user?.firstName, user?.lastName);
  const roleName = user?.role?.replace(/_/g, ' ') || '';

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  if (collapsed) {
    return (
      <Tip label={`${user?.firstName} ${user?.lastName}`}>
        <button onClick={() => navigate('/dashboard/account')} className="w-full flex justify-center py-1.5">
          <div className="w-8 h-8 bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] rounded-xl
            flex items-center justify-center text-white text-[11px] font-black
            shadow-[0_2px_10px_rgba(220,38,38,0.35)] hover:shadow-[0_2px_14px_rgba(220,38,38,0.5)]
            transition-shadow">
            {initials}
          </div>
        </button>
      </Tip>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl
          bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all"
      >
        <div className="w-7 h-7 bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] rounded-lg
          flex items-center justify-center text-white text-[10px] font-black shrink-0
          shadow-[0_2px_8px_rgba(220,38,38,0.3)]">
          {initials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[12px] font-bold text-gray-900 dark:text-white truncate leading-tight">{user?.firstName} {user?.lastName}</p>
          <p className="text-[10px] text-gray-500 dark:text-[#5a5a7a] font-medium capitalize leading-tight mt-0.5">{roleName}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-[#5a5a7a] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-2 right-2 bottom-full mb-2
          bg-white dark:bg-[#111111]
          border border-gray-200 dark:border-white/[0.09]
          rounded-xl shadow-2xl py-1 z-[60]">
          <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-white/[0.06]">
            <p className="text-[12px] font-bold text-gray-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[11px] text-gray-500 dark:text-[#5a5a7a] truncate mt-0.5">{user?.email}</p>
          </div>
          <div className="p-1 space-y-0.5">
            <button
              onClick={() => { navigate('/dashboard/account'); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px]
                text-gray-700 dark:text-[#a8a8c8] rounded-lg
                hover:bg-gray-100 dark:hover:bg-white/[0.07]
                hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Settings className="w-3.5 h-3.5" strokeWidth={2} />
              Account settings
            </button>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px]
                text-[#dc2626]/80 rounded-lg hover:bg-[#dc2626]/10 hover:text-[#dc2626] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   SIDEBAR
--------------------------------------------------------------- */
const vendorSections = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Store',
    items: [
      { name: 'Orders',    path: '/dashboard/orders',    icon: ShoppingBag },
      { name: 'Products',  path: '/dashboard/products',  icon: Package     },
      { name: 'Inventory', path: '/dashboard/inventory', icon: Box         },
      { name: 'Catalogs',  path: '/dashboard/catalogs',  icon: BookOpen    },
      { name: 'AI Assistant', path: '/dashboard', icon: Bot, end: true }
    ],
  },
  {
    label: 'Customers',
    items: [{ name: 'Customers', path: '/dashboard/customers', icon: Users }],
  },
  {
    label: 'Insights',
    items: [{ name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 }],
  },
  {
    label: 'System',
    items: [{ name: 'Audit Log', path: '/dashboard/audit-log', icon: Shield }],
  },
  {
    label: 'Account',
    items: [{ name: 'My Account', path: '/dashboard/account', icon: Settings }],
  },
];

const customerSections = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Shopping',
    items: [
      { name: 'My Orders',    path: '/my-orders', icon: ShoppingBag },
      { name: 'Browse Store', path: '/store',     icon: Store       },
    ],
  },
  {
    label: 'Account',
    items: [{ name: 'My Account', path: '/dashboard/account', icon: Settings }],
  },
];

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { user } = useAuth();

  const sections = ['vendor', 'vendor_staff', 'super_admin'].includes(user?.role)
    ? vendorSections : customerSections;

  const w = collapsed ? 'w-[60px]' : 'w-[240px]';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col
          border-r border-gray-200 dark:border-white/[0.05]
          bg-white dark:bg-transparent
          transform transition-all duration-300 ease-in-out
          ${w} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'var(--sidebar-bg, white)' }}
      >
      <style>{`
        :root { --sidebar-bg: white; }
        .dark { --sidebar-bg: linear-gradient(180deg, #0a0a0a 0%, #000000 100%); }
      `}</style>
        {/* Brand header */}
        <div className={`h-[60px] min-h-[60px] flex items-center border-b border-gray-200 dark:border-white/[0.05] shrink-0
          ${collapsed ? 'justify-center px-3' : 'justify-between px-4'}`}
        >
          {!collapsed ? (
            <>
              <Link to="/" className="flex items-center gap-2.5 min-w-0 group">
                <div className="w-7 h-7 bg-[#dc2626] rounded-xl flex items-center justify-center shrink-0
                  shadow-[0_0_16px_rgba(220,38,38,0.4)] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.55)]
                  transition-shadow">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} fill="white" />
                </div>
                <span className="text-[15px] font-black tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                  Commerce<span className="text-[#dc2626]">Hub</span>
                </span>
              </Link>
              <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-gray-400 dark:text-[#5a5a7a]
                hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all">
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Tip label="CommerceHub">
              <Link to="/" className="w-8 h-8 bg-[#dc2626] rounded-xl flex items-center justify-center
                shadow-[0_0_14px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.55)]
                transition-shadow">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} fill="white" />
              </Link>
            </Tip>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-hide space-y-1">
          {sections.map(section => (
            <NavSection
              key={section.label}
              section={section}
              collapsed={collapsed}
              onClose={onClose}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-white/[0.05] pb-3 pt-2 px-2 space-y-1">
          <UserMenu user={user} collapsed={collapsed} />

          {/* Collapse toggle (desktop only) */}
          {collapsed ? (
            <Tip label="Expand sidebar">
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex w-full justify-center p-2 rounded-xl
                  text-gray-400 dark:text-[#44445a]
                  hover:bg-gray-100 dark:hover:bg-white/[0.06]
                  hover:text-gray-700 dark:hover:text-[#8888a8] transition-all"
              >
                <PanelLeftOpen className="w-[17px] h-[17px]" strokeWidth={2} />
              </button>
            </Tip>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center gap-2.5 w-full px-3 py-2 rounded-xl
                text-gray-400 dark:text-[#44445a]
                hover:bg-gray-100 dark:hover:bg-white/[0.06]
                hover:text-gray-700 dark:hover:text-[#8888a8] transition-all"
            >
              <PanelLeftClose className="w-[17px] h-[17px] shrink-0" strokeWidth={2} />
              <span className="text-[12px] font-medium">Collapse</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}