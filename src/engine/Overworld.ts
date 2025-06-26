import { Graphics } from './Graphics';
import { Input } from './Input';
import { Tilemap } from './Tilemap';
import { Sprite } from './Sprite';
import { Camera } from './Camera';
import { MapDefinition } from './MapData';

export class Overworld {
  private graphics: Graphics;
  private input: Input;
  private tilemap: Tilemap;
  private player: Sprite;
  private camera: Camera;
  private mapData: MapDefinition;
  private tileSize: number;

  constructor(
    graphics: Graphics,
    input: Input,
    tilesetDataUrl: string,
    playerDataUrl: string,
    mapData: MapDefinition,
    tileSize: number
  ) {
    this.graphics = graphics;
    this.input = input;
    this.mapData = mapData;
    this.tileSize = tileSize;

    this.tilemap = new Tilemap(tilesetDataUrl, mapData.tiles, tileSize);
    this.player = new Sprite(playerDataUrl, 80, 48, 16, 16); // Player initial position

    this.camera = new Camera(
      graphics.ctx.canvas.width,
      graphics.ctx.canvas.height,
      mapData.width * tileSize,
      mapData.height * tileSize
    );

    this.player.addAnimation('idle', [0]);
    this.player.addAnimation('walkDown', [0, 1, 2, 3]);
    this.player.addAnimation('walkUp', [4, 5, 6, 7]);
    this.player.addAnimation('walkLeft', [8, 9, 10, 11]);
    this.player.addAnimation('walkRight', [12, 13, 14, 15]);
  }

  update(deltaTime: number) {
    const speed = 50; // pixels per second
    let isMoving = false;
    const prevX = this.player.x;
    const prevY = this.player.y;

    if (this.input.isKeyDown('ArrowUp')) {
      this.player.y -= speed * deltaTime;
      this.player.setAnimation('walkUp');
      isMoving = true;
    }
    if (this.input.isKeyDown('ArrowDown')) {
      this.player.y += speed * deltaTime;
      this.player.setAnimation('walkDown');
      isMoving = true;
    }
    if (this.input.isKeyDown('ArrowLeft')) {
      this.player.x -= speed * deltaTime;
      this.player.setAnimation('walkLeft');
      isMoving = true;
    }
    if (this.input.isKeyDown('ArrowRight')) {
      this.player.x += speed * deltaTime;
      this.player.setAnimation('walkRight');
      isMoving = true;
    }

    if (!isMoving) {
      this.player.setAnimation('idle');
    }

    this.player.update(deltaTime);
    this.camera.follow(this.player.x, this.player.y, this.player.frameWidth, this.player.frameHeight);

    // Basic collision detection
    const playerTileX = Math.floor((this.player.x + this.player.frameWidth / 2) / this.tileSize);
    const playerTileY = Math.floor((this.player.y + this.player.frameHeight / 2) / this.tileSize);

    if (playerTileX < 0 || playerTileX >= this.mapData.width ||
        playerTileY < 0 || playerTileY >= this.mapData.height ||
        this.mapData.collision[playerTileY][playerTileX] === 1) {
      // Collision detected, revert to previous position
      this.player.x = prevX;
      this.player.y = prevY;
    }
  }

  draw() {
    this.graphics.clear();

    // Draw tilemap, offset by camera position
    if (this.tilemap.isLoaded) {
      this.graphics.ctx.save();
      this.graphics.ctx.translate(-this.camera.x, -this.camera.y);
      this.tilemap.draw(this.graphics);
      this.graphics.ctx.restore();
    }

    // Draw player
    if (this.player.isLoaded) {
      this.graphics.drawSprite(
        this.player.image,
        this.player.currentFrame * this.player.frameWidth, 0, this.player.frameWidth, this.player.frameHeight,
        this.player.x - this.camera.x, this.player.y - this.camera.y, this.player.frameWidth, this.player.frameHeight
      );
    }
  }

  async loadAssets() {
    const tilemapLoadedPromise = new Promise<void>(resolve => {
      this.tilemap.tileset.onload = () => {
        this.tilemap.isLoaded = true;
        resolve();
      };
    });

    const playerLoadedPromise = new Promise<void>(resolve => {
      this.player.image.onload = () => {
        this.player.isLoaded = true;
        resolve();
      };
    });

    await Promise.all([tilemapLoadedPromise, playerLoadedPromise]);
  }
}