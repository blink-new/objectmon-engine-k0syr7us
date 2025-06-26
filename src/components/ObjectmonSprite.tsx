import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ObjectmonSpecies } from '@/engine/ObjectmonEngine';

interface ObjectmonSpriteProps {
  species: ObjectmonSpecies;
  isShiny?: boolean;
  animation?: 'idle' | 'walk' | 'attack' | 'faint';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Procedural sprite generation for household objects
const generateObjectmonSprite = (species: ObjectmonSpecies): string => {
  // This would normally be a complex pixel art generator
  // For now, we'll use emoji representations with CSS styling
  const spriteMap: Record<string, string> = {
    'Toaster': '🍞',
    'Mug': '☕',
    'Lamp': '💡',
    'Fork': '🍴',
    'Spoon': '🥄',
    'Plate': '🍽️',
    'Pot': '🫖',
    'Clock': '🕐',
    'Phone': '📱',
    'Remote': '📺',
  };

  return spriteMap[species.name] || '📦';
};

export const ObjectmonSprite: React.FC<ObjectmonSpriteProps> = ({
  species,
  isShiny,
  animation = 'idle',
  size = 'medium',
  className
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const sprite = generateObjectmonSprite(species);

  const shinyEffectClasses = isShiny ? "hue-rotate-60 saturate-150" : "";
  const shinyFilterStyle = isShiny ? 'hue-rotate(60deg) saturate(1.5) brightness(1.2)' : 'none';

  useEffect(() => {
    if (animation === 'idle') {
      const interval = setInterval(() => {
        setCurrentFrame(frame => (frame + 1) % 4);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [animation]);

  const sizeClasses = {
    small: 'text-2xl w-8 h-8',
    medium: 'text-4xl w-16 h-16',
    large: 'text-6xl w-24 h-24'
  };

  const animationClasses = {
    idle: 'animate-bounce',
    walk: 'animate-pulse',
    attack: 'animate-ping',
    faint: 'opacity-50 grayscale'
  };

  return (
    <div className={cn(
      "flex items-center justify-center",
      "pixelated", // Custom CSS class for pixel-perfect rendering
      sizeClasses[size],
      animationClasses[animation],
      shinyEffectClasses,
      className
    )}>
      <div 
        className={cn(
          "flex items-center justify-center",
          "bg-green-100 border-2 border-green-800 rounded-lg",
          "shadow-inner",
          sizeClasses[size]
        )}
        style={{
          filter: shinyFilterStyle,
          transform: animation === 'attack' ? `scale(${1 + Math.sin(currentFrame) * 0.1})` : 'none'
        }}
      >
        {sprite}
      </div>
    </div>
  );
};