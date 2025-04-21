import React, { useState } from 'react';
import { Menu, X, Cloud, BarChart3, List, LucideCrop as LucideProps, Server, RefreshCw, Terminal, LineChart, Box } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  icon: React.FC<LucideProps>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: BarChart3 },
  { name: 'Resources', path: '/resources', icon: List },
  { name: 'CloudFormation', path: '/cloudformation', icon: Cloud },
  { name: 'Auto Scaling', path: '/autoscaling', icon: RefreshCw },
  { name: 'SSM', path: '/ssm', icon: Terminal },
  { name: 'CloudWatch', path: '/cloudwatch', icon: LineChart },
  { name: 'Lambda', path: '/lambda', icon: Box },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for larger screens */}
      <aside 
        className={`fixed inset-y-0 z-50 flex-shrink-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center">
              <Server className="w-8 h-8 text-amber-500" />
              <span className="ml-2 text-xl font-bold dark:text-white">AWS MCP</span>
            </Link>
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-amber-100 text-amber-700 dark:bg-gray-700 dark:text-amber-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}>
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 shadow-sm z-10">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3 ml-auto">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              Connected
            </span>
            <span className="text-sm font-medium dark:text-white">us-west-2</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}>
        </div>
      )}
    </div>
  );
};

export default Layout;