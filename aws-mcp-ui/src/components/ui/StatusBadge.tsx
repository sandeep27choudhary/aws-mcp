import React from 'react';

type StatusType = 'running' | 'stopped' | 'pending' | 'error' | 'success' | 'warning' | 'info' | string;

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, className = '' }) => {
  const getStatusStyles = (status: StatusType): string => {
    switch (status.toLowerCase()) {
      case 'running':
      case 'active':
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'stopped':
      case 'inactive':
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'pending':
      case 'in progress':
      case 'warning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    }
  };

  const displayText = text || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)} ${className}`}>
      {displayText}
    </span>
  );
};

export default StatusBadge;