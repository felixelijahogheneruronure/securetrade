
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

const UserMessages = () => {
  const { user } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [rgbBorderColor, setRgbBorderColor] = useState('rgb(239, 68, 68)'); // Initial red color

  // RGB animation effect
  useEffect(() => {
    const colors = [
      'rgb(239, 68, 68)',   // Red
      'rgb(16, 185, 129)',  // Green
      'rgb(59, 130, 246)'   // Blue
    ];
    let colorIndex = 0;

    const intervalId = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setRgbBorderColor(colors[colorIndex]);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

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
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          Chat with the SECURE TRADE FORGE team
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card 
          className="overflow-hidden" 
          style={{
            borderWidth: '3px',
            borderStyle: 'solid',
            borderColor: rgbBorderColor,
            transition: 'border-color 0.5s ease-in-out'
          }}
        >
          <CardHeader className="bg-red-600/10 dark:bg-red-900/20 pb-4">
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Get in touch with our support team via live chat
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div 
              id="tawk_681ef9bc08bed819150db836"
              ref={chatContainerRef} 
              className="bg-card rounded-lg border border-border"
              style={{
                minHeight: '500px'
              }}
            >
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading chat support...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserMessages;
