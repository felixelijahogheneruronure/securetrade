
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  
  const [notifications, setNotifications] = useState({
    email: true,
    promotions: false,
    securityAlerts: true,
    accountActivity: true
  });
  
  const [theme, setTheme] = useState('system');
  
  const handleSaveNotifications = () => {
    // This would typically save to an API
    toast.success('Notification preferences saved');
  };
  
  const handleSaveTheme = () => {
    toast.success(`Theme preference saved: ${theme}`);
  };
  
  const handleSavePassword = () => {
    toast.success('Password updated successfully');
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="account" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  defaultValue={user?.username || ''} 
                  className="max-w-md"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Contact support to change your username
                </p>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  defaultValue={user?.email || ''} 
                  className="max-w-md"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Contact support to change your email
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Tier</CardTitle>
              <CardDescription>
                Your current account tier and benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-medium">
                    Tier {user?.tier || 1}
                  </div>
                  
                  <div className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {user?.tier > 5 ? 'Premium' : 'Standard'}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Contact our support team to learn about upgrading your tier level for additional benefits and features.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" className="max-w-md" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" className="max-w-md" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" className="max-w-md" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePassword}>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your account activity
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="promotional">Promotional Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about promotions and news
                  </p>
                </div>
                <Switch 
                  id="promotional" 
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, promotions: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="security">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about security events
                  </p>
                </div>
                <Switch 
                  id="security" 
                  checked={notifications.securityAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, securityAlerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="activity">Account Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about account activity
                  </p>
                </div>
                <Switch 
                  id="activity" 
                  checked={notifications.accountActivity}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, accountActivity: checked }))}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer flex items-center justify-center ${
                    theme === 'light' ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => setTheme('light')}
                >
                  <div className="text-center">
                    <div className="bg-white dark:bg-white rounded-full h-10 w-10 mx-auto mb-2 flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-red-500"></div>
                    </div>
                    <span>Light</span>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer flex items-center justify-center ${
                    theme === 'dark' ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="text-center">
                    <div className="bg-gray-950 rounded-full h-10 w-10 mx-auto mb-2 flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-red-500"></div>
                    </div>
                    <span>Dark</span>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer flex items-center justify-center ${
                    theme === 'system' ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => setTheme('system')}
                >
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-900 rounded-full h-10 w-10 mx-auto mb-2 flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-red-500"></div>
                    </div>
                    <span>System</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveTheme}>Save Theme</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
