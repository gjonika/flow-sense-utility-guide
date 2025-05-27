
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart3, FolderOpen, Settings, Plus, Ship, HelpCircle, Brain } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MainHeader = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/ai-assistant', label: 'AI Assistant', icon: Brain },
    { path: '/how-to-use', label: 'How to Use', icon: HelpCircle },
    { path: '/dev', label: 'Diagnostics', icon: Settings },
    { path: '/new-survey', label: 'New Survey', icon: Plus },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
            <Ship className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">Survey Dashboard</h1>
            {!isMobile && (
              <p className="text-xs sm:text-sm text-gray-600">Ship interior inspection management</p>
            )}
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-1 sm:gap-2 ${isMobile ? 'px-2' : ''} ${
                    isActive(item.path) 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  {!isMobile && <span className="text-xs sm:text-sm">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
          
          {/* Dashboard Home Button */}
          <Link to="/dashboard">
            <Button
              variant={isActive('/dashboard') ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-1 sm:gap-2 ${isMobile ? 'px-2' : ''} ${
                isActive('/dashboard') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : ''
              }`}
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              {!isMobile && <span className="text-xs sm:text-sm">Dashboard</span>}
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MainHeader;
