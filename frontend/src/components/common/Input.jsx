import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(
  ({ 
    label, 
    error, 
    helperText, 
    helpText,
    className = '', 
    type = 'text', 
    required = false, 
    leftIcon, 
    rightIcon,
    ...props 
  }, ref) => {
    // Support both helperText and helpText props
    const helpMessage = helpText || helperText;
    
    // Render icon (can be string or component)
    const renderIcon = (icon) => {
      if (typeof icon === 'string') {
        return <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{icon}</span>;
      }
      const IconComponent = icon;
      return <IconComponent className="h-4 w-4 text-gray-400 dark:text-gray-500" />;
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {renderIcon(leftIcon)}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={clsx(
              'w-full px-3 py-2.5 rounded-xl border text-sm transition-colors duration-200',
              'bg-white dark:bg-white/[0.04]',
              'text-gray-900 dark:text-white',
              'placeholder:text-gray-400 dark:placeholder:text-gray-600',
              'focus:outline-none focus:ring-2',
              error
                ? 'border-red-400 dark:border-red-500/60 focus:ring-red-400/30 dark:focus:ring-red-500/20'
                : 'border-gray-200 dark:border-white/[0.1] focus:ring-[#dc2626]/20 dark:focus:ring-[#dc2626]/20 focus:border-[#dc2626]/50 dark:focus:border-[#dc2626]/50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {renderIcon(rightIcon)}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>}
        {helpMessage && !error && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-500">{helpMessage}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
