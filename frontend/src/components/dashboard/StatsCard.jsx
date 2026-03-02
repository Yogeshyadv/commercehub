import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx } from 'clsx';

const iconColorMap = {
  blue: 'bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30',
  green: 'bg-[#25D366]/10 text-[#128C7E] ring-1 ring-[#25D366]/20 dark:bg-[#25D366]/10 dark:text-[#25D366] dark:ring-[#25D366]/20',
  yellow: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-900/30',
  purple: 'bg-purple-50 text-purple-600 ring-1 ring-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:ring-purple-900/30',
  red: 'bg-red-50 text-red-600 ring-1 ring-red-100 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-900/30',
};

export default function StatsCard({ title, value, change, changeType = 'increase', icon: Icon, color = 'blue', subtitle }) {
  const isPositive = changeType === 'increase';

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 hover:border-[#25D366]/40 dark:hover:border-[#25D366]/40 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium group-hover:text-[#128C7E] dark:group-hover:text-[#25D366] transition-colors">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">{value}</h3>
          </div>
          
          {(change !== undefined && change !== null) && (
            <div className={`flex items-center mt-3 gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg w-fit ${
              isPositive 
                ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            }`}>
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
          
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 font-medium">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className={clsx(
            'p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm',
            iconColorMap[color]
          )}>
            <Icon className="h-6 w-6" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}