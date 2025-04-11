
import React from 'react';
import { X, BellRing, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/types';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const NotificationItem = ({ notification, onRead, onDelete }: { 
  notification: Notification, 
  onRead: () => void, 
  onDelete: () => void 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'habit':
        return <CheckCircle2 className="h-5 w-5 text-brand-purple" />;
      case 'todo':
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case 'note':
        return <Info className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className={cn(
      "p-4 border rounded-md mb-3 bg-card",
      !notification.read ? "border-brand-purple" : "border-border"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {getIcon()}
          <div>
            <h4 className="font-medium">{notification.title}</h4>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(notification.createdAt), 'MMM d, yyyy - h:mm a')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!notification.read && (
            <Button size="sm" variant="ghost" onClick={onRead}>
              Mark as read
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const NotificationPanel = ({ 
  onClose, 
  className = "" 
}: { 
  onClose: () => void, 
  className?: string 
}) => {
  const { notifications, markNotificationAsRead, deleteNotification } = useData();

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
  };

  return (
    <div className={cn(
      "fixed top-0 right-0 w-80 h-full bg-background border-l shadow-lg z-40",
      className
    )}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          <h3 className="font-medium">Notifications</h3>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {notifications.filter(n => !n.read).length} unread notifications
          </p>
          <Button size="sm" variant="outline" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
                onRead={() => markNotificationAsRead(notification.id)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationPanel;
