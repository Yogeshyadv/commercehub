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
        return <span className="text-gray-500 text-sm font-medium">{icon}</span>;
      }
      // Assume it's a React component
      const IconComponent = icon;
      return <IconComponent className="h-4 w-4 text-gray-400" />;
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
              'w-full px-3 py-2 border rounded-lg shadow-sm bg-white transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:border-primary-500',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-500',
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
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helpMessage && !error && <p className="mt-1 text-sm text-gray-500">{helpMessage}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;