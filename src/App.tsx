import React, { useEffect, useRef } from 'react';
import { GameBoyScreen } from './components/GameBoyScreen';
import { GameLoop } from './engine/GameLoop';
import { Graphics } from './engine/Graphics';
import { Input } from './engine/Input';
import { Tilemap } from './engine/Tilemap';
import { Sprite } from './engine/Sprite';
import { ImageGenerator } from './engine/ImageGenerator';

const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;

const mapData = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 3, 3, 3, 2, 3, 3, 2, 1],
  [1, 2, 3, 4, 3, 2, 3, 4, 2, 1],
  [1, 2, 3, 3, 3, 2, 3, 3, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function App() {
  const gameLoopRef = useRef<GameLoop | null>(null);

  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    const graphics = new Graphics(canvas);
    const input = new Input();
    
    // Generate images as data URLs
    const tilesetDataUrl = ImageGenerator.generateTileset();
    const playerDataUrl = ImageGenerator.generatePlayerSprite();
    
    const tilemap = new Tilemap(tilesetDataUrl, mapData, 16);
    const player = new Sprite(playerDataUrl, 80, 48, 16, 16);

    player.addAnimation('idle', [0]);
    player.addAnimation('walkDown', [0, 1, 2, 3]);
    player.addAnimation('walkUp', [4, 5, 6, 7]);
    player.addAnimation('walkLeft', [8, 9, 10, 11]);
    player.addAnimation('walkRight', [12, 13, 14, 15]);

    const update = (deltaTime: number) => {
      const speed = 50; // pixels per second
      let isMoving = false;

      if (input.isKeyDown('ArrowUp')) {
        player.y -= speed * deltaTime;
        player.setAnimation('walkUp');
        isMoving = true;
      }
      if (input.isKeyDown('ArrowDown')) {
        player.y += speed * deltaTime;
        player.setAnimation('walkDown');
        isMoving = true;
      }
      if (input.isKeyDown('ArrowLeft')) {
        player.x -= speed * deltaTime;
        player.setAnimation('walkLeft');
        isMoving = true;
      }
      if (input.isKeyDown('ArrowRight')) {
        player.x += speed * deltaTime;
        player.setAnimation('walkRight');
        isMoving = true;
      }

      if (!isMoving) {
        player.setAnimation('idle');
      }

      player.update(deltaTime);
    };

    const render = () => {
      graphics.clear();
      tilemap.draw(graphics);
      player.draw(graphics);
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