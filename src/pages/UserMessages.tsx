
import React from 'react';
import SecureChat from '@/components/messages/SecureChat';
import { AnimatedBorderCard } from '@/components/messages/AnimatedBorderCard';

const UserMessages = () => {
  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          Chat with the SECURE TRADE FORGE team
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatedBorderCard 
          title="Contact Support" 
          description="Get in touch with our support team via live chat"
        >
          <div className="flex justify-center">
            <SecureChat />
          </div>
        </AnimatedBorderCard>
      </div>
    </div>
  );
};

export default UserMessages;
