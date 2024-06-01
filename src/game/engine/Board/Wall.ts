import { BoardObject } from "./BoardObject";

export class Wall implements BoardObject {
  public x: number;
  public y: number;
  public readonly width = 0.32;
  public readonly height = 0.32;

  constructor(x: number, y: number) {
    this.x = x * 0.32;
    this.y = y * 0.32;
  }

  update(): void {}
}
