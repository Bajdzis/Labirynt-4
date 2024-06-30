import { BoardObject, Rectangle } from "./BoardObject";

export class Wall extends BoardObject implements Rectangle {
  public x: number;
  public y: number;
  public readonly width = 0.32;
  public readonly height = 0.32;

  constructor(x: number, y: number) {
    super();
    this.x = x * 0.32;
    this.y = y * 0.32;
  }
}
