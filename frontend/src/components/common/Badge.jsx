import { clsx } from 'clsx';

const colorMap = {
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  teal: 'bg-teal-50 text-teal-700 border border-teal-200',
  brand: 'bg-blue-600 text-white border border-blue-600',
  yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  gray: 'bg-gray-50 text-gray-700 border border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  orange: 'bg-orange-50 text-orange-700 border border-orange-200',
};

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorMap[color], className
    )}>
      {children}
    </span>
  );
}