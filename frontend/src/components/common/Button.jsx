import { clsx } from 'clsx';

const variantStyles = {
  primary:   'bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-[0_2px_10px_rgba(220,38,38,0.3)] hover:shadow-[0_2px_14px_rgba(220,38,38,0.4)] focus:ring-[#dc2626]/30',
  secondary: 'bg-white dark:bg-white/[0.06] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/[0.1] hover:bg-gray-50 dark:hover:bg-white/[0.1] focus:ring-[#dc2626]/20',
  danger:    'bg-red-600 text-white hover:bg-red-700 shadow-[0_2px_10px_rgba(239,68,68,0.25)] focus:ring-red-500/30',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_2px_10px_rgba(16,185,129,0.25)] focus:ring-emerald-500/30',
  ghost:     'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.07] hover:text-gray-900 dark:hover:text-white focus:ring-[#dc2626]/20',
};

const sizeStyles = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg',
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export default function Button({
  children, variant = 'primary', size = 'md', className = '',
  loading = false, disabled = false, icon: Icon, fullWidth = false, type = 'button', ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]',
        variantStyles[variant], sizeStyles[size],
        fullWidth && 'w-full', className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}
