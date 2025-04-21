import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  count: number;
  resourceType: string;
  icon: React.ReactNode;
  statusSummary?: {
    healthy: number;
    warning: number;
    error: number;
  };
  onClick?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  count,
  resourceType,
  icon,
  statusSummary,
  onClick,
}) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <div className="p-2 rounded-md bg-amber-100 dark:bg-gray-700">
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{count}</span>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{resourceType}</span>
      </div>
      
      {statusSummary && (
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center">
            <CheckCircle size={16} className="text-green-500 mr-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{statusSummary.healthy}</span>
          </div>
          <div className="flex items-center">
            <AlertCircle size={16} className="text-amber-500 mr-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{statusSummary.warning}</span>
          </div>
          <div className="flex items-center">
            <AlertCircle size={16} className="text-red-500 mr-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{statusSummary.error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;