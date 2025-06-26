import React, { useEffect, useRef } from 'react';
import { GameBoyScreen } from './components/GameBoyScreen';
import { GameLoop } from './engine/GameLoop';
import { Graphics } from './engine/Graphics';
import { Input } from './engine/Input';
import { STARTER_TOWN_MAP } from './engine/MapData';
import { ImageGenerator } from './engine/ImageGenerator';
import { Overworld } from './engine/Overworld';

const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;

function App() {
  const gameLoopRef = useRef<GameLoop | null>(null);
  const overworldRef = useRef<Overworld | null>(null);

  const handleCanvasReady = async (canvas: HTMLCanvasElement) => {
    const graphics = new Graphics(canvas);
    const input = new Input();
    
    // Generate images as data URLs
    const tilesetDataUrl = ImageGenerator.generateTileset();
    const playerDataUrl = ImageGenerator.generatePlayerSprite();
    
    const overworld = new Overworld(
      graphics,
      input,
      tilesetDataUrl,
      playerDataUrl,
      STARTER_TOWN_MAP,
      16 // Tile size
    );
    overworldRef.current = overworld;

    await overworld.loadAssets();

    const update = (deltaTime: number) => {
      overworld.update(deltaTime);
    };

    const render = () => {
      overworld.draw();
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