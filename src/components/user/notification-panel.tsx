
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationItem, Notification } from "@/components/notifications/notification-item";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

export function NotificationPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate fetching notifications
  useEffect(() => {
    if (user) {
      // This would normally come from an API
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Welcome to our platform",
          message: "Thank you for joining our platform. We're excited to have you here!",
          timestamp: new Date().toISOString(),
          isRead: false,
          type: "general"
        },
        {
          id: "2",
          title: "Your account has been verified",
          message: "Congratulations! Your account has been successfully verified.",
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          isRead: true,
          type: "personal",
          recipientId: user.user_id
        },
        {
          id: "3",
          title: "New feature available",
          message: "Check out our new crypto wallet feature that's now available!",
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          isRead: false,
          type: "general"
        },
        {
          id: "4",
          title: "Security alert",
          message: "We've detected a new login to your account. If this wasn't you, please contact support.",
          timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          isRead: false,
          type: "personal",
          recipientId: user.user_id
        }
      ];
      
      setNotifications(mockNotifications);
      
      // Calculate unread count
      const unread = mockNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    }
  }, [user]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    
    // Recalculate unread count
    const updatedUnreadCount = notifications.filter(n => !n.isRead && n.id !== id).length;
    setUnreadCount(updatedUnreadCount);
    
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
      duration: 2000
    });
  };

  const personalNotifications = notifications.filter(n => n.type === "personal" && n.recipientId === user?.user_id);
  const generalNotifications = notifications.filter(n => n.type === "general");

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px]">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="general">Announcements</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="max-h-[80vh] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No notifications
              </div>
            )}
          </TabsContent>
          <TabsContent value="general" className="max-h-[80vh] overflow-y-auto">
            {generalNotifications.length > 0 ? (
              generalNotifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No announcements
              </div>
            )}
          </TabsContent>
          <TabsContent value="personal" className="max-h-[80vh] overflow-y-auto">
            {personalNotifications.length > 0 ? (
              personalNotifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No personal notifications
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
