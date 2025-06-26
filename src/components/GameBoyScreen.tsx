import React from 'react';
import { cn } from '@/lib/utils';

interface GameBoyScreenProps {
  children: React.ReactNode;
  className?: string;
}

export const GameBoyScreen: React.FC<GameBoyScreenProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "relative w-full max-w-md mx-auto",
      "bg-gradient-to-b from-green-100 to-green-200",
      "border-8 border-green-800",
      "rounded-2xl shadow-2xl",
      "aspect-[3/4]",
      className
    )}>
      {/* Screen bezel */}
      <div className="absolute inset-4 bg-black rounded-lg shadow-inner">
        {/* Actual screen */}
        <div className="relative h-full w-full bg-green-50 rounded-md overflow-hidden border-2 border-green-900">
          {/* Scan lines effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent bg-repeat-y animate-pulse opacity-30" 
               style={{ backgroundSize: '100% 4px' }} />
          
          {/* Screen content */}
          <div className="relative z-10 h-full w-full p-2">
            {children}
          </div>
        </div>
      </div>
      
      {/* Game Boy styling elements */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-green-700 rounded-full shadow-inner" />
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-green-700 rounded-full" />
    </div>
  );
};