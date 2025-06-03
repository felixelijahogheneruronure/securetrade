
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
import { toast } from "sonner";
import { JSONBIN_CONFIG, fetchFromJsonBin, fetchMasterBin } from "@/utils/jsonbin-api";

export function NotificationPanel() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from the JSONBin
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First try to use the master bin
      const masterData = await fetchMasterBin();
      let notificationsData;
      
      if (masterData?.record?.notifications) {
        notificationsData = masterData.record.notifications;
      } else {
        // Fallback to the direct notifications bin
        const res = await fetchFromJsonBin(JSONBIN_CONFIG.BINS.NOTIFICATIONS);
        notificationsData = res.record?.notifications || [];
      }
      
      if (Array.isArray(notificationsData)) {
        // Filter notifications for this user (general + personal for this user)
        const userNotifications = notificationsData.filter((notif: Notification) => 
          notif.type === "general" || 
          (notif.type === "personal" && notif.recipientId === user.id) ||
          notif.type === "system"
        );
        
        setNotifications(userNotifications);
        
        // Calculate unread count
        const unread = userNotifications.filter((n: Notification) => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        console.log("No notifications found or structure is invalid");
        
        // Create some sample notifications if none are found
        const sampleNotifications: Notification[] = [
          {
            id: "notif_1",
            title: "Welcome to SECURE TRADE",
            message: "Welcome to your trading account. Start trading today!",
            timestamp: new Date().toISOString(),
            isRead: false,
            type: "personal",
            recipientId: user.id
          },
          {
            id: "notif_2",
            title: "Platform Maintenance",
            message: "Scheduled maintenance will occur this weekend.",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            isRead: false,
            type: "general"
          }
        ];
        setNotifications(sampleNotifications);
        setUnreadCount(2);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
      
      // Set default notifications as fallback
      const fallbackNotifications: Notification[] = [
        {
          id: "notif_fallback_1",
          title: "Welcome to SECURE TRADE",
          message: "Your account has been set up successfully.",
          timestamp: new Date().toISOString(),
          isRead: false,
          type: "personal",
          recipientId: user.id
        }
      ];
      setNotifications(fallbackNotifications);
      setUnreadCount(1);
    } finally {
      setLoading(false);
    }
  };

  // Update notifications in the JSONBin
  const updateNotifications = async (updatedNotification: Notification) => {
    try {
      // First try to use the master bin
      const masterData = await fetchMasterBin();
      let notificationsUrl;
      let allNotifications = [];
      
      if (masterData?.record?.notificationsUrl) {
        notificationsUrl = masterData.record.notificationsUrl;
        const notificationsData = await fetchFromJsonBin(notificationsUrl);
        allNotifications = Array.isArray(notificationsData.record) ? notificationsData.record : [];
      } else {
        // Fallback to the direct notifications bin
        const res = await fetchFromJsonBin(JSONBIN_CONFIG.BINS.NOTIFICATIONS);
        notificationsUrl = JSONBIN_CONFIG.BINS.NOTIFICATIONS;
        allNotifications = Array.isArray(res.record?.notifications) ? res.record.notifications : [];
      }
      
      // Update the specific notification
      const updatedNotifications = allNotifications.map((notif: Notification) => 
        notif.id === updatedNotification.id ? updatedNotification : notif
      );
      
      // Save back to JSONBin
      await fetchFromJsonBin(notificationsUrl); // To ensure we have latest before update
      
      // Update the bin with new notifications
      await fetch(notificationsUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_CONFIG.MASTER_KEY,
          'X-Access-Key': JSONBIN_CONFIG.ACCESS_KEY
        },
        body: JSON.stringify({ 
          notifications: updatedNotifications 
        })
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => notif.id === updatedNotification.id ? updatedNotification : notif)
      );
      
      // Recalculate unread count
      const unread = updatedNotifications.filter((n: Notification) => 
        !n.isRead && 
        (n.type === "general" || 
         (n.type === "personal" && n.recipientId === user?.id) ||
         n.type === "system")
      ).length;
      
      setUnreadCount(unread);
      
    } catch (error) {
      console.error("Failed to update notifications:", error);
      toast.error("Failed to update notification status");
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
    
    toast.success("Notification marked as read");
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
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px]">
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
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
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
