import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const iconMap = {
  blue:   { bg: 'bg-blue-500/[0.12]',   text: 'text-blue-400',   glow: '' },
  green:  { bg: 'bg-[#dc2626]/[0.12]',  text: 'text-[#f87171]', glow: 'shadow-[0_0_12px_rgba(220,38,38,0.2)]' },
  red:    { bg: 'bg-[#dc2626]/[0.12]',  text: 'text-[#f87171]', glow: 'shadow-[0_0_12px_rgba(220,38,38,0.2)]' },
  yellow: { bg: 'bg-amber-500/[0.12]',  text: 'text-amber-400',  glow: '' },
  purple: { bg: 'bg-purple-500/[0.12]', text: 'text-purple-400', glow: '' },
  teal:   { bg: 'bg-teal-500/[0.12]',   text: 'text-teal-400',   glow: '' },
};

export default function StatsCard({ title, value, change, changeType = 'increase', icon: Icon, color = 'blue', subtitle, to }) {
  const isPositive = changeType === 'increase';
  const style = iconMap[color] ?? iconMap.blue;

  const CardContent = (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`group relative bg-white dark:bg-[#0d0d0d] rounded-2xl p-5
        border border-gray-100 dark:border-white/[0.07]
        shadow-sm
        ${to ? 'cursor-pointer hover:border-gray-200 dark:hover:border-white/[0.12]' : ''}
        h-full overflow-hidden`}
    >
      {/* subtle top-edge glow on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-[#5a5a7a]">{title}</p>
          <p className="text-[28px] font-black text-gray-900 dark:text-white tracking-tight leading-none mt-2 truncate">
            {value}
          </p>

          {change !== undefined && change !== null && (
            <div className={`inline-flex items-center gap-1 mt-2.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
              isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-[#f87171]'
            }`}>
              {isPositive
                ? <ArrowUpRight className="w-3 h-3" strokeWidth={3} />
                : <ArrowDownRight className="w-3 h-3" strokeWidth={3} />}
              {Math.abs(change)}%
            </div>
          )}

          {subtitle && (
            <p className="text-[12px] text-gray-400 dark:text-[#44445a] font-medium mt-2 leading-snug">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${style.bg} ${style.glow}`}>
            <Icon className={`w-5 h-5 ${style.text}`} strokeWidth={2} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full active:scale-[0.98] transition-transform">
        {CardContent}
      </Link>
    );
  }
  return CardContent;
}