import { clsx } from 'clsx';

const colorMap = {
  green:  'bg-emerald-50 dark:bg-emerald-500/[0.12] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/[0.2]',
  teal:   'bg-teal-50   dark:bg-teal-500/[0.12]   text-teal-700   dark:text-teal-400   border border-teal-200   dark:border-teal-500/[0.2]',
  brand:  'bg-[#dc2626] dark:bg-[#dc2626] text-white border border-[#dc2626]',
  yellow: 'bg-amber-50  dark:bg-amber-500/[0.12]  text-amber-700  dark:text-amber-400  border border-amber-200  dark:border-amber-500/[0.2]',
  red:    'bg-red-50    dark:bg-red-500/[0.12]    text-red-700    dark:text-red-400    border border-red-200    dark:border-red-500/[0.2]',
  blue:   'bg-blue-50   dark:bg-blue-500/[0.12]   text-blue-700   dark:text-blue-400   border border-blue-200   dark:border-blue-500/[0.2]',
  gray:   'bg-gray-100  dark:bg-white/[0.07]      text-gray-600   dark:text-gray-400   border border-gray-200   dark:border-white/[0.08]',
  purple: 'bg-purple-50 dark:bg-purple-500/[0.12] text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/[0.2]',
  indigo: 'bg-indigo-50 dark:bg-indigo-500/[0.12] text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/[0.2]',
  orange: 'bg-orange-50 dark:bg-orange-500/[0.12] text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/[0.2]',
};

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors',
      colorMap[color] ?? colorMap.gray,
      className
    )}>
      {children}
    </span>
  );
}