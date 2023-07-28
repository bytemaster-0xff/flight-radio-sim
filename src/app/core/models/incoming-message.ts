import { environment } from "src/environments/environment";

export class IncomingMessage {
  height: number;
  width: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  ref: HTMLImageElement;
  message: string;

  constructor(message: string, height: number, width: number, dx: number, dy: number) {
    this.height = height;
    this.width = width;
    this.x = Math.random() * (environment.width - 500);
    this.y = -this.height;
    this.dx = -dx + Math.floor(Math.random() * (2 * dx + 1));
    this.dy = dy;
    this.ref = document.getElementById('ufo') as HTMLImageElement;
    this.message = message;
  }

  /**
   * Draw UFO in the HTML Canvas
   * @param context Context of the HTML Canvas
   */
  draw(context: CanvasRenderingContext2D): void {
    if (!this.ref) {
      return;
    }

    context.font = '20px serif';
    context.fillStyle = '#00ffff';
    context.fillText(this.message, this.x, this.y, 500);
  }

  /**
   * Update the position of the UFO
   * @param context Context of the HTML Canvas
   */
  update(context: CanvasRenderingContext2D): void {
    this.draw(context);

    // Reverse the direction of the UFO when hitting the horizontal ends
    if (this.x < 0 || environment.width < this.x + this.width + this.dx) {
      this.dx = -this.dx;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}
