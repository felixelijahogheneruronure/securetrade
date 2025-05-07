
import React, { useEffect } from 'react';
import { useScript } from "@/hooks/use-script";

export function TradeNotifications() {
  // Load jQuery if not already loaded
  const jqueryStatus = useScript("https://code.jquery.com/jquery-3.7.1.min.js");
  
  useEffect(() => {
    // Wait until jQuery is loaded
    if (jqueryStatus === 'ready' && typeof window.jQuery !== 'undefined') {
      // Make sure our notification container exists
      if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        
        const notificationEl = document.createElement('div');
        notificationEl.id = 'notification-1';
        container.appendChild(notificationEl);
        
        document.body.appendChild(container);
      }
      
      // Initialize notifications if they haven't been already
      if (window.jQuery.fn.Notification) {
        window.jQuery('#notification-1').Notification({
          Varible1: [
            "Dirk", "Johnny", "Watkin", "Alejandro", "Vina", "Tony", "Ahmed", "Jackson", "Noah", 
            "João", "Mateus", "Gabriel", "Rafael", "Thiago", "Enzo", "Caio", "Bruno", "Leonardo",
            "André", "Daniel", "Vinícius", "Henrique", "Sofia", "Beatriz", "Júlia", "Larissa"
          ],
          Varible2: [
            "USA", "UAE", "ITALY", "MEXICO", "INDIA", "BRAZIL", "ARGENTINA", "SPAIN", "FRANCE",
            "THAILAND", "VIETNAM", "TURKEY", "SINGAPORE", "COLOMBIA", "CHILE", "GERMANY"
          ],
          Amount: [1000, 2500, 5550, 6660, 4454, 3833, 6969, 3200, 4750, 1020],
          Content: '[Varible1] from [Varible2] just earned <b>$[Amount]</b>!',
          Show: ['stable', 7, 12],
          Close: 6,
          Background: '#000000',
          BorderRadius: 8,
          BorderWidth: 1,
          BorderColor: '#ffc552',
          TextColor: 'white',
          IconColor: '#ffffff',
          // Random positioning
          LocationTop: [Math.random() > 0.5, Math.floor(Math.random() * 70) + '%'],
          LocationBottom: [Math.random() > 0.5, Math.floor(Math.random() * 30) + '%'],
          LocationRight: [Math.random() > 0.5, Math.floor(Math.random() * 30) + '%'],
          LocationLeft: [Math.random() > 0.5, Math.floor(Math.random() * 30) + '%'],
          // Random animations
          AnimationEffectOpen: ['fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight'][Math.floor(Math.random() * 5)],
          AnimationEffectClose: ['fadeOut', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight'][Math.floor(Math.random() * 5)],
          Number: 80,
          Link: [false, 'https://securetrade.live', '_blank']
        });
      }
    }
  }, [jqueryStatus]);
  
  // This component doesn't render anything visible - it just initializes the notifications
  return null;
}

// Add type definitions for jQuery plugin
declare global {
  interface JQuery {
    Notification: (options: any) => JQuery;
  }
  interface Window {
    jQuery: any & {
      fn: {
        Notification: any
      }
    };
  }
}
