import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  className = '',
}) => {
  const getAlertStyles = (type: AlertType): { bgColor: string; textColor: string; icon: React.ReactNode } => {
    switch (type) {
      case 'info':
        return {
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          textColor: 'text-blue-800 dark:text-blue-200',
          icon: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
        };
      case 'success':
        return {
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-200',
          icon: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
        };
      case 'warning':
        return {
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          textColor: 'text-amber-800 dark:text-amber-200',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-800 dark:text-red-200',
          icon: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
        };
    }
  };

  const { bgColor, textColor, icon } = getAlertStyles(type);

  return (
    <div className={`rounded-md p-4 ${bgColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>}
          <div className={`text-sm ${textColor} mt-1`}>{message}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;