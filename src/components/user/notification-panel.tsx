
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

// New JSONBin constants for notifications
const NOTIFICATIONS_BIN_ID = '681569db8a456b7966967337';
const MASTER_KEY = '$2a$10$a93Wz14f/5DUCwACUbuF6eLnVRO4UhHPzsOg38B1qo9ikgHYFHRtG';

export function NotificationPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from the new JSONBin
  const fetchNotifications = async () => {
    if (user) {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${NOTIFICATIONS_BIN_ID}/latest`, {
          headers: {
            'X-Master-Key': MASTER_KEY
          }
        });
        const data = await res.json();
        
        if (data.record && data.record.notifications) {
          // Filter notifications for this user (general + personal for this user)
          const userNotifications = data.record.notifications.filter((notif: Notification) => 
            notif.type === "general" || 
            (notif.type === "personal" && notif.recipientId === user.user_id) ||
            (notif.type === "system")
          );
          
          setNotifications(userNotifications);
          
          // Calculate unread count
          const unread = userNotifications.filter((n: Notification) => !n.isRead).length;
          setUnreadCount(unread);
        } else {
          // Initialize if no notifications exist
          updateNotifications([]);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive"
        });
      }
    }
  };

  // Update notifications in the JSONBin
  const updateNotifications = async (updatedNotifications: Notification[]) => {
    try {
      // First get all notifications
      const res = await fetch(`https://api.jsonbin.io/v3/b/${NOTIFICATIONS_BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': MASTER_KEY
        }
      });
      const data = await res.json();
      
      const allNotifications = data.record?.notifications || [];
      
      // Update specific notifications that belong to this user
      const otherNotifications = allNotifications.filter((notif: Notification) => 
        (notif.type === "personal" && notif.recipientId !== user?.user_id)
      );
      
      // Combine with updated user notifications
      const newNotifications = [...otherNotifications, ...updatedNotifications];
      
      // Save back to JSONBin
      await fetch(`https://api.jsonbin.io/v3/b/${NOTIFICATIONS_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': MASTER_KEY
        },
        body: JSON.stringify({ notifications: newNotifications })
      });
      
    } catch (error) {
      console.error("Failed to update notifications:", error);
    }
  };

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications();
    
    // Set up periodic refresh
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    
    // Update in JSONBin
    await updateNotifications(updatedNotifications);
    
    // Recalculate unread count
    const updatedUnreadCount = updatedNotifications.filter(n => !n.isRead).length;
    setUnreadCount(updatedUnreadCount);
    
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
      duration: 2000
    });
  };

  const personalNotifications = notifications.filter(n => n.type === "personal");
  const generalNotifications = notifications.filter(n => n.type === "general");
  const systemNotifications = notifications.filter(n => n.type === "system");

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
