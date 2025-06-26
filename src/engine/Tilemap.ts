import { Graphics } from './Graphics';

export class Tilemap {
  private tileset: HTMLImageElement;
  private map: number[][];
  private tileSize: number;
  private tilesetCols: number;
  public isLoaded: boolean;

  constructor(tilesetSrc: string, map: number[][], tileSize: number) {
    this.tileset = new Image();
    this.map = map;
    this.tileSize = tileSize;
    this.tilesetCols = 0;
    this.isLoaded = false;

    this.tileset.onload = () => {
      this.tilesetCols = this.tileset.width / this.tileSize;
      this.isLoaded = true;
    };
    this.tileset.onerror = () => {
      console.error('Failed to load tileset image:', tilesetSrc);
    };
    this.tileset.src = tilesetSrc;
  }

  draw(graphics: Graphics) {
    if (!this.isLoaded) return;

    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        const tileId = this.map[row][col];
        if (tileId === 0) continue; // Skip empty tiles

        const sx = (tileId - 1) % this.tilesetCols * this.tileSize;
        const sy = Math.floor((tileId - 1) / this.tilesetCols) * this.tileSize;

        graphics.drawTile(
          this.tileset,
          sx, sy, this.tileSize, this.tileSize,
          col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize
        );
      }
    }
  }
}