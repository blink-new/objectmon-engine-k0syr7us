export class GameLoop {
  private onUpdate: (deltaTime: number) => void;
  private onRender: () => void;
  private lastTime = 0;
  private isRunning = false;

  constructor(onUpdate: (deltaTime: number) => void, onRender: () => void) {
    this.onUpdate = onUpdate;
    this.onRender = onRender;
  }

  start() {
    this.isRunning = true;
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.isRunning = false;
  }

  private loop(currentTime: number) {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000; // in seconds
    this.lastTime = currentTime;

    this.onUpdate(deltaTime);
    this.onRender();

    requestAnimationFrame(this.loop.bind(this));
  }
}