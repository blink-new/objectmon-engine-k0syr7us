import React, { useEffect, useRef } from 'react';
import { GameBoyScreen } from './components/GameBoyScreen';
import { GameLoop } from './engine/GameLoop';
import { Graphics } from './engine/Graphics';
import { Input } from './engine/Input';

const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;

function App() {
  const gameLoopRef = useRef<GameLoop | null>(null);
  const playerRef = useRef({ x: 80, y: 72, width: 8, height: 8 });

  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    const graphics = new Graphics(canvas);
    const input = new Input();

    const update = (deltaTime: number) => {
      const speed = 100; // pixels per second
      if (input.isKeyDown('ArrowUp')) {
        playerRef.current.y -= speed * deltaTime;
      }
      if (input.isKeyDown('ArrowDown')) {
        playerRef.current.y += speed * deltaTime;
      }
      if (input.isKeyDown('ArrowLeft')) {
        playerRef.current.x -= speed * deltaTime;
      }
      if (input.isKeyDown('ArrowRight')) {
        playerRef.current.x += speed * deltaTime;
      }
    };

    const render = () => {
      graphics.clear();
      const player = playerRef.current;
      graphics.drawRect(player.x, player.y, player.width, player.height, 3);
    };

    gameLoopRef.current = new GameLoop(update, render);
    gameLoopRef.current.start();
  };

  useEffect(() => {
    return () => {
      gameLoopRef.current?.stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <GameBoyScreen 
        onCanvasReady={handleCanvasReady} 
        width={SCREEN_WIDTH} 
        height={SCREEN_HEIGHT} 
      />
    </div>
  );
}

export default App;