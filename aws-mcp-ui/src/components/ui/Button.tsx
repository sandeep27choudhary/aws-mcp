import React from 'react';
import { LoadingSpinner } from '../ui';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  className = '',
  ...props
}) => {
  const getVariantClasses = (variant: ButtonVariant): string => {
    switch (variant) {
      case 'primary':
        return 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white border-amber-500';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white border-gray-600';
      case 'outline':
        return 'bg-transparent hover:bg-gray-50 active:bg-gray-100 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 dark:hover:bg-gray-700';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white border-red-500';
    }
  };

  const getSizeClasses = (size: ButtonSize): string => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2.5 py-1.5';
      case 'md':
        return 'text-sm px-4 py-2';
      case 'lg':
        return 'text-base px-6 py-3';
    }
  };

  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const disabledClasses = (disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;