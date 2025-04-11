
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckSquare,
  ListTodo,
  FileText,
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useData } from '@/context/DataContext';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNavigation from './BottomNavigation';
import { ThemeToggle } from '../theme/ThemeToggle';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/habits', icon: <CheckSquare className="h-5 w-5" />, label: 'Habits' },
    { path: '/todos', icon: <ListTodo className="h-5 w-5" />, label: 'Todos' },
    { path: '/notes', icon: <FileText className="h-5 w-5" />, label: 'Notes' },
    { path: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const sidebar = document.querySelector('[data-sidebar]');
      
      if (isMobileMenuOpen && sidebar && !sidebar.contains(target) && 
          !target.closest('button[data-menu-toggle]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top navigation for mobile */}
      {isMobile && (
        <header className="w-full bg-card border-b p-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            data-menu-toggle
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
          <h1 className="text-xl font-bold">Daily Drive</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
        </header>
      )}
      
      <div className="flex flex-1">
        {/* Sidebar for desktop or mobile when menu is open */}
        {(!isMobile || isMobileMenuOpen) && (
          <aside 
            data-sidebar
            className={cn(
              "bg-card border-r flex flex-col z-30",
              isMobile ? "fixed inset-y-0 left-0 w-64 animate-in slide-in-from-left" : "w-64"
            )}
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold">Daily Drive</h1>
              <p className="text-muted-foreground text-sm">Track your progress</p>
            </div>
            
            <nav className="flex-1 px-4 py-2">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive(item.path) ? "bg-brand-purple text-white" : ""
                      )}
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {!isMobile && (
              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <ThemeToggle />
                  <Button 
                    variant="outline" 
                    className="flex-1 ml-2 justify-between"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      <span>Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-1">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </aside>
        )}
        
        {/* Main content */}
        <main className={cn(
          "flex-1 p-6 overflow-auto",
          isMobile && "pt-16 pb-20" // Adjust top padding to match header height (16pt)
        )}>
          <Outlet />
        </main>
        
        {/* Notification panel */}
        {showNotifications && (
          <NotificationPanel 
            onClose={() => setShowNotifications(false)} 
            className={isMobile ? "mt-14" : ""}
          />
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
