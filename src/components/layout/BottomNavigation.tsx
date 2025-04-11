
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare, ListTodo, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/habits', icon: <CheckSquare className="h-5 w-5" />, label: 'Habits' },
    { path: '/todos', icon: <ListTodo className="h-5 w-5" />, label: 'Todos' },
    { path: '/notes', icon: <FileText className="h-5 w-5" />, label: 'Notes' },
    { path: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={cn(
              "flex flex-col items-center py-3 px-5 flex-1",
              isActive(item.path) 
                ? "text-brand-purple" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
