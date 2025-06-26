// Generate Game Boy-style images as data URLs
export class ImageGenerator {
  static generateTileset(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Game Boy green palette
    const colors = ['#081820', '#346856', '#88c070', '#e0f8d0'];
    
    // Draw different tile types in an 8x8 grid (16x16 tiles)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const tileIndex = row * 8 + col;
        const x = col * 16;
        const y = row * 16;
        
        // Different tile patterns
        switch(tileIndex) {
          case 0: // Wall/Border
            ctx.fillStyle = colors[0];
            ctx.fillRect(x, y, 16, 16);
            ctx.fillStyle = colors[1];
            ctx.fillRect(x + 2, y + 2, 12, 12);
            break;
          case 1: // Grass
            ctx.fillStyle = colors[2];
            ctx.fillRect(x, y, 16, 16);
            // Add grass pattern
            ctx.fillStyle = colors[3];
            for (let i = 0; i < 4; i++) {
              for (let j = 0; j < 4; j++) {
                if ((i + j) % 2 === 0) {
                  ctx.fillRect(x + i * 4, y + j * 4, 4, 4);
                }
              }
            }
            break;
          case 2: // Path
            ctx.fillStyle = colors[3];
            ctx.fillRect(x, y, 16, 16);
            ctx.fillStyle = colors[2];
            ctx.fillRect(x + 1, y + 1, 14, 14);
            break;
          case 3: // Water
            ctx.fillStyle = colors[1];
            ctx.fillRect(x, y, 16, 16);
            // Add wave pattern
            ctx.fillStyle = colors[0];
            ctx.beginPath();
            ctx.moveTo(x, y + 8);
            ctx.quadraticCurveTo(x + 4, y + 6, x + 8, y + 8);
            ctx.quadraticCurveTo(x + 12, y + 10, x + 16, y + 8);
            ctx.stroke();
            break;
          default:
            // Default tile
            ctx.fillStyle = colors[2];
            ctx.fillRect(x, y, 16, 16);
        }
      }
    }
    
    return canvas.toDataURL('image/png');
  }
  
  static generatePlayerSprite(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    
    // Game Boy green palette
    const colors = ['#081820', '#346856', '#88c070', '#e0f8d0'];
    
    // Generate 16 frames (4 directions x 4 frames each)
    for (let i = 0; i < 16; i++) {
      const x = i * 16;
      const y = 0;
      const direction = Math.floor(i / 4); // 0=down, 1=up, 2=left, 3=right
      const frame = i % 4;
      
      // Clear frame area
      ctx.fillStyle = 'transparent';
      ctx.clearRect(x, y, 16, 16);
      
      // Draw simple character
      // Body
      ctx.fillStyle = colors[1];
      ctx.fillRect(x + 5, y + 8, 6, 6);
      
      // Head
      ctx.fillStyle = colors[0];
      ctx.fillRect(x + 6, y + 4, 4, 4);
      
      // Eyes based on direction
      ctx.fillStyle = colors[3];
      switch(direction) {
        case 0: // Down
          ctx.fillRect(x + 6, y + 6, 1, 1);
          ctx.fillRect(x + 9, y + 6, 1, 1);
          break;
        case 1: // Up
          ctx.fillRect(x + 6, y + 5, 1, 1);
          ctx.fillRect(x + 9, y + 5, 1, 1);
          break;
        case 2: // Left
          ctx.fillRect(x + 6, y + 5, 1, 1);
          ctx.fillRect(x + 6, y + 6, 1, 1);
          break;
        case 3: // Right
          ctx.fillRect(x + 9, y + 5, 1, 1);
          ctx.fillRect(x + 9, y + 6, 1, 1);
          break;
      }
      
      // Walking animation (move feet)
      if (frame === 1 || frame === 3) {
        ctx.fillStyle = colors[0];
        ctx.fillRect(x + 5, y + 14, 2, 2);
        ctx.fillRect(x + 9, y + 14, 2, 2);
      } else {
        ctx.fillStyle = colors[0];
        ctx.fillRect(x + 6, y + 14, 2, 2);
        ctx.fillRect(x + 8, y + 14, 2, 2);
      }
    }
    
    return canvas.toDataURL('image/png');
  }
}