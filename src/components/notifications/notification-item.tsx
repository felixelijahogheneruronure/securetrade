
import { Bell, Check, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "general" | "personal" | "system";
  recipientId?: string; // For personal notifications
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const handleMarkAsRead = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  // Function to get the appropriate icon based on notification type
  const getNotificationIcon = () => {
    switch(notification.type) {
      case "general":
        return <Bell className="h-3 w-3" />;
      case "personal":
        return <MessageSquare className="h-3 w-3" />;
      case "system":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  return (
    <div 
      className={cn(
        "p-4 border-b last:border-b-0 cursor-pointer transition-colors",
        notification.isRead 
          ? "bg-background" 
          : "bg-muted/30 hover:bg-muted/50"
      )}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "mt-0.5 rounded-full p-1.5",
          notification.type === "general" 
            ? "bg-blue-100 text-blue-600" 
            : notification.type === "personal"
              ? "bg-purple-100 text-purple-600"
              : "bg-green-100 text-green-600"
        )}>
          {getNotificationIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className={cn(
              "text-sm font-medium",
              !notification.isRead && "font-semibold"
            )}>
              {notification.title}
            </h4>
            <span className="text-xs text-muted-foreground">
              {new Date(notification.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className={cn(
              "text-xs py-0.5 px-2 rounded-full",
              notification.type === "general" 
                ? "bg-blue-100 text-blue-600" 
                : notification.type === "personal"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-green-100 text-green-600"
            )}>
              {notification.type === "general" 
                ? "Announcement" 
                : notification.type === "personal"
                  ? "Personal"
                  : "System"}
            </span>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
