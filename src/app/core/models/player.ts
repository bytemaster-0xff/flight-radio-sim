import { environment } from "src/environments/environment";

export class Player {
  height: number;
  width: number;
  x: number;
  y: number;
  speed: number;
  ref: HTMLImageElement;

  constructor(
    height: number,
    width: number,
    x: number,
    y: number,
    speed: number
  ) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.speed = Math.min(5, speed * 1.5);
    this.ref = document.getElementById('player') as HTMLImageElement;
  }

  /**
   * Draw Player in the HTML Canvas
   * @param context Context of the HTML Canvas
   */
  draw(context: CanvasRenderingContext2D): void {
    console.log(this.x, this.y);
    context.drawImage(this.ref, this.x, this.y, this.width, this.height);
  }

  /**
   * Update the position of the Player
   * @param context Context of the HTML Canvas
   */
  update(context: CanvasRenderingContext2D): void {
    this.draw(context);
  }
}
