
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { JSONBIN_CONFIG, fetchFromJsonBin } from '@/utils/jsonbin-api';

type Message = {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  read: boolean;
};

const UserMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserMessages();
    }
  }, [user]);

  const fetchUserMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetchFromJsonBin(JSONBIN_CONFIG.BINS.MESSAGES);
      if (response && response.record) {
        const allMessages = Array.isArray(response.record) ? response.record : [];
        
        // Filter messages for this user
        const userMessages = allMessages.filter((msg: Message) => 
          msg.recipient === user?.user_id || msg.recipient === 'all');
        
        // Sort by timestamp, newest first
        userMessages.sort((a: Message, b: Message) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setMessages(userMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
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
          View your messages and announcements from Universal Trade
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={fetchUserMessages} disabled={isLoading} variant="outline">
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p>You don't have any messages yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Messages from the Universal Trade team will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className={message.read ? "" : "border-primary"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      {message.sender === 'admin' ? 'Universal Trade Team' : message.sender}
                      {!message.read && (
                        <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>
                      )}
                    </CardTitle>
                    <CardDescription>{formatDate(message.timestamp)}</CardDescription>
                  </div>
                  {message.recipient === 'all' && (
                    <div className="px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                      Announcement
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p>{message.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMessages;
