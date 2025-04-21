import React from 'react';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
}

function DataTable<T>({
  columns,
  data,
  keyField,
  onRowClick,
  isLoading = false,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg">
        <div className="animate-pulse p-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg">
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    if (sortColumn !== column.key) return <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                }`}
                onClick={() => column.sortable && onSort && onSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row) => (
            <tr 
              key={String(row[keyField])}
              className={`
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
                transition-colors duration-150
              `}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td key={`${String(row[keyField])}-${column.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {column.accessor ? column.accessor(row) : (row as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;