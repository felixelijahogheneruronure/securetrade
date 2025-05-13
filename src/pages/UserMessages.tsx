import React from 'react';
import SecureChat from '@/components/messages/SecureChat'; // Make sure this path is correct
import { AnimatedBorderCard } from '@/components/messages/AnimatedBorderCard';

const UserMessages = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          Chat with the SECURE TRADE FORGE team
        </p>
      </div>

      {/* Boot sequence container */}
      <div className="boot-sequence" id="bootScreen">
        <div className="vfx-text">SECURE TRADE FORGE</div>
        <div className="loading-ring"></div>
      </div>

      {/* Chat container */}
      <div id="chat">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <AnimatedBorderCard 
            title="Contact Support" 
            description="Get in touch with our support team via live chat"
          >
            <SecureChat />
          </AnimatedBorderCard>
        </div>
      </div>
    </div>
  );
};

export default UserMessages;