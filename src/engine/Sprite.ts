import { Graphics } from './Graphics';

export class Sprite {
  private image: HTMLImageElement;
  public x: number;
  public y: number;
  private frameWidth: number;
  private frameHeight: number;
  private currentFrame: number;
  private animations: Record<string, number[]>;
  private currentAnimation: string;
  private animationTimer: number;
  private animationSpeed: number;

  constructor(spriteSrc: string, x: number, y: number, frameWidth: number, frameHeight: number) {
    this.image = new Image();
    this.image.src = spriteSrc;
    this.x = x;
    this.y = y;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.currentFrame = 0;
    this.animations = {};
    this.currentAnimation = 'idle';
    this.animationTimer = 0;
    this.animationSpeed = 0.1; // seconds per frame
  }

  addAnimation(name: string, frames: number[]) {
    this.animations[name] = frames;
  }

  setAnimation(name: string) {
    if (this.currentAnimation !== name) {
      this.currentAnimation = name;
      this.currentFrame = 0;
      this.animationTimer = 0;
    }
  }

  update(deltaTime: number) {
    this.animationTimer += deltaTime;
    if (this.animationTimer >= this.animationSpeed) {
      this.animationTimer = 0;
      const animation = this.animations[this.currentAnimation];
      if (animation) {
        this.currentFrame = (this.currentFrame + 1) % animation.length;
      }
    }
  }

  draw(graphics: Graphics) {
    if (!this.image.complete) return;

    const animation = this.animations[this.currentAnimation];
    if (!animation) return;

    const frame = animation[this.currentFrame];
    const sx = frame * this.frameWidth;
    const sy = 0;

    graphics.drawSprite(
      this.image,
      sx, sy, this.frameWidth, this.frameHeight,
      this.x, this.y, this.frameWidth, this.frameHeight
    );
  }
}