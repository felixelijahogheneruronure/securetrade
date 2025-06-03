
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';

type TawkChatContainerProps = {
  className?: string;
};

export const TawkChatContainer: React.FC<TawkChatContainerProps> = ({ className }) => {
  const { user } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Tawk.to chat
  useEffect(() => {
    if (chatContainerRef.current) {
      // Remove any existing scripts first
      const existingScripts = chatContainerRef.current.querySelectorAll('script');
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
        Tawk_API.embedded='tawk_681ef9bc08bed819150db836';
        (function(){
          var s1 = document.createElement("script"),
              s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = 'https://embed.tawk.to/681ef9bc08bed819150db836/1iqsnccte';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        })();
      `;
      
      chatContainerRef.current.appendChild(script);
    }
    
    return () => {
      // Clean up - remove script when component unmounts
      if (chatContainerRef.current) {
        const scripts = chatContainerRef.current.querySelectorAll('script');
        scripts.forEach(script => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        });
      }
    };
  }, [user]);

  return (
    <div 
      id="tawk_681ef9bc08bed819150db836"
      ref={chatContainerRef} 
      className={`bg-card rounded-lg border border-border ${className}`}
      style={{ minHeight: '500px' }}
    >
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading chat support...
      </div>
    </div>
  );
};
