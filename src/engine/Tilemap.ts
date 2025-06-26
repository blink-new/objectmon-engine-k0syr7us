import { Graphics } from './Graphics';

export class Tilemap {
  private tileset: HTMLImageElement;
  private map: number[][];
  private tileSize: number;
  private tilesetCols: number;

  constructor(tilesetSrc: string, map: number[][], tileSize: number) {
    this.tileset = new Image();
    this.tileset.src = tilesetSrc;
    this.map = map;
    this.tileSize = tileSize;
    this.tilesetCols = 0;

    this.tileset.onload = () => {
      this.tilesetCols = this.tileset.width / this.tileSize;
    };
  }

  draw(graphics: Graphics) {
    if (!this.tileset.complete) return;

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