import { Rectangle } from "../../Board/BoardObject";

export function getCenterOfRectangle(rec: Rectangle) {
  return {
    x: rec.x + rec.width / 2,
    y: rec.y + rec.height / 2,
  };
}
