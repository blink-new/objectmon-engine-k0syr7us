export class Input {
  private keys: Record<string, boolean> = {};

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  isKeyDown(key: string): boolean {
    return this.keys[key] || false;
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.keys[event.key] = true;
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.keys[event.key] = false;
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}