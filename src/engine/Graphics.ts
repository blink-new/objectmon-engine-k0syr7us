export const PALETTE = ['#e0f8d0', '#88c070', '#346856', '#081820'];

export class Graphics {
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;
    this.ctx.imageSmoothingEnabled = false;
  }

  clear() {
    this.ctx.fillStyle = PALETTE[0];
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawRect(x: number, y: number, width: number, height: number, colorIndex: number) {
    this.ctx.fillStyle = PALETTE[colorIndex];
    this.ctx.fillRect(x, y, width, height);
  }

  // Add methods for drawing tiles, sprites, etc.
}