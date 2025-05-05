
import { useState, useEffect } from "react";
import { 
  Bell,
  ChevronDown, 
  Plus, 
  Trash2, 
  Users, 
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/components/notifications/notification-item";

export function NotificationManagement() {
  const { getUsers } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notificationType, setNotificationType] = useState<"general" | "personal">("general");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  async function fetchUsers() {
    try {
      const fetchedUsers = await getUsers();
      // Filter out admin users
      const regularUsers = fetchedUsers.filter(user => !user.isAdmin && user.email !== 'admin@admin.com');
      setUsers(regularUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  async function fetchNotifications() {
    setIsLoading(true);
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
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        type: "personal",
        recipientId: "user123"
      },
      {
        id: "3",
        title: "New feature available",
        message: "Check out our new crypto wallet feature that's now available!",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        isRead: false,
        type: "general"
      }
    ];
    
    setNotifications(mockNotifications);
    setIsLoading(false);
  }

  const handleCreateNotification = () => {
    if (!title || !message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (notificationType === "personal" && !selectedUser) {
      toast({
        title: "No recipient selected",
        description: "Please select a recipient for the personal notification.",
        variant: "destructive"
      });
      return;
    }

    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: notificationType,
      ...(notificationType === "personal" && { recipientId: selectedUser })
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Reset form
    setTitle("");
    setMessage("");
    setSelectedUser("");
    setIsDialogOpen(false);
    
    toast({
      title: "Notification created",
      description: `The ${notificationType} notification has been created successfully.`,
      duration: 3000
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted successfully.",
      duration: 3000
    });
  };

  const generalNotifications = notifications.filter(n => n.type === "general");
  const personalNotifications = notifications.filter(n => n.type === "personal");

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notification Management</h2>
        <div className="flex items-center gap-2">
          <Button onClick={fetchNotifications} variant="outline" size="sm">Refresh</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>
                  Create a new notification for your users. You can choose between general announcements or personal notifications.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="notification-type">Notification Type</Label>
                  <Select 
                    value={notificationType} 
                    onValueChange={(value) => setNotificationType(value as "general" | "personal")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Announcement</SelectItem>
                      <SelectItem value="personal">Personal Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {notificationType === "personal" && (
                  <div className="grid gap-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.user_id} value={user.user_id}>
                            {user.username || user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Notification title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Write your notification message here..."
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>
                  Create Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              General Announcements
            </CardTitle>
            <CardDescription>
              Announcements that will be sent to all users on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generalNotifications.length > 0 ? (
              <div className="space-y-2">
                {generalNotifications.map(notification => (
                  <Collapsible key={notification.id} className="border rounded-md">
                    <CollapsibleTrigger className="flex w-full justify-between items-center p-3 hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <div>
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">General</Badge>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-t p-3">
                      <p className="text-sm mb-3">{notification.message}</p>
                      <div className="flex justify-end">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No general announcements yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Notifications
            </CardTitle>
            <CardDescription>
              Notifications that have been sent to specific users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {personalNotifications.length > 0 ? (
              <div className="space-y-2">
                {personalNotifications.map(notification => {
                  const recipient = users.find(user => user.user_id === notification.recipientId);
                  
                  return (
                    <Collapsible key={notification.id} className="border rounded-md">
                      <CollapsibleTrigger className="flex w-full justify-between items-center p-3 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Bell className="h-4 w-4 text-purple-600" />
                          <div>
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              To: {recipient ? (recipient.username || recipient.email) : 'Unknown User'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Personal</Badge>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="border-t p-3">
                        <p className="text-sm mb-3">{notification.message}</p>
                        <div className="flex justify-end">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No personal notifications yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
