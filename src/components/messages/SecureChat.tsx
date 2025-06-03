
import React, { useEffect } from 'react';

// Extend Window interface to include Tawk_API
declare global {
  interface Window {
    Tawk_API?: any;
  }
}

const SecureChat = () => {
  useEffect(() => {
    const bootTimeout = setTimeout(() => {
      const bootScreen = document.getElementById('bootScreen');
      const chat = document.getElementById('chat');
      
      if (bootScreen) {
        bootScreen.style.display = 'none';
      }
      if (chat) {
        chat.classList.add('show-chat');
      }
      
      loadChatWidget();
    }, 3000);

    function loadChatWidget() {
      // Clear any existing Tawk scripts
      const existingScripts = document.querySelectorAll('script[src*="tawk.to"]');
      existingScripts.forEach(script => script.remove());

      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.embedded = 'chat';

      const script = document.createElement('script');
      script.src = 'https://embed.tawk.to/681f2e4a9c7ecf190fb1bc2f/default';
      script.async = true;
      script.charset = 'UTF-8';
      script.crossOrigin = '*';

      script.onload = function () {
        const adjustIframe = () => {
          const iframe = document.querySelector("iframe[title='chat widget']") as HTMLIFrameElement;
          if (iframe) {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
          } else {
            requestAnimationFrame(adjustIframe);
          }
        };
        adjustIframe();
      };

      document.body.appendChild(script);
    }

    return () => clearTimeout(bootTimeout);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[9/16]">
      {/* RGB Border Animation */}
      <div className="absolute inset-[-5px] rounded-[45px] bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500 bg-[length:400%_100%] animate-pulse opacity-90 z-10"></div>
      
      {/* Phone Screen */}
      <div className="relative bg-black rounded-[40px] overflow-hidden z-20 h-full">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[35%] h-5 bg-black rounded-b-xl z-30"></div>

        {/* Boot Sequence */}
        <div 
          className="absolute inset-0 flex flex-col justify-center items-center bg-black z-50 text-white text-center" 
          id="bootScreen"
        >
          <div className="text-lg font-bold uppercase bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8">
            SECURE TRADE FORGE
          </div>
          <div className="w-12 h-12 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin shadow-lg shadow-cyan-400/50"></div>
        </div>

        {/* Chat Container */}
        <div 
          id="chat" 
          className="absolute inset-0 z-40 opacity-0 transition-opacity duration-500"
          style={{ display: 'none' }}
        ></div>
      </div>
    </div>
  );
};

export default SecureChat;
