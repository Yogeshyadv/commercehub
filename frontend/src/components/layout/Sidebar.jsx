import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, BookOpen, ShoppingBag, Box,
  Users, BarChart2, Settings, LogOut, X, ChevronDown,
  Store, Zap, PanelLeftClose, PanelLeftOpen, Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateInitials } from '../../utils/formatters';
import { useState, useRef, useEffect } from 'react';

/* ── Tooltip shown on collapsed items ────────────────────────── */
function Tip({ label, children }) {
  return (
    <div className="group/tip relative flex items-center">
      {children}
      <div className="pointer-events-none absolute left-full ml-2.5 px-2.5 py-1.5 bg-[#1a1a1a] text-white text-xs font-semibold rounded-lg whitespace-nowrap
        opacity-0 group-hover/tip:opacity-100 translate-x-1 group-hover/tip:translate-x-0
        transition-all duration-150 z-[99] shadow-xl">
        {label}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a1a]" />
      </div>
    </div>
  );
}

/* ── Single nav item ─────────────────────────────────────────── */
function NavItem({ item, collapsed, onClick }) {
  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 select-none
         ${collapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5'}
         ${isActive
           ? 'bg-white/[0.1] text-white'
           : 'text-[#a8a8b8] hover:bg-white/[0.06] hover:text-white'
         }`
      }
    >
      {({ isActive }) => {
        const inner = (
          <>
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#DC2626] rounded-r-full" />
            )}
            <item.icon
              className={`shrink-0 transition-colors ${collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'}
                ${isActive ? 'text-white' : 'text-[#6b6b7e] group-hover:text-[#a8a8b8]'}`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            {!collapsed && <span className="truncate">{item.name}</span>}
          </>
        );
        return collapsed ? <Tip label={item.name}>{inner}</Tip> : inner;
      }}
    </NavLink>
  );
}

/* ── Nav group (label + items) ───────────────────────────────── */
function NavGroup({ label, items, collapsed, onClose }) {
  return (
    <div className="mb-3">
      {!collapsed && (
        <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5a5a7e]">{label}</p>
      )}
      {collapsed && <div className="mx-2 my-2 h-px bg-white/[0.06]" />}
      <div className="space-y-0.5">
        {items.map(item => (
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

/* ── Store picker dropdown ───────────────────────────────────── */
function StorePicker({ user, collapsed }) {
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
        <button
          onClick={() => navigate('/dashboard/account')}
          className="w-full flex justify-center py-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#DC2626] to-[#9b1c1c] rounded-lg flex items-center justify-center text-white text-xs font-black shadow-[0_2px_8px_rgba(220,38,38,0.3)]">
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
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors group"
      >
        <div className="w-7 h-7 bg-gradient-to-br from-[#DC2626] to-[#9b1c1c] rounded-md flex items-center justify-center text-white text-xs font-black shrink-0 shadow-[0_2px_6px_rgba(220,38,38,0.3)]">
          {initials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-bold text-white truncate leading-tight">{user?.firstName} {user?.lastName}</p>
          <p className="text-[10px] text-[#5a5a6a] font-medium capitalize leading-tight mt-0.5">{roleName}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[#6868a0] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-2 right-2 bottom-full mb-1.5 bg-[#1e1e2d] border border-white/[0.09] rounded-xl shadow-2xl py-1.5 z-[60] overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-white/[0.06]">
            <p className="text-xs font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[11px] text-[#6868a0] truncate mt-0.5">{user?.email}</p>
          </div>
          <div className="p-1 mt-0.5">
            <button
              onClick={() => { navigate('/dashboard/account'); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#a8a8b8] rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" strokeWidth={2} />
              Account settings
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#DC2626]/80 rounded-lg hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors"
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
   SIDEBAR
═══════════════════════════════════════════════════════════════ */
export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { user } = useAuth();

  const vendorGroups = [
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
        { name: 'Customers', path: '/dashboard/customers', icon: Users       },
      ],
    },
    {
      label: 'Insights',
      items: [{ name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 }],
    },
    {
      label: 'Account',
      items: [{ name: 'My Account', path: '/dashboard/account', icon: Settings }],
    },
  ];

  const customerGroups = [
    {
      label: 'Overview',
      items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true }],
    },
    {
      label: 'Shopping',
      items: [
        { name: 'My Orders',      path: '/my-orders', icon: ShoppingBag },
        { name: 'Browse Store',   path: '/store',     icon: Store       },
      ],
    },
    {
      label: 'Account',
      items: [{ name: 'My Account', path: '/dashboard/account', icon: Settings }],
    },
  ];

  const groups = ['vendor', 'vendor_staff', 'super_admin'].includes(user?.role)
    ? vendorGroups : customerGroups;

  const w = collapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full flex flex-col
          bg-[#111118] border-r border-white/[0.04]
          transform transition-all duration-300 ease-in-out
          ${w} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand header */}
        <div className={`h-[60px] min-h-[60px] flex items-center border-b border-white/[0.04] shrink-0
          ${collapsed ? 'justify-center px-3' : 'justify-between px-4'}`}
        >
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 bg-[#DC2626] rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(220,38,38,0.4)]">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} fill="white" />
              </div>
              <span className="text-[15px] font-black tracking-tight text-white whitespace-nowrap">
                Commerce<span className="text-[#DC2626]">Hub</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Tip label="CommerceHub">
              <Link to="/" className="w-8 h-8 bg-[#DC2626] rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(220,38,38,0.35)]">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} fill="white" />
              </Link>
            </Tip>
          )}
          {/* Close on mobile */}
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-[#6b6b7e] hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-hide">
          {groups.map(group => (
            <NavGroup
              key={group.label}
              label={group.label}
              items={group.items}
              collapsed={collapsed}
              onClose={onClose}
            />
          ))}
        </nav>

        {/* Footer: user picker + collapse toggle */}
        <div className={`border-t border-white/[0.04] pb-3 pt-2 px-2`}>
          <StorePicker user={user} collapsed={collapsed} />

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex items-center gap-2.5 w-full mt-1 px-3 py-2 rounded-lg text-[#6b6b7e] hover:bg-white/[0.05] hover:text-[#a8a8b8] transition-all text-sm
              ${collapsed ? 'justify-center' : ''}`}
          >
            {collapsed
              ? <Tip label="Expand sidebar"><PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={2} /></Tip>
              : <><PanelLeftClose className="w-[18px] h-[18px] shrink-0" strokeWidth={2} /><span className="text-xs font-medium">Collapse</span></>
            }
          </button>
        </div>
      </aside>
    </>
  );
}