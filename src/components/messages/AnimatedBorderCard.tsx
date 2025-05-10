
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AnimatedBorderCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const AnimatedBorderCard: React.FC<AnimatedBorderCardProps> = ({ 
  title, 
  description, 
  children 
}) => {
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

  return (
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
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};
