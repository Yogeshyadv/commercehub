import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, BookOpen, ShoppingBag, Box,
  Users, BarChart2, Settings, LogOut, X, ChevronRight,
  Store, Tag, Bell, HelpCircle, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateInitials } from '../../utils/formatters';

const NavItem = ({ item, onClick }) => (
  <NavLink
    to={item.path}
    end={item.end}
    onClick={onClick}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive
          ? 'bg-white/[0.1] text-white'
          : 'text-[#a8a8b8] hover:bg-white/[0.05] hover:text-white'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#DC2626] rounded-r-full" />
        )}
        <item.icon
          className={`w-[18px] h-[18px] shrink-0 transition-colors ${
            isActive ? 'text-white' : 'text-[#6b6b7e] group-hover:text-[#a8a8b8]'
          }`}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span className="truncate">{item.name}</span>
      </>
    )}
  </NavLink>
);

const NavGroup = ({ label, items, onClose }) => (
  <div className="mb-4">
    <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#6868a0]">{label}</p>
    <div className="space-y-0.5">
      {items.map(item => (
        <NavItem key={item.path} item={item} onClick={() => window.innerWidth < 1024 && onClose()} />
      ))}
    </div>
  </div>
);

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const vendorGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
      ],
    },
    {
      label: 'Store',
      items: [
        { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag },
        { name: 'Products', path: '/dashboard/products', icon: Package },
        { name: 'Inventory', path: '/dashboard/inventory', icon: Box },
        { name: 'Catalogs', path: '/dashboard/catalogs', icon: BookOpen },
      ],
    },
    {
      label: 'Customers',
      items: [
        { name: 'Customers', path: '/dashboard/customers', icon: Users },
      ],
    },
    {
      label: 'Insights',
      items: [
        { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 },
      ],
    },
    {
      label: 'Account',
      items: [
        { name: 'My Account', path: '/dashboard/account', icon: Settings },
      ],
    },
  ];

  const customerGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
      ],
    },
    {
      label: 'Shopping',
      items: [
        { name: 'My Orders', path: '/my-orders', icon: ShoppingBag },
        { name: 'Browse Store', path: '/store', icon: Store },
      ],
    },
    {
      label: 'Account',
      items: [
        { name: 'My Account', path: '/dashboard/account', icon: Settings },
      ],
    },
  ];

  const groups = (user?.role === 'vendor' || user?.role === 'vendor_staff' || user?.role === 'super_admin')
    ? vendorGroups
    : customerGroups;

  const initials = generateInitials(user?.firstName, user?.lastName);
  const roleName = user?.role?.replace(/_/g, ' ') || '';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col
          bg-[#111118] border-r border-white/[0.04]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="h-[60px] min-h-[60px] flex items-center justify-between px-5 border-b border-white/[0.04]">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-[#DC2626] rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(220,38,38,0.4)]">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} fill="white" />
            </div>
            <span className="text-[15px] font-black tracking-tight text-white whitespace-nowrap">
              Commerce<span className="text-[#DC2626]">Hub</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#6b6b7e] hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store chip */}
        <div className="px-3 py-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] cursor-pointer transition-colors group">
            <div className="w-7 h-7 bg-gradient-to-br from-[#DC2626] to-[#9b1c1c] rounded-md flex items-center justify-center text-white text-xs font-black shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-[#5a5a6a] font-medium capitalize">{roleName}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#6868a0] shrink-0" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto custom-scrollbar">
          {groups.map(group => (
            <NavGroup key={group.label} label={group.label} items={group.items} onClose={onClose} />
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 pb-2 border-t border-white/[0.04]">
          <div className="pt-2 space-y-0.5">
            <NavLink
              to="/dashboard/account"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white/[0.1] text-white'
                    : 'text-[#a8a8b8] hover:bg-white/[0.05] hover:text-white'
                }`
              }
            >
              <Settings className="w-[18px] h-[18px] shrink-0 text-[#6b6b7e]" strokeWidth={2} />
              <span>Settings</span>
            </NavLink>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#a8a8b8] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-all duration-150"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}