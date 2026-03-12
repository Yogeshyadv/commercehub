import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, MessageCircle, Share2, MousePointerClick, TrendingUp, Package, ExternalLink, Loader2, BarChart2, RefreshCw } from 'lucide-react';
import { catalogService } from '../../../services/catalogService';
import { formatCurrency } from '../../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

/* ── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color = 'blue', delay = 0 }) {
  const colors = {
    violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', icon: 'text-violet-600', border: 'border-violet-200 dark:border-violet-800' },
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600', border: 'border-emerald-200 dark:border-emerald-800' },
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600', border: 'border-blue-200 dark:border-blue-800' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', icon: 'text-orange-600', border: 'border-orange-200 dark:border-orange-800' },
    pink:   { bg: 'bg-pink-50 dark:bg-pink-900/20', icon: 'text-pink-600', border: 'border-pink-200 dark:border-pink-800' },
  };
  const c = colors[color] || colors.blue;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`bg-white dark:bg-[#0d0d0d] rounded-2xl border ${c.border} p-5 shadow-sm`}
    >
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </motion.div>
  );
}

/* ── Horizontal bar ────────────────────────────────────────────────────── */
function BarRow({ label, image, value, max, total, suffix = '', delay = 0 }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-white/[0.05] last:border-none"
    >
      {image ? (
        <img src={image} alt={label} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100 dark:border-white/10" />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
          <Package className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{label}</p>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-2 shrink-0">{value}{suffix}</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: pct + '%' }}
            transition={{ delay: delay + 0.1, duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
          />
        </div>
        {total > 0 && <p className="text-[11px] text-gray-400 mt-0.5">{pct}% of total</p>}
      </div>
    </motion.div>
  );
}

export default function CatalogAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await catalogService.getCatalogAnalytics(id);
      setData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { summary, productStats, catalogName } = data;
  const maxClicks = Math.max(...(productStats?.map(p => p.clicks) || [1]), 1);
  const maxWA     = Math.max(...(productStats?.map(p => p.whatsappClicks) || [1]), 1);

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#000000] pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7">

        {/* Back + Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/dashboard/catalogs')}
            className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-violet-500" />
              {catalogName}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Catalog analytics &amp; performance</p>
          </div>
          <button onClick={() => load(true)} disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/15 transition-colors cursor-pointer shadow-sm disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-7">
          <StatCard icon={Eye} label="Total Views" value={summary.views.toLocaleString()} color="blue" delay={0} />
          <StatCard icon={MousePointerClick} label="Product Clicks" value={summary.totalClicks.toLocaleString()} color="violet" delay={0.05} />
          <StatCard icon={MessageCircle} label="WhatsApp Clicks" value={summary.whatsappClicks.toLocaleString()} color="green" delay={0.1} />
          <StatCard icon={Share2} label="Shares" value={summary.shareCount.toLocaleString()} color="orange" delay={0.15} />
          <StatCard icon={TrendingUp} label="Conversion" value={summary.conversionRate + '%'} sub="WhatsApp / Views" color="pink" delay={0.2} />
        </div>

        {/* Last viewed */}
        {summary.lastViewedAt && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-xs text-gray-400 dark:text-gray-500 mb-6 -mt-3">
            Last viewed: {new Date(summary.lastViewedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </motion.p>
        )}

        {/* Product breakdown */}
        {productStats?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Clicks leaderboard */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-200 dark:border-white/[0.07] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <MousePointerClick className="w-4 h-4 text-violet-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Top Clicked Products</h2>
                <span className="ml-auto text-xs text-gray-400">{summary.totalClicks} total</span>
              </div>
              {productStats.slice(0, 8).map((p, i) => (
                <BarRow
                  key={p._id}
                  label={p.name}
                  image={p.image}
                  value={p.clicks}
                  max={maxClicks}
                  total={summary.totalClicks}
                  delay={0.32 + i * 0.04}
                />
              ))}
              {productStats.every(p => p.clicks === 0) && (
                <p className="text-sm text-gray-400 text-center py-8">No product clicks yet.</p>
              )}
            </motion.div>

            {/* WhatsApp leaderboard */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-200 dark:border-white/[0.07] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">WhatsApp Orders by Product</h2>
                <span className="ml-auto text-xs text-gray-400">{summary.whatsappClicks} total</span>
              </div>
              {productStats.slice(0, 8).map((p, i) => (
                <BarRow
                  key={p._id}
                  label={p.name}
                  image={p.image}
                  value={p.whatsappClicks}
                  max={maxWA}
                  total={summary.whatsappClicks}
                  delay={0.37 + i * 0.04}
                />
              ))}
              {productStats.every(p => p.whatsappClicks === 0) && (
                <p className="text-sm text-gray-400 text-center py-8">No WhatsApp order clicks yet.</p>
              )}
            </motion.div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-200 dark:border-white/[0.07] shadow-sm py-16 text-center">
            <BarChart2 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No product data yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Share your catalog to start collecting analytics.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
