
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

// Updated JSONBin constants for notifications
const NOTIFICATIONS_BIN_URL = 'https://api.jsonbin.io/v3/b/681886c68960c979a593b1c6';
const MASTER_KEY = '$2a$10$a93Wz14f/5DUCwACUbuF6eLnVRO4UhHPzsOg38B1qo9ikgHYFHRtG';
const ACCESS_KEY = '$2a$10$ZBvH0BxKCETxq1zcx60ufuO/YIMH63mLSnUcAIxa5sp1DZ72ZDnNS';

export function NotificationPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from the JSONBin
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${NOTIFICATIONS_BIN_URL}/latest`, {
        headers: {
          'X-Master-Key': MASTER_KEY,
          'X-Access-Key': ACCESS_KEY
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch notifications: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.record && Array.isArray(data.record.notifications)) {
        // Filter notifications for this user (general + personal for this user)
        const userNotifications = data.record.notifications.filter((notif: Notification) => 
          notif.type === "general" || 
          (notif.type === "personal" && notif.recipientId === user.user_id) ||
          notif.type === "system"
        );
        
        setNotifications(userNotifications);
        
        // Calculate unread count
        const unread = userNotifications.filter((n: Notification) => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        // If notifications array doesn't exist, initialize it
        console.log("No notifications found in JSONBin or structure is invalid");
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Update notifications in the JSONBin
  const updateNotifications = async (updatedNotification: Notification) => {
    try {
      // First get all notifications
      const res = await fetch(`${NOTIFICATIONS_BIN_URL}/latest`, {
        headers: {
          'X-Master-Key': MASTER_KEY,
          'X-Access-Key': ACCESS_KEY
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch notifications: ${res.status}`);
      }
      
      const data = await res.json();
      
      const allNotifications = Array.isArray(data.record?.notifications) ? data.record.notifications : [];
      
      // Update the specific notification
      const updatedNotifications = allNotifications.map((notif: Notification) => 
        notif.id === updatedNotification.id ? updatedNotification : notif
      );
      
      // Save back to JSONBin
      const updateRes = await fetch(`${NOTIFICATIONS_BIN_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': MASTER_KEY,
          'X-Access-Key': ACCESS_KEY
        },
        body: JSON.stringify({ 
          ...data.record,
          notifications: updatedNotifications 
        })
      });
      
      if (!updateRes.ok) {
        throw new Error(`Failed to update notifications: ${updateRes.status}`);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => notif.id === updatedNotification.id ? updatedNotification : notif)
      );
      
    } catch (error) {
      console.error("Failed to update notifications:", error);
      toast({
        title: "Error",
        description: "Failed to update notification status",
        variant: "destructive"
      });
    }
  };

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up periodic refresh
      const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;
    
    const updatedNotification = { ...notification, isRead: true };
    updateNotifications(updatedNotification);
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
    
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
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px]">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
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
        )}
      </SheetContent>
    </Sheet>
  );
}
