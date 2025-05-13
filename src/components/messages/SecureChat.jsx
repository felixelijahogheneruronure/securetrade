import React, { useEffect } from 'react';
import './SecureChat.css'; // We will move styles here

const SecureChat = () => {
  useEffect(() => {
    const bootTimeout = setTimeout(() => {
      document.getElementById('bootScreen').style.display = 'none';
      document.getElementById('chat').classList.add('show-chat');
      loadChatWidget();
    }, 3000);

    function loadChatWidget() {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.embedded = 'chat';

      const script = document.createElement('script');
      script.src = 'https://embed.tawk.to/681f2e4a9c7ecf190fb1bc2f/default';
      script.async = true;
      script.charset = 'UTF-8';
      script.crossOrigin = '*';

      script.onload = function () {
        const adjustIframe = () => {
          const iframe = document.querySelector("iframe[title='chat widget']");
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
    <div className="phone">
      <div className="rgb-lights"></div>
      <div className="screen">
        <div className="notch"></div>

        <div className="boot-sequence" id="bootScreen">
          <div className="vfx-text">SECURE TRADE FORGE</div>
          <div className="loading-ring"></div>
        </div>

        <div id="chat"></div>
      </div>
    </div>
  );
};

export default SecureChat;