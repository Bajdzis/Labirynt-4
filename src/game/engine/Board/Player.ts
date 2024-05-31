import { BoardObject } from "./BoardObject";

export class Player implements BoardObject {
  public x: number;
  public y: number;
  public readonly width = 0.2;
  public readonly height = 0.2;
  public angle = 0.0;

  constructor() {
    this.x = 0;
    this.y = 0;
  }

  changePosition(x: number, y: number) {
    this.x += x;
    this.y += y;
    this.angle = Math.atan2(y, x);
  }
}
