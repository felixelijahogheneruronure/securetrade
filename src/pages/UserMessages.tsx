
import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { JSONBIN_CONFIG, fetchFromJsonBin, fetchMasterBin } from '@/utils/jsonbin-api';

type Message = {
  id: string;
  sender: string;
  senderName?: string;
  senderRole?: 'user' | 'admin';
  recipient: string;
  content: string;
  timestamp: string;
  read: boolean;
};

const UserMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const tawkContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('messages');

  useEffect(() => {
    if (user) {
      fetchUserMessages();
    }
  }, [user]);

  // Initialize Tawk.to chat
  useEffect(() => {
    if (!tawkContainerRef.current || activeTab !== 'livechat') return;

    // Remove any existing scripts first
    const existingScripts = tawkContainerRef.current.querySelectorAll('script');
    existingScripts.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });

    // Create and add the Tawk script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      var Tawk_API = Tawk_API || {};
      var Tawk_LoadStart = new Date();
      (function(){
        var s1 = document.createElement("script"),
            s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/681dfb58ff215a190bf9c3f4/default';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
      })();
    `;
    
    tawkContainerRef.current.appendChild(script);
    
    return () => {
      // Clean up - remove script when component unmounts
      if (tawkContainerRef.current) {
        const scripts = tawkContainerRef.current.querySelectorAll('script');
        scripts.forEach(script => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        });
      }
    };
  }, [activeTab]);

  const fetchUserMessages = async () => {
    setIsLoading(true);
    try {
      // Attempt to use master bin first
      const masterData = await fetchMasterBin();
      let messagesData;
      
      if (masterData?.record?.messages) {
        // Use messages from master bin
        messagesData = masterData.record.messages;
      } else {
        // Fallback to direct bin
        const response = await fetchFromJsonBin(JSONBIN_CONFIG.BINS.MESSAGES);
        messagesData = response.record || [];
      }
      
      if (Array.isArray(messagesData)) {
        // Filter messages for this user
        const userMessages = messagesData.filter((msg: Message) => 
          msg.recipient === user?.user_id || 
          msg.recipient === 'all' ||
          msg.sender === user?.user_id
        );
        
        // Sort by timestamp, newest first
        userMessages.sort((a: Message, b: Message) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setMessages(userMessages);
        
        // Mark messages as read
        userMessages.forEach(async msg => {
          if (!msg.read && msg.recipient === user?.user_id) {
            await updateMessageReadStatus(msg.id);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessageReadStatus = async (messageId: string) => {
    try {
      // Get messages either from master bin or direct bin
      const masterData = await fetchMasterBin();
      let messagesUrl;
      let allMessages = [];
      
      if (masterData?.record?.messagesUrl) {
        messagesUrl = masterData.record.messagesUrl;
        const messagesData = await fetchFromJsonBin(messagesUrl);
        allMessages = messagesData.record || [];
      } else {
        const response = await fetchFromJsonBin(JSONBIN_CONFIG.BINS.MESSAGES);
        messagesUrl = JSONBIN_CONFIG.BINS.MESSAGES;
        allMessages = response.record || [];
      }
      
      // Update the message
      const updatedMessages = allMessages.map((msg: Message) => 
        msg.id === messageId ? { ...msg, read: true } : msg
      );
      
      // Save updated messages
      await fetch(messagesUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_CONFIG.MASTER_KEY,
          'X-Access-Key': JSONBIN_CONFIG.ACCESS_KEY
        },
        body: JSON.stringify(updatedMessages)
      });
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
      
    } catch (error) {
      console.error('Error updating message read status:', error);
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create new message
      const message: Message = {
        id: messageId,
        sender: user?.user_id || '',
        senderName: user?.username || user?.email || '',
        senderRole: 'user',
        recipient: 'admin', // Send to admin by default
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Get messages bin URL either from master or use direct
      const masterData = await fetchMasterBin();
      let messagesUrl;
      let currentMessages = [];
      
      if (masterData?.record?.messagesUrl) {
        messagesUrl = masterData.record.messagesUrl;
        const messagesData = await fetchFromJsonBin(messagesUrl);
        currentMessages = messagesData.record || [];
      } else {
        messagesUrl = JSONBIN_CONFIG.BINS.MESSAGES;
        const response = await fetchFromJsonBin(messagesUrl);
        currentMessages = response.record || [];
      }
      
      // Add new message to array
      const updatedMessages = [...currentMessages, message];
      
      // Update the messages bin
      await fetch(messagesUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_CONFIG.MASTER_KEY,
          'X-Access-Key': JSONBIN_CONFIG.ACCESS_KEY
        },
        body: JSON.stringify(updatedMessages)
      });
      
      // Add message to local state
      setMessages(prev => [message, ...prev]);
      setNewMessage('');
      toast.success('Message sent to SECURE TRADE FORGE team');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          View your messages and announcements from SECURE TRADE FORGE
        </p>
      </div>

      <Tabs defaultValue="messages" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="livechat">Live Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages">
          <div className="grid grid-cols-1 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-red-600/10 dark:bg-red-900/20 pb-4">
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Contact the SECURE TRADE FORGE team with any questions or concerns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={sendMessage} className="space-y-4">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="min-h-[100px]"
                  />
                  <Button 
                    type="submit" 
                    disabled={sending || !newMessage.trim()} 
                    className="bg-red-600 hover:bg-red-700 text-white float-right"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mt-8 mb-4">
            <h3 className="text-2xl font-bold">Message History</h3>
            <Button onClick={fetchUserMessages} disabled={isLoading} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
            </div>
          ) : messages.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>You don't have any messages yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Messages from the SECURE TRADE FORGE team will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card 
                  key={message.id} 
                  className={cn(
                    message.read ? "border-border" : "border-red-500",
                    message.sender === user?.user_id ? "bg-red-50/10" : "bg-card"
                  )}
                >
                  <CardHeader className="pb-2 flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center text-lg">
                        {message.sender === user?.user_id 
                          ? "You" 
                          : message.sender === "admin" 
                            ? "SECURE TRADE FORGE Team" 
                            : message.senderName || message.sender}
                        {!message.read && message.recipient === user?.user_id && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-red-600"></span>
                        )}
                      </CardTitle>
                      <CardDescription>{formatDate(message.timestamp)}</CardDescription>
                    </div>
                    {message.recipient === 'all' && (
                      <div className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        Announcement
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="livechat">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat Support</CardTitle>
              <CardDescription>Chat directly with our support team in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                ref={tawkContainerRef} 
                className="h-[600px] bg-card rounded-lg border border-border"
              >
                {/* Tawk.to will be injected here */}
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Loading chat support...
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function for class name conditionals
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default UserMessages;
