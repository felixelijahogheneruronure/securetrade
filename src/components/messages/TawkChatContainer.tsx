import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';

type TawkChatContainerProps = {
  className?: string;
};

export const TawkChatContainer: React.FC<TawkChatContainerProps> = ({ className }) => {
  const { user } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      const existingScripts = chatContainerRef.current.querySelectorAll('script');
      existingScripts.forEach(script => {
        script.parentNode?.removeChild(script);
      });

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();
        Tawk_API.embedded='chat';
        (function(){
          var s1 = document.createElement("script"),
              s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = 'https://embed.tawk.to/681f2e4a9c7ecf190fb1bc2f/default';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        })();
      `;

      chatContainerRef.current.appendChild(script);
    }

    return () => {
      if (chatContainerRef.current) {
        const scripts = chatContainerRef.current.querySelectorAll('script');
        scripts.forEach(script => {
          script.parentNode?.removeChild(script);
        });
      }
    };
  }, [user]);

  return (
    <div 
      id="chat"
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