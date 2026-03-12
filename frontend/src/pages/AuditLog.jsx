import { useState, useEffect, useCallback } from 'react';
import { Shield, Search, Filter, ChevronDown, ChevronRight, User, Clock, Tag, X, Terminal, Cpu } from 'lucide-react';
import { auditLogService } from '../services/auditLogService';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';
import { formatDate } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const ACTION_CONFIG = {
  create:          { label: 'Asset Created',   color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' },
  update:          { label: 'Entry Modified',  color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20' },
  delete:          { label: 'Record Deleted',  color: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-[#f87171] border-red-100 dark:border-red-500/20' },
  login:           { label: 'Access Granted',  color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20' },
  logout:          { label: 'Access Terminated',color: 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-100 dark:border-white/10' },
  export:          { label: 'Data Exported',   color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100 dark:border-purple-500/20' },
  import:          { label: 'Data Injected',   color: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 border-fuchsia-100 dark:border-fuchsia-500/20' },
  payment:         { label: 'Transaction',     color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' },
  settings_change: { label: 'System Config',  color: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-orange-100 dark:border-orange-500/20' },
};

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.07]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';
const SUB  = 'text-gray-400 dark:text-[#5a5a7a]';

function ExpandedRow({ log }) {
  const hasChanges = log.changes?.before || log.changes?.after;
  return (
    <tr className="bg-gray-50/50 dark:bg-white/[0.01]">
      <td colSpan={5} className={`px-10 py-6 border-b ${DIV}`}>
        <div className="space-y-5">
            <div className="flex flex-wrap gap-8">
                {log.description && (
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Log Description</p>
                        <p className="text-[13px] font-bold text-gray-900 dark:text-gray-200">{log.description}</p>
                    </div>
                )}
                {log.ipAddress && (
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Network IP</p>
                        <p className="text-[13px] font-mono font-bold text-gray-900 dark:text-indigo-400">{log.ipAddress}</p>
                    </div>
                )}
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Reference ID</p>
                    <p className="text-[13px] font-mono font-bold text-gray-700 dark:text-gray-400">#{log._id}</p>
                </div>
            </div>

            {hasChanges && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                {log.changes.before && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">Previous State</p>
                        </div>
                        <pre className="bg-white dark:bg-black/40 border border-gray-100 dark:border-white/[0.05] rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-gray-700 dark:text-[#a0a0c8] leading-relaxed select-all">
                            {JSON.stringify(log.changes.before, null, 2)}
                        </pre>
                    </div>
                )}
                {log.changes.after && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Mutated State</p>
                        </div>
                        <pre className="bg-white dark:bg-black/40 border border-gray-100 dark:border-white/[0.05] rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-gray-700 dark:text-[#a0a0c8] leading-relaxed select-all">
                            {JSON.stringify(log.changes.after, null, 2)}
                        </pre>
                    </div>
                )}
                </div>
            )}
        </div>
      </td>
    </tr>
  );
}

export default function AuditLogPage() {
  const [logs,       setLogs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [pg,         setPg]         = useState({ page: 1, limit: 25, total: 0, pages: 0 });
  const [expanded,   setExpanded]   = useState(null);

  // Filters
  const [action,     setAction]     = useState('');
  const [resource,   setResource]   = useState('');
  const [from,       setFrom]       = useState('');
  const [to,         setTo]         = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 25 };
      if (action)   params.action   = action;
      if (resource) params.resource = resource;
      if (from)     params.from     = from;
      if (to)       params.to       = to;
      const res = await auditLogService.getLogs(params);
      setLogs(res.data || []);
      setPg(res.pagination || { page: 1, limit: 25, total: 0, pages: 0 });
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [action, resource, from, to]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const clearFilters = () => { setAction(''); setResource(''); setFrom(''); setTo(''); };
  const activeFilters = [action, resource, from, to].filter(Boolean).length;

  const userName = log => log.user
    ? `${log.user.firstName || ''} ${log.user.lastName || ''}`.trim() || log.user.email
    : 'System Nexus';

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-end justify-between pt-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#dc2626]/10 rounded-2xl flex items-center justify-center shadow-lg border border-[#dc2626]/20">
            <Shield className="w-6 h-6 text-[#dc2626]" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[13px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">Security</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Audit Intelligence</h1>
          </div>
        </div>
        <button
          onClick={() => setShowFilter(v => !v)}
          className={`flex items-center gap-2.5 px-5 py-2.5 text-sm font-black rounded-xl border transition-all shadow-sm active:scale-95 ${
            showFilter || activeFilters > 0
              ? 'bg-[#dc2626] text-white border-[#dc2626]'
              : `border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-200 bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08]`
          }`}
        >
          <Filter className="w-4 h-4" />
          Analytics {activeFilters > 0 && <span className="bg-white text-[#dc2626] rounded-lg px-2 py-0.5 text-[10px] font-black ml-1">{activeFilters} active</span>}
        </button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilter && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <div className={`${CARD} p-6 mb-6`}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Filter Action</label>
                            <select value={action} onChange={e => setAction(e.target.value)}
                                className={`w-full text-sm font-bold border ${DIV} rounded-xl px-4 py-2.5 bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#dc2626]/10 appearance-none`}>
                                <option value="">All Transactions</option>
                                {Object.entries(ACTION_CONFIG).map(([k, v]) => <option key={k} value={k} className="bg-white dark:bg-[#1a1a1a]">{v.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Target Resource</label>
                            <input value={resource} onChange={e => setResource(e.target.value)} placeholder="e.g. Products..."
                                className={`w-full text-sm font-medium border ${DIV} rounded-xl px-4 py-2.5 bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#dc2626]/10 placeholder-gray-400 dark:placeholder-[#3a3a5a]`} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Temporal From</label>
                            <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                                className={`w-full text-sm font-bold border ${DIV} rounded-xl px-4 py-2.5 bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white focus:outline-none`} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Temporal To</label>
                            <input type="date" value={to} onChange={e => setTo(e.target.value)}
                                className={`w-full text-sm font-bold border ${DIV} rounded-xl px-4 py-2.5 bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white focus:outline-none`} />
                        </div>
                    </div>
                    {activeFilters > 0 && (
                        <button onClick={clearFilters} className="mt-5 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-red-500 hover:opacity-80 transition-opacity">
                            <X className="w-4 h-4" /> Reset Filters
                        </button>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Table Container */}
      <div className={`${CARD} overflow-hidden`}>
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
             <Loader text="Decrypting audit records..." />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-5 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/[0.04] rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-gray-300 dark:text-[#3a3a5a]" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">Clean system state — no records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className={`border-b ${DIV} bg-gray-50/50 dark:bg-white/[0.03]`}>
                  <th className="w-12" />
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Operation</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Resource Class</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden sm:table-cell">Initiator</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden md:table-cell">Timestamp</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${DIV}`}>
                {logs.map(log => {
                  const ac = ACTION_CONFIG[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-100 dark:border-white/10' };
                  const isExpanded = expanded === log._id;
                  const hasDetail = log.description || log.changes?.before || log.changes?.after || log.ipAddress;
                  return [
                    <motion.tr 
                        key={log._id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => hasDetail && setExpanded(isExpanded ? null : log._id)}
                        className={`group transition-all duration-150 ${hasDetail ? 'cursor-pointer' : ''} ${isExpanded ? 'bg-[#dc2626]/[0.03] dark:bg-[#dc2626]/[0.06]' : 'hover:bg-gray-50/50 dark:hover:bg-white/[0.01]'}`}
                    >
                      <td className="px-4 py-4 text-center w-12">
                        {hasDetail && (
                          <div className={`text-gray-400 group-hover:text-[#dc2626] transition-all transform ${isExpanded ? 'rotate-90 text-[#dc2626]' : ''}`}>
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${ac.color}`}>
                          {ac.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center text-gray-400">
                                <Terminal className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{log.resource}</p>
                                {log.resourceId && <p className={`text-[10px] font-bold font-mono ${SUB} mt-0.5`}>REF: {log.resourceId?.toString().slice(-12).toUpperCase()}</p>}
                            </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-[13px] font-bold text-gray-700 dark:text-[#a0a0c8]">{userName(log)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-[13px] font-bold text-gray-500 dark:text-[#8888a8]">{formatDate(log.createdAt)}</span>
                        </div>
                      </td>
                    </motion.tr>,
                    isExpanded && <ExpandedRow key={`${log._id}-exp`} log={log} />
                  ];
                })}
              </tbody>
            </table>
          </div>
        )}

        {pg.pages > 1 && (
          <div className={`px-6 py-4 border-t ${DIV} bg-gray-50/30 dark:bg-white/[0.01]`}>
            <Pagination 
                page={pg.page} 
                totalPages={pg.pages} 
                onPageChange={p => fetchLogs(p)} 
                total={pg.total}
                limit={pg.limit}
            />
          </div>
        )}
      </div>
    </div>
  );
}
