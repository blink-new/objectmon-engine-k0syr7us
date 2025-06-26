import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GameBoyScreenProps {
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  width: number;
  height: number;
}

export const GameBoyScreen: React.FC<GameBoyScreenProps> = ({ onCanvasReady, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  return (
    <div className={cn(
      "relative w-full max-w-sm mx-auto",
      "bg-gray-300 p-6 rounded-2xl shadow-2xl border-4 border-gray-400",
      "flex flex-col items-center"
    )}>
      <div className="w-full bg-black p-4 rounded-lg shadow-inner">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-auto pixelated bg-[#9bbc0f]"
        />
      </div>
      <div className="mt-6 text-center">
        <h1 className="text-2xl font-bold text-gray-700 font-mono">OBJECTMON</h1>
      </div>
    </div>
  );
};