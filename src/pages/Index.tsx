
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { TradingViewWidgets } from "@/components/tradingview-widgets";
import { useEffect, useRef } from "react";

const Index = () => {
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const scriptsRef = useRef<HTMLScriptElement[]>([]);
  
  useEffect(() => {
    // Create notification div
    const notificationDiv = document.createElement('div');
    notificationDiv.id = 'notification-1';
    document.body.appendChild(notificationDiv);
    notificationRef.current = notificationDiv;

    // Add jQuery if it's not already loaded
    const jQueryScript = document.createElement('script');
    jQueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js';
    jQueryScript.async = true;
    document.head.appendChild(jQueryScript);
    scriptsRef.current.push(jQueryScript);

    // Add notification plugin script
    const notificationScript = document.createElement('script');
    notificationScript.src = 'https://cdn.jsdelivr.net/gh/nguoianphu/jnotification-jquery-plugin@main/jquery-notification.min.js';
    notificationScript.async = true;
    scriptsRef.current.push(notificationScript);

    // jQuery notification script
    const notificationCodeScript = document.createElement('script');
    scriptsRef.current.push(notificationCodeScript);

    // Make sure jQuery is loaded before our scripts
    jQueryScript.onload = () => {
      document.head.appendChild(notificationScript);
      
      notificationScript.onload = () => {
        notificationCodeScript.innerHTML = `
          $(document).ready(function () {
              const randomPosition = () => {
                  const positions = [
                      { top: '10%', left: '10px' },
                      { top: '30%', left: '10px' },
                      { top: '10%', right: '10px' },
                      { bottom: '10%', left: '10px' },
                      { bottom: '30%', right: '10px' },
                      { top: '20%', right: '10px' },
                      { bottom: '20%', left: '10px' },
                      { top: '50%', left: '50%' }, // center-ish
                  ];
                  return positions[Math.floor(Math.random() * positions.length)];
              };

              function showNotification() {
                  const pos = randomPosition();

                  $('#notification-1').Notification({
                      Varible1: [
                          "Dirk", "Johnny", "Watkin", "Alejandro", "Vina", "Tony", "Ahmed", "Jackson", "Noah", "Aiden", "Darren", "Isabella", "Aria", "John", "Greyson", 
                          "Peter", "Mohammed", "William", "Lucas", "Amelia", "Mason", "Mathew", "Richard", "Chris", "Mia", "Oliver",
                          "João", "Mateus", "Gabriel", "Rafael", "Thiago", "Enzo", "Caio", "Bruno", "Leonardo", "Gustavo", "Felipe", 
                          "André", "Daniel", "Vinícius", "Henrique", "Sofia", "Beatriz", "Júlia", "Larissa", "Camila", "Mariana", "Isadora", 
                          "Ana Clara", "Rafaela", "Bianca", "Letícia", "Vitória", "Manuela", "Fernanda", "Eduardo", "Carla", "Luiz", "Clara", "Giovana"
                      ],
                      Varible2: [
                          "USA", "UAE", "ITALY", "FLORIDA", "MEXICO", "INDIA", "CHINA", "CAMBODIA", "UNITED KINGDOM", "GERMANY",
                          "AUSTRALIA", "BANGLADESH", "SWEDEN", "PAKISTAN", "MALDIVES", "SEYCHELLES", "BOLIVIA", "SOUTH AFRICA",
                          "AFGHANISTAN", "ALBANIA", "ALGERIA", "ANDORRA", "ZAMBIA", "ZIMBABWE", "LEBANON", "SAUDI ARABIA", "CHILE", 
                          "PUERTO RICO", "NIGERIA", "GHANA", "KENYA", "BRAZIL", "ARGENTINA", "SPAIN", "FRANCE", "THAILAND", "VIETNAM", 
                          "TURKEY", "SINGAPORE", "NEPAL", "UGANDA", "MOROCCO", "PHILIPPINES", "ROMANIA", "POLAND", "CUBA", "COLOMBIA"
                      ],
                      Amount: [1000, 2500, 5550, 6660, 4454, 3833, 6969, 3200, 4750, 1020],
                      Content: '[Varible1] from [Varible2] just earned <b>$[Amount]</b>!',
                      Show: ['stable', 7, 12],
                      Close: 6,
                      Time: [0, 23],
                      LocationTop: [!!pos.top, pos.top || ''],
                      LocationBottom: [!!pos.bottom, pos.bottom || ''],
                      LocationRight: [!!pos.right, pos.right || ''],
                      LocationLeft: [!!pos.left, pos.left || ''],
                      Background: '#000000',
                      BorderRadius: 8,
                      BorderWidth: 1,
                      BorderColor: '#ffc552',
                      TextColor: 'white',
                      IconColor: '#ffffff',
                      AnimationEffectOpen: 'fadeInUp',
                      AnimationEffectClose: 'fadeOutDown',
                      Number: 1, // One at a time since it's randomized
                      Link: [false, 'https://dynamictrade.live', '_blank']
                  });
              }

              // Loop to show notifications continuously
              let total = 80; // Total notifications to show
              let counter = 0;
              function loopNotifications() {
                  if (counter >= total) return;
                  showNotification();
                  counter++;
                  const nextDelay = Math.floor(Math.random() * (12000 - 7000 + 1)) + 7000;
                  setTimeout(loopNotifications, nextDelay);
              }

              loopNotifications();
          });
        `;
        document.head.appendChild(notificationCodeScript);
      };
    };

    // Clean up
    return () => {
      if (notificationRef.current && document.body.contains(notificationRef.current)) {
        document.body.removeChild(notificationRef.current);
      }
      
      // Clean up scripts
      scriptsRef.current.forEach(script => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <div>
      <Hero />
      <Features />
      <TradingViewWidgets />
      <Testimonials />
    </div>
  );
};

export default Index;
