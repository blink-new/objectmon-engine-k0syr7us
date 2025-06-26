export class Camera {
  public x: number;
  public y: number;
  private viewportWidth: number;
  private viewportHeight: number;
  private mapWidth: number;
  private mapHeight: number;

  constructor(viewportWidth: number, viewportHeight: number, mapWidth: number, mapHeight: number) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
  }

  // Update camera position to follow a target (e.g., player)
  follow(targetX: number, targetY: number, targetWidth: number, targetHeight: number) {
    this.x = targetX - this.viewportWidth / 2 + targetWidth / 2;
    this.y = targetY - this.viewportHeight / 2 + targetHeight / 2;

    // Clamp camera to map boundaries
    this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.viewportWidth));
    this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.viewportHeight));
  }
}