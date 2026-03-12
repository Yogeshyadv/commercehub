import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, ShoppingBag, Package, Box,
  BookOpen, Users, BarChart2, Shield, Settings, X,
  Plus, Zap, ArrowRight, Command, Clock, TrendingUp,
  FileText, ChevronRight, Terminal, Cpu, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Icon Component ─────────────────────────────────────────── */
const Sparkles = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
  </svg>
);

/* ── Nav items ───────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Terminal Overview',  path: '/dashboard',            icon: LayoutDashboard, section: 'Navigate', desc: 'Global operations & real-time telemetry' },
  { id: 'orders',     label: 'Order Management',   path: '/dashboard/orders',     icon: ShoppingBag,     section: 'Navigate', desc: 'Full-cycle transaction monitoring' },
  { id: 'products',   label: 'Asset Directory',    path: '/dashboard/products',   icon: Package,         section: 'Navigate', desc: 'Strategic product catalog' },
  { id: 'inventory',  label: 'Logistics Hub',      path: '/dashboard/inventory',  icon: Box,             section: 'Navigate', desc: 'Reserves & supply distribution' },
  { id: 'catalogs',   label: 'Visual Identity',    path: '/dashboard/catalogs',   icon: BookOpen,        section: 'Navigate', desc: 'Storefront synthesis & branding' },
  { id: 'customers',  label: 'Customer CRM',       path: '/dashboard/customers',  icon: Users,           section: 'Navigate', desc: 'Identity intelligence & segments' },
  { id: 'analytics',  label: 'Neural Insights',    path: '/dashboard/analytics',  icon: BarChart2,       section: 'Navigate', desc: 'Advanced revenue forecasting' },
  { id: 'audit-log',  label: 'System Integrity',   path: '/dashboard/audit-log',  icon: Shield,          section: 'Navigate', desc: 'Audit protocol & security log' },
  { id: 'account',    label: 'Nexus Profile',      path: '/dashboard/account',    icon: Settings,        section: 'Navigate', desc: 'Identity config & preferences' },
];

const ACTION_ITEMS = [
  { id: 'new-product', label: 'Create Asset',      path: '/dashboard/products/new', icon: Plus,       section: 'Protocols', desc: 'Initialize new listing protocol' },
  { id: 'new-catalog', label: 'Synthesize Canvas', path: '/dashboard/catalogs',     icon: Sparkles,   section: 'Protocols', desc: 'Neural storefront synthesis' },
];

/* ── Keyboard hint ───────────────────────────────────────────── */
function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center px-2 py-1 text-[9px] font-black 
      bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] 
      text-gray-500 dark:text-[#5a5a7a] rounded-lg leading-none uppercase tracking-widest shadow-sm">
      {children}
    </kbd>
  );
}

/* ── Result item ─────────────────────────────────────────────── */
function ResultItem({ item, isActive, onClick }) {
  const Icon = item.icon || Terminal;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all group
        ${isActive
          ? 'bg-[#dc2626] text-white shadow-lg shadow-red-500/20'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.04]'
        }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
        ${isActive
          ? 'bg-white/20 scale-110'
          : 'bg-gray-100 dark:bg-white/[0.04] group-hover:bg-gray-200 dark:group-hover:bg-white/[0.08]'
        }`}>
        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 dark:text-[#3a3a5a]'}`} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>{item.label}</p>
        <p className={`text-[11px] font-bold truncate mt-1 ${isActive ? 'text-white/70' : 'text-gray-400 dark:text-[#5a5a7a]'}`}>{item.desc}</p>
      </div>
      <ChevronRight className={`w-4 h-4 shrink-0 transition-all duration-300 ${isActive ? 'translate-x-1 opacity-100 text-white' : 'opacity-0 -translate-x-2'}`} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMMAND PALETTE
/* ═══════════════════════════════════════════════════════════════ */
export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const listRef = useRef(null);

  const allItems = [...NAV_ITEMS, ...ACTION_ITEMS];

  const filtered = query.trim()
    ? allItems.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.desc.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const flatList = Object.values(grouped).flat();

  const handleSelect = useCallback((item) => {
    navigate(item.path);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, flatList.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && flatList[activeIndex]) {
        handleSelect(flatList[activeIndex]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, flatList, activeIndex, onClose, handleSelect]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  if (!open) return null;

  let flatIndex = 0;
  const sections = Object.entries(grouped);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
        />
      </AnimatePresence>

      {/* Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`relative w-full max-w-[640px] bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden ring-1 ring-white/10`}
      >
        {/* Search header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0d]">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#dc2626]/10">
            <Search className="w-4 h-4 text-[#dc2626]" strokeWidth={3} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Execute neural command (search pages, products, etc)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#3a3a5a] text-base font-bold outline-none"
          />
          <div className="flex items-center gap-2">
            {query && (
                <button onClick={() => setQuery('')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            )}
            <Kbd>ESC</Kbd>
          </div>
        </div>

        {/* Results Stream */}
        <div ref={listRef} className="max-h-[480px] overflow-y-auto p-3 custom-scrollbar">
          {flatList.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <Cpu className="w-12 h-12 text-gray-200 dark:text-[#1a1a2a] mb-5 animate-pulse" />
              <p className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Intelligence Failure</p>
              <p className="text-xs font-bold text-gray-400 dark:text-[#5a5a7a] mt-1">No nodes match the parameter "{query}"</p>
            </div>
          ) : (
            sections.map(([sectionLabel, items]) => (
              <div key={sectionLabel} className="mb-4">
                <p className="px-4 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626] opacity-60">
                  {sectionLabel}
                </p>
                <div className="space-y-1">
                  {items.map(item => {
                    const idx = flatIndex++;
                    return (
                      <ResultItem
                        key={item.id}
                        item={item}
                        isActive={idx === activeIndex}
                        onClick={() => handleSelect(item)}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tactical Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.01]">
          <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 dark:text-[#5a5a7a] uppercase tracking-widest">
            <span className="flex items-center gap-2"><Kbd>↑↓</Kbd> NAV</span>
            <span className="flex items-center gap-2"><Kbd>↵</Kbd> SELECT</span>
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 dark:text-[#3a3a5a]">
            <Terminal className="w-3.5 h-3.5" />
            <span>CommerceHub OS v4.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
